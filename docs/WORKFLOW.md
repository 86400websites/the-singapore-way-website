# WORKFLOW.md — How Work Reaches Production

Every change to **The Singapore Way** follows:

**branch → build → local checks → PR → tested Vercel Preview → Codex review → owner merge → Production smoke test**

`main` is protected and production-ready. GitHub is the source of truth.

## 1. Branch

- [ ] Read [`PROJECT-STATUS.md`](./PROJECT-STATUS.md), the active [`ROADMAP.md`](./ROADMAP.md) sprint, and the governing agent file ([`CLAUDE.md`](../CLAUDE.md) for the Claude Code builder; [`AGENTS.md`](../AGENTS.md) for the Codex reviewer).
- [ ] Inspect the repository before assuming the stack, paths, or current behavior.
- [ ] Sync from the latest `main` without discarding user work.
- [ ] Create one focused branch: `claude/[SPRINT_ID]-short-slug` (for example `claude/s12-short-slug`), or `claude/fix-short-slug` for a standalone fix.
- [ ] Confirm no person or agent is already using that branch.

One feature or fix = one branch = one PR. A sprint too large for one reviewable PR must be split before implementation.

## 2. Build

- [ ] State the goal, allowed files, explicit exclusions, and acceptance criteria.
- [ ] Read the exact approved copy, mockup, specification, and surrounding code before editing.
- [ ] Make the smallest safe change that completes the task.
- [ ] Preserve behavior outside scope; send new ideas to the backlog.
- [ ] Do not invent copy, facts, routes, access rules, design variants, or env values.
- [ ] Do not add a dependency or swap a locked stack layer without an explicit decision.

## 3. Local verification

Run the commands recorded in [`TECH-ARCHITECTURE.md`](./TECH-ARCHITECTURE.md):

- [ ] Typecheck: `pnpm run typecheck`
- [ ] Lint: `pnpm run lint`
- [ ] Tests: `N/A — no test script; verification = typecheck + lint + build + gitleaks secret scan in CI + deployed Preview QA`
- [ ] Production build: `pnpm run build`
- [ ] Manual and accessibility checks required by the sprint pass on affected journeys.
- [ ] Review the diff and changed-file list; every file belongs to scope.
- [ ] Verify live env files are ignored without opening them (for example, `git check-ignore .env.local`); confirm no live env file is tracked or staged.
- [ ] Scan the diff for secret-like values and generated/cache files without echoing any suspected secret.

Fix failures caused by the change. Report pre-existing failures with evidence.

**Action boundary:** do not commit or push unless the owner explicitly authorized that action. If not authorized, leave the verified diff uncommitted and report a suggested commit message. Never push to `main`, force-push shared work, reset user work, or skip hooks.

## 4. Pull Request

- [ ] The owner-authorized branch is pushed and a focused PR targets `main`.
- [ ] Description states what, why, files/areas changed, exclusions, checks, screenshots where relevant, and rollback notes.
- [ ] New/changed env variables are listed by **name only** and assigned to environments by the owner.
- [ ] Data changes include migration files, access controls, classification, non-production evidence, and recovery limits.
- [ ] CI passes with the locked package manager and secret scan.

CI is `.github/workflows/ci.yml`: on every PR and push to `main` it runs pnpm 10.12.1 on Node 20 — `pnpm install --frozen-lockfile`, `pnpm run typecheck`, `pnpm run lint`, `pnpm run build` — plus a separate **gitleaks** job that scans the full history for committed secrets.

## 5. Deployed Preview — before independent review

This project uses Vercel: every PR automatically gets its own isolated Vercel Preview deployment (preview origins match `https://*-86400-s-projects.vercel.app`). Production deploys only from `main`.

- [ ] Record provider, Preview URL, branch, and tested head SHA in [`templates/VERCEL-PREVIEW-TEST-TEMPLATE.md`](./templates/VERCEL-PREVIEW-TEST-TEMPLATE.md).
- [ ] Test affected pages and shared consumers on desktop and mobile.
- [ ] Walk the primary and sprint-specific journeys through success and error states.
- [ ] Verify auth links, redirects, data writes, and environment separation when applicable.
- [ ] Confirm no runtime errors, broken assets, layout shift, or Production-data mutation.

Local green is necessary but not sufficient. Do not mark Preview tested without opening the deployed build.

## 6. Independent Codex review

Codex is the findings-only reviewer and Claude Code is the sole builder (decision D-S11-a, 2026-07-22).

- [ ] Compute and record immutable `[MERGE_BASE_SHA]..[HEAD_SHA]`; confirm the head matches the tested Preview.
- [ ] Reviewer checks issues introduced by that range and may inspect enough unchanged context, tests, schema, and governing docs to validate it.
- [ ] Reviewer reports serious correctness, security, data-safety, boundary, build/deploy, and workflow failures—not style nits.
- [ ] Reviewer returns a paste-ready report and makes no repository changes.
- [ ] Owner or builder saves it at `docs/code-reviews/[SPRINT_ID]-[SLUG]-review.md`.

Blocking findings are fixed by the builder. After any substantive code, config, schema, lockfile, or runtime-doc change, repeat affected local checks, refresh and retest the Preview, and obtain a new review at the new head. Approval never carries forward to unreviewed work.

## 7. Merge

Only the authorized human owner merges, after CI, Preview, and current-head review all pass.

- [ ] Confirm the reviewed head is still the PR head.
- [ ] Merge using the repository's approved strategy (GitHub PR merge commit, as used for PRs #1–#12).
- [ ] Delete the merged branch when safe.
- [ ] Watch the Production deployment complete.

## 8. Production smoke test

- [ ] Test the production site — `https://the-singapore-way-website.vercel.app` (custom domain `thesingaporeway.com` is not yet connected; see [`PROJECT-STATUS.md`](./PROJECT-STATUS.md) open decisions) — on desktop and mobile.
- [ ] Walk the primary conversion (course enrollment, `/thebook` Amazon click-through, newsletter signup) and the changed journey.
- [ ] Verify monitoring, integrations, auth, and data behavior touched by the change.
- [ ] If users are affected, execute [`ROLLBACK.md`](./ROLLBACK.md); remember that host rollback does not restore database data.

## Sprint and state discipline

- One active sprint at a time; do not start the next while the previous is unmerged.
- [`ROADMAP.md`](./ROADMAP.md) owns scope/order. [`PROJECT-STATUS.md`](./PROJECT-STATUS.md) owns current state. Update both in the same authorized PR when the sprint closes.
- The Development Operating Room is an operator dashboard; synchronize it after repo state changes, and link to the repo records rather than duplicating their detail.
- Retired or deferred scope stays dated in the backlog with an owner and decision ID.

## Database change protocol — skip if none

- [ ] Classify each migration: **additive**, **reversible**, or **destructive**.
- [ ] Version migrations and include the chosen tool's supported rollback path plus access policies in the same PR.
- [ ] Apply and verify in an isolated non-production environment first, per user role.
- [ ] Use expand → migrate → contract for compatibility.
- [ ] Destructive work requires owner approval, backup/PITR evidence, a tested restore procedure where feasible, and a maintenance/rollback decision.
- [ ] State plainly: down-SQL can reverse compatible schema changes; it cannot recreate deleted or transformed data.
- [ ] Prefer a forward fix when rollback would risk additional data loss.

**Project reality for this repo:**

- Migrations are numbered SQL files in `supabase/sql/` (`0001`–`0005`), each with a paired `.down.sql` rollback file. There is no Supabase CLI in this workflow: the **owner hand-applies each file via the Supabase dashboard → SQL Editor**, in the apply order documented in [`../supabase/sql/README.md`](../supabase/sql/README.md) (note: `0004` is superseded by `0005` and must be skipped, per that README).
- `.down.sql` files are destructive rollback tools only — never paste one into the SQL Editor unless explicitly rolling back, and remember a down migration does not restore lost data.
- A **single Supabase project serves all environments** (local/Preview/Production). This is a recorded accepted risk, which means the "isolated non-production environment" gate above cannot currently be satisfied with a separate database; splitting test/prod projects is an open decision tracked in [`PROJECT-STATUS.md`](./PROJECT-STATUS.md).

## Definition of done

- [ ] Acceptance criteria and allowed-path guard pass.
- [ ] Local commands and relevant manual/accessibility/security checks pass.
- [ ] CI and deployed Preview pass at the reviewed head SHA.
- [ ] Current-head independent verdict is Approve; no Blocking finding remains.
- [ ] Required docs/status records are current.
- [ ] Merge is complete and Production smoke test passes.

**Next:** fill the active sprint prompt from [`SPRINT-PROMPT-TEMPLATE.md`](./SPRINT-PROMPT-TEMPLATE.md), then follow this chain without reordering it.

## Appendix — command cheat-sheet (carried from pre-SOP workflow)

Only the commands you actually need.

```bash
# Sync with main
git checkout main
git pull origin main

# Start a new change
git checkout -b claude/s12-short-slug   # or claude/fix-short-slug

# Check what changed
git status

# Install / dev / typecheck / lint / build
pnpm install --frozen-lockfile
pnpm run dev          # http://localhost:3000
pnpm run typecheck
pnpm run lint
pnpm run build
pnpm run start        # serve the production build locally

# Commit and push (only when the owner has authorized it)
git commit -m "Short clear message"
git push -u origin claude/s12-short-slug

# Roll back a bad commit
git revert <commit-sha>
```
