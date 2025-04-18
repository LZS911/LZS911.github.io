import { cookies } from 'next/headers';
import { getUserInfo } from './github';

export async function isAuthenticated() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('github_token');

    if (!token) {
      return false;
    }

    const userInfo = await getUserInfo(token.value);

    if (!userInfo) {
      return false;
    }

    // 检查用户是否为仓库所有者
    return userInfo.login === process.env.NEXT_PUBLIC_REPO_OWNER;
  } catch (error) {
    console.error('权限验证失败:', error);
    return false;
  }
}
