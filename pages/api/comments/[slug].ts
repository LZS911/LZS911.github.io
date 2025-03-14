import { NextApiRequest, NextApiResponse } from 'next';
import { getOrCreateDiscussion, getComments, addComment } from '../../../lib/github';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;
  
  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: '缺少文章标识符' });
  }

  // 获取评论
  if (req.method === 'GET') {
    try {
      // 获取或创建对应的Discussion
      const discussion = await getOrCreateDiscussion(slug, `Comments for: ${slug}`);
      
      if (!discussion) {
        return res.status(500).json({ error: '无法获取或创建讨论' });
      }
      
      // 获取评论
      const comments = await getComments(discussion.id);
      return res.status(200).json({ comments });
    } catch (error) {
      console.error('获取评论错误:', error);
      return res.status(500).json({ error: '获取评论失败' });
    }
  }
  
  // 添加评论
  if (req.method === 'POST') {
    const { content } = req.body;
    const token = req.cookies.github_token;
    
    if (!content) {
      return res.status(400).json({ error: '评论内容不能为空' });
    }
    
    if (!token) {
      return res.status(401).json({ error: '未授权，请先登录' });
    }
    
    try {
      // 获取或创建对应的Discussion
      const discussion = await getOrCreateDiscussion(slug, `Comments for: ${slug}`);
      
      if (!discussion) {
        return res.status(500).json({ error: '无法获取或创建讨论' });
      }
      
      // 添加评论
      const result = await addComment(discussion.id, content, token);
      return res.status(201).json({ success: true, comment: result });
    } catch (error) {
      console.error('添加评论错误:', error);
      return res.status(500).json({ error: '添加评论失败' });
    }
  }
  
  // 不支持的方法
  return res.status(405).json({ error: '方法不允许' });
}