import HeroPost from '@/ui/article/hero-post';
import { getAllPosts } from '@/lib/api';
import { Metadata } from 'next';
import { WEB_TITLE } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Projects | ${WEB_TITLE}`
};

export default function Page() {
  const allProjectPosts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt',
    'category'
  ]).filter((v) => v.category === 'project');
  return <HeroPost posts={allProjectPosts} type="PROJECTS" />;
}
