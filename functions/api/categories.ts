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

  const raw = await env.BLOG_KV.get('categories:list', 'json');
  return Response.json(raw || [], { headers: CORS_HEADERS });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await authenticate(request, env.JWT_SECRET))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS });
  }

  const { category } = (await request.json()) as { category: string };
  if (!category?.trim()) {
    return Response.json({ error: 'Category name is required.' }, { status: 400, headers: CORS_HEADERS });
  }

  const raw = await env.BLOG_KV.get('categories:list', 'json');
  const cats: string[] = (raw as string[]) || [];
  const trimmed = category.trim();
  if (!cats.includes(trimmed)) {
    cats.push(trimmed);
    cats.sort();
    await env.BLOG_KV.put('categories:list', JSON.stringify(cats));
  }

  return Response.json(cats, { status: 201, headers: CORS_HEADERS });
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await authenticate(request, env.JWT_SECRET))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS });
  }

  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  if (!category) {
    return Response.json({ error: 'Category is required.' }, { status: 400, headers: CORS_HEADERS });
  }

  const raw = await env.BLOG_KV.get('categories:list', 'json');
  const cats: string[] = (raw as string[]) || [];
  const filtered = cats.filter((c) => c !== category);
  await env.BLOG_KV.put('categories:list', JSON.stringify(filtered));

  return Response.json(filtered, { headers: CORS_HEADERS });
};
