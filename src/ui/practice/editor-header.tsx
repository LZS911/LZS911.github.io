import React from 'react';
import PostType from '../../types/post';
import { Theme } from '@/types/theme';
import { THEMES } from '../../lib/theme';

interface EditorHeaderProps {
  title: string;
  onTitleChange: (value: string) => void;
  category: PostType['category'];
  onCategoryChange: (value: PostType['category']) => void;
  theme: Theme;
  onThemeChange: (value: Theme) => void;
  categories: Array<PostType['category']>;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({
  title,
  onTitleChange,
  category,
  onCategoryChange,
  theme,
  onThemeChange,
  categories
}) => {
  return (
    <div className="flex items-center gap-4 flex-1">
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="请输入文章标题"
        className="text-2xl font-bold px-4 py-2 w-1/3 border-none focus:outline-none focus:ring-0 dark:bg-gray-800 dark:text-white placeholder-gray-400"
      />
      <div className="flex items-center gap-2">
        <select
          value={category}
          onChange={(e) =>
            onCategoryChange(e.target.value as PostType['category'])
          }
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-transparent"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={theme}
          onChange={(e) => onThemeChange(e.target.value as Theme)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-transparent"
        >
          {THEMES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default EditorHeader;
