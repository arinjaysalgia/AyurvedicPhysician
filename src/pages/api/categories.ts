import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { authenticate, CORS_HEADERS } from '../../lib/auth';

export const prerender = false;

export const OPTIONS: APIRoute = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};

export const GET: APIRoute = async ({ request }) => {
  if (!(await authenticate(request, (env as any).JWT_SECRET))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS });
  }

  const kv = (env as any).BLOG_KV as KVNamespace;
  const raw = await kv.get('categories:list', 'json');
  return Response.json(raw || [], { headers: CORS_HEADERS });
};

export const POST: APIRoute = async ({ request }) => {
  if (!(await authenticate(request, (env as any).JWT_SECRET))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS });
  }

  const { category } = (await request.json()) as { category: string };
  if (!category?.trim()) {
    return Response.json({ error: 'Category name is required.' }, { status: 400, headers: CORS_HEADERS });
  }

  const kv = (env as any).BLOG_KV as KVNamespace;
  const raw = await kv.get('categories:list', 'json');
  const cats: string[] = (raw as string[]) || [];
  const trimmed = category.trim();
  if (!cats.includes(trimmed)) {
    cats.push(trimmed);
    cats.sort();
    await kv.put('categories:list', JSON.stringify(cats));
  }

  return Response.json(cats, { status: 201, headers: CORS_HEADERS });
};

export const DELETE: APIRoute = async ({ request }) => {
  if (!(await authenticate(request, (env as any).JWT_SECRET))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS });
  }

  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  if (!category) {
    return Response.json({ error: 'Category is required.' }, { status: 400, headers: CORS_HEADERS });
  }

  const kv = (env as any).BLOG_KV as KVNamespace;
  const raw = await kv.get('categories:list', 'json');
  const cats: string[] = (raw as string[]) || [];
  const filtered = cats.filter((c) => c !== category);
  await kv.put('categories:list', JSON.stringify(filtered));

  return Response.json(filtered, { headers: CORS_HEADERS });
};
