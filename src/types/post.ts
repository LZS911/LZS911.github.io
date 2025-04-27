import { type Theme } from '@/types/theme';
import type Author from './author';

type PostType = {
  slug: string;
  title: string;
  date: string;
  coverImage: string;
  author: Author;
  excerpt: string;
  ogImage: {
    url: string;
  };
  content: string;
  star: boolean;
  category: 'blog' | 'project' | 'talk';
  theme: Theme;
  tag: string[];
};

export type Items = {
  [key in keyof PostType]?: PostType[key];
};

export default PostType;
