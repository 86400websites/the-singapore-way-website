# Workflow Guide

A simple, repeatable workflow for this website and any future website using the same setup:
GitHub + VS Code + Claude Code + Codex (optional reviewer) + Vercel + Supabase.

> **Golden rule:** `main` is always production. Never edit `main` directly. One change = one branch = one Pull Request.

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
- [ ] Test locally — `npm run dev`, open `http://localhost:5000`, click through what changed
- [ ] Build locally — `npm run build`
- [ ] Stage and commit — `git add -A` then `git commit -m "Short clear message"`
- [ ] Push branch — `git push -u origin feature/short-name`
- [ ] Open a Pull Request on GitHub (base = `main`)
- [ ] Open the Vercel **Preview** URL from the PR and test the change
- [ ] (Optional) Ask Codex to review the PR
- [ ] Merge the PR on GitHub
- [ ] Watch the Vercel **Production** deployment finish, then test the live site

---

## 3. Claude Code Prompt Template

Reuse this for every feature. Paste it, then add your task at the bottom.

```
You are my senior engineer for this project.

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
- Only use VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in the frontend.
- Never use Supabase service_role, sb_secret, JWT secret, or DB password in the frontend.

After editing:
- Run npm run build.
- Run git status.
- Confirm no secrets are staged.

At the end, report:
1. Files changed
2. Commands run
3. Build result
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
- [ ] If new env vars are needed, add them in **Vercel → Settings → Environment Variables** for Production, Preview, and Development
- [ ] If database tables are involved, write the SQL **and** the RLS policies in the PR description (do not apply yet to production)
- [ ] Run the SQL in the Supabase dashboard **SQL Editor** (or use a migration tool) — enable Row Level Security on every exposed table
- [ ] Test locally — sign in / sign out / data flows
- [ ] Test the Vercel **Preview** with the new env vars
- [ ] Merge only after auth and database both work in Preview

---

## 5. Vercel Deployment Workflow

- Pushing a branch to GitHub → Vercel automatically builds a **Preview deployment**.
- Merging a PR into `main` → Vercel automatically builds a **Production deployment**.
- Adding or changing an environment variable → you must **redeploy** for it to take effect (Vite inlines `VITE_*` values at build time).
- Always open and test the **Preview URL** before merging.

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
- [ ] Create the app locally (e.g. `npm create vite@latest`), pick React + TypeScript, install deps
- [ ] Push the initial commit to GitHub `main`
- [ ] Import the repo into **Vercel** and accept the detected framework preset
- [ ] (If auth/DB needed) Create a **Supabase** project
- [ ] Create `.env.local` locally with `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] Confirm `.env.local` is listed in `.gitignore`
- [ ] Add the same env vars in **Vercel → Settings → Environment Variables** (Production, Preview, Development)
- [ ] Add `vercel.json` with an SPA rewrite if the app uses client-side routing
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

# Install / build / preview
npm install
npm run build
npm run preview

# Commit and push
git add -A
git commit -m "Short clear message"
git push -u origin feature/short-name

# Roll back a bad commit
git revert <commit-sha>
```

---

## 9. Never Do This

- [ ] ❌ Never commit `.env.local`
- [ ] ❌ Never commit secret keys, tokens, or connection strings
- [ ] ❌ Never use Supabase `service_role`, `sb_secret`, JWT secret, or database password in frontend code
- [ ] ❌ Never merge a PR without testing the Vercel Preview
- [ ] ❌ Never bundle unrelated changes into one branch
- [ ] ❌ Never edit production directly (no commits straight to `main`)
- [ ] ❌ Never rely only on local testing — Preview must pass too

---

## 10. Definition of Done

A change is "done" only when **all** boxes are ticked:

- [ ] Local `npm run build` passes
- [ ] Local preview / dev server tested for the change
- [ ] PR created on GitHub
- [ ] Vercel Preview deployment tested
- [ ] No secrets committed (`.env.local` untracked, no keys in code)
- [ ] (Optional) Codex review complete
- [ ] PR merged into `main`
- [ ] Live production site tested after deploy
