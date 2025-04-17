import PostBody from '@/ui/components/post-body';
import { getPostBySlug, getAllPosts } from '../../../lib/api';
import PostTitle from '@/ui/components/post-title';
import markdownToHtml from '@/lib/markdownToHtml';
import DateFormatter from '@/ui/components/date-formatter';
import Comments from '@/ui/components/comments';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'ogImage',
    'coverImage',
    'theme',
    'tag'
  ]);
  const content = await markdownToHtml(post.content || '');

  return (
    <article>
      <PostTitle>{post.title}</PostTitle>
      <DateFormatter dateString={post.date || ''} />
      <PostBody {...post} content={content} />
      <Comments slug={slug} />
    </article>
  );
}

export async function generateStaticParams() {
  const posts = getAllPosts(['slug']);

  return posts.map((post) => ({
    slug: post.slug
  }));
}
