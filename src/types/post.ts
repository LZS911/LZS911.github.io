import { type Theme } from '@/types/theme';
import type Author from './author';

// 顶级分类
export type Category = 'blog' | 'project' | 'talk';

// 博客二级分类
export type BlogSubCategory =
  | 'tech' // 技术分享
  | 'note' // 读书笔记
  | 'tutorial' // 教程
  | 'plan' // 学习计划
  | 'review' // 复盘总结
  | 'other'; // 其他

// 项目二级分类
export type ProjectSubCategory =
  | 'web' // Web项目
  | 'mobile' // 移动应用
  | 'tool' // 工具
  | 'library' // 库
  | 'other'; // 其他

// 演讲二级分类
export type TalkSubCategory =
  | 'conference' // 会议演讲
  | 'workshop' // 工作坊
  | 'meetup' // 线下聚会
  | 'other'; // 其他

// 所有二级分类的联合类型
export type SubCategory =
  | BlogSubCategory
  | ProjectSubCategory
  | TalkSubCategory;

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
  category: Category;
  subCategory?: SubCategory; // 二级分类，可选
  theme: Theme;
  tag: string[];
};

export type Items = {
  [key in keyof PostType]?: PostType[key];
} & {
  matchSnippet?: string; // 搜索匹配的内容片段
  originalSlug?: string; // 原始文件名（不包含 .md 后缀）
  hashSlug?: string; // hash 格式的 slug
};

export default PostType;
