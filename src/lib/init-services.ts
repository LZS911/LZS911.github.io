import { initializeStorage, startCleanupScheduler } from './storage';

// 初始化所有服务
export function initializeServices() {
  // 初始化文件存储
  initializeStorage();

  // 启动定时清理任务（默认每小时清理一次）
  const cleanupInterval = process.env.CLEANUP_INTERVAL
    ? parseInt(process.env.CLEANUP_INTERVAL, 10)
    : undefined;

  startCleanupScheduler(cleanupInterval);

  console.log('所有服务初始化完成');
}

// 仅在服务器端运行
if (typeof window === 'undefined') {
  console.log('初始化服务...');
  initializeServices();
}
