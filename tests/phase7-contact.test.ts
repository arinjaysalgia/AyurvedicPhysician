import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const root = resolve(__dirname, '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf-8');

describe('Phase 7: Contact Page', () => {
  describe('Component files exist', () => {
    const components = [
      'src/components/contact/ConsultationInfo.astro',
      'src/components/contact/ContactForm.tsx',
      'src/components/contact/ContactDetails.astro',
    ];

    components.forEach((file) => {
      it(`${file} exists`, () => {
        expect(existsSync(resolve(root, file))).toBe(true);
      });
    });
  });

  describe('ConsultationInfo.astro', () => {
    const info = read('src/components/contact/ConsultationInfo.astro');

    it('shows ₹499 price', () => {
      expect(info).toContain('₹499');
    });

    it('has 30-minute mention', () => {
      expect(info).toContain('30-minute');
    });

    it('has Razorpay link', () => {
      expect(info).toContain('rzp.io');
    });

    it('has h1 heading', () => {
      expect(info).toContain('<h1');
    });

    it('lists consultation features', () => {
      expect(info).toContain('video consultation');
      expect(info).toContain('healing plan');
    });

    it('has doctor image', () => {
      expect(info).toContain('dr-pradnya');
    });
  });

  describe('ContactForm.tsx', () => {
    const form = read('src/components/contact/ContactForm.tsx');

    it('has all 4 form fields', () => {
      expect(form).toContain('contact-name');
      expect(form).toContain('contact-phone');
      expect(form).toContain('contact-email');
      expect(form).toContain('contact-message');
    });

    it('has visible labels with htmlFor', () => {
      expect(form).toContain('htmlFor="contact-name"');
      expect(form).toContain('htmlFor="contact-phone"');
      expect(form).toContain('htmlFor="contact-email"');
      expect(form).toContain('htmlFor="contact-message"');
    });

    it('validates Indian phone number', () => {
      expect(form).toContain('[6-9]\\d{9}');
    });

    it('validates email format', () => {
      expect(form).toContain('[^\\s@]+@[^\\s@]+\\.[^\\s@]+');
    });

    it('has aria-describedby for errors', () => {
      expect(form).toContain('aria-describedby');
    });

    it('has aria-invalid', () => {
      expect(form).toContain('aria-invalid');
    });

    it('submits to /api/contact', () => {
      expect(form).toContain("'/api/contact'");
    });

    it('has submitting state with loader', () => {
      expect(form).toContain('Loader2');
      expect(form).toContain('Sending...');
    });

    it('has success state', () => {
      expect(form).toContain('Message Sent');
      expect(form).toContain('CheckCircle');
    });

    it('has error state with alert role', () => {
      expect(form).toContain('role="alert"');
      expect(form).toContain('AlertCircle');
    });

    it('has focus-visible styles', () => {
      expect(form).toContain('focus-visible:ring-2');
    });

    it('disables button while submitting', () => {
      expect(form).toContain("disabled={status === 'submitting'}");
    });

    it('clears field error on input change', () => {
      expect(form).toContain('[field]: undefined');
    });

    it('resets form on success', () => {
      expect(form).toContain("name: '', phone: '', email: '', message: ''");
    });
  });

  describe('ContactDetails.astro', () => {
    const details = read('src/components/contact/ContactDetails.astro');

    it('has WhatsApp link', () => {
      expect(details).toContain('wa.me');
    });

    it('has email link', () => {
      expect(details).toContain('mailto:');
    });

    it('opens WhatsApp in new tab', () => {
      expect(details).toContain('target="_blank"');
    });
  });

  describe('contact.astro page', () => {
    const page = read('src/pages/contact.astro');

    it('imports all 3 sections', () => {
      expect(page).toContain("import ConsultationInfo");
      expect(page).toContain("import ContactForm");
      expect(page).toContain("import ContactDetails");
    });

    it('uses client:visible for ContactForm', () => {
      expect(page).toContain('client:visible');
    });

    it('has prerender export', () => {
      expect(page).toContain('export const prerender = true');
    });

    it('has custom title and description', () => {
      expect(page).toContain('Contact Dr. Pradnya');
      expect(page).toContain('description=');
    });

    it('renders sections in correct order', () => {
      const infoPos = page.indexOf('<ConsultationInfo');
      const formPos = page.indexOf('<ContactForm');
      const detailsPos = page.indexOf('<ContactDetails');
      expect(infoPos).toBeLessThan(formPos);
      expect(formPos).toBeLessThan(detailsPos);
    });
  });

  describe('Build output', () => {
    it('prerendered contact/index.html exists', () => {
      expect(existsSync(resolve(root, 'dist/client/contact/index.html'))).toBe(true);
    });

    it('contact page contains consultation info', () => {
      const html = read('dist/client/contact/index.html');
      expect(html).toContain('Start Your Healing Journey');
      expect(html).toContain('499');
    });
  });
});
