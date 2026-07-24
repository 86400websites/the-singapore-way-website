# Codex Review Brief — S14 — certificate-template

> Save the filled brief at docs/code-reviews/S14-certificate-template-review.md before review.
> Append the reviewer's returned record; the reviewer does not edit the repository.

You are the independent, findings-only reviewer for this PR. AGENTS.md governs this review. Do not edit,
stage, commit, push, merge, install dependencies, or run migrations. Review issues introduced by the pinned
range; inspect enough surrounding context to validate them without starting an unrelated full audit.

## Review target

- Repo: 86400websites/the-singapore-way-website
- PR: #[OWNER: PR number pending — not yet opened] — [OWNER: compare `claude/s14-certificate-template` → `main` at https://github.com/86400websites/the-singapore-way-website/compare/main...claude/s14-certificate-template]
- Branch: claude/s14-certificate-template (context only)
- Merge-base SHA: 913f6f9 (main)
- Reviewed head SHA: 223d5ea
- Immutable range: 913f6f9..223d5ea
- Sprint record: docs/sprint-prompts/S14-certificate-template.md (created at close; not present at reviewed head and not in the `913f6f9..223d5ea` diff — sprint intent is summarized inline in the "Sprint intent" section below, so do not treat the missing file as a scope mismatch)
- Expected changed paths (7):
  - `src/components/course/CertificateView.tsx` (rebuilt — core)
  - `src/styles/globals.css` (print block)
  - `.gitignore`
  - `docs/BROWSER-TOOLS.md` (new)
  - `.claude/skills/browser-qa/SKILL.md` (new)
  - `docs/PROJECT-STATUS.md`
  - `docs/ROADMAP.md`

First confirm both SHAs and the actual changed-file list. Stop and report a target mismatch before reviewing
if the range, head, PR, or scope does not agree. Confirm the changed-file list with
`git diff 913f6f9..223d5ea` (or `git diff origin/main..223d5ea` after `git fetch`, since `origin/main` =
`913f6f9`). A stale local clone whose `main` predates PR #16 (`main` = `0ee5527`) will show **9** files under
`git diff main..223d5ea` — the 7 expected plus `docs/code-reviews/S13-online-course-finalisation-review.md`
and `docs/sprint-prompts/S13-online-course-finalisation.md`, both carried in from PR #16 and outside this
range. That is a stale-baseline artifact, not a scope mismatch; the pinned range `913f6f9..223d5ea` is
authoritative. Tie every finding to the immutable range `913f6f9..223d5ea`; the two consumer routes
(`src/app/certificates/[certificateId]/page.tsx`, `src/app/courses/[slug]/certificate/page.tsx`) are
unchanged and appear only as pre-existing callers — do not audit them as if S14 touched them.

## Read for context

- AGENTS.md.
- docs/sprint-prompts/S14-certificate-template.md — created at close; not present at reviewed head, so read the inline "Sprint intent" section below instead of this path.
- docs/PROJECT-STATUS.md and the S14 row of docs/ROADMAP.md.
- docs/DESIGN.md (§6 accessibility; §7 + Appendices A–D), docs/SECURITY-CHECKLIST.md (§9.2 in particular), docs/WORKFLOW.md.
- `src/components/course/CertificateView.tsx`, `src/styles/globals.css`, `src/lib/seo/site.ts`.
- The two pre-existing consumers for context only: `src/app/certificates/[certificateId]/page.tsx`, `src/app/courses/[slug]/certificate/page.tsx`.
- The new governance docs: `docs/BROWSER-TOOLS.md`, `.claude/skills/browser-qa/SKILL.md`.

## Sprint intent

- Goal and exit condition: Rebuild the completion certificate (`CertificateView.tsx`) to match the approved mockup at 320/768/1440 with no 320px overflow and one-A4-landscape print, and fix the verify-link bug so the printed PDF carries a real link annotation. The bug: the verify URL was plain text (`<p>`, `break-all max-w-md`) so print-to-PDF wrapped it and produced no usable link annotation; it is now a real `<a href={verifyUrl}>` forced to one line in print, so the browser emits a genuine `/URI` annotation with the complete `/certificates/<uuid>` URL (proven locally via headless print-to-PDF — the old PDF had no annotation, the fixed PDF carries the full-UUID `/URI`). The sprint also lands a `browser-qa` skill + `BROWSER-TOOLS.md` doc and a `.gitignore` hygiene add. Exit when the certificate renders/print-checks correctly, the link annotation is proven, the skill/doc are repo-consistent, and typecheck/lint/build pass.
- Intentionally out of scope — do NOT flag these as regressions or omissions:
  - Route/consumer files: both `page.tsx` consumers are intentionally unchanged.
  - Course content (`src/data`/`course.ts`), DB/SQL/RPC/migrations (`supabase/`), auth/middleware, and the certificate **name gate** — all untouched by design (the gate lives in issuance/route logic, not `CertificateView`, which only renders the already-resolved `learnerName`).
  - Pre-existing conditions not introduced by this diff:
    - The verify **page** carries its own `<h1>` (`certificates/[certificateId]/page.tsx:46`) so that page renders two h1s, and the verify page does not use the `.print-cert-section` wrapper — both live in the two route files, which are untouched by S14.
    - Separately, the rebuilt `CertificateView.tsx` course-title `<p>` lacks `break-words`, but this matches base `913f6f9` (line 82 also lacked it), so it is a "same as base" carry-over, not an S14 regression.
    - Note any of these at most; do not file them as S14 defects.
- Owner-authorized exceptions: None.
- Known limitation — do NOT file as a bug: On the **Preview** deploy the printed/shown verify URL reads `http://localhost:3000/certificates/<uuid>`, because `NEXT_PUBLIC_SITE_URL` is unset in Preview and `absoluteUrl` falls back to `http://localhost:3000` (`src/lib/seo/site.ts:8-9,17-20`). This is by design — the fix under validation is URL *completeness* (a real `/URI` annotation carrying the full, one-line UUID URL), which is proven; **host correctness** (the production domain in the annotation) is deferred to the post-merge Production smoke test, as recorded in `docs/PROJECT-STATUS.md` "Next action". Accept a localhost host on Preview; require the production-host click-through only at the Production smoke step.
- Hosting/Preview state: [OWNER: Preview URL + tested 320/768/1440 visual QA for head `223d5ea` PENDING — PR not yet opened. This is the one open acceptance item.]
- Database/migration state: N/A — no SQL, migration, RPC, or query changed.

## Checks and evidence

- Typecheck: `pnpm run typecheck`
- Lint: `pnpm run lint`
- Tests: N/A — no test script.
- Production build: `pnpm run build`
- Current CI evidence for HEAD_SHA: [OWNER: pending — PR not opened; CI/gitleaks/Vercel deploy not yet run for `223d5ea`.]
- Current tested Preview evidence for HEAD_SHA: [OWNER: pending — 320/768/1440 visual QA and headless print-to-PDF re-check on the deployed Preview not yet captured for `223d5ea`.]

Local checks recorded pass 2026-07-24 (`docs/PROJECT-STATUS.md` §Checks): typecheck, lint, build all green;
link annotation proven via local headless print-to-PDF.

Run commands only with the existing environment. Do not install or change anything to make a check pass.
State every command not run and why.

## Hunt list

1. Correctness: exit criteria work in realistic success, empty, loading, and failure states that apply.
2. Authorization: gated routes/data paths, if any, authorize server-side before protected reads; admin paths verify role.
3. Secrets/env: no live env values, credentials, tokens, private keys, or server-only values exposed. A placeholder-only example file is acceptable only when it contains names/placeholders, not live values.
4. Data safety: no unintended anonymous path or silent data loss; database changes, if any, match the selected migration, rollback, and access-policy rules.
5. Input safety: untrusted values are validated before redirects, URLs, raw HTML, queries, or other sinks.
6. Build/deploy: imports, generated artifacts, routing/rendering mode, config, lockfiles, and hosting behavior have no unintended change.
7. Scope/content: actual paths match the sprint; approved copy/design/facts were not silently changed.
8. Regressions: the change does not weaken an existing guard or break a neighboring workflow.

### S14-specific review targets (validate each against the range, with file:line evidence)

1. **Two variants, one component.** Props destructure unchanged (`CertificateView.tsx:70-76`); the `variant === 'verify'` ternary (`:180`) vs `own` else-branch (`:198`) is intact; verify page passes `variant="verify"` (`certificates/[certificateId]/page.tsx:59`), own page passes `variant="own"` (`courses/[slug]/certificate/page.tsx:132`). Confirm no cross-variant regression.
2. **Verify variant must not expose the URL/anchor (SECURITY-CHECKLIST §9.2 containment).** Verify branch renders only the green "Verified certificate" pill (`:181-197`, `bg-[#E8F5EE] text-[#0a8553]`, check-SVG). `verifyUrl` is computed unconditionally (`:77`) but must remain **unused** in the verify branch — confirm the `<a href={verifyUrl}>` anchor and the "Share this link…" copy live exclusively in the `own` branch (`:206-218`), with no leakage into verify.
3. **The verify-link fix (sprint substance).** URL changed from `<p>` (base) to `<a href={verifyUrl}>{verifyUrl}</a>` (`:206-211`). Confirm the print one-line treatment is present on BOTH targets: the URL anchor `break-all max-w-md print:max-w-none print:break-normal print:whitespace-nowrap` (`:208`) AND the certificate-code `<dd>` `break-all max-w-[24ch] print:max-w-none print:break-normal print:whitespace-nowrap` (`:163`) — both wrap on screen, force one line in print. The acceptance is a real `/URI` annotation carrying the complete `/certificates/<uuid>` URL (proven locally; re-prove on Preview print-to-PDF).
4. **Injection / open-redirect surface on the new anchor.** `verifyUrl = absoluteUrl('/certificates/' + certificateId)`; `SITE_URL` comes from trusted `NEXT_PUBLIC_SITE_URL` (fallback `http://localhost:3000`) and `certificateId` is a DB uuid gated in the verify route by `isLikelyUuid` regex `^[0-9a-f]{8}-…-[0-9a-f]{12}$` (`certificates/[certificateId]/page.tsx:32,72-74`) BEFORE render, with the passed value being `cert.id` from `getPublicCertificate` (`:55`). Rendered as JSX text + `href` (React-escaped, `setAttribute`), no `dangerouslySetInnerHTML`. Confirm no `javascript:`/`data:` scheme is reachable from a validated UUID and the href is a same-origin app URL.
5. **One-page A4 landscape print.** `@page { size: A4 landscape; margin: 10mm }` (`globals.css:192-195`), `.print-cert { break-inside: avoid }` (`:224`), header/footer/`.no-print` `display:none` (`:197-201`). Scoping caveat: the `.print-cert-section` padding-zero wrapper (`globals.css:207-215`) is present only on the OWN page (`courses/[slug]/certificate/page.tsx:114`); the verify page uses a plain `<section className="bg-[#fbf5f2]">` (`certificates/[certificateId]/page.tsx:42`). The diff changes print sizing (`--cert-corner: 20mm`, padding `8mm 16mm`), so re-check the actual print-to-PDF on the own page.
6. **Print corner collision — Preview-deferred visual check, NOT a code-review finding.** `--cert-corner` is print-overridden to `20mm` (`globals.css:223`) but the corner-SVG position offsets and frame insets are NOT print-tuned — they stay `top-3 md:top-4` and `inset-3 md:inset-4` / `inset-[18px] md:inset-[24px]` (`CertificateView.tsx:87-98`); `print-cert-inner` left/right padding is only `16mm` (`globals.css:230`). Whether the enlarged (~20mm) corner fans collide with the text column at the top corners is a visual judgement that can only be made on the deployed-Preview print-to-PDF — defer it to the pending Preview QA and do not file it as a code-review finding.
7. **Corner geometry / mirroring — Preview-deferred visual check, NOT a code-review finding.** `--cert-corner` declared `[--cert-corner:52px] md:[--cert-corner:84px]` on the `<article>` (`:82`); `CornerRays` consumes `h-[var(--cert-corner)] w-[var(--cert-corner)]` (`:40`). Mirroring: TL default (`:90`), TR `-scale-x-100` (`:91`), BL `-scale-y-100` (`:92`), BR `-scale-100` (`:93`) — all four fans point inward; open-circle spans centered via `±translate-1/2` (`:95-98`). The decorative approximation (ray origin ~14.6px from edge vs 12px frame inset) is sub-pixel cosmetic geometry — verify it visually on the pending Preview render if at all, and do not file it as a code-review finding (no style nits).
8. **Long-content wrapping.** Learner `<h1>` has `break-words max-w-2xl` (`:121`) — wraps. Course-title `<p>` (`:126`) has `max-w-2xl` but **no `break-words`** — this matches base `913f6f9` (line 82 also lacked it), so the asymmetry pre-existed S14. Note it at most; do not file it as an S14 defect (low risk, fixed approved content). `FlankedEyebrow` text wraps at 320px via `min-w-3` flank rules (`:60-66`); signature `whitespace-nowrap` (`:136`) is deliberate for the fixed name.
9. **Footer refactor.** 3-column region refactored from `grid sm:grid-cols-3` to `flex-col sm:flex-row` with `hidden sm:block` vertical dividers (`:134-167`) — confirm dividers vanish on mobile with no dangling rules at 320px.
10. **Accessibility (DESIGN.md §6).** New anchor has `focus-ring` (`:208` → `globals.css:182-184`, `focus-visible:ring-2 ring-[#C8102E]`) plus `underline decoration-[#D3CEC4]` (distinguished by more than color). Decorative elements hidden from AT: `CornerRays` `aria-hidden` (`:43`), frame wrapper `aria-hidden` (`:86`, corner circles inherit), `FlankedEyebrow` hairlines (`:61,65`), bottom rule (`:172`), dividers (`:144,156`), badge SVG (`:187`). Heading order: only `<h1>` is learner name (`:121`); "Certificate of Completion" (`:112`) and course title (`:126`) are `<p>`. Contrast on the NEW `#FAF9F6` sheet (`:82` + `globals.css:220`): `#666` ≈5.6:1 (pass), `#444` ≈9.5:1 (pass), title/name very high (pass), `#C8102E` large-bold-serif ≥30px → 3:1 bar (pass). The one legitimate contrast nit: `#888888` "Share this link…" helper (`:215`, 12px, `no-print`) ≈**3.4:1 on `#FAF9F6`** — below the 4.5:1 body bar; pre-existing (~3.5:1 on old white) and marginally worsened by the background change; screen-only, non-load-bearing.
11. **SECURITY-CHECKLIST.md.** §9.2 "Certificate verification leaks no PII" (🔴) is the ONE applicable item: verify branch renders only `learnerDisplayName` (approved public display name from `getPublicCertificate`), `courseTitle`, issue date, and the UUID code — no email, no `verifyUrl` (`:180-197`). §1 Secrets / §2 Env boundary / §3 Auth / §4 Database / §5 Public writes / §6 Headers & transport / §7 Error hygiene / §8 Dependencies — all N/A (presentational + governance docs + gitignore hygiene). Note the new `<a>` is same-origin (no `target="_blank"`, no external origin), corners are inline SVG (no remote image, CSP `img-src` unaffected), no dependency/lockfile change (corners hand-authored, no PDF/QR library).
12. **`.gitignore` hygiene.** Adds `qa-evidence/` (`:16`) + `.playwright-mcp/` (`:19`) within the `:15-20` region — supports §1/§4 hygiene (screenshots/PDFs that could contain data can't be committed); confirm it weakens nothing.
13. **Governance-doc accuracy.** No dangling section refs: DESIGN.md tops out at §7 + Appendices A–D (no §8); `BROWSER-TOOLS.md` refs `DESIGN §7 + Appendix C` (`:36`), `§5/§6/§7` + `Appendix B` (`:45,48`); WORKFLOW refs `§5` (`:37,59`) and `§8` (`:40`) — all exist. `docs/templates/VERCEL-PREVIEW-TEST-TEMPLATE.md` (`BROWSER-TOOLS.md:48`, `SKILL.md:31`) and `docs/templates/BUG-FIX-PROMPT-TEMPLATE.md` (`BROWSER-TOOLS.md:38`, `SKILL.md:41`) exist. `browser-qa` frontmatter (`.claude/skills/browser-qa/SKILL.md:1-4`) is `name` + `description` only, matching the shipped `close`/`sprint-prompt` skills — no stray keys. Confirm no generic-template residue (placeholder org name, non-existent tool).
14. **Scope confinement.** Confirm the diff is exactly the 7 listed files — one presentational component, one print CSS block, `.gitignore`, two new governance docs, two trackers — with no course content, DB/RPC/SQL, route, auth/middleware, or name-gate change. Confirm against `git diff 913f6f9..223d5ea` (or `origin/main`), not a stale local `main`.

Do not open a live-value env file from the worktree. Never echo a suspected secret value. Identify only
its file, line, and type and recommend rotation.
Report serious, evidence-backed issues only; no style nits.

## Acceptance criteria (verbatim, `docs/ROADMAP.md:45`)

> "Certificate matches the mockup at 320/768/1440 with no 320px overflow and prints on one A4 landscape page; the printed PDF carries a real link annotation with the complete `/certificates/<uuid>` URL (verified via headless print-to-PDF); browser-qa skill + doc present and repo-consistent; typecheck/lint/build pass."

Status: typecheck/lint/build recorded pass 2026-07-24 (`docs/PROJECT-STATUS.md` §Checks); the `/URI`
link-annotation proven via local headless print-to-PDF (full UUID URL). Preview visual QA at 320/768/1440
is **pending** (PR not yet opened) — the open acceptance item.

## Returned record

Begin with:

- Confirmed range: 913f6f9..223d5ea
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
Reviewed range: 913f6f9..223d5ea · Reviewed by Codex on [DATE].

The owner or builder appends this returned record to docs/code-reviews/S14-certificate-template-review.md.
Any substantive change after HEAD_SHA (`223d5ea`) invalidates approval and requires updated checks, a
refreshed Preview, and independent review of the new immutable head. A commit that only appends this review
record may be exempt when its documentation-only scope and reviewed head are recorded.

---

## Returned review record — Codex, round 1 (2026-07-24)

- Confirmed range: 913f6f9..223d5ea
- Scope match: YES — both commits resolve, merge-base is `913f6f9eb7b712dd0f6520ef1963ce636866c99d`, reviewed/current head is `223d5ea687922473f0a81e47fd341cef193a1e7c`, and the diff contains exactly the seven expected paths.
- Files/context inspected: AGENTS.md; all seven changed files; docs/DESIGN.md, docs/SECURITY-CHECKLIST.md, docs/WORKFLOW.md, docs/QA-CHECKLIST.md; src/lib/seo/site.ts; both unchanged certificate consumer routes; .mcp.json; referenced templates and prior review precedent.
- Commands/evidence checked:
  - `git diff --name-status 913f6f9..223d5ea`: exact seven-file match.
  - `git diff --check 913f6f9..223d5ea`: pass.
  - `pnpm run typecheck`: pass. `pnpm run lint`: pass. `pnpm run build`: pass; 41 static pages generated.
  - Tests: N/A — no test script.
  - Tracked worktree diff after checks: clean. Two unrelated pre-existing untracked files excluded from the reviewed range.
  - Head-specific CI/gitleaks: not run/evidenced (PR not opened).
  - Deployed Preview QA and print-to-PDF verification: not run (no Preview URL supplied). The local link-annotation result is recorded in project documentation but was not independently reproduced on Preview.
  - Compiled CSS contains the required print variants and `--cert-corner:20mm`.
  - No dependency, lockfile, route, auth, database, migration, or environment-value change in the range.

### Finding 1
- **Severity:** Blocking
- **Location:** docs/PROJECT-STATUS.md:37,66; docs/ROADMAP.md:45,79 — S14 approval and merge gate
- **Issue:** The PR, head-specific CI/gitleaks results, deployed Preview URL, and required 320/768/1440 plus print-to-PDF evidence remain pending. The repository explicitly requires deployed Preview testing before independent approval; local green checks are insufficient.
- **Failure scenario:** If `223d5ea` is approved and merged now, a deployed-only overflow, corner collision, multi-page print, or incomplete/non-clickable PDF annotation could ship without any evidence tied to the reviewed head.
- **Suggested fix:** Open the PR, allow CI/gitleaks and Vercel deployment to complete for `223d5ea`, record the exact Preview URL and head SHA, test both certificate consumers at 320/768/1440, and verify the own-certificate PDF is one A4 landscape page with the complete clickable `/certificates/<uuid>` annotation. Then resubmit the same immutable head, or a new head if any substantive fix is needed.
- **Confidence:** high

No additional correctness, security, privacy, scope, or build findings were found. The public verify variant does not expose the URL anchor; the owned variant's new anchor is React-escaped and constrained to the trusted app origin plus an unchanged UUID-gated identifier. Applicable accessibility semantics, print utilities, governance references, and gitignore hygiene are intact.

**Verdict: REQUEST CHANGES** — mandatory head-specific CI and deployed Preview acceptance evidence is absent.
Reviewed range: 913f6f9..223d5ea · Reviewed by Codex on 2026-07-24.

### Builder note on disposition (2026-07-24)
No code finding was raised; the sole blocker is missing head-specific CI + deployed-Preview acceptance evidence — the pre-existing open acceptance item, not a defect at `223d5ea`. No substantive code fix is required, so the reviewed head **stays `223d5ea`**. Clearance path: (1) open the PR (blocked on `gh` not installed locally — open via the compare URL if needed); (2) let CI/gitleaks + Vercel Preview complete for `223d5ea`; (3) capture Preview QA — both certificate consumers at 320/768/1440 + own-certificate print-to-PDF one-page / full-clickable-`/URI` check; (4) resubmit the same immutable head `223d5ea` for approval.
