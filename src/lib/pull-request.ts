import { Octokit } from '@octokit/rest';
import { getImageUploader } from './image-upload';

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

    // 获取上传的临时图片
    const imageUploader = getImageUploader();
    const uploadedImages = imageUploader.getUploadedImages();

    // 先上传所有图片
    for (const image of uploadedImages) {
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: image.path,
        message: `feat: upload image ${image.name}`,
        content: image.content,
        branch: branchName
      });
    }

    // 创建文章文件
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
      body: `auto create pr${uploadedImages.length > 0 ? ` with ${uploadedImages.length} images` : ''}`
    });

    // 清空临时图片记录
    imageUploader.clearUploadedImages();

    return { url: pr.html_url };
  } catch (error) {
    console.error('创建 PR 失败:', error);
    throw new Error('创建 PR 失败');
  }
}
