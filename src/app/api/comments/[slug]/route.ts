import { NextResponse } from 'next/server';
import { getOrCreateDiscussion, getComments, addComment } from '@/lib/github';
import { cookies } from 'next/headers';

// GET 方法处理获取评论请求
export async function GET(
  request: Request,
  {
    params
  }: {
    params: Promise<{ slug: string }>;
  }
) {
  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ error: '缺少文章标识符' }, { status: 400 });
  }

  try {
    // 从路径获取文章标题
    const url = new URL(request.url);
    const title = url.searchParams.get('title') || `Comments for: ${slug}`;

    // 获取或创建对应的Discussion
    const discussion = await getOrCreateDiscussion(slug, title);

    if (!discussion) {
      return NextResponse.json(
        { error: '无法获取或创建讨论' },
        { status: 500 }
      );
    }

    // 获取评论
    const comments = await getComments(discussion.id);
    return NextResponse.json({ comments });
  } catch (error) {
    console.error('获取评论错误:', error);
    return NextResponse.json({ error: '获取评论失败' }, { status: 500 });
  }
}

// POST 方法处理添加评论请求
export async function POST(
  request: Request,
  {
    params
  }: {
    params: Promise<{ slug: string }>;
  }
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json({ error: '缺少文章标识符' }, { status: 400 });
  }

  try {
    // 获取请求体
    const body = await request.json();
    const { content, title } = body;

    // 获取cookie中的token
    const cookieStore = await cookies();
    const token = cookieStore.get('github_token')?.value;

    if (!content) {
      return NextResponse.json({ error: '评论内容不能为空' }, { status: 400 });
    }

    if (!token) {
      return NextResponse.json({ error: '未授权，请先登录' }, { status: 401 });
    }

    // 获取或创建对应的Discussion
    const discussion = await getOrCreateDiscussion(
      slug,
      title || `Comments for: ${slug}`
    );

    if (!discussion) {
      return NextResponse.json(
        { error: '无法获取或创建讨论' },
        { status: 500 }
      );
    }

    // 添加评论
    const result = await addComment(discussion.id, content, token);
    return NextResponse.json(
      { success: true, comment: result },
      { status: 201 }
    );
  } catch (error) {
    console.error('添加评论错误:', error);
    return NextResponse.json({ error: '添加评论失败' }, { status: 500 });
  }
}
