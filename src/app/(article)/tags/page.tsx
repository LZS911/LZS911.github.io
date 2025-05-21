import { Metadata } from 'next';
import Link from 'next/link';
import clsx from 'clsx';
import { getAllPosts } from '@/lib/api';

export const metadata: Metadata = {
  title: '所有标签'
};

export default async function TagsPage() {
  // 获取所有文章
  const allPosts = getAllPosts(['tag']);

  // 统计每个标签的文章数量
  const tagsCount: Record<string, number> = {};

  allPosts.forEach((post) => {
    if (post.tag && Array.isArray(post.tag)) {
      post.tag.forEach((tag) => {
        if (tag) {
          tagsCount[tag] = (tagsCount[tag] || 0) + 1;
        }
      });
    }
  });

  // 将标签按照文章数量排序
  const sortedTags = Object.keys(tagsCount).sort(
    (a, b) => tagsCount[b] - tagsCount[a]
  );

  // 根据文章数量确定标签大小
  const getTagSize = (count: number): string => {
    const max = Math.max(...Object.values(tagsCount), 1);
    const normalized = count / max;

    if (normalized > 0.8) return 'text-2xl font-bold';
    if (normalized > 0.6) return 'text-xl font-semibold';
    if (normalized > 0.4) return 'text-lg';
    if (normalized > 0.2) return 'text-base';
    return 'text-sm';
  };

  return (
    <div className="container mx-auto px-5">
      <div className="mt-8 mb-16">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-center text-gray-900 dark:text-gray-100">
          所有标签
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-12 text-center">
          共 {sortedTags.length} 个标签
        </p>

        {sortedTags.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400">暂无标签</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {sortedTags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className={clsx(
                  getTagSize(tagsCount[tag]),
                  'inline-block px-4 py-2 rounded-full',
                  'bg-blue-100 text-blue-800 hover:bg-blue-200',
                  'dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800',
                  'transition-colors'
                )}
              >
                {tag} <span className="text-xs">({tagsCount[tag]})</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
