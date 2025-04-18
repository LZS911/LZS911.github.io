'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  addCommentByDiscussionId,
  createDiscussionBySlug,
  getCommentsByDiscussionId,
  getDiscussionBySlug,
  getGitHubOAuthURL,
  getUserInfo
} from '@/lib/github';
import Image from 'next/image';
import { format } from 'date-fns';

type Comment = {
  id: string;
  author: {
    login: string;
    avatarUrl: string;
    url: string;
  };
  content: string;
  createdAt: string;
  url: string;
  replyToId?: string;
  replies?: Comment[];
};

type CommentsProps = {
  slug: string;
};

const CommentForm = ({
  onSubmit,
  isSubmitting,
  initialContent = '',
  placeholder = '写下你的评论...',
  buttonText = '提交评论',
  userInfo
}: {
  onSubmit: (content: string) => void;
  isSubmitting: boolean;
  initialContent?: string;
  placeholder?: string;
  buttonText?: string;
  userInfo: { login: string; avatarUrl: string } | null;
}) => {
  const [content, setContent] = useState(initialContent);

  return (
    <div className="mt-2 bg-white rounded-lg p-3 shadow-sm">
      {userInfo && (
        <div className="mb-2 flex items-center">
          <Image
            src={userInfo.avatarUrl}
            alt={userInfo.login}
            className="w-8 h-8 rounded-full mr-2 border-2 border-gray-100"
            width={32}
            height={32}
          />
          <span className="font-medium text-gray-800 text-sm">
            {userInfo.login}
          </span>
        </div>
      )}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border border-gray-200 rounded-lg p-2 min-h-[80px] focus:ring-1 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
        placeholder={placeholder}
        disabled={isSubmitting}
      />
      <button
        onClick={() => {
          onSubmit(content);
          setContent('');
        }}
        disabled={isSubmitting || !content.trim()}
        className="mt-2 bg-black text-white px-4 py-1.5 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting ? '提交中...' : buttonText}
      </button>
    </div>
  );
};

const SingleComment = ({
  comment,
  onReply,
  userInfo,
  isSubmitting,
  level = 0
}: {
  comment: Comment;
  onReply: (content: string, replyToId: string) => void;
  userInfo: { login: string; avatarUrl: string } | null;
  isSubmitting: boolean;
  level?: number;
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <div
      className={`bg-white rounded-lg shadow-sm transition-all ${
        level > 0
          ? 'ml-6 mt-2 border-l-2 border-gray-100'
          : 'border border-gray-100'
      }`}
    >
      <div className="p-3">
        <div className="flex items-center mb-2">
          <Image
            src={comment.author.avatarUrl}
            alt={comment.author.login}
            className="w-8 h-8 rounded-full mr-2 border-2 border-gray-100"
            width={32}
            height={32}
          />
          <div className="flex-1 min-w-0">
            <a
              href={comment.author.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gray-900 hover:text-blue-600 transition-colors text-sm truncate block"
            >
              {comment.author.login}
            </a>
            <div className="text-xs text-gray-500">
              {format(new Date(comment.createdAt), 'yyyy-MM-dd HH:mm:ss')}
            </div>
          </div>
        </div>
        <div className="prose max-w-none mb-2 text-sm text-gray-800 leading-normal">
          {comment.content}
        </div>
        {userInfo && level === 0 && (
          <div className="mt-2 pt-2 border-t border-gray-50">
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-xs text-gray-600 hover:text-blue-600 transition-colors flex items-center cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
              {showReplyForm ? '取消回复' : '回复'}
            </button>
            {showReplyForm && (
              <CommentForm
                onSubmit={(content) => {
                  onReply(content, comment.id);
                  setShowReplyForm(false);
                }}
                isSubmitting={isSubmitting}
                placeholder={`回复 @${comment.author.login}...`}
                buttonText="提交回复"
                userInfo={userInfo}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const CommentWithReplies = ({
  comment,
  onReply,
  userInfo,
  isSubmitting
}: {
  comment: Comment;
  onReply: (content: string, replyToId: string) => void;
  userInfo: { login: string; avatarUrl: string } | null;
  isSubmitting: boolean;
}) => {
  const [showAllReplies, setShowAllReplies] = useState(false);
  const hasMoreReplies = comment.replies && comment.replies.length > 3;
  const visibleReplies = showAllReplies
    ? comment.replies
    : comment.replies?.slice(0, 3);

  return (
    <div>
      <SingleComment
        comment={comment}
        onReply={onReply}
        userInfo={userInfo}
        isSubmitting={isSubmitting}
      />
      {visibleReplies?.map((reply) => (
        <SingleComment
          key={reply.id}
          comment={reply}
          onReply={onReply}
          userInfo={userInfo}
          isSubmitting={isSubmitting}
          level={1}
        />
      ))}
      {hasMoreReplies && (
        <button
          onClick={() => setShowAllReplies(!showAllReplies)}
          className="ml-6 mt-2 text-xs text-blue-600 hover:text-blue-800 transition-colors flex items-center cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {showAllReplies ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            )}
          </svg>
          {showAllReplies
            ? '收起回复'
            : `展开其他 ${comment.replies!.length - 3} 条回复`}
        </button>
      )}
    </div>
  );
};

const Comments: React.FC<CommentsProps> = ({ slug }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    login: string;
    avatarUrl: string;
  } | null>(null);

  const getComments = useCallback(async (slug: string) => {
    const discussion = await getDiscussionBySlug(slug);

    if (!discussion) {
      return [];
    }
    return getCommentsByDiscussionId(discussion.id);
  }, []);

  const createComments = useCallback(
    async (
      slug: string,
      content: string,
      token: string,
      replyToId?: string
    ) => {
      let discussion = await getDiscussionBySlug(slug);

      if (!discussion) {
        discussion = await createDiscussionBySlug(slug);
      }

      if (!discussion) {
        throw new Error('无法获取或创建讨论');
      }

      return addCommentByDiscussionId(discussion.id, content, token, replyToId);
    },
    []
  );

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        setComments(await getComments(slug));
      } catch (err) {
        setError('获取评论失败，请稍后再试');
        console.error('Error fetching comments:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const checkUserLogin = async () => {
      const cookies = document.cookie.split('; ');
      const tokenCookie = cookies.find((row) =>
        row.startsWith('github_token=')
      );
      if (tokenCookie) {
        const token = tokenCookie.split('=')[1];
        try {
          const user = await getUserInfo(token);
          if (user) {
            setUserInfo({
              login: user.login,
              avatarUrl: user.avatar_url
            });
          } else {
            setUserInfo(null);
          }
        } catch (err) {
          console.error('Error fetching user info:', err);
          setUserInfo(null);
        }
      } else {
        setUserInfo(null);
      }
    };

    if (slug) {
      fetchComments();
      checkUserLogin();
    }
  }, [getComments, slug]);

  const handleSubmitComment = async (content: string, replyToId?: string) => {
    if (!content.trim()) return;

    try {
      setIsSubmitting(true);
      const cookies = document.cookie.split('; ');
      const tokenCookie = cookies.find((row) =>
        row.startsWith('github_token=')
      );

      if (!tokenCookie) {
        throw new Error('请先登录后再评论');
      }

      const token = tokenCookie.split('=')[1];
      const result = await createComments(slug, content, token, replyToId);

      if (!result) {
        throw new Error(result || '提交评论失败');
      }

      setComments(await getComments(slug));
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交评论失败，请稍后再试');
      console.error('Error submitting comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = () => {
    document.cookie = `redirect_url=${window.location.pathname}; path=/; max-age=300`;
    window.location.href = getGitHubOAuthURL();
  };

  const commentTree = comments.reduce((acc: Comment[], comment: Comment) => {
    if (!comment.replyToId) {
      acc.push(comment);
    } else {
      const parentComment = comments.find((c) => c.id === comment.replyToId);
      if (parentComment) {
        if (!Array.isArray(parentComment.replies)) {
          parentComment.replies = [];
        }
        parentComment.replies.push(comment);
      }
    }
    return acc;
  }, []);

  return (
    <div className="mt-8 max-w-3xl mx-auto">
      <h3 className="text-xl font-bold mb-4 text-gray-900">评论区</h3>

      {isLoading ? (
        <div className="text-center py-6">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-3 border-gray-200 border-t-blue-600"></div>
          <p className="mt-2 text-sm text-gray-600">加载评论中...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      ) : (
        <>
          {userInfo ? (
            <CommentForm
              onSubmit={(content) => handleSubmitComment(content)}
              isSubmitting={isSubmitting}
              userInfo={userInfo}
            />
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="mb-3 text-sm text-gray-700">登录后参与讨论</p>
              <button
                onClick={handleLogin}
                className="bg-black text-white px-4 py-1.5 text-sm rounded-lg transition-colors inline-flex items-center cursor-pointer"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                使用 GitHub 登录
              </button>
            </div>
          )}

          <div className="mt-4 space-y-2">
            {commentTree.length === 0 ? (
              <div className="text-center py-6 text-sm text-gray-500">
                暂无评论，来添加第一条评论吧！
              </div>
            ) : (
              commentTree.map((comment) => (
                <CommentWithReplies
                  key={comment.id}
                  comment={comment}
                  onReply={handleSubmitComment}
                  userInfo={userInfo}
                  isSubmitting={isSubmitting}
                />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Comments;
