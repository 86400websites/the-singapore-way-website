# ENV-VARS-SAFETY.md — Environment Variables, In Plain English

The rules for handling configuration values and secrets on The Singapore Way. Read this once before touching any key; follow the procedures every time after.

## What env vars are

Environment variables are named values the app reads at build or run time — things like "which database URL do I talk to" or "what's the email provider's API key". They let the same code run in different environments (local, Preview, Production) with different values, and they keep secrets out of the code itself. The code references the NAME; the VALUE lives outside the repo.

## The two classes

**PUBLIC** — carries the Next.js public prefix `NEXT_PUBLIC_*`. The prefix is recorded in [`TECH-ARCHITECTURE.md`](./TECH-ARCHITECTURE.md).

- Inlined into the browser bundle **at build time**. Treat as world-readable, forever.
- Only ever: URLs, publishable/anon keys, and site config (e.g. `NEXT_PUBLIC_SITE_URL`).
- If you wouldn't print it on the homepage, it doesn't get the public prefix.

**PRIVATE** — everything else: provider API keys, secret keys, database credentials, JWT secrets.

- Read only in trusted server contexts of the locked Next.js stack: Server Components, Route Handlers (e.g. `/api/newsletter`, `/api/contact`), Server Actions, and `instrumentation.ts`.
- Never imported into browser code or passed through serialized props, HTML, logs, or error responses.

Why this matters: the prefix is not decoration — it is the boundary between "public forever" and "secret". One misprefixed key is a full leak.

## What never goes into client code

- The database secret / service-role key (`SUPABASE_SECRET_KEY` — deliberately never set on this project; it bypasses row-level security)
- Any provider API key or token (email, payments, CAPTCHA secret, rate limiter)
- Database passwords or connection strings
- JWT or session-signing secrets
- Webhook signing secrets
- Anything from a live env file that is not explicitly public

## What never gets committed

- `.env.local` — the project's live env file — ever. It is gitignored; keep it that way.
- Any file containing a real value — including docs, PR descriptions, and screenshots.
- The ONLY env file in git is `.env.example`: variable NAMES + safe placeholders, no real values. (Make sure `.gitignore` doesn't accidentally swallow it — whitelist with `!.env.example` if needed.)

**Never do this:** never paste a real key into a chat, a commit message, a code comment, or a "temporary" file. AI agents must not open, print, copy, or edit live env files. They verify ignore/tracked state without reading values.

## Where values live

| Context | Where the value lives |
|---|---|
| Local development | `.env.local` (gitignored, on the authorized operator's machine only) |
| Deployed Preview / Production | Vercel environment settings (Project → Settings → Environment Variables), scoped per environment |

Same names everywhere; environment-specific values. Never copy a Production value into Preview.

## The change procedure (new or updated var)

1. Add the NAME (never the value) to `.env.example` and note it in [`TECH-ARCHITECTURE.md`](./TECH-ARCHITECTURE.md), marked public or server-only.
2. The authorized owner sets the real value in the Vercel environment settings for each environment and in the ignored `.env.local` where needed.
3. **Redeploy.** Existing deployments do not pick up changed values — and public values are baked in at build time, so they require a fresh build to take effect.
4. Verify the feature actually works on the deployed site, not just locally.

## The leak procedure

1. **Rotate the key immediately** at the provider. Do this FIRST — before any cleanup, before investigating how it happened.
2. The authorized owner updates the new value in every affected Vercel environment and local machine; redeploy.
3. Then clean up: remove the value from wherever it leaked and fix the process that let it happen.
4. Record the incident in the decision/status log ([`PROJECT-STATUS.md`](./PROJECT-STATUS.md)).

Why rotation comes first: git history, forks, caches, and screenshots are forever — the key was compromised the moment it was exposed. Scrubbing history is not a fix; a dead key is.

## Quick reference

| Value type | NAME | Public or private | Where it lives |
|---|---|---|---|
| Site URL | `NEXT_PUBLIC_SITE_URL` | Public | Local `.env.local` + Vercel environments |
| Database URL (Supabase) | `NEXT_PUBLIC_SUPABASE_URL` | Public | Local `.env.local` + Vercel environments |
| Publishable key (Supabase) | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public | Local `.env.local` + Vercel environments |
| Email provider key (Resend, contact form) | `RESEND_API_KEY` | Private | Local `.env.local` + Vercel server-side env only |
| Newsletter provider key (Mailchimp) | `MAILCHIMP_API_KEY` | Private | Local `.env.local` + Vercel server-side env only |
| Bot-protection secret (Cloudflare Turnstile) | `TURNSTILE_SECRET_KEY` | Private | Local `.env.local` + Vercel server-side env only |
| Rate-limiting token (Upstash Redis) | `UPSTASH_REDIS_REST_TOKEN` | Private | Local `.env.local` + Vercel server-side env only |
| Database secret key (Supabase) | `SUPABASE_SECRET_KEY` | Private | Nowhere — documented but deliberately never set; the app never reads it |

These are this project's real variable names (the complete NAME inventory lives in `.env.example` and [`TECH-ARCHITECTURE.md`](./TECH-ARCHITECTURE.md)). Never fill a value into this document.

Next step → the host/env model is recorded in [`TECH-ARCHITECTURE.md`](./TECH-ARCHITECTURE.md); this project runs the Supabase + Vercel profile — see [`SUPABASE-VERCEL-SETUP.md`](./SUPABASE-VERCEL-SETUP.md).
