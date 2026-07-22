# Codex Review Brief — S12 — agent-skills

> Filled from `../templates/CODEX-REVIEW-PROMPT-TEMPLATE.md`. Append the reviewer's returned record below.

You are the independent, findings-only reviewer for this PR. AGENTS.md governs this review. Do not edit,
stage, commit, push, merge, install dependencies, or run migrations. Review issues introduced by the
pinned range; inspect enough surrounding context to validate them.

## Review target

- Repo: 86400websites/the-singapore-way-website
- PR: #14 — https://github.com/86400websites/the-singapore-way-website/pull/14
- Branch: claude/s12-agent-skills (context only)
- Merge-base SHA: a81b4f3660452042562b0f022a488b62b2193558
- Reviewed head SHA: f9a90e1c16ad60f6e27879a302dc2520637f288e (round 2, APPROVED). Round 1 reviewed `16b93ca` and returned REQUEST CHANGES; those fixes landed in `f9a90e1`.
- Immutable range: a81b4f3660452042562b0f022a488b62b2193558..f9a90e1c16ad60f6e27879a302dc2520637f288e
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

### Round 1 — reviewed head `16b93ca` — REQUEST CHANGES (Codex, 2026-07-23)

Confirmed range `a81b4f3..16b93ca`; scope match YES (6 Markdown files, 0 app-code). No secrets; links clean; build unchanged (32 routes / 41 static pages). Verified: fail-open vs delivery-fail-closed matches code; no admin model or nonexistent copy/design directories; correct branch + verification commands; the implementation prompt uses the canonical template; S11 Done / S12 In Progress otherwise accurate.

Findings (all fixed on-branch in the follow-up commit):
1. **Blocking** — `sprint-prompt` labelled Codex review optional for non-risky sprints; WORKFLOW §6 + ROADMAP exit gate require review for **every** sprint. → Review now mandatory for every sprint; depth varies by risk.
2. **Blocking** — `sprint-prompt` Mode B "save" committed unconditionally, bypassing the per-task Commit: YES policy. → Save now writes the record only; commits/pushes solely when the task authorizes it.
3. **Blocking** — `close` ran the public-writes invariant only when a handler/env changed, missing shared helpers (`rate-limit.ts`, `turnstile/verify.ts`, `server-env.ts`, validation). → Trigger broadened to any handler, shared helper, config, or env contract on a public-write path.
4. **Blocking** — `close` ran the DB section only when `supabase/sql/**` changed (misses a runtime change needing an omitted migration), and overstated "every `*.sql` needs a paired `.down.sql`" (the seed is exempt). → DB gate triggers on any change/implication of a DB contract with a missing-migration NO-GO; paired-down limited to numbered migrations, seed rollback per `supabase/sql/README.md`.
5. **Should-fix** — trackers/brief left PR/head as placeholders though PR #14 was open. → PR #14, full base, and range recorded here and in PROJECT-STATUS.

**Verdict: REQUEST CHANGES** — reviewed range `a81b4f3..16b93ca` · Reviewed by Codex on 2026-07-23.

### Round 2 — reviewed head `f9a90e1` — APPROVE (Codex, 2026-07-23)

Confirmed range `a81b4f3..f9a90e1`; scope match YES (6 Markdown/skills files, 0 app-code/config/CI/SQL). Installed `tsc --noEmit`, `eslint .`, `next build` all pass (32 routes / 41 static pages, unchanged); head-specific CI + gitleaks + Vercel deploy green for `f9a90e1`; 0 unresolved local links; no secret patterns; `.env.local` ignored/untracked. Manual Preview QA recorded as pending (skills/docs-only — no runtime change).

The four former Blocking findings are resolved: review is mandatory for every sprint; `save` mode cannot independently commit or push; shared public-write helpers activate the security gate; implied database contracts, missing migrations, paired numbered migrations, and the seed exemption are handled correctly. Abuse controls remain accurately documented as fail-open when unset, with delivery dependencies failing closed. No invented admin model, Palestine House facts, template fork, command drift, or standing commit/push authorization was found.

One documentation-only Should-fix from this round (the review record still carried `<current PR #14 head>` placeholders) is resolved by this record: reviewed head `f9a90e1c16ad60f6e27879a302dc2520637f288e`, immutable range `a81b4f3660452042562b0f022a488b62b2193558..f9a90e1c16ad60f6e27879a302dc2520637f288e`.

**Verdict: APPROVE** — all Blocking findings resolved; the exact-range placeholder is corrected in this record. Reviewed range: `a81b4f3..f9a90e1` · Reviewed by Codex on 2026-07-23.

---

*Note: this record + the paired PROJECT-STATUS bookkeeping were appended/updated after the reviewed head `f9a90e1`. Per AGENTS.md / docs/WORKFLOW.md, a documentation-only commit that only records the returned review and status is exempt from re-review; the reviewed head `f9a90e1` and scope are recorded here.*
