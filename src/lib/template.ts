import { format } from 'date-fns';
import Theme from '../../@types/theme';
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
date: ${format(new Date(), 'yyyy-MM-dd')}
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
