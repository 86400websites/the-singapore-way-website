# Workflow Guide

A simple, repeatable workflow for this website and any future website using the same setup:
GitHub + VS Code + Claude Code + Codex (optional reviewer) + Vercel + Supabase.

> **Golden rule:** `main` is always production. Never edit `main` directly. One change = one branch = one Pull Request.

This site runs on the locked Next.js 15 stack described in [`TECH-ARCHITECTURE.md`](./TECH-ARCHITECTURE.md). Local dev uses **pnpm** and Next.js, not npm or Vite. If you see `npm`, `VITE_*`, `localhost:5000`, `dist/`, or React Router language in older notes, that is historical migration context — the current workflow below is authoritative.

---

## 1. Core Mental Model

- **VS Code / Claude Code** — where we edit code locally.
- **GitHub** — source of truth. Holds all code and history.
- **Branch** — your safe work area. Changes here do not affect the live site.
- **Pull Request (PR)** — review checkpoint before code reaches `main`.
- **Vercel Preview** — temporary test site for each branch / PR.
- **Vercel Production** — the live site. Updates automatically when `main` changes.
- **Supabase** — auth and database.
- **Environment Variables** — private connection values, kept out of code.

---

## 2. Normal Feature Workflow

One focused change at a time. Follow top to bottom.

- [ ] Switch to `main` — `git checkout main`
- [ ] Get the latest — `git pull origin main`
- [ ] Create a new branch — `git checkout -b feature/short-name`
- [ ] Ask Claude Code to make **one focused change** (use the prompt template in section 3)
- [ ] Install deps if needed — `pnpm install --frozen-lockfile`
- [ ] Test locally — `pnpm run dev`, open `http://localhost:3000`, click through what changed
- [ ] Typecheck — `pnpm run typecheck`
- [ ] Lint — `pnpm run lint`
- [ ] Build locally — `pnpm run build`
- [ ] Confirm `.env.local` is **not** staged — `git status` should show it as untracked/ignored
- [ ] Stage specific files (avoid `git add -A` if there's any risk of catching secrets) and commit — `git commit -m "Short clear message"`
- [ ] Push branch — `git push -u origin feature/short-name`
- [ ] Open a Pull Request on GitHub (base = `main`)
- [ ] Wait for CI (lint + typecheck + build + gitleaks) to pass
- [ ] Open the Vercel **Preview** URL from the PR and test the change
- [ ] (Optional) Ask Codex to review the PR
- [ ] Merge the PR on GitHub
- [ ] Watch the Vercel **Production** deployment finish, then test the live site

---

## 3. Claude Code Prompt Template

Reuse this for every feature. Paste it, then add your task at the bottom.

```
You are my senior engineer for this project.

Stack reminder:
- Next.js 15 App Router, TypeScript strict, pnpm, Tailwind v4, shadcn/ui, Framer Motion.
- Supabase via @supabase/ssr (browser + server clients + middleware session refresh).
- API routes: /api/newsletter (Mailchimp) and /api/contact (Resend).
- Hosting: Vercel. Source of truth: GitHub main.

Before editing:
- Inspect the repository structure first.
- Read the relevant files.
- Propose a short plan before making any changes.

While editing:
- Make the smallest safe change that solves the task.
- Preserve existing routes, copy, layout, styling, and assets unless I ask.
- Do not add new dependencies unless necessary.
- Do not hardcode secrets, API keys, tokens, or connection strings.
- Never commit .env.local.
- In frontend code use only public env vars: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.
- Never use Supabase service_role / sb_secret / JWT secret / database password in frontend code.
- Server-only secrets (MAILCHIMP_API_KEY, RESEND_API_KEY, SENTRY_AUTH_TOKEN, TURNSTILE_SECRET_KEY, UPSTASH_REDIS_REST_TOKEN, SUPABASE_SECRET_KEY) must only be read in Server Components, Route Handlers, Server Actions, or instrumentation.ts.

After editing:
- Run pnpm run typecheck.
- Run pnpm run lint.
- Run pnpm run build.
- Run git status.
- Confirm no secrets are staged.

At the end, report:
1. Files changed
2. Commands run
3. Check results (typecheck, lint, build)
4. Risks or follow-ups
5. Suggested commit message

Do not push unless I explicitly ask.

Task:
<describe the one focused change here>
```

---

## 4. Supabase Change Workflow

Use whenever a change touches auth, the database, or Supabase env vars.

- [ ] Create a branch — `git checkout -b feature/supabase-change`
- [ ] Update `.env.local` locally if connection values changed
- [ ] **Never commit `.env.local`** — it must stay in `.gitignore`
- [ ] If new env vars are needed, add them in **Vercel → Settings → Environment Variables** for Production, Preview, and Development (matrix in [`SUPABASE_VERCEL_SETUP.md`](./SUPABASE_VERCEL_SETUP.md))
- [ ] In the frontend, only use `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — never service-role or secret keys
- [ ] If database tables are involved, write the SQL **and** the RLS policies in the PR description (do not apply yet to production)
- [ ] Run the SQL in the Supabase dashboard **SQL Editor** (or via a migration tool) — enable Row Level Security on every exposed table, default-deny
- [ ] Confirm Supabase Auth → URL Configuration includes the correct Site URL and Redirect URLs for local, Preview, and Production (see [`SUPABASE_VERCEL_SETUP.md`](./SUPABASE_VERCEL_SETUP.md))
- [ ] Test locally — sign in / sign out / data flows
- [ ] Test the Vercel **Preview** with the new env vars (password reset / signup email links should resolve to the Preview origin, not Production)
- [ ] Merge only after auth and database both work in Preview

---

## 5. Vercel Deployment Workflow

- Pushing a branch to GitHub → Vercel automatically builds a **Preview deployment**.
- Merging a PR into `main` → Vercel automatically builds a **Production deployment**.
- Adding or changing an environment variable → you must **redeploy** for it to take effect. `NEXT_PUBLIC_*` values are inlined at build time; server-only values are read at runtime per deployment.
- Always open and test the **Preview URL** before merging.
- CI (`.github/workflows/ci.yml`) runs `pnpm install --frozen-lockfile`, `pnpm run typecheck`, `pnpm run lint`, `pnpm run build`, and `gitleaks` on every PR.

---

## 6. Rollback Workflow

If something is wrong on production, pick the right tool:

- **Safest GitHub rollback** — revert the merged PR.
  - On GitHub: open the merged PR → **Revert** → merge the revert PR.
  - Or locally: `git revert <commit-sha>` → push → merge.
- **Emergency live rollback** — on Vercel: **Deployments → previous good deployment → Promote to Production**. This restores the live site immediately.
- **After a Vercel rollback**, still fix `main` on GitHub. Otherwise the next deploy will reintroduce the bad code.
- **Never** force-push or rewrite `main` history unless absolutely necessary and coordinated.

---

## 7. New Website Setup Workflow

Reusable checklist when starting a fresh project on this stack.

- [ ] Create a new **GitHub repository** (private by default)
- [ ] Scaffold the app locally with the locked stack: `pnpm create next-app@latest --typescript --eslint --tailwind --app --src-dir`, then add Tailwind v4, shadcn/ui, Supabase (`@supabase/ssr`), Framer Motion per [`TECH-ARCHITECTURE.md`](./TECH-ARCHITECTURE.md)
- [ ] Commit `pnpm-lock.yaml` (never `package-lock.json` or `yarn.lock`)
- [ ] Push the initial commit to GitHub `main`
- [ ] Import the repo into **Vercel** and accept the detected `nextjs` framework preset
- [ ] (If auth/DB needed) Create a **Supabase** project
- [ ] Create `.env.local` locally with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
- [ ] Confirm `.env.local` is listed in `.gitignore`
- [ ] Add the same env vars in **Vercel → Settings → Environment Variables** (Production, Preview, Development) — see the matrix in [`SUPABASE_VERCEL_SETUP.md`](./SUPABASE_VERCEL_SETUP.md)
- [ ] Add a `vercel.json` with `framework: nextjs`, `installCommand: pnpm install --frozen-lockfile`, `buildCommand: pnpm run build` (App Router handles routing — no SPA rewrite needed)
- [ ] Add a CI workflow that runs pnpm install + typecheck + lint + build + gitleaks
- [ ] Deploy once and confirm the live URL works
- [ ] Copy this `WORKFLOW.md` into the new repo
- [ ] From day one, use the branch + PR workflow — never commit directly to `main`

---

## 8. Commands Cheat Sheet

Only the commands you actually need.

```bash
# Sync with main
git checkout main
git pull origin main

# Start a new change
git checkout -b feature/short-name

# Check what changed
git status

# Install / dev / typecheck / lint / build
pnpm install --frozen-lockfile
pnpm run dev          # http://localhost:3000
pnpm run typecheck
pnpm run lint
pnpm run build
pnpm run start        # serve the production build locally

# Commit and push
git commit -m "Short clear message"
git push -u origin feature/short-name

# Roll back a bad commit
git revert <commit-sha>
```

---

## 9. Never Do This

- [ ] Never commit `.env.local`
- [ ] Never commit secret keys, tokens, or connection strings
- [ ] Never expose Supabase `service_role`, `sb_secret`, JWT secret, or database password in frontend code
- [ ] Never put server-only secrets (`MAILCHIMP_API_KEY`, `RESEND_API_KEY`, `SENTRY_AUTH_TOKEN`, `TURNSTILE_SECRET_KEY`, `UPSTASH_REDIS_REST_TOKEN`, `SUPABASE_SECRET_KEY`) behind a `NEXT_PUBLIC_*` name
- [ ] Never merge a PR without testing the Vercel Preview
- [ ] Never bundle unrelated changes into one branch
- [ ] Never edit production directly (no commits straight to `main`)
- [ ] Never rely only on local testing — Preview must pass too
- [ ] Never skip Git hooks or CI checks (`--no-verify`) without explicit reason

---

## 10. Definition of Done

A change is "done" only when **all** boxes are ticked:

- [ ] Local `pnpm run typecheck` passes
- [ ] Local `pnpm run lint` passes
- [ ] Local `pnpm run build` passes
- [ ] Local dev server tested for the change at `http://localhost:3000`
- [ ] PR created on GitHub
- [ ] CI green (typecheck, lint, build, gitleaks)
- [ ] Vercel Preview deployment tested
- [ ] No secrets committed (`.env.local` untracked, no keys in code)
- [ ] (Optional) Codex review complete
- [ ] PR merged into `main`
- [ ] Live production site tested after deploy
