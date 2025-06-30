import { createHash } from 'crypto';
import fs from 'fs';
import { join } from 'path';

const postsDirectory = join(process.cwd(), '_posts');

const HASH_LENGTH = 24;

/**
 * 生成文件名的 hash 值
 */
export function generateSlugHash(filename: string): string {
  // 移除 .md 后缀
  const cleanFilename = filename.replace(/\.md$/, '');
  // 使用 SHA-256 生成 hash，取前 8 位作为短 hash
  return createHash('sha256')
    .update(cleanFilename)
    .digest('hex')
    .substring(0, HASH_LENGTH);
}

/**
 * 获取所有文章的 slug 映射表
 * 返回 { hash: originalFilename } 的映射
 */
export function getSlugMapping(): Record<string, string> {
  const slugs = fs.readdirSync(postsDirectory);
  const mapping: Record<string, string> = {};

  slugs.forEach((filename) => {
    const hash = generateSlugHash(filename);
    const originalSlug = filename.replace(/\.md$/, '');
    mapping[hash] = originalSlug;
  });

  return mapping;
}

/**
 * 根据 hash 获取原始文件名
 */
export function getOriginalSlugByHash(hash: string): string | null {
  const mapping = getSlugMapping();
  return mapping[hash] || null;
}

/**
 * 根据原始文件名获取 hash
 */
export function getHashByOriginalSlug(originalSlug: string): string | null {
  const mapping = getSlugMapping();
  for (const [hash, slug] of Object.entries(mapping)) {
    if (slug === originalSlug) {
      return hash;
    }
  }
  return null;
}

/**
 * 检查 slug 是否为 hash 格式（8位16进制字符）
 */
export function isHashSlug(slug: string): boolean {
  return new RegExp(`^[a-f0-9]{${HASH_LENGTH}}$`).test(slug);
}
