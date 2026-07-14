# Ayurvedic Physician Website Rebuild — Design Spec

## Context

Dr. Pradnya Chittawadagi's Ayurvedic practice website (quantumspine.growgenx.shop) is currently a WordPress site on GrowGenX shared hosting. We're rebuilding it as a modern multi-route SPA using Astro + React islands, deployed to Cloudflare Pages. The goal: faster performance, modern design with the original earth/forest color palette, minimal JavaScript footprint, and full SEO support.

**Reference sites for design direction:**
- Kerala Ayurveda (keralaayurveda.us) — premium warmth, trust-building, earthy greens
- Kapiva (kapiva.in) — modern cleanliness, generous whitespace, green accents

---

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Astro 5.x (hybrid mode) | Static-first, islands architecture, View Transitions |
| UI Islands | React 18 | ~7 interactive components (public + admin) |
| Styling | Tailwind CSS 3.4 | Utility-first, matches existing SolarGrid patterns |
| Fonts | @fontsource/playfair-display, @fontsource/inter | Self-hosted, no external requests |
| Blog Storage | Cloudflare KV | Key-value store for blog posts, categories, tags |
| Image Storage | Cloudflare R2 | Object storage for blog images |
| Markdown Editor | @uiw/react-md-editor | Self-contained, no CDN dependency |
| Icons | lucide-react | Consistent icon set |
| Deployment | Cloudflare Pages + Pages Functions | Edge delivery, free tier sufficient |
| Email | Resend API | Contact form email delivery |
| Payments | Razorpay external links | Existing payment links preserved |
| CAPTCHA | Cloudflare Turnstile | Free, privacy-friendly |

---

## Project Structure

```
AyurvedicPhysican/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── tailwind.config.mjs
├── wrangler.toml
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── images/                    # Downloaded from WordPress, converted to WebP
│       ├── dr-pradnya.webp
│       ├── hero-bg.webp
│       ├── logo.svg
│       └── og-image.jpg
├── functions/
│   └── api/
│       └── contact.ts             # Cloudflare Pages Function
├── src/
│   ├── assets/
│   │   └── images/                # Astro-processed images (srcset, avif/webp)
│   ├── data/
│   │   ├── services.ts
│   │   ├── conditions.ts
│   │   ├── testimonials.ts
│   │   ├── faq.ts
│   │   └── process-steps.ts
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── from-pain-to-power.astro
│   │   └── contact.astro
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.astro
│   │   │   ├── MobileNav.tsx          # React island
│   │   │   ├── Footer.astro
│   │   │   ├── Button.astro
│   │   │   ├── SectionHeading.astro
│   │   │   ├── WhatsAppFab.astro
│   │   │   └── SEOHead.astro
│   │   ├── home/
│   │   │   ├── Hero.astro
│   │   │   ├── Services.astro
│   │   │   ├── Conditions.astro
│   │   │   ├── Process.astro
│   │   │   ├── DoctorIntro.astro
│   │   │   ├── Testimonials.astro
│   │   │   └── CTABanner.astro
│   │   ├── about/
│   │   │   ├── DoctorBio.astro
│   │   │   ├── Philosophy.astro
│   │   │   └── Credentials.astro
│   │   ├── program/
│   │   │   ├── ProgramHero.astro
│   │   │   ├── PainPoints.astro
│   │   │   ├── Benefits.astro
│   │   │   ├── Modules.astro
│   │   │   ├── PricingCard.astro
│   │   │   ├── CountdownTimer.tsx     # React island
│   │   │   └── ProgramFAQ.tsx         # React island
│   │   └── contact/
│   │       ├── ContactForm.tsx        # React island
│   │       ├── ConsultationInfo.astro
│   │       └── ContactDetails.astro
│   └── styles/
│       └── global.css
```

---

## Color Palette

All combinations meet WCAG AA contrast requirements.

| Token | Hex | Usage |
|---|---|---|
| `forest-900` | `#1B4332` | Primary headings, nav, dark backgrounds |
| `forest-700` | `#2D6A4F` | Subheadings, secondary text |
| `forest-500` | `#40916C` | Links, accent elements |
| `forest-100` | `#D8F3DC` | Badges, light tinted backgrounds |
| `forest-50` | `#F0FFF4` | Alternate section backgrounds |
| `gold-600` | `#B8860B` | Primary CTA buttons, highlights |
| `gold-500` | `#D4A843` | Secondary CTA, hover states |
| `gold-100` | `#FDF6E3` | Warm background sections |
| `earth-800` | `#5D4037` | Body text |
| `earth-100` | `#EFEBE9` | Card backgrounds, borders |
| `cream` | `#FFFDF7` | Page background |

---

## Typography

- **Headings**: Playfair Display (serif), weights 600/700
- **Body**: Inter (sans-serif), weights 400/500/600

| Element | Classes |
|---|---|
| Hero H1 | `text-5xl md:text-6xl font-heading font-bold text-forest-900` |
| Section H2 | `text-3xl md:text-4xl font-heading font-semibold text-forest-900` |
| Card H3 | `text-xl font-heading font-semibold text-forest-700` |
| Body | `text-base font-body text-earth-800` |
| Label | `text-sm font-body font-medium tracking-wide uppercase text-forest-500` |

---

## Page Designs

### Homepage (`/`)

1. **Hero** — Split layout. Left: headline "Reverse Chronic Diseases Naturally with Expert Ayurvedic Care", subtitle, two CTAs (gold "Book Consultation" + green "WhatsApp"). Right: Dr. Pradnya photo with decorative botanical SVG. Stats bar below: "12+ Years", "5000+ Patients", "Gold Medalist".

2. **Services** — Section label + heading. 4 cards in 2x2 grid (md), stacked mobile. Each: lucide icon, title, description. `earth-100` card bg, `forest-700` title, hover shadow lift.

3. **Conditions Treated** — Heading + 6 condition pills (rounded, `forest-100` bg, `forest-700` text).

4. **Process** — "A Simple Path to Lasting Healing". 4 numbered steps: Book → Plan → Follow → Transform. Horizontal stepper (desktop), vertical (mobile). `gold-600` step numbers, dotted connector line.

5. **Doctor Intro** — Side-by-side: photo left, brief bio + credential badges right. Link to About page.

6. **Testimonials** — 3-card grid (desktop), stacked (mobile). Each: quote, patient name, location, condition. Star rating in `gold-500`.

7. **CTA Banner** — Full-width `forest-900` bg. White text: "Your Healing Journey Starts Today". Two CTAs.

### About (`/about`)

1. **Doctor Bio** — Large photo + full narrative bio
2. **Credentials** — 4-card grid: Gold Medalist, Panchakarma Specialist, PhD Clinical Ayurveda, Chronic Disease Reversal Expert
3. **Philosophy** — "Where Classical Ayurveda Meets Modern Science" with decorative botanical illustration

### Program (`/from-pain-to-power`)

1. **ProgramHero** — Headline, price badge (₹999), primary CTA (Razorpay link)
2. **PainPoints** — "Are you struggling with..." bullet list with warning icons
3. **Benefits** — "What you'll get" with checkmark icons
4. **Modules** — 6 numbered module cards (2x3 grid desktop)
5. **PricingCard** — Prominent: price, Buy Now Razorpay link, instant access note
6. **CountdownTimer** — React island. Configurable end date
7. **ProgramFAQ** — React island. 5 questions, accordion pattern

### Contact (`/contact`)

1. **ConsultationInfo** — "Book a 30-min consultation for ₹499", what to expect
2. **ContactForm** — React island. Fields: Name, Phone, Email, Message. Submits to `/api/contact`. Turnstile CAPTCHA. Success/error states
3. **ContactDetails** — WhatsApp link, Razorpay booking link

---

## Interactive Components (React Islands)

### MobileNav.tsx
- Hamburger toggle, slide-in/overlay menu
- Hydration: `client:media="(max-width: 768px)"` (zero JS on desktop)

### ContactForm.tsx
- Controlled form with client-side validation
- Phone: 10-digit Indian number validation
- Email: standard regex
- Submits JSON to `/api/contact`
- Cloudflare Turnstile widget embedded
- States: idle, submitting, success, error

### CountdownTimer.tsx
- Accepts `endDate` prop
- Displays days:hours:minutes:seconds
- Updates every second via `setInterval`
- Hydration: `client:visible`

### ProgramFAQ.tsx
- Accordion pattern: one item open at a time
- Click toggles, CSS transition on height
- Hydration: `client:visible`

---

## Contact Form Backend

**`functions/api/contact.ts`** (Cloudflare Pages Function):

- Accepts POST with JSON body: `{ name, phone, email, message, turnstileToken }`
- Validates Turnstile token server-side via Cloudflare API
- Validates inputs (required fields, phone format, email format)
- Sanitizes inputs (strip HTML)
- Sends email via Resend API to configured doctor email
- Returns JSON response
- CORS restricted to site origin

Environment variables (set in Cloudflare dashboard, not committed):
- `RESEND_API_KEY`
- `CONTACT_EMAIL`
- `TURNSTILE_SECRET_KEY`

---

## Animations & Interactions

No animation libraries. CSS + Astro native features only:

- **Page transitions**: Astro View Transitions API (cross-fade between routes)
- **Scroll reveal**: CSS `animation-timeline: view()` with graceful fallback
- **Card hover**: `hover:shadow-lg hover:-translate-y-1 transition-all duration-300`
- **WhatsApp FAB**: Subtle CSS pulse animation on outer ring
- **Mobile nav**: CSS transition on height/opacity
- **Reduced motion**: All animations wrapped in `@media (prefers-reduced-motion: no-preference)`

---

## SEO

### Meta Tags (per-page via SEOHead.astro)
- Unique `<title>` and `<meta description>` per page
- Open Graph: title, description, image, url, type
- Twitter Card: summary_large_image
- Canonical URL

### Structured Data (JSON-LD)
- **Homepage**: `MedicalBusiness` schema
- **About**: `Person` schema (doctor credentials)
- **Program**: `Product` schema (guide with price)

### Technical
- `@astrojs/sitemap` auto-generates sitemap.xml
- `robots.txt` in public/
- Semantic HTML throughout (`<main>`, `<nav>`, `<section>`, `<article>`)
- All images have descriptive alt text

---

## Accessibility

- Skip-to-content link as first focusable element
- All interactive elements: `focus-visible:ring-2 focus-visible:ring-forest-500`
- Form inputs: visible labels, `aria-describedby` for errors, `aria-live="polite"` for status
- Mobile nav: `aria-expanded`, `aria-controls`
- Touch targets: minimum 44x44px
- Color contrast: all pairings WCAG AA compliant
- `prefers-reduced-motion` respected

---

## Responsive Breakpoints

Mobile-first, Tailwind defaults:
- **Default** (< 768px): Single column, stacked layouts
- **md** (768px): 2-column grids, side-by-side hero
- **lg** (1024px): Full grid layouts (3-4 columns), larger typography

Container: `max-w-7xl mx-auto px-6`

---

## Image Strategy

1. Download all images from WordPress site
2. Convert to WebP (keep originals as fallback)
3. Place key images in `src/assets/images/` for Astro processing (automatic srcset, avif/webp)
4. Static assets (favicon, OG image) in `public/`
5. Hero + doctor photo: `loading="eager"`, `fetchpriority="high"`
6. All below-fold images: `loading="lazy"`
7. Logo + decorative botanicals: inline SVG

---

## Deployment (Cloudflare Pages)

**astro.config.mjs**: `output: 'hybrid'`, `adapter: cloudflare()`

**wrangler.toml**:
```toml
name = "ayurvedic-physician"
compatibility_date = "2024-01-01"
pages_build_output_dir = "./dist"
```

**Build**: `npm run build` → outputs to `dist/`
**Preview**: `wrangler pages dev ./dist`

Environment variables set in Cloudflare dashboard:
- `RESEND_API_KEY`
- `CONTACT_EMAIL`
- `TURNSTILE_SECRET_KEY`

---

## Verification Plan

1. **Dev server**: `npm run dev` — verify all 4 pages render, navigation works, View Transitions animate
2. **Responsive**: Test at 375px, 768px, 1024px, 1440px widths
3. **React islands**: Verify MobileNav toggle, ContactForm submission (mock API), CountdownTimer ticks, FAQ accordion
4. **Contact form E2E**: Submit form → Cloudflare Function processes → email received
5. **Razorpay links**: Verify external payment links open correctly
6. **Lighthouse**: Target 90+ on Performance, Accessibility, Best Practices, SEO
7. **Deploy preview**: `wrangler pages dev` locally, then deploy to Cloudflare Pages staging
8. **Cross-browser**: Test Chrome, Safari, Firefox on desktop + mobile Safari/Chrome
