// storage-interface.ts
// 存储系统抽象接口

// 预览内容返回类型
export interface PreviewContent {
  html: string;
  expired: boolean;
}

// 图片内容返回类型
export interface ImageContent {
  content: Buffer | null;
  contentType: string;
  expired: boolean;
}

// 存储系统接口定义
export interface StorageSystem {
  // 初始化存储
  initialize(): void;

  // 启动定时清理
  startCleanupScheduler(intervalMs?: number): void;

  // 停止定时清理
  stopCleanupScheduler(): void;

  // 获取清理任务状态
  getCleanupSchedulerStatus(): { active: boolean; intervalMs: number | null };

  // 保存预览内容
  savePreviewContent(
    previewId: string,
    html: string,
    expireSeconds?: number
  ): Promise<void>;

  // 获取预览内容
  getPreviewContent(previewId: string): Promise<PreviewContent>;

  // 保存临时图片
  saveTemporaryImage(
    imageId: string,
    content: Buffer,
    expireSeconds?: number
  ): Promise<string>;

  // 获取临时图片
  getTemporaryImage(imageId: string): Promise<ImageContent>;

  // 清理过期文件
  cleanupExpiredFiles(): Promise<void>;
}

// 存储系统类型
export enum StorageType {
  FileSystem = 'filesystem',
  Database = 'database'
}

// 工厂函数类型
export type StorageFactory = () => StorageSystem;
