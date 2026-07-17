# Dr. Pradnya Chittawadagi — Ayurvedic Physician Website

Modern multi-route website for Dr. Pradnya's Ayurvedic practice, built with Astro 7, React 19 islands, and Tailwind CSS v4. Deployed on Cloudflare Pages.

**Live site:** https://quantumspine.growgenx.shop

## Tech Stack

- **Framework:** Astro 7 (server mode with per-page prerendering)
- **UI Islands:** React 19 (only interactive components ship JS)
- **Styling:** Tailwind CSS v4 with custom forest/gold/earth color palette
- **Fonts:** Playfair Display (headings) + Inter (body), self-hosted via @fontsource
- **Deployment:** Cloudflare Workers (via GitHub Actions)
- **Blog Storage:** Cloudflare KV (posts, categories, tags)
- **Image Storage:** Cloudflare R2 (blog images)
- **Email:** Resend API (contact form)
- **Payments:** Razorpay (external links)
- **CAPTCHA:** Cloudflare Turnstile

## Sitemap

### Public Pages (Prerendered)

| Route | Description |
|-------|-------------|
| `/` | Homepage — hero, services, conditions, process, doctor intro, testimonials, blog preview, CTA |
| `/about` | About — doctor bio, credentials, philosophy |
| `/from-pain-to-power` | Program — back pain guide sales page (₹999, Razorpay) |
| `/contact` | Contact — consultation info (₹499), contact form, WhatsApp |

### Blog (Server-Rendered)

| Route | Description |
|-------|-------------|
| `/blog` | Blog listing — category filter, pagination (10/page) |
| `/blog/[slug]` | Individual blog post — markdown content, related posts, JSON-LD Article schema |
| `/sitemap-blog.xml` | Dynamic blog sitemap (reads from KV) |

### Admin Panel (Prerendered Shell, React SPA)

| Route | Description |
|-------|-------------|
| `/admin` | Admin login + dashboard |
| `/admin` → Dashboard | Post stats, recent posts |
| `/admin` → Posts | List, search, filter, delete posts |
| `/admin` → New/Edit Post | Markdown editor, SEO fields, category/tag management, publish controls |
| `/admin` → Images | Upload to R2, gallery grid, copy URL, delete |
| `/admin` → Categories & Tags | CRUD management |

### API Endpoints (Astro API Routes)

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/auth` | POST | Admin login — returns JWT (24h expiry) |
| `/api/posts` | GET, POST, PUT, DELETE | Blog post CRUD |
| `/api/images` | GET, POST, DELETE | R2 image management |
| `/api/categories` | GET, POST, DELETE | Category management |
| `/api/tags` | GET, POST, DELETE | Tag management |
| `/api/contact` | POST | Contact form → Resend email |

### Static Assets

| Path | Description |
|------|-------------|
| `/favicon.svg` | Leaf emoji favicon |
| `/robots.txt` | Allow all, disallow /admin, sitemaps |
| `/sitemap-index.xml` | Auto-generated sitemap for static pages |
| `/images/dr-pradnya-hero.jpg` | Doctor portrait (hero, intro, contact) |
| `/images/dr-pradnya-about.jpg` | Doctor full-length (about page) |
| `/images/ayurveda-herbs.jpg` | Herbs image |
| `/images/og-default.jpg` | Default Open Graph image |

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── admin/          # React SPA — AdminApp, Dashboard, PostList, BlogEditor, ImageGallery, ManageTaxonomies
│   │   ├── about/          # DoctorBio, Credentials, Philosophy
│   │   ├── blog/           # BlogCard, BlogPost, CategoryFilter, Pagination, RelatedPosts
│   │   ├── common/         # Header, MobileNav, Footer, Button, SectionHeading, WhatsAppFab, SEOHead
│   │   ├── contact/        # ConsultationInfo, ContactForm, ContactDetails
│   │   ├── home/           # Hero, Services, Conditions, Process, DoctorIntro, Testimonials, BlogPreview, CTABanner
│   │   └── program/        # ProgramHero, PainPoints, Benefits, Modules, PricingCard, CountdownTimer, ProgramFAQ
│   ├── data/               # services, conditions, testimonials, process-steps, faq, credentials, blog-types, blog-kv, markdown
│   ├── layouts/            # BaseLayout.astro
│   ├── lib/                # Shared utilities
│   │   └── auth.ts         # JWT create/verify, CORS helpers
│   ├── pages/
│   │   ├── admin/          # index.astro (React SPA shell)
│   │   ├── api/            # Astro API routes (server-rendered)
│   │   │   ├── auth.ts     # Admin login — returns JWT
│   │   │   ├── posts.ts    # Blog CRUD
│   │   │   ├── images.ts   # R2 image management
│   │   │   ├── categories.ts # Category CRUD
│   │   │   ├── tags.ts     # Tag CRUD
│   │   │   └── contact.ts  # Contact form → Resend email
│   │   ├── blog/           # index.astro, [slug].astro
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── from-pain-to-power.astro
│   │   ├── contact.astro
│   │   └── sitemap-blog.xml.ts
│   └── styles/             # global.css (Tailwind v4 + custom theme)
├── public/                 # Static assets (images, favicon, robots.txt)
├── tests/                  # 12 test files, 614 tests
├── astro.config.mjs
├── wrangler.toml
└── package.json
```

## Scripts

```bash
npm start          # Start dev server on port 4321
npm run stop       # Stop dev server
npm run build      # Production build
npm run preview    # Preview with wrangler (Cloudflare local)
npm test           # Run all 614 tests
npm run test:watch # Watch mode
npm run typecheck  # TypeScript check
```

## Secrets & Credentials

Secrets are stored in **GitHub Actions Secrets** and pushed to Cloudflare Workers on each deploy. They are never committed to the repo.

### How it works

1. Secrets live in **GitHub repo → Settings → Secrets and variables → Actions**
2. On push to `main`, the deploy workflow builds and deploys the Worker
3. After deploy, `wrangler versions secret bulk` pipes secrets from GitHub into the Worker

### Current secrets

| Secret | Where to set | Description |
|--------|-------------|-------------|
| `CLOUDFLARE_API_TOKEN` | GitHub Actions | Cloudflare API token ("Edit Workers" permission) |
| `CLOUDFLARE_ACCOUNT_ID` | GitHub Actions | Cloudflare account ID |
| `ADMIN_PASSWORD` | GitHub Actions | Password for /admin login |
| `JWT_SECRET` | GitHub Actions | Secret key for signing JWT tokens (32+ chars) |
| `RESEND_API_KEY` | GitHub Actions | Resend API key for contact form emails |
| `CONTACT_EMAIL` | GitHub Actions | Email address to receive contact form submissions |
| `TURNSTILE_SECRET_KEY` | GitHub Actions | Cloudflare Turnstile secret (optional) |

### Adding a new secret

1. Add it to **GitHub repo → Settings → Secrets → Actions** as a new repository secret
2. In `.github/workflows/deploy.yml`, add it to the "Upload Secrets" step:
   - Add to the `env:` block: `NEW_SECRET: ${{ secrets.NEW_SECRET }}`
   - Add to the JSON in the `echo` command: `\"NEW_SECRET\":\"$NEW_SECRET\"`
3. In your code, access it via `import { env } from 'cloudflare:workers'` then `(env as any).NEW_SECRET`
4. For local development, add it to `.env.local` (gitignored)

### Local development

For local dev, secrets go in `.env.local` at the project root (gitignored). This file is for personal reference only and never committed.

## Cloudflare Bindings

Configure in `wrangler.toml` after creating resources:

| Binding | Type | Description |
|---------|------|-------------|
| `SESSION` | KV Namespace | Astro session storage |
| `BLOG_KV` | KV Namespace | Blog post storage |
| `BLOG_IMAGES` | R2 Bucket | Blog image uploads |

## Admin Panel

The admin panel is at `/admin`. It uses password-based authentication:

1. Set `ADMIN_PASSWORD` and `JWT_SECRET` in GitHub Actions Secrets (deployed automatically)
2. Navigate to `https://quantumspine.growgenx.shop/admin`
3. Enter the admin password to sign in
4. JWT token is stored in localStorage (24-hour expiry)

Features:
- Dashboard with post statistics
- Create/edit posts with Markdown editor and live preview
- SEO fields (custom title, meta description) with character counts
- Category and tag management (create inline while editing)
- Featured image URL with preview
- Publish controls: Save Draft, Publish Now, Schedule
- Image gallery with R2 upload, copy URL, delete
- Search and filter posts by status

## SEO

- JSON-LD structured data on every page (MedicalBusiness, Person, Product, Article)
- Open Graph + Twitter Card meta tags
- Canonical URLs
- Dynamic blog sitemap
- robots.txt with sitemap references
- `noindex, nofollow` on admin pages

## Accessibility

- Skip-to-content link
- All sections have `aria-labelledby` or `aria-label`
- Mobile nav: `aria-expanded`, `aria-controls`
- FAQ accordion: `aria-expanded`, `aria-controls`
- Blog pagination: `aria-current="page"`
- All images have descriptive `alt` text
- `prefers-reduced-motion` disables all animations/transitions
- Focus-visible rings on interactive elements

## Deploy

Deployment is automatic via GitHub Actions on push to `main`.

```bash
git push origin main   # triggers build + deploy to Cloudflare Workers
```

### Manual deploy (if needed)

```bash
npm run build
CLOUDFLARE_ACCOUNT_ID=<id> npx wrangler deploy --config dist/server/wrangler.json
```

### First-time setup

1. Create Cloudflare resources: KV namespaces (`SESSION`, `BLOG_KV`), R2 bucket (`ayurvedic-blog-images`)
2. Copy KV namespace IDs into `wrangler.toml`
3. Create a Cloudflare API token with "Edit Workers" permission
4. Add all secrets to GitHub repo → Settings → Secrets → Actions (see [Secrets & Credentials](#secrets--credentials))
5. Push to `main` — GitHub Actions handles the rest
