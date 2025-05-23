import PostBody from '@/ui/article/post-body';
import { getPostBySlug } from '@/lib/api';
import { ABOUT_SLUG } from '@/lib/constants';
import markdownToHtml from '@/lib/markdown-to-html';

export default async function Page() {
  const post = getPostBySlug(ABOUT_SLUG, ['content', 'category']);
  const content = await markdownToHtml(post.content || '');
  return <PostBody content={content} />;
}
