import { useRouter } from "next/router";
import ErrorPage from "next/error";
import PostBody from "../../components/post-body";
import { getPostBySlug, getAllPosts } from "../../lib/api";
import PostTitle from "../../components/post-title";
import markdownToHtml from "../../lib/markdownToHtml";
import type PostType from "../../interfaces/post";
import Layout from "../../components/layout";
import EmptyBox from "../../components/empty-box";
import DateFormatter from "../../components/date-formatter";

type Props = {
  post: PostType;
  morePosts: PostType[];
  preview?: boolean;
};

export default function Post({ post, morePosts, preview }: Props) {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <Layout>
      <EmptyBox
        if={!router.isFallback}
        defaultNode={<PostTitle>Loading…</PostTitle>}
      >
        <article>
          <PostTitle>{post.title}</PostTitle>
          <DateFormatter dateString={post.date} />
          <PostBody {...post} />
        </article>
      </EmptyBox>
    </Layout>
  );
}

type Params = {
  params: {
    slug: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const post = getPostBySlug(params.slug, [
    "title",
    "date",
    "slug",
    "author",
    "content",
    "ogImage",
    "coverImage",
    "theme",
    "tag",
  ]);
  // const allPosts = getAllPosts(["slug"]);
  const content = await markdownToHtml(post.content || "");

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts(["slug"]);

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}
