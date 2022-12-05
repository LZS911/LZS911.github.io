import Head from "next/head";
import HeroPost from "../../components/hero-post";
import Layout from "../../components/layout";
import { Items } from "../../interfaces/post";
import { getAllPosts } from "../../lib/api";
import { WEB_TITLE } from "../../lib/constants";

type Props = {
  allTalkPosts: Items[];
};

const ProjectsPost: React.FC<Props> = ({ allTalkPosts }) => {
  return (
    <Layout>
      <Head>
        <title>{`Projects | ${WEB_TITLE}`}</title>
      </Head>

      <HeroPost posts={allTalkPosts} type="TALKS" />
    </Layout>
  );
};

export const getStaticProps: () => Promise<{
  props: Props;
}> = async () => {
  const allTalkPosts = getAllPosts([
    "title",
    "date",
    "slug",
    "author",
    "coverImage",
    "excerpt",
    "category",
  ]).filter((v) => v.category === "talk");

  return {
    props: { allTalkPosts },
  };
};

export default ProjectsPost;
