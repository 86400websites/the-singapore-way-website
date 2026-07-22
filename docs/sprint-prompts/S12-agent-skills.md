# Sprint Implementation Prompt — S12 — Agent Skills (/close and /sprint-prompt)

> Filled from `../templates/CLAUDE-SPRINT-PROMPT-TEMPLATE.md`. Permanent sprint record; the completion section records what shipped.

~~~text
You are my senior implementation engineer for The Singapore Way website. CLAUDE.md governs this task.

## Context
The repo adopted the SOP docs pack in S11. Two Claude Code skills — /close (end-of-sprint verification
+ GO/NO-GO) and /sprint-prompt (plan a sprint, or save its record) — proven on another project (Palestine
House) are being adapted for this repo so the commands work here and survive a fresh clone.

## Read first
- CLAUDE.md.
- docs/PROJECT-STATUS.md, docs/ROADMAP.md, docs/WORKFLOW.md, docs/SECURITY-CHECKLIST.md §9,
  docs/DESIGN.md, docs/QA-CHECKLIST.md.
- docs/templates/CLAUDE-SPRINT-PROMPT-TEMPLATE.md and CODEX-REVIEW-PROMPT-TEMPLATE.md (the sprint-prompt
  skill must fill these, not fork them).
- The two source skills provided by the owner (Palestine House versions) — adapt, do not copy.

## Sprint / Branch
- Sprint: S12 — Agent Skills
- Branch: claude/s12-agent-skills, created from current main (a81b4f3).

## Goal
Two working, repo-committed Claude Code skills at .claude/skills/close/SKILL.md and
.claude/skills/sprint-prompt/SKILL.md, adapted to The Singapore Way and consistent with the existing
governing docs (no conflicting facts, commands, or templates). Exit: the skills cite our real docs and
security invariants (including the abuse-control fail-OPEN reality), define no admin role, reference our
branch/commit-push conventions, and the sprint-prompt skill fills the repo's canonical template rather
than inlining a competing one.

## Not this sprint
- Adding the skills to the external SOP pack — owner chose repo-only (the SOP pack is outside this repo).
- Any app code, config, CI, or SQL change — this is skills + docs bookkeeping only.
- A code fix for the abuse-control fail-open gap — tracked in ROADMAP backlog / PROJECT-STATUS §10 #4.

## Files
Allowed to change:
- .claude/skills/close/SKILL.md (new)
- .claude/skills/sprint-prompt/SKILL.md (new)
- docs/sprint-prompts/S12-agent-skills.md (this record), docs/code-reviews/S12-agent-skills-review.md
- docs/PROJECT-STATUS.md, docs/ROADMAP.md (S11 → Done bookkeeping; add S12)

## Locked inputs
- The owner's two Palestine House skill files (structure to adapt).
- Our governing docs are the source of truth for every fact the skills cite. Where the source skill and
  our docs disagree (fail-closed vs fail-open, admin table, page-copy dirs, § numbers, push policy,
  branch names, proof numbers), OUR docs win.

## Sprint-specific rules
- Adapt, never copy: strip every Palestine-House-specific fact. In particular, the abuse controls
  (Upstash, Turnstile) fail OPEN if unset — never state they fail closed.
- No admin role exists; the skills must not assume one.
- The sprint-prompt skill fills docs/templates/CLAUDE-SPRINT-PROMPT-TEMPLATE.md; it must not inline a
  divergent template (avoids drift/conflict).
- Commit/push policy is per-sprint (default NO) — no standing push authorization.

## Safety
- Never open/read/print .env.local; env names only.
- Preserve all app behavior (no code touched).

## Verification
- Typecheck: pnpm run typecheck
- Lint: pnpm run lint
- Tests: N/A — no test script
- Production build: pnpm run build
- Consistency: skills cite only facts present in the governing docs; no fail-closed claim for abuse
  controls; no admin role; branch/command/template references match the repo.

## Git action policy
- Commit: YES
- Push: YES, to claude/s12-agent-skills only
~~~

---

## Sprint record — completion (2026-07-23)

**Outcome:** shipped as specified. Added `.claude/skills/close/SKILL.md` and
`.claude/skills/sprint-prompt/SKILL.md`, adapted from the owner's Palestine House skills and aligned
with this repo's docs. Corrected every carried-over fact: abuse controls documented as fail-OPEN (not
fail-closed), no admin role, approved-copy = shipped baseline (no `page-copy/` dirs), our WORKFLOW
section names, SECURITY-CHECKLIST §9 invariants, `claude/[SPRINT_ID]-slug` branch convention, and
per-sprint commit/push policy. The sprint-prompt skill fills `docs/templates/CLAUDE-SPRINT-PROMPT-TEMPLATE.md`
rather than inlining a competing template. Flipped S11 to Done and recorded S12 in the trackers.

**Checks:** typecheck / lint / build — see PROJECT-STATUS §6 (run 2026-07-23); tests N/A.

**Deviations:** SOP-pack generalization deferred (owner chose repo-only). GitHub CLI not installed on the
build machine — PR opened by the owner from the pushed branch (body prepared by the builder).

**Follow-ups:** if desired later, generalize these two skills into the external SOP pack as templated
versions for future sites.

**Next:** review per [`../code-reviews/S12-agent-skills-review.md`](../code-reviews/S12-agent-skills-review.md).
