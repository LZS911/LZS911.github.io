import { NextRequest, NextResponse } from 'next/server';
import {
  cleanupExpiredFiles,
  startCleanupScheduler,
  stopCleanupScheduler,
  getCleanupSchedulerStatus
} from '@/lib/file-storage';

// 验证API密钥
function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.nextUrl.searchParams.get('key');
  return apiKey === process.env.CLEANUP_API_KEY;
}

// 清理过期文件的API路由
export async function GET(request: NextRequest) {
  try {
    // 检查请求是否携带有效的密钥
    if (!validateApiKey(request)) {
      return NextResponse.json({ error: '无效的API密钥' }, { status: 401 });
    }

    // 获取操作类型
    const operation = request.nextUrl.searchParams.get('operation') || 'manual';

    switch (operation) {
      case 'manual':
        // 手动执行清理
        await cleanupExpiredFiles();
        return NextResponse.json({
          success: true,
          message: '临时文件清理完成'
        });

      case 'start':
        // 启动定时清理任务
        const intervalStr = request.nextUrl.searchParams.get('interval');
        const interval = intervalStr ? parseInt(intervalStr, 10) : undefined;
        startCleanupScheduler(interval);
        return NextResponse.json({
          success: true,
          message: `定时清理任务已启动，间隔: ${interval || '默认'}毫秒`
        });

      case 'stop':
        // 停止定时清理任务
        stopCleanupScheduler();
        return NextResponse.json({
          success: true,
          message: '定时清理任务已停止'
        });

      case 'status':
        // 获取定时清理任务状态
        const status = getCleanupSchedulerStatus();
        return NextResponse.json({
          success: true,
          active: status.active,
          interval: status.intervalMs,
          message: status.active ? '定时清理任务正在运行' : '定时清理任务未运行'
        });

      default:
        return NextResponse.json({ error: '无效的操作类型' }, { status: 400 });
    }
  } catch (error) {
    console.error('清理操作失败:', error);
    return NextResponse.json({ error: '清理操作失败' }, { status: 500 });
  }
}
