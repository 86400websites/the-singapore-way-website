# Sprint Implementation Prompt — S13 — Online Course Finalisation

> Filled from the owner's S13 finalisation pack (master sprint prompt + approved content docs). Permanent sprint record; the completion section records what shipped.

~~~text
You are my senior implementation engineer for The Singapore Way website. CLAUDE.md governs this task.

## Context
The course shipped as a reviewable SAMPLE (4 modules, 9 placeholder video lessons with video_url null,
3 quizzes). All 16 real videos are produced and tracked. S13 replaces the sample with the final approved
course end-to-end: content, player, quizzes, certificate, database, and docs.

## Read first
- CLAUDE.md, AGENTS.md, docs/PROJECT-STATUS.md, docs/ROADMAP.md, docs/WORKFLOW.md,
  docs/TECH-ARCHITECTURE.md, docs/SECURITY-CHECKLIST.md, docs/QA-CHECKLIST.md,
  docs/update-course-content.md, docs/ROLLBACK.md, supabase/sql/README.md.
- The S13 pack: 01 master prompt, 02 video scripts (meaning source), 03 video links/descriptions
  (authoritative order + URLs), 04 approved course copy, 05 quiz bank (25 questions, keys),
  06 certificate spec, 07 database change runbook, 08 QA/stress-test/sign-off, 12 machine-readable content.

## Sprint / Branch
- Sprint: S13 — Online Course Finalisation
- Branch: claude/s13-online-course-finalisation (created from main at 38f2e63, carries the read-only
  Supabase MCP commit 20e2e6a)

## Goal
5 modules / 16 required YouTube video lessons / 5 required quizzes (25 questions, 80% pass, unlimited
retries, server-side grading) / 21 required items; real privacy-enhanced YouTube player with a narrow
CSP addition; certificate with full-name gate, print/save-as-PDF, and the approved A4-landscape design
with a typographic signature; 0006 content migration + rewritten seed; docs current. Course slug stays
the-singapore-way.

## Gate 0 (completed before editing)
- main clean/current; S12 (PR #14) merged — trackers flipped in this sprint.
- Read-only Supabase MCP (supabase-prod-readonly, OAuth, read_only=true) wired and verified:
  reads OK, trivial write REFUSED ("cannot execute UPDATE in a read-only transaction").
- Read-only preflight (owner-run + MCP-corroborated): 17 lesson_progress / 5 quiz_attempts /
  1 certificate. Owner confirmed all disposable test data → PATH A approved (2026-07-23).
  lesson_progress/quiz_attempts FKs to course_lessons are ON DELETE CASCADE — the preflight is
  what made Path A safe to choose.

## Not this sprint
No custom domain migration, CMS/admin, payments/roles, analytics expansion, auth replacement,
PDF/QR dependencies, automatic SQL execution, fabricated video durations, or imitation of a real
handwritten signature.

## Files
Config: .mcp.json (new), next.config.ts (frame-src +https://www.youtube-nocookie.com only).
Code: src/data/course.ts, src/app/courses/[slug]/page.tsx, src/app/learn/page.tsx,
src/components/Navigation.tsx, src/lib/course/youtube.ts (new), src/components/course/LessonBody.tsx,
src/lib/course/actions.ts (+updateLearnerName), src/components/course/CertificateNameForm.tsx (new),
src/components/course/PrintCertificateButton.tsx (new), src/components/course/CertificateView.tsx,
src/app/courses/[slug]/certificate/page.tsx, src/styles/globals.css (print styles).
SQL: supabase/sql/0006_course_final_content.sql (+ .down.sql) (new), seed-the-singapore-way.sql (rewrite).
Docs: supabase/sql/README.md, docs/update-course-content.md, docs/course-setup-and-launch-checklist.md,
docs/TECH-ARCHITECTURE.md, docs/PROJECT-STATUS.md, docs/ROADMAP.md, docs/SUPABASE-MCP-SAFETY.md (new),
this record.

## Sprint-specific rules
- Approved copy verbatim (03/04/05/12); conflicts reported, never silently rewritten.
- Answer keys (correct_choice, explanations) exist ONLY in 0006 + seed (DB-side); never in src/.
- Seed and 0006 share an identical insert body (seed generated programmatically from 0006).
- Phase checkpoints: implement → local checks → diff → STOP for owner review; commit/push per
  explicit authorization only. Claude never applies SQL, never merges.

## Verification
- pnpm run typecheck / lint / build after every phase; git diff --check; .env.local ignored+untracked.
- git grep correct_choice src == 3 doc comments only.
- Scripted three-way drift check (course.ts ↔ 0006 ↔ seed): 21 lessons order+slugs, 16 URLs sequence,
  16 lesson-notes byte-identical, 25 questions, correct_choice sequence vs approved bank, 4 choices
  per question, seed body verbatim from 0006, dollar-quote balance.
- Post-apply DB verification via read-only MCP: 16/5/21, 25 questions, URL mapping, certificates
  preserved.
- Full Preview QA per pack 08 (journeys, quiz boundaries 0/60/80/100, certificate print/verify,
  cross-browser, a11y, Lighthouse, security review) → Codex review of the immutable range → owner
  merge → Production smoke.

## Git action policy
- Commit: per-phase, explicit owner authorization each time.
- Push: NO until explicitly authorized. Merge: owner only. SQL apply: owner only.
~~~

---

## Shipped commits (branch `claude/s13-online-course-finalisation`, merged as PR #15)

- `20e2e6a` — read-only Supabase MCP (`.mcp.json`, HTTP+OAuth, `read_only=true`, project-scoped) +
  `docs/SUPABASE-MCP-SAFETY.md` (adapted governance: single read-only connection; owner ships all SQL).
  Guardrails verified live: reads OK; trivial write refused by the read-only transaction.
- `ce89b9e` — Phases 1–2: final curriculum + approved landing copy in `src/data/course.ts`
  (5 modules / 16 videos with tracker URLs / 5 quizzes; no answer keys client-side);
  `getVideoLessonCount()`; count call-sites + `#curriculum` anchor; stale "Twelve lessons/three
  quizzes/four modules" copy removed; `src/lib/course/youtube.ts` strict URL→ID parser;
  `LessonBody` real `youtube-nocookie` iframe (no autoplay, honest "Video unavailable" fallback);
  CSP `frame-src` +1 origin only. 16/16 URLs validated, no duplicates.
- `b41c657` — Phases 3–5: `updateLearnerName` server action (self-service
  `user_metadata.full_name`, validated/capped, no privileged key), `CertificateNameForm`,
  `PrintCertificateButton`, approved certificate redesign (presented-to line, supporting line,
  typographic "Maher Kaddoura / Author and Instructor" signature, readable verification URL,
  "Verified certificate" badge), `@media print` A4-landscape styles; `0006` Path A migration +
  `.down.sql` + seed rewritten programmatically from the same insert body; docs (SQL README,
  update-course-content, launch checklist, TECH-ARCHITECTURE, trackers, this record).
- `c7f93c0` — Codex round-1 fixes: `0007` (certificate cleanup — removes certs not backed by
  current-curriculum completion — + server-side full-name gate in `issue_certificate`);
  `name_required` handling + `hasMeaningfulLearnerName()`; certificate page gates the name BEFORE
  issuance/display (NameRequiredState); runbook sweep to final slugs/counts.
- `a845484` (reviewed head at merge) — Codex round-3 doc fixes: all remaining 0008-superseded
  fallback descriptions removed; trackers reconciled. (`37c96ce`, round-2 fixes, sits between:
  `0008` — name gate before the existing-cert return + public verification returns no row for
  blank/generic-name owners; name form rejects generic values.)

---

## Sprint record — completion (2026-07-23)

**Outcome: shipped.** Merged to `main` via **PR #15** (merge commit `0ee5527`, 2026-07-23 20:36 +0530);
branch deleted. The live course is the complete approved product: 5 modules / 16 tracker-mapped
YouTube video lessons / 5 quizzes (25 questions, 80% pass, server-graded, keys DB-only) /
21 required items; privacy-enhanced player behind a one-origin CSP addition; certificate with
layered full-name gate (issue + public display), print/save-as-PDF, approved A4-landscape design
with typographic signature; public verification hides blank/generic-name credentials.

**Database:** migrations `0006` (Path A content rebuild — owner-approved after the read-only
preflight showed only disposable test data), `0007`, and `0008` hand-applied by the owner and
verified via the read-only Supabase MCP (curriculum counts, per-quiz answer-key checksums,
URL mapping, function gates, 0 non-displayable certificates). The sole certificate in the DB is
backed by full completion of the final curriculum. The `supabase-prod-readonly` MCP + governance
doc (`docs/SUPABASE-MCP-SAFETY.md`) shipped in the same PR; its write-refusal was verified live.

**Checks:** typecheck / lint / build passed after every phase and every fix round; scripted
three-way drift check (course.ts ↔ 0006 ↔ seed) all-pass; `git grep correct_choice src` = the
3 documentation comments throughout; `.env.local` ignored/untracked; no dependency changes.

**Independent review (PR #15): three Codex rounds, findings-only.**
- Round 1 (`b41c657`) — REQUEST CHANGES: 3 Blocking + 1 Should-fix (sample-era certificate
  presenting as final-course credential; name gate not enforced before issuance/display;
  PR/Preview evidence; stale runbooks). Fixed in `c7f93c0` (incl. `0007`).
- Round 2 (`c7f93c0`) — REQUEST CHANGES: 2 Blocking + 2 Should-fix (public display of
  generic-name certificates; evidence; form validation; residual runbooks). Fixed in `37c96ce`
  (incl. `0008`).
- Round 3 (`37c96ce`) — REQUEST CHANGES: 1 Blocking (release evidence) + 1 Should-fix (residual
  0008-superseded doc lines). Doc fixes landed in `a845484`; every code/doc finding across all
  rounds was verified fixed by the reviewer's own disposition sections.
- Full record: [`../code-reviews/S13-online-course-finalisation-review.md`](../code-reviews/S13-online-course-finalisation-review.md).

**Deviations:**
- **Merged without a recorded APPROVE.** Rounds 1–3 each returned REQUEST CHANGES; rounds 2–3
  confirmed all prior code findings fixed, and round 3's only Blocking item was the missing
  PR/Preview/CI evidence (the PR had not been opened yet). The owner opened PR #15 and merged at
  their own discretion without submitting a round-4 brief; no APPROVE verdict exists in the
  review record. Compensating evidence: CI on the PR, migrations MCP-verified, and the
  post-merge Production smoke (see `/close` record). Deviation accepted by the owner (their
  merge is the accepting act); noted here so the exit-gate history is honest.
- Two approved-copy strings shipped in present tense (print bullet + FAQ 8) because the pack's
  phase-conditional phrasing would be stale at merge — flagged to the owner in Phase 1.
- Preview certificates display a localhost verify URL because `NEXT_PUBLIC_SITE_URL` is
  deliberately unset in the Preview environment (TECH-ARCHITECTURE §6) — known cosmetic
  limitation until the request-origin hardening sprint.

**Learnings:**
- Reusing a course row while preserving its certificates silently re-labels old credentials —
  content rebuilds must always reconcile dependent credentials in the same migration set.
- A "gate" is only real when the database enforces it on every path (issue, existing-cert
  return, public read); UI checks are presentation.
- Independent review kept blocking on release evidence, not code — open the PR early so
  Preview/CI evidence exists before requesting review.
- The read-only MCP earned its keep: every migration was verified minutes after apply with
  boolean/count-only queries.

**Follow-ups (backlog candidates):**
- Request-origin hardening → real-domain migration (D-1) — also fixes Preview/OG URL cosmetics.
- Owner: set a meaningful `full_name` reminder is moot (0 non-displayable certs), but the
  Supabase-project split (D-2) and automated tests (D-3) remain open.
- Production smoke evidence recorded via `/close` (same date).
