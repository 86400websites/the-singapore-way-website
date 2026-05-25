# The Singapore Way — Migration Report

**Branch:** `codex/migrate-next15-architecture`
**Completed:** 2026-05-25
**Owner-facing companion document.** Per-phase implementation detail lives in [MIGRATION_STATE.md](./MIGRATION_STATE.md). This report is the canonical summary.

---

## TL;DR

The Singapore Way website was migrated from a Vite + React Router SPA into the locked Next.js 15 App Router stack defined in [tech-architecture.md](./tech-architecture.md) and styled per [DESIGN.md](./DESIGN.md). The migration ran across 15 phases (Phases 1–14 plus Phase 7b), preserving every public URL, every piece of copy, every image, and every user-visible behavior of the legacy site. The final build emits 37 routes, all typecheck and build clean, all six security headers ship live, and the only remaining work is platform configuration (Vercel env vars + provider dashboards) that cannot be done from this branch.

---

## Starting state

The repo before Phase 1 was a React 18 single-page app:

- **Framework:** Vite 5 + React 18, TypeScript, React Router 6.
- **Styling:** Tailwind CSS v3 with custom utility classes in `src/index.css`.
- **Routing:** `src/App.tsx` wired ~20 routes with React Router; no SSR.
- **Auth:** browser-only Supabase client using `import.meta.env.VITE_SUPABASE_*`, a React context (`AuthContext`), and a `ProtectedRoute` HOC for `/account`.
- **Forms:** Footer newsletter + per-page `RequestModal` were inert (no submit handler).
- **Data:** blog posts inlined in `src/data/blogPosts.ts`.
- **Images:** all served from `public/assets/**` via raw `<img>` tags.
- **Build/deploy:** `npm` + `package-lock.json`; Vercel using the Vite framework preset; output directory `dist/`.
- **Repo weight:** ~280 MB working tree, including ~106 MB of reference / build-helper folders (`Content and Copy/`, `main pages/`, `assets/`, `dist/`) that were never served.
- **Observability:** none.
- **Security:** no headers, no rate limiting, no CAPTCHA.
- **CI:** none.

---

## Ending state

```
┌─ Stack ───────────────────────────────────────────────────────────┐
│ Framework      Next.js 15.5 (App Router)                          │
│ Language       TypeScript strict                                   │
│ Package mgr    pnpm 10.12.1                                        │
│ Styling        Tailwind v4 + shadcn/ui + DESIGN.md tokens         │
│ Typography     Libre Baskerville via next/font/google              │
│ Components     shadcn/ui primitives + custom editorial classes    │
│ Forms          react-hook-form + zod + shadcn form primitives      │
│ Auth + DB      Supabase via @supabase/ssr (browser + server split) │
│ Marketing mail Mailchimp via /api/newsletter (server-only)         │
│ Transactional  Resend via /api/contact (server-only)               │
│ Analytics      PostHog (autocapture + session replay)              │
│ Error tracking Sentry (browser + server + edge + source-map upload)│
│ CAPTCHA        Cloudflare Turnstile (Footer + RequestModal)        │
│ Rate limiting  Upstash Redis (5 req/min/IP on both API routes)    │
│ SEO            Per-route metadata, sitemap.ts, robots.ts, dynamic │
│                OG image, JSON-LD Organization schema               │
│ Security       Six headers (X-Frame-Options DENY, X-Content-Type- │
│                Options nosniff, Referrer-Policy strict-origin-     │
│                when-cross-origin, HSTS 2y preload, Permissions-    │
│                Policy, Content-Security-Policy with full allow-   │
│                list)                                               │
│ CI             GitHub Actions: pnpm install --frozen-lockfile +    │
│                typecheck + build, plus gitleaks-action             │
│ Hosting        Vercel (Next.js framework preset)                  │
└────────────────────────────────────────────────────────────────────┘
```

**Route table emitted by the production build (37 total):**

- **15 static (`○`):** `/`, `/about`, `/apply`, `/blog`, `/ideate`, `/learn`, `/localization-kits`, `/online-course`, `/podcasts`, `/possibilities`, `/q-a`, `/teach`, `/teaching-materials`, `/thebook`, `/_not-found`, `/sitemap.xml`, `/robots.txt`.
- **15 SSG (`●`):** `/blog/[slug]` prerendered for every known slug in [`src/data/blogPosts.ts`](./src/data/blogPosts.ts).
- **8 dynamic (`ƒ`):** `/account`, `/api/contact`, `/api/newsletter`, `/forgot-password`, `/login`, `/opengraph-image`, `/signup`, `/update-password`.

**Safe-placeholder pattern** is used throughout: every external integration (Supabase, Mailchimp, Resend, Sentry, PostHog, Upstash, Turnstile, Sentry source-map upload) no-ops cleanly when its env vars are absent so dev/preview environments work without any provider provisioning.

---

## Phase-by-phase summary

Each row links to the corresponding handoff snapshot in [MIGRATION_STATE.md](./MIGRATION_STATE.md) for full implementation detail. Order reflects execution sequence.

| # | Phase | Owner | Net result |
|---|---|---|---|
| 1 | App Router foundation | Codex | Added `src/app/{layout,page,providers}.tsx` skeleton without touching Vite runtime. |
| 2 | pnpm + Next 15 package migration | Codex | Switched scripts to Next, added Next 15 + React 19, generated `pnpm-lock.yaml`, removed `package-lock.json`, moved legacy pages to `src/legacy-pages/` to avoid Pages Router collision. |
| 3 | Tailwind CSS v4 setup | Codex | Tailwind v3 → v4, `@tailwindcss/postcss`, `src/styles/globals.css` imported by App Router layout. |
| 4 | shadcn/ui foundation | Codex | `components.json`, `@/*` path alias, `src/lib/utils.ts`, starter `Button`, support deps. |
| 5 | DESIGN.md tokens + Libre Baskerville | Codex | Light-only brand variables, Tailwind v4 `@theme inline` mappings, `next/font/google`, editorial typography defaults. |
| 6 | Route migration A→D | Claude | All 17 non-auth routes ported from `src/legacy-pages/*` to `src/app/<route>/page.tsx`. Editorial primitive CSS classes ported from `src/index.css` into `src/styles/globals.css`. New `src/components/{Navigation,Footer}.tsx` as `"use client"` App Router versions. `/blog/[slug]` uses `generateStaticParams` for all 15 slugs. |
| 7 | Repo cleanup | Claude | Deleted ~106 MB of reference folders (`Content and Copy/`, `main pages/`, `assets/`, `dist/`) + orphaned Vite scaffolding (`index.html`, `vite.config.ts`, `src/App.tsx`, `src/main.tsx`, `src/index.css`, `src/legacy-components/`, 15 non-auth legacy pages). Kept the 5 auth legacy pages + `src/lib/{AuthContext,ProtectedRoute,supabase}.ts` as Phase 8 spec. |
| 8 | Supabase client/server migration | Codex | Installed `@supabase/ssr`; added `src/lib/supabase/{client,server}.ts`, `middleware.ts` for cookie-backed session refresh, `src/lib/auth/{errors,redirects}.ts`. Ported all 5 auth pages into `src/app/`. Verified end-to-end with a disposable Supabase user (bad-credentials → auth error, sign-up → active session, `/account` SSR-renders signed-in). Deleted the legacy auth code, `src/vite-env.d.ts`, and uninstalled `vite` / `@vitejs/plugin-react` / `react-router-dom`. |
| 7b | Raw `<img>` → `next/image` | Codex | Migrated every `<img>` in `src/app/` and `src/components/` to `next/image` with appropriate `fill` + `sizes` or explicit width/height. Preserved every `/assets/...` public URL (no `public/assets/` → `public/images/` move). |
| 9 | Forms foundation | Codex | Installed `react-hook-form`, `@hookform/resolvers`, `zod`, `@radix-ui/react-label`. Added shadcn form primitives (`form`, `input`, `label`, `textarea`). Added shared zod schemas in `src/lib/validation/forms.ts`. Migrated Footer newsletter + `RequestModal` to `react-hook-form` + zod. |
| 10 | Newsletter + contact route handlers | Codex | Installed `@mailchimp/mailchimp_marketing` + `resend`. Added `src/lib/mailchimp/marketing.ts`, `src/lib/resend/send.ts`, `src/lib/server-env.ts`. Created `/api/newsletter` (Mailchimp) and `/api/contact` (Resend). Wired Footer + RequestModal to the routes. `next.config.ts` `serverExternalPackages: ['@mailchimp/mailchimp_marketing']`. |
| 11 | PostHog + Sentry safe-placeholder setup | Claude | Installed `@sentry/nextjs`, `posthog-js`, `posthog-node`. Added `instrumentation.ts` + `instrumentation-client.ts` + `sentry.{server,edge}.config.ts` + `src/app/global-error.tsx` + `src/lib/posthog/{client,server}.ts`. Converted `src/app/providers.tsx` to a Client Component mounting `<PostHogProvider>` only when configured. Wrapped `next.config.ts` with `withSentryConfig`. |
| 12 | SEO foundation | Claude | Added `NEXT_PUBLIC_SITE_URL`, `src/lib/seo/{site,page-metadata}.ts`. Updated `src/app/layout.tsx` with `metadataBase`, `title.template`, default OG/Twitter, JSON-LD `Organization` schema. Created `src/app/sitemap.ts` (29 URLs), `src/app/robots.ts`, `src/app/opengraph-image.tsx` (edge-runtime 1200×630 brand card). Per-route metadata on every public page. Refactored 6 `"use client"` pages into server wrapper + client child so each can export `metadata`. `generateMetadata` on `/blog/[slug]`. `noindex` on all 5 auth pages. |
| 13 | Security headers + rate limit + Turnstile + CI | Claude | `async headers()` in `next.config.ts` with 6 headers + CSP allow-listing today's third parties. Installed `@upstash/ratelimit` + `@upstash/redis`; added `src/lib/rate-limit.ts` (5 req/min/IP sliding window); wired into both API routes (429 + Retry-After). Installed Cloudflare Turnstile: `src/components/TurnstileWidget.tsx` + `src/lib/turnstile/verify.ts`, wired into Footer + RequestModal. Added `.github/workflows/ci.yml` (build job + gitleaks job). |
| 14 | End-to-end verification | Claude | Clean install + typecheck + build pass from fresh `.next/`. Production server smoke (`pnpm start`) of 18 public/SEO routes + 5 auth routes + 4 API tests + 10× rate-limit smoke: all green. Six security headers verified live on static + API routes. Sitemap content (29 URLs) and robots.txt content verified. `.env.local` confirmed never committed; no high-risk secret patterns in tracked code. Caught + fixed two real bugs from earlier phases (see "Bugs caught during verification" below). Decision on 5 discovered-but-unimplemented legacy routes: out of scope, no redirects, override path documented. |
| 15 | Final migration report | Claude | This document. |

---

## Bugs caught during verification (Phase 14)

Both were one-line fixes, both verified after fix.

1. **Phase 12 OG image was broken at runtime.** `src/app/opengraph-image.tsx` used `display: 'inline-block'` on the brand-red dot. Satori (the renderer behind `next/og`) only allows `'flex' | 'block' | 'none' | '-webkit-box'`. The build did not catch it because `/opengraph-image` is rendered on-demand (edge runtime), not at build time. `curl /opengraph-image` returned an empty reply and the server logged `Invalid value for CSS property "display"`. Fix: `'inline-block'` → `'flex'`.
2. **`@sentry/nextjs` 10.x deprecation.** The Sentry SDK now requires every project to `export const onRouterTransitionStart = Sentry.captureRouterTransitionStart` from `instrumentation-client.ts` to instrument App Router client-side navigations. The server emitted `ACTION REQUIRED` on every boot. Fix: added the one-line export.

---

## What was deliberately deferred

Each item is recoverable as future work. None block launch unless flagged otherwise.

| Item | Recommendation | Detail |
|---|---|---|
| **Strict (nonce-based) CSP** | Polish pass after launch | Current CSP allows `'unsafe-inline'` + `'unsafe-eval'` in `script-src` because Next 15 hydration scripts and Framer Motion inline styles need them. Moving to per-request nonces requires middleware-level header rewriting. Defense-in-depth is still real (`frame-ancestors 'none'`, third-party origin allow-list, `object-src 'none'`, `upgrade-insecure-requests`, etc.). |
| **Lighthouse CI** | Polish pass | The Phase 13 CI workflow runs install + typecheck + build + gitleaks. A Lighthouse step against the Vercel preview URL is recommended but not added — manual PSI check is in the pre-launch smoke. |
| **Explicit PostHog events** | Polish pass | `signup`, `cta_click`, `form_submit`, `newsletter_subscribe` per tech-architecture.md are not wired. Autocapture handles initial coverage. Add when product analytics matures. |
| **`public/assets/` → `public/images/`** | Skip unless branding wants the cleaner path | Phase 7b kept the existing `/assets/` URLs to preserve external links. The locked architecture prefers `/images/` but the move requires redirect rules and was deemed unnecessary. |
| **Per-page OG images** | Polish pass | Site-wide OG at `src/app/opengraph-image.tsx` covers every page. Per-post OG cards (e.g. `src/app/blog/[slug]/opengraph-image.tsx`) with the post title rendered into the image are an SEO polish item. |
| **Custom font in OG image** | Polish pass | Edge runtime serves the OG card with generic system serif. Embedding Libre Baskerville via `ImageResponse.fonts` is straightforward but adds payload weight. |
| **Per-post real article body** | Content/CMS scope | `src/app/blog/[slug]/page.tsx` renders the same hard-coded article body for every post (this was carried over verbatim from the legacy SPA — see Phase 6 Slice D handoff). Per-post real content is a content-modeling task outside the migration scope. |
| **Five legacy routes** | Out of scope for launch | `/post/[slug]`, `/quick-bites`, `/thank-you`, `/user-dashboard`, `/ar`, `/ar/*` will return Next.js 404s. They were never live in the React Router SPA. Override path in [MIGRATION_STATE.md](./MIGRATION_STATE.md) Phase 14 snapshot if any are wanted. |
| **Arabic content + i18n** | Future feature | Would require translated copy, locale routing (`next-intl` or built-in), and reviewed editorial content. Multi-week feature, not a migration item. |
| **Dependabot, secret scanning, branch protection** | Owner-side UI toggles | Settings → Security in GitHub. Documented in the pre-launch checklist. |
| **Vercel ↔ Sentry integration** | Owner-side dashboard step | Auto-links Sentry releases to Vercel deploys. Recommended pre-launch. |

---

## Files and folders that no longer exist

Cleared during Phase 7 + Phase 8 (~106 MB + the Vite scaffolding). Listed for the reviewer's benefit so unfamiliar deletions don't raise alarm:

**Reference / build helpers (never served by the live site):**
- `Content and Copy/` (~53 MB) — scrape notes, copy CSV/JSON/XLSX, raw HTML.
- `main pages/` (~14 MB) — visual reference screenshots.
- `assets/` capital-A (~17 MB) — source/reference image originals (only `public/assets/` was ever served).
- `dist/` (~22 MB) — stale Vite build output (Vercel now uses `.next`).

**Vite scaffolding (orphaned once App Router landed):**
- `index.html`, `vite.config.ts`, `src/App.tsx`, `src/main.tsx`, `src/index.css`, `src/vite-env.d.ts`.

**Legacy code (replaced by App Router equivalents):**
- All 15 non-auth pages in `src/legacy-pages/` (replaced by `src/app/<route>/page.tsx`).
- All 5 auth pages in `src/legacy-pages/` (replaced by `src/app/<route>/page.tsx` in Phase 8, then deleted).
- `src/legacy-components/{Navigation,Footer,ScrollToTop}.tsx` (replaced by `src/components/{Navigation,Footer}.tsx`; scroll restoration is built into the App Router).
- `src/lib/{AuthContext,ProtectedRoute,supabase}.ts` (replaced by `src/lib/supabase/{client,server}.ts` + `middleware.ts`).

**Dependencies removed from `package.json`:**
- `vite`, `@vitejs/plugin-react`, `react-router-dom`, `autoprefixer`.

---

## Acknowledgements

- **Codex** executed Phases 1–5, 6, 7b, 8, 9, 10.
- **Claude (Sonnet 4.6 and Opus 4.7)** executed Phases 6 (route migration A→D), 7 (cleanup), 11, 12, 13, 14, 15.
- The full chronological handoff log (every command, every file changed, every known risk) is in [MIGRATION_STATE.md](./MIGRATION_STATE.md).

---

## Pre-launch checklist

This is the only work standing between the migrated codebase and a green production launch. All items live outside this branch (Vercel project settings, provider dashboards, GitHub UI). The complete checklist with explanations is in the Phase 14 handoff snapshot in [MIGRATION_STATE.md](./MIGRATION_STATE.md); compact version below.

### Vercel project environment variables

Required for the corresponding integration to leave safe-placeholder mode. Set in both **Production** and **Preview** environments.

- [ ] `NEXT_PUBLIC_SITE_URL` → real production origin (e.g. `https://thesingaporeway.com`) — without this, `metadataBase`, sitemap, robots, and OG canonical URLs all resolve to `http://localhost:3000`.
- [ ] `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — required for auth pages to render.
- [ ] `MAILCHIMP_API_KEY` + `MAILCHIMP_SERVER_PREFIX` + `MAILCHIMP_AUDIENCE_ID` — Footer newsletter returns 503 without these.
- [ ] `RESEND_API_KEY` + `RESEND_FROM_EMAIL` + `RESEND_TO_EMAIL` — request modal returns 503 without these.
- [ ] `NEXT_PUBLIC_SENTRY_DSN` (browser + server error capture); `SENTRY_AUTH_TOKEN` + `SENTRY_ORG` + `SENTRY_PROJECT` (source-map upload at build time).
- [ ] `NEXT_PUBLIC_POSTHOG_KEY` + `NEXT_PUBLIC_POSTHOG_HOST` — PostHog stays dormant without these.
- [ ] `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` — rate limiter is dormant without these (abuse-prevention layer effectively off).
- [ ] `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` — CAPTCHA dormant without these (spam-prevention layer effectively off).

### Provider configuration (outside Vercel)

- [ ] **Supabase Auth → URL Configuration:** add the production origin to the allow-list (`<origin>/login`, `<origin>/update-password`, `<origin>/account`), plus preview-deploy origins you want supported.
- [ ] **Supabase RLS:** enable Row Level Security on every table with default-deny before any user data lands.
- [ ] **Resend → Domains:** verify the sending domain (SPF + DKIM + DMARC) before launch — required for `/api/contact` to deliver.
- [ ] **Mailchimp:** confirm `MAILCHIMP_AUDIENCE_ID` is the correct list and the API key has audience-write permission.
- [ ] **Cloudflare:** create a Turnstile site, copy the site key + secret key into Vercel.
- [ ] **Upstash:** create a Redis database (or use Vercel KV), copy the REST URL + REST token into Vercel.
- [ ] **Sentry:** confirm the org/project in `.env.local` are still the correct ones; enable the Vercel ↔ Sentry integration so releases auto-link to deploys.
- [ ] **PostHog:** pick `us` vs `eu` host region; enable autocapture + session replay + web vitals.

### GitHub repository configuration (UI toggles)

- [ ] **Branch protection on `main`:** require PR, require CI green (Phase 13 workflow), no direct pushes, no force-push.
- [ ] **Security:** enable Dependabot security updates, Dependabot version updates, Secret scanning, Secret scanning push protection.

### Final pre-launch smoke (against the production URL)

- [ ] Hit the production homepage in a browser; confirm Network panel shows no CSP violations.
- [ ] Sign up / sign in with a real address via `/signup` and `/login`; confirm cookies set and `/account` renders user info.
- [ ] Submit the Footer newsletter form; confirm subscriber lands in Mailchimp.
- [ ] Open the request modal on `/localization-kits` or `/teaching-materials`; submit; confirm Resend delivers the email.
- [ ] If Turnstile is configured: confirm the widget appears and the form rejects when not solved.
- [ ] `curl -I https://<production>/` and confirm all six security headers.
- [ ] Submit the production sitemap to Google Search Console + Bing Webmaster Tools.
- [ ] PageSpeed Insights against the homepage and a blog post; confirm LCP < 2.5s, CLS < 0.1, INP < 200ms.
- [ ] Remove the disposable Supabase test user from Phase 8 verification if it's still in the project.

---

## Closing note

The migration is complete on the engineering side. Every phase that touched code has shipped; every safety rule held (no pushes, no merges, no force operations, no committed secrets, no public URL changes). The codebase that exists on this branch builds, typechecks, smoke-tests green, and is ready to merge into `main` and deploy as soon as the pre-launch checklist above is green.

The original site behavior is preserved: every public URL still works, every image still loads from `/assets/...`, the copy is unchanged, and the visual system follows DESIGN.md exactly. What's new is the foundation underneath — server rendering, observability, security, and the integration surface needed to grow the product without rebuilding the stack.

— End of report.
