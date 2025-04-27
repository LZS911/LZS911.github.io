import { Octokit } from '@octokit/rest';
import { getImageUploader, ImageInfo } from './image-upload';

const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN
});

const owner = process.env.NEXT_PUBLIC_GITHUB_OWNER || 'LZS911';
const repo = process.env.NEXT_PUBLIC_REPO_NAME || 'LZS911.github.io';

/**
 * 从Markdown内容中提取图片路径
 * @param content Markdown内容
 */
export function extractImagesFromMarkdown(content: string): string[] {
  // 匹配Markdown中的图片语法 ![alt](url)
  const imageRegex = /!\[.*?\]\((.*?)\)/g;
  const images: string[] = [];
  let match;

  while ((match = imageRegex.exec(content)) !== null) {
    // 获取图片URL，去除可能的#后面的实际路径部分
    const imageUrl = match[1].split('#')[0];
    images.push(imageUrl);
  }

  return images;
}

/**
 * 创建一个新的分支
 */
async function createNewBranch(baseBranch = 'main'): Promise<string> {
  // 获取默认分支的最新提交
  const { data: ref } = await octokit.git.getRef({
    owner,
    repo,
    ref: `heads/${baseBranch}`
  });

  // 创建新分支
  const branchName = `blog-post-${Date.now()}`;
  await octokit.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${branchName}`,
    sha: ref.object.sha
  });

  return branchName;
}

/**
 * 上传图片到GitHub仓库
 */
async function uploadImagesToGitHub(
  images: ImageInfo[],
  branchName: string
): Promise<{ success: boolean; uploadedPaths: string[] }> {
  const uploadedPaths: string[] = [];

  try {
    // 先上传所有图片
    for (const image of images) {
      if (!image.content) {
        console.error(`图片 ${image.name} 没有内容，跳过上传`);
        continue;
      }

      const targetPath = `public/assets/blog/posts/${image.name}`;

      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: targetPath,
        message: `chore: upload image ${image.name}`,
        content: image.content,
        branch: branchName
      });

      uploadedPaths.push(targetPath);
    }

    return { success: true, uploadedPaths };
  } catch (error) {
    console.error('上传图片失败:', error);
    return { success: false, uploadedPaths };
  }
}

/**
 * 创建文章文件
 */
async function createArticleFile(
  title: string,
  content: string,
  path: string,
  branchName: string
): Promise<boolean> {
  try {
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `feat: add article "${title}"`,
      content: Buffer.from(content).toString('base64'),
      branch: branchName
    });

    return true;
  } catch (error) {
    console.error('创建文章文件失败:', error);
    return false;
  }
}

/**
 * 创建Pull Request
 */
async function createGitHubPR(
  title: string,
  branchName: string,
  imageCount: number
): Promise<{ success: boolean; url?: string }> {
  try {
    const { data: pr } = await octokit.pulls.create({
      owner,
      repo,
      title: `Blog: ${title}`,
      head: branchName,
      base: 'main',
      body: `添加新博客文章: ${title}${imageCount > 0 ? `\n\n包含 ${imageCount} 张图片` : ''}`
    });

    return { success: true, url: pr.html_url };
  } catch (error) {
    console.error('创建 PR 失败:', error);
    return { success: false };
  }
}

/**
 * 创建Pull Request，包括图片和文章内容
 */
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
    // 1. 创建新分支
    const branchName = await createNewBranch();

    // 2. 获取上传的临时图片
    const imageUploader = getImageUploader();
    const uploadedImages = imageUploader.getUploadedImages();

    // 3. 先上传所有图片
    const { success: uploadSuccess, uploadedPaths } =
      await uploadImagesToGitHub(uploadedImages, branchName);

    if (!uploadSuccess && uploadedImages.length > 0) {
      throw new Error('上传图片失败');
    }

    // 4. 创建文章文件
    const articleSuccess = await createArticleFile(
      title,
      content,
      path,
      branchName
    );

    if (!articleSuccess) {
      throw new Error('创建文章文件失败');
    }

    // 5. 创建 PR
    const { success: prSuccess, url } = await createGitHubPR(
      title,
      branchName,
      uploadedImages.length
    );

    if (!prSuccess) {
      throw new Error('创建 PR 失败');
    }

    // 6. 清空临时图片记录
    imageUploader.clearUploadedImages();

    // 清理临时预览（可以在服务器端API中实现）
    try {
      await fetch('/api/preview/cleanup', { method: 'POST' });
    } catch (error) {
      console.warn('清理预览失败，但不影响主流程:', error);
    }

    return {
      url,
      uploadedImages: uploadedPaths
    };
  } catch (error) {
    console.error('创建 PR 失败:', error);
    throw new Error('创建 PR 失败');
  }
}
