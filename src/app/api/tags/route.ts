import { getAllPosts } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function GET() {
  const posts = getAllPosts(['tag']);

  // 获取所有标签和它们的文章数量
  const tagCounts: Record<string, number> = {};

  posts.forEach((post) => {
    if (post.tag && Array.isArray(post.tag)) {
      post.tag.forEach((tag) => {
        if (tagCounts[tag]) {
          tagCounts[tag]++;
        } else {
          tagCounts[tag] = 1;
        }
      });
    }
  });

  return NextResponse.json({ tags: tagCounts });
}
