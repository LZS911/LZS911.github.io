'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-2xl mx-auto">
      <div className="w-full bg-white dark:bg-zinc-800 rounded-lg shadow-md border border-gray-100 dark:border-zinc-700 overflow-hidden">
        <div className="border-l-4 border-amber-500 p-4 bg-amber-50 dark:bg-amber-900/20">
          <h2 className="text-xl md:text-2xl font-serif font-medium text-amber-800 dark:text-amber-300 mb-2">
            页面未找到
          </h2>
          <p className="text-amber-700/80 dark:text-amber-300/80 text-sm md:text-base">
            您访问的页面不存在或已被移除。
          </p>
        </div>

        <div className="p-6">
          <div className="flex justify-center mb-8">
            <div className="text-6xl font-serif">404</div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-center">
            您可以回到首页，或查看我们的博客存档寻找相关内容。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-5 py-2.5 bg-zinc-700 hover:bg-zinc-800 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white rounded-md 
              transition-colors duration-200 font-medium text-sm sm:text-base text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
            >
              返回首页
            </Link>
            <Link
              href="/blogs"
              className="px-5 py-2.5 bg-white hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-gray-300 dark:border-zinc-600
              text-gray-700 dark:text-gray-300 rounded-md transition-colors duration-200 text-center font-medium text-sm sm:text-base
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              浏览博客
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
