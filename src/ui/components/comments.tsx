'use client';

import { useEffect, useState } from 'react';
import { getGitHubOAuthURL } from '@/lib/github';
import Image from 'next/image';

type Comment = {
  id: string;
  author: {
    login: string;
    avatarUrl: string;
    url: string;
  };
  bodyHTML: string;
  createdAt: string;
  url: string;
};

type CommentsProps = {
  slug: string;
};

const Comments: React.FC<CommentsProps> = ({ slug }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    login: string;
    avatarUrl: string;
  } | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/comments/${slug}`);
        if (!response.ok) {
          throw new Error('获取评论失败');
        }
        const data = await response.json();
        setComments(data.comments || []);
      } catch (err) {
        setError('获取评论失败，请稍后再试');
        console.error('Error fetching comments:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // 检查用户是否已登录
    const checkUserLogin = async () => {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('github_token='));
      if (token) {
        try {
          setUserInfo(null);
        } catch (err) {
          console.error('Error fetching user info:', err);
        }
      }
    };

    if (slug) {
      fetchComments();
      checkUserLogin();
    }
  }, [slug]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/comments/${slug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: newComment })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '提交评论失败');
      }

      // 评论成功后刷新评论列表
      const commentsResponse = await fetch(`/api/comments/${slug}`);
      const commentsData = await commentsResponse.json();
      setComments(commentsData.comments || []);
      setNewComment('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交评论失败，请稍后再试');
      console.error('Error submitting comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = () => {
    // 保存当前URL，以便登录后重定向回来
    document.cookie = `redirect_url=${window.location.pathname}; path=/; max-age=300`;
    // 重定向到GitHub OAuth登录页面
    window.location.href = getGitHubOAuthURL();
  };

  return (
    <div className="mt-10 max-w-3xl">
      <h3 className="text-2xl font-bold mb-4">评论</h3>

      {isLoading ? (
        <p>加载评论中...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {comments.length === 0 ? (
            <p className="mb-4">暂无评论，来添加第一条评论吧！</p>
          ) : (
            <div className="space-y-4 mb-6">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border border-accent-2 p-4 rounded-md"
                >
                  <div className="flex items-center mb-2">
                    <Image
                      src={comment.author.avatarUrl}
                      alt={comment.author.login}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <a
                      href={comment.author.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-black hover:underline"
                    >
                      {comment.author.login}
                    </a>
                    <span className="text-sm text-gray-500 ml-2">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{ __html: comment.bodyHTML }}
                  />
                </div>
              ))}
            </div>
          )}

          {userInfo ? (
            <form onSubmit={handleSubmitComment} className="mt-6">
              <div className="mb-2 flex items-center">
                <Image
                  src={userInfo.avatarUrl}
                  alt={userInfo.login}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="font-medium">{userInfo.login}</span>
              </div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full border border-accent-2 rounded-md p-2 min-h-[100px]"
                placeholder="写下你的评论..."
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="mt-2 bg-black text-white px-4 py-2 rounded-md hover:bg-opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? '提交中...' : '提交评论'}
              </button>
            </form>
          ) : (
            <div className="mt-6 border border-accent-2 p-4 rounded-md text-center">
              <p className="mb-2">登录后参与讨论</p>
              <button
                onClick={handleLogin}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-opacity-90"
              >
                使用 GitHub 登录
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Comments;
