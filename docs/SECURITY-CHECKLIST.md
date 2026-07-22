# SECURITY-CHECKLIST.md — Pre-Merge & Pre-Launch Security Gate

Run the relevant sections before merging any risky change (auth, database, forms, env handling, headers, routing). Run the **full checklist** before launch and after every production deploy. Items marked 🔴 are **blocking — never merge with one unresolved**. Verify each claim against the repo and the live site; never tick from memory.

This gate covers The Singapore Way (Next.js 15 App Router + Supabase on Vercel). The threat context behind these checks — assets, trust boundaries, and required guarantees — lives in [`./THREAT-MODEL.md`](./THREAT-MODEL.md); when a check here feels ambiguous, that document is the tie-breaker.

## 1. Secrets & repo hygiene

- [ ] 🔴 No secret (API key, token, password, connection string, private URL) is hardcoded anywhere in the code. — *Verify: search the repo for key-like strings and every provider name in use: Supabase, Mailchimp, Resend, Sentry, PostHog, Upstash, Turnstile (plus prefixes like `sb_secret_`).*
- [ ] 🔴 `.env.local` is gitignored and has never been committed. — *Verify: `git check-ignore .env.local` succeeds and `git log --all -- .env.local` returns nothing.*
- [ ] `.env.example` contains variable NAMES and safe placeholders only — never a real value. — *Verify: open the file and read every line.*
- [ ] Before every commit: run `git status` and confirm no env file or secret is staged. — *Verify: make it a ritual; the CI secret scan (gitleaks over full history, separate job in `.github/workflows/ci.yml`) backs it up.*
- [ ] Secrets are referenced by env-var name only — never by value, even in comments, docs, PRs, or screenshots. — *Verify: read the PR diff and description; env-name discipline is defined in [`./ENV-VARS-SAFETY.md`](./ENV-VARS-SAFETY.md).*

**Never do this:** if a secret leaks, never try to scrub git history as the fix. **ROTATE FIRST** — the key is compromised the moment it was exposed. Then clean up, update all environments, and redeploy.

## 2. Env boundary

- [ ] 🔴 No server-only secret sits behind the framework's public prefix (`NEXT_PUBLIC_*`). — *Verify: list every public-prefixed var — `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`, `NEXT_PUBLIC_SENTRY_DSN`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — and confirm each is genuinely world-safe.*
- [ ] Public vars contain only URLs, publishable keys, and site config — nothing sensitive. — *Verify: assume everything public-prefixed ships in the browser bundle.*
- [ ] Server-only vars are read only in trusted contexts defined by the locked framework — never imported into browser code, serialized props, HTML, logs, or client-visible errors. — *Verify: search each server-only var name (`MAILCHIMP_API_KEY`, `MAILCHIMP_SERVER_PREFIX`, `MAILCHIMP_AUDIENCE_ID`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `TURNSTILE_SECRET_KEY`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`) and inspect every read without printing its value — reads belong only in Server Components, Route Handlers, Server Actions, or `instrumentation.ts` (this repo centralizes them behind `src/lib/server-env.ts` and `server-only` modules).*

Why this matters: public-prefixed values are inlined into the client bundle at build time — they are world-readable forever.

## 3. Auth & access *(skip if the site has no login)*

- [ ] 🔴 Every gated route checks the session (and any role/approval flag) **server-side**. File location is not access control. — *Verify: open each gated route — `/courses/[slug]/learn/[lessonSlug]`, `/courses/[slug]/certificate`, `/my-learning`, `/account`, `/learn` — and find the explicit `supabase.auth.getUser()` check with redirect to `/login`.*
- [ ] Admin routes additionally verify admin rights server-side against a dedicated role/table — a logged-in user is not an admin. — *N/A today — this site has no admin routes and no roles beyond anonymous vs signed-in. This item becomes 🔴 blocking the moment any admin surface is added (and requires a [`./THREAT-MODEL.md`](./THREAT-MODEL.md) refresh first).*
- [ ] No public endpoint reveals whether an email or account exists (enumeration oracle). — *Verify: submit a known and unknown email to the signup, forgot-password, and newsletter flows and compare responses.*
- [ ] Redirect targets are validated same-origin; any origin derived from `host`/`x-forwarded-host` is checked against an allow-list. — *Verify: read `src/lib/auth/redirects.ts` (validated `?next=` param) and `src/lib/request-origin.ts` (header-derived origin — hardening it is a recorded open item, required before real-domain migration); try a forged `next=` parameter.*
- [ ] Auth email links resolve to the origin that generated them — Preview never sends users to Production. — *Verify: trigger a signup/reset email from a Preview deploy and inspect the link; allow-list rules live in [`./SUPABASE-VERCEL-SETUP.md`](./SUPABASE-VERCEL-SETUP.md).*

## 4. Database *(skip entirely if the site has no database)*

- [ ] 🔴 Row Level Security (or the provider's equivalent) is enabled **default-deny** on every user-reachable table before any user data lands. — *Verify: list all tables — courses, modules, lessons, quizzes/quiz questions, lesson/course progress, certificates, `course_enrollments` (dormant) — and their policies in the Supabase dashboard.*
- [ ] Policies are minimum-grant and owner-scoped (users read/write only their own rows). — *Verify: read each policy in `supabase/sql/0002_course_mvp_rls.sql` (as amended by later migrations); test as a second user.*
- [ ] Controlled cross-user reads/writes use hardened stored procedures: pinned search path, authorization from the session (never trusting arguments), narrow returns, revoke-then-grant execution. — *Verify: read each SECURITY DEFINER function in `supabase/sql/0003_course_mvp_functions.sql` and the hardening pass in `0004`/`0005` against all four parts.*
- [ ] Public data projections expose only safe metadata — never emails or other PII. — *Verify: load `/certificates/[certificateId]` unauthenticated and inspect everything returned (see §9.2).*
- [ ] Migrations were reviewed under the chosen tool's strategy, classified additive/reversible/destructive, and applied to non-production first; destructive work has an approved backup/PITR and restore plan. — *Verify: numbered SQL in `supabase/sql/` (each with a paired `.down.sql`) is hand-applied by the owner via the Supabase dashboard SQL Editor in the order given by [`../supabase/sql/README.md`](../supabase/sql/README.md). Caveat: one Supabase project serves all environments (accepted risk — see §9.5), so there is no non-production database to rehearse on; compensate with PR review, paired down migrations, and a backup before anything destructive. A down migration does not restore lost data.*

## 5. Public forms & writes

- [ ] Every public write is validated server-side with a schema (client validation is UX, not security). — *Verify: read each handler — `src/app/api/newsletter/route.ts`, `src/app/api/contact/route.ts`, `src/app/api/mailchimp/subscribe/route.ts` — and confirm the zod parse from `src/lib/validation/forms.ts`; POST malformed data directly and expect a 400.*
- [ ] Public writes use the anti-abuse controls required by [`./TECH-ARCHITECTURE.md`](./TECH-ARCHITECTURE.md) (normally rate limiting plus server-verified bot protection for internet-facing submissions). Any exception is risk-assessed and recorded. — *Verify each configured control directly: per-IP Upstash sliding-window limit (5/min per route via `src/lib/rate-limit.ts`, returning 429 + `Retry-After`) and server-side Turnstile verification (`src/lib/turnstile/verify.ts`, returning 401 without a valid token).*
- [ ] 🔴 In Production, anti-abuse and delivery dependencies **fail CLOSED**: if a required key is missing, the form refuses the submission with an honest error — it never silently drops data. No-op is acceptable only in local/Preview. — *Verify: the env-absence branches key on key presence, not `NODE_ENV` — missing delivery keys throw `MissingServerEnvError` (`src/lib/server-env.ts`) and return an honest 503, while Turnstile and the rate limiter no-op when their keys are absent. The Production guarantee is therefore operational: confirm `TURNSTILE_SECRET_KEY`, `UPSTASH_REDIS_REST_URL`, and `UPSTASH_REDIS_REST_TOKEN` are set in Vercel Production so both controls actually enforce (see §9.3).*

Why this matters: a form that "works" but silently loses submissions in production is worse than one that's down.

## 6. Headers & transport

- [ ] Security headers are set in framework config on a catch-all rule: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy. — *Verify: read the `headers()` block in `next.config.ts` (source `/:path*`, six headers).*
- [ ] 🔴 Headers are **verified on the deployed site**, not just in config. — *Verify: `curl -I https://the-singapore-way-website.vercel.app` (or use browser devtools / an online header scanner) and confirm each header is present.*
- [ ] CSP allow-list contains only origins the site actually loads; every extension is the narrowest origin, added per recorded decision. — *Verify: diff the CSP in `next.config.ts` against the third parties actually in use — Supabase (`*.supabase.co` incl. websockets), PostHog (`us.i.posthog.com` / `eu.i.posthog.com`), Sentry (`*.sentry.io` / `*.ingest.sentry.io`), Turnstile (`challenges.cloudflare.com`), Wixstatic podcast media (`static.wixstatic.com`), and the Railway-hosted Ideate iframe (`sg-way-ai-agent.up.railway.app`).*
- [ ] HTTPS everywhere, no mixed content; external `_blank` links carry `rel="noopener noreferrer"`. — *Verify: browser console + a crawl of external links (Amazon book links, author site, podcast sources).*

## 7. Error hygiene

- [ ] No stack trace, internal path, credential, or raw upstream error body is ever returned to the user. — *Verify: force an error on each public handler (bad input, provider down) and inspect the response — the three API routes return only generic messages with 400/401/429/502/503, never upstream Mailchimp/Resend bodies.*
- [ ] Logs and error tracking contain no secrets and minimal PII. — *Verify: inspect a sample of real Sentry events and PostHog captures; form bodies (names/emails) must not appear.*

## 8. Dependencies

- [ ] No known-critical vulnerability in anything that ships to production. — *Verify: run `pnpm audit` and check the repo's GitHub Dependabot alerts; triage everything critical/high.*
- [ ] Every new dependency was justified; the lockfile is committed and in sync. — *Verify: PR review + `pnpm install --frozen-lockfile` passing in CI (`.github/workflows/ci.yml`); `pnpm-lock.yaml` only — no `package-lock.json`/`yarn.lock`.*

## 9. Project-specific security rules 🔴

**Blocking: never merge a PR with one of these unresolved.** These are the concrete access rules The Singapore Way's architecture promises — mirrored from [`./TECH-ARCHITECTURE.md`](./TECH-ARCHITECTURE.md) and [`./THREAT-MODEL.md`](./THREAT-MODEL.md) so the documents cannot drift. Each is dated from when it was set.

- [ ] 🔴 **Course content is sign-in-only.** Course lesson bodies and quiz answers are never readable by an anonymous user through any path — UI, RPC, or direct table read. Any signed-in user may take the course (the manual-enrollment model was retired in Sprint 10; `course_enrollments` is dormant), but signed-out visitors get only the public course landing preview. *(set 2026-07-22)* — *Verify: open a `/courses/[slug]/learn/[lessonSlug]` URL signed out (expect redirect to `/login`), and query the lessons/quizzes tables with the anon publishable key (expect RLS denial).*
- [ ] 🔴 **Certificate verification leaks no PII.** The public verification page `/certificates/[certificateId]` exposes only safe certificate metadata — never the holder's email or any other PII. *(set 2026-07-22)* — *Verify: load a real certificate URL unauthenticated and inspect the full response, including serialized props.*
- [ ] 🔴 **Public writes are fully protected and fail CLOSED in Production.** `/api/newsletter` and `/api/contact` (and the same pattern in `/api/mailchimp/subscribe`) validate with zod server-side, verify Turnstile server-side, rate-limit per-IP via Upstash, and — in Production — refuse with an honest error rather than silently dropping data when a required key is missing. *(set 2026-07-22)* — *Verify: read all three handlers per §5, and confirm the Turnstile + Upstash env vars are set in Vercel Production so no control silently no-ops.*
- [ ] 🔴 **`SUPABASE_SECRET_KEY` stays unused.** It is never set in any environment (local, Preview, Production) and never referenced in app code — all data access runs under the user's session + RLS or hardened SECURITY DEFINER RPCs. *(set 2026-07-22)* — *Verify: grep `src/` for `SUPABASE_SECRET_KEY` (expect zero hits) and confirm no such var exists in Vercel env settings. Any future use is a privilege boundary: it requires a [`./THREAT-MODEL.md`](./THREAT-MODEL.md) refresh and an explicit authorization check before release.*
- [ ] 🔴 **Single shared Supabase project — handle with care.** One Supabase project serves local, Preview, and Production (accepted risk, tracked in [`./PROJECT-STATUS.md`](./PROJECT-STATUS.md) with an open decision to split projects). Preview testing must never destructively mutate course data — no destructive SQL, no deleting/rewriting rows real users depend on. *(set 2026-07-22)* — *Verify: before any Preview test that writes, confirm the write path is owner-scoped to a test account; anything broader waits for the project split.*

---

**Quick pre-merge gate:** 1. no secrets / live env file in diff (§1) → 2. env boundary clean (§2) → 3. trusted-boundary auth checks on anything gated (§3) → 4. selected data-access controls on new/changed stores (§4) → 5. public writes validated + protected + fail-closed as designed (§5) → 6. headers untouched or re-verified (§6) → 7. project invariants intact (§9).

Next step → after the security gate passes, run [`./QA-CHECKLIST.md`](./QA-CHECKLIST.md), then [`./LAUNCH-CHECKLIST.md`](./LAUNCH-CHECKLIST.md) before going live.
