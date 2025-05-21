import { Metadata } from 'next';
import { Items } from '@/types/post';
import { getAllPosts } from '@/lib/api';
import DateFormatter from '@/ui/article/date-formatter';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// 添加高亮函数
function highlightText(text: string, query: string) {
  if (!query.trim()) return text;

  const regex = new RegExp(
    `(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
    'gi'
  );
  return text.replace(
    regex,
    '<mark class="bg-yellow-200 dark:bg-yellow-700 px-1 rounded">$1</mark>'
  );
}

interface SearchPageProps {
  searchParams: {
    q?: string;
    tag?: string;
    category?: string;
    subCategory?: string;
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({
  searchParams
}: SearchPageProps): Promise<Metadata> {
  const query = searchParams.q || '';
  const tag = searchParams.tag || '';
  const category = searchParams.category || '';
  const subCategory = searchParams.subCategory || '';

  let title = '搜索结果';
  if (query) title = `"${query}" 的搜索结果`;
  else if (tag) title = `标签: ${tag}`;
  else if (category && subCategory) title = `分类: ${category}/${subCategory}`;
  else if (category) title = `分类: ${category}`;

  return {
    title
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  const tag = searchParams.tag || '';
  const category = searchParams.category || '';
  const subCategory = searchParams.subCategory || '';

  if (!query && !tag && !category && !subCategory) {
    notFound();
  }

  // 构建API请求参数
  const params = new URLSearchParams();
  if (query) params.append('q', query);
  if (tag) params.append('tag', tag);
  if (category) params.append('category', category);
  if (subCategory) params.append('subCategory', subCategory);

  // 直接调用API函数以避免额外的网络请求
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

  let results: Items[] = [];

  // 过滤帖子
  results = allPosts
    .filter((post) => {
      // 如果指定了标签，先过滤标签
      if (tag && (!post.tag || !post.tag.includes(tag))) {
        return false;
      }

      // 如果指定了分类，先过滤分类
      if (category && post.category !== category) {
        return false;
      }

      // 如果指定了二级分类，先过滤二级分类
      if (subCategory && post.subCategory !== subCategory) {
        return false;
      }

      // 如果没有搜索关键词，返回标签和分类过滤后的结果
      if (!query) {
        return true;
      }

      // 搜索标题
      const titleMatch = post.title
        ?.toLowerCase()
        .includes(query.toLowerCase());

      // 搜索内容（只搜索前5000个字符以提高性能）
      const contentToSearch = post.content?.substring(0, 5000) || '';
      const contentMatch = contentToSearch
        .toLowerCase()
        .includes(query.toLowerCase());

      // 搜索摘要
      const excerptMatch = post.excerpt
        ?.toLowerCase()
        .includes(query.toLowerCase());

      return titleMatch || contentMatch || excerptMatch;
    })
    .map((post) => {
      // 提取匹配的内容片段
      let matchSnippet = '';
      if (query && post.content) {
        const lowerContent = post.content.toLowerCase();
        const lowerQuery = query.toLowerCase();
        const matchIndex = lowerContent.indexOf(lowerQuery);

        if (matchIndex !== -1) {
          // 提取匹配位置前后约100个字符作为上下文
          const startIndex = Math.max(0, matchIndex - 100);
          const endIndex = Math.min(
            post.content.length,
            matchIndex + query.length + 100
          );
          matchSnippet = post.content.substring(startIndex, endIndex);

          // 如果不是从头开始，添加省略号
          if (startIndex > 0) {
            matchSnippet = '...' + matchSnippet;
          }

          // 如果不是到结尾，添加省略号
          if (endIndex < post.content.length) {
            matchSnippet = matchSnippet + '...';
          }
        }
      }

      // 不返回完整内容以减少响应大小
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { content, ...postWithoutContent } = post;
      return {
        ...postWithoutContent,
        ...(matchSnippet && { matchSnippet })
      };
    });

  // 生成页面标题
  let pageTitle = '';
  if (query) pageTitle = `"${query}" 的搜索结果`;
  else if (tag) pageTitle = `标签: ${tag}`;
  else if (category && subCategory)
    pageTitle = `分类: ${category}/${subCategory}`;
  else if (category) pageTitle = `分类: ${category}`;

  return (
    <div className="container mx-auto px-5">
      <div className="mt-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-center text-gray-900 dark:text-gray-100">
          {pageTitle}
        </h1>

        {results.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              未找到相关内容
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              尝试使用不同的关键词或浏览其他内容
            </p>
            <Link
              href="/"
              className="inline-block mt-6 px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              返回首页
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              共找到 {results.length} 个结果
            </p>

            <div className="space-y-10">
              {results.map((post) => (
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

                    {post.matchSnippet && (
                      <div className="mt-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <span className="font-semibold">匹配内容: </span>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: highlightText(post.matchSnippet, query)
                            }}
                          />
                        </p>
                      </div>
                    )}

                    {post.tag && post.tag.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {post.tag.map((tag) => (
                          <span
                            key={tag}
                            className="inline-block px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
