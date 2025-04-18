import clsx from 'clsx';
import { Items } from '@/types/post';
import Head from 'next/head';
import { WEB_TITLE } from '@/lib/constants';
import { ThemeLoader } from '@/ui/theme-loader';

type Props = Items;

const PostBody: React.FC<Props> = ({
  content,
  title = 'POST',
  theme = 'fancy'
}) => {
  return (
    <>
      <Head>
        <title>{`${title} | ${WEB_TITLE}`}</title>
      </Head>
      <ThemeLoader theme={theme} />
      <section
        className={clsx(
          {
            [`markdown-body-${theme}`]: theme
          },
          'max-w-3xl'
        )}
        dangerouslySetInnerHTML={{ __html: content ?? '' }}
      />
    </>
  );
};

export default PostBody;
