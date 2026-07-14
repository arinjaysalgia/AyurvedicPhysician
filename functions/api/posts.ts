import { verifyJWT } from './auth';
import type { BlogPost, BlogPostSummary } from '../../src/data/blog-types';

interface Env {
  BLOG_KV: KVNamespace;
  JWT_SECRET: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function authenticate(request: Request, secret: string): Promise<boolean> {
  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return false;
  return verifyJWT(auth.slice(7), secret);
}

function toSummary(post: BlogPost): BlogPostSummary {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    category: post.category,
    publishDate: post.publishDate,
    readTime: post.readTime,
    author: post.author,
  };
}

async function rebuildIndex(kv: KVNamespace): Promise<void> {
  const list = await kv.list({ prefix: 'post:' });
  const summaries: (BlogPostSummary & { status: string })[] = [];
  for (const key of list.keys) {
    const raw = await kv.get(key.name, 'json');
    if (raw) {
      const post = raw as BlogPost;
      summaries.push({ ...toSummary(post), status: post.status });
    }
  }
  summaries.sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
  await kv.put('posts:index', JSON.stringify(summaries));
}

async function updateCategoryList(kv: KVNamespace): Promise<void> {
  const list = await kv.list({ prefix: 'post:' });
  const cats = new Set<string>();
  for (const key of list.keys) {
    const raw = await kv.get(key.name, 'json');
    if (raw) cats.add((raw as BlogPost).category);
  }
  await kv.put('categories:list', JSON.stringify([...cats].sort()));
}

async function updateTagList(kv: KVNamespace): Promise<void> {
  const list = await kv.list({ prefix: 'post:' });
  const tags = new Set<string>();
  for (const key of list.keys) {
    const raw = await kv.get(key.name, 'json');
    if (raw) (raw as BlogPost).tags.forEach((t) => tags.add(t));
  }
  await kv.put('tags:list', JSON.stringify([...tags].sort()));
}

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await authenticate(request, env.JWT_SECRET))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS });
  }

  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');

  if (slug) {
    const post = await env.BLOG_KV.get(`post:${slug}`, 'json');
    if (!post) {
      return Response.json({ error: 'Not found' }, { status: 404, headers: CORS_HEADERS });
    }
    return Response.json(post, { headers: CORS_HEADERS });
  }

  const status = url.searchParams.get('status');
  const indexRaw = await env.BLOG_KV.get('posts:index', 'json');
  let posts = (indexRaw as any[]) || [];
  if (status) {
    posts = posts.filter((p: any) => p.status === status);
  }
  return Response.json(posts, { headers: CORS_HEADERS });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await authenticate(request, env.JWT_SECRET))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS });
  }

  const data = (await request.json()) as Partial<BlogPost>;
  if (!data.title?.trim() || !data.slug?.trim() || !data.content?.trim()) {
    return Response.json(
      { error: 'Title, slug, and content are required.' },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const existing = await env.BLOG_KV.get(`post:${data.slug}`);
  if (existing) {
    return Response.json(
      { error: 'Slug already exists.' },
      { status: 409, headers: CORS_HEADERS }
    );
  }

  const now = new Date().toISOString();
  const wordCount = data.content.trim().split(/\s+/).length;
  const post: BlogPost = {
    slug: data.slug,
    title: data.title.trim(),
    content: data.content,
    excerpt: data.excerpt || data.content.replace(/[#*_~`>\-\[\]()!]/g, '').trim().slice(0, 160) + '...',
    featuredImage: data.featuredImage || '',
    category: data.category || 'Uncategorized',
    tags: data.tags || [],
    author: data.author || 'Dr. Pradnya Chittawadagi',
    status: data.status || 'draft',
    publishDate: data.publishDate || now,
    scheduledDate: data.scheduledDate,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    createdAt: now,
    updatedAt: now,
    readTime: Math.max(1, Math.ceil(wordCount / 200)),
  };

  await env.BLOG_KV.put(`post:${post.slug}`, JSON.stringify(post));
  await rebuildIndex(env.BLOG_KV);
  await updateCategoryList(env.BLOG_KV);
  await updateTagList(env.BLOG_KV);

  return Response.json(post, { status: 201, headers: CORS_HEADERS });
};

export const onRequestPut: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await authenticate(request, env.JWT_SECRET))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS });
  }

  const data = (await request.json()) as Partial<BlogPost>;
  if (!data.slug?.trim()) {
    return Response.json({ error: 'Slug is required.' }, { status: 400, headers: CORS_HEADERS });
  }

  const existing = await env.BLOG_KV.get(`post:${data.slug}`, 'json');
  if (!existing) {
    return Response.json({ error: 'Not found' }, { status: 404, headers: CORS_HEADERS });
  }

  const prev = existing as BlogPost;
  const wordCount = (data.content || prev.content).trim().split(/\s+/).length;
  const updated: BlogPost = {
    ...prev,
    ...data,
    updatedAt: new Date().toISOString(),
    readTime: Math.max(1, Math.ceil(wordCount / 200)),
  };

  await env.BLOG_KV.put(`post:${updated.slug}`, JSON.stringify(updated));
  await rebuildIndex(env.BLOG_KV);
  await updateCategoryList(env.BLOG_KV);
  await updateTagList(env.BLOG_KV);

  return Response.json(updated, { headers: CORS_HEADERS });
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await authenticate(request, env.JWT_SECRET))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS });
  }

  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');
  if (!slug) {
    return Response.json({ error: 'Slug is required.' }, { status: 400, headers: CORS_HEADERS });
  }

  await env.BLOG_KV.delete(`post:${slug}`);
  await rebuildIndex(env.BLOG_KV);
  await updateCategoryList(env.BLOG_KV);
  await updateTagList(env.BLOG_KV);

  return Response.json({ deleted: slug }, { headers: CORS_HEADERS });
};
