'use client';

import Link from 'next/link';

export default function Error({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-2xl mx-auto">
      <div className="w-full bg-white dark:bg-zinc-800 rounded-lg shadow-md border border-gray-100 dark:border-zinc-700 overflow-hidden">
        <div className="border-l-4 border-red-500 p-4 bg-red-50 dark:bg-red-900/20">
          <h2 className="text-xl md:text-2xl font-serif font-medium text-red-800 dark:text-red-300 mb-2">
            出现了一些问题
          </h2>
          <p className="text-red-700/80 dark:text-red-300/80 text-sm md:text-base">
            很抱歉，加载页面时发生错误。
          </p>
        </div>

        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            您可以尝试刷新页面或返回首页。如果问题持续存在，这可能是暂时性的技术问题，请稍后再试。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => reset()}
              className="px-5 py-2.5 bg-zinc-700 hover:bg-zinc-800 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white rounded-md 
              transition-colors duration-200 font-medium text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
            >
              重试
            </button>
            <Link
              href="/"
              className="px-5 py-2.5 bg-white hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-gray-300 dark:border-zinc-600
              text-gray-700 dark:text-gray-300 rounded-md transition-colors duration-200 text-center font-medium text-sm sm:text-base
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
