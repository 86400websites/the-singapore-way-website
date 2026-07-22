# Threat Model

## Project Overview

The Singapore Way is the marketing and editorial website for *The Singapore Way* by Maher Kaddoura. The application is a Next.js 15 App Router project (TypeScript strict, Tailwind v4, shadcn/ui) deployed on Vercel. The architecture is documented in [`TECH-ARCHITECTURE.md`](./TECH-ARCHITECTURE.md); this threat model reflects the current production scope, not the original Vite SPA the project started from.

Production assumptions for this scan:

- Production traffic is terminated over Vercel-managed TLS.
- The site runs on Vercel as a Next.js application (App Router with Server Components, Route Handlers, and Edge runtime for the dynamic OG image).
- Supabase provides authentication and (when used) database storage.
- Two server-only Route Handlers exist today: `/api/newsletter` (Mailchimp) and `/api/contact` (Resend). Both are zod-validated, rate-limited via Upstash, and protected by Cloudflare Turnstile when configured.
- All third-party integrations follow a safe-placeholder pattern: each integration no-ops cleanly when its env vars are absent.
- Only code that ships in a production build is in scope.

## Assets

- **Visitor authentication state and user accounts** — Supabase Auth handles signup, login, password reset, and session refresh via cookies (managed by `middleware.ts`). Compromise of auth state would expose user accounts and any future per-user data.
- **Visitor-entered contact and newsletter data** — names and email addresses submitted through the Footer newsletter form and the per-page Request Modal. These are sent to Mailchimp (newsletter) or Resend (transactional) via server-side Route Handlers.
- **Server-only API credentials** — Mailchimp API key, Resend API key, Sentry auth token, Turnstile secret, Upstash REST token, and (if used) the Supabase secret key. Exposure of any of these would allow abuse of the corresponding provider account.
- **Site integrity and published content** — visitors rely on the site to present accurate editorial content and links. Any injection that altered rendered content would directly affect user trust.
- **Brand reputation and outbound trust** — external links, transactional email "from" identity (Resend-verified sending domain), and public messaging are part of the site's trust surface.
- **Build-time configuration and bundled code** — values inlined into the client bundle via `NEXT_PUBLIC_*` are publicly readable. Secrets must never have that prefix.

## Trust Boundaries

- **Browser to Next.js server** — App Router pages are a mix of Server Components (default), Client Components (`"use client"`), and Route Handlers. URL parameters, form bodies, cookies, and request headers from the browser are untrusted on the server side.
- **Server to Supabase** — the SSR client uses the publishable key (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) and is subject to Row Level Security. Any future use of `SUPABASE_SECRET_KEY` bypasses RLS and must be restricted to trusted server contexts.
- **Server to third-party providers** — calls to Mailchimp, Resend, Sentry, PostHog (server), and Upstash happen from the Vercel server runtime over HTTPS using server-only secrets.
- **Browser to third-party CDNs/scripts** — PostHog browser SDK, Sentry browser SDK, Cloudflare Turnstile widget, and the Wixstatic-hosted podcast MP3s load directly in the visitor's browser; allow-listed in the CSP in `next.config.ts`.
- **Public site to external destinations** — outbound links to Amazon, the author site, and `mailto:` URLs cross from the site into third-party-controlled destinations.
- **Build to runtime** — `NEXT_PUBLIC_*` values are inlined at build time and ship to every visitor; server-only env vars are read at request time per deployment.

## Scan Anchors

- **Production entry points:** `src/app/layout.tsx`, `src/app/page.tsx`, `middleware.ts`, `instrumentation.ts`, `instrumentation-client.ts`, `next.config.ts`
- **Public routes:** `src/app/**/page.tsx` for marketing pages; `src/app/blog/[slug]/page.tsx` for the only dynamic content route (uses `generateStaticParams` over `src/data/blogPosts.ts`)
- **Authenticated surfaces:** `src/app/login/`, `src/app/signup/`, `src/app/forgot-password/`, `src/app/update-password/`, `src/app/account/`
- **Route Handlers (server-only):** `src/app/api/newsletter/route.ts` (Mailchimp), `src/app/api/contact/route.ts` (Resend)
- **Server-side libraries:** `src/lib/supabase/server.ts`, `src/lib/mailchimp/marketing.ts`, `src/lib/resend/send.ts`, `src/lib/turnstile/verify.ts`, `src/lib/rate-limit.ts`, `src/lib/server-env.ts`
- **Validation:** `src/lib/validation/forms.ts` (zod schemas shared between client and server)
- **Security headers / CSP:** `next.config.ts`
- **Auth helpers:** `src/lib/auth/`, `src/lib/request-origin.ts`, `src/lib/supabase/{client,server}.ts`

## Threat Categories

### Tampering

User-controlled input reaches the server through Route Handlers, page params, and Supabase Auth callbacks. Rendered content must remain plain React text/attributes rather than raw HTML injection.

Required guarantees:

- Route Handlers MUST zod-validate request bodies before acting on them (`src/lib/validation/forms.ts`).
- Route parameters and form inputs MUST be treated as untrusted data.
- Rendered content MUST NOT use `dangerouslySetInnerHTML` or assign to `innerHTML` with values derived from user input or untrusted query parameters.
- Auth redirect targets MUST be validated as same-origin (`src/lib/auth/redirects.ts`) to prevent open-redirect attacks via `?next=` parameters.
- Supabase Row Level Security MUST be enabled default-deny on every table that becomes user-reachable, before any user data lands.

### Information Disclosure

The site renders both Server Components (which can read server-only secrets) and Client Components (which can only read `NEXT_PUBLIC_*`). Any value sent to the client should be assumed public.

Required guarantees:

- Secrets, API keys, tokens, and private endpoints MUST NOT be embedded in client code, `NEXT_PUBLIC_*` env vars, or static assets.
- Server-only env vars (`MAILCHIMP_API_KEY`, `RESEND_API_KEY`, `SENTRY_AUTH_TOKEN`, `TURNSTILE_SECRET_KEY`, `UPSTASH_REDIS_REST_TOKEN`, `SUPABASE_SECRET_KEY`) MUST only be read in Server Components, Route Handlers, Server Actions, or `instrumentation.ts`.
- Error responses from Route Handlers MUST NOT include stack traces, credentials, internal URLs, or upstream provider error bodies that could leak account information.
- Sentry capture MUST scrub or avoid sending request bodies containing PII; PostHog autocapture MUST respect masking rules for sensitive form fields.
- `.env.local` MUST remain in `.gitignore` and MUST never be committed. Gitleaks runs in CI to catch regressions.

### Spoofing

Auth introduces classic spoofing risks: session fixation, open redirect via post-auth navigation, and phishing via misconfigured email redirect URLs.

Required guarantees:

- Supabase session cookies MUST be set/refreshed via `middleware.ts` and the server SSR client, not by client-only code.
- Signup and password-reset email links MUST resolve to the origin where the request was made (see `src/lib/request-origin.ts` and the Preview safety notes in [`SUPABASE-VERCEL-SETUP.md`](./SUPABASE-VERCEL-SETUP.md)). Preview deployments MUST NOT send users to Production.
- The Supabase dashboard redirect-URL allow-list MUST cover only local, Preview wildcard, and Production origins — no broad wildcards.
- The Resend sending domain MUST be verified (SPF + DKIM + DMARC) before `/api/contact` goes live so transactional mail is not flagged as spoofed.
- External links opened in a new tab MUST preserve safe opener behavior (`rel="noopener noreferrer"` or framework equivalent).
- Cloudflare Turnstile, when configured, MUST be verified server-side in the corresponding Route Handler.

### Denial of Service / Abuse

Public Route Handlers and auth endpoints are exposed to the internet and can be abused for spam, credential stuffing, or cost amplification against upstream providers.

Required guarantees:

- `/api/newsletter` and `/api/contact` MUST apply per-IP rate limiting via `src/lib/rate-limit.ts` (Upstash sliding window) and return `429` with `Retry-After` when exceeded.
- Public forms MUST integrate Cloudflare Turnstile when site key + secret are configured.
- Upstream provider quotas (Mailchimp, Resend, Supabase Auth) MUST be monitored; the rate limiter MUST stay enabled in Production by ensuring the Upstash env vars are set.
- Heavy or unbounded loops over user-supplied input in server code MUST be avoided.

### Elevation of Privilege

Authenticated routes (`/account`, future user-specific pages) and server-only Route Handlers introduce real privilege boundaries.

Required guarantees:

- `middleware.ts` MUST keep the cookie-backed Supabase session fresh on every relevant request.
- Authenticated pages (`/account`) MUST verify the session server-side and redirect unauthenticated visitors to `/login` with a validated `next=` target.
- Production releases MUST NOT assume App Router file structure provides access control on its own — every protected route requires an explicit server-side auth check.
- Any future use of `SUPABASE_SECRET_KEY` (RLS bypass) MUST be restricted to trusted server contexts (admin operations, cron jobs, webhooks) and MUST refresh this threat model before release.
- Any future admin or webhook endpoint MUST add an explicit authorization check and rate limiting before being considered in production scope.

## Defensive Controls in Place

For reference, the following controls already ship in this repo and should not regress:

- Six security headers in `next.config.ts`: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Strict-Transport-Security` (2y preload), `Permissions-Policy` (camera/microphone/geolocation off), and a Content-Security-Policy with an explicit allow-list for Supabase, PostHog, Sentry, Turnstile, Wixstatic media, and the Railway-hosted Ideate iframe.
- CI workflow (`.github/workflows/ci.yml`): `pnpm install --frozen-lockfile`, typecheck, lint, build, plus a separate `gitleaks-action` job.
- Auth pages set `robots: { index: false, follow: false }`.
- Every third-party integration no-ops safely when its env vars are absent.
