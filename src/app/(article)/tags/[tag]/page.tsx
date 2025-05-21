import { Metadata } from 'next';
import { getAllPosts } from '@/lib/api';
import DateFormatter from '@/ui/article/date-formatter';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({
  params
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  return {
    title: `标签: ${decodedTag}`
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const tag = decodeURIComponent((await params).tag);

  // 获取所有文章
  const allPosts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt',
    'content',
    'category',
    'subCategory',
    'tag'
  ]);

  // 过滤符合标签的文章
  const tagPosts = allPosts.filter(
    (post) => post.tag && post.tag.includes(tag)
  );

  // 如果没有找到相关文章，返回404
  if (tagPosts.length === 0) {
    notFound();
  }

  // 文章按日期排序（新的在前）
  const sortedPosts = tagPosts.sort((a, b) => {
    const dateA = a.date || '';
    const dateB = b.date || '';
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  return (
    <div className="container mx-auto px-5">
      <div className="mt-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-center text-gray-900 dark:text-gray-100">
          标签: {tag}
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
          共 {sortedPosts.length} 篇文章
        </p>

        <div className="space-y-10">
          {sortedPosts.map((post) => (
            <article
              key={post.slug}
              className="border-b border-gray-200 dark:border-gray-700 pb-8 last:border-0"
            >
              <Link href={`/posts/${post.slug}`} className="block group">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>

                {post.date && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    <DateFormatter dateString={post.date} />
                  </div>
                )}

                {post.excerpt && (
                  <p className="text-gray-600 dark:text-gray-300 mt-3">
                    {post.excerpt}
                  </p>
                )}

                {post.tag && post.tag.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tag.map((tagItem) => (
                      <span
                        key={tagItem}
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                          tagItem === tag
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {tagItem}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
