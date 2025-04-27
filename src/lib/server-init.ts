import { initializeStorage } from './file-storage';

// 应用服务端初始化函数
export function initializeServer() {
  console.log('服务器初始化...');

  // 确保临时存储目录存在
  initializeStorage();

  console.log('服务器初始化完成');
}

// 在模块导入时自动执行初始化
initializeServer();
