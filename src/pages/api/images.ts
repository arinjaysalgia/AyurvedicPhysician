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

  const r2 = (env as any).BLOG_IMAGES as R2Bucket;
  const listed = await r2.list();
  const images = listed.objects.map((obj) => ({
    key: obj.key,
    size: obj.size,
    uploaded: obj.uploaded.toISOString(),
    url: `/api/images?key=${encodeURIComponent(obj.key)}`,
  }));

  return Response.json(images, { headers: CORS_HEADERS });
};

export const POST: APIRoute = async ({ request }) => {
  if (!(await authenticate(request, (env as any).JWT_SECRET))) {
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

  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
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

  const r2 = (env as any).BLOG_IMAGES as R2Bucket;
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const key = `blog/${timestamp}-${safeName}`;

  await r2.put(key, file.stream(), {
    httpMetadata: { contentType: file.type },
  });

  return Response.json(
    { key, url: `/api/images?key=${encodeURIComponent(key)}`, size: file.size },
    { status: 201, headers: CORS_HEADERS }
  );
};

export const DELETE: APIRoute = async ({ request }) => {
  if (!(await authenticate(request, (env as any).JWT_SECRET))) {
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

  const r2 = (env as any).BLOG_IMAGES as R2Bucket;
  await r2.delete(key);
  return Response.json({ deleted: key }, { headers: CORS_HEADERS });
};
