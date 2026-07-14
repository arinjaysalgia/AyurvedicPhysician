import { describe, it, expect } from 'vitest';
import { services } from '../src/data/services';
import { conditions } from '../src/data/conditions';
import { testimonials } from '../src/data/testimonials';
import { processSteps } from '../src/data/process-steps';
import { faq } from '../src/data/faq';
import { credentials, stats } from '../src/data/credentials';

describe('Phase 3: Data Files', () => {
  describe('services', () => {
    it('has 4 services', () => {
      expect(services).toHaveLength(4);
    });

    it('each service has icon, title, description', () => {
      services.forEach((s) => {
        expect(s.icon).toBeTruthy();
        expect(s.title).toBeTruthy();
        expect(s.description).toBeTruthy();
      });
    });

    it('includes Online Consultation', () => {
      expect(services.some((s) => s.title === 'Online Consultation')).toBe(true);
    });

    it('includes Panchakarma Guidance', () => {
      expect(services.some((s) => s.title === 'Panchakarma Guidance')).toBe(true);
    });

    it('includes Lifestyle & Diet Planning', () => {
      expect(services.some((s) => s.title === 'Lifestyle & Diet Planning')).toBe(true);
    });

    it('includes Chronic Disease Reversal', () => {
      expect(services.some((s) => s.title === 'Chronic Disease Reversal')).toBe(true);
    });
  });

  describe('conditions', () => {
    it('has 6 conditions', () => {
      expect(conditions).toHaveLength(6);
    });

    it('each condition has name and icon', () => {
      conditions.forEach((c) => {
        expect(c.name).toBeTruthy();
        expect(c.icon).toBeTruthy();
      });
    });

    const expectedConditions = ['PCOS', 'Diabetes', 'Thyroid', 'Obesity', 'Digestive Disorders', 'Stress & Anxiety'];
    expectedConditions.forEach((name) => {
      it(`includes ${name}`, () => {
        expect(conditions.some((c) => c.name === name)).toBe(true);
      });
    });
  });

  describe('testimonials', () => {
    it('has 3 testimonials', () => {
      expect(testimonials).toHaveLength(3);
    });

    it('each testimonial has quote, name, descriptor, rating', () => {
      testimonials.forEach((t) => {
        expect(t.quote).toBeTruthy();
        expect(t.name).toBeTruthy();
        expect(t.descriptor).toBeTruthy();
        expect(t.rating).toBeGreaterThanOrEqual(1);
        expect(t.rating).toBeLessThanOrEqual(5);
      });
    });

    it('includes Anjali M.', () => {
      expect(testimonials.some((t) => t.name === 'Anjali M.')).toBe(true);
    });

    it('includes Sushma R.', () => {
      expect(testimonials.some((t) => t.name === 'Sushma R.')).toBe(true);
    });

    it('includes Rohan S.', () => {
      expect(testimonials.some((t) => t.name === 'Rohan S.')).toBe(true);
    });
  });

  describe('processSteps', () => {
    it('has 4 steps', () => {
      expect(processSteps).toHaveLength(4);
    });

    it('steps are numbered 1-4', () => {
      processSteps.forEach((step, i) => {
        expect(step.number).toBe(i + 1);
      });
    });

    it('each step has title, description, icon', () => {
      processSteps.forEach((step) => {
        expect(step.title).toBeTruthy();
        expect(step.description).toBeTruthy();
        expect(step.icon).toBeTruthy();
      });
    });

    it('follows Book → Plan → Follow → Transform order', () => {
      expect(processSteps[0].title).toContain('Book');
      expect(processSteps[1].title).toContain('Plan');
      expect(processSteps[2].title).toContain('Follow');
      expect(processSteps[3].title).toContain('Transformation');
    });
  });

  describe('faq', () => {
    it('has 5 items', () => {
      expect(faq).toHaveLength(5);
    });

    it('each item has question and answer', () => {
      faq.forEach((item) => {
        expect(item.question).toBeTruthy();
        expect(item.answer).toBeTruthy();
        expect(item.question.endsWith('?')).toBe(true);
      });
    });

    it('covers instant access question', () => {
      expect(faq.some((f) => f.question.toLowerCase().includes('instant access'))).toBe(true);
    });

    it('covers safety question', () => {
      expect(faq.some((f) => f.question.toLowerCase().includes('safe'))).toBe(true);
    });
  });

  describe('credentials', () => {
    it('has 4 credentials', () => {
      expect(credentials).toHaveLength(4);
    });

    it('each credential has icon, label, title, description', () => {
      credentials.forEach((c) => {
        expect(c.icon).toBeTruthy();
        expect(c.label).toBeTruthy();
        expect(c.title).toBeTruthy();
        expect(c.description).toBeTruthy();
      });
    });

    it('includes Gold Medalist', () => {
      expect(credentials.some((c) => c.title.includes('Gold'))).toBe(true);
    });

    it('includes PhD', () => {
      expect(credentials.some((c) => c.title.includes('PhD'))).toBe(true);
    });
  });

  describe('stats', () => {
    it('has 3 stats', () => {
      expect(stats).toHaveLength(3);
    });

    it('each stat has value and label', () => {
      stats.forEach((s) => {
        expect(s.value).toBeTruthy();
        expect(s.label).toBeTruthy();
      });
    });

    it('includes 12+ years', () => {
      expect(stats.some((s) => s.value === '12+')).toBe(true);
    });
  });
});
