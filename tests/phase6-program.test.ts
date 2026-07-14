import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const root = resolve(__dirname, '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf-8');

describe('Phase 6: Program Page', () => {
  describe('Component files exist', () => {
    const components = [
      'src/components/program/ProgramHero.astro',
      'src/components/program/PainPoints.astro',
      'src/components/program/Benefits.astro',
      'src/components/program/Modules.astro',
      'src/components/program/PricingCard.astro',
      'src/components/program/CountdownTimer.tsx',
      'src/components/program/ProgramFAQ.tsx',
    ];

    components.forEach((file) => {
      it(`${file} exists`, () => {
        expect(existsSync(resolve(root, file))).toBe(true);
      });
    });
  });

  describe('ProgramHero.astro', () => {
    const hero = read('src/components/program/ProgramHero.astro');

    it('has main headline about back pain', () => {
      expect(hero).toContain('Bye-Bye');
      expect(hero).toContain('Back Pain');
    });

    it('has price ₹999', () => {
      expect(hero).toContain('₹999');
    });

    it('has Razorpay link', () => {
      expect(hero).toContain('rzp.io');
    });

    it('marks Razorpay link as external', () => {
      expect(hero).toContain('external');
    });

    it('has dark forest background', () => {
      expect(hero).toContain('forest-900');
    });
  });

  describe('PainPoints.astro', () => {
    const pain = read('src/components/program/PainPoints.astro');

    it('has pain point items', () => {
      expect(pain).toContain('Lower back pain');
      expect(pain).toContain('disc bulge');
    });

    it('uses AlertCircle icon', () => {
      expect(pain).toContain('AlertCircle');
    });

    it('has red styling for urgency', () => {
      expect(pain).toContain('red-50');
      expect(pain).toContain('red-500');
    });
  });

  describe('Benefits.astro', () => {
    const benefits = read('src/components/program/Benefits.astro');

    it('has benefit items', () => {
      expect(benefits).toContain('root cause');
      expect(benefits).toContain('naturally without medicines');
    });

    it('uses CheckCircle icon', () => {
      expect(benefits).toContain('CheckCircle');
    });

    it('has 6 benefits', () => {
      const matches = benefits.match(/CheckCircle/g);
      expect(matches).not.toBeNull();
    });
  });

  describe('Modules.astro', () => {
    const modules = read('src/components/program/Modules.astro');

    it('has 6 numbered modules', () => {
      expect(modules).toContain('number: 1');
      expect(modules).toContain('number: 6');
    });

    it('uses responsive grid', () => {
      expect(modules).toContain('lg:grid-cols-3');
    });

    it('has hover effects', () => {
      expect(modules).toContain('hover:shadow-lg');
    });
  });

  describe('PricingCard.astro', () => {
    const pricing = read('src/components/program/PricingCard.astro');

    it('shows ₹999 price', () => {
      expect(pricing).toContain('₹999');
    });

    it('has Razorpay link', () => {
      expect(pricing).toContain('rzp.io');
    });

    it('mentions instant download', () => {
      expect(pricing).toContain('Instant PDF download');
    });

    it('uses Button component', () => {
      expect(pricing).toContain('Button');
    });

    it('has trust elements', () => {
      expect(pricing).toContain('Shield');
      expect(pricing).toContain('Download');
    });
  });

  describe('CountdownTimer.tsx', () => {
    const timer = read('src/components/program/CountdownTimer.tsx');

    it('uses useState and useEffect', () => {
      expect(timer).toContain('useState');
      expect(timer).toContain('useEffect');
    });

    it('accepts endDate prop', () => {
      expect(timer).toContain('endDate');
    });

    it('calculates time left', () => {
      expect(timer).toContain('calculateTimeLeft');
    });

    it('uses setInterval for countdown', () => {
      expect(timer).toContain('setInterval');
    });

    it('cleans up interval on unmount', () => {
      expect(timer).toContain('clearInterval');
    });

    it('shows days, hours, minutes, seconds', () => {
      expect(timer).toContain('Days');
      expect(timer).toContain('Hours');
      expect(timer).toContain('Min');
      expect(timer).toContain('Sec');
    });

    it('hides when expired', () => {
      expect(timer).toContain('expired');
      expect(timer).toContain('return null');
    });

    it('pads numbers with leading zero', () => {
      expect(timer).toContain('padStart(2');
    });
  });

  describe('ProgramFAQ.tsx', () => {
    const faqComp = read('src/components/program/ProgramFAQ.tsx');

    it('uses useState for accordion', () => {
      expect(faqComp).toContain('useState');
    });

    it('imports FAQItem type', () => {
      expect(faqComp).toContain("from '../../data/faq'");
    });

    it('has aria-expanded', () => {
      expect(faqComp).toContain('aria-expanded');
    });

    it('has aria-controls', () => {
      expect(faqComp).toContain('aria-controls');
    });

    it('uses ChevronDown icon', () => {
      expect(faqComp).toContain('ChevronDown');
    });

    it('rotates chevron when open', () => {
      expect(faqComp).toContain('rotate-180');
    });

    it('toggles single item at a time', () => {
      expect(faqComp).toContain('openIndex === index ? null : index');
    });

    it('has transition for expand/collapse', () => {
      expect(faqComp).toContain('transition-all');
      expect(faqComp).toContain('max-h-0');
    });

    it('has focus-visible styles', () => {
      expect(faqComp).toContain('focus-visible:ring-2');
    });
  });

  describe('from-pain-to-power.astro page', () => {
    const page = read('src/pages/from-pain-to-power.astro');

    it('imports all sections', () => {
      expect(page).toContain('ProgramHero');
      expect(page).toContain('PainPoints');
      expect(page).toContain('Benefits');
      expect(page).toContain('Modules');
      expect(page).toContain('PricingCard');
      expect(page).toContain('CountdownTimer');
      expect(page).toContain('ProgramFAQ');
    });

    it('uses client:visible for React islands', () => {
      expect(page).toContain('client:visible');
    });

    it('passes faq data to ProgramFAQ', () => {
      expect(page).toContain('items={faq}');
    });

    it('passes endDate to CountdownTimer', () => {
      expect(page).toContain('endDate=');
    });

    it('has prerender export', () => {
      expect(page).toContain('export const prerender = true');
    });

    it('has custom title and description', () => {
      expect(page).toContain('From Pain to Power');
      expect(page).toContain('description=');
    });

    it('renders sections in correct order', () => {
      const order = ['ProgramHero', 'PainPoints', 'Benefits', 'Modules', 'CountdownTimer', 'PricingCard', 'ProgramFAQ'];
      let lastPos = -1;
      for (const section of order) {
        const pos = page.indexOf(`<${section}`);
        expect(pos).toBeGreaterThan(lastPos);
        lastPos = pos;
      }
    });
  });

  describe('Build output', () => {
    it('prerendered from-pain-to-power/index.html exists', () => {
      expect(existsSync(resolve(root, 'dist/client/from-pain-to-power/index.html'))).toBe(true);
    });

    it('program page contains pricing', () => {
      const html = read('dist/client/from-pain-to-power/index.html');
      expect(html).toContain('999');
      expect(html).toContain('Back Pain');
    });
  });
});
