'use client';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-2xl mx-auto">
      <div className="w-full bg-white dark:bg-zinc-800 rounded-lg shadow-md border border-gray-100 dark:border-zinc-700 overflow-hidden">
        <div className="border-l-4 border-blue-500 p-4 bg-blue-50 dark:bg-blue-900/20">
          <h2 className="text-xl md:text-2xl font-serif font-medium text-blue-800 dark:text-blue-300 mb-2">
            加载中
          </h2>
          <p className="text-blue-700/80 dark:text-blue-300/80 text-sm md:text-base">
            正在获取内容，请稍候...
          </p>
        </div>

        <div className="p-6 flex flex-col items-center">
          <div className="flex justify-center items-center space-x-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse delay-75"></div>
            <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse delay-150"></div>
            <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse delay-300"></div>
          </div>

          <div className="w-full max-w-md">
            {/* 骨架屏 - 模拟博客文章加载状态 */}
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-5/6 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-5/6 mb-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
