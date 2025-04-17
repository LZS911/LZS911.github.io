import clsx from 'clsx';
import { Items } from '@/types/post';
import Head from 'next/head';
import { WEB_TITLE } from '@/lib/constants';
import '@/styles/theme/juejin.min.css';
import '@/styles/theme/github.min.css';
import '@/styles/theme/smartblue.min.css';
import '@/styles/theme/cyanosis.min.css';
import '@/styles/theme/channing-cyan.min.css';
import '@/styles/theme/fancy.min.css';
import '@/styles/theme/hydrogen.min.css';
import '@/styles/theme/condensed-night-purple.min.css';
import '@/styles/theme/greenwillow.min.css';
import '@/styles/theme/v-green.min.css';
import '@/styles/theme/vue-pro.min.css';
import '@/styles/theme/healer-readable.min.css';
import '@/styles/theme/mk-cute.min.css';
import '@/styles/theme/jzman.min.css';
import '@/styles/theme/geek-black.min.css';
import '@/styles/theme/awesome-green.min.css';
import '@/styles/theme/qklhk-chocolate.min.css';
import '@/styles/theme/orange.min.css';
import '@/styles/theme/scrolls-light.min.css';
import '@/styles/theme/simplicity-green.min.css';
import '@/styles/theme/arknights.min.css';
import '@/styles/theme/vuepress.min.css';
import '@/styles/theme/Chinese-red.min.css';
import '@/styles/theme/nico.min.css';
import '@/styles/theme/devui-blue.min.css';

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
