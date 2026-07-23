# TECH-ARCHITECTURE.md — Locked Stack and Architecture

The authoritative mechanics for **The Singapore Way**. If another document disagrees about the stack or deployment model, this file wins; if the shipped repository disagrees, report the mismatch and correct documentation only within an authorized task.

## 1. Project summary

| Item | Decision |
|---|---|
| Project / client | **The Singapore Way** / **Maher Kaddoura** (operator/studio: 86400 Studio) |
| Production domain | `https://the-singapore-way-website.vercel.app` — the custom domain `thesingaporeway.com` is NOT yet connected (open backlog item "real-domain migration"; do not present it as live) |
| Primary conversion | Three tracked conversions (owner decision, 2026-07-22): (1) **online course enrollment** — sign up → start the companion course; (2) **book purchase** — `/thebook` → Amazon outbound click-through; (3) **newsletter subscription** — Mailchimp via `/api/newsletter`. Contact requests (`/api/contact` via Resend) are a secondary support channel. |
| Access model | `PUBLIC_PLUS_GATED` — public marketing/editorial pages plus a sign-in-gated course area. No admin shell; no roles beyond anonymous vs signed-in. |
| Content model | Static/in-repo content (page copy lives in the route components; blog posts are typed data in `src/data/blogPosts.ts`) **plus** a Supabase Postgres database for the course (curriculum, lesson bodies, quizzes, progress, certificates). |
| Repository | `the-singapore-way-website` on GitHub, org `86400websites` — source of truth |

## 2. Locked stack

Record the actual choice; do not leave examples as instructions.

| Layer | Choice for this project | Version / constraint | Reason |
|---|---|---|---|
| Framework or site generator | Next.js 15 (App Router) | `next ^15.0.0`, React 19 | Server Components + Route Handlers fit the public-plus-gated model; server-side auth checks and server-only API keys stay off the client |
| Language | TypeScript | `typescript ^5.9.3`, `"strict": true` (`tsc --noEmit`) | Strict typing across pages, server actions, and Supabase query helpers |
| Styling / component system | Tailwind CSS v4 + shadcn/ui | `tailwindcss ^4.0.0` (`@tailwindcss/postcss`); shadcn/ui primitives in `src/components/ui/` | Locked studio system; utility CSS + accessible primitives |
| Animation | Framer Motion | `framer-motion ^12.40.0`; shared `Reveal`/`RevealStagger` primitives in `src/components/motion/` | Restrained entrance-only reveals; respects `prefers-reduced-motion` |
| Forms and validation | react-hook-form + zod | `react-hook-form ^7.76.1`, `zod ^4.4.3`, `@hookform/resolvers ^5.4.0` | Include trusted-boundary validation: every public API handler re-validates with zod server-side |
| Auth | Supabase Auth via `@supabase/ssr` | `@supabase/ssr ^0.10.3`, `@supabase/supabase-js ^2.106.1`; browser + server clients in `src/lib/supabase/`; session refresh in `middleware.ts` | Email/password + email links only; no OAuth, no `/auth/callback` route |
| Database | Supabase Postgres | RLS default-deny + `SECURITY DEFINER` RPCs; hand-applied numbered SQL in `supabase/sql/` (no Supabase CLI) | Backs the course only; marketing content stays in the repo |
| Hosting | Vercel | `vercel.json`: framework `nextjs`, install `pnpm install --frozen-lockfile`, build `pnpm run build` | Must support the approved Preview workflow — every PR gets an isolated Preview |
| Package manager | pnpm | `pnpm@10.12.1` pinned via `packageManager` in `package.json`; Node 20 in CI | Never mix managers |
| Verification commands | `pnpm run typecheck`, `pnpm run lint`, tests: `N/A — no test script; verification = typecheck + lint + build + gitleaks secret scan in CI + deployed Preview QA`, `pnpm run build` | | |

Example profile only: Next.js + TypeScript + Tailwind + pnpm on Vercel, with optional Supabase. Select it deliberately; it is not the universal default. **This project deliberately selects that profile, with Supabase in active use for the course.**

Supporting services in the locked stack (details in §7): Mailchimp (newsletter), Resend (contact email), PostHog (analytics), Sentry (errors; `withSentryConfig` wraps `next.config.ts`), Upstash Redis (rate limiting), Cloudflare Turnstile (bot protection), GitHub (source of truth).

**Never:** swap a locked layer or add a production dependency without an explicit, recorded decision.

## 3. Routes and shells

Copy every route from the approved sitemap. Name the approved shell so public, member, campaign, and admin layouts do not get conflated.

| Route / pattern | Purpose | Access | Approved shell | Content source |
|---|---|---|---|---|
| `/` | Home (benchmark page) | Public | Public shell | Page copy in repo |
| `/about` | About the author and mission | Public | Public shell | Page copy in repo |
| `/thebook` | Book landing; Amazon outbound purchase CTA | Public | Public shell | Page copy in repo |
| `/online-course` | Course marketing page | Public | Public shell | Page copy in repo |
| `/learn` | Learn hub — cards linking to course, podcast, blog | Public | Public shell | Page copy in repo |
| `/blog` | Blog index | Public | Public shell | `src/data/blogPosts.ts` |
| `/blog/[slug]` | Blog post | Public | Public shell | `src/data/blogPosts.ts` |
| `/podcasts` | Podcast episodes (Wix-hosted MP3s, allow-listed in CSP) | Public | Public shell | Page copy in repo |
| `/q-a` | Q&A | Public | Public shell | Page copy in repo |
| `/possibilities` | Possibilities showcase | Public | Public shell | Page copy in repo |
| `/ideate` | Ideate assistant (Railway-hosted iframe, allow-listed in CSP) | Public | Public shell | Page copy in repo |
| `/teach` | Teach overview | Public | Public shell | Page copy in repo |
| `/apply` | Apply/contact form → `/api/contact` | Public | Public shell | Page copy in repo |
| `/localization-kits` | Localization kits + Mailchimp tagged signup | Public | Public shell | Page copy in repo |
| `/teaching-materials` | Teaching materials + Mailchimp tagged signup | Public | Public shell | Page copy in repo |
| `/courses/[slug]` | Course landing with safe public curriculum preview (titles only — no lesson bodies, no quiz questions) | Public | Public shell | Supabase (`get_published_curriculum` RPC) |
| `/certificates/[certificateId]` | Public certificate verification — safe fields only (id, course title, display name with "Verified learner" fallback, issued date) | Public | Public shell | Supabase (`get_public_certificate` RPC) |
| `/login` | Sign in | Public (auth flow) | Public shell | Page copy in repo |
| `/signup` | Create account | Public (auth flow) | Public shell | Page copy in repo |
| `/forgot-password` | Request password reset email | Public (auth flow) | Public shell | Page copy in repo |
| `/update-password` | Set new password from email link | Public (auth flow; requires recovery session) | Public shell | Page copy in repo |
| `/courses/[slug]/learn/[lessonSlug]` | Course player — lesson bodies, quizzes, progress | Signed-in | Course shell | Supabase (`get_signed_in_lesson_body`, `get_signed_in_quiz_questions`, `lesson_progress`) |
| `/courses/[slug]/certificate` | Certificate issuance and display | Signed-in | Course shell | Supabase (`issue_certificate`, `certificates`) |
| `/my-learning` | Learner progress dashboard | Signed-in | Course shell | Supabase (`lesson_progress`, `certificates`) |
| `/account` | Account management, sign out | Signed-in | Course shell | Supabase Auth |
| `/api/newsletter` | Mailchimp newsletter signup (server-only) | Public API (zod + Turnstile + rate limit) | N/A — Route Handler, no shell | N/A — server code |
| `/api/contact` | Resend contact delivery (server-only) | Public API (zod + Turnstile + rate limit) | N/A — Route Handler, no shell | N/A — server code |
| `/api/mailchimp/subscribe` | Mailchimp tagged subscribe — exactly five public `formType` keys (free-book-summary, localization-kits, use-cases, case-studies, newsletter); confirmed present at `src/app/api/mailchimp/subscribe/route.ts` | Public API (zod + Turnstile + rate limit) | N/A — Route Handler, no shell | N/A — server code |
| `sitemap.ts` / `robots.ts` / `opengraph-image.tsx` | SEO: dynamic sitemap, robots, OG image (canonical URLs from `NEXT_PUBLIC_SITE_URL`) | Public | N/A — metadata routes | Code in repo |

Note: the brief's route list marked `/learn` as gated ("course player"); repo reality is that `/learn` is a public marketing hub with no auth check — the actual gated player is `/courses/[slug]/learn/[lessonSlug]`. This table records the repo reality.

File location and hidden navigation are not access control. Every protected request checks authentication and authorization at a trusted server or data boundary before returning protected data. Admin access requires a separate server-enforced role check — no admin surface exists in this project today, so none is granted.

## 4. Data and files — skip if none

All entities live in Supabase Postgres (`public` schema), created by `supabase/sql/0001_course_mvp_schema.sql`. User-owned rows reference `auth.users(id) on delete cascade`; course-owned rows cascade from `courses`.

| Store / entity | Purpose | Owner | Read rule | Write rule | Retention / deletion |
|---|---|---|---|---|---|
| `courses` | Course catalog (single bundled course, slug `the-singapore-way`) | Site owner (content) | Published courses publicly listable (anon SELECT verified by smoke tests) | No client writes; content applied via hand-run SQL seed in the dashboard | Content row; deleting cascades to all course data |
| `course_modules` | Module structure per course | Site owner (content) | No direct browser read; titles exposed only via `get_published_curriculum` projection | No client writes; SQL seed only | Cascades from `courses` |
| `course_lessons` | Lesson bodies (text + video metadata) | Site owner (content) | No anon read (verified: anon count 0); signed-in read via `get_signed_in_lesson_body` RPC only | No client writes; SQL seed only | Cascades from `courses` |
| `quiz_questions` | Quiz questions incl. `correct_choice` answer key | Site owner (content) | No anon read; signed-in read via `get_signed_in_quiz_questions` RPC, which never returns `correct_choice` | No client writes; SQL seed only | Cascades from `courses` |
| `lesson_progress` | Per-user lesson completion | The signed-in user (per-row) | Owner-scoped SELECT under RLS | Server-only via `mark_lesson_complete` (non-quiz) and `submit_quiz_attempt` RPCs; server is the only writer | Cascades on user deletion; no automated purge |
| `quiz_attempts` | Graded quiz attempts (server-side grading) | The signed-in user (per-row) | Owner-scoped SELECT under RLS | Server-only via `submit_quiz_attempt` RPC | Cascades on user deletion; no automated purge |
| `certificates` | Issued course certificates | The signed-in user (per-row) | Owner-scoped SELECT under RLS; public projection via `get_public_certificate` exposes only id, course title, display name ("Verified learner" fallback — never the email local-part), issued date | Server-only via `issue_certificate` RPC, which re-verifies completion | Cascades on user deletion; verification page depends on row existing |
| `course_enrollments` | **Dormant.** Kept in the schema for possible future use; NOT consulted by any runtime path (manual-enrollment model retired in Sprint 10 — course access is sign-in-only) | N/A — unused | No public read (anon count 0) | No runtime writer | Cascades on user deletion |

- [x] Default deny is enforced at the strongest supported boundary — RLS is enabled on every table; the 0005 posture drops the unsafe 0002 policies and routes privileged reads/writes through hardened `SECURITY DEFINER` RPCs (pinned `search_path`, session-based authorization). Verified by the anon smoke tests in [`../supabase/sql/README.md`](../supabase/sql/README.md).
- [x] If the chosen platform supports row-level policies (for example Supabase RLS), every user-reachable table has minimum-grant policies before data lands — RLS (0002) and function hardening (0005) are applied before the seed in the documented apply order.
- [ ] If it does not, the database is not browser-reachable and every server operation authorizes the caller. — `N/A — Supabase supports RLS and the previous item applies.`
- [x] Public projections contain only explicitly public fields — `get_published_curriculum` (titles only, no content/`video_url`) and `get_public_certificate` (safe fields only).
- [ ] Private files require authorized, short-lived delivery or an equivalent protected mechanism. — N/A — no private file storage today; course lessons are video placeholders (`video_url` null) and all site images are public assets under `public/assets/`.
- [ ] Local, Preview, and Production do not share writable production data. — **Not satisfied: one Supabase project serves all environments (local/Preview/Production). Recorded as an ACCEPTED RISK with an open backlog decision to split test/prod projects. Do not present a two-project setup as current reality.**
- [ ] Migrations are classified as additive, reversible, or destructive. Destructive work has an approved backup/PITR and restore plan; down migrations do not recreate lost data. — Partially in place: every up migration has a paired `.down.sql`, `.down.sql` files are explicitly destructive rollback-only tools, and the README states down migrations do not restore lost data. No approved backup/PITR restore plan is recorded. TBD-OWNER: confirm the Supabase project's backup/PITR tier and record a restore plan before the next destructive migration.

**Migration policy (locked):** numbered SQL files in `supabase/sql/` (`0001`–`0005`, each with a paired `.down.sql`) are hand-applied by the owner via the Supabase dashboard **SQL Editor** — the repo does not use the Supabase CLI/migrations workflow. Apply order per [`../supabase/sql/README.md`](../supabase/sql/README.md): 0001 → 0002 → 0003 → **skip 0004** (kept as a historical record; it fails on a SQL reserved-word issue and is superseded by 0005) → 0005 (required; idempotent) → `seed-the-singapore-way.sql` (idempotent on the `the-singapore-way` slug). Never paste a `.down.sql` file unless deliberately rolling back.

## 5. Authentication and authorization — skip if none

There are exactly two states: anonymous and signed-in. **No admin role exists** — there is no admin shell, no role column, and no privileged in-app surface; content changes go through the repo/SQL workflow.

| Role / state | May access | Must not access | Enforcement point |
|---|---|---|---|
| Anonymous | All public marketing/editorial routes; course landing + safe curriculum preview (titles only); public certificate verification; auth pages; public API endpoints (zod + Turnstile + rate limit) | Lesson bodies, quiz questions, any progress/attempt/certificate rows, `/my-learning`, `/account`, course player, certificate issuance | Server-side Supabase session check in each protected page/action (`supabase.auth.getUser()` → `redirect('/login?next=…')`); RLS default-deny + `SECURITY DEFINER` RPCs at the data boundary |
| Signed-in user | Everything anonymous can, plus: course player, lesson bodies (`get_signed_in_lesson_body`), quiz questions without answer keys (`get_signed_in_quiz_questions`), quiz submission (server-side grading), own progress and certificates, `/my-learning`, `/account` | Other users' progress/attempts/certificates (owner-scoped RLS); `correct_choice` answer keys (never returned by any RPC); direct table writes (server RPCs are the only writers) | Same server-side session checks + owner-scoped RLS policies; `middleware.ts` refreshes the Supabase session on every matched request |

- Sessions and authorization are rechecked at the trusted boundary for every protected request — gated pages call `supabase.auth.getUser()` server-side; no client-only gating.
- Client state is presentation, never proof of entitlement.
- Redirect targets are same-origin or allow-listed — the `?next=` redirect param is validated (`src/lib/auth/redirects.ts`).
- Auth links generated from a Preview return to that Preview, never silently to Production — origin derivation lives in `src/lib/request-origin.ts` (Origin header → `NEXT_PUBLIC_SITE_URL` → localhost fallback). Known caveat: hardening this helper is a recorded open item "required before real-domain migration" (see [`./SUPABASE-VERCEL-SETUP.md`](./SUPABASE-VERCEL-SETUP.md)).

## 6. Environment variables — names only

Public naming differs by framework. Public prefix: `NEXT_PUBLIC_` — anything bearing that prefix is world-readable (inlined into the browser bundle at build time).

| Name | Public / server-only | Feature | Environments | Owner |
|---|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public | Canonical URL — SEO metadata, sitemap, robots, OG URLs; auth-redirect fallback | Local / Production (Preview: prefer unset until the request-origin helper is hardened — never set Preview to the Production URL) | Owner via Vercel dashboard |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase browser/server/middleware clients | Local / Preview / Production | Owner via Vercel dashboard |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public | Supabase clients (publishable key only — never a secret key here) | Local / Preview / Production | Owner via Vercel dashboard |
| `NEXT_PUBLIC_POSTHOG_KEY` | Public | PostHog analytics (no-ops when empty). Note: the code reads `_KEY`, not `_TOKEN` | Local / Preview / Production (optional) | Owner via Vercel dashboard |
| `NEXT_PUBLIC_POSTHOG_HOST` | Public | PostHog host (defaults to the US host when unset) | Local / Preview / Production (optional) | Owner via Vercel dashboard |
| `NEXT_PUBLIC_SENTRY_DSN` | Public | Sentry error tracking (no-ops when empty) | Local / Preview / Production (optional) | Owner via Vercel dashboard |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public | Turnstile widget (hidden when empty) | **Production (required — public forms live)**; optional Local/Preview | Owner via Vercel dashboard |
| `MAILCHIMP_API_KEY` | Server-only | Newsletter + tagged subscribe (`/api/newsletter`, `/api/mailchimp/subscribe`) | Production (required — feature is live); optional Local/Preview | Owner via Vercel dashboard |
| `MAILCHIMP_SERVER_PREFIX` | Server-only | Mailchimp server prefix | Production; optional Local/Preview | Owner via Vercel dashboard |
| `MAILCHIMP_AUDIENCE_ID` | Server-only | Mailchimp audience/list | Production; optional Local/Preview | Owner via Vercel dashboard |
| `RESEND_API_KEY` | Server-only | Contact form delivery (`/api/contact`) | Production (required — feature is live); optional Local/Preview | Owner via Vercel dashboard |
| `RESEND_FROM_EMAIL` | Server-only | Verified Resend sender | Production; optional Local/Preview | Owner via Vercel dashboard |
| `RESEND_TO_EMAIL` | Server-only | Contact recipient — the code reads this name, NOT `CONTACT_FORM_TO_EMAIL` | Production; optional Local/Preview | Owner via Vercel dashboard |
| `UPSTASH_REDIS_REST_URL` | Server-only | Rate limiting on public API handlers (fails open if unset — no code guard) | **Production (required — public forms live)**; optional Local/Preview | Owner via Vercel dashboard |
| `UPSTASH_REDIS_REST_TOKEN` | Server-only | Rate limiting | **Production (required — public forms live)**; optional Local/Preview | Owner via Vercel dashboard |
| `TURNSTILE_SECRET_KEY` | Server-only | Turnstile server verification (fails open if unset — no code guard) | **Production (required — public forms live)**; optional Local/Preview | Owner via Vercel dashboard |
| `SENTRY_AUTH_TOKEN` | Server/build-time only | Sentry source-map upload (skipped when unset) | Preview / Production (optional) | Owner via Vercel dashboard |
| `SENTRY_ORG` | Server/build-time only | Sentry build config | Preview / Production (optional) | Owner via Vercel dashboard |
| `SENTRY_PROJECT` | Server/build-time only | Sentry build config | Preview / Production (optional) | Owner via Vercel dashboard |
| `SUPABASE_SECRET_KEY` | Server-only | Documented but **deliberately never set anywhere**; the app never reads it. Do not add it to any environment | None | Owner via Vercel dashboard |

- Commit only `.env.example` with safe placeholders. Never commit `.env.local` or another live-value file (`.env.local` is gitignored).
- Never read, print, paste, or pass a server-only value into browser code.
- Changing a deployed value requires a fresh deployment — Next.js inlines `NEXT_PUBLIC_*` values at build time, and Vercel deployments do not receive changed env vars retroactively.
- Provider-specific names belong in the optional profile [`./SUPABASE-VERCEL-SETUP.md`](./SUPABASE-VERCEL-SETUP.md) — that profile IS selected for this project (env matrix, redirect allow-list, Preview strategy live there).

## 7. Integrations

| Integration | Required for core journey? | Failure behavior | Env names | Data sent |
|---|---|---|---|---|
| Mailchimp (newsletter + tagged forms) | Yes — newsletter subscription is a tracked conversion | Production: fails closed with an honest error (HTTP 503 "not configured") when a required key is missing — never fake success. No-op-safe pattern lets local/CI build without secrets | `MAILCHIMP_API_KEY`, `MAILCHIMP_SERVER_PREFIX`, `MAILCHIMP_AUDIENCE_ID` | Email address + server-owned form-type tag |
| Resend (contact email) | No — contact is a secondary support channel | Honest error (503) when unconfigured; never reports success while losing the message | `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL` | Contact form fields (name, email, message) |
| PostHog (analytics) | No | Disabled/no-op when the key is absent; site behavior unchanged | `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | Product analytics events, session replay, web vitals |
| Sentry (errors) | No | No-op when DSN absent; source-map upload silently skipped unless all three build vars are set — build still passes | `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` | Error events and stack traces |
| Upstash Redis (rate limiting) | Required abuse control in Production (protects all three public API handlers) | **Fails OPEN if unset — no-op with no code guard, Production included**; when configured, over-limit requests are refused with HTTP 429 + `Retry-After`. Must be set in Vercel Production (operator-enforced; gap tracked in [`./PROJECT-STATUS.md`](./PROJECT-STATUS.md) §10) | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Client IP + rate counters |
| Cloudflare Turnstile (bot protection) | Required abuse control in Production (public forms) | **Fails OPEN if unset — verification skipped with no code guard, Production included**; when configured, failed verification is refused with HTTP 401. Must be set in Vercel Production (operator-enforced; gap tracked in [`./PROJECT-STATUS.md`](./PROJECT-STATUS.md) §10) | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Turnstile token, client IP |
| Amazon outbound link (book purchase) | Yes — book purchase is a tracked conversion | Plain outbound anchor on `/thebook` (and blog CTAs); no backend, no keys, no failure mode within the site | `N/A — no env vars` | None — outbound navigation only |

Optional integrations may be disabled in local or Preview when documented — all of the above no-op when their env vars are absent, which is what lets CI build without secrets. **Two different Production failure modes apply.** The *delivery* dependencies (Mailchimp, Resend) fail **closed** — a missing key throws `MissingServerEnvError` and the handler returns an honest 503, never fake success. The *abuse-prevention* controls (Upstash rate limiting, Turnstile) currently fail **open** — `checkRateLimit` and `verifyTurnstileToken` silently permit the request when their keys are absent, with no `NODE_ENV`/`VERCEL_ENV` guard — so their enforcement depends on the operator setting the keys in Vercel Production. That gap (the code does not self-enforce abuse-control presence in Production) is recorded as required-before-scale in [`./PROJECT-STATUS.md`](./PROJECT-STATUS.md) §10; the env matrix in [`./SUPABASE-VERCEL-SETUP.md`](./SUPABASE-VERCEL-SETUP.md) marks those keys required in Production while public forms are live.

## 8. Content operations — complete for content/CMS sites

| Item | Decision |
|---|---|
| Canonical content source | The repo is canonical for all page copy (the shipped copy IS the approved baseline — the site is live) and for blog posts (`src/data/blogPosts.ts`). Course content is canonical in Supabase, seeded from `supabase/sql/seed-the-singapore-way.sql`, with `src/data/course.ts` as the in-repo fallback. |
| Content types | Marketing/editorial page copy; typed blog posts; podcast episode metadata (Wix-hosted MP3s); Q&A; course curriculum (4 modules, 9 video-placeholder lessons, 3 quizzes at 80% pass, certificates); images under `public/assets/<feature>/`. |
| Draft → review → publish workflow | The normal delivery workflow — branch → local checks → PR → CI + Vercel Preview → Codex findings-only review → owner merges (see [`./WORKFLOW.md`](./WORKFLOW.md)). No ad hoc copy edits. Course content edits follow [`./update-course-content.md`](./update-course-content.md) (edit seed SQL → re-run in the dashboard SQL Editor). |
| Editor roles | No CMS and no in-app editor roles. Owner (86400 Studio for Maher Kaddoura) approves all content; Claude Code is the sole builder, Codex is findings-only reviewer (decision D-S11-a, 2026-07-22). |
| Media ownership and optimization | Owner-provided images live under `public/assets/` in feature subfolders, referenced by path and rendered via `next/image`. To update an image, replace the file in place with the same filename — no code change. |
| Redirect/migration plan | No route changes planned; routes were preserved through the Replit/Vite → Next.js migration. On real-domain migration to `thesingaporeway.com` (open backlog), follow the checklist in [`./SUPABASE-VERCEL-SETUP.md`](./SUPABASE-VERCEL-SETUP.md) and keep the vercel.app URL working — never let old URLs 404. |
| Backup/export and restore test | Repo content is backed by git history (restore = revert). Course content is re-creatable from the idempotent seed SQL. Learner data (progress, attempts, certificates) depends on Supabase backups — see §4 (TBD-OWNER: backup/PITR restore plan not yet recorded or tested). |
| Client training and handoff | Live operator runbook: [`./course-setup-and-launch-checklist.md`](./course-setup-and-launch-checklist.md). Formal handoff per [`./HANDOFF.md`](./HANDOFF.md). Owner: 86400 Studio (client: Maher Kaddoura); site live and post-launch as of 2026-07-22. |

Approved launch copy is the baseline. Later editorial changes follow this workflow rather than silently editing frozen source files.

## 9. Security and deployment

- Security headers and transport controls are defined in [`../next.config.ts`](../next.config.ts) on `/:path*` and verified on the deployed response as part of Preview/launch QA: `Content-Security-Policy` (default-src 'self'; third-party origins allow-listed for Supabase, PostHog, Sentry, Cloudflare Turnstile, Wixstatic podcast media, and the Railway-hosted Ideate iframe; `frame-ancestors 'none'`; nonce-based CSP is a recorded follow-up since `'unsafe-inline'` is required today), `Strict-Transport-Security` (max-age 63072000; includeSubDomains; preload), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera/microphone/geolocation disabled).
- `main` is protected; Production deploys only from `main`. CI (`.github/workflows/ci.yml`) runs typecheck, lint, and build on pnpm 10.12.1 + Node 20, plus a separate gitleaks job scanning full history for secrets.
- Every PR gets an isolated deployed Preview. The supplied profile is Vercel (in use — `vercel.json`; Preview origin wildcard `https://*-86400-s-projects.vercel.app`).
- Preview test record: [`./templates/VERCEL-PREVIEW-TEST-TEMPLATE.md`](./templates/VERCEL-PREVIEW-TEST-TEMPLATE.md).
- Rollback action: **Vercel → Deployments → select the previous good deployment → Promote to Production, then revert the PR on `main`** (see [`./ROLLBACK.md`](./ROLLBACK.md)). A host rollback restores application artifacts, not database state — database rollback follows the destructive `.down.sql` order in [`../supabase/sql/README.md`](../supabase/sql/README.md), and a down migration does not restore lost data.
- Threat model: [`./THREAT-MODEL.md`](./THREAT-MODEL.md). Security gate: [`./SECURITY-CHECKLIST.md`](./SECURITY-CHECKLIST.md).

## 10. Companion documents

- Order: [`./ROADMAP.md`](./ROADMAP.md)
- Current state: [`./PROJECT-STATUS.md`](./PROJECT-STATUS.md)
- Delivery: [`./WORKFLOW.md`](./WORKFLOW.md)
- Visual rules: [`./DESIGN.md`](./DESIGN.md)
- Security gate: [`./SECURITY-CHECKLIST.md`](./SECURITY-CHECKLIST.md)
- Provider profile: [`./SUPABASE-VERCEL-SETUP.md`](./SUPABASE-VERCEL-SETUP.md) — selected for this project
- MCP governance: [`./SUPABASE-MCP-SAFETY.md`](./SUPABASE-MCP-SAFETY.md) — how agents may use the read-only Supabase MCP
- Project-specific companions: [`./ENV-VARS-SAFETY.md`](./ENV-VARS-SAFETY.md), [`./THREAT-MODEL.md`](./THREAT-MODEL.md), [`./course-setup-and-launch-checklist.md`](./course-setup-and-launch-checklist.md) (live operator runbook), [`./update-course-content.md`](./update-course-content.md), [`./book-course-mvp-plan.md`](./book-course-mvp-plan.md) (historical Sprint 0 record), [`../supabase/sql/README.md`](../supabase/sql/README.md)

Any authorized architecture change updates this file in the same PR.

**Next:** fill [`./DESIGN.md`](./DESIGN.md), then complete the Setup Gate.
