import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  let posts: { slug: string; publishDate: string }[] = [];

  try {
    const cf = await import('cloudflare:workers');
    const kv = (cf.env as any).BLOG_KV;
    if (kv) {
      const indexRaw = await kv.get('posts:index', 'json');
      if (indexRaw) {
        posts = (indexRaw as any[]).filter((p: any) => p.status === 'published');
      }
    }
  } catch {}

  const baseUrl = 'https://quantumspine.growgenx.shop';
  const urls = posts.map(
    (p) =>
      `  <url>
    <loc>${baseUrl}/blog/${p.slug}</loc>
    <lastmod>${new Date(p.publishDate).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
  </url>`
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>weekly</changefreq>
  </url>
${urls.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
