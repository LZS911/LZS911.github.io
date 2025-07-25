import Link from 'next/link';
import { Items } from '../../types/post';
import PostTitle from './post-title';

type Props = {
  posts: Items[];
  type: 'BLOGS' | 'PROJECTS' | 'TALKS' | 'TAG' | 'ARCHIVE';
};

const HeroPost: React.FC<Props> = ({ posts, type }) => {
  return (
    <article className="max-w-3xl">
      <PostTitle>{type}</PostTitle>

      <section>
        {posts.map((v) => {
          return (
            <div key={v.title} className="mt-16 p-10 text-center">
              <h2 className="font-[Arial] text-shadow-de text-2xl tracking-wider font-bold text-black">
                <Link href={`/posts/${v.slug}`} className="hover:underline">
                  {v.title}
                </Link>
              </h2>
              <hr className=" border-b-indigo border-b-[1px] my-4" />
              <span className="text-black opacity-60 text-sm">
                {v.excerpt || 'excerpt'} {' | '}
                <Link
                  href={`/posts/${v.slug}`}
                  className="hover:underline text-center hover:bg-indigo"
                >
                  Link
                </Link>
                {' | '}
                {v.date}
              </span>
            </div>
          );
        })}
      </section>
    </article>
  );
};

export default HeroPost;
