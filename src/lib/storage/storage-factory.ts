// storage-factory.ts
// 存储系统工厂实现

import { StorageSystem, StorageType } from './storage-interface';
import { FileSystemStorage } from './file-system-storage';
import { DatabaseStorage } from './database-storage';

// 存储系统实例（单例模式）
let storageInstance: StorageSystem | null = null;

/**
 * 获取存储系统实例
 * 根据环境变量 STORAGE_TYPE 选择存储实现
 * 'filesystem' - 文件系统存储
 * 'database' - Vercel 数据库存储
 */
export function getStorageSystem(): StorageSystem {
  // 如果已经有实例，直接返回
  if (storageInstance) {
    return storageInstance;
  }

  // 获取存储类型环境变量
  const storageType = (process.env.STORAGE_TYPE || 'filesystem').toLowerCase();
  console.log(storageType);
  if (storageType === StorageType.Database) {
    storageInstance = new DatabaseStorage();
  } else {
    storageInstance = new FileSystemStorage();
  }

  storageInstance.initialize();

  return storageInstance;
}
