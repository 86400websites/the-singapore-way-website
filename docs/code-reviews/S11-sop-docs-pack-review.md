# Codex Review Brief — S11 — sop-docs-pack

> Filled from `../templates/CODEX-REVIEW-PROMPT-TEMPLATE.md`. The reviewer's returned record is
> appended below the brief; the reviewer does not edit the repository.

You are the independent, findings-only reviewer for this PR. AGENTS.md governs this review. Do not edit,
stage, commit, push, merge, install dependencies, or run migrations. Review issues introduced by the pinned
range; inspect enough surrounding context to validate them without starting an unrelated full audit.

## Review target

- Repo: 86400websites/the-singapore-way-website
- PR: number assigned on open — opened from the branch below (owner records it here at review time)
- Branch: claude/s11-sop-docs-pack (context only)
- Merge-base SHA: e96dd75d6b92cc348ff88c2939dd1aa8fee41706
- Reviewed head SHA: record the PR head at review time — the immutable range is merge-base..that head
- Sprint record: docs/sprint-prompts/S11-sop-docs-pack.md
- Expected changed paths: **.md files only** — README.md, CLAUDE.md, AGENTS.md (replaced);
  docs/** (new pack docs, docs/templates/*, docs/sprint-prompts/*, docs/code-reviews/*,
  link fixes in the three kept course docs; threat_model.md moved to docs/THREAT-MODEL.md);
  deletions of root TECH-ARCHITECTURE.md, DESIGN.md, WORKFLOW.md, SUPABASE_VERCEL_SETUP.md

First confirm both SHAs and the actual changed-file list. Stop and report a target mismatch before reviewing
if the range, head, PR, or scope does not agree.

## Read for context

- AGENTS.md.
- The sprint record above.
- docs/PROJECT-STATUS.md and docs/ROADMAP.md (both created in this range).
- The SOP pack source is external to the repo; the filled docs must be internally consistent and
  factually correct against the repository itself.

## Sprint intent

- Goal and exit condition: migrate all repo governance to the SOP docs pack — every governing doc filled
  with real, repo-verifiable values or `N/A — reason`; superseded ad-hoc root docs retired; record folders
  seeded. Docs-only: zero runtime, config, CI, dependency, or SQL changes.
- Intentionally out of scope: app code changes; `.github/PULL_REQUEST_TEMPLATE.md`; real-domain migration.
- Owner-authorized exceptions: `docs/templates/*` keep their `[PLACEHOLDER]` brackets by design
  (fill-per-use templates). AGENTS.md keeps its per-review `[MERGE_BASE_SHA]`/`[HEAD_SHA]` brackets, and
  the two prompt guides (`docs/SPRINT-PROMPT-TEMPLATE.md`, `docs/CODEX-REVIEW-PROMPT.md`) are verbatim
  pack copies with instructional brackets.
- Hosting/Preview state: docs-only change — Vercel Preview should build identically to main; sanity-load
  the Preview and record it via docs/templates/VERCEL-PREVIEW-TEST-TEMPLATE.md.
- Database/migration state: N/A — no database change in this range.

## Checks and evidence

- Typecheck: pnpm run typecheck
- Lint: pnpm run lint
- Tests: N/A — no test script (typecheck + lint + build + gitleaks CI + Preview QA)
- Production build: pnpm run build
- Current CI evidence for the head SHA: see the PR checks tab (CI + gitleaks must be green)
- Current tested Preview evidence for the head SHA: see the Preview test record linked in the PR

Run commands only with the existing environment. Do not install or change anything to make a check pass.
State every command not run and why.

## Hunt list

1. Correctness: filled docs state facts that match the repository (commands, routes, env NAMES, table
   names, domains, decisions). Flag any invented or stale fact.
2. Authorization: docs must not weaken the recorded access model (sign-in-only course; server-side gating).
3. Secrets/env: no live env values, credentials, tokens, private keys, or server-only values anywhere in
   the diff — env NAMES and public URLs only.
4. Data safety: the single-shared-Supabase-project reality is recorded as an accepted risk, not hidden.
5. Input safety: N/A for docs, but flag any doc instruction that would induce unsafe behavior.
6. Build/deploy: the diff touches only .md files; no route, config, lockfile, or CI drift.
7. Scope/content: changed paths match the sprint's allowed list; approved (live) site copy untouched;
   the retired docs' substantive facts were carried, not silently dropped.
8. Regressions: cross-links between docs resolve; no governing doc contradicts another.

Do not open a live-value env file from the worktree. Never echo a suspected secret value. Identify only
its file, line, and type and recommend rotation.
Report serious, evidence-backed issues only; no style nits.

## Returned record

Begin with:

- Confirmed range: e96dd75d6b92cc348ff88c2939dd1aa8fee41706..[HEAD_SHA]
- Scope match: [YES / NO — explanation]
- Files/context inspected: [LIST]
- Commands/evidence checked: [RESULTS_AND_SKIPS]

For each finding:

### Finding [N]
- **Severity:** Blocking / Should-fix
- **Location:** [path/file.ext:line plus route/flow]
- **Issue:** [One or two evidence-based sentences.]
- **Failure scenario:** [Concrete input/state → wrong outcome.]
- **Suggested fix:** [Specific minimal fix.]
- **Confidence:** high / medium / low

If there are no findings, state **No findings** and list the correctness, safety, build, and Preview paths
verified. Do not return a bare approval.

End with exactly one:

**Verdict: [APPROVE / REQUEST CHANGES]** — [ONE_LINE_REASON].
Reviewed range: e96dd75d6b92cc348ff88c2939dd1aa8fee41706..[HEAD_SHA] · Reviewed by [REVIEWER] on [DATE].

The owner or builder appends this returned record below. Any substantive change after the reviewed head
invalidates approval and requires updated checks, a refreshed Preview, and independent review of the new
immutable head. A commit that only appends this review record may be exempt when its documentation-only
scope and reviewed head are recorded.

---

## Returned review record

*(appended after review — none yet)*
