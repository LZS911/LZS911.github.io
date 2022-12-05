import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import PostType, { Items } from "../interfaces/post";

const postsDirectory = join(process.cwd(), "_posts");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(
  slug: string,
  fields: Array<keyof PostType> = []
) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const items: Items = {};

  fields.forEach((field) => {
    if (field === "slug") {
      items[field] = realSlug;
    }
    if (field === "content") {
      items[field] = content;
    }

    if (typeof data[field] !== "undefined") {
      (items[field] as any) = data[field];
    }
  });

  return items;
}

export function getAllPosts(fields: Array<keyof PostType> = []) {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    .sort((post1, post2) => ((post1?.date ?? 0) > (post2?.date ?? 0) ? -1 : 1));
  return posts;
}
