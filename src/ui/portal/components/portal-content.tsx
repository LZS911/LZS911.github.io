'use client';

import Link from 'next/link';
import { createPortal } from 'react-dom';
import PopupTags from '../../article/popup-tags';
import PopupSearch from '../../search/popup-search';
import { RefObject, useEffect, useState } from 'react';
import clsx from 'clsx';

interface PortalContentProps {
  setIsOpen: (isOpen: boolean) => void;
  portalRef: React.RefObject<HTMLDivElement | null>;
  href: '/practice' | '/';
  buttonRef: RefObject<HTMLButtonElement | null>;
}

export default function PortalContent({
  setIsOpen,
  portalRef,
  href,
  buttonRef
}: PortalContentProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 计算弹出面板位置
  const getPopupPosition = () => {
    if (!buttonRef.current) return {};

    const rect = buttonRef.current.getBoundingClientRect();
    const isNearBottom = rect.top > window.innerHeight / 2;
    const isNearRight = rect.left > window.innerWidth / 2;

    // 根据按钮位置决定弹出框的方向
    if (isNearBottom && isNearRight) {
      // 按钮在右下，弹出框在左上
      return {
        bottom: `${window.innerHeight - rect.top + 12}px`,
        right: `${window.innerWidth - rect.right + 12}px`
      };
    } else if (isNearBottom && !isNearRight) {
      // 按钮在左下，弹出框在右上
      return {
        bottom: `${window.innerHeight - rect.top + 12}px`,
        left: `${rect.left}px`
      };
    } else if (!isNearBottom && isNearRight) {
      // 按钮在右上，弹出框在左下
      return {
        top: `${rect.bottom + 12}px`,
        right: `${window.innerWidth - rect.right + 12}px`
      };
    } else {
      // 按钮在左上，弹出框在右下
      return {
        top: `${rect.bottom + 12}px`,
        left: `${rect.left}px`
      };
    }
  };

  useEffect(() => {
    fetch('/api/auth/check')
      .then((res) => res.json())
      .then((data) => {
        setAuthenticated(data.authenticated);
      });

    // 添加延迟，等待挂载完成后再显示动画效果
    const timer = setTimeout(() => {
      setMounted(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  return createPortal(
    <div
      ref={portalRef}
      style={{ ...getPopupPosition() }}
      className={clsx(
        'w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl absolute portal-overlay transform transition-all duration-300 ease-out',
        {
          'opacity-100 scale-100': mounted,
          'opacity-0 scale-95': !mounted
        }
      )}
      onClick={(e) => e.stopPropagation()} // 阻止事件冒泡
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">工具箱</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* 搜索功能 */}
        <div className="flex items-center p-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors w-full">
          <PopupSearch onComplete={() => setIsOpen(false)} />
        </div>

        {/* 标签功能 */}
        <div className="flex items-center p-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors w-full">
          <PopupTags onComplete={() => setIsOpen(false)} />
        </div>

        {/* 归档功能 */}
        <div className="w-full pt-2 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/archives"
            className="flex items-center p-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors w-full"
            onClick={() => setIsOpen(false)}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <span>文章归档</span>
          </Link>
        </div>

        {/* 跳转链接 */}
        {authenticated && (
          <div className="w-full pt-2 border-t border-gray-200 dark:border-gray-700">
            <Link
              href={href}
              className="flex items-center p-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors w-full"
              onClick={() => setIsOpen(false)}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{href === '/' ? '返回博客' : '进入博客编辑页面'}</span>
            </Link>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
