import { NextRequest, NextResponse } from 'next/server';
import { getTemporaryImage } from '@/lib/file-storage';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  try {
    const { imageId } = await params;

    if (!imageId) {
      return new NextResponse('未找到图片ID', { status: 400 });
    }

    // 移除扩展名，仅保留ID部分
    const cleanImageId = imageId.split('.')[0];

    console.log(`尝试获取图片，ID: ${cleanImageId}`);

    // 获取图片内容
    const { content, contentType, expired } =
      await getTemporaryImage(cleanImageId);

    if (expired || !content) {
      return new NextResponse('图片不存在或已过期', { status: 404 });
    }

    // 返回图片内容
    return new NextResponse(content, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('获取图片失败:', error);
    return new NextResponse('获取图片失败', { status: 500 });
  }
}
