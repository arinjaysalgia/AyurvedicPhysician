import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const root = resolve(__dirname, '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf-8');

describe('Phase 4: Homepage', () => {
  describe('All homepage components exist', () => {
    const components = [
      'src/components/home/Hero.astro',
      'src/components/home/Services.astro',
      'src/components/home/Conditions.astro',
      'src/components/home/Process.astro',
      'src/components/home/DoctorIntro.astro',
      'src/components/home/Testimonials.astro',
      'src/components/home/CTABanner.astro',
    ];

    components.forEach((file) => {
      it(`${file} exists`, () => {
        expect(existsSync(resolve(root, file))).toBe(true);
      });
    });
  });

  describe('Hero.astro', () => {
    const hero = read('src/components/home/Hero.astro');

    it('has main headline', () => {
      expect(hero).toContain('Reverse Chronic Diseases');
    });

    it('has Ayurveda badge', () => {
      expect(hero).toContain('Ayurveda · Modern Science');
    });

    it('has Book Consultation CTA', () => {
      expect(hero).toContain('Book Consultation Now');
    });

    it('has WhatsApp CTA', () => {
      expect(hero).toContain('Talk on WhatsApp');
    });

    it('has doctor image', () => {
      expect(hero).toContain('dr-pradnya');
    });

    it('uses eager loading for hero image', () => {
      expect(hero).toContain('loading="eager"');
    });

    it('imports stats from credentials data', () => {
      expect(hero).toContain("from '../../data/credentials'");
    });

    it('has verified specialist badge', () => {
      expect(hero).toContain('Verified Specialist');
      expect(hero).toContain('MD · PhD · 12+ Years');
    });

    it('renders stats bar', () => {
      expect(hero).toContain('stats.map');
    });
  });

  describe('Services.astro', () => {
    const services = read('src/components/home/Services.astro');

    it('uses SectionHeading', () => {
      expect(services).toContain('SectionHeading');
    });

    it('imports services data', () => {
      expect(services).toContain("from '../../data/services'");
    });

    it('imports lucide icons', () => {
      expect(services).toContain("from 'lucide-react'");
    });

    it('has section heading text', () => {
      expect(services).toContain('A Complete Healing Ecosystem');
    });

    it('uses responsive grid', () => {
      expect(services).toContain('lg:grid-cols-4');
    });

    it('has hover effects', () => {
      expect(services).toContain('hover:shadow-lg');
      expect(services).toContain('hover:-translate-y-1');
    });

    it('has aria label', () => {
      expect(services).toContain('aria-labelledby');
    });
  });

  describe('Conditions.astro', () => {
    const conditions = read('src/components/home/Conditions.astro');

    it('imports conditions data', () => {
      expect(conditions).toContain("from '../../data/conditions'");
    });

    it('renders condition pills', () => {
      expect(conditions).toContain('rounded-full');
    });

    it('has section title', () => {
      expect(conditions).toContain('Trusted for Stubborn Conditions');
    });

    it('has hover effect on pills', () => {
      expect(conditions).toContain('hover:bg-forest-500');
    });
  });

  describe('Process.astro', () => {
    const process = read('src/components/home/Process.astro');

    it('imports process steps data', () => {
      expect(process).toContain("from '../../data/process-steps'");
    });

    it('has section title', () => {
      expect(process).toContain('A Simple Path to Lasting Healing');
    });

    it('has numbered step circles', () => {
      expect(process).toContain('rounded-full bg-gold-600');
    });

    it('has desktop connector line', () => {
      expect(process).toContain('border-dashed');
    });

    it('uses responsive grid', () => {
      expect(process).toContain('md:grid-cols-4');
    });
  });

  describe('DoctorIntro.astro', () => {
    const doctor = read('src/components/home/DoctorIntro.astro');

    it('has doctor name', () => {
      expect(doctor).toContain('Dr. Pradnya Chittawadagi');
    });

    it('has philosophy quote', () => {
      expect(doctor).toContain('Where classical Ayurveda meets modern science');
    });

    it('imports credentials data', () => {
      expect(doctor).toContain("from '../../data/credentials'");
    });

    it('has doctor image with lazy loading', () => {
      expect(doctor).toContain('loading="lazy"');
    });

    it('has link to About page', () => {
      expect(doctor).toContain('href="/about"');
    });

    it('renders credential cards', () => {
      expect(doctor).toContain('credentials.map');
    });
  });

  describe('Testimonials.astro', () => {
    const testimonials = read('src/components/home/Testimonials.astro');

    it('imports testimonials data', () => {
      expect(testimonials).toContain("from '../../data/testimonials'");
    });

    it('has section title', () => {
      expect(testimonials).toContain('Real People. Real Transformations.');
    });

    it('renders star ratings', () => {
      expect(testimonials).toContain('Star');
    });

    it('uses 3-column grid on desktop', () => {
      expect(testimonials).toContain('md:grid-cols-3');
    });

    it('has quote icon', () => {
      expect(testimonials).toContain('Quote');
    });
  });

  describe('CTABanner.astro', () => {
    const cta = read('src/components/home/CTABanner.astro');

    it('has dark forest background', () => {
      expect(cta).toContain('bg-forest-900');
    });

    it('has heading text', () => {
      expect(cta).toContain('Your Healing Journey Starts Today');
    });

    it('has Book Consultation button', () => {
      expect(cta).toContain('Book Consultation Now');
    });

    it('has program link', () => {
      expect(cta).toContain('/from-pain-to-power');
    });

    it('uses Button component', () => {
      expect(cta).toContain('Button');
    });
  });

  describe('index.astro composition', () => {
    const index = read('src/pages/index.astro');

    it('imports all 7 sections', () => {
      expect(index).toContain("import Hero from '../components/home/Hero.astro'");
      expect(index).toContain("import Services from '../components/home/Services.astro'");
      expect(index).toContain("import Conditions from '../components/home/Conditions.astro'");
      expect(index).toContain("import Process from '../components/home/Process.astro'");
      expect(index).toContain("import DoctorIntro from '../components/home/DoctorIntro.astro'");
      expect(index).toContain("import Testimonials from '../components/home/Testimonials.astro'");
      expect(index).toContain("import CTABanner from '../components/home/CTABanner.astro'");
    });

    it('renders sections in correct order', () => {
      const heroPos = index.indexOf('<Hero');
      const servicesPos = index.indexOf('<Services');
      const conditionsPos = index.indexOf('<Conditions');
      const processPos = index.indexOf('<Process');
      const doctorPos = index.indexOf('<DoctorIntro');
      const testimonialsPos = index.indexOf('<Testimonials');
      const ctaPos = index.indexOf('<CTABanner');

      expect(heroPos).toBeLessThan(servicesPos);
      expect(servicesPos).toBeLessThan(conditionsPos);
      expect(conditionsPos).toBeLessThan(processPos);
      expect(processPos).toBeLessThan(doctorPos);
      expect(doctorPos).toBeLessThan(testimonialsPos);
      expect(testimonialsPos).toBeLessThan(ctaPos);
    });

    it('has prerender export for static generation', () => {
      expect(index).toContain('export const prerender = true');
    });

    it('uses BaseLayout', () => {
      expect(index).toContain('BaseLayout');
    });
  });

  describe('Build output', () => {
    it('prerendered index.html exists', () => {
      expect(existsSync(resolve(root, 'dist/client/index.html'))).toBe(true);
    });

    it('index.html contains homepage content', () => {
      const html = read('dist/client/index.html');
      expect(html).toContain('Reverse Chronic Diseases');
      expect(html).toContain('Dr. Pradnya Chittawadagi');
      expect(html).toContain('A Complete Healing Ecosystem');
    });
  });
});
