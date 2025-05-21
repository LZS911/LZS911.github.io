import { Metadata } from 'next';
import { getAllPosts } from '@/lib/api';
import Link from 'next/link';
import { Items } from '@/types/post';

export const metadata: Metadata = {
  title: '文章归档 | 时间线'
};

// 定义文章按年月分组的类型
type YearGroup = {
  year: number;
  months: MonthGroup[];
};

type MonthGroup = {
  month: number;
  posts: Items[];
};

// 按年份和月份分组文章，返回数组形式
function groupPostsByYearAndMonth(posts: Items[]): YearGroup[] {
  // 先对所有文章按日期降序排序
  const sortedPosts = [...posts].sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // 临时使用对象来分组
  const groupedMap: Record<number, Record<number, Items[]>> = {};

  sortedPosts.forEach((post) => {
    if (!post.date) return; // 跳过没有日期的文章

    const date = new Date(post.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JavaScript月份从0开始

    if (!groupedMap[year]) {
      groupedMap[year] = {};
    }

    if (!groupedMap[year][month]) {
      groupedMap[year][month] = [];
    }

    groupedMap[year][month].push(post);
  });

  // 将分组对象转换为数组，保持排序
  const yearsArray: YearGroup[] = Object.keys(groupedMap)
    .map(Number)
    .sort((a, b) => b - a) // 年份降序排序
    .map((year) => {
      const monthsArray: MonthGroup[] = Object.keys(groupedMap[year])
        .map(Number)
        .sort((a, b) => b - a) // 月份降序排序
        .map((month) => ({
          month,
          posts: groupedMap[year][month]
        }));

      return {
        year,
        months: monthsArray
      };
    });

  return yearsArray;
}

// 获取月份名称
function getMonthName(month: number) {
  const monthNames = [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月'
  ];
  return monthNames[month - 1];
}

export default async function ArchivesPage() {
  const posts = await getAllPosts(['title', 'date', 'slug', 'excerpt']);
  const groupedPosts = groupPostsByYearAndMonth(posts);

  return (
    <div className="container mx-auto px-5 max-w-4xl">
      <div className="mt-8 mb-16">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-center text-gray-900 dark:text-gray-100">
          文章归档
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-12 text-center">
          按时间线查看所有文章
        </p>

        <div className="relative border-l-2 border-gray-300 dark:border-gray-700 ml-4 pl-8 mt-16">
          {groupedPosts.map((yearGroup) => (
            <div key={yearGroup.year} className="mb-16 relative">
              <div className="absolute -left-4 flex items-center justify-center w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-full">
                <span className="text-white font-bold">{yearGroup.year}</span>
              </div>

              <h2 className="text-2xl font-bold mb-8 pt-1 text-gray-900 dark:text-gray-100 pl-8">
                {yearGroup.year}年
              </h2>

              {yearGroup.months.map((monthGroup) => (
                <div
                  key={`${yearGroup.year}-${monthGroup.month}`}
                  className="mb-10"
                >
                  <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-200">
                    <span className="inline-block w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full mr-2"></span>
                    {getMonthName(monthGroup.month)}
                  </h3>

                  <ul className="space-y-5 ml-6">
                    {monthGroup.posts.map((post) => (
                      <li
                        key={post.slug}
                        className="relative border-l border-gray-300 dark:border-gray-700 pl-6 pb-2"
                      >
                        <div className="absolute -left-1.5 top-2.5 w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                        <time className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">
                          {post.date &&
                            new Date(post.date).toLocaleDateString('zh-CN', {
                              month: 'long',
                              day: 'numeric'
                            })}
                        </time>
                        <Link
                          href={`/posts/${post.slug}`}
                          className="text-lg font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-gray-900 dark:text-gray-200"
                        >
                          {post.title}
                        </Link>
                        {post.excerpt && (
                          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}

          {groupedPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-gray-400">暂无文章</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
