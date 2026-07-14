import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const root = resolve(__dirname, '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf-8');

describe('Phase 12: SEO & Polish', () => {
  describe('JSON-LD structured data', () => {
    it('homepage has MedicalBusiness schema', () => {
      const page = read('src/pages/index.astro');
      expect(page).toContain("'@type': 'MedicalBusiness'");
      expect(page).toContain('businessSchema');
      expect(page).toContain('<SEOHead');
    });

    it('about page has Person schema', () => {
      const page = read('src/pages/about.astro');
      expect(page).toContain("'@type': 'Person'");
      expect(page).toContain('personSchema');
      expect(page).toContain('<SEOHead');
    });

    it('program page has Product schema', () => {
      const page = read('src/pages/from-pain-to-power.astro');
      expect(page).toContain("'@type': 'Product'");
      expect(page).toContain('productSchema');
      expect(page).toContain('<SEOHead');
    });

    it('contact page has MedicalBusiness schema', () => {
      const page = read('src/pages/contact.astro');
      expect(page).toContain("'@type': 'MedicalBusiness'");
      expect(page).toContain('contactSchema');
      expect(page).toContain('<SEOHead');
    });

    it('blog post page has Article schema', () => {
      const page = read('src/pages/blog/[slug].astro');
      expect(page).toContain("'@type': 'Article'");
    });

    it('SEOHead renders JSON-LD script', () => {
      const seo = read('src/components/common/SEOHead.astro');
      expect(seo).toContain('application/ld+json');
      expect(seo).toContain('@context');
      expect(seo).toContain('schema.org');
    });
  });

  describe('Homepage MedicalBusiness schema content', () => {
    const page = read('src/pages/index.astro');

    it('includes practice name', () => {
      expect(page).toContain('Dr. Pradnya Chittawadagi');
    });

    it('includes medical specialty', () => {
      expect(page).toContain('Ayurvedic Medicine');
    });

    it('includes site URL', () => {
      expect(page).toContain('quantumspine.growgenx.shop');
    });

    it('includes image URL', () => {
      expect(page).toContain('dr-pradnya-hero.jpg');
    });
  });

  describe('About Person schema content', () => {
    const page = read('src/pages/about.astro');

    it('includes job title', () => {
      expect(page).toContain('Ayurvedic Physician & Research Scientist');
    });

    it('includes knowledge areas', () => {
      expect(page).toContain('knowsAbout');
      expect(page).toContain('Panchakarma');
    });
  });

  describe('Program Product schema content', () => {
    const page = read('src/pages/from-pain-to-power.astro');

    it('includes price in INR', () => {
      expect(page).toContain("price: '999'");
      expect(page).toContain("priceCurrency: 'INR'");
    });

    it('includes Razorpay link', () => {
      expect(page).toContain('rzp.io');
    });

    it('shows in stock', () => {
      expect(page).toContain('InStock');
    });
  });

  describe('Contact schema content', () => {
    const page = read('src/pages/contact.astro');

    it('includes consultation service', () => {
      expect(page).toContain('MedicalTherapy');
      expect(page).toContain('Online Ayurvedic Consultation');
    });

    it('includes consultation price', () => {
      expect(page).toContain("price: '499'");
    });
  });

  describe('Blog sitemap', () => {
    it('sitemap-blog.xml.ts exists', () => {
      expect(existsSync(resolve(root, 'src/pages/sitemap-blog.xml.ts'))).toBe(true);
    });

    it('is server-rendered', () => {
      const sitemap = read('src/pages/sitemap-blog.xml.ts');
      expect(sitemap).toContain('export const prerender = false');
    });

    it('generates valid XML', () => {
      const sitemap = read('src/pages/sitemap-blog.xml.ts');
      expect(sitemap).toContain('<?xml version="1.0"');
      expect(sitemap).toContain('urlset');
      expect(sitemap).toContain('<loc>');
      expect(sitemap).toContain('</url>');
    });

    it('includes blog listing page', () => {
      const sitemap = read('src/pages/sitemap-blog.xml.ts');
      expect(sitemap).toContain('/blog</loc>');
    });

    it('returns XML content type', () => {
      const sitemap = read('src/pages/sitemap-blog.xml.ts');
      expect(sitemap).toContain("'Content-Type': 'application/xml'");
    });

    it('reads from Cloudflare KV', () => {
      const sitemap = read('src/pages/sitemap-blog.xml.ts');
      expect(sitemap).toContain('BLOG_KV');
      expect(sitemap).toContain("'posts:index'");
    });

    it('only includes published posts', () => {
      const sitemap = read('src/pages/sitemap-blog.xml.ts');
      expect(sitemap).toContain("p.status === 'published'");
    });
  });

  describe('Homepage blog preview', () => {
    it('BlogPreview component exists', () => {
      expect(existsSync(resolve(root, 'src/components/home/BlogPreview.astro'))).toBe(true);
    });

    it('homepage includes BlogPreview', () => {
      const page = read('src/pages/index.astro');
      expect(page).toContain('<BlogPreview');
      expect(page).toContain("import BlogPreview from '../components/home/BlogPreview.astro'");
    });

    it('BlogPreview links to /blog', () => {
      const preview = read('src/components/home/BlogPreview.astro');
      expect(preview).toContain('href="/blog"');
    });

    it('BlogPreview has section heading', () => {
      const preview = read('src/components/home/BlogPreview.astro');
      expect(preview).toContain('SectionHeading');
      expect(preview).toContain('Ayurvedic Health Insights');
    });

    it('BlogPreview has aria label', () => {
      const preview = read('src/components/home/BlogPreview.astro');
      expect(preview).toContain('aria-labelledby="blog-preview-heading"');
    });
  });

  describe('Accessibility', () => {
    it('BaseLayout has skip-to-content link', () => {
      const layout = read('src/layouts/BaseLayout.astro');
      expect(layout).toContain('Skip to main content');
      expect(layout).toContain('href="#main-content"');
      expect(layout).toContain('id="main-content"');
    });

    it('Header has nav aria-label', () => {
      const header = read('src/components/common/Header.astro');
      expect(header).toContain('aria-label="Main navigation"');
    });

    it('MobileNav has aria-expanded', () => {
      const nav = read('src/components/common/MobileNav.tsx');
      expect(nav).toContain('aria-expanded');
      expect(nav).toContain('aria-controls');
      expect(nav).toContain('aria-label');
    });

    it('WhatsAppFab has aria-label', () => {
      const fab = read('src/components/common/WhatsAppFab.astro');
      expect(fab).toContain('aria-label');
    });

    it('Hero section has aria-label', () => {
      const hero = read('src/components/home/Hero.astro');
      expect(hero).toContain('aria-label="Hero"');
    });

    it('all major sections have aria-labelledby', () => {
      const sections = [
        'src/components/home/Services.astro',
        'src/components/home/Conditions.astro',
        'src/components/home/Process.astro',
        'src/components/home/DoctorIntro.astro',
        'src/components/home/Testimonials.astro',
        'src/components/home/CTABanner.astro',
        'src/components/about/DoctorBio.astro',
        'src/components/about/Credentials.astro',
        'src/components/about/Philosophy.astro',
      ];

      sections.forEach((file) => {
        const content = read(file);
        expect(content).toContain('aria-labelledby');
      });
    });

    it('FAQ accordion has aria-expanded and aria-controls', () => {
      const faq = read('src/components/program/ProgramFAQ.tsx');
      expect(faq).toContain('aria-expanded');
      expect(faq).toContain('aria-controls');
    });

    it('blog pagination has aria-current', () => {
      const pagination = read('src/components/blog/Pagination.astro');
      expect(pagination).toContain('aria-current');
      expect(pagination).toContain('aria-label="Blog pagination"');
    });
  });

  describe('prefers-reduced-motion', () => {
    const css = read('src/styles/global.css');

    it('global.css has reduced-motion media query', () => {
      expect(css).toContain('prefers-reduced-motion: reduce');
    });

    it('disables animations', () => {
      expect(css).toContain('animation-duration: 0.01ms');
    });

    it('disables transitions', () => {
      expect(css).toContain('transition-duration: 0.01ms');
    });

    it('disables smooth scrolling', () => {
      expect(css).toContain('scroll-behavior: auto');
    });
  });

  describe('SEO meta tags in BaseLayout', () => {
    const layout = read('src/layouts/BaseLayout.astro');

    it('has canonical URL', () => {
      expect(layout).toContain('rel="canonical"');
    });

    it('has OG type', () => {
      expect(layout).toContain('og:type');
    });

    it('has OG title', () => {
      expect(layout).toContain('og:title');
    });

    it('has OG description', () => {
      expect(layout).toContain('og:description');
    });

    it('has OG image', () => {
      expect(layout).toContain('og:image');
    });

    it('has Twitter card', () => {
      expect(layout).toContain('twitter:card');
      expect(layout).toContain('summary_large_image');
    });

    it('has viewport meta', () => {
      expect(layout).toContain('viewport');
    });

    it('has head slot for per-page additions', () => {
      expect(layout).toContain('slot name="head"');
    });
  });
});
