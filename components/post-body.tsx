import cn from "classnames";
import Head from "next/head";
import { Items } from "../interfaces/post";
import { WEB_TITLE } from "../lib/constants";

type Props = Items;

const PostBody: React.FC<Props> = ({ content, title, theme = "fancy" }) => {
  return (
    <section>
      <Head>
        <title>{`${title ?? "Home"} | ${WEB_TITLE}`}</title>
      </Head>

      <div
        className={cn(
          {
            [`markdown-body-${theme}`]: theme,
          },
          "max-w-3xl"
        )}
        dangerouslySetInnerHTML={{ __html: content ?? "" }}
      />
    </section>
  );
};

export default PostBody;
