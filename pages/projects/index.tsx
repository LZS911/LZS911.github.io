import Head from "next/head";
import HeroPost from "../../components/hero-post";
import Layout from "../../components/layout";
import { Items } from "../../interfaces/post";
import { getAllPosts } from "../../lib/api";
import { WEB_TITLE } from "../../lib/constants";

type Props = {
  allProjectPosts: Items[];
};

const ProjectsPost: React.FC<Props> = ({ allProjectPosts }) => {
  return (
    <Layout>
      <Head>
        <title>{`Projects | ${WEB_TITLE}`}</title>
      </Head>

      <HeroPost posts={allProjectPosts} type="PROJECTS" />
    </Layout>
  );
};

export const getStaticProps: () => Promise<{
  props: Props;
}> = async () => {
  const allProjectPosts = getAllPosts([
    "title",
    "date",
    "slug",
    "author",
    "coverImage",
    "excerpt",
    "category",
  ]).filter((v) => v.category === "project");

  return {
    props: { allProjectPosts },
  };
};

export default ProjectsPost;
