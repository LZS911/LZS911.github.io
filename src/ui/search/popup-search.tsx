'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import DateFormatter from '@/ui/article/date-formatter';
import { Items } from '@/types/post';

interface PopupSearchProps {
  onComplete?: () => void;
}

export default function PopupSearch({ onComplete }: PopupSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Items[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        // 确保点击的是遮罩层，而不是内部元素
        (event.target as Element).classList.contains('popup-overlay')
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // 监听ESC键关闭搜索框
  useEffect(() => {
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);

  // 处理搜索
  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const params = new URLSearchParams({ q: query.trim() });
        const response = await fetch(`/api/search?${params.toString()}`);

        if (!response.ok) {
          throw new Error('搜索请求失败');
        }

        const data = await response.json();
        setResults(data.posts);
      } catch (err) {
        console.error('搜索错误:', err);
        setError('搜索时发生错误，请稍后再试');
      } finally {
        setLoading(false);
      }
    };

    // 使用防抖，避免频繁请求
    const debounceTimer = setTimeout(() => {
      if (isOpen) {
        fetchResults();
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, isOpen]);

  // 处理键盘导航
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && results.length > 0) {
      // 导航到第一个结果
      navigateToResult(results[0].slug as string);
    }
  };

  // 处理结果点击
  const navigateToResult = (slug: string) => {
    setIsOpen(false);
    onComplete?.(); // 调用父组件的回调函数，关闭Portal面板
    router.push(`/posts/${slug}`);
  };

  // 处理查看全部结果
  const handleViewAllResults = () => {
    setIsOpen(false);
    onComplete?.(); // 调用父组件的回调函数，关闭Portal面板
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const toggleSearch = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  };

  return (
    <>
      <button
        onClick={toggleSearch}
        className="inline-flex items-center w-full text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        aria-label="搜索"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <span className="ml-2">搜索</span>
      </button>

      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm z-50 flex items-start justify-center pt-24 popup-overlay"
            onClick={(e) => {
              // 如果点击的是遮罩层本身，关闭弹窗
              if ((e.target as Element).classList.contains('popup-overlay')) {
                setIsOpen(false);
              }
            }}
          >
            <div
              ref={searchRef}
              className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()} // 阻止事件冒泡
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="搜索文章标题、内容..."
                  className="flex-1 ml-2 bg-transparent border-none outline-none text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                  autoComplete="off"
                />
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onComplete?.(); // 调用父组件的回调函数，关闭Portal面板
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="max-h-[70vh] overflow-y-auto p-4">
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500 dark:text-red-400">
                    <p>{error}</p>
                  </div>
                ) : results.length === 0 ? (
                  query.trim() ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <p>没有找到匹配的文章</p>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <p>输入关键词开始搜索</p>
                    </div>
                  )
                ) : (
                  <div className="space-y-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      找到 {results.length} 个结果
                    </p>
                    {results.slice(0, 5).map((post) => (
                      <article
                        key={post.slug}
                        className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0"
                      >
                        <button
                          onClick={() => navigateToResult(post.slug as string)}
                          className="block hover:bg-gray-50 dark:hover:bg-gray-700 p-2 -m-2 rounded w-full text-left"
                        >
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {post.title}
                          </h3>
                          {post.date && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              <DateFormatter dateString={post.date} />
                            </div>
                          )}
                          {post.excerpt && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                              {post.excerpt}
                            </p>
                          )}
                        </button>
                      </article>
                    ))}

                    {results.length > 5 && (
                      <div className="text-center pt-2">
                        <button
                          onClick={handleViewAllResults}
                          className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        >
                          查看全部 {results.length} 个结果
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
