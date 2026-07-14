import type { BlogPost, BlogPostSummary } from './blog-types';

export interface BlogKV {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: { prefix?: string }): Promise<{ keys: { name: string }[] }>;
}

export async function getPost(kv: BlogKV, slug: string): Promise<BlogPost | null> {
  const data = await kv.get(`post:${slug}`);
  if (!data) return null;
  return JSON.parse(data) as BlogPost;
}

export async function getPublishedPosts(kv: BlogKV): Promise<BlogPostSummary[]> {
  const data = await kv.get('posts:index');
  if (!data) return [];
  const posts = JSON.parse(data) as BlogPostSummary[];
  return posts.sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}

export async function getPublishedPostsByCategory(
  kv: BlogKV,
  category: string
): Promise<BlogPostSummary[]> {
  const posts = await getPublishedPosts(kv);
  return posts.filter((p) => p.category === category);
}

export async function getCategories(kv: BlogKV): Promise<string[]> {
  const data = await kv.get('categories:list');
  if (!data) return [];
  return JSON.parse(data) as string[];
}

export async function getTags(kv: BlogKV): Promise<string[]> {
  const data = await kv.get('tags:list');
  if (!data) return [];
  return JSON.parse(data) as string[];
}

export async function getRelatedPosts(
  kv: BlogKV,
  currentSlug: string,
  category: string,
  limit = 3
): Promise<BlogPostSummary[]> {
  const posts = await getPublishedPosts(kv);
  return posts
    .filter((p) => p.slug !== currentSlug)
    .filter((p) => p.category === category)
    .slice(0, limit);
}
