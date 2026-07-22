# SUPABASE-VERCEL-SETUP.md — Vercel + Supabase Profile — The Singapore Way

This project uses **both** halves of this profile: hosting is **Vercel** (Part A applies) and auth + database are **Supabase** (Part B applies). Names and steps only — **no real values ever go into this or another committed file**.

Companions: [`TECH-ARCHITECTURE.md`](./TECH-ARCHITECTURE.md) (env-var model + stack), [`WORKFLOW.md`](./WORKFLOW.md) (deploy loop), [`ENV-VARS-SAFETY.md`](./ENV-VARS-SAFETY.md) (secret handling), [`SECURITY-CHECKLIST.md`](./SECURITY-CHECKLIST.md), [`PROJECT-STATUS.md`](./PROJECT-STATUS.md) (accepted risks + open decisions), [`../supabase/sql/README.md`](../supabase/sql/README.md) (migration order).

## Project profile — The Singapore Way

| Item | Value |
|---|---|
| Repo | `the-singapore-way-website` — GitHub org `86400websites` (source of truth) |
| Vercel project | `the-singapore-way-website` |
| Production URL today | `https://the-singapore-way-website.vercel.app` (site is LIVE) |
| Vercel team slug | `86400-s-projects` — Preview wildcard `https://*-86400-s-projects.vercel.app` |
| Custom domain | `thesingaporeway.com` — **NOT yet connected**; tracked as the "real-domain migration" backlog item in [`PROJECT-STATUS.md`](./PROJECT-STATUS.md). Do not present it as live. |
| Supabase projects | **ONE project serves all environments** — accepted risk; split is an open decision (see B1). Project name/ref: TBD-OWNER: record the single Supabase project name/ref (name/ref only — never keys) here and in [`PROJECT-STATUS.md`](./PROJECT-STATUS.md). |
| Auth model | Email/password + email links (signup confirmation, password reset) only. **No OAuth. There is NO `/auth/callback` route** — do not add one unless OAuth is introduced later. |
| Auth routes | `/login`, `/signup`, `/forgot-password`, `/update-password`; gated routes include `/account`, `/my-learning`, `/learn`, `/courses/[slug]/learn/[lessonSlug]`, `/courses/[slug]/certificate` |

## Part A — Vercel (applies to this project)

### A1. Create the project

> Status: completed at initial launch — the Vercel project exists and Production is live at `https://the-singapore-way-website.vercel.app`. The checklist below remains the gate for re-creating or re-verifying the setup.

- [ ] Make `the-singapore-way-website` available on GitHub through the owner-authorized setup workflow — GitHub is the source of truth.
- [ ] In Vercel: **Add New Project** → import `the-singapore-way-website` → confirm the framework preset and install/build commands match [`TECH-ARCHITECTURE.md`](./TECH-ARCHITECTURE.md) and the repository manifest. Current `vercel.json`: framework `nextjs`, install `pnpm install --frozen-lockfile`, build `pnpm run build`.
- [ ] Name the Vercel project `the-singapore-way-website`; leave the root directory as the repo root (the app lives at the repo root).

### A2. Environment variables (per environment)

Vercel has three environments: **Production**, **Preview**, **Development**. Set every variable per environment — same names everywhere, environment-specific values. This project's full per-environment matrix (names only) is in [the matrix section below](#the-singapore-way--vercel-env-var-matrix-by-name).

- [ ] The authorized owner adds each name from the project's architecture/env list with the correct environment scope; agents never handle or echo values.
- [ ] Mark every server-only value as **Sensitive**.
- [ ] Never copy a Production value into Preview — especially the site URL and any database credentials.
- [ ] After adding or changing any variable: **redeploy**. Existing deployments do not pick up new values; public-prefixed values are baked in at build time.

Why this matters: one shared value across environments is how Preview testing quietly mutates production data.

### A3. Deployment flow

- [ ] Confirm: every PR gets an isolated **Preview** deployment; merges to `main` deploy **Production**.
- [ ] Protect `main` on GitHub (PR + CI green required) so nothing reaches Production without: branch → build → local checks → PR → deployed Preview → Codex review → merge → Production smoke test.

### A4. Custom domain + SSL

> Status: **pending** — `thesingaporeway.com` is not yet connected. This checklist executes as part of the [real-domain migration checklist](#real-domain-migration-checklist--thesingaporewaycom) below.

- [ ] Add `thesingaporeway.com` in Vercel → Domains; follow the DNS instructions shown (Vercel's dashboard is authoritative for the records).
- [ ] Wait for SSL to issue automatically; confirm `https://thesingaporeway.com` loads and `http://` redirects to `https://`.
- [ ] Update the site-URL env var (`NEXT_PUBLIC_SITE_URL`) in **Production only** to `https://thesingaporeway.com`, then redeploy.

### A5. Verify on the deployed site

- [ ] `curl -I https://the-singapore-way-website.vercel.app` (after the real-domain migration: `https://thesingaporeway.com`) — confirm the security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) are present on the live response, not just in `next.config.ts`.
- [ ] Click through the deployed site desktop + mobile; check the browser console for errors.

## Part B — Supabase (applies to this project)

### B0. Decide first

Decided: **Supabase selected.** The approved architecture needs its auth (sign-in-gated course area) and stored data (courses, modules, lessons, quizzes, progress, certificates) — see [`TECH-ARCHITECTURE.md`](./TECH-ARCHITECTURE.md).

### B1. Create TWO projects

- [ ] Create `[SUPABASE_PROJECT]-test` (development + Preview) and `[SUPABASE_PROJECT]-prod` (Production). **Never share one database across environments.**
- [ ] Record project names/refs (never keys) in the project status doc.

> **Current project reality — deviation, do not paper over it:** The Singapore Way currently runs **ONE Supabase project for all environments** (local development, Vercel Preview, and Production). This is a recorded **ACCEPTED RISK**: Preview/local testing touches the same database as Production. The test/prod split above is an **open decision** tracked in [`PROJECT-STATUS.md`](./PROJECT-STATUS.md); the checklist stays unchecked until that decision is executed. Until then, treat every Preview auth/data test as touching production data and keep destructive experiments out of Preview.

### B2. The key boundary

The **only** values that may ever appear in frontend code or public env vars:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Server-only secrets—the secret key (`sb_secret_*` / `service_role`), database password, JWT secret, or connection string—may be read only in trusted server contexts defined by the selected framework. Most sites never need them in app code at all.

**Never do this:**
- Never put any of those behind a `NEXT_PUBLIC_*` name.
- Never import them into browser/client code or pass them through serialized props.
- Never write them into any committed file, doc, PR, or screenshot.
- If one is ever exposed: rotate it immediately — do not try to scrub git history.

> **This project:** `SUPABASE_SECRET_KEY` is documented but **deliberately never set anywhere** — the app never reads it. Privileged operations go through hardened `SECURITY DEFINER` SQL functions (pinned `search_path`, session-based authorization) instead of an RLS-bypass key.

### B3. Auth & sessions

- [ ] Use Supabase's current integration pattern for the locked framework: this project uses **`@supabase/ssr`** with separate browser and server clients, plus `middleware.ts` cookie-backed session refresh. Gating is enforced server-side via Supabase session checks; the `?next=` redirect param is validated.
- [ ] In the Supabase dashboard: set the Site URL and a **tight** redirect allow-list — localhost, the Preview URL pattern, and Production only. No broad wildcards. This project's exact current values are in [the auth URL configuration section below](#the-singapore-way--supabase-auth-url-configuration-current).
- [ ] Confirm auth emails use the template's dynamic redirect variable, not a hardcoded site URL — otherwise Preview signups get sent to Production.

### B4. RLS from day one

- [ ] Enable Row Level Security **default-deny on every user-reachable table before any user data lands**. Then add minimum-grant, owner-scoped policies.

> **This project:** RLS is in place — default-deny with owner-scoped policies across the course tables; public certificate verification exposes only safe metadata. Policies live with the numbered SQL in [`../supabase/sql/`](../supabase/sql/README.md).

Why this matters: RLS is the last line of defense when application code gets a check wrong.

### B5. Migration workflow

- [ ] Every schema change lives in the repo as numbered SQL: up-SQL + a paired `.down.sql` + the RLS policies, all in the same PR.
- [ ] Apply through the project's approved migration procedure: **TEST first → verify per role → owner approval → PROD**. Do not let an AI agent apply a Production migration without explicit authorization.
- [ ] Keep changes backwards-compatible so code and schema can deploy independently — a hosting rollback does NOT roll back the database.

> **This project:** migrations are numbered SQL in `supabase/sql/` (`0001`–`0005`, each with a paired `.down.sql`), **hand-applied by the owner via the Supabase dashboard SQL Editor — no Supabase CLI**. Apply order per [`../supabase/sql/README.md`](../supabase/sql/README.md) (0004 superseded by 0005). Because one project serves all environments (B1 accepted risk), there is currently **no separate TEST stage** — every applied migration hits the shared (production) database, which raises the bar for owner review before applying. A down migration does not restore lost data.

### B6. Wire Vercel env vars to Supabase

| Env var name | Value | Production | Preview / Development | Public or server-only |
|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | *(never write here)* | Single shared project URL *(accepted risk — see B1; after the split: PROD project URL)* | Same single shared project URL *(after the split: TEST project URL)* | Public |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | *(never write here)* | Single shared publishable key *(after the split: PROD publishable key)* | Same single shared publishable key *(after the split: TEST publishable key)* | Public |
| `NEXT_PUBLIC_SITE_URL` | *(never write here)* | `https://the-singapore-way-website.vercel.app` today; `https://thesingaporeway.com` after the real-domain migration | Preview: prefer **unset** (see the Preview strategy section) · Development: `http://localhost:3000` | Public |
| `SUPABASE_SECRET_KEY` *(only if truly needed)* | *(never write here)* | **Not set — the app never reads it** | **Not set** | Server-only, Sensitive |

⚠️ **The Value column stays blank forever.** Real values live only in an ignored local env file and the Vercel dashboard. Agents do not open or copy them. Never fill values into this or any committed file.

- [ ] Preview + Development point at the **TEST** project; Production points at the **PROD** project. *(Blocked by the B1 single-project accepted risk — becomes actionable when the split decision in [`PROJECT-STATUS.md`](./PROJECT-STATUS.md) is executed.)*
- [ ] After wiring: sign up on a Preview deploy and confirm the confirmation email links back to the **Preview** origin, and the new user appears in the **TEST** project — not PROD. *(Until the split, the Preview-origin email check still applies; the user will necessarily appear in the single shared project.)*

---

## The Singapore Way — Supabase auth URL configuration (current)

Ported from the pre-S11 root runbook so no rigor is lost. This section is the **current live configuration**; the post-domain configuration is in the [real-domain migration checklist](#real-domain-migration-checklist--thesingaporewaycom).

### Site URL

The Supabase Site URL is the default auth redirect target when the application does not provide an explicit `redirectTo` value. Use the current stable production URL:

```text
https://the-singapore-way-website.vercel.app
```

### Redirect URLs (full allow-list)

```text
http://localhost:3000/**
https://the-singapore-way-website.vercel.app/**
https://*-86400-s-projects.vercel.app/**
```

These cover the current auth routes:

- `http://localhost:3000/login`
- `http://localhost:3000/update-password`
- `https://the-singapore-way-website.vercel.app/login`
- `https://the-singapore-way-website.vercel.app/update-password`
- `https://*-86400-s-projects.vercel.app/login`
- `https://*-86400-s-projects.vercel.app/update-password`

The `/**` entries should cover these route-specific URLs because Supabase supports wildcard redirect patterns. Keep exact route-specific entries only if the Supabase dashboard rejects or fails to match the wildcard entries during testing.

**There is no `/auth/callback` route in this app and no OAuth flow** — auth is email/password plus email links (signup confirmation, password reset) only. Do not add `/auth/callback` unless OAuth is introduced later.

### Stale redirect URLs pending cleanup (backlog)

Old-stack entries from the Replit/Vite era are still on the allow-list. Remove them **only after** confirming local, Preview, and Production auth all pass and no live deployment, email template, bookmarked test flow, or Supabase dashboard workflow still uses them (tracked in [`PROJECT-STATUS.md`](./PROJECT-STATUS.md)):

```text
http://localhost:5000/**
http://localhost:5173/**
```

Also remove any stale one-off Vercel Preview URLs already covered by the wildcard, for example:

```text
https://the-singapore-way-website-gkzshekzn-86400-s-projects.vercel.app/**
```

---

## The Singapore Way — Vercel env-var matrix by NAME

Per-environment matrix, names only — the Value cells of the wiring table above stay blank forever, and no value ever appears here either. Descriptions say *what kind* of value goes where, never the value itself.

| Variable | Development | Preview | Production | Public or server-only | Required now? | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase project URL | Supabase project URL | Public/browser-safe | Yes | Required by Supabase browser, server, and middleware clients. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key | Supabase publishable key | Supabase publishable key | Public/browser-safe | Yes | Use the publishable key only. Never use service-role or secret keys here. |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Prefer omitted unless the code is updated to derive the Preview URL safely | `https://the-singapore-way-website.vercel.app` now, later `https://thesingaporeway.com` | Public/browser-safe | Yes for stable production SEO | Used by metadata, sitemap, robots, OG URLs, and as an auth redirect fallback. Do not set Preview to the Production URL unless you accept Preview auth emails linking to Production when request-origin detection falls back. |
| `NEXT_PUBLIC_APP_ENV` | `development` | `preview` | `production` | Public/browser-safe | No | Not currently read by the app. Safe to add later if environment-specific UI or diagnostics need it. |
| `NEXT_PUBLIC_POSTHOG_KEY` | Optional | Optional | Optional | Public/browser-safe | Optional | Currently read by PostHog client/server helpers. Empty means PostHog no-ops. |
| `NEXT_PUBLIC_POSTHOG_TOKEN` | Do not use | Do not use | Do not use | Public/browser-safe | No | **Gotcha:** the code reads `NEXT_PUBLIC_POSTHOG_KEY`, not this name. |
| `NEXT_PUBLIC_POSTHOG_HOST` | Optional (defaults to the US PostHog host) | Optional | Optional | Public/browser-safe | Optional | Current code defaults to the US PostHog host when unset. |
| `NEXT_PUBLIC_SENTRY_DSN` | Optional | Optional | Optional | Public/browser-safe | Optional | Browser/server Sentry no-ops when empty. |
| `SUPABASE_SECRET_KEY` | Do not add | Do not add | Do not add | Server-only | No | Not needed by current auth flows; the app never reads it. Never expose to browser code. |
| `MAILCHIMP_API_KEY` | Placeholder or omitted | Optional unless newsletter is tested | Required if newsletter is live | Server-only | Feature-dependent | Required by `/api/newsletter` only when newsletter delivery is active. |
| `MAILCHIMP_SERVER_PREFIX` | Placeholder or omitted | Optional unless newsletter is tested | Required if newsletter is live | Server-only | Feature-dependent | Server prefix for Mailchimp. |
| `MAILCHIMP_AUDIENCE_ID` | Placeholder or omitted | Optional unless newsletter is tested | Required if newsletter is live | Server-only | Feature-dependent | Audience/list ID for newsletter subscriptions. |
| `RESEND_API_KEY` | Placeholder or omitted | Optional unless contact form is tested | Required if contact form is live | Server-only | Feature-dependent | Required by `/api/contact` only when email delivery is active. |
| `RESEND_FROM_EMAIL` | Placeholder or omitted | Optional unless contact form is tested | Required if contact form is live | Server-only | Feature-dependent | Verified sender address/domain in Resend. |
| `RESEND_TO_EMAIL` | Placeholder or omitted | Optional unless contact form is tested | Required if contact form is live | Server-only | Feature-dependent | **Current code reads this as the contact recipient address.** |
| `CONTACT_FORM_TO_EMAIL` | Do not use unless code changes | Do not use unless code changes | Do not use unless code changes | Server-only | No | **Gotcha:** not currently read. Use `RESEND_TO_EMAIL` unless the code is intentionally changed. |
| `ADMIN_NOTIFICATION_EMAIL` | Do not use unless code changes | Do not use unless code changes | Do not use unless code changes | Server-only | No | Not currently read. |
| `SENTRY_AUTH_TOKEN` | Omit | Optional for Preview source maps | Optional for Production source maps | Server/build-time only | Optional | Used by Sentry build config only when all Sentry build vars are present. |
| `SENTRY_ORG` | Omit | Optional | Optional | Server/build-time only | Optional | Used with `SENTRY_AUTH_TOKEN` and `SENTRY_PROJECT`. |
| `SENTRY_PROJECT` | Omit | Optional | Optional | Server/build-time only | Optional | Used with `SENTRY_AUTH_TOKEN` and `SENTRY_ORG`. |
| `UPSTASH_REDIS_REST_URL` | Optional | Optional | Recommended if rate limiting should be enforced | Server-only | Feature-dependent | Rate limiter no-ops when missing. |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | Optional | Recommended if rate limiting should be enforced | Server-only | Feature-dependent | Rate limiter no-ops when missing. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Optional | Optional | Recommended if CAPTCHA should be enforced | Public/browser-safe | Feature-dependent | Widget is hidden when empty. |
| `TURNSTILE_SECRET_KEY` | Optional | Optional | Recommended if CAPTCHA should be enforced | Server-only | Feature-dependent | Server verification is skipped when empty. |

Local development: copy `.env.example` (committed, placeholders only) to `.env.local` (gitignored — **never commit it, never open it in agent sessions**) and fill only what you need. Secret-handling rules: [`ENV-VARS-SAFETY.md`](./ENV-VARS-SAFETY.md).

---

## Preview `NEXT_PUBLIC_SITE_URL` strategy + `src/lib/request-origin.ts` caveat

Preview auth must use the Preview deployment origin for email confirmation and password reset links. It must not send Preview users to Production.

Current code inspection (verified against [`../src/lib/request-origin.ts`](../src/lib/request-origin.ts)):

- SEO canonical URLs come from `NEXT_PUBLIC_SITE_URL` (via `src/lib/seo/site.ts`).
- Signup email confirmation uses `emailRedirectTo: <origin>/login`.
- Password reset uses `redirectTo: <origin>/update-password`.
- `<origin>` comes from `src/lib/request-origin.ts`.
- The current request-origin helper checks the `Origin` header first, then falls back to `NEXT_PUBLIC_SITE_URL`, then `http://localhost:3000`.
- The current code does not read `VERCEL_URL`, `VERCEL_BRANCH_URL`, or `NEXT_PUBLIC_VERCEL_URL`.

Recommended Vercel Preview setup:

- Enable Vercel System Environment Variables so `VERCEL_URL` and `VERCEL_BRANCH_URL` are available for a future safer helper.
- Do not set Preview `NEXT_PUBLIC_SITE_URL` to the Production URL.
- Prefer leaving Preview `NEXT_PUBLIC_SITE_URL` unset until the request-origin helper is updated to read forwarded host headers or Vercel system URLs.
- If Preview SEO canonicals need a non-local value before that helper is updated, set `NEXT_PUBLIC_SITE_URL` only to the exact Preview origin being tested, not Production.
- Keep Supabase Preview redirects covered by `https://*-86400-s-projects.vercel.app/**`.

Recommended code posture:

- Auth redirect URLs should come from the current request/deployment origin.
- Canonical SEO URLs should come from `NEXT_PUBLIC_SITE_URL`.
- Vercel `VERCEL_URL` or `VERCEL_BRANCH_URL` should only be used to form deployment-origin URLs when no request host is available.

This avoids the common Preview failure mode where password reset and signup confirmation emails created on a Preview deployment send the user back to Production.

### Current code safety note — known issue, required before real-domain migration

The current auth redirect helper is close, but Preview safety depends on whether the incoming request includes an `Origin` header. Server-rendered page requests may not always include one. **Hardening `src/lib/request-origin.ts` is a tracked backlog item that must land before the real-domain migration** (see [`PROJECT-STATUS.md`](./PROJECT-STATUS.md)).

Smallest safe patch, if approved later:

- Update `src/lib/request-origin.ts`.
- Prefer `x-forwarded-proto` plus `x-forwarded-host`, then `host`.
- Then fall back to `VERCEL_BRANCH_URL`, then `VERCEL_URL`.
- Then fall back to `NEXT_PUBLIC_SITE_URL`.
- Finally fall back to `http://localhost:3000`.

Keep `src/lib/seo/site.ts` using `NEXT_PUBLIC_SITE_URL` for canonical metadata, sitemap, robots, and OG URLs.

---

## Vercel dashboard checklist

1. Open the Vercel project dashboard.
2. Go to Settings, then Environment Variables.
3. Add Production variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` = the Production origin (`https://the-singapore-way-website.vercel.app` today)
   - Feature variables only when their feature is live: Mailchimp, Resend, PostHog, Sentry, Upstash, Turnstile.
4. Add Preview variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - Do not set `NEXT_PUBLIC_SITE_URL` to Production.
   - Add feature variables only when the feature should work in Preview.
5. Add Development variables if using `vercel dev` or `vercel env pull`.
6. Enable Automatically expose System Environment Variables if the project will use `VERCEL_URL` or `VERCEL_BRANCH_URL`.
7. Redeploy after any environment variable change. Existing deployments do not receive changed env vars retroactively.
8. Test a Preview deployment from a PR:
   - Visit `/login`.
   - Visit `/signup`.
   - Visit `/forgot-password`.
   - Submit a password reset test and confirm the email link points to the Preview origin.
   - Visit `/account` while signed out and confirm it redirects to `/login?next=/account`.
9. Test Production after merge:
   - Repeat login, signup, forgot password, update password, account protection, newsletter, and contact form checks.

## Supabase dashboard checklist

1. Open the Supabase project dashboard.
2. Go to Authentication, then URL Configuration.
3. Set Site URL to:

```text
https://the-singapore-way-website.vercel.app
```

4. Add Redirect URLs:

```text
http://localhost:3000/**
https://the-singapore-way-website.vercel.app/**
https://*-86400-s-projects.vercel.app/**
```

5. Remove stale old-stack URLs only after confirming they are no longer used:

```text
http://localhost:5000/**
http://localhost:5173/**
```

6. Remove stale one-off Preview URLs only after the wildcard is verified.
7. Test login on local, Preview, and Production.
8. Test signup on local, Preview, and Production.
9. Test forgot password on local, Preview, and Production.
10. Test update password from the email link on local, Preview, and Production.
11. Test `/account` protection on local, Preview, and Production.

---

## Real-domain migration checklist — thesingaporeway.com

Prerequisite: harden `src/lib/request-origin.ts` first (see the safety note above). Related open item: the OG image hardcodes `thesingaporeway.com` text while the live domain is still the vercel.app URL.

1. Add `thesingaporeway.com` in Vercel.
2. Confirm DNS records and HTTPS.
3. Update Vercel Production `NEXT_PUBLIC_SITE_URL` to:

```text
https://thesingaporeway.com
```

4. Keep Preview dynamic. Do not point Preview auth redirects at Production.
5. Update the Supabase Site URL to:

```text
https://thesingaporeway.com
```

6. Add real-domain redirect URLs:

```text
https://thesingaporeway.com/**
```

7. Add this only if `www` is used as a live production hostname:

```text
https://www.thesingaporeway.com/**
```

8. Keep the Vercel Preview wildcard:

```text
https://*-86400-s-projects.vercel.app/**
```

9. Decide whether to keep the Vercel production domain working:

```text
https://the-singapore-way-website.vercel.app/**
```

10. Test auth flows on the real domain.
11. Test password reset email links and signup confirmation links.
12. Test sitemap, robots, canonical URLs, and OpenGraph URLs.
13. Redeploy Production after environment changes.
14. Only then remove stale temporary URLs if safe (the `localhost:5000` / `localhost:5173` and one-off Preview entries listed above).

---

Next step → read [`ENV-VARS-SAFETY.md`](./ENV-VARS-SAFETY.md) before handling any secret, then run [`SECURITY-CHECKLIST.md`](./SECURITY-CHECKLIST.md) before launch.
