import { verifyJWT } from './auth';

interface Env {
  BLOG_KV: KVNamespace;
  JWT_SECRET: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function authenticate(request: Request, secret: string): Promise<boolean> {
  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return false;
  return verifyJWT(auth.slice(7), secret);
}

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await authenticate(request, env.JWT_SECRET))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS });
  }

  const raw = await env.BLOG_KV.get('tags:list', 'json');
  return Response.json(raw || [], { headers: CORS_HEADERS });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await authenticate(request, env.JWT_SECRET))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS });
  }

  const { tag } = (await request.json()) as { tag: string };
  if (!tag?.trim()) {
    return Response.json({ error: 'Tag name is required.' }, { status: 400, headers: CORS_HEADERS });
  }

  const raw = await env.BLOG_KV.get('tags:list', 'json');
  const tags: string[] = (raw as string[]) || [];
  const trimmed = tag.trim();
  if (!tags.includes(trimmed)) {
    tags.push(trimmed);
    tags.sort();
    await env.BLOG_KV.put('tags:list', JSON.stringify(tags));
  }

  return Response.json(tags, { status: 201, headers: CORS_HEADERS });
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await authenticate(request, env.JWT_SECRET))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS });
  }

  const url = new URL(request.url);
  const tag = url.searchParams.get('tag');
  if (!tag) {
    return Response.json({ error: 'Tag is required.' }, { status: 400, headers: CORS_HEADERS });
  }

  const raw = await env.BLOG_KV.get('tags:list', 'json');
  const tags: string[] = (raw as string[]) || [];
  const filtered = tags.filter((t) => t !== tag);
  await env.BLOG_KV.put('tags:list', JSON.stringify(filtered));

  return Response.json(filtered, { headers: CORS_HEADERS });
};
