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

## Sprint record — status (2026-07-23, in progress)

**Shipped so far on `claude/s13-online-course-finalisation`:**

- `20e2e6a` — read-only Supabase MCP (`.mcp.json`, HTTP+OAuth, `read_only=true`, project-scoped) +
  `docs/SUPABASE-MCP-SAFETY.md` (adapted governance: single read-only connection; owner ships all SQL).
  Guardrails verified live: reads OK; trivial write refused by the read-only transaction.
- `ce89b9e` — Phases 1–2: final curriculum + approved landing copy in `src/data/course.ts`
  (5 modules / 16 videos with tracker URLs / 5 quizzes; no answer keys client-side);
  `getVideoLessonCount()`; count call-sites + `#curriculum` anchor; stale "Twelve lessons/three
  quizzes/four modules" copy removed; `src/lib/course/youtube.ts` strict URL→ID parser;
  `LessonBody` real `youtube-nocookie` iframe (no autoplay, honest "Video unavailable" fallback);
  CSP `frame-src` +1 origin only. 16/16 URLs validated, no duplicates.
- (uncommitted at time of writing) Phase 4: `updateLearnerName` server action (self-service
  `user_metadata.full_name`, validated/capped, no privileged key), `CertificateNameForm`,
  `PrintCertificateButton`, approved certificate redesign (presented-to line, supporting line,
  typographic "Maher Kaddoura / Author and Instructor" signature, readable verification URL,
  "Verified certificate" badge), `@media print` A4-landscape styles. Phase 3+5 package: `0006`
  Path A migration + `.down.sql` + seed rewritten from the same body; docs updated (SQL README,
  update-course-content, launch checklist, TECH-ARCHITECTURE, trackers).

**Copy deviations flagged for owner sign-off:** two pack strings were phase-conditional and would be
stale at merge ("Print or save the certificate as PDF after the certificate design phase is complete";
FAQ "will be print-friendly") — shipped in present tense instead. Everything else is verbatim.

**Checks:** typecheck / lint / build pass after every phase; drift check all-pass; answer-key grep
clean. See PROJECT-STATUS §6.

**Remaining:** owner reviews/commits Phase 4+5 diff → authorized push → PR + Vercel Preview → owner
applies 0006 → MCP read-only verification → full pack-08 QA → Codex review → owner merge →
Production smoke → finalise this record via `/sprint-prompt save`.
