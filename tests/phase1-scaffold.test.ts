import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const root = resolve(__dirname, '..');

describe('Phase 1: Project Scaffold', () => {
  describe('Config files exist', () => {
    const configs = [
      'astro.config.mjs',
      'tsconfig.json',
      'package.json',
      'wrangler.toml',
      'vitest.config.ts',
    ];

    configs.forEach((file) => {
      it(`${file} exists`, () => {
        expect(existsSync(resolve(root, file))).toBe(true);
      });
    });
  });

  describe('Directory structure', () => {
    const dirs = [
      'src/layouts',
      'src/pages',
      'src/components/common',
      'src/components/home',
      'src/components/about',
      'src/components/program',
      'src/components/contact',
      'src/components/blog',
      'src/components/admin',
      'src/data',
      'src/styles',
      'src/assets/images',
      'public/images',
      'functions/api',
    ];

    dirs.forEach((dir) => {
      it(`${dir}/ exists`, () => {
        expect(existsSync(resolve(root, dir))).toBe(true);
      });
    });
  });

  describe('Core files exist', () => {
    const files = [
      'src/layouts/BaseLayout.astro',
      'src/pages/index.astro',
      'src/styles/global.css',
      'public/favicon.svg',
      'public/robots.txt',
    ];

    files.forEach((file) => {
      it(`${file} exists`, () => {
        expect(existsSync(resolve(root, file))).toBe(true);
      });
    });
  });

  describe('package.json configuration', () => {
    const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf-8'));

    it('has correct name', () => {
      expect(pkg.name).toBe('ayurvedic-physician');
    });

    it('has required scripts', () => {
      expect(pkg.scripts.dev).toBeDefined();
      expect(pkg.scripts.build).toBeDefined();
      expect(pkg.scripts.test).toBeDefined();
      expect(pkg.scripts.typecheck).toBeDefined();
    });

    it('has astro dependency', () => {
      expect(pkg.dependencies.astro).toBeDefined();
    });

    it('has react dependencies', () => {
      expect(pkg.dependencies.react).toBeDefined();
      expect(pkg.dependencies['react-dom']).toBeDefined();
    });

    it('has @astrojs/react', () => {
      expect(pkg.dependencies['@astrojs/react']).toBeDefined();
    });

    it('has @astrojs/cloudflare', () => {
      expect(pkg.dependencies['@astrojs/cloudflare']).toBeDefined();
    });

    it('has @astrojs/sitemap', () => {
      expect(pkg.dependencies['@astrojs/sitemap']).toBeDefined();
    });

    it('has tailwindcss', () => {
      expect(pkg.dependencies.tailwindcss).toBeDefined();
    });

    it('has font packages', () => {
      expect(pkg.dependencies['@fontsource/playfair-display']).toBeDefined();
      expect(pkg.dependencies['@fontsource/inter']).toBeDefined();
    });

    it('has lucide-react', () => {
      expect(pkg.dependencies['lucide-react']).toBeDefined();
    });

    it('has resend', () => {
      expect(pkg.dependencies.resend).toBeDefined();
    });

    it('has vitest dev dependency', () => {
      expect(pkg.devDependencies.vitest).toBeDefined();
    });

    it('has wrangler dev dependency', () => {
      expect(pkg.devDependencies.wrangler).toBeDefined();
    });
  });

  describe('astro.config.mjs configuration', () => {
    const config = readFileSync(resolve(root, 'astro.config.mjs'), 'utf-8');

    it('imports react integration', () => {
      expect(config).toContain("from '@astrojs/react'");
    });

    it('imports cloudflare adapter', () => {
      expect(config).toContain("from '@astrojs/cloudflare'");
    });

    it('imports sitemap', () => {
      expect(config).toContain("from '@astrojs/sitemap'");
    });

    it('imports tailwind vite plugin', () => {
      expect(config).toContain("from '@tailwindcss/vite'");
    });

    it('sets site URL', () => {
      expect(config).toContain('quantumspine.growgenx.shop');
    });
  });

  describe('global.css configuration', () => {
    const css = readFileSync(resolve(root, 'src/styles/global.css'), 'utf-8');

    it('imports tailwindcss', () => {
      expect(css).toContain('@import "tailwindcss"');
    });

    it('defines forest color palette', () => {
      expect(css).toContain('--color-forest-900');
      expect(css).toContain('#1B4332');
    });

    it('defines gold color palette', () => {
      expect(css).toContain('--color-gold-600');
      expect(css).toContain('#B8860B');
    });

    it('defines font families', () => {
      expect(css).toContain('--font-heading');
      expect(css).toContain('Playfair Display');
      expect(css).toContain('--font-body');
      expect(css).toContain('Inter');
    });

    it('imports font files', () => {
      expect(css).toContain('@fontsource/playfair-display');
      expect(css).toContain('@fontsource/inter');
    });

    it('has reduced motion support', () => {
      expect(css).toContain('prefers-reduced-motion');
    });
  });

  describe('BaseLayout.astro', () => {
    const layout = readFileSync(resolve(root, 'src/layouts/BaseLayout.astro'), 'utf-8');

    it('has ClientRouter', () => {
      expect(layout).toContain('ClientRouter');
    });

    it('has skip-to-content link', () => {
      expect(layout).toContain('Skip to main content');
    });

    it('has main element with id', () => {
      expect(layout).toContain('id="main-content"');
    });

    it('has OG meta tags', () => {
      expect(layout).toContain('og:title');
      expect(layout).toContain('og:description');
      expect(layout).toContain('og:image');
    });

    it('has twitter card meta', () => {
      expect(layout).toContain('twitter:card');
    });

    it('has canonical URL', () => {
      expect(layout).toContain('rel="canonical"');
    });

    it('imports global styles', () => {
      expect(layout).toContain("../styles/global.css");
    });
  });

  describe('wrangler.toml', () => {
    const wrangler = readFileSync(resolve(root, 'wrangler.toml'), 'utf-8');

    it('has project name', () => {
      expect(wrangler).toContain('name = "ayurvedic-physician"');
    });

    it('has build output dir', () => {
      expect(wrangler).toContain('pages_build_output_dir = "./dist"');
    });
  });
});
