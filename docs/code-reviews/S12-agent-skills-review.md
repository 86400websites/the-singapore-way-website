# Codex Review Brief — S12 — agent-skills

> Filled from `../templates/CODEX-REVIEW-PROMPT-TEMPLATE.md`. Append the reviewer's returned record below.

You are the independent, findings-only reviewer for this PR. AGENTS.md governs this review. Do not edit,
stage, commit, push, merge, install dependencies, or run migrations. Review issues introduced by the
pinned range; inspect enough surrounding context to validate them.

## Review target

- Repo: 86400websites/the-singapore-way-website
- PR: #[PR_NUMBER] — opened from the branch below
- Branch: claude/s12-agent-skills (context only)
- Merge-base SHA: a81b4f36... (current main head at branch creation — confirm with `git merge-base main HEAD`)
- Reviewed head SHA: [record the PR head at review time]
- Sprint record: docs/sprint-prompts/S12-agent-skills.md
- Expected changed paths: `.claude/skills/close/SKILL.md`, `.claude/skills/sprint-prompt/SKILL.md`,
  `docs/sprint-prompts/S12-agent-skills.md`, `docs/code-reviews/S12-agent-skills-review.md`,
  `docs/PROJECT-STATUS.md`, `docs/ROADMAP.md`. **Markdown only; 0 app-code/config/CI/SQL files.**

Confirm both SHAs and the changed-file list before reviewing.

## Sprint intent

- Goal: add two repo-committed Claude Code skills (`/close`, `/sprint-prompt`) adapted for The Singapore
  Way, consistent with the governing docs; plus S11→Done and S12 tracker bookkeeping. Docs/skills only.
- Out of scope: app code; external SOP-pack changes; a code fix for the abuse-control fail-open gap.

## Hunt list (serious, evidence-backed only)

1. **Consistency with governing docs** — the skills must not contradict CLAUDE.md, WORKFLOW.md,
   SECURITY-CHECKLIST.md, PROJECT-STATUS.md, or ROADMAP.md. Verify every fact the skills cite exists in
   those docs.
2. **Fail-open reality** — CONFIRM neither skill claims the abuse controls (Upstash rate limiting,
   Turnstile) fail closed. They fail OPEN if unset (SECURITY-CHECKLIST §9, PROJECT-STATUS §10 #4); the
   `/close` skill must check for exactly that.
3. **No invented model** — no admin role; no `page-copy/`/`page-designs/` directories; no Palestine House
   proof numbers; correct branch convention (`claude/[SPRINT_ID]-slug`); correct commands
   (`pnpm run typecheck/lint/build`, tests N/A); commit/push default NO (no standing authorization).
4. **No template fork** — the `/sprint-prompt` skill fills `docs/templates/CLAUDE-SPRINT-PROMPT-TEMPLATE.md`
   rather than inlining a competing template.
5. **Scope** — the range is Markdown-only; flag any app-code/config/CI/SQL change.
6. **Secrets** — env NAMES only; no values; `.env.local` untracked.
7. **Trackers** — S11 correctly flipped to Done (merged, PR #13); S12 recorded; no false claim about
   review/merge state.

## Returned record

Begin with confirmed range, scope match, files inspected, commands/evidence. Then findings in the
standard format, or **No findings** with what was verified. End with exactly one verdict: APPROVE or
REQUEST CHANGES, restating the reviewed range.

---

## Returned review record

*(appended after review — none yet)*
