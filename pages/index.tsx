import Layout from "../components/layout";
import { getPostBySlug } from "../lib/api";
import Head from "next/head";
import { ABOUT_SLUG, WEB_TITLE } from "../lib/constants";
import markdownToHtml from "../lib/markdownToHtml";
import PostBody from "../components/post-body";

type Props = {
  content: string;
};

const Index: React.FC<Props> = ({ content }) => {
  return (
    <>
      <Layout>
        <Head>
          <title>{`Home | ${WEB_TITLE}`}</title>
        </Head>
        <PostBody content={content} />
      </Layout>
    </>
  );
};

export const getStaticProps: () => Promise<{ props: Props }> = async () => {
  const post = getPostBySlug(ABOUT_SLUG, ["content", "category"]);
  if (post.category !== "page") {
  }
  const content = await markdownToHtml(post.content || "");

  return {
    props: { content },
  };
};

export default Index;
