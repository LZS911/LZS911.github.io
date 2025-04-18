import HeroPost from '@/ui/article/hero-post';
import { getAllPosts } from '@/lib/api';
import { Metadata } from 'next';
import { WEB_TITLE } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Talks | ${WEB_TITLE}`
};

export default function Page() {
  const allTalkPosts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt',
    'category'
  ]).filter((v) => v.category === 'talk');

  return <HeroPost posts={allTalkPosts} type="TALKS" />;
}
