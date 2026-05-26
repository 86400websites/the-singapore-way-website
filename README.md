# The Singapore Way

Marketing and editorial website for *The Singapore Way* by Maher Kaddoura.

This codebase was originally built in Replit on a Vite + React Router SPA and has since been migrated to the locked Next.js 15 stack described in [`TECH-ARCHITECTURE.md`](./TECH-ARCHITECTURE.md). GitHub is the source of truth; Vercel hosts production and preview deployments.

## Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict)
- **Package manager:** pnpm 10
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui
- **Animation:** Framer Motion
- **Forms:** react-hook-form + zod
- **Auth + Database:** Supabase (`@supabase/ssr`)
- **Marketing email:** Mailchimp (via `/api/newsletter`)
- **Transactional email:** Resend (via `/api/contact`)
- **Analytics:** PostHog (autocapture + session replay)
- **Error tracking:** Sentry
- **Rate limiting:** Upstash Redis
- **CAPTCHA:** Cloudflare Turnstile
- **Hosting:** Vercel
- **Source control:** GitHub

Each third-party integration safely no-ops when its environment variables are absent, so local dev and Preview deployments work without provisioning every provider up front.

## Requirements

- Node.js 20+
- pnpm 10 (enable Corepack with `corepack enable` or install pnpm directly)

## Local development

```bash
pnpm install --frozen-lockfile
pnpm run dev
```

The dev server runs at `http://localhost:3000`.

Before running, copy `.env.example` to `.env.local` and fill in the values you need:

```bash
cp .env.example .env.local
```

`.env.local` is gitignored and must never be committed. See [`SUPABASE_VERCEL_SETUP.md`](./SUPABASE_VERCEL_SETUP.md) for the full environment variable matrix and which keys are required for which features.

## Scripts

```bash
pnpm run dev          # next dev — local dev server on :3000
pnpm run build        # next build — production build into .next/
pnpm run start        # next start — serve the production build locally
pnpm run typecheck    # tsc --noEmit
pnpm run lint         # eslint .
```

There is no `test` script today.

## Deployment (Vercel)

The repo is configured for Vercel via `vercel.json`:

- Framework preset: `nextjs`
- Build command: `pnpm run build`
- Install command: `pnpm install --frozen-lockfile`

`next.config.ts` ships security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) and wraps the config with `withSentryConfig` for source-map upload when Sentry env vars are present.

Pushing a branch to GitHub triggers a Vercel Preview build. Merging a PR into `main` triggers a Production build. See [`WORKFLOW.md`](./WORKFLOW.md) for the full sprint workflow and [`SUPABASE_VERCEL_SETUP.md`](./SUPABASE_VERCEL_SETUP.md) for env-var configuration.

## Project structure

- `src/app/` — App Router pages, layouts, API routes (`/api/newsletter`, `/api/contact`), `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, `global-error.tsx`
- `src/components/` — shared components, `components/ui/` (shadcn primitives), `components/motion/`
- `src/lib/` — Supabase clients (`supabase/{client,server}.ts`), validation schemas, SEO helpers, PostHog/Mailchimp/Resend/Turnstile/rate-limit helpers
- `src/styles/globals.css` — Tailwind v4 entry + brand tokens
- `public/` — static assets served as-is (e.g. `/assets/...` image paths)
- `middleware.ts` — cookie-backed Supabase session refresh
- `instrumentation.ts`, `instrumentation-client.ts`, `sentry.*.config.ts` — observability bootstrap
- `next.config.ts`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`, `eslint.config.mjs` — build/lint/style config
- `vercel.json` — Vercel deployment config
- `.github/workflows/ci.yml` — PR CI: pnpm install, typecheck, lint, build, gitleaks

## Documentation map

- [`TECH-ARCHITECTURE.md`](./TECH-ARCHITECTURE.md) — canonical locked stack
- [`DESIGN.md`](./DESIGN.md) — visual and motion design system
- [`WORKFLOW.md`](./WORKFLOW.md) — practical sprint workflow
- [`CLAUDE.md`](./CLAUDE.md) — Claude Code working rules
- [`AGENTS.md`](./AGENTS.md) — general coding-agent rules
- [`SUPABASE_VERCEL_SETUP.md`](./SUPABASE_VERCEL_SETUP.md) — Supabase Auth + Vercel env-var setup
- [`threat_model.md`](./threat_model.md) — current threat model
