# Singapore Way Website — Agent Instructions

## Repository purpose

This repository contains the Singapore Way website. The project was originally created in Replit on a Vite + React Router SPA and has since been migrated to the locked Next.js 15 stack described in [`TECH-ARCHITECTURE.md`](./TECH-ARCHITECTURE.md).

GitHub is the source of truth. Vercel hosts production and preview deployments. Coding agents should make focused, reviewable changes.

## Current stack (verify against the repo before acting)

- **Framework:** Next.js 15 (App Router), TypeScript strict
- **Package manager:** pnpm 10 (pinned via `packageManager` in `package.json`) — do not use `npm` or `yarn` commands
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Auth + DB:** Supabase via `@supabase/ssr` with cookie-backed session refresh in `middleware.ts`
- **APIs:** `/api/newsletter` (Mailchimp) and `/api/contact` (Resend), both server-only
- **Observability + hardening:** Sentry, PostHog, Upstash rate limit, Cloudflare Turnstile, security headers + CSP in `next.config.ts`
- **Hosting:** Vercel (framework preset `nextjs`, install `pnpm install --frozen-lockfile`, build `pnpm run build`)

## Working agreements

Before editing:

- Inspect the repository structure.
- Detect the framework, package manager, scripts, and app entry points from the repo (`package.json`, `next.config.ts`, `src/app/`).
- Read relevant files before changing them.
- Explain the planned change briefly.
- Keep the scope narrow.

While editing:

- Make the smallest safe change that solves the task.
- Follow existing code style and file organization.
- Do not make unrelated refactors.
- Do not change unrelated copy, layout, routing, configs, or dependencies.
- Do not add new production dependencies unless necessary.
- Do not hardcode secrets, credentials, API keys, tokens, or private URLs.
- In frontend (browser-reachable) code, only use public env vars prefixed `NEXT_PUBLIC_*`. Server-only secrets (Supabase `sb_secret_*` / service-role / JWT secret / DB password, `MAILCHIMP_API_KEY`, `RESEND_API_KEY`, `SENTRY_AUTH_TOKEN`, `TURNSTILE_SECRET_KEY`, `UPSTASH_REDIS_REST_TOKEN`) must only be read in Server Components, Route Handlers, Server Actions, or `instrumentation.ts`.

After editing:

- Run the relevant available checks: `pnpm run typecheck`, `pnpm run lint`, `pnpm run build`. There is no `test` script.
- Fix failures caused by the change.
- Clearly identify any pre-existing failures.
- Run `git status` and confirm `.env.local` is not staged.
- Summarize the final result.

## Git workflow

GitHub `main` is the stable, protected branch and must stay production-ready.

Default workflow:

1. Start from the latest `main` branch.
2. Create a focused task branch.
3. Make the requested changes.
4. Run checks.
5. Commit with a clear message.
6. Push the branch.
7. Open or prepare a pull request into `main`.

Do not merge automatically. Do not push unless explicitly instructed. Do not skip Git hooks (`--no-verify`). Do not allow multiple agents to work on the same branch at the same time.

Suggested branch names:

- `codex/fix-mobile-header`
- `codex/update-homepage-copy`
- `codex/improve-contact-section`
- `codex/fix-build-error`
- `docs/align-nextjs-workflow`

Suggested commit messages:

- `Fix mobile header layout`
- `Update homepage copy`
- `Improve contact section`
- `Fix build error`

## Completion response

At the end of a task, provide:

1. Summary.
2. Files changed.
3. Checks run (typecheck, lint, build).
4. Check results.
5. Risks or follow-up items.
6. Suggested PR title and description.
