import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';
import {
  StorageSystem,
  PreviewContent,
  ImageContent
} from './storage-interface';

export class FileSystemStorage implements StorageSystem {
  // 临时文件存储的根目录
  private TEMP_DIR: string;
  private PREVIEWS_DIR: string;
  private IMAGES_DIR: string;

  // 定时任务调度器
  private cleanupInterval: NodeJS.Timeout | null = null;
  private DEFAULT_CLEANUP_INTERVAL: number;

  constructor() {
    this.TEMP_DIR = path.join(process.cwd(), 'temp');
    this.PREVIEWS_DIR = path.join(this.TEMP_DIR, 'previews');
    this.IMAGES_DIR = path.join(this.TEMP_DIR, 'images');
    this.DEFAULT_CLEANUP_INTERVAL = process.env.CLEANUP_INTERVAL
      ? Number(process.env.CLEANUP_INTERVAL)
      : 24 * 3600000; // 默认每24小时清理一次
  }

  // 确保目录存在
  private ensureDirectoryExists(directory: string) {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  }

  // 初始化存储目录
  initialize(): void {
    this.ensureDirectoryExists(this.PREVIEWS_DIR);
    this.ensureDirectoryExists(this.IMAGES_DIR);
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
      console.log(`[${new Date().toISOString()}] 执行定时清理任务...`);
      try {
        await this.cleanupExpiredFiles();
        console.log(`[${new Date().toISOString()}] 定时清理任务完成`);
      } catch (error) {
        console.error(`[${new Date().toISOString()}] 定时清理任务失败:`, error);
      }
    }, intervalMs);

    console.log(
      `[${new Date().toISOString()}] 已启动定时清理任务，间隔: ${intervalMs}毫秒`
    );
  }

  // 停止定时清理任务
  stopCleanupScheduler(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      console.log(`[${new Date().toISOString()}] 已停止定时清理任务`);
    }
  }

  // 获取定时清理任务状态
  getCleanupSchedulerStatus(): { active: boolean; intervalMs: number | null } {
    return {
      active: this.cleanupInterval !== null,
      intervalMs: this.cleanupInterval ? this.DEFAULT_CLEANUP_INTERVAL : null
    };
  }

  // 预览内容存储
  async savePreviewContent(
    previewId: string,
    html: string,
    expireSeconds: number = 7200
  ): Promise<void> {
    this.ensureDirectoryExists(this.PREVIEWS_DIR);

    const previewPath = path.join(this.PREVIEWS_DIR, `${previewId}.html`);
    const metadataPath = path.join(this.PREVIEWS_DIR, `${previewId}.meta.json`);

    // 计算过期时间
    const now = Date.now();
    const expiresAt = now + expireSeconds * 1000;

    // 创建元数据
    const metadata = {
      timestamp: now,
      expiresAt: expiresAt
    };

    // 写入预览内容和元数据
    await fsPromises.writeFile(previewPath, html, 'utf-8');
    await fsPromises.writeFile(metadataPath, JSON.stringify(metadata), 'utf-8');
  }

  // 读取预览内容
  async getPreviewContent(previewId: string): Promise<PreviewContent> {
    const previewPath = path.join(this.PREVIEWS_DIR, `${previewId}.html`);
    const metadataPath = path.join(this.PREVIEWS_DIR, `${previewId}.meta.json`);

    try {
      // 检查文件是否存在
      if (!fs.existsSync(previewPath) || !fs.existsSync(metadataPath)) {
        return { html: '', expired: true };
      }

      // 读取元数据
      const metadataString = await fsPromises.readFile(metadataPath, 'utf-8');
      const metadata = JSON.parse(metadataString);

      // 检查是否过期
      const now = Date.now();
      if (metadata.expiresAt < now) {
        // 文件过期，尝试删除
        try {
          await fsPromises.unlink(previewPath);
          await fsPromises.unlink(metadataPath);
        } catch (error) {
          console.error('删除过期预览文件失败:', error);
        }
        return { html: '', expired: true };
      }

      // 读取HTML内容
      const html = await fsPromises.readFile(previewPath, 'utf-8');
      return { html, expired: false };
    } catch (error) {
      console.error('读取预览内容失败:', error);
      return { html: '', expired: true };
    }
  }

  // 临时图片存储
  async saveTemporaryImage(
    imageId: string,
    content: Buffer,
    expireSeconds: number = 7200
  ): Promise<string> {
    this.ensureDirectoryExists(this.IMAGES_DIR);

    // 确定扩展名
    const imageExt = this.determineImageExtension(content);
    const imagePath = path.join(this.IMAGES_DIR, `${imageId}.${imageExt}`);
    const metadataPath = path.join(this.IMAGES_DIR, `${imageId}.meta.json`);

    // 计算过期时间
    const now = Date.now();
    const expiresAt = now + expireSeconds * 1000;

    // 创建元数据
    const metadata = {
      timestamp: now,
      expiresAt: expiresAt,
      originalName: imageId,
      extension: imageExt
    };

    // 写入图片内容和元数据
    await fsPromises.writeFile(imagePath, content);
    await fsPromises.writeFile(metadataPath, JSON.stringify(metadata), 'utf-8');

    return `${imageId}.${imageExt}`;
  }

  // 读取临时图片
  async getTemporaryImage(imageId: string): Promise<ImageContent> {
    // 确保目录存在
    this.ensureDirectoryExists(this.IMAGES_DIR);

    try {
      // 尝试查找图片文件
      const allFiles = fs.readdirSync(this.IMAGES_DIR);

      // 查找包含imageId的图片文件
      const imageFiles = allFiles.filter(
        (file) => file.startsWith(imageId) && !file.endsWith('.meta.json')
      );

      if (imageFiles.length === 0) {
        console.log(`未找到图片文件，ID: ${imageId}`);
        return { content: null, contentType: '', expired: true };
      }

      const imagePath = path.join(this.IMAGES_DIR, imageFiles[0]);
      const metadataPath = path.join(
        this.IMAGES_DIR,
        `${imageFiles[0].split('.')[0]}.meta.json`
      );

      // 检查元数据是否存在
      if (!fs.existsSync(metadataPath)) {
        console.log(`元数据文件不存在: ${metadataPath}`);
        return { content: null, contentType: '', expired: true };
      }

      // 读取元数据
      const metadataString = await fsPromises.readFile(metadataPath, 'utf-8');
      const metadata = JSON.parse(metadataString);

      // 检查是否过期
      const now = Date.now();
      if (metadata.expiresAt < now) {
        // 图片过期，尝试删除
        try {
          await fsPromises.unlink(imagePath);
          await fsPromises.unlink(metadataPath);
          console.log(`删除过期图片: ${imagePath}`);
        } catch (error) {
          console.error('删除过期图片文件失败:', error);
        }
        return { content: null, contentType: '', expired: true };
      }

      // 检查图片文件是否存在
      if (!fs.existsSync(imagePath)) {
        console.log(`图片文件不存在: ${imagePath}`);
        return { content: null, contentType: '', expired: true };
      }

      // 读取图片内容
      const content = await fsPromises.readFile(imagePath);
      const contentType = this.getContentTypeFromExtension(metadata.extension);

      console.log(
        `成功获取图片: ${imagePath}, 内容类型: ${contentType}, 大小: ${content.length} 字节`
      );

      return { content, contentType, expired: false };
    } catch (error) {
      console.error('读取临时图片失败:', error);
      return { content: null, contentType: '', expired: true };
    }
  }

  // 清理过期文件
  async cleanupExpiredFiles(): Promise<void> {
    try {
      Promise.all([
        this.cleanupDirectory(this.PREVIEWS_DIR),
        this.cleanupDirectory(this.IMAGES_DIR)
      ]);
    } catch (error) {
      console.error('清理过期文件失败:', error);
    }
  }

  // 清理指定目录中的过期文件
  private async cleanupDirectory(directory: string): Promise<void> {
    if (!fs.existsSync(directory)) {
      return;
    }

    const now = Date.now();
    const files = await fsPromises.readdir(directory);

    // 查找所有元数据文件
    const metaFiles = files.filter((file) => file.endsWith('.meta.json'));

    for (const metaFile of metaFiles) {
      try {
        const metaPath = path.join(directory, metaFile);
        const metaContent = await fsPromises.readFile(metaPath, 'utf-8');
        const metadata = JSON.parse(metaContent);

        if (metadata.expiresAt < now) {
          // 文件已过期，删除元数据文件
          await fsPromises.unlink(metaPath);

          // 删除关联的内容文件
          const baseFileName = metaFile.replace('.meta.json', '');
          const contentFiles = files.filter(
            (file) =>
              file.startsWith(baseFileName) && !file.endsWith('.meta.json')
          );

          for (const contentFile of contentFiles) {
            const contentPath = path.join(directory, contentFile);
            await fsPromises.unlink(contentPath);
          }
        }
      } catch (error) {
        console.error(`处理文件 ${metaFile} 时出错:`, error);
      }
    }
  }

  // 辅助函数：根据图片内容确定文件扩展名
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
