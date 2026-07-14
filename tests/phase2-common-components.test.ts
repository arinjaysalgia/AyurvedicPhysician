import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const root = resolve(__dirname, '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf-8');

describe('Phase 2: Common Components', () => {
  describe('All component files exist', () => {
    const components = [
      'src/components/common/Header.astro',
      'src/components/common/MobileNav.tsx',
      'src/components/common/Footer.astro',
      'src/components/common/Button.astro',
      'src/components/common/SectionHeading.astro',
      'src/components/common/WhatsAppFab.astro',
      'src/components/common/SEOHead.astro',
    ];

    components.forEach((file) => {
      it(`${file} exists`, () => {
        expect(existsSync(resolve(root, file))).toBe(true);
      });
    });
  });

  describe('Header.astro', () => {
    const header = read('src/components/common/Header.astro');

    it('has nav links for all pages', () => {
      expect(header).toContain("'/'");
      expect(header).toContain("'/from-pain-to-power'");
      expect(header).toContain("'/blog'");
      expect(header).toContain("'/about'");
      expect(header).toContain("'/contact'");
    });

    it('has aria label for navigation', () => {
      expect(header).toContain('aria-label="Main navigation"');
    });

    it('imports MobileNav', () => {
      expect(header).toContain('MobileNav');
    });

    it('uses client:media directive for mobile nav', () => {
      expect(header).toContain('client:media="(max-width: 768px)"');
    });

    it('has Book Consultation CTA', () => {
      expect(header).toContain('Book Consultation');
    });

    it('has sticky positioning', () => {
      expect(header).toContain('sticky');
    });

    it('has brand/logo link', () => {
      expect(header).toContain('Dr. Pradnya');
    });
  });

  describe('MobileNav.tsx', () => {
    const mobileNav = read('src/components/common/MobileNav.tsx');

    it('uses useState for open/close', () => {
      expect(mobileNav).toContain('useState');
    });

    it('has aria-expanded attribute', () => {
      expect(mobileNav).toContain('aria-expanded');
    });

    it('has aria-controls attribute', () => {
      expect(mobileNav).toContain('aria-controls');
    });

    it('has aria-label for toggle button', () => {
      expect(mobileNav).toContain('aria-label');
    });

    it('uses lucide icons (Menu, X)', () => {
      expect(mobileNav).toContain("from 'lucide-react'");
      expect(mobileNav).toContain('Menu');
      expect(mobileNav).toContain('<X');
    });

    it('has transition classes', () => {
      expect(mobileNav).toContain('transition-all');
    });

    it('hides on md breakpoint', () => {
      expect(mobileNav).toContain('md:hidden');
    });

    it('closes menu on link click', () => {
      expect(mobileNav).toContain('setIsOpen(false)');
    });
  });

  describe('Footer.astro', () => {
    const footer = read('src/components/common/Footer.astro');

    it('has copyright with dynamic year', () => {
      expect(footer).toContain('new Date().getFullYear()');
    });

    it('has Dr. Pradnya branding', () => {
      expect(footer).toContain('Dr. Pradnya');
    });

    it('has quick links section', () => {
      expect(footer).toContain('Quick Links');
    });

    it('has services section', () => {
      expect(footer).toContain('Services');
    });

    it('uses forest-900 background', () => {
      expect(footer).toContain('bg-forest-900');
    });
  });

  describe('Button.astro', () => {
    const button = read('src/components/common/Button.astro');

    it('supports primary variant', () => {
      expect(button).toContain('bg-gold-600');
    });

    it('supports secondary variant', () => {
      expect(button).toContain('border-forest-700');
    });

    it('supports whatsapp variant', () => {
      expect(button).toContain('#25D366');
    });

    it('supports size variants (sm, md, lg)', () => {
      expect(button).toContain("sm:");
      expect(button).toContain("md:");
      expect(button).toContain("lg:");
    });

    it('handles external links', () => {
      expect(button).toContain('target');
      expect(button).toContain('noopener noreferrer');
    });

    it('has focus-visible styles', () => {
      expect(button).toContain('focus-visible:ring-2');
    });

    it('has transition classes', () => {
      expect(button).toContain('transition-all');
    });
  });

  describe('SectionHeading.astro', () => {
    const heading = read('src/components/common/SectionHeading.astro');

    it('renders h2 tag', () => {
      expect(heading).toContain('<h2');
    });

    it('supports label prop', () => {
      expect(heading).toContain('label');
      expect(heading).toContain('tracking-wide uppercase');
    });

    it('supports subtitle prop', () => {
      expect(heading).toContain('subtitle');
    });

    it('supports center and left alignment', () => {
      expect(heading).toContain('text-center');
      expect(heading).toContain('text-left');
    });

    it('uses heading font', () => {
      expect(heading).toContain('font-heading');
    });
  });

  describe('WhatsAppFab.astro', () => {
    const fab = read('src/components/common/WhatsAppFab.astro');

    it('links to wa.me', () => {
      expect(fab).toContain('wa.me');
    });

    it('has fixed positioning', () => {
      expect(fab).toContain('fixed');
    });

    it('has WhatsApp green color', () => {
      expect(fab).toContain('#25D366');
    });

    it('has aria-label', () => {
      expect(fab).toContain('aria-label');
    });

    it('has ping animation', () => {
      expect(fab).toContain('animate-ping');
    });

    it('opens in new tab', () => {
      expect(fab).toContain('target="_blank"');
      expect(fab).toContain('noopener noreferrer');
    });

    it('accepts phone number prop', () => {
      expect(fab).toContain('phoneNumber');
    });
  });

  describe('SEOHead.astro', () => {
    const seo = read('src/components/common/SEOHead.astro');

    it('supports structured data (JSON-LD)', () => {
      expect(seo).toContain('application/ld+json');
      expect(seo).toContain('schema.org');
    });

    it('supports article type', () => {
      expect(seo).toContain('article');
    });
  });

  describe('BaseLayout integration', () => {
    const layout = read('src/layouts/BaseLayout.astro');

    it('imports Header', () => {
      expect(layout).toContain("import Header from '../components/common/Header.astro'");
    });

    it('imports Footer', () => {
      expect(layout).toContain("import Footer from '../components/common/Footer.astro'");
    });

    it('imports WhatsAppFab', () => {
      expect(layout).toContain("import WhatsAppFab from '../components/common/WhatsAppFab.astro'");
    });

    it('renders Header component', () => {
      expect(layout).toContain('<Header />');
    });

    it('renders Footer component', () => {
      expect(layout).toContain('<Footer />');
    });

    it('has hideWhatsApp prop', () => {
      expect(layout).toContain('hideWhatsApp');
    });

    it('has head slot for per-page injections', () => {
      expect(layout).toContain('slot name="head"');
    });
  });

  describe('Button is used in section components', () => {
    it('Hero uses Button', () => {
      const hero = read('src/components/home/Hero.astro');
      expect(hero).toContain("import Button from '../common/Button.astro'");
      expect(hero).toContain('<Button');
    });

    it('CTABanner uses Button', () => {
      const cta = read('src/components/home/CTABanner.astro');
      expect(cta).toContain("import Button from '../common/Button.astro'");
      expect(cta).toContain('<Button');
    });

    it('DoctorIntro uses Button', () => {
      const doctor = read('src/components/home/DoctorIntro.astro');
      expect(doctor).toContain("import Button from '../common/Button.astro'");
      expect(doctor).toContain('<Button');
    });
  });
});
