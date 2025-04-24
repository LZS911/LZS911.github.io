import { Octokit } from '@octokit/rest';

// 使用接口以便后续可以轻松替换不同的存储实现
export interface ImageUploader {
  uploadImage: (file: File | Blob, fileName?: string) => Promise<string>;
  getUploadedImages: () => { path: string; content: string; name: string }[];
  clearUploadedImages: () => void;
}

export class GitHubImageUploader implements ImageUploader {
  private octokit: Octokit;
  private owner: string;
  private repo: string;
  private imagesPath: string;
  // 存储已上传的临时图片信息，等待发布文章时一起提交
  private uploadedImages: { path: string; content: string; name: string }[] =
    [];

  constructor(config?: {
    auth?: string;
    owner?: string;
    repo?: string;
    imagesPath?: string;
  }) {
    this.octokit = new Octokit({
      auth: config?.auth || process.env.NEXT_PUBLIC_GITHUB_TOKEN
    });
    this.owner =
      config?.owner || process.env.NEXT_PUBLIC_GITHUB_OWNER || 'LZS911';
    this.repo =
      config?.repo || process.env.NEXT_PUBLIC_REPO_NAME || 'LZS911.github.io';
    this.imagesPath = config?.imagesPath || 'public/assets/blog/posts';
  }

  async uploadImage(file: File | Blob, fileName?: string): Promise<string> {
    try {
      // 生成文件名
      const timestamp = Date.now();
      const generatedFileName = fileName || `image-${timestamp}.png`;
      const path = `${this.imagesPath}/${generatedFileName}`;

      // 读取文件内容
      const arrayBuffer = await file.arrayBuffer();
      const content = Buffer.from(arrayBuffer).toString('base64');

      // 存储图片信息，但不立即上传到 GitHub
      this.uploadedImages.push({
        path,
        content,
        name: generatedFileName
      });

      // 返回临时图片URL供预览
      // 这里创建了一个 Blob URL 用于本地预览，它在当前会话中有效
      const blob = new Blob([new Uint8Array(arrayBuffer)], {
        type: 'image/png'
      });
      const blobUrl = URL.createObjectURL(blob);

      // 同时记录最终的图片路径，用于发布文章时替换
      return blobUrl + '#' + `/assets/blog/posts/${generatedFileName}`;
    } catch (error) {
      console.error('处理图片失败:', error);
      throw new Error('处理图片失败');
    }
  }

  // 获取所有已上传的临时图片
  getUploadedImages() {
    return [...this.uploadedImages];
  }

  // 清空临时图片记录
  clearUploadedImages() {
    this.uploadedImages = [];
  }
}

// 创建一个工厂函数来获取当前使用的上传器
// 使用单例模式确保整个应用使用同一个上传器实例
let imageUploaderInstance: ImageUploader | null = null;

export function getImageUploader(): ImageUploader {
  if (imageUploaderInstance) {
    return imageUploaderInstance;
  }

  // 可以根据环境变量或其他配置决定使用哪个上传器
  // 例如，可以根据环境变量 STORAGE_TYPE 选择不同的上传器
  const storageType = process.env.NEXT_PUBLIC_STORAGE_TYPE || 'github';

  switch (storageType.toLowerCase()) {
    case 'github':
    default:
      imageUploaderInstance = new GitHubImageUploader();
      break;
  }

  return imageUploaderInstance;
}

// Markdown辅助函数
export function insertImageToMarkdown(
  content: string,
  imageUrl: string,
  cursorPosition: number
): string {
  // 分离 Blob URL 和实际路径
  const [blobUrl, actualPath] = imageUrl.split('#');
  // 使用 Blob URL 作为图片源，但在 alt 文本中存储实际路径
  const markdownImage = `![${actualPath || 'image'}](${blobUrl})`;

  if (cursorPosition >= 0 && cursorPosition <= content.length) {
    return (
      content.slice(0, cursorPosition) +
      markdownImage +
      content.slice(cursorPosition)
    );
  }

  // 如果没有提供有效的光标位置，就添加到文本末尾
  return content + '\n' + markdownImage;
}

// 将临时 Blob URL 替换为实际路径
export function replaceImageUrls(markdownContent: string): string {
  // 匹配模式: ![any-text](blob-url#actual-path)
  const imageRegex = /!\[(.*?)\]\((blob:[^#]+)#([^)]+)\)/g;
  return markdownContent.replace(imageRegex, (match, alt, blob, actualPath) => {
    return `![image](${actualPath})`;
  });
}
