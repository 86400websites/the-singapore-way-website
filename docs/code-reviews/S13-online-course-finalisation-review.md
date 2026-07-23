# Code Review Record — S13 — Online Course Finalisation

> Independent findings-only review per AGENTS.md. Round 1 verdict recorded verbatim below,
> followed by the builder's disposition. Round 2 will be appended when run.

## Round 1 — 2026-07-23 — REQUEST CHANGES

- Merge base: `38f2e6301904a18f38bfe16f3d5a1aeda5bf3d95` (main)
- Reviewed head: `b41c657c952a7eabe017c2e358633a6e42927cb4`
- Range: 25 changed files, 2,472 insertions, 507 deletions

### Findings (as returned by the reviewer)

**1. Immutable range and Preview evidence are not supplied — Blocking.**
Review brief placeholders unresolved; no PR opened, no deployed Preview tested; locally
inferred range cannot establish Preview/CI correspondence to the head. Fix: open the PR,
test the Preview at an exact SHA, complete Preview QA + CI/gitleaks, fill the immutable
fields, re-review that head. Confidence: high.

**2. A certificate for the replaced sample course becomes a certificate for the final
course without completing it — Blocking.**
0006 reuses the course row and preserves its certificate while resetting progress;
`issue_certificate` returns an existing certificate before rechecking completion, and
public verification reads the current course title — so the preserved sample-era test
certificate presents as a credential for the final curriculum. Fix: forward corrective
migration removing the disposable test certificate (or preserve an immutable legacy
version if a certificate must stay valid). Confidence: high.

**3. Certificates are issued and displayed before the required full-name gate — Blocking.**
The page issued before checking the name, displayed the certificate and Print alongside
the name form, checked only empty-string, and the authenticated RPC is directly callable
so a UI-only check is insufficient. Fix: gate before issuance, enforce inside
`issue_certificate` via a numbered migration, suppress certificate/Print until it passes,
handle already-issued generic-name certificates. Confidence: high.

**4. Current setup and maintenance runbooks still target the retired sample curriculum —
Should-fix.**
Retired slugs (`welcome`, `foundations-quiz`), old title, sample placeholder and
12-lesson expectations remain in the operator checklist and content guide;
PROJECT-STATUS said both "awaiting owner apply" and "owner applied". Fix: update to the
final curriculum and make application status internally consistent. Confidence: high.

Reviewer evidence: full-range diff inspected including unchanged certificate/quiz RPCs;
offline TypeScript/ESLint/Next build pass; YouTube parser accepts all 16 URLs and rejects
malformed origins; course/SQL/seed comparison matched; `correct_choice` search clean;
no secrets; `.env.local` untracked; `.mcp.json` credential-free. Preview/browser/CI
evidence not verifiable (no PR yet).

**Verdict: REQUEST CHANGES** — merge-base `38f2e63…`, reviewed head `b41c657…`.

---

## Builder disposition — round 1 (2026-07-23)

| # | Finding | Disposition |
|---|---|---|
| 1 | No PR/Preview evidence | **Owner-process** — PR to be opened from the pushed branch; Preview QA per pack 08 will be recorded at the exact head; round 2 runs against that immutable head with the brief fully filled. |
| 2 | Sample-era certificate survives as final-course credential | **Fixed** — new `supabase/sql/0007_certificate_name_gate_and_cleanup.sql` (+ paired down): course-scoped delete of certificates **not backed by completion of the current curriculum** (self-limiting — certificates legitimately earned post-0006 are untouched; at authoring time exactly the one owner-confirmed disposable test cert). `issue_certificate`'s idempotent-return semantics unchanged; the invalid state is corrected in data. 0006's header annotated to always apply 0007 after it. |
| 3 | Name gate not enforced before issuance/display | **Fixed** — (a) authoritative server-side gate: 0007 replaces `issue_certificate` to raise `Full name required` when `raw_user_meta_data->>'full_name'` is blank/generic (`learner`, `verified learner`); (b) `src/lib/course/queries.ts` maps the new error to a typed `name_required` status and adds `hasMeaningfulLearnerName()`; (c) the certificate page now checks the name **before** calling the RPC and renders a dedicated NameRequiredState (name form; certificate and Print suppressed) whenever the course is complete or a certificate exists without a meaningful name — covering pre-existing generic-name certificates. |
| 4 | Runbooks target retired sample curriculum | **Fixed** — `course-setup-and-launch-checklist.md` (§2a adds 0007; §3 smoke tests use `start-here` / `purpose-constraints-pragmatism-quiz` with updated expectations; §4 expects the final title and 5/21/25 counts; §5 expects the YouTube embed) ; `update-course-content.md` (final quiz slugs in examples; layered name-gate description); `PROJECT-STATUS.md` §1 made internally consistent (0006 applied + verified; round-1 result recorded). |

Files changed in the fix round: `supabase/sql/0007_certificate_name_gate_and_cleanup.sql` (new),
`supabase/sql/0007_certificate_name_gate_and_cleanup.down.sql` (new),
`supabase/sql/0006_course_final_content.sql` (header note only), `supabase/sql/README.md`,
`src/lib/course/queries.ts`, `src/app/courses/[slug]/certificate/page.tsx`,
`docs/course-setup-and-launch-checklist.md`, `docs/update-course-content.md`,
`docs/PROJECT-STATUS.md`, this record.

Note: `queries.ts` was on the sprint's "not changed" list; the blocking finding required
the narrow error-mapping + helper addition recorded here.

Owner actions before round 2: apply 0007 in the SQL Editor (builder verifies read-only:
0 certificates remain, function contains the gate); open the PR; run Preview QA per pack
08; then request Codex round 2 against the new head with the brief fields filled.

## Round 2 — pending
