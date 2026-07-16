import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { createJWT, CORS_HEADERS } from '../../lib/auth';

export const prerender = false;

export const OPTIONS: APIRoute = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { password } = (await request.json()) as { password: string };
    if (!(env as any).ADMIN_PASSWORD) {
      return Response.json(
        { error: 'Admin not configured.' },
        { status: 500, headers: CORS_HEADERS }
      );
    }
    if (password !== (env as any).ADMIN_PASSWORD) {
      return Response.json(
        { error: 'Invalid password.' },
        { status: 401, headers: CORS_HEADERS }
      );
    }
    const token = await createJWT((env as any).JWT_SECRET);
    return Response.json({ token }, { status: 200, headers: CORS_HEADERS });
  } catch {
    return Response.json(
      { error: 'Server error.' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
};
