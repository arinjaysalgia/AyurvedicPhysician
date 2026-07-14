import { verifyJWT } from './auth';

interface Env {
  BLOG_IMAGES: R2Bucket;
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

  const listed = await env.BLOG_IMAGES.list();
  const images = listed.objects.map((obj) => ({
    key: obj.key,
    size: obj.size,
    uploaded: obj.uploaded.toISOString(),
    url: `/api/images?key=${encodeURIComponent(obj.key)}`,
  }));

  return Response.json(images, { headers: CORS_HEADERS });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await authenticate(request, env.JWT_SECRET))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  if (!file) {
    return Response.json(
      { error: 'No file provided.' },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (!allowed.includes(file.type)) {
    return Response.json(
      { error: 'Unsupported image type.' },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  if (file.size > 10 * 1024 * 1024) {
    return Response.json(
      { error: 'File too large. Max 10MB.' },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const key = `blog/${timestamp}-${safeName}`;

  await env.BLOG_IMAGES.put(key, file.stream(), {
    httpMetadata: { contentType: file.type },
  });

  return Response.json(
    { key, url: `/api/images?key=${encodeURIComponent(key)}`, size: file.size },
    { status: 201, headers: CORS_HEADERS }
  );
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await authenticate(request, env.JWT_SECRET))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401, headers: CORS_HEADERS });
  }

  const url = new URL(request.url);
  const key = url.searchParams.get('key');
  if (!key) {
    return Response.json(
      { error: 'Key is required.' },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  await env.BLOG_IMAGES.delete(key);
  return Response.json({ deleted: key }, { headers: CORS_HEADERS });
};
