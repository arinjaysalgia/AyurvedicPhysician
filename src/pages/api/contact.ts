import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

interface ContactPayload {
  name: string;
  phone: string;
  email: string;
  message: string;
  turnstileToken?: string;
}

function sanitize(str: string): string {
  return str.replace(/[<>]/g, '').trim();
}

function validatePayload(data: ContactPayload): string | null {
  if (!data.name?.trim()) return 'Name is required.';
  if (!data.phone?.trim()) return 'Phone number is required.';
  if (!/^[6-9]\d{9}$/.test(data.phone.replace(/\s/g, ''))) {
    return 'Invalid phone number.';
  }
  if (!data.email?.trim()) return 'Email is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return 'Invalid email address.';
  }
  if (!data.message?.trim()) return 'Message is required.';
  return null;
}

async function verifyTurnstile(token: string, secret: string, ip: string): Promise<boolean> {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  const data = await res.json() as { success: boolean };
  return data.success;
}

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const origin = request.headers.get('Origin') || '';
  const allowedOrigins = [
    'https://quantumspine.growgenx.shop',
    'http://localhost:4321',
  ];

  const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  const corsHeaders = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  try {
    const payload = await request.json() as ContactPayload;

    const validationError = validatePayload(payload);
    if (validationError) {
      return new Response(
        JSON.stringify({ error: validationError }),
        { status: 400, headers: corsHeaders }
      );
    }

    const turnstileKey = (env as any).TURNSTILE_SECRET_KEY;
    if (turnstileKey && payload.turnstileToken) {
      const ip = request.headers.get('CF-Connecting-IP') || '';
      const valid = await verifyTurnstile(payload.turnstileToken, turnstileKey, ip);
      if (!valid) {
        return new Response(
          JSON.stringify({ error: 'CAPTCHA verification failed. Please try again.' }),
          { status: 403, headers: corsHeaders }
        );
      }
    }

    const resendKey = (env as any).RESEND_API_KEY;
    const contactEmail = (env as any).CONTACT_EMAIL;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Website Contact <noreply@quantumspine.growgenx.shop>',
        to: [contactEmail],
        subject: `New Contact: ${sanitize(payload.name)}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${sanitize(payload.name)}</p>
          <p><strong>Phone:</strong> ${sanitize(payload.phone)}</p>
          <p><strong>Email:</strong> ${sanitize(payload.email)}</p>
          <p><strong>Message:</strong></p>
          <p>${sanitize(payload.message)}</p>
          <hr />
          <p style="color: #999; font-size: 12px;">
            Sent from the website contact form at ${new Date().toISOString()}
          </p>
        `,
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      throw new Error(`Resend API error: ${res.status} ${errorData}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error('Contact form error:', err);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again later.' }),
      { status: 500, headers: corsHeaders }
    );
  }
};
