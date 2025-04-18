import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAuthenticated } from './lib/auth';

export async function middleware(request: NextRequest) {
  const authenticated = await isAuthenticated();

  // 如果没有权限，重定向到首页
  if (!authenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 如果有权限，继续访问
  return NextResponse.next();
}

// 配置中间件只在 /practice 路径下生效
export const config = {
  matcher: '/practice'
};
