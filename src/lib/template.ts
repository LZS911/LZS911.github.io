import { format } from 'date-fns';
import { type Theme } from '@/types/theme';
import PostType from '../types/post';

export const generateArticleContent = (
  title: string,
  body: string,
  theme: Theme,
  category: PostType['category']
) => {
  return `---
title: ${title}
layout: post
date: "${format(new Date(), 'yyyy-MM-dd')}"
image:
headerImage: false
star: true
category: ${category}
author: LZS_911
description: ${category}
excerpt: ''
theme: ${theme}  
---

${body}
`;
};

/**
 * 生成博客预览页面的HTML模板
 * @param title 文章标题
 * @param htmlContent 转换后的HTML内容
 * @param category 文章分类
 * @param theme 文章主题
 * @returns 完整的HTML预览页面
 */
export const generatePreviewTemplate = (
  title: string,
  htmlContent: string,
  theme: Theme
) => {
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - 预览</title>
  <link rel="stylesheet" href="/theme/${theme}.min.css">
</head>

<style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    
    img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 20px 0;
      border-radius: 4px;
    }
    
    .markdown-content img {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
</style>

<body>
  <h1>${title}</h1>
  <div class="markdown-content markdown-body-${theme}">
    ${htmlContent}
  </div>
</body>
</html>
  `;
};
