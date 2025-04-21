---
title: 博客升级：Next.js 版本更新与功能扩展
layout: post
date: "2025-04-21"
image:
headerImage: false
star: true
category: blog
author: LZS_911
description: blog
excerpt: ''
theme: fancy  
---

## 引言

### 为什么选择升级？

#### 博客旧版本的痛点
1. 功能单一性：纯静态HTML+CSS构建，依赖手动更新Markdown文件，缺乏动态交互能力
2. 部署限制：GitHub Pages仅支持静态资源，无法实现服务端逻辑（如API路由、身份验证）

#### Next.js 新版本的核心吸引力
1. App Router：基于文件系统的布局嵌套、流式渲染和简化的数据获取
2. 混合渲染模式：支持SSG/SSR/ISR自由组合，解决静态博客的动态需求


#### 个人学习动机
> 这次升级源于我对现代Web开发技术栈的深度探索需求，尤其是以下两个核心目标：

1. 掌握Vercel的全栈开发能力
    - 深入平台特性：
         1. 学习Vercel的Serverless Function冷启动优化方案
         2. 实践Edge Network的全球低延迟部署
         3. 探索Vercel Analytics与Speed Insights的实时性能监控集成

    - 工作流革新：
        1. 实现GitHub代码提交 → Vercel自动预览部署 → 生产环境灰度发布的完整CI/CD流水线
        2. 尝试Vercel Storage（如Postgres/KV）替代传统自建数据库

2. 构建完整的全栈技术闭环
    - 前端深度实践：
         1. 从"静态页面渲染"升级到"按需动态渲染"（如博客编辑页的权限敏感路由）
         2. 体验React Server Components的数据获取模式与传统CSR的差异

    - 后端能力强化：
         1. 通过Next.js API路由实现GitHub OAuth登录+Discussions API代理
         2. 开发无状态服务：JWT验证中间件 + 服务端缓存策略（如redis+stale-while-revalidate）

    - 架构思维培养：

         1. 在静态导出（GitHub Pages）与全动态（Vercel）之间设计兼容方案


> 通过这个项目，我希望建立起从代码编写到云端部署的完整技术认知，最终形成可复用的全栈开发方法论。

## Next.js 升级实战

### 版本迁移关键步骤

#### 从 `page router` 到 `app router` 的过渡

1. 路由结构改造：
   ```md
   /pages/posts/[slug].tsx → /app/posts/[slug]/page.tsx
   ```
2. 数据获取迁移：

   - 原`getStaticProps` → 改用`fetch + generateStaticParams`
   - 原`getServerSideProps` → 改用服务端组件直接异步加载

### 静态部署与服务部署的冲突以及解决方案

#### GitHub Pages 部署限制
仅支持纯静态导出 `output: 'export'`，无法使用API路由以及各种中间件

#### Vercel 部署优势
原生支持Serverless Functions、Edge Network、ISR

#### 解决方案
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
 /**
 * next configs
 */
};

if (process.env.NODE_ENV === 'production') {
  if (process.env.GITHUB_ACTION) {
    nextConfig.pageExtensions = ['jsx', 'tsx'];
    nextConfig.output = 'export';
  }
}

export default nextConfig;

```

### Next.js 技术点遗留问题

1. ISR
2. 服务端组件与客户端组件的边界划分
3. Next.js API 最佳实践

## 新增功能详解

### 基于 github Discussions 的评论系统
1. 功能概述
    - 利用 GitHub Discussions API 实现博客评论功能
    - 用户通过 GitHub OAuth 登录，确保评论可追溯
    - 支持 读取/发布/回复评论，数据存储在GitHub仓库的Discussions板块

2. 技术实现
(1) GitHub API 接入
🔹 数据读取（GET）

使用 fetch 调用GitHub GraphQL API 获取指定Discussion的评论
```typescript
/**
 * 根据文章 slug 获取对应的 Discussion
 * @param slug 文章的 slug
 * @param title 文章标题
 */
export async function getDiscussionBySlug(
  slug: string
): Promise<DiscussionInfo | null> {
  try {
    // 构建GraphQL查询，查找是否已存在对应slug的discussion，只查找open状态的
    const findQuery = `
      query {
        repository(owner: "${REPO_OWNER}", name: "${REPO_NAME}") {
          discussions(first: 100, states: OPEN) {
            nodes {
              id
              number
              title
            }
          }
        }
      }
    `;
    // 执行查询
    const findResponse = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${GITHUB_TOKEN || ''}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: findQuery })
    });

    const findData = await findResponse.json();
    const discussions = findData?.data?.repository?.discussions?.nodes || [];

    // 查找标题包含slug的discussion
    const existingDiscussion = discussions.find(
      (d: any) => d.title === generateDiscussionInfoTitle(slug)
    );
    if (existingDiscussion) {
      return {
        id: existingDiscussion.id,
        number: existingDiscussion.number
      };
    }

    return null;
  } catch (error) {
    console.error('获取或创建讨论异常:', error);
    return null;
  }
}

/**
 * 获取 Discussion 的评论
 * @param discussionId Discussion 的 ID
 */
export async function getCommentsByDiscussionId(discussionId: string) {
  try {
    const query = `
      query {
        node(id: "${discussionId}") {
          ... on Discussion {
            comments(first: 100) {
              nodes {
                id
                author {
                  login
                  avatarUrl
                  url
                }
                body
                bodyHTML
                createdAt
                replyToId: replyTo {
                  id
                }
                replies(first: 100) {
                  nodes {
                    id
                    author {
                      login
                      avatarUrl
                      url
                    }
                    body
                    bodyHTML
                    createdAt
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${GITHUB_TOKEN || ''}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });

    const data = await response.json();
    const comments = data?.data?.node?.comments?.nodes || [];
    return comments.map((comment: any) => ({
      id: comment.id,
      author: {
        login: comment.author?.login || '匿名用户',
        avatarUrl: comment.author?.avatarUrl,
        url: comment.author?.url
      },
      content: comment.body,
      bodyHTML: comment.bodyHTML,
      createdAt: comment.createdAt,
      replyToId: comment.replyToId?.id,
      replies: comment.replies?.nodes?.map((reply: any) => ({
        id: reply.id,
        author: {
          login: reply.author?.login || '匿名用户',
          avatarUrl: reply.author?.avatarUrl,
          url: reply.author?.url
        },
        content: reply.body,
        bodyHTML: reply.bodyHTML,
        createdAt: reply.createdAt
      })),
      reactions:
        comment.reactionGroups?.map((group: any) => ({
          type: group.content,
          count: group.users.totalCount
        })) || []
    }));
  } catch (error) {
    console.error('获取评论异常:', error);
    return [];
  }
}

```

🔹 评论发布（POST）

用户提交评论后，调用API创建Discussion或回复

需要 GitHub Token 授权（通过OAuth获取）

```typescript
export async function createDiscussionBySlug(
  slug: string
): Promise<DiscussionInfo | null> {
  // 如果不存在，创建新的discussion
  // 首先获取讨论分类ID
  const categoryQuery = `
      query {
        repository(owner: "${REPO_OWNER}", name: "${REPO_NAME}") {
          discussionCategories(first: 10) {
            nodes {
              id
              name
            }
          }
        }
      }
    `;

  const categoryResponse = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${GITHUB_TOKEN || ''}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: categoryQuery })
  });

  const categoryData = await categoryResponse.json();
  const categories =
    categoryData?.data?.repository?.discussionCategories?.nodes || [];

  // 使用第一个分类，或者特定名称的分类
  const category = categories[0];

  if (!category) {
    console.error('无法获取讨论分类');
    return null;
  }

  // 获取仓库ID
  const repoIdQuery = `
      query {
        repository(owner: "${REPO_OWNER}", name: "${REPO_NAME}") {
          id
        }
      }
    `;

  const repoIdResponse = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${GITHUB_TOKEN || ''}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: repoIdQuery })
  });

  const repoIdData = await repoIdResponse.json();
  const repositoryId = repoIdData?.data?.repository?.id;

  if (!repositoryId) {
    console.error('无法获取仓库ID:', repoIdData?.errors);
    return null;
  }

  // 创建新的discussion
  const createQuery = `
      mutation {
        createDiscussion(input: {
          repositoryId: "${repositoryId}",
          categoryId: "${category.id}",
          body: "这是文章 ${slug} 的评论区",
          title: "${generateDiscussionInfoTitle(slug)}"
        }) {
          discussion {
            id
            number
          }
        }
      }
    `;

  const createResponse = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${GITHUB_TOKEN || ''}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: createQuery })
  });

  const createData = await createResponse.json();
  const newDiscussion = createData?.data?.createDiscussion?.discussion;

  if (newDiscussion) {
    return {
      id: newDiscussion.id,
      number: newDiscussion.number
    };
  }

  console.error('创建讨论失败:', createData?.errors);
  console.error('创建讨论请求详情:', {
    repositoryId,
    categoryId: category.id,
    title: generateDiscussionInfoTitle(slug)
  });

  return null;
}

/**
 * 添加评论到 Discussion
 * @param discussionId Discussion 的 ID
 * @param content 评论内容
 * @param token 用户的 GitHub 访问令牌
 */
export async function addCommentByDiscussionId(
  discussionId: string,
  content: string,
  token: string,
  replyToId?: string
) {
  try {
    const mutation = `
      mutation {
        addDiscussionComment(input: {
          discussionId: "${discussionId}",
          body: "${content.replace(/"/g, '\\"')}"
          ${replyToId ? `, replyToId: "${replyToId}"` : ''}
        }) {
          comment {
            id
            author {
              login
              avatarUrl
              url
            }
            body
            createdAt
            replyTo {
              id
            }
          }
        }
      }
    `;

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: mutation })
    });

    const data = await response.json();

    if (data.errors) {
      console.error('添加评论错误:', data.errors);
      return null;
    }

    const comment = data?.data?.addDiscussionComment?.comment;

    if (comment) {
      return {
        id: comment.id,
        author: {
          login: comment.author?.login || '匿名用户',
          avatarUrl: comment.author?.avatarUrl,
          url: comment.author?.url
        },
        content: comment.body,
        createdAt: comment.createdAt,
        replyToId: comment.replyTo?.id
      };
    }

    return null;
  } catch (error) {
    console.error('添加评论异常:', error);
    return null;
  }
}
```

#### 用户登录系统
技术栈：GitHub OAuth App + Cookie

#### 优化点

1. 使用 NextAuth.js 集成GitHub OAuth
2. 使用 SWR 缓存策略，自动重新获取最新评论
3. 权限控制：仅允许授权用户评论（避免Spam）
4. API限流：GitHub API 每分钟5000次请求限制
5. 敏感词过滤：服务端校验评论内容
6. GitHub Discussions方案替代

### 在线新增博客功能
实现逻辑：

1. 用户通过GitHub登录后，校验用户名是否在白名单

2. 使用GitHub API 提交 PR 到项目仓库

3. 代码合并后通过自动进行重新部署

## 未来优化方向

### 用户体验提升
1. 暗黑模式：基于 tailwindcss 完成动态主题切换

2. 全文搜索：Algolia集成或本地Fuse.js方案对比

3. 交互增强：TOC（目录）自动生成与滚动追踪

### 技术强化
1. 增量静态再生（ISR）：动态内容更新策略

2. Edge Runtime：关键API的边缘化部署

3. 性能监控：接入Vercel Analytics或自定义Lighthouse检查

### 内容生态扩展
1. MDX支持：在博文中嵌入React组件

## 结语

这次升级不仅是技术的迭代，更是开发思维的转变——从静态内容发布者到动态应用设计者的角色进化。
