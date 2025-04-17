/* eslint-disable @typescript-eslint/no-explicit-any */
// GitHub Discussions API 交互库

// GitHub OAuth 应用配置
// 注意：实际使用时需要在环境变量中配置这些值
// 对于GitHub Pages部署，需要在GitHub仓库的Settings -> Secrets and variables -> Actions中添加这些环境变量
const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GH_CLIENT_SECRET;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // 用于API认证的GitHub个人访问令牌
const REPO_OWNER = 'LZS911'; // GitHub 用户名
const REPO_NAME = 'LZS911.github.io'; // 仓库名

const generateDiscussionInfoTitle = (slug: string) => `Comments for: ${slug}`;

// 获取文章对应的 Discussion
type DiscussionInfo = {
  id: string;
  number: number;
};

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
 * 获取 Discussion 的评论
 * @param discussionId Discussion 的 ID
 */
export async function getComments(discussionId: string) {
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

/**
 * 添加评论到 Discussion
 * @param discussionId Discussion 的 ID
 * @param content 评论内容
 * @param token 用户的 GitHub 访问令牌
 */
export async function addComment(
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

/**
 * GitHub OAuth 登录 URL
 */
export function getGitHubOAuthURL() {
  const redirectUri =
    typeof window !== 'undefined'
      ? `${window.location.origin}/api/auth/github/callback`
      : '';

  return `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=public_repo`;
}

/**
 * 使用授权码获取访问令牌
 * @param code GitHub OAuth 授权码
 */
export async function getAccessToken(code: string) {
  try {
    const response = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error('获取访问令牌错误:', data.error);
      return null;
    }

    return data.access_token;
  } catch (error) {
    console.error('获取访问令牌异常:', error);
    return null;
  }
}

/**
 * 获取用户信息
 * @param token GitHub 访问令牌
 */
export async function getUserInfo(token: string) {
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      console.error('获取用户信息失败:', response.statusText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('获取用户信息异常:', error);
    return null;
  }
}
