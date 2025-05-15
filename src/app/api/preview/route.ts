import { NextRequest, NextResponse } from 'next/server';
import { savePreviewContent } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.html) {
      return NextResponse.json({ error: '预览内容不能为空' }, { status: 400 });
    }

    const previewId = `preview-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    await savePreviewContent(previewId, data.html);

    return NextResponse.json({ previewId });
  } catch (error) {
    console.error('创建预览失败:', error);
    return NextResponse.json({ error: '创建预览失败' }, { status: 500 });
  }
}
