# Supabase + Vercel Setup

## Purpose

This document locks down the Supabase Auth redirect URLs and Vercel environment variables for local development, Vercel Preview deployments, Vercel Production, and the future real production domain.

It is intentionally limited to deployment, auth, and environment configuration. It does not change routes, design, copy, Supabase table policies, or application behavior.

## Current stable URLs

- Local: `http://localhost:3000`
- Current production: `https://the-singapore-way-website.vercel.app`
- Vercel preview wildcard: `https://*-86400-s-projects.vercel.app/**`
- Future real domain placeholder: `https://[REAL_DOMAIN]`

## Supabase Auth URL Configuration - current setup

### Site URL

Use the current stable production URL:

```text
https://the-singapore-way-website.vercel.app
```

The Supabase Site URL is the default auth redirect target when the application does not provide an explicit `redirectTo` value.

### Redirect URLs

Add these redirect URLs now:

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

There is no `/auth/callback` route in the current app and no current OAuth flow. Do not add `/auth/callback` unless OAuth is introduced later.

## Supabase Auth URL Configuration - after custom domain

### Checklist

- [ ] Connect the real domain in Vercel.
- [ ] Confirm DNS and HTTPS are working.
- [ ] Update the Supabase Site URL to:

```text
https://[REAL_DOMAIN]
```

### Redirect URLs

Use:

```text
http://localhost:3000/**
https://[REAL_DOMAIN]/**
https://*-86400-s-projects.vercel.app/**
```

Add this only if `www` is used as a live production hostname:

```text
https://www.[REAL_DOMAIN]/**
```

Keep this only if the current Vercel production URL should continue working after the real domain is live:

```text
https://the-singapore-way-website.vercel.app/**
```

### Old URLs to remove after migration is stable

Remove old-stack and stale one-off URLs once local, preview, and production auth are verified:

```text
http://localhost:5000/**
http://localhost:5173/**
```

Also remove any stale one-off Vercel Preview URLs that are covered by the wildcard, for example:

```text
https://the-singapore-way-website-gkzshekzn-86400-s-projects.vercel.app/**
```

Only remove a URL after confirming it is not still used by a live deployment, email template, bookmarked test flow, or Supabase dashboard workflow.

## Vercel Environment Variables Matrix

| Variable | Development | Preview | Production | Public or server-only | Required now? | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase project URL | Supabase project URL | Public/browser-safe | Yes | Required by Supabase browser, server, and middleware clients. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key | Supabase publishable key | Supabase publishable key | Public/browser-safe | Yes | Use the publishable key only. Never use service-role or secret keys here. |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Prefer omitted unless the code is updated to derive the Preview URL safely | `https://the-singapore-way-website.vercel.app` now, later `https://[REAL_DOMAIN]` | Public/browser-safe | Yes for stable production SEO | Used by metadata, sitemap, robots, OG URLs, and as an auth redirect fallback. Do not set Preview to the Production URL unless you accept Preview auth emails linking to Production when request-origin detection falls back. |
| `NEXT_PUBLIC_APP_ENV` | `development` | `preview` | `production` | Public/browser-safe | No | Not currently read by the app. Safe to add later if environment-specific UI or diagnostics need it. |
| `NEXT_PUBLIC_POSTHOG_KEY` | Optional | Optional | Optional | Public/browser-safe | Optional | Currently read by PostHog client/server helpers. Empty means PostHog no-ops. |
| `NEXT_PUBLIC_POSTHOG_TOKEN` | Do not use | Do not use | Do not use | Public/browser-safe | No | The current code reads `NEXT_PUBLIC_POSTHOG_KEY`, not this name. |
| `NEXT_PUBLIC_POSTHOG_HOST` | Optional, default `https://us.i.posthog.com` | Optional | Optional | Public/browser-safe | Optional | Current code defaults to the US PostHog host when unset. |
| `NEXT_PUBLIC_SENTRY_DSN` | Optional | Optional | Optional | Public/browser-safe | Optional | Browser/server Sentry no-ops when empty. |
| `SUPABASE_SECRET_KEY` | Do not add | Do not add | Do not add | Server-only | No | Not needed by current auth flows. Never expose to browser code. |
| `MAILCHIMP_API_KEY` | Placeholder or omitted | Optional unless newsletter is tested | Required if newsletter is live | Server-only | Feature-dependent | Required by `/api/newsletter` only when newsletter delivery is active. |
| `MAILCHIMP_SERVER_PREFIX` | Placeholder or omitted | Optional unless newsletter is tested | Required if newsletter is live | Server-only | Feature-dependent | Server prefix for Mailchimp. |
| `MAILCHIMP_AUDIENCE_ID` | Placeholder or omitted | Optional unless newsletter is tested | Required if newsletter is live | Server-only | Feature-dependent | Audience/list ID for newsletter subscriptions. |
| `RESEND_API_KEY` | Placeholder or omitted | Optional unless contact form is tested | Required if contact form is live | Server-only | Feature-dependent | Required by `/api/contact` only when email delivery is active. |
| `RESEND_FROM_EMAIL` | Placeholder or omitted | Optional unless contact form is tested | Required if contact form is live | Server-only | Feature-dependent | Verified sender address/domain in Resend. |
| `RESEND_TO_EMAIL` | Placeholder or omitted | Optional unless contact form is tested | Required if contact form is live | Server-only | Feature-dependent | Current code reads this as the recipient address. |
| `CONTACT_FORM_TO_EMAIL` | Do not use unless code changes | Do not use unless code changes | Do not use unless code changes | Server-only | No | Not currently read. Use `RESEND_TO_EMAIL` unless the code is intentionally changed. |
| `ADMIN_NOTIFICATION_EMAIL` | Do not use unless code changes | Do not use unless code changes | Do not use unless code changes | Server-only | No | Not currently read. |
| `SENTRY_AUTH_TOKEN` | Omit | Optional for Preview source maps | Optional for Production source maps | Server/build-time only | Optional | Used by Sentry build config only when all Sentry build vars are present. |
| `SENTRY_ORG` | Omit | Optional | Optional | Server/build-time only | Optional | Used with `SENTRY_AUTH_TOKEN` and `SENTRY_PROJECT`. |
| `SENTRY_PROJECT` | Omit | Optional | Optional | Server/build-time only | Optional | Used with `SENTRY_AUTH_TOKEN` and `SENTRY_ORG`. |
| `UPSTASH_REDIS_REST_URL` | Optional | Optional | Recommended if rate limiting should be enforced | Server-only | Feature-dependent | Rate limiter no-ops when missing. |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | Optional | Recommended if rate limiting should be enforced | Server-only | Feature-dependent | Rate limiter no-ops when missing. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Optional | Optional | Recommended if CAPTCHA should be enforced | Public/browser-safe | Feature-dependent | Widget is hidden when empty. |
| `TURNSTILE_SECRET_KEY` | Optional | Optional | Recommended if CAPTCHA should be enforced | Server-only | Feature-dependent | Server verification is skipped when empty. |

## Recommended Preview strategy

Preview auth should use the Preview deployment origin for email confirmation and password reset links. It should not send Preview users to Production.

Current code inspection:

- SEO canonical URLs come from `NEXT_PUBLIC_SITE_URL`.
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

## Local .env.local template

Use placeholders only. Do not commit `.env.local`.

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_ENV=development

NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...

# Optional analytics and error tracking
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
NEXT_PUBLIC_SENTRY_DSN=

# Optional newsletter and contact delivery
MAILCHIMP_API_KEY=
MAILCHIMP_SERVER_PREFIX=
MAILCHIMP_AUDIENCE_ID=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_TO_EMAIL=

# Optional production hardening
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

## Vercel dashboard checklist

1. Open the Vercel project dashboard.
2. Go to Settings, then Environment Variables.
3. Add Production variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_SITE_URL=https://the-singapore-way-website.vercel.app`
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

1. Open Supabase project dashboard.
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

## Real domain migration checklist

1. Add the real domain in Vercel.
2. Confirm DNS records and HTTPS.
3. Update Vercel Production `NEXT_PUBLIC_SITE_URL` to:

```text
https://[REAL_DOMAIN]
```

4. Keep Preview dynamic. Do not point Preview auth redirects at Production.
5. Update Supabase Site URL to:

```text
https://[REAL_DOMAIN]
```

6. Add real-domain redirect URLs:

```text
https://[REAL_DOMAIN]/**
```

7. Add this only if `www` is used:

```text
https://www.[REAL_DOMAIN]/**
```

8. Keep the Vercel Preview wildcard:

```text
https://*-86400-s-projects.vercel.app/**
```

9. Decide whether to keep the Vercel production domain:

```text
https://the-singapore-way-website.vercel.app/**
```

10. Test auth flows on the real domain.
11. Test password reset email links and signup confirmation links.
12. Test sitemap, robots, canonical URLs, and OpenGraph URLs.
13. Redeploy Production after environment changes.
14. Only then remove stale temporary URLs if safe.

## Current code safety note

The current auth redirect helper is close, but Preview safety depends on whether the incoming request includes an `Origin` header. Server-rendered page requests may not always include one.

Smallest safe patch, if approved later:

- Update `src/lib/request-origin.ts`.
- Prefer `x-forwarded-proto` plus `x-forwarded-host`, then `host`.
- Then fall back to `VERCEL_BRANCH_URL`, then `VERCEL_URL`.
- Then fall back to `NEXT_PUBLIC_SITE_URL`.
- Finally fall back to `http://localhost:3000`.

Keep `src/lib/seo/site.ts` using `NEXT_PUBLIC_SITE_URL` for canonical metadata, sitemap, robots, and OG URLs.
