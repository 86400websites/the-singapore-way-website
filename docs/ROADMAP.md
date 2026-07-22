# ROADMAP.md — Build Order

The scope and dependency plan for **The Singapore Way**. Run one focused sprint at a time. `PROJECT-STATUS.md` records current state; `WORKFLOW.md` records how work ships.

> The site is live and post-launch. Sprints 0–10 (the marketing site, auth, and course MVP) shipped before this SOP was adopted; they are summarized below, not reconstructed. The granular history lives in the git log (PRs #1–#12, merged 2026-05-21 → 2026-06-09) and in [`book-course-mvp-plan.md`](./book-course-mvp-plan.md).

## Setup Gate — delivery foundation

The delivery foundation was built pre-SOP. Verified retroactively on 2026-07-22:

- [x] Governing docs are filled from repo reality; no critical `[PLACEHOLDER]` remains. — *Completed by Sprint S11 (SOP docs pack migration).*
- [x] GitHub repo exists (`86400websites/the-singapore-way-website`), `main` is protected, CI is required, and direct/force pushes are blocked.
- [x] The chosen package manager and verification commands are recorded. — *pnpm@10.12.1; `pnpm run typecheck`, `pnpm run lint`, tests `N/A — no test script`, `pnpm run build`.*
- [x] The approved host builds isolated PR Previews. — *Vercel; every PR gets a Preview, Production deploys only from `main`.*
- [x] Production deploys only from `main`; rollback action is recorded. — *Vercel → promote previous good deployment (see [`ROLLBACK.md`](./ROLLBACK.md)); not yet exercised in a real incident.*
- [x] Env-var names are documented without values; live env files are ignored and untracked. — *See [`TECH-ARCHITECTURE.md`](./TECH-ARCHITECTURE.md) §6 and [`ENV-VARS-SAFETY.md`](./ENV-VARS-SAFETY.md).*
- [x] Database/auth decision is explicit. — *Supabase (auth + Postgres). One project currently serves all environments — accepted risk; split tracked as an open decision in [`PROJECT-STATUS.md`](./PROJECT-STATUS.md) §8.*

**Exit:** met. S11 is the first sprint to run the full SOP chain (branch → local checks → PR → tested Preview → independent review → owner merge → smoke test); every later sprint follows it.

## Stage 0 + Stage 1 — delivered pre-SOP (summary)

The smallest complete website and the approved MVP additions shipped before SOP adoption. Required Stage 0 outcomes verified against the live site:

- all core routes render real approved copy;
- shared shells, tokens, responsive layouts, and the accessibility baseline are implemented;
- the approved conversions work end to end (course enrollment via sign-up, book purchase outbound, newsletter subscribe);
- no Production form or CTA reports success while discarding data (handlers fail closed);
- RLS and server-side gating protect the course content required by the core journey;
- Production build, deployed Previews, and Production smoke behavior pass.

| Sprint | Goal / scope | Status |
|---|---|---|
| Sprints 0–8 *(pre-SOP)* | Replit/Vite → Next.js 15 migration, marketing routes + public shell, Supabase auth foundation, newsletter/contact integrations, content polish | Done (≈ PRs #1–#8, May 2026) |
| Sprint 9 *(pre-SOP)* | Course MVP: modules, lessons, quizzes, progress, certificates | Done (PR #9, 2026-05-28) |
| Sprint 10 *(pre-SOP)* | Premium visual refresh, sign-in-only course access (manual enrollment retired), polish + report cleanups | Done (PRs #10–#12, through 2026-06-09) |

## Current stage — post-launch sprints

| Sprint | Goal / scope | Explicitly out of scope | Acceptance criteria | Depends on | Status |
|---|---|---|---|---|---|
| S11 | Migrate repo governance to the SOP docs pack: filled governing docs at root + `docs/`, templates, sprint/review record folders; retire ad-hoc docs | App code, config, CI, SQL, or dependency changes | Every governing doc filled with real values or `N/A — reason`; old root docs removed; records exist; typecheck/lint/build unchanged | Setup Gate | Ready for Review |

Every sprint gets a record at `docs/sprint-prompts/[SPRINT_ID]-[SLUG].md`. Promote backlog items into new rows here one at a time via `docs/templates/SPRINT-PLAN-TEMPLATE.md`.

## Launch Gate

The site launched pre-SOP (early June 2026) on `https://the-singapore-way-website.vercel.app`; the course launch followed [`course-setup-and-launch-checklist.md`](./course-setup-and-launch-checklist.md).

- [x] All launch-scope sprints are Done; deferrals live in the backlog below.
- [x] The approved conversions work on the production URL.
- [ ] Full `QA-CHECKLIST.md`, `SECURITY-CHECKLIST.md`, and `LAUNCH-CHECKLIST.md` pass. — *These formal gates were adopted after launch; run them in full during the real-domain migration to `thesingaporeway.com`.*
- [x] Rollback owner and action are known; database recovery limits are understood (down-SQL does not restore data; see [`ROLLBACK.md`](./ROLLBACK.md)).
- [x] Content workflow recorded: blog via `src/data/blogPosts.ts`, course content via [`update-course-content.md`](./update-course-content.md).

## Post-launch backlog

Deferred or retired scope is never silently deleted. Promote one item at a time into a scoped sprint.

| Item | Type | Priority | Source | Decision | Notes |
|---|---|---|---|---|---|
| Real-domain migration to `thesingaporeway.com` | improvement | High | predates SOP | D-1 (open) | Run `LAUNCH-CHECKLIST.md` in full; includes DNS, Supabase redirect list, `NEXT_PUBLIC_SITE_URL`, search console |
| Harden `src/lib/request-origin.ts` origin fallback | fix | High | pre-SOP known issue | — | **Required before real-domain migration** (see PROJECT-STATUS §10) |
| Fail closed on absent abuse-control keys in Production | fix | High | S11 review (Codex) | — | **Required before scale** — rate limiter + Turnstile currently fail open if unset (PROJECT-STATUS §10 #4); until then, operator must keep the keys set in Vercel Production |
| Split Supabase into test + prod projects | improvement | Medium | SOP gap analysis (S11) | D-2 (open) | Currently one shared project — accepted risk |
| Remove stale `localhost:5000`/`localhost:5173` Supabase redirect URLs | fix | Low | Replit-era leftover | — | Owner action in Supabase dashboard |
| Introduce an automated test script | improvement | Medium | SOP gap analysis (S11) | D-3 (open) | Tests currently `N/A`; QA relies on typecheck/lint/build/Preview |
| Adopt `docs/templates/PR-DESCRIPTION-TEMPLATE.md` as `.github/PULL_REQUEST_TEMPLATE.md` | improvement | Low | S11 deferral | — | Deliberately out of S11's docs-only scope |
| Fix OG-image text hardcoding `thesingaporeway.com` | fix | Low | S11 gap analysis | — | Resolves naturally with the real-domain migration |

## Universal sprint exit gate

- [ ] Allowed paths and acceptance criteria are satisfied; out-of-scope behavior is preserved.
- [ ] `pnpm run typecheck`, `pnpm run lint`, tests (`N/A — no test script`), and `pnpm run build` pass.
- [ ] Manual and accessibility checks for affected journeys pass.
- [ ] Deployed Vercel Preview is tested on desktop and mobile and recorded via `docs/templates/VERCEL-PREVIEW-TEST-TEMPLATE.md`.
- [ ] Security sections touched by the diff pass (`SECURITY-CHECKLIST.md`).
- [ ] Codex reviewed the immutable merge-base-to-head range and returned Approve.
- [ ] No substantive change occurred after the reviewed head; otherwise Preview and review were repeated.
- [ ] `PROJECT-STATUS.md` and this roadmap were updated in the same authorized branch.
- [ ] After merge, Production smoke test passes.

Database sprints additionally record migration classification (additive, reversible, or destructive), non-production verification, backup/recovery needs, and the fact that schema rollback cannot restore lost data. This repo's migration procedure is hand-applied numbered SQL — see [`../supabase/sql/README.md`](../supabase/sql/README.md).

## Ordering rationale

The site is live, so order now follows risk to the running product: governance first (S11) so every later change ships through a safe, reviewable chain; then the request-origin hardening and real-domain migration as one dependency pair (D-1); infrastructure improvements (Supabase split, tests) follow because they change delivery safety rather than user-visible behavior. Changes to this order require a decision recorded in `PROJECT-STATUS.md`.

**Next:** set the active sprint in `PROJECT-STATUS.md`, then run it through `WORKFLOW.md`.
