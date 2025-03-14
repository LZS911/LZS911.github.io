import { NextApiRequest, NextApiResponse } from 'next';
import { getAccessToken } from '../../../../lib/github';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 获取授权码
  const { code } = req.query;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: '缺少授权码' });
  }

  try {
    // 获取访问令牌
    const token = await getAccessToken(code);
    
    if (!token) {
      return res.status(500).json({ error: '获取访问令牌失败' });
    }

    // 将令牌存储在cookie中
    // 注意：在生产环境中，应该使用更安全的方式存储令牌，如HttpOnly cookie
    res.setHeader('Set-Cookie', `github_token=${token}; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`);

    // 重定向回用户之前访问的页面
    const redirectUrl = req.cookies.redirect_url || '/';
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('GitHub OAuth回调处理错误:', error);
    res.status(500).json({ error: '授权处理失败' });
  }
}