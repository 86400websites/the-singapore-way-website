# Singapore Way Website — Claude Code Instructions

## Project context

This repository contains the Singapore Way website. It was originally built in Replit on a Vite + React Router SPA and has since been migrated to the locked Next.js 15 stack described in [`TECH-ARCHITECTURE.md`](./TECH-ARCHITECTURE.md).

GitHub is the source of truth. Vercel hosts production and preview deployments. Claude Code is the primary engine for focused code changes, debugging, cleanup, and improvements.

## Current stack (verify before assuming)

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript strict
- **Package manager:** pnpm 10 (`packageManager` is pinned in `package.json`)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Animation:** Framer Motion
- **Forms:** react-hook-form + zod
- **Auth + DB:** Supabase via `@supabase/ssr` (browser + server clients + `middleware.ts` session refresh)
- **APIs:** `/api/newsletter` (Mailchimp) and `/api/contact` (Resend), both server-only
- **Observability:** Sentry, PostHog
- **Hardening:** Upstash Redis rate limiting, Cloudflare Turnstile, security headers + CSP in `next.config.ts`
- **Hosting:** Vercel
- **Source control:** GitHub

If the on-disk reality ever disagrees with this list, trust the code (especially `package.json`, `next.config.ts`, and `TECH-ARCHITECTURE.md`).

## Core workflow

Before making changes:

1. Inspect the repository structure.
2. Confirm the framework, package manager, scripts, and app entry points from the repo itself (`package.json`, `next.config.ts`, `src/app/`).
3. Read the relevant files before editing.
4. Summarize the intended change briefly.
5. Keep the task focused.

When making changes:

1. Work only on the current branch.
2. Do not make unrelated refactors.
3. Do not change unrelated UI, copy, routing, environment variables, or project structure unless required.
4. Preserve the current website behavior unless the requested task explicitly changes it.
5. Follow the existing coding style and file organization.
6. Avoid adding new dependencies unless clearly necessary.
7. Never hardcode secrets, API keys, tokens, credentials, or private URLs.
8. Use environment variables for any value that must not be committed.
9. In frontend (browser-reachable) code, only use public env vars prefixed `NEXT_PUBLIC_*`. Server-only secrets must only be read in Server Components, Route Handlers, Server Actions, or `instrumentation.ts`.
10. Never put Supabase `service_role` / `sb_secret_*` / JWT secret / database password / `MAILCHIMP_API_KEY` / `RESEND_API_KEY` / `SENTRY_AUTH_TOKEN` / `TURNSTILE_SECRET_KEY` / `UPSTASH_REDIS_REST_TOKEN` behind a `NEXT_PUBLIC_*` name.

After making changes:

1. Run the relevant checks: `pnpm run typecheck`, `pnpm run lint`, `pnpm run build`. There is no `test` script.
2. If a check fails because of the change, fix it before reporting done.
3. Do not ignore failing checks. If a check fails for a pre-existing reason, explain that clearly.
4. Run `git status` and confirm `.env.local` is not staged.

## Git rules

GitHub `main` is the stable, protected branch. It must stay production-ready.

Preferred process:

1. Start from latest `main`.
2. Create or use a focused task branch.
3. Make the requested change.
4. Run local checks.
5. Commit with a clear message.
6. Push the branch or prepare changes for review.
7. Merge into `main` only after CI + Vercel Preview pass and any requested review is done.

Do not push directly to `main`. Do not push at all unless the owner explicitly asks. Do not merge PRs unless explicitly asked. Do not skip Git hooks (`--no-verify`).

Use branch names like:

- `claude/fix-mobile-header`
- `claude/update-homepage-copy`
- `claude/improve-contact-section`
- `claude/fix-build-error`
- `docs/align-nextjs-workflow`

Use commit messages like:

- `Fix mobile header layout`
- `Update homepage section copy`
- `Improve contact form validation`
- `Fix production build error`

## Hosting

The site is hosted on Vercel and configured via `vercel.json` at the repo root:

- Framework preset: `nextjs`
- Install command: `pnpm install --frozen-lockfile`
- Build command: `pnpm run build`
- Build output: `.next/` (Next.js handles routing; no SPA fallback is required or wanted)

`next.config.ts` ships security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) and wraps the config with `withSentryConfig`. If a change affects build output, scripts, headers, or routing, update `vercel.json` and `next.config.ts` to match — and call this out in the change summary.

## Local development

- Install: `pnpm install --frozen-lockfile`
- Dev: `pnpm run dev` → `http://localhost:3000`
- Typecheck: `pnpm run typecheck`
- Lint: `pnpm run lint`
- Build: `pnpm run build`
- Production smoke: `pnpm run start`

Copy `.env.example` to `.env.local` for local secrets. `.env.local` is gitignored.

## Output format after each task

At the end of every task, respond with:

1. Summary of what changed.
2. Files changed.
3. Commands/checks run.
4. Results of those checks (typecheck, lint, build).
5. Any risks or follow-up items.
6. Suggested commit message.

## Clarification behavior

If the task is clear, proceed.

Ask a clarification question only if the missing information would significantly change the implementation.

When in doubt, choose the smallest safe change.
