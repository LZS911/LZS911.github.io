import { NextRequest, NextResponse } from 'next/server';
import { saveTemporaryImage, initializeStorage } from '@/lib/file-storage';

// 确保临时存储目录存在
initializeStorage();

// 处理图片上传请求
export async function POST(request: NextRequest) {
  try {
    // 获取表单数据
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: '没有提供图片文件' }, { status: 400 });
    }

    // 读取文件内容
    const buffer = await file.arrayBuffer();
    const content = Buffer.from(buffer);

    // 生成唯一ID
    const imageId = `image-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // 存储图片文件
    const fileName = await saveTemporaryImage(imageId, content);

    // 返回图片ID和文件名
    return NextResponse.json({
      imageId,
      fileName,
      url: `/api/images/${imageId}`
    });
  } catch (error) {
    console.error('上传图片失败:', error);
    return NextResponse.json({ error: '上传图片失败' }, { status: 500 });
  }
}
