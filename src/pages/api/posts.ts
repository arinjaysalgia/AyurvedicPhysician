import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { authenticate, CORS_HEADERS } from '../../lib/auth';
import type { BlogPost, BlogPostSummary } from '../../data/blog-types';

export const prerender = false;

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

export const OPTIONS: APIRoute = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};

export const GET: APIRoute = async ({ request }) => {
  if (!(await authenticate(request, (env as any).JWT_SECRET))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS });
  }

  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');
  const kv = (env as any).BLOG_KV as KVNamespace;

  if (slug) {
    const post = await kv.get(`post:${slug}`, 'json');
    if (!post) {
      return Response.json({ error: 'Not found' }, { status: 404, headers: CORS_HEADERS });
    }
    return Response.json(post, { headers: CORS_HEADERS });
  }

  const status = url.searchParams.get('status');
  const indexRaw = await kv.get('posts:index', 'json');
  let posts = (indexRaw as any[]) || [];
  if (status) {
    posts = posts.filter((p: any) => p.status === status);
  }
  return Response.json(posts, { headers: CORS_HEADERS });
};

export const POST: APIRoute = async ({ request }) => {
  if (!(await authenticate(request, (env as any).JWT_SECRET))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS });
  }

  const kv = (env as any).BLOG_KV as KVNamespace;
  const data = (await request.json()) as Partial<BlogPost>;
  if (!data.title?.trim() || !data.slug?.trim() || !data.content?.trim()) {
    return Response.json(
      { error: 'Title, slug, and content are required.' },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const existing = await kv.get(`post:${data.slug}`);
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

  await kv.put(`post:${post.slug}`, JSON.stringify(post));
  await rebuildIndex(kv);
  await updateCategoryList(kv);
  await updateTagList(kv);

  return Response.json(post, { status: 201, headers: CORS_HEADERS });
};

export const PUT: APIRoute = async ({ request }) => {
  if (!(await authenticate(request, (env as any).JWT_SECRET))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS });
  }

  const kv = (env as any).BLOG_KV as KVNamespace;
  const data = (await request.json()) as Partial<BlogPost>;
  if (!data.slug?.trim()) {
    return Response.json({ error: 'Slug is required.' }, { status: 400, headers: CORS_HEADERS });
  }

  const existing = await kv.get(`post:${data.slug}`, 'json');
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

  await kv.put(`post:${updated.slug}`, JSON.stringify(updated));
  await rebuildIndex(kv);
  await updateCategoryList(kv);
  await updateTagList(kv);

  return Response.json(updated, { headers: CORS_HEADERS });
};

export const DELETE: APIRoute = async ({ request }) => {
  if (!(await authenticate(request, (env as any).JWT_SECRET))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS });
  }

  const kv = (env as any).BLOG_KV as KVNamespace;
  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');
  if (!slug) {
    return Response.json({ error: 'Slug is required.' }, { status: 400, headers: CORS_HEADERS });
  }

  await kv.delete(`post:${slug}`);
  await rebuildIndex(kv);
  await updateCategoryList(kv);
  await updateTagList(kv);

  return Response.json({ deleted: slug }, { headers: CORS_HEADERS });
};
