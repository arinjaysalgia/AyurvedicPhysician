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
  const raw = await kv.get('tags:list', 'json');
  return Response.json(raw || [], { headers: CORS_HEADERS });
};

export const POST: APIRoute = async ({ request }) => {
  if (!(await authenticate(request, (env as any).JWT_SECRET))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS });
  }

  const { tag } = (await request.json()) as { tag: string };
  if (!tag?.trim()) {
    return Response.json({ error: 'Tag name is required.' }, { status: 400, headers: CORS_HEADERS });
  }

  const kv = (env as any).BLOG_KV as KVNamespace;
  const raw = await kv.get('tags:list', 'json');
  const tags: string[] = (raw as string[]) || [];
  const trimmed = tag.trim();
  if (!tags.includes(trimmed)) {
    tags.push(trimmed);
    tags.sort();
    await kv.put('tags:list', JSON.stringify(tags));
  }

  return Response.json(tags, { status: 201, headers: CORS_HEADERS });
};

export const DELETE: APIRoute = async ({ request }) => {
  if (!(await authenticate(request, (env as any).JWT_SECRET))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS });
  }

  const url = new URL(request.url);
  const tag = url.searchParams.get('tag');
  if (!tag) {
    return Response.json({ error: 'Tag is required.' }, { status: 400, headers: CORS_HEADERS });
  }

  const kv = (env as any).BLOG_KV as KVNamespace;
  const raw = await kv.get('tags:list', 'json');
  const tags: string[] = (raw as string[]) || [];
  const filtered = tags.filter((t) => t !== tag);
  await kv.put('tags:list', JSON.stringify(filtered));

  return Response.json(filtered, { headers: CORS_HEADERS });
};
