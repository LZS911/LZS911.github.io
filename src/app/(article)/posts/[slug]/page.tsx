import PostBody from '@/ui/article/post-body';
import { getPostBySlug, getAllPosts } from '../../../../lib/api';
import PostTitle from '@/ui/article/post-title';
import markdownToHtml from '@/lib/markdown-to-html';
import DateFormatter from '@/ui/article/date-formatter';
import Comments from '@/ui/article/comments';
import TagList from '@/ui/article/tag-list';

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
    'tag',
    'category'
  ]);
  const content = await markdownToHtml(post.content || '');

  return (
    <article>
      <PostTitle>{post.title}</PostTitle>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <DateFormatter dateString={post.date || ''} />
        {post.category && (
          <span className="px-3 py-1 text-sm rounded bg-gray-100 dark:bg-gray-800">
            {post.category}
          </span>
        )}
        {post.tag && Array.isArray(post.tag) && post.tag.length > 0 && (
          <TagList tags={post.tag} variant="small" />
        )}
      </div>
      <PostBody {...post} content={content} />
      {process.env.GITHUB_ACTION ? null : <Comments slug={slug} />}
    </article>
  );
}

export async function generateStaticParams() {
  const posts = getAllPosts(['slug']);

  return posts.map((post) => ({
    slug: post.slug
  }));
}
