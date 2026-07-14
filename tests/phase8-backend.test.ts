import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const root = resolve(__dirname, '..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf-8');

describe('Phase 8: Contact Form Backend', () => {
  describe('API file exists', () => {
    it('functions/api/contact.ts exists', () => {
      expect(existsSync(resolve(root, 'functions/api/contact.ts'))).toBe(true);
    });
  });

  describe('contact.ts structure', () => {
    const api = read('functions/api/contact.ts');

    it('defines Env interface with RESEND_API_KEY', () => {
      expect(api).toContain('RESEND_API_KEY');
    });

    it('defines Env interface with CONTACT_EMAIL', () => {
      expect(api).toContain('CONTACT_EMAIL');
    });

    it('defines Env interface with TURNSTILE_SECRET_KEY', () => {
      expect(api).toContain('TURNSTILE_SECRET_KEY');
    });

    it('exports onRequestPost handler', () => {
      expect(api).toContain('onRequestPost');
    });

    it('exports onRequestOptions for CORS preflight', () => {
      expect(api).toContain('onRequestOptions');
    });
  });

  describe('Input validation', () => {
    const api = read('functions/api/contact.ts');

    it('validates name is required', () => {
      expect(api).toContain('Name is required');
    });

    it('validates phone is required', () => {
      expect(api).toContain('Phone number is required');
    });

    it('validates Indian phone format', () => {
      expect(api).toContain('[6-9]\\d{9}');
    });

    it('validates email is required', () => {
      expect(api).toContain('Email is required');
    });

    it('validates email format', () => {
      expect(api).toContain('[^\\s@]+@[^\\s@]+\\.[^\\s@]+');
    });

    it('validates message is required', () => {
      expect(api).toContain('Message is required');
    });

    it('returns 400 for validation errors', () => {
      expect(api).toContain('status: 400');
    });
  });

  describe('Input sanitization', () => {
    const api = read('functions/api/contact.ts');

    it('has sanitize function', () => {
      expect(api).toContain('function sanitize');
    });

    it('strips angle brackets to prevent XSS', () => {
      expect(api).toContain('[<>]');
    });

    it('sanitizes all fields in email body', () => {
      expect(api).toContain('sanitize(payload.name)');
      expect(api).toContain('sanitize(payload.phone)');
      expect(api).toContain('sanitize(payload.email)');
      expect(api).toContain('sanitize(payload.message)');
    });
  });

  describe('Turnstile CAPTCHA verification', () => {
    const api = read('functions/api/contact.ts');

    it('has verifyTurnstile function', () => {
      expect(api).toContain('verifyTurnstile');
    });

    it('calls Cloudflare Turnstile API', () => {
      expect(api).toContain('challenges.cloudflare.com/turnstile/v0/siteverify');
    });

    it('passes IP address for verification', () => {
      expect(api).toContain('CF-Connecting-IP');
    });

    it('returns 403 on failed verification', () => {
      expect(api).toContain('status: 403');
    });

    it('skips verification if no secret key configured', () => {
      expect(api).toContain('context.env.TURNSTILE_SECRET_KEY && payload.turnstileToken');
    });
  });

  describe('Email sending via Resend', () => {
    const api = read('functions/api/contact.ts');

    it('calls Resend API endpoint', () => {
      expect(api).toContain('api.resend.com/emails');
    });

    it('uses Bearer token auth', () => {
      expect(api).toContain('Bearer');
    });

    it('sends to CONTACT_EMAIL', () => {
      expect(api).toContain('env.CONTACT_EMAIL');
    });

    it('has subject with sender name', () => {
      expect(api).toContain('New Contact:');
    });

    it('sends HTML email with all form fields', () => {
      expect(api).toContain('html:');
    });

    it('handles Resend API errors', () => {
      expect(api).toContain('Resend API error');
    });
  });

  describe('CORS configuration', () => {
    const api = read('functions/api/contact.ts');

    it('allows production origin', () => {
      expect(api).toContain('quantumspine.growgenx.shop');
    });

    it('allows localhost for dev', () => {
      expect(api).toContain('localhost:4321');
    });

    it('sets CORS headers', () => {
      expect(api).toContain('Access-Control-Allow-Origin');
      expect(api).toContain('Access-Control-Allow-Methods');
      expect(api).toContain('Access-Control-Allow-Headers');
    });

    it('handles OPTIONS preflight with 204', () => {
      expect(api).toContain('status: 204');
    });
  });

  describe('Error handling', () => {
    const api = read('functions/api/contact.ts');

    it('catches and logs errors', () => {
      expect(api).toContain('console.error');
    });

    it('returns 500 for unexpected errors', () => {
      expect(api).toContain('status: 500');
    });

    it('returns generic error message to client', () => {
      expect(api).toContain('Something went wrong');
    });

    it('returns JSON for all responses', () => {
      expect(api).toContain("'Content-Type': 'application/json'");
    });
  });
});
