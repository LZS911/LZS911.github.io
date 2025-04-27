import { NextRequest, NextResponse } from 'next/server';
import { savePreviewContent, initializeStorage } from '@/lib/file-storage';

// 确保临时存储目录存在
initializeStorage();

// POST 请求处理 - 创建新的预览
export async function POST(request: NextRequest) {
  try {
    // 获取请求体
    const data = await request.json();

    if (!data.html) {
      return NextResponse.json({ error: '预览内容不能为空' }, { status: 400 });
    }

    // 生成唯一ID
    const previewId = `preview-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // 保存预览内容到文件
    await savePreviewContent(previewId, data.html);

    // 返回预览ID
    return NextResponse.json({ previewId });
  } catch (error) {
    console.error('创建预览失败:', error);
    return NextResponse.json({ error: '创建预览失败' }, { status: 500 });
  }
}
