import Head from "next/head";
import HeroPost from "../../components/hero-post";
import Layout from "../../components/layout";
import { Items } from "../../interfaces/post";
import { getAllPosts } from "../../lib/api";
import { WEB_TITLE } from "../../lib/constants";

type Props = {
  allBlogPosts: Items[];
};

const BlogsPost: React.FC<Props> = ({ allBlogPosts }) => {
  return (
    <Layout>
      <Head>
        <title>{`Blogs | ${WEB_TITLE}`}</title>
      </Head>

      <HeroPost posts={allBlogPosts} type="BLOGS" />
    </Layout>
  );
};

export const getStaticProps: () => Promise<{
  props: Props;
}> = async () => {
  const allBlogPosts = getAllPosts([
    "title",
    "date",
    "slug",
    "author",
    "coverImage",
    "excerpt",
    "category",
  ]).filter((v) => v.category === "blog");

  return {
    props: { allBlogPosts },
  };
};

export default BlogsPost;
