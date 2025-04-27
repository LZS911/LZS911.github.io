import { NextRequest, NextResponse } from 'next/server';
import { getPreviewContent } from '@/lib/file-storage';

// 处理特定预览ID的获取请求
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ previewId: string }> }
) {
  try {
    const { previewId } = await params;

    if (!previewId) {
      return new NextResponse('缺少预览ID', {
        status: 400,
        headers: {
          'Content-Type': 'text/html; charset=utf-8'
        }
      });
    }

    // 从文件系统获取预览内容
    const { html, expired } = await getPreviewContent(previewId);

    if (expired || !html) {
      return new NextResponse('预览不存在或已过期', {
        status: 404,
        headers: {
          'Content-Type': 'text/html; charset=utf-8'
        }
      });
    }

    // 返回HTML内容
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('获取预览失败:', error);
    return new NextResponse('获取预览失败', {
      status: 500,
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    });
  }
}
