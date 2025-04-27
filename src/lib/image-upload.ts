export interface ImageInfo {
  path: string;
  content: string;
  name: string;
  blobUrl?: string;
}

// 使用接口以便后续可以轻松替换不同的存储实现
export interface ImageUploader {
  uploadImage: (file: File | Blob, fileName?: string) => Promise<string>;
  getUploadedImages: () => ImageInfo[];
  clearUploadedImages: () => void;
  deleteImage: (imagePath: string) => void;
  restoreImages: (images: ImageInfo[]) => Promise<void>;
  addRestoredImage: (image: ImageInfo) => void;
}

// 使用服务器 API 存储图片的实现
export class FileSystemImageUploader implements ImageUploader {
  // 存储已上传的临时图片信息，等待发布文章时一起提交
  private uploadedImages: ImageInfo[] = [];

  async uploadImage(file: File | Blob, fileName?: string): Promise<string> {
    try {
      // 生成文件名
      const timestamp = Date.now();
      const generatedFileName = fileName || `image-${timestamp}.png`;

      // 创建 FormData 对象用于上传
      const formData = new FormData();
      formData.append('image', file, generatedFileName);

      // 发送到服务器 API
      const response = await fetch('/api/images', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('服务器端图片上传失败');
      }

      const result = await response.json();

      // 存储图片信息
      const imageInfo: ImageInfo = {
        path: result.url,
        content: '', // 不再存储内容，只存储引用
        name: result.fileName,
        blobUrl: result.url
      };
      this.uploadedImages.push(imageInfo);

      // 返回服务器URL
      return result.url + '#' + `/assets/blog/posts/${result.fileName}`;
    } catch (error) {
      console.error('处理图片失败:', error);
      throw new Error('处理图片失败');
    }
  }

  // 删除指定图片
  deleteImage(imagePath: string): void {
    // 获取实际路径（去除#后面的部分）
    const actualPath = imagePath.split('#')[0];

    // 找到要删除的图片索引
    const index = this.uploadedImages.findIndex(
      (img) => img.path === actualPath || img.blobUrl === actualPath
    );

    if (index !== -1) {
      // 从数组中删除
      this.uploadedImages.splice(index, 1);

      // 尝试通知服务器删除（这里可以添加一个删除API请求）
      // TODO: 实现服务器端删除
    }
  }

  // 恢复已上传的图片（用于持久化）
  async restoreImages(images: ImageInfo[]): Promise<void> {
    // 清空现有图片
    this.clearUploadedImages();

    // 恢复数据结构
    this.uploadedImages = [...images];
  }

  // 获取所有已上传的临时图片
  getUploadedImages() {
    return [...this.uploadedImages];
  }

  // 清空临时图片记录
  clearUploadedImages() {
    this.uploadedImages = [];
  }

  // 添加单个恢复图片
  addRestoredImage(image: ImageInfo): void {
    this.uploadedImages.push(image);
  }
}

// 创建一个工厂函数来获取当前使用的上传器
// 使用单例模式确保整个应用使用同一个上传器实例
let imageUploaderInstance: ImageUploader | null = null;

export function getImageUploader(): ImageUploader {
  if (imageUploaderInstance) {
    return imageUploaderInstance;
  }

  imageUploaderInstance = new FileSystemImageUploader();

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

// 帮助函数: 转义正则表达式中的特殊字符
export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 将临时 Blob URL 替换为实际路径
export function replaceImageUrls(markdownContent: string): string {
  // 匹配模式: ![any-text](url#actual-path)
  // URL可能是Blob URL或者API URL
  const imageRegex = /!\[(.*?)\]\((.*?)#([^)]+)\)/g;

  return markdownContent.replace(imageRegex, (match, alt, url, actualPath) => {
    // 确保路径以/开头
    const normalizedPath = actualPath.startsWith('/')
      ? actualPath
      : `/${actualPath}`;

    // 构建完整的GitHub路径
    return `![${alt || 'image'}](${normalizedPath})`;
  });
}
