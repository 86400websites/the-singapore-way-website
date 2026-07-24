# PROJECT-STATUS.md — Where the Build Stands

The living tracker for **The Singapore Way**. Any fresh session — AI or human — reads this file **first** to know exactly where the build stands and what to do next. It holds state, not plans: scope and exit gates live in [`ROADMAP.md`](./ROADMAP.md); process lives in [`WORKFLOW.md`](./WORKFLOW.md).

## 1. Right now

| Item | Value |
|---|---|
| Current stage | Post-launch |
| Active sprint | *(none — S14 merged; promote the next sprint from the backlog)* |
| Current branch | `main` (S14 merged and deleted; this bookkeeping rides `claude/s14-close-docs`) |
| Next action | Promote the next backlog sprint (lead candidate: `request-origin.ts` hardening → real-domain migration to `thesingaporeway.com`, D-1). — *Done:* S14 merged (PR #17, `217c09f`, 2026-07-24); Production smoke passed read-only (site 200; new certificate template live and rendering on the public verify page; verify variant shows the badge and exposes no URL/PII). |
| Preview / Production | Vercel Preview per PR / https://the-singapore-way-website.vercel.app on Vercel (custom domain `thesingaporeway.com` pending — backlog) |
| Last updated | 2026-07-24 — **S14 merged (PR #17)**: rebuilt the completion certificate to the new approved ornamental template and fixed the print-to-PDF verify-link truncation (URL is now a real `<a>`, so the printed PDF embeds a full-URL link annotation; kept one line in print). Added the browser-tools verification layer (`docs/BROWSER-TOOLS.md`, `.claude/skills/browser-qa/`, gitignore for `qa-evidence/` + `.playwright-mcp/`). Merged by owner with the deployed-Preview gate outstanding (Preview was deployment-protected; the link fix was proven via local headless print-to-PDF and the redesign confirmed live by the post-merge Production smoke). — *Prior:* 2026-07-23 — S13 merged (PR #15) |

### How to resume in a fresh AI session

1. Read this file, then the active sprint's scope + exit gate in [`ROADMAP.md`](./ROADMAP.md).
2. Read the agent-instructions file (`CLAUDE.md` / `AGENTS.md`) and the docs it points to for the task.
3. Verify the repo state yourself (package manifest, source tree, `git log`). If it disagrees with this file, report the mismatch; update this file only when the task authorizes it.
4. Work only inside the active sprint. Anything else — propose it under Open decisions or the backlog.
5. Before ending: update §1–§3 here, tick the roadmap checkboxes, and include this file in the PR.

Why this matters: this ritual makes the project session-stateless — anyone can cold-start and resume mid-sprint with zero verbal briefing.

## 2. Sprint board

Status legend: Not Started · In Progress · Blocked (say why) · Ready for Review · Approved · Done · Not Applicable (optional only; reason required).

| Sprint | Status | Branch | PR | Merged date | Notes |
|---|---|---|---|---|---|
| Setup Gate | Done | — | — | pre-SOP | Repo, protected `main`, CI + gitleaks, Vercel Previews predate SOP adoption; governing docs completed by S11 |
| Sprints 0–10 — site + course MVP | Done | various | #1–#12 | 2026-05-21 → 2026-06-09 | Pre-SOP delivery; see `git log` and [`book-course-mvp-plan.md`](./book-course-mvp-plan.md) |
| S11 — SOP docs pack migration | Done | `claude/s11-sop-docs-pack` | #13 | 2026-07-23 | Codex APPROVE at `fef6f63` (3 rounds); merged + Production smoke passed. Records: [`sprint-prompts/S11-sop-docs-pack.md`](./sprint-prompts/S11-sop-docs-pack.md), [`code-reviews/S11-sop-docs-pack-review.md`](./code-reviews/S11-sop-docs-pack-review.md) |
| S12 — Agent skills (`/close`, `/sprint-prompt`) | Done | `claude/s12-agent-skills` | #14 | 2026-07-23 | Codex APPROVE at `f9a90e1` (round 2; round 1 was REQUEST CHANGES — 4 blocking + 1 should-fix, fixed). Records: [`sprint-prompts/S12-agent-skills.md`](./sprint-prompts/S12-agent-skills.md), [`code-reviews/S12-agent-skills-review.md`](./code-reviews/S12-agent-skills-review.md) |
| S13 — Online Course Finalisation | Done | `claude/s13-online-course-finalisation` | #15 | 2026-07-23 | Final 16-video course + 5 quizzes (25 questions) + gated printable certificate; migrations 0006–0008 owner-applied + MCP-verified. Three Codex rounds — all findings fixed; **merged by owner without a recorded APPROVE** (deviation + compensating evidence in the sprint record). Records: [`sprint-prompts/S13-online-course-finalisation.md`](./sprint-prompts/S13-online-course-finalisation.md), [`code-reviews/S13-online-course-finalisation-review.md`](./code-reviews/S13-online-course-finalisation-review.md) |
| S14 — Certificate template + verify-link fix | Done | `claude/s14-certificate-template` | #17 | 2026-07-24 | New ornamental certificate template (both `own` + `verify` variants) and the print-to-PDF verify-link truncation fix (real `<a>` → full-URL PDF link annotation, one line in print). Also adds the browser-tools verification layer (`docs/BROWSER-TOOLS.md`, `browser-qa` skill, gitignore). No course/DB/route/auth changes. Codex round 1 (`223d5ea`) returned REQUEST CHANGES on the **evidence gate only** (no code findings — verify-variant PII containment, anchor injection surface, a11y, print utilities all cleared); **merged by owner with deployed-Preview QA outstanding** (Preview was Vercel-deployment-protected). Compensating evidence: link fix proven via local headless print-to-PDF (`/URI` = full UUID URL); Production smoke confirmed the redesign live + verify variant leaks no URL/PII. Deviation recorded in the sprint + review records. Records: [`sprint-prompts/S14-certificate-template.md`](./sprint-prompts/S14-certificate-template.md), [`code-reviews/S14-certificate-template-review.md`](./code-reviews/S14-certificate-template-review.md) |

Retired sprints stay in the table, struck through, with the date, reason, and where the scope moved (backlog).

## 3. Last completed work

- 2026-06-09 — Sprint 10 (pre-SOP): website report cleanups merged (PR #12); before that, premium course frontend polish (PR #11, 2026-05-30) and premium visual refresh (PR #10, 2026-05-29). The course MVP itself landed in PR #9 (2026-05-28). Access model is sign-in-only (manual enrollment retired).
- 2026-07-22 — S11: full governance migration to the SOP docs pack; no app code changed. Merged 2026-07-23 (PR #13) after Codex APPROVE; Production smoke passed.
- 2026-07-23 — S12: added the `/close` and `/sprint-prompt` Claude Code skills under `.claude/skills/`; no app code changed. Merged (PR #14).
- 2026-07-23 — S13 (merged, PR #15): replaced the sample course with the final approved content (5 modules / 16 tracker-mapped YouTube video lessons / 5 quizzes); real `youtube-nocookie.com` player + one-origin `frame-src` CSP addition; certificate redesign with name-gate (`updateLearnerName`), print support, and typographic signature; `0006` Path A migration + rewritten seed authored (owner applies by hand). Also wired the read-only Supabase MCP (`.mcp.json` + `docs/SUPABASE-MCP-SAFETY.md`) — write-refusal verified.
- 2026-07-24 — S14 (merged, PR #17): rebuilt the completion certificate (`CertificateView.tsx`) to the new approved ornamental template for both `own` + `verify` variants, and fixed the print-to-PDF verify-link truncation (verify URL is now a real `<a href>` → the printed PDF embeds a full-URL `/URI` link annotation, kept one line in print). Added the browser-tools verification layer (`docs/BROWSER-TOOLS.md`, `.claude/skills/browser-qa/`, gitignore for `qa-evidence/` + `.playwright-mcp/`). No course/DB/route/auth or name-gate change. Merged with the deployed-Preview gate outstanding (Preview deployment-protected); link fix proven via local headless print-to-PDF and the redesign confirmed live by the Production smoke.

## 4. Next sprint

- To be promoted from the post-launch backlog in [`ROADMAP.md`](./ROADMAP.md). Leading candidate: harden `src/lib/request-origin.ts` then the real-domain migration to `thesingaporeway.com` (depends on decision D-1). Brief: create from `docs/templates/SPRINT-PLAN-TEMPLATE.md` (or run `/sprint-prompt`) when promoted.

## 5. Blockers

| # | Blocker | Blocking what | Who unblocks | Since |
|---|---|---|---|---|
| — | *(none currently)* | | | |

## 6. Checks status

| Check | Last run | Result | Notes |
|---|---|---|---|
| typecheck | 2026-07-24 | pass | `pnpm run typecheck` on the S14 branch |
| lint | 2026-07-24 | pass | `pnpm run lint` on the S14 branch |
| tests | 2026-07-24 | N/A | No test script; verification = typecheck + lint + build + gitleaks CI + Preview QA (decision D-3 tracks adding tests). S14 additionally proved the verify-link fix via headless print-to-PDF (`/URI` annotation carries the full UUID URL). |
| build | 2026-07-24 | pass | `pnpm run build` on the S14 branch |
| deployed Preview | 2026-07-24 | not captured | S14 Preview was Vercel-deployment-protected (SSO wall) — visual QA not captured there. Compensated by local headless print-to-PDF (link `/URI` = full UUID URL) + a read-only **Production** smoke confirming the redesign is live and the verify variant exposes no URL/PII. |
| Production smoke | 2026-07-24 | pass (read-only) | Site 200; new certificate template live on the public verify page; verify variant shows the "Verified certificate" badge and no URL/PII. Own-page print-to-PDF click-through (needs sign-in) left to the owner's manual check. |

## 7. Locked decisions (do not reopen)

Changes require a new, explicit superseding decision by the client — never a silent edit.

| ID | Date | Decision | Decided by | Supersedes / notes |
|---|---|---|---|---|
| D-S10-a | 2026-05 (Sprint 10, pre-SOP) | Course access is **sign-in-only**: any signed-in user can take the course. Does NOT change gating of lesson content (still server-side). | Owner | Supersedes the manual-enrollment model; `course_enrollments` table is dormant |
| D-pre-a | 2026-05 (pre-SOP) | Light-mode-only design; no dark mode. | Owner | |
| D-pre-b | 2026-05 (pre-SOP) | Database changes ship as hand-applied numbered SQL in `supabase/sql/` with paired `.down.sql` (no Supabase CLI). | Owner | See [`../supabase/sql/README.md`](../supabase/sql/README.md) |
| D-pre-c | 2026-05 (pre-SOP) | pnpm only (`pnpm@10.12.1` pinned); never mix package managers. | Owner | |
| D-S11-a | 2026-07-22 | Codex is a **findings-only reviewer**; Claude Code is the sole build agent. Does NOT change who merges (the owner). | Owner | Supersedes the pre-SOP dual-builder setup (`codex/*` branches) |
| D-S11-b | 2026-07-22 | The SOP docs pack governs this repo: `CLAUDE.md`/`AGENTS.md`/`README.md` at root, all other governing docs in `docs/`. | Owner | Supersedes the ad-hoc root docs (preserved in git history) |
| D-S11-c | 2026-07-22 | Approved conversion set — all three tracked: course enrollment (sign-up → start course), book purchase (Amazon outbound), newsletter subscription. | Owner | |

## 8. Open decisions (resolve here, then propagate)

Resolved rows are stamped **RESOLVED [DATE]** (or **ACCEPTED** for consciously-taken risks) — never deleted. An accepted risk must name its compensating control and where it's tracked.

| ID | Decision needed | Options / current lean | Needed by | Status |
|---|---|---|---|---|
| D-1 | When to run the real-domain migration to `thesingaporeway.com` | After `request-origin.ts` hardening; run `LAUNCH-CHECKLIST.md` in full | Owner | Open |
| D-2 | Split Supabase into separate test + prod projects vs keep one shared project | One project currently serves all environments. **ACCEPTED 2026-07-22 as an interim risk** — compensating controls: RLS default-deny, sign-in-only writes, no destructive Preview testing against course data; split remains the lean and is tracked in the backlog | Before any risky schema work | Accepted (interim) / Open for the split |
| D-3 | Introduce an automated test suite (framework + scope) | Lean: start with a few integration tests around API handlers and course gating | Backlog promotion | Open |

## 9. Env vars record (NAMES only — never values)

| Name | Public / server-only | Feature it switches on | Set in |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public | Canonical URLs, metadata | Vercel environments + local |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase client | Vercel environments + local |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public | Supabase client | Vercel environments + local |
| `NEXT_PUBLIC_POSTHOG_KEY` | Public | PostHog analytics | Vercel environments + local |
| `NEXT_PUBLIC_POSTHOG_HOST` | Public | PostHog analytics | Vercel environments + local |
| `NEXT_PUBLIC_SENTRY_DSN` | Public | Sentry client reporting | Vercel environments + local |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public | Turnstile widget | Vercel environments + local |
| `MAILCHIMP_API_KEY` / `MAILCHIMP_SERVER_PREFIX` / `MAILCHIMP_AUDIENCE_ID` | Server-only | Newsletter (`/api/newsletter`) | Vercel environments + local |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` / `RESEND_TO_EMAIL` | Server-only | Contact form (`/api/contact`); `RESEND_TO_EMAIL` is the recipient | Vercel environments + local |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Server-only | Rate limiting on public writes | Vercel environments + local |
| `TURNSTILE_SECRET_KEY` | Server-only | Turnstile server verification | Vercel environments + local |
| `SENTRY_AUTH_TOKEN` / `SENTRY_ORG` / `SENTRY_PROJECT` | Server-only (build) | Sentry source-map upload | Vercel + CI as needed |
| `SUPABASE_SECRET_KEY` | Server-only | **Deliberately never set**; the app never reads it | Nowhere (by decision) |

**Never do this:** never record a value, key, token, or connection string in this file — names and service states only.

## 10. Known issues

The launch sprint cannot pass while this section has unresolved bugs — except deferrals the client has explicitly accepted (cite the accepting decision ID). Deferred hardening is marked **"required before scale"**.

| # | Severity | Where | Issue | Status |
|---|---|---|---|---|
| 1 | Medium | `src/lib/request-origin.ts` | Preview origin derivation falls back through request headers; needs hardening | Open — **required before the real-domain migration** (D-1) |
| 2 | Low | Supabase auth config | Stale `localhost:5000` / `localhost:5173` redirect URLs from the Replit era remain in the allow-list | Open — owner cleanup in Supabase dashboard |
| 3 | Low | `src/app/opengraph-image.tsx` | OG image text hardcodes `thesingaporeway.com` while the live domain is the vercel.app URL | Open — resolves with the real-domain migration |
| 4 | Medium | `src/lib/rate-limit.ts`, `src/lib/turnstile/verify.ts` | Abuse controls (Upstash rate limiting, Turnstile) **fail OPEN**: when their env vars are absent the code silently permits the request, with no Production guard — so a missing key disables the control in Production too. Delivery deps (Mailchimp/Resend) correctly fail closed (503). | Open — **required before scale**. Compensating control: the four abuse-control keys are set in Vercel Production, backed by the §9.3 blocking check in [`SECURITY-CHECKLIST.md`](./SECURITY-CHECKLIST.md). Code hardening (fail closed on absent abuse-control keys in Production) is a future sprint. |

## 11. Update rules

- [ ] Update this file **in the same branch/PR** as the work it describes — state and code merge atomically.
- [ ] If the sprint branch is already merged, tracker flips ride a tiny dedicated `docs/` branch.
- [ ] When code and this doc disagree, report the mismatch; correct it only within the authorized scope.
- [ ] Strike through, never delete: resolved decisions, closed blockers, and retired scope stay visible with dates.

Next step — open the active sprint in [`ROADMAP.md`](./ROADMAP.md) and run it via [`WORKFLOW.md`](./WORKFLOW.md).
