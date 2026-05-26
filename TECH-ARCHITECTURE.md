# Tech Architecture — Core Reference

**Purpose:** The core technical architecture for all websites built going forward. This document is the source of truth — feed it to any AI tool, designer, or developer to scaffold a new project on this stack.

---

## 1. Locked Stack

| Layer | Choice |
|---|---|
| Framework | **Next.js 15** (App Router) |
| Language | **TypeScript** (strict mode) |
| Styling | **Tailwind CSS v4** |
| Components | **shadcn/ui** |
| Animation | **Framer Motion** |
| Forms | **react-hook-form + zod** |
| Icons | **lucide-react** |
| Auth + Database | **Supabase** |
| Marketing Email | **Mailchimp** (newsletters, audiences) |
| Transactional Email | **Resend** (password resets, form receipts, notifications) |
| Analytics | **PostHog** (product analytics + session replay) |
| Error Tracking | **Sentry** |
| Hosting | **Vercel** |
| Source Control | **GitHub** |
| Package Manager | **pnpm** |

---

## 2. Folder Structure

```
my-nextjs-app/
├── .github/workflows/ci.yml          # lint + typecheck + build on PR
├── .vscode/settings.json             # format on save, tailwind intellisense
├── public/
│   └── images/                       # site images (replace files in place to update)
│       ├── hero.jpg
│       ├── about.jpg
│       └── ...
├── src/
│   ├── app/
│   │   ├── layout.tsx                # metadata, fonts, providers
│   │   ├── page.tsx
│   │   ├── providers.tsx             # posthog provider
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── opengraph-image.tsx       # dynamic OG image
│   │   ├── global-error.tsx          # Sentry root error boundary
│   │   └── api/
│   │       ├── newsletter/route.ts   # Mailchimp signup endpoint
│   │       └── contact/route.ts      # Resend transactional send
│   ├── components/
│   │   ├── ui/                       # shadcn components
│   │   ├── motion/                   # reusable framer motion primitives
│   │   └── ...                       # your components
│   ├── lib/
│   │   ├── utils.ts                  # cn() helper
│   │   ├── supabase/
│   │   │   ├── client.ts             # browser client
│   │   │   └── server.ts             # server client (SSR/RSC)
│   │   ├── posthog/
│   │   │   ├── client.ts
│   │   │   └── server.ts
│   │   ├── mailchimp/
│   │   │   └── marketing.ts          # newsletter list management
│   │   ├── resend/
│   │   │   └── send.ts               # transactional email helpers
│   │   └── validation/               # zod schemas
│   └── styles/globals.css
├── instrumentation.ts                # Sentry + PostHog server init
├── instrumentation-client.ts         # Sentry browser SDK init (replaces sentry.client.config.ts in @sentry/nextjs 9+)
├── sentry.server.config.ts
├── sentry.edge.config.ts
├── .env.example
├── .gitignore                        # .env*, .vercel, node_modules, .next
├── .prettierrc
├── eslint.config.mjs
├── components.json                   # shadcn config
├── next.config.ts                    # security headers, Sentry wrap
├── tailwind.config.js
├── tsconfig.json                     # "strict": true
├── package.json
└── README.md
```

---

## 3. Dependencies

**Production:**
```
next react react-dom typescript
tailwindcss @tailwindcss/postcss
class-variance-authority clsx tailwind-merge tailwindcss-animate
lucide-react
framer-motion
react-hook-form @hookform/resolvers zod
@supabase/ssr @supabase/supabase-js
@sentry/nextjs
posthog-js posthog-node
@mailchimp/mailchimp_marketing
resend
```

**Dev:**
```
@types/node @types/react @types/react-dom
eslint eslint-config-next
prettier prettier-plugin-tailwindcss
husky lint-staged
```

---

## 4. Environment Variables (`.env.example`)

```bash
# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SECRET_KEY=sb_secret_xxxxxxxxxxxxxxxxxxxxxx   # server-only, never expose

# Sentry
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=                       # for source map upload
SENTRY_ORG=
SENTRY_PROJECT=

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Mailchimp (marketing — newsletters, audiences)
MAILCHIMP_API_KEY=                       # server-only
MAILCHIMP_SERVER_PREFIX=                 # e.g. us21
MAILCHIMP_AUDIENCE_ID=

# Resend (transactional — receipts, password resets, notifications)
RESEND_API_KEY=                          # server-only
RESEND_FROM_EMAIL=hello@yourdomain.com
```

**Rules:**
- `NEXT_PUBLIC_*` variables are bundled into client-side JavaScript. Anything sensitive must **not** have this prefix.
- `SUPABASE_SECRET_KEY`, `MAILCHIMP_API_KEY`, `RESEND_API_KEY`, `SENTRY_AUTH_TOKEN` are server-only. Use only in Server Components, Route Handlers, Server Actions, or `instrumentation.ts`.
- Commit `.env.example` only. `.env.local` is gitignored.
- **Supabase key format note:** Supabase moved to a new key system. `sb_publishable_...` replaces the old `anon` key (safe for the browser). `sb_secret_...` replaces the old `service_role` key (server-only). If you have old JWT-format keys, they still work — but new projects should use the new format.

---

## 5. Integration Setup

### Supabase
- Use `@supabase/ssr` — provides separate clients for browser and server.
- The **publishable key** (`sb_publishable_...`) goes in `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and is safe for browser code.
- The **secret key** (`sb_secret_...`) bypasses Row Level Security — use it only in trusted server contexts (admin operations, cron jobs, webhooks).
- Enable **Row Level Security (RLS)** on every table from day one. Default-deny, then write policies.

### Sentry
- One-time install per repo: `npx @sentry/wizard@latest -i nextjs`
- Auto-generates client/server/edge configs and wraps `next.config.ts`.
- Source maps upload on production builds via `SENTRY_AUTH_TOKEN`.
- Add the Vercel ↔ Sentry integration so releases auto-link to deploys.
- Start with `tracesSampleRate: 0.1` and tune.

### PostHog
- Initialize the browser client in `app/providers.tsx`, wrapped in `<PostHogProvider>`.
- Initialize the Node client in `instrumentation.ts` for server-side events.
- Enable: autocapture, session replay, web vitals tracking.
- Capture key events explicitly: `signup`, `form_submit`, `cta_click`, `newsletter_subscribe`.
- Pick `us` or `eu` hosting based on your audience.

### Mailchimp (Marketing)
- Used for newsletter signups, audience management, marketing campaigns.
- All calls happen **server-side only** via Route Handlers (`/api/newsletter`).
- Never expose the Mailchimp API key to the browser.
- The user submits the newsletter form → your Route Handler calls Mailchimp → adds them to the audience.

### Resend (Transactional)
- Used for: contact form receipts, password resets, notifications, order confirmations, any email triggered by a user action.
- Generous free tier (3,000 emails/month, 100/day), clean API.
- All calls happen **server-side only**.
- Verify your sending domain in Resend dashboard before going live (adds SPF, DKIM, DMARC for deliverability).

### Framer Motion
- Create reusable motion primitives in `src/components/motion/` (`FadeIn`, `SlideUp`, `Stagger`, `Reveal`) — consistent animation language across the site.
- Use `LazyMotion` with `domAnimation` to keep bundle size down.
- Respect `prefers-reduced-motion` via the `useReducedMotion` hook (also good for SEO/accessibility).

---

## 6. Deployment Workflow

```
main (protected, production)
  ↑
  PR + Vercel Preview URL + CI green
  ↑
  feature/<short-description>
  ↑
  local dev
```

**Per-feature loop:**
1. `git checkout -b feature/x` from `main`
2. Build locally, commit small
3. Push → Vercel auto-builds a Preview
4. Open PR → CI runs (lint, typecheck, build)
5. Test the Preview URL on desktop + mobile
6. Optional Codex review pass
7. Merge → auto-deploy to production
8. Delete the branch

**Branch protection on `main` (set once per repo):**
- Require PR before merge
- Require CI green
- Require Preview deployment success
- No direct pushes, no force-push

---

## 7. SEO Checklist (Built for Organic Ranking)

Organic traffic is a real goal — these aren't optional. Every site ships with all of this from day one.

### Technical SEO
- [ ] `app/sitemap.ts` generates a dynamic XML sitemap
- [ ] `app/robots.ts` allows crawlers, points to sitemap
- [ ] Canonical URLs set in `metadata` for every route (prevents duplicate content penalties)
- [ ] `hreflang` tags if the site has multiple languages or regions
- [ ] HTTPS only (Vercel handles this automatically)
- [ ] Clean URL structure — readable slugs, no query-string-heavy URLs (`/blog/seo-guide` not `/post?id=42`)
- [ ] No broken internal links — run a link checker before launch
- [ ] 301 redirects for any URL changes — never let old pages 404
- [ ] `lang="en"` (or appropriate) on the `<html>` tag

### On-Page SEO
- [ ] Unique `<title>` per page (50–60 chars), set via `metadata.title`
- [ ] Unique meta description per page (140–160 chars), set via `metadata.description`
- [ ] One `<h1>` per page, matching search intent
- [ ] Heading hierarchy in order: `h1` → `h2` → `h3` (don't skip levels)
- [ ] Internal linking between related pages — every page should link to and be linked from others
- [ ] Descriptive anchor text — never "click here," always describe the destination
- [ ] Breadcrumb navigation on multi-level sites (with BreadcrumbList structured data)

### Structured Data (JSON-LD)
Add the schema types that match the content:
- [ ] `Organization` (or `LocalBusiness`) — on every page, in the layout
- [ ] `WebSite` with `SearchAction` if the site has search
- [ ] `Article` / `BlogPosting` — for blog and article pages
- [ ] `Product` — for product pages
- [ ] `FAQPage` — for FAQ sections (can earn rich results in Google)
- [ ] `BreadcrumbList` — for breadcrumb navigation
- [ ] `Person` — for author/team pages

### Social / Sharing
- [ ] Open Graph tags set in every route's `metadata.openGraph`
- [ ] Twitter Card tags via `metadata.twitter`
- [ ] Dynamic OG images per page via `opengraph-image.tsx`
- [ ] OG images are 1200×630, under 1MB, with readable text

### Content & Indexing
- [ ] Submit sitemap to Google Search Console and Bing Webmaster Tools after launch
- [ ] Verify domain ownership in both tools
- [ ] Monitor Search Console weekly for crawl errors, coverage issues, manual actions
- [ ] No `noindex` on production pages by accident (common bug — double-check)
- [ ] Pagination uses proper rel/links if applicable

### Core Web Vitals (Google ranking factor)
- [ ] **LCP** (Largest Contentful Paint) under 2.5s — optimize hero image, use `priority` on `next/image`
- [ ] **INP** (Interaction to Next Paint) under 200ms — avoid heavy client JS on first load
- [ ] **CLS** (Cumulative Layout Shift) under 0.1 — always set width/height on images, reserve space for ads/embeds
- [ ] Test with PageSpeed Insights on every Preview before merging

### Mobile & Accessibility (Google ranks mobile-first)
- [ ] Responsive on every viewport from 320px up
- [ ] Tap targets at least 44×44px
- [ ] Text readable without zoom (16px+ body)
- [ ] Alt text on every meaningful image (also helps image search ranking)
- [ ] Semantic HTML (`<main>`, `<article>`, `<nav>`, `<aside>`, `<section>`)
- [ ] Color contrast meets WCAG AA (4.5:1 for body text)
- [ ] Keyboard-navigable

---

## 8. Security Checklist

- [ ] `.env.local` confirmed in `.gitignore`
- [ ] No secret has a `NEXT_PUBLIC_` prefix
- [ ] Supabase RLS enabled on every table, default-deny
- [ ] Supabase secret key (`sb_secret_...`) only used server-side
- [ ] Security headers in `next.config.ts`: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, sensible CSP, `Strict-Transport-Security`
- [ ] Rate-limit public Route Handlers and Server Actions (Upstash Redis or Vercel KV)
- [ ] CAPTCHA on public forms (Cloudflare Turnstile — free, privacy-friendly)
- [ ] Zod-validate all inputs server-side (don't trust the client)
- [ ] GitHub: secret scanning + Dependabot alerts enabled
- [ ] CI step that fails on committed secrets (`gitleaks-action`)
- [ ] Any leaked key gets rotated immediately — never try to scrub git history
- [ ] Resend sending domain verified (SPF/DKIM/DMARC) before launch

---

## 9. Performance Checklist

- [ ] Lighthouse 95+ on Performance, Accessibility, Best Practices, SEO before merging any PR
- [ ] Vercel Speed Insights enabled in production
- [ ] PostHog web vitals tracked
- [ ] Images: `next/image` with proper `sizes` attribute, `priority` on above-the-fold images
- [ ] Fonts: `next/font` with `display: swap`, preload primary font
- [ ] Framer Motion wrapped in `LazyMotion` with `domAnimation`
- [ ] No client component above the fold unless interactivity is required
- [ ] Third-party scripts loaded via `next/script` with `strategy="lazyOnload"` when possible
- [ ] Bundle analyzed periodically (`@next/bundle-analyzer`)
- [ ] No layout shift from late-loading content (reserve space)

---

## 10. Design Principles

**The websites must look modern, creative, alive, and captivating — never like a PowerPoint deck or a static brochure.** This is non-negotiable. The visual quality is what separates a forgettable site from one that converts.

### Look & Feel — Light mode only
- **Light mode is the standard.** No dark mode toggle. Clean, bright, confident.
- **Generous whitespace.** Section padding should feel deliberate and breathing. Default to more, then reduce. Cramped sites look amateur.
- **Bold typography.** Use a distinctive display font for headlines + a clean sans for body. Big, confident type hierarchy. Type is 80% of the design.
- **Real color, not just neutrals.** Pick a strong primary color and use it deliberately. Neutrals everywhere = boring.
- **Asymmetric layouts.** Not everything centered. Offset images, overlapping elements, broken grids — these are what make a site feel designed rather than templated.
- **Gradients, mesh backgrounds, subtle textures.** Used in moderation — they add depth and life.

### Motion — This is what makes a site feel "alive"
- **Scroll-triggered reveals.** Sections fade and slide in as they enter the viewport. Use Framer Motion's `whileInView`.
- **Page transitions.** Smooth fades or slides between routes.
- **Hover micro-interactions on every interactive element.** Buttons grow, links underline animate, images zoom subtly, cards lift.
- **Animated hero elements.** A static hero is a dead hero. Even a subtle floating element or gradient shift transforms first impressions.
- **Stagger animations.** When a list or grid enters, items appear in sequence — not all at once.
- **Cursor effects** (used sparingly). Custom cursors or magnetic buttons on key CTAs feel premium.
- **Respect `prefers-reduced-motion`.** Always. Accessibility and SEO both reward this.

### What "captivating" actually means
- The first 3 seconds decide whether someone stays. The hero must hook them with strong type, real motion, and a clear value proposition.
- Every scroll should reveal something new — a new layout, a new color treatment, a new interaction. Predictable = forgettable.
- Photography and imagery are 50% of the impression. Generic stock photos kill modern sites instantly (more on this below).

### Images — You provide them, easy to update
- All images live under `/public/assets/` with descriptive filenames, organized by feature subfolder (`/public/assets/home/hero.jpg`, `/public/assets/about/about.jpg`, `/public/assets/blog/...`, `/public/assets/logo/...`, etc.).
- Code references them by path (`/assets/home/hero.jpg`) — never imported as modules.
- **To update an image, you just drop a new file under `/public/assets/` with the same filename.** No code changes, no deploys to figure out — replace the file, commit, push, done.
- Recommended sizes:
  - Hero: 1920×1080 (or larger for retina)
  - Feature/content: 1200×800
  - Thumbnail: 600×400
  - All images compressed (use squoosh.app or similar before upload — keep under 200KB where possible)
- Placeholders during development: use Unsplash URLs (`https://images.unsplash.com/...`) or a service like `picsum.photos`. Replace before launch.

---

**This is the locked architecture.** Hand this document to any AI tool, developer, or contributor and they'll have everything they need to build on this stack consistently.
