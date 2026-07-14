import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const root = resolve(__dirname, '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf-8');

describe('Phase 5: About Page', () => {
  describe('Component files exist', () => {
    const components = [
      'src/components/about/DoctorBio.astro',
      'src/components/about/Credentials.astro',
      'src/components/about/Philosophy.astro',
    ];

    components.forEach((file) => {
      it(`${file} exists`, () => {
        expect(existsSync(resolve(root, file))).toBe(true);
      });
    });
  });

  describe('DoctorBio.astro', () => {
    const bio = read('src/components/about/DoctorBio.astro');

    it('has doctor name as h1', () => {
      expect(bio).toContain('Dr. Pradnya Chittawadagi');
      expect(bio).toContain('<h1');
    });

    it('has doctor image with eager loading', () => {
      expect(bio).toContain('dr-pradnya');
      expect(bio).toContain('loading="eager"');
    });

    it('mentions MD and PhD', () => {
      expect(bio).toContain('MD in Ayurveda');
      expect(bio).toContain('PhD in Clinical');
    });

    it('mentions gold medalist', () => {
      expect(bio).toContain('gold medalist');
    });

    it('mentions Panchakarma', () => {
      expect(bio).toContain('Panchakarma');
    });

    it('has aria-labelledby', () => {
      expect(bio).toContain('aria-labelledby');
    });
  });

  describe('Credentials.astro', () => {
    const creds = read('src/components/about/Credentials.astro');

    it('imports credentials data', () => {
      expect(creds).toContain("from '../../data/credentials'");
    });

    it('imports lucide icons', () => {
      expect(creds).toContain("from 'lucide-react'");
    });

    it('uses SectionHeading', () => {
      expect(creds).toContain('SectionHeading');
    });

    it('has responsive grid', () => {
      expect(creds).toContain('lg:grid-cols-4');
    });

    it('has hover effects', () => {
      expect(creds).toContain('hover:shadow-lg');
    });
  });

  describe('Philosophy.astro', () => {
    const phil = read('src/components/about/Philosophy.astro');

    it('has philosophy headline', () => {
      expect(phil).toContain('Where Classical Ayurveda Meets Modern Science');
    });

    it('has CTA to contact', () => {
      expect(phil).toContain('href="/contact"');
    });

    it('uses Button component', () => {
      expect(phil).toContain('Button');
    });
  });

  describe('about.astro page', () => {
    const page = read('src/pages/about.astro');

    it('imports all 3 sections', () => {
      expect(page).toContain("import DoctorBio from '../components/about/DoctorBio.astro'");
      expect(page).toContain("import Credentials from '../components/about/Credentials.astro'");
      expect(page).toContain("import Philosophy from '../components/about/Philosophy.astro'");
    });

    it('renders sections in correct order', () => {
      const bioPos = page.indexOf('<DoctorBio');
      const credsPos = page.indexOf('<Credentials');
      const philPos = page.indexOf('<Philosophy');
      expect(bioPos).toBeLessThan(credsPos);
      expect(credsPos).toBeLessThan(philPos);
    });

    it('has prerender export', () => {
      expect(page).toContain('export const prerender = true');
    });

    it('has custom title and description', () => {
      expect(page).toContain('About Dr. Pradnya');
      expect(page).toContain('description=');
    });
  });

  describe('Build output', () => {
    it('prerendered about/index.html exists', () => {
      expect(existsSync(resolve(root, 'dist/client/about/index.html'))).toBe(true);
    });

    it('about page contains doctor name', () => {
      const html = read('dist/client/about/index.html');
      expect(html).toContain('Dr. Pradnya Chittawadagi');
    });
  });
});
