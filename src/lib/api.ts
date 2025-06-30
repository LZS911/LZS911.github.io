import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import PostType, { Items } from '@/types/post';
import {
  generateSlugHash,
  getOriginalSlugByHash,
  isHashSlug,
  getHashByOriginalSlug
} from './slug-mapper';

const postsDirectory = join(process.cwd(), '_posts');

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

/**
 * 根据 slug (hash 或原始文件名) 获取文章数据
 */
export function getPostBySlug(
  slug: string,
  fields: Array<keyof PostType> = []
) {
  let realSlug: string;
  let hashSlug: string;

  // 解码 slug 以处理可能的 URL 编码（例如中文字符）
  const decodedSlug = decodeURIComponent(slug);

  if (isHashSlug(decodedSlug)) {
    // 如果是 hash 格式，获取原始文件名
    const originalSlug = getOriginalSlugByHash(decodedSlug);
    if (!originalSlug) {
      throw new Error(`Post not found for hash: ${decodedSlug}`);
    }
    realSlug = originalSlug;
    hashSlug = decodedSlug;
  } else {
    // 如果是原始文件名格式
    realSlug = decodedSlug.replace(/\.md$/, '');
    const hash = getHashByOriginalSlug(realSlug);
    hashSlug = hash || generateSlugHash(realSlug + '.md');
  }

  const fullPath = join(postsDirectory, `${realSlug}.md`);

  // 检查文件是否存在
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post file not found: ${fullPath}`);
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const items: Items = {};

  fields.forEach((field) => {
    if (field === 'slug') {
      // 优先返回 hash 格式的 slug
      items[field] = hashSlug;
    }
    if (field === 'content') {
      items[field] = content;
    }

    if (typeof data[field] !== 'undefined') {
      items[field] = data[field];
    }
  });

  // 添加原始 slug 和 hash slug 的信息，用于向后兼容
  if (fields.includes('slug')) {
    items.originalSlug = realSlug;
    items.hashSlug = hashSlug;
  }

  return items;
}

/**
 * 获取所有文章，默认使用 hash 作为 slug
 */
export function getAllPosts(fields: Array<keyof PostType> = []) {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((filename) => {
      const hash = generateSlugHash(filename);
      return getPostBySlug(hash, fields);
    })
    .sort((post1, post2) => ((post1?.date ?? 0) > (post2?.date ?? 0) ? -1 : 1));
  return posts;
}

/**
 * 检查给定的 slug 是否存在（支持 hash 和原始文件名）
 */
export function postExists(slug: string): boolean {
  try {
    getPostBySlug(slug, ['title']);
    return true;
  } catch {
    return false;
  }
}
