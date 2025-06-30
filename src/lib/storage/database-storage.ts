import {
  StorageSystem,
  PreviewContent,
  ImageContent
} from './storage-interface';
import { prisma } from '../prisma';
import { PrismaClient, Prisma } from '@prisma/client';

export class DatabaseStorage implements StorageSystem {
  private cleanupInterval: NodeJS.Timeout | null = null;
  private DEFAULT_CLEANUP_INTERVAL: number;
  private db: PrismaClient;

  constructor() {
    this.DEFAULT_CLEANUP_INTERVAL = process.env.CLEANUP_INTERVAL
      ? Number(process.env.CLEANUP_INTERVAL)
      : 24 * 3600000; // 默认每24小时清理一次

    // 使用单例模式的 Prisma 客户端
    this.db = prisma;
  }

  // 初始化数据库连接
  async initialize(): Promise<void> {
    try {
      // 验证数据库连接
      await this.db.$connect();
    } catch (error) {
      console.error('数据库连接初始化失败:', error);
      throw new Error('数据库连接初始化失败');
    }
  }

  // 启动定时清理任务
  startCleanupScheduler(
    intervalMs: number = this.DEFAULT_CLEANUP_INTERVAL
  ): void {
    // 如果已经有一个定时器在运行，先停止它
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    // 启动新的定时清理任务
    this.cleanupInterval = setInterval(async () => {
      console.log(`[${new Date().toISOString()}] 执行数据库定时清理任务...`);
      try {
        await this.cleanupExpiredFiles();
        console.log(`[${new Date().toISOString()}] 数据库定时清理任务完成`);
      } catch (error) {
        console.error(
          `[${new Date().toISOString()}] 数据库定时清理任务失败:`,
          error
        );
      }
    }, intervalMs);

    console.log(
      `[${new Date().toISOString()}] 已启动数据库定时清理任务，间隔: ${intervalMs}毫秒`
    );
  }

  stopCleanupScheduler(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      console.log(`[${new Date().toISOString()}] 已停止数据库定时清理任务`);
    }
  }

  getCleanupSchedulerStatus(): { active: boolean; intervalMs: number | null } {
    return {
      active: this.cleanupInterval !== null,
      intervalMs: this.cleanupInterval ? this.DEFAULT_CLEANUP_INTERVAL : null
    };
  }

  async savePreviewContent(
    previewId: string,
    html: string,
    expireSeconds: number = 7200
  ): Promise<void> {
    try {
      // 计算过期时间
      const now = Date.now();
      const expiresAt = now + expireSeconds * 1000;

      console.log(`准备保存HTML内容, 长度: ${html.length}, ID: ${previewId}`);
      // 确保HTML内容是字符串
      if (typeof html !== 'string') {
        console.warn('HTML内容不是字符串类型，进行转换');
        html = String(html);
      }

      // 创建内容缓冲区
      const contentBuffer = Buffer.from(html, 'utf-8');
      console.log(`转换后Buffer长度: ${contentBuffer.length}`);

      // 使用 Prisma 事务保证一致性
      await this.db.$transaction(async (tx: Prisma.TransactionClient) => {
        // 先尝试删除已存在的记录（如果有）
        await tx.storageContent.deleteMany({
          where: { id: previewId }
        });
        await tx.storageMetadata.deleteMany({
          where: { id: previewId }
        });

        // 创建新的元数据
        await tx.storageMetadata.create({
          data: {
            id: previewId,
            type: 'preview',
            timestamp: BigInt(now),
            expiresAt: BigInt(expiresAt),
            contentType: 'text/html; charset=utf-8', // 明确指定内容类型和编码
            content: {
              create: {
                content: contentBuffer
              }
            }
          }
        });
      });

      console.log(`预览内容已保存到数据库，ID: ${previewId}`);
    } catch (error) {
      console.error('保存预览内容到数据库失败:', error);
      throw new Error('保存预览内容到数据库失败');
    }
  }

  async getPreviewContent(previewId: string): Promise<PreviewContent> {
    try {
      console.log(`尝试获取预览内容，ID: ${previewId}`);
      const metadata = await this.db.storageMetadata.findUnique({
        where: {
          id: previewId,
          type: 'preview'
        },
        include: {
          content: true
        }
      });

      if (!metadata || !metadata.content) {
        console.log(`未找到预览内容，ID: ${previewId}`);
        return { html: '', expired: true };
      }

      // 检查是否过期
      const now = Date.now();
      if (Number(metadata.expiresAt) < now) {
        console.log(`预览内容已过期，ID: ${previewId}`);
        // 已过期，删除内容
        await this.db.$transaction([
          this.db.storageContent.delete({ where: { id: previewId } }),
          this.db.storageMetadata.delete({ where: { id: previewId } })
        ]);
        return { html: '', expired: true };
      }

      // 检查content.content是否存在且有效
      if (!metadata.content.content) {
        console.error('内容缓冲区为空');
        return { html: '', expired: false };
      }

      const contentBuffer = metadata.content.content;

      // 使用更健壮的转换方法
      let html = '';

      // 如果是Buffer或类Buffer对象
      if (Buffer.isBuffer(contentBuffer)) {
        html = contentBuffer.toString('utf-8');
      }
      // 如果是Uint8Array或其他类型的ArrayBuffer
      else if (contentBuffer instanceof Uint8Array) {
        html = Buffer.from(contentBuffer).toString('utf-8');
      }
      // 如果是字符串（一般不会发生，但为了健壮性）
      else if (typeof contentBuffer === 'string') {
        html = contentBuffer;
      }
      // 其他情况
      else {
        console.warn('未知的内容格式，尝试转换为字符串');
        try {
          html = String(contentBuffer);
        } catch (e) {
          console.error('无法转换内容为字符串:', e);
          return { html: '', expired: false };
        }
      }

      // 验证内容是否是有效HTML
      if (!html || html.trim() === '') {
        console.warn('HTML内容为空');
      }

      return { html, expired: false };
    } catch (error) {
      console.error('从数据库获取预览内容失败:', error);
      return { html: '', expired: true };
    }
  }

  async saveTemporaryImage(
    imageId: string,
    content: Buffer,
    expireSeconds: number = 7200
  ): Promise<string> {
    try {
      // 确定图片类型
      const imageExt = this.determineImageExtension(content);

      // 计算过期时间
      const now = Date.now();
      const expiresAt = now + expireSeconds * 1000;

      // 使用 Prisma 事务保证一致性
      await this.db.$transaction(async (tx: Prisma.TransactionClient) => {
        // 先尝试删除已存在的记录（如果有）
        await tx.storageContent.deleteMany({
          where: { id: imageId }
        });
        await tx.storageMetadata.deleteMany({
          where: { id: imageId }
        });

        // 创建新的元数据和内容
        await tx.storageMetadata.create({
          data: {
            id: imageId,
            type: 'image',
            timestamp: BigInt(now),
            expiresAt: BigInt(expiresAt),
            contentType: this.getContentTypeFromExtension(imageExt),
            extension: imageExt,
            originalName: imageId,
            content: {
              create: {
                content: content
              }
            }
          }
        });
      });

      console.log(`图片已保存到数据库，ID: ${imageId}, 扩展名: ${imageExt}`);
      return `${imageId}.${imageExt}`;
    } catch (error) {
      console.error('保存图片到数据库失败:', error);
      throw new Error('保存图片到数据库失败');
    }
  }

  async getTemporaryImage(imageId: string): Promise<ImageContent> {
    try {
      // 清理imageId，移除可能的扩展名
      const cleanImageId = imageId.split('.')[0];

      // 查询元数据和关联的内容
      const metadata = await this.db.storageMetadata.findFirst({
        where: {
          id: cleanImageId,
          type: 'image'
        },
        include: {
          content: true
        }
      });

      if (!metadata || !metadata.content) {
        return { content: null, contentType: '', expired: true };
      }

      // 检查是否过期
      const now = Date.now();
      if (Number(metadata.expiresAt) < now) {
        // 已过期，删除内容
        await this.db.$transaction([
          this.db.storageContent.delete({ where: { id: metadata.id } }),
          this.db.storageMetadata.delete({ where: { id: metadata.id } })
        ]);
        return { content: null, contentType: '', expired: true };
      }

      return {
        content: metadata.content.content,
        contentType: metadata.contentType || 'application/octet-stream',
        expired: false
      };
    } catch (error) {
      console.error('从数据库获取图片失败:', error);
      return { content: null, contentType: '', expired: true };
    }
  }

  async cleanupExpiredFiles(): Promise<void> {
    try {
      const now = Date.now();

      // 查询所有过期的记录
      const expiredRecords = await this.db.storageMetadata.findMany({
        where: {
          expiresAt: {
            lt: BigInt(now)
          }
        },
        select: {
          id: true
        }
      });

      if (expiredRecords.length === 0) {
        console.log('没有过期记录需要清理');
        return;
      }

      // 提取所有过期记录的ID
      const expiredIds = expiredRecords.map(
        (record: { id: string }) => record.id
      );

      await this.db.$transaction([
        this.db.storageMetadata.deleteMany({
          where: {
            id: {
              in: expiredIds
            }
          }
        })
      ]);

      console.log(`已清理 ${expiredIds.length} 条过期记录`);
    } catch (error) {
      console.error('清理数据库过期记录失败:', error);
    }
  }

  private determineImageExtension(buffer: Buffer): string {
    // 检查文件签名（魔数）
    if (buffer.length < 4) return 'bin';

    // JPEG: 0xFF 0xD8 0xFF
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      return 'jpg';
    }

    // PNG: 0x89 0x50 0x4E 0x47
    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    ) {
      return 'png';
    }

    // GIF: "GIF8"
    if (
      buffer[0] === 0x47 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x38
    ) {
      return 'gif';
    }

    // 如果无法识别，默认为二进制
    return 'bin';
  }

  // 辅助函数：根据扩展名获取内容类型
  private getContentTypeFromExtension(extension: string): string {
    const contentTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      svg: 'image/svg+xml',
      webp: 'image/webp',
      ico: 'image/x-icon',
      bin: 'application/octet-stream'
    };

    return contentTypes[extension.toLowerCase()] || 'application/octet-stream';
  }
}
