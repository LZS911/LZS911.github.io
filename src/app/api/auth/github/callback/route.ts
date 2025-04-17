import { NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/github';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  // 从 URL 获取授权码
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: '缺少授权码' }, { status: 400 });
  }

  try {
    // 获取访问令牌
    const token = await getAccessToken(code);

    if (!token) {
      return NextResponse.json({ error: '获取访问令牌失败' }, { status: 500 });
    }

    // 获取 cookie 对象
    const cookieStore = await cookies();

    // 将令牌存储在cookie中
    cookieStore.set('github_token', token, {
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7天
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production'
    });

    // 重定向回用户之前访问的页面
    const redirectUrl = cookieStore.get('redirect_url')?.value || '/';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  } catch (error) {
    console.error('GitHub OAuth回调处理错误:', error);
    return NextResponse.json({ error: '授权处理失败' }, { status: 500 });
  }
}
