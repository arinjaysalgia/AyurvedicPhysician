import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const root = resolve(__dirname, '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf-8');

describe('Phase 11: Images & Assets', () => {
  describe('Image files exist', () => {
    const images = [
      'public/images/dr-pradnya-hero.jpg',
      'public/images/dr-pradnya-about.jpg',
      'public/images/ayurveda-herbs.jpg',
      'public/images/og-default.jpg',
    ];

    images.forEach((file) => {
      it(`${file} exists`, () => {
        expect(existsSync(resolve(root, file))).toBe(true);
      });
    });
  });

  describe('Image references in components', () => {
    it('Hero uses dr-pradnya-hero.jpg', () => {
      const hero = read('src/components/home/Hero.astro');
      expect(hero).toContain('dr-pradnya-hero.jpg');
    });

    it('DoctorIntro uses dr-pradnya-hero.jpg', () => {
      const intro = read('src/components/home/DoctorIntro.astro');
      expect(intro).toContain('dr-pradnya-hero.jpg');
    });

    it('DoctorBio uses dr-pradnya-about.jpg', () => {
      const bio = read('src/components/about/DoctorBio.astro');
      expect(bio).toContain('dr-pradnya-about.jpg');
    });

    it('ConsultationInfo uses dr-pradnya-hero.jpg', () => {
      const info = read('src/components/contact/ConsultationInfo.astro');
      expect(info).toContain('dr-pradnya-hero.jpg');
    });
  });

  describe('Static assets', () => {
    it('favicon.svg exists', () => {
      expect(existsSync(resolve(root, 'public/favicon.svg'))).toBe(true);
    });

    it('favicon.svg contains emoji', () => {
      const favicon = read('public/favicon.svg');
      expect(favicon).toContain('🌿');
      expect(favicon).toContain('<svg');
    });

    it('robots.txt exists', () => {
      expect(existsSync(resolve(root, 'public/robots.txt'))).toBe(true);
    });

    it('robots.txt allows all and has sitemap', () => {
      const robots = read('public/robots.txt');
      expect(robots).toContain('Allow: /');
      expect(robots).toContain('Sitemap:');
      expect(robots).toContain('sitemap-index.xml');
    });

    it('robots.txt disallows /admin', () => {
      const robots = read('public/robots.txt');
      expect(robots).toContain('Disallow: /admin');
    });

    it('robots.txt references blog sitemap', () => {
      const robots = read('public/robots.txt');
      expect(robots).toContain('sitemap-blog.xml');
    });
  });

  describe('OG image configuration', () => {
    it('BaseLayout defaults to og-default.jpg', () => {
      const layout = read('src/layouts/BaseLayout.astro');
      expect(layout).toContain("'/images/og-default.jpg'");
    });

    it('BaseLayout has OG meta tags', () => {
      const layout = read('src/layouts/BaseLayout.astro');
      expect(layout).toContain('og:image');
      expect(layout).toContain('twitter:image');
    });
  });

  describe('All images have alt text', () => {
    const imageComponents = [
      'src/components/home/Hero.astro',
      'src/components/home/DoctorIntro.astro',
      'src/components/about/DoctorBio.astro',
      'src/components/contact/ConsultationInfo.astro',
      'src/components/blog/BlogCard.astro',
      'src/components/blog/BlogPost.astro',
    ];

    imageComponents.forEach((file) => {
      it(`${file.split('/').pop()} images have alt text`, () => {
        const content = read(file);
        const imgTags = content.match(/<img[\s\S]*?\/>/g) || [];
        imgTags.forEach((tag) => {
          expect(tag).toContain('alt=');
        });
      });
    });
  });
});
