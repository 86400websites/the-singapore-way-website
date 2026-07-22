# Sprint Implementation Prompt — S11 — SOP Docs Pack Migration

> Filled from `../templates/CLAUDE-SPRINT-PROMPT-TEMPLATE.md`. This file is the permanent sprint record; the completion section at the end records what actually shipped.

~~~text
You are my senior implementation engineer for The Singapore Way website. CLAUDE.md governs this task.

## Context
The site is live and post-launch (Sprints 0–10 shipped the marketing site, auth, and course MVP pre-SOP).
The repo's governance is ad hoc: eight process docs at the root, a flat docs/ folder, no status/roadmap
trackers, no sprint or review records. The owner has adopted the standardized Website Development SOP
docs pack; this sprint migrates the repo to it so every future change ships through the SOP chain.

## Read first
- CLAUDE.md (pre-migration version) and the SOP pack's 00-START-HERE.md copy map.
- The SOP pack: Website Development SOP/development (18 governing docs + templates/).
- Existing root docs: TECH-ARCHITECTURE.md, DESIGN.md, WORKFLOW.md, SUPABASE_VERCEL_SETUP.md,
  threat_model.md, README.md, AGENTS.md — the real content to carry into the filled pack docs.
- docs/course-setup-and-launch-checklist.md, docs/update-course-content.md, supabase/sql/README.md.

## Sprint / Branch
- Sprint: S11 — SOP Docs Pack Migration
- Branch: claude/s11-sop-docs-pack, created from current main (e96dd75).
- Before editing, confirm the branch and inspect git status. Preserve existing user changes.

## Goal
Every governing doc from the SOP pack exists in this repo at its mapped location, filled with real
project values (or `N/A — reason`); the superseded ad-hoc docs are retired; sprint/review record
folders exist with this sprint's own records. Exit: local checks pass unchanged, no unfilled
placeholder remains in a governing doc, and the PR is ready for Preview + independent review.

## Not this sprint
- Any app code, config, CI, dependency, or SQL change — backlog owns improvements found during migration.
- `.github/PULL_REQUEST_TEMPLATE.md` adoption — backlog.
- Real-domain migration to thesingaporeway.com — backlog (D-1).

## Files
Inspect: the whole repo (read-only) + the SOP pack (read-only).

Allowed to change:
- README.md, CLAUDE.md, AGENTS.md (replaced from pack templates)
- docs/** (new pack docs, templates, records; link fixes in the three kept course docs)
- Deletion of superseded root docs: TECH-ARCHITECTURE.md, DESIGN.md, WORKFLOW.md,
  SUPABASE_VERCEL_SETUP.md; move of threat_model.md → docs/THREAT-MODEL.md

If another file is needed, stop and explain why before editing it.

## Task / Steps
1. Copy docs/templates/ (10 files) + the two prompt guides verbatim.
2. Fill and place the 13 governing docs (3 root + 10 docs/) from pack templates, merging the real
   content of the retired docs; author PROJECT-STATUS.md and ROADMAP.md initialized post-launch.
3. Create docs/sprint-prompts/ and docs/code-reviews/ with this sprint's records.
4. Fix relative links in the kept course docs that pointed at old root paths.
5. Exit gate: full-diff review, placeholder/secret/link scans, local checks, status/roadmap updates.

## Locked inputs
- Approved copy: the shipped repo copy is the live approved baseline — no copy changes in this sprint.
- Architecture/facts: the retired root docs + repo reality (package.json, next.config.ts, src/, supabase/sql/).
- Owner decisions (2026-07-22): conversions = all three (course enrollment, book purchase, newsletter);
  Codex = findings-only reviewer (D-S11-a); sprint ID S11; Commit YES / Push YES authorized.

## Sprint-specific rules
- Docs-only: the diff must touch only .md files.
- Fill templates faithfully — preserve the pack's structure and process language; never weaken a rule.
- Single shared Supabase project is recorded as an accepted risk — never presented as two projects.
- docs/templates/* keep their [PLACEHOLDER] brackets by design (fill-per-use).

## Safety
- Never open, read, copy, print, or modify .env.local or another live-value env file.
- Use env names and placeholder-only examples; never hardcode or echo a secret.
- Preserve auth, data, routing, security, and hosting behavior (no code changes at all).

## Verification
- Typecheck: pnpm run typecheck
- Lint: pnpm run lint
- Tests: N/A — no test script; typecheck + lint + build + gitleaks CI + Preview QA
- Production build: pnpm run build
- Task-specific: placeholder scan (governing docs bracket-free), stale-link scan (no references to
  retired root paths), secret scan of the full diff, copy-map completeness count, .env.local ignored.

## Git action policy
- Commit: YES
- Push: YES, to claude/s11-sop-docs-pack only

## Report
Standard CLAUDE.md task report.
~~~

---

## Sprint record — completion (2026-07-22)

**Outcome:** shipped as specified. All pack docs placed and filled; five root docs retired
(`TECH-ARCHITECTURE.md`, `DESIGN.md`, `WORKFLOW.md`, `SUPABASE_VERCEL_SETUP.md`, old `README.md`/
`CLAUDE.md`/`AGENTS.md` replaced in place); `threat_model.md` moved to `docs/THREAT-MODEL.md`;
records created; links fixed in the kept course docs.

**Checks:** typecheck / lint / build — see `PROJECT-STATUS.md` §6 (run 2026-07-22 on this branch);
tests N/A — no test script. Placeholder, stale-link, secret, and copy-map scans recorded in the PR.

**Deviations:** none from the approved plan. GitHub CLI is not installed on the build machine, so the
PR is opened by the owner from the pushed branch (body prepared by the builder).

**Follow-ups:** the seeded post-launch backlog in `ROADMAP.md` (real-domain migration,
request-origin hardening, Supabase project split, redirect-URL cleanup, test suite, PR template, OG image).

**Next:** test the Vercel Preview, then independent review per
[`../code-reviews/S11-sop-docs-pack-review.md`](../code-reviews/S11-sop-docs-pack-review.md).
