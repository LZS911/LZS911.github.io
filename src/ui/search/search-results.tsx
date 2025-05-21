'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DateFormatter from '@/ui/article/date-formatter';
import { Items } from '@/types/post';

interface SearchResultsProps {
  initialQuery: string;
  initialTag?: string;
  initialCategory?: string;
  initialSubCategory?: string;
}

export default function SearchResults({
  initialQuery,
  initialTag,
  initialCategory,
  initialSubCategory
}: SearchResultsProps) {
  const [results, setResults] = useState<Items[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      setError('');

      try {
        // 构建查询参数
        const params = new URLSearchParams();
        if (initialQuery) params.append('q', initialQuery);
        if (initialTag) params.append('tag', initialTag);
        if (initialCategory) params.append('category', initialCategory);
        if (initialSubCategory)
          params.append('subCategory', initialSubCategory);

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
    }

    if (initialQuery || initialTag || initialCategory || initialSubCategory) {
      fetchResults();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [initialQuery, initialTag, initialCategory, initialSubCategory]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 dark:text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-gray-600 dark:text-gray-400">
          {initialQuery || initialTag || initialCategory || initialSubCategory
            ? '没有找到匹配的文章'
            : '请输入搜索关键词'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 mt-6">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        找到 {results.length} 个匹配结果
      </p>
      {results.map((post) => (
        <article
          key={post.slug}
          className="border-b border-gray-200 dark:border-gray-800 pb-8 last:border-0"
        >
          <Link href={`/posts/${post.slug}`} className="block group">
            <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {post.title}
            </h2>
            {post.date && (
              <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <DateFormatter dateString={post.date} />
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {post.category && (
                <span className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800">
                  {post.category}
                </span>
              )}
              {post.subCategory && (
                <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {post.subCategory}
                </span>
              )}
              {post.tag &&
                Array.isArray(post.tag) &&
                post.tag.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {t}
                  </span>
                ))}
            </div>
            {post.excerpt && (
              <p className="text-gray-700 dark:text-gray-300">{post.excerpt}</p>
            )}
          </Link>
        </article>
      ))}
    </div>
  );
}
