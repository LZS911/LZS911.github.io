'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

interface PopupTagsProps {
  onComplete?: () => void;
  maxDisplayTags?: number; // 添加最大显示标签数属性
}

export default function PopupTags({
  onComplete,
  maxDisplayTags = 20
}: PopupTagsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tags, setTags] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const tagsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 获取标签数据
  useEffect(() => {
    const fetchTags = async () => {
      if (!isOpen) return; // 只在打开弹窗时获取数据

      setLoading(true);
      try {
        const response = await fetch('/api/tags');
        if (response.ok) {
          const data = await response.json();
          setTags(data.tags);
        } else {
          console.error('获取标签失败');
        }
      } catch (error) {
        console.error('获取标签出错:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [isOpen]);

  // 点击外部关闭标签弹窗
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tagsRef.current &&
        !tagsRef.current.contains(event.target as Node) &&
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

  // 监听ESC键关闭弹窗
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

  // 根据文章数量确定标签大小
  const getTagSize = (count: number): string => {
    const max = Math.max(...Object.values(tags), 1);
    const normalized = count / max;

    if (normalized > 0.8) return 'text-xl font-bold';
    if (normalized > 0.6) return 'text-lg font-semibold';
    if (normalized > 0.4) return 'text-base';
    if (normalized > 0.2) return 'text-sm';
    return 'text-xs';
  };

  const toggleTags = () => {
    setIsOpen(!isOpen);
  };

  // 处理标签点击
  const handleTagClick = (tag: string) => {
    setIsOpen(false);
    onComplete?.(); // 调用父组件的回调函数，关闭Portal面板
    router.push(`/tags/${encodeURIComponent(tag)}`);
  };

  // 将标签按照文章数量排序
  const sortedTags = Object.keys(tags).sort((a, b) => tags[b] - tags[a]);

  // 是否有需要隐藏的标签
  const hasMoreTags = sortedTags.length > maxDisplayTags;

  // 实际显示的标签数组
  const displayTags = sortedTags.slice(0, maxDisplayTags);

  // 剩余标签数量
  const remainingTagsCount = sortedTags.length - maxDisplayTags;

  return (
    <>
      <button
        onClick={toggleTags}
        className="inline-flex items-center w-full text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        aria-label="标签"
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
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
          <line x1="7" y1="7" x2="7.01" y2="7"></line>
        </svg>
        <span className="ml-2">标签</span>
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
              ref={tagsRef}
              className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()} // 阻止事件冒泡
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  所有标签
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
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

              <div className="max-h-[70vh] overflow-y-auto p-6">
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                  </div>
                ) : sortedTags.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>暂无标签</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {displayTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagClick(tag)}
                        className={clsx(
                          getTagSize(tags[tag]),
                          'inline-block px-3 py-1.5 rounded-full',
                          'bg-blue-100 text-blue-800 hover:bg-blue-200',
                          'dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800',
                          'transition-colors'
                        )}
                      >
                        {tag} <span className="text-xs">({tags[tag]})</span>
                      </button>
                    ))}

                    {hasMoreTags && (
                      <button className="inline-block px-3 py-1.5 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors">
                        +{remainingTagsCount}
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
                <Link
                  href="/tags"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={() => {
                    setIsOpen(false);
                    onComplete?.(); // 调用父组件的回调函数，关闭Portal面板
                  }}
                >
                  查看全部标签页面
                </Link>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
