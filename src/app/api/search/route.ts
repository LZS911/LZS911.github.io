import { getAllPosts } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const tag = searchParams.get('tag') || '';
  const category = searchParams.get('category') || '';
  const subCategory = searchParams.get('subCategory') || '';

  if (!query && !tag && !category && !subCategory) {
    return NextResponse.json({ posts: [] });
  }

  // 获取所有文章，包含所需字段
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

  // 搜索逻辑
  const filteredPosts = allPosts
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
      // 如果搜索关键词存在，提取匹配的内容片段
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

  return NextResponse.json({ posts: filteredPosts });
}
