import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN
});

const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER || 'LZS911';
const repo = process.env.NEXT_PUBLIC_REPO_NAME || 'LZS911.github.io';

export async function createPullRequest({
  title,
  content,
  path
}: {
  title: string;
  content: string;
  path: string;
}) {
  try {
    // 获取默认分支的最新提交
    const { data: ref } = await octokit.git.getRef({
      owner,
      repo,
      ref: 'heads/main'
    });

    // 创建新分支
    const branchName = `algorithm-post-${Date.now()}`;
    await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: ref.object.sha
    });

    // 创建文件
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `feat: ${title}`,
      content: Buffer.from(content).toString('base64'),
      branch: branchName
    });

    // 创建 PR
    const { data: pr } = await octokit.pulls.create({
      owner,
      repo,
      title,
      head: branchName,
      base: 'main',
      body: 'auto create pr'
    });

    return { url: pr.html_url };
  } catch (error) {
    console.error('创建 PR 失败:', error);
    throw new Error('创建 PR 失败');
  }
}
