import HeroPost from '@/ui/components/hero-post';
import { getAllPosts } from '@/lib/api';
import { WEB_TITLE } from '@/lib/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Blogs | ${WEB_TITLE}`
};

export default function Page() {
  const allBlogPosts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt',
    'category'
  ]).filter((v) => v.category === 'blog');

  return <HeroPost posts={allBlogPosts} type="BLOGS" />;
}
