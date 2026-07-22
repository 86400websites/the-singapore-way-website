# The Singapore Way

Website for Maher Kaddoura — public website for his book *The Singapore Way* and its companion online course: marketing/editorial pages (book, blog, podcasts, Q&A, possibilities, teach, localization kits, teaching materials, apply/contact) plus a sign-in-gated course experience (lessons, quizzes, progress, certificates).
Primary goal: promote the book and turn visitors into course participants. Conversions tracked (all three): **online course enrollment** (sign up → start the companion course), **book purchase** (`/thebook` → Amazon outbound click-through), and **newsletter subscription** (Mailchimp via `/api/newsletter`). Contact requests (`/api/contact` via Resend) are a secondary support channel.
Live at: `https://the-singapore-way-website.vercel.app` (production deploys from `main`). The custom domain `thesingaporeway.com` is not yet connected — tracked in the backlog as the real-domain migration.

## Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict)
- **Package manager:** pnpm (pinned `pnpm@10.12.1` via `packageManager` in `package.json`); Node 20 in CI
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Animation:** Framer Motion
- **Forms:** react-hook-form + zod
- **Auth + Database:** Supabase (auth + Postgres) via `@supabase/ssr` — browser + server clients + `middleware.ts` session refresh
- **Marketing email:** Mailchimp (via `/api/newsletter`)
- **Transactional email:** Resend (via `/api/contact`)
- **Analytics:** PostHog
- **Error tracking:** Sentry (`withSentryConfig` in `next.config.ts`)
- **Rate limiting:** Upstash Redis
- **Bot protection:** Cloudflare Turnstile
- **Hosting:** Vercel
- **Source control:** GitHub (source of truth)

Optional integrations safely no-op when their environment variables are absent, so local dev, CI, and Preview deployments work without provisioning every provider. In Production the two failure modes differ: the delivery controls (Mailchimp, Resend) fail **closed** — a missing key returns an honest 503, never fake success — while the abuse controls (Upstash rate limiting, Turnstile) currently fail **open**, silently skipping when their keys are absent, so those keys must be set in Vercel Production (see `docs/TECH-ARCHITECTURE.md` §7 and the required-before-scale gap in `docs/PROJECT-STATUS.md` §10).

Full detail (locked layers, integrations, invariants): `docs/TECH-ARCHITECTURE.md`.
If the code and docs disagree, report the mismatch; update docs only in an authorized task.

## Local development

Requirements: Node.js 20+ and pnpm 10 (enable Corepack with `corepack enable` or install pnpm directly).

```bash
pnpm install --frozen-lockfile   # install dependencies
pnpm run dev                     # next dev → http://localhost:3000
```

Checks (run before reporting a change ready — all applicable commands must pass):

```bash
pnpm run typecheck               # tsc --noEmit
pnpm run lint                    # eslint .
# Tests: N/A — no test script; verification = typecheck + lint + build + gitleaks secret scan in CI + deployed Preview QA
pnpm run build                   # next build
```

Local production smoke after a build: `pnpm run start` (serves the production build on `:3000`).

## Environment variables

- The authorized owner creates `.env.local` from `.env.example` (copy the file and fill in real values by hand) outside the AI workflow — agents never perform this step and never open live env files.
- The live env file (`.env.local`) is gitignored — never open, print, copy, edit, or commit it. `.env.example` carries names + safe placeholders only.
- Deployed values live in Vercel's environment settings, scoped per environment; changing a value requires a redeploy (public values are baked at build time).
- Full rules (public vs server-only, redeploy-after-change): `docs/ENV-VARS-SAFETY.md`.

**Never do this:** commit a secret, put a server-only value behind a public env prefix,
or paste real values into any committed file.

## Project docs

| File | What it answers |
|---|---|
| `CLAUDE.md` (root) | *How does the primary AI build engine behave here?* |
| `AGENTS.md` (root) | *How does the second-pass reviewer agent behave here?* |
| `docs/PROJECT-STATUS.md` | *Where is the build right now? Read this first in every fresh session.* |
| `docs/ROADMAP.md` | *What are we building, in what order, with what exit gates?* |
| `docs/WORKFLOW.md` | *How does a change get from a branch to production safely?* |
| `docs/TECH-ARCHITECTURE.md` | *What is the locked stack and its invariants?* |
| `docs/DESIGN.md` | *What are the design tokens and locked visual rules?* |
| `docs/ENV-VARS-SAFETY.md` | *Which env vars exist (names only), and how are they handled safely?* |
| `docs/SECURITY-CHECKLIST.md` | *Which security checks gate every merge and the launch?* |
| `docs/THREAT-MODEL.md` | *What are the assets, threats, and mitigations for this site?* |
| `docs/QA-CHECKLIST.md` · `docs/LAUNCH-CHECKLIST.md` | *What gets tested before launch?* |
| `docs/ROLLBACK.md` | *Something broke in production — what now?* |
| `docs/HANDOFF.md` | *What does the owner get at the end?* |
| `docs/SUPABASE-VERCEL-SETUP.md` | *How are Supabase auth and Vercel env settings configured?* |
| `docs/course-setup-and-launch-checklist.md` | *How does the operator set up and run the live course?* |
| `docs/update-course-content.md` | *How is course content edited safely?* |
| `docs/book-course-mvp-plan.md` | *What was the original course MVP plan? (historical Sprint 0 record)* |
| `supabase/sql/README.md` | *Which SQL migrations exist and in what order are they applied?* |
| `docs/SPRINT-PROMPT-TEMPLATE.md` · `docs/CODEX-REVIEW-PROMPT.md` | *How to prepare a sprint implementation prompt and an independent review brief.* |
| `docs/templates/` | *Which reusable prompt, PR, Preview, and change-record templates do we use?* |
| `docs/sprint-prompts/` · `docs/code-reviews/` | *Per-sprint records and review verdicts.* |

## Workflow (summary)

Every change follows: **branch → build → local checks → PR → deployed Preview (Vercel or approved equivalent) → Codex review → merge →
Production smoke test**. `main` is protected and always production-ready; one focused change per branch;
one sprint at a time; local green is necessary but not sufficient — the Preview must be tested before
merging. Full process with per-stage checklists: `docs/WORKFLOW.md`.

## Deploy

Vercel builds every PR into an isolated Preview and deploys Production only from `main`.
Host rollback action: **Vercel → Deployments → select the previous good deployment → Promote to Production**, then revert the PR on `main`. Then fix GitHub's source of truth through the normal workflow; see `docs/ROLLBACK.md`. Host rollback does not restore database data.

## Project structure

- `src/app/` — App Router pages, layouts, auth + course routes, API routes (`/api/newsletter`, `/api/contact`), `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, `global-error.tsx`
- `src/components/` — shared components, `components/ui/` (shadcn primitives), `components/motion/` (Reveal/RevealStagger), `components/course/` (course player, quiz, certificate)
- `src/data/` — typed in-repo content (`blogPosts.ts`, `course.ts` fallback)
- `src/lib/` — Supabase clients (`supabase/{client,server}.ts`), auth + course helpers, validation schemas, SEO helpers, PostHog/Mailchimp/Resend/Turnstile/rate-limit helpers, `request-origin.ts`, `server-env.ts`
- `src/styles/globals.css` — Tailwind v4 entry + brand tokens
- `supabase/sql/` — numbered SQL migrations (each with a paired `.down.sql`) + seed; apply order in `supabase/sql/README.md`
- `public/` — static assets served as-is (e.g. `/assets/...` image paths)
- `middleware.ts` — cookie-backed Supabase session refresh
- `instrumentation.ts`, `instrumentation-client.ts`, `sentry.*.config.ts` — observability bootstrap
- `next.config.ts`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`, `eslint.config.mjs` — build/lint/style config
- `vercel.json` — Vercel deployment config
- `.github/workflows/ci.yml` — CI on PR + push to `main`: install, typecheck, lint, build, plus a gitleaks secret scan
- `docs/` — governing docs (see the Project docs table above)
