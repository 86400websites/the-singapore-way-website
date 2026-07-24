# Sprint Implementation Prompt — S14 — Certificate template + verify-link fix

> Filled from `../templates/CLAUDE-SPRINT-PROMPT-TEMPLATE.md` (UI + bug-fix hybrid). Permanent sprint record; the completion section records what shipped. This sprint was executed directly in a Claude Code session from an approved plan, not pasted from a fresh session.

~~~text
You are my senior implementation engineer for The Singapore Way website. CLAUDE.md governs this task.

## Context
The course-completion certificate needed to move to a new approved ornamental template, and a real bug
had to be fixed: the certificate is "downloaded" via window.print() -> Save as PDF, and the verify URL
was rendered as plain text (break-all, max-w-md). Long URLs wrapped to two lines, so the printed PDF
carried no usable link annotation (or a truncated one) and public verification failed even though the
URL was genuine. This sprint also lands the browser-tools verification layer (Playwright MCP + Agent
Browser guidance) in the repo so every clone carries it.

## Read first
- CLAUDE.md.
- docs/PROJECT-STATUS.md, docs/ROADMAP.md (S14 row), docs/WORKFLOW.md, docs/DESIGN.md (§6 accessibility,
  §7 + appendices), docs/SECURITY-CHECKLIST.md (§9), docs/QA-CHECKLIST.md.
- The approved certificate mockup (owner-supplied) — visual ground truth.
- src/components/course/CertificateView.tsx, src/styles/globals.css (print block), src/lib/seo/site.ts,
  and the two consumer routes (own + verify) for context.

## Sprint / Branch
- Sprint: S14 — Certificate template + verify-link fix
- Branch: claude/s14-certificate-template, created from current main (913f6f9).

## Goal
Rebuild CertificateView to the approved ornamental mockup (red corner motifs + sunburst rays, flanked
eyebrows, "proudly presented to" copy, red serif course title, 3-column footer with rule separators,
centred-circle divider) for BOTH variants (learner own + public verify), and fix the print-to-PDF verify
link so the printed PDF embeds a genuine full-URL link annotation. Exit: certificate matches the mockup
at 320/768/1440 with no 320px overflow and prints on one A4 landscape page; the printed PDF carries a
real /URI annotation with the complete /certificates/<uuid> URL; browser-qa skill + BROWSER-TOOLS doc
present and repo-consistent; typecheck/lint/build pass.

## Not this sprint
- Course content, copy facts, DB/RPC/SQL/migrations, routes, auth/middleware, and the certificate name
  gate — all untouched (the gate lives in issuance/route logic, not CertificateView).
- New fonts or binary assets — corners are inline SVG; Libre Baskerville only.
- PDF/QR libraries — the artifact stays the browser's own print-to-PDF.

## Files
Allowed to change:
- src/components/course/CertificateView.tsx (rebuilt)
- src/styles/globals.css (@media print block only)
- .gitignore (qa-evidence/, .playwright-mcp/)
- docs/BROWSER-TOOLS.md (new), .claude/skills/browser-qa/SKILL.md (new)
- docs/PROJECT-STATUS.md, docs/ROADMAP.md (add S14), plus this record + the paired review record.

## Locked inputs
- The owner-supplied approved certificate mockup (visual ground truth).
- The two supplied governance files (BROWSER-TOOLS.md doc + browser-qa skill) — adapted to real repo
  paths/sections (DESIGN.md has no §8; templates live under docs/templates/; project = "The Singapore Way").

## The link fix (bug)
- Render the verify URL as a real <a href={verifyUrl}> (print-to-PDF emits a genuine /URI link annotation
  carrying the full href), and force it onto one line in print via
  print:max-w-none print:break-normal print:whitespace-nowrap. Same print treatment on the certificate
  code. Screen keeps break-all max-w-md so it wraps cleanly at 320px.

## Safety
- Never open/read/print .env.local; env names only.
- Preserve all app behavior outside the certificate presentation; no DB/route/auth change.

## Verification
- Typecheck: pnpm run typecheck
- Lint: pnpm run lint
- Tests: N/A — no test script
- Production build: pnpm run build
- Prove the link fix concretely (headless print-to-PDF: fixed markup emits a /URI annotation with the
  full UUID URL; old markup emits none). Visual QA at 320/768/1440. Deployed-Preview evidence per
  QA-CHECKLIST Part 2 before merge.

## Git action policy
- Commit: YES
- Push: YES, to claude/s14-certificate-template only
~~~

---

## Sprint record — completion (2026-07-24)

**Status: MERGED — PR #17 (`217c09f`), 2026-07-24. Merged by owner with the deployed-Preview gate outstanding; compensating evidence recorded below.**

**Outcome:** Rebuilt `src/components/course/CertificateView.tsx` to the approved ornamental template (inline-SVG red corner fans + junction circles, double-line frame driven by a single `--cert-corner` CSS var, flanked eyebrows with the new "This certificate is proudly presented to" copy, red serif course title, 3-column footer with `hidden sm:block` vertical rule separators, centred-circle divider). Both variants render — `own` shows the verify link, `verify` keeps the green "Verified certificate" badge and never exposes the URL. Fixed the verify-link bug: the URL is now a real `<a href>` (so browser print-to-PDF embeds a genuine `/URI` link annotation carrying the complete URL) kept on one line in print via `print:whitespace-nowrap` (+ `print:max-w-none print:break-normal`); the same one-line print treatment was applied to the certificate code. `src/styles/globals.css` `@media print` block updated (`background:#FAF9F6`, `--cert-corner:20mm`, `border:none`, tightened `.print-cert-inner` padding). Added the browser-tools verification layer to the repo: `docs/BROWSER-TOOLS.md`, `.claude/skills/browser-qa/SKILL.md`, and `.gitignore` entries for `qa-evidence/` + `.playwright-mcp/`. Two on-QA refinements (title sizing; signature `whitespace-nowrap`) landed after the first render pass. No course content, DB/RPC/SQL, route, auth, or name-gate change.

**Checks:** typecheck / lint / build all pass (2026-07-24; PROJECT-STATUS §6); tests N/A. Link fix proven locally via headless Edge print-to-PDF — the fixed PDF contains `/URI (https://…/certificates/8de4bd8b-d013-4b65-9979-853632a43e20)` (complete UUID); the old-markup PDF contains no `/URI` annotation. Responsive design verified at 320/768/1440 against a faithful HTML replica of the component (real signed-in render deferred to Preview — localhost points at the shared prod Supabase, so no local signed-in QA).

**Independent review (PR: to open):** Codex round 1 at head `223d5ea` (2026-07-24) — **REQUEST CHANGES**, one Blocking finding, and it is a **process/evidence gate, not a code defect**: the PR is not open, so there is no head-specific CI/gitleaks run and no deployed-Preview acceptance evidence (320/768/1440 + print-to-PDF) tied to the reviewed head. Codex explicitly found no correctness, security, privacy, scope, or build defects — verify-variant containment, the new anchor's injection/redirect surface (React-escaped, UUID-gated, trusted same-origin), accessibility semantics, print utilities, governance-doc references, and gitignore hygiene all confirmed intact; it reproduced typecheck/lint/build green (41 static pages). Full record in [`../code-reviews/S14-certificate-template-review.md`](../code-reviews/S14-certificate-template-review.md). No substantive code fix is required, so the reviewed code head **stays `223d5ea`**; only documentation (this record + tracker/review bookkeeping) is added afterward.

**Merge + Production smoke (2026-07-24):** Owner merged PR #17 (`217c09f`) and deleted the branch. Post-merge read-only Production smoke passed: `https://the-singapore-way-website.vercel.app` returns 200; the new ornamental certificate template is live and renders correctly on the public verify page (`/certificates/<uuid>`); the `verify` variant shows the green "Verified certificate" badge and exposes no URL or PII. The own-page print-to-PDF link click-through (needs sign-in) is left to the owner's manual check; the link-annotation mechanism was already proven locally.

**Deviations:**
- GitHub CLI is not installed on the build machine — the PR was opened by the owner from the pushed branch (title + body prepared by the builder).
- **Merged with the deployed-Preview gate outstanding.** Codex round 1 (`223d5ea`) returned REQUEST CHANGES, but the single Blocking finding was the missing head-specific CI + deployed-Preview evidence — a process/evidence gate, **not a code defect** (Codex explicitly cleared correctness, security, privacy, scope, and build). The Vercel Preview was deployment-protected (SSO wall) and could not be reached by automation without owner login, so 320/768/1440 Preview visual QA was not captured there. Compensating evidence: the verify-link fix was proven via local headless print-to-PDF (fixed PDF carries `/URI` with the full UUID URL; old PDF none), the responsive design was verified at 320/768/1440 against a faithful component replica, and the post-merge Production smoke confirmed the redesign live and the verify variant PII-safe. Same "merge before a fully-evidenced gate" shape as S13; recorded here and in the review record rather than silently passed.

**Learnings:** the certificate is not a generated PDF — it is an HTML component printed by the browser, so the fix belongs in markup/CSS (a real anchor + a one-line print rule), not in a PDF library. Auto-linkification of wrapped plain-text URLs is the actual failure mode; a real `<a>` is what makes print-to-PDF emit a full-URL annotation. Local signed-in QA is blocked because localhost uses the shared production Supabase — authoritative visual + PDF-click evidence must come from the deployed Preview.

**Follow-ups:**
- Owner: open the PR, let CI/gitleaks + Vercel Preview complete for `223d5ea`, capture Preview QA (both certificate routes at 320/768/1440 + own-certificate print-to-PDF one-page / full clickable `/URI`), then resubmit head `223d5ea` to Codex for approval; merge on APPROVE; run the Production smoke test (real production-host print-to-PDF click-through).
- Minor, out of scope: the screen-only `no-print` "Share this link…" helper text (`#888888`) sits ~3.4:1 on the new `#FAF9F6` sheet — below the 4.5:1 body bar and marginally worse than before; a one-line follow-up (darken to ~`#6b6b6b`) if desired.

**Next:** S14 is Done and live (PR #17). This close-out branch (`claude/s14-close-docs`) carries the tracker flips + record updates for owner merge. Owner's remaining manual check: the signed-in own-certificate print-to-PDF on Production (real-domain link click-through). Then promote the next backlog sprint — lead candidate: `request-origin.ts` hardening → real-domain migration (D-1).
