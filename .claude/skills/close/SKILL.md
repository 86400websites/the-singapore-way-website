---
name: close
description: End-of-sprint close-out for The Singapore Way — verify a branch is safe to merge and the session is safe to end. Runs typecheck/lint/build, confirms the tree is clean + pushed with no secrets, the trackers (PROJECT-STATUS + ROADMAP) are updated, the sprint + review records are saved, the security invariants the diff touches still hold, and (for DB sprints) migrations are applied + verified — then gives a single GO / NO-GO verdict. Triggers - "close the sprint", "are we safe to merge", "run close", "/close", "end the session safely", "final review before merge".
---

# Close — end-of-sprint verification & handoff (The Singapore Way)

You are the **close-out gate**. The owner runs this once, at the end of a sprint, before merging the PR and closing the session (often from mobile, in a fresh window). Your job: **verify** everything is consistent and safe, **report** a clear GO / NO-GO, and **surface** any gap with the exact fix — never auto-merge, never push beyond the task branch, never silently change code.

This is the bookend to `/sprint-prompt`: that skill *opens and records* a sprint; this one *verifies and hands off*. It does not replace the per-step gating during the sprint — it is the single final sweep.

Read, don't restate from memory — these define the gates you are checking (cite the file/section in your findings):
- `CLAUDE.md` (auto-loaded) — project rules.
- `docs/WORKFLOW.md` — §3 Local verification, §4 Pull Request, §5 Deployed Preview, §6 Independent Codex review, §7 Merge, §8 Production smoke test, **Database change protocol**, **Definition of done**.
- `docs/ROADMAP.md` — the active sprint's row + the **Universal sprint exit gate**.
- `docs/SECURITY-CHECKLIST.md` — the **Quick pre-merge gate** + §9 project-specific blocking invariants.
- `docs/PROJECT-STATUS.md` — §1 (Right now), §2 (Sprint board), §6 (Checks), §7–§8 (decisions), §10 (Known issues).

## Step 0 — work out what this sprint shipped

Before checking anything, scope the run to the actual change:
- `git branch --show-current`, `git log main..HEAD --oneline`, `git diff --stat main...HEAD`.
- From the diff, decide which sections below apply — and **when in doubt, run the section**. Triggers:
  - **Database** — whenever the diff changes *or implies* a database contract: any `supabase/sql/**` change, **or** app code that reads/writes a table, column, or RPC. A required migration can be missing from the diff — that omission is itself the finding.
  - **Public-writes / abuse controls** — whenever any public-write path can be affected: a handler under `src/app/api/`, **or a shared helper it depends on** (`src/lib/rate-limit.ts`, `src/lib/turnstile/`, `src/lib/validation/`, `src/lib/server-env.ts`, `src/lib/mailchimp/`, `src/lib/resend/`), related config, or an env contract.
  - **Copy & design** — only if UI/strings changed.
  Mark a section **N/A** only when nothing in the diff could affect it, with one line of why.

## The checklist

Run top to bottom. For each item give **PASS / FAIL / N/A** + the evidence (command output, file:line, or the owner's confirmation). Where a check depends on something you cannot see (Supabase dashboard, Vercel env, the Preview result), **ask the owner — never assume**.

### 1. Build & local checks
- `pnpm run typecheck && pnpm run lint && pnpm run build` all green. Paste any failure verbatim; do not hand-wave or skip the build.
- Tests: N/A — there is no test script; the verification set is typecheck + lint + build + the CI gitleaks scan + deployed Preview QA. Record the built route count (an unexpected ±1 flags an accidental route add/delete).

### 2. Git hygiene
- On a **task branch** (`claude/[SPRINT_ID]-slug` or `claude/fix-slug`), not `main`.
- Working tree clean (`git status` shows only intended changes).
- Branch pushed and up to date with its upstream (`git log @{u}..HEAD` is empty); no unpushed commits.
- `.env.local` untracked (`git check-ignore .env.local`); no stray untracked files that should be committed or deleted (e.g. ad-hoc review/output files).
- **Secret scan of the diff** (`git diff main...HEAD`): no keys, tokens, or connection strings; no server-only value behind a `NEXT_PUBLIC_*` name. The server-only secrets to watch: `MAILCHIMP_API_KEY`, `RESEND_API_KEY`, `UPSTASH_REDIS_REST_TOKEN`, `TURNSTILE_SECRET_KEY`, `SENTRY_AUTH_TOKEN`, `SUPABASE_SECRET_KEY` (the last is deliberately never set).

### 3. Trackers updated in this PR
- `docs/PROJECT-STATUS.md` §1 (Right now), the §2 board row for this sprint, §3 (Last completed work), and §6 (Checks) reflect what shipped and what's next.
- `docs/ROADMAP.md` — the sprint's row/checkbox is ticked; any deferral landed in the Post-launch backlog with a reason.
- If either is stale, quote the exact edit needed and **offer to make it on the task branch**.

### 4. Copy & design — only if UI / strings changed
- Any new or changed user-facing string is verbatim from the **approved baseline** (the shipped site copy is the approved source; course content per `docs/update-course-content.md`). New strings (errors, labels, empty states) follow the brand-voice rules in `docs/DESIGN.md`.
- Design values come from `docs/DESIGN.md` tokens — no inline hex or ad-hoc spacing. Locked shell chrome (public shell header/footer; signed-in course shell) is unchanged; no per-page chrome variant was invented.
- Any locked facts/numbers the site states are unchanged and identical wherever they appear.

### 5. Security invariants — only those the diff touches (SECURITY-CHECKLIST §9)
For each invariant the change could affect, confirm it holds and cite the file:
- **Course content is sign-in-only** — lesson bodies/quiz answers never reachable by an anonymous user via UI, RPC, or table read (`/courses/[slug]/learn/[lessonSlug]` redirects signed-out to `/login`; RLS denies the anon key).
- **Certificate verification leaks no PII** — `/certificates/[certificateId]` exposes only safe metadata, never email/PII.
- **Public writes** (`/api/newsletter`, `/api/contact`, `/api/mailchimp/subscribe`) are zod-validated server-side. **Delivery fails CLOSED** (missing Mailchimp/Resend key → honest 503 via `MissingServerEnvError`). **The abuse controls (Upstash rate limiting, Turnstile) fail OPEN** — `checkRateLimit`/`verifyTurnstileToken` permit the request when their keys are absent, with no Production guard — so the blocking requirement is that `TURNSTILE_SECRET_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` are set in Vercel Production. Code-level fail-closed hardening is a recorded required-before-scale gap (PROJECT-STATUS §10 #4). **Do not** describe these controls as failing closed.
- **`SUPABASE_SECRET_KEY` stays unused** — never set, never referenced in `src/` (expect zero grep hits).
- **Single shared Supabase project** — one project serves all environments (accepted risk); Preview testing must not destructively mutate course data.
- **No admin role exists.** If the diff introduces any admin surface or role, that is out of the recorded model — stop and flag it (it needs a `docs/THREAT-MODEL.md` refresh and an explicit server-side role check before release).
- **CSP / headers** — the allow-list in `next.config.ts` is unchanged, or every added origin is the narrowest one and recorded.

### 6. Database — if `supabase/sql/**` changed OR the diff implies a schema/contract change (WORKFLOW → Database change protocol)
- **Missing-migration check first:** if application code now depends on a table, column, or RPC that no migration in the diff provides, that is a **NO-GO** — the required migration is missing (CI and the build can pass while Production fails against the existing schema).
- Every **numbered migration** (`supabase/sql/NNNN_*.sql`) has a matching `*.down.sql`. The seed `seed-the-singapore-way.sql` is exempt — its rollback is the separately documented operation in `supabase/sql/README.md`, not a paired down file; validate seed rollback against that README. RLS **default-deny** on every new user-reachable table; every `SECURITY DEFINER` function hardened (pinned `search_path`, fully-qualified identifiers, session authorization via `auth.uid()` — never trusting arguments, narrow returns, `revoke execute from public, anon` then `grant` to the intended role only).
- Migrations are hand-applied by the owner via the Supabase dashboard SQL Editor in the order given by `supabase/sql/README.md` (no CLI). **Ask the owner to confirm** they were applied to the shared project and verified per role. You cannot reach the Supabase dashboard — do not assume; if unconfirmed for a destructive/data-changing migration, this is a NO-GO. Note plainly: a down migration reverses compatible schema; it does not restore lost data, and there is no separate non-prod database to rehearse on (single-project risk).

### 7. Sprint & review records
- `docs/sprint-prompts/<id>-<slug>.md` exists for this sprint. If not: prompt **"run `/sprint-prompt save`"** (or offer to draft it).
- `docs/code-reviews/<id>-<slug>-review.md` exists and holds the returned Codex verdict for the reviewed head (or clearly states review is still pending). A commit that only appends the returned review record is documentation-only and exempt from re-review when the reviewed head and scope are recorded.

### 8. Preview (owner-confirmed)
- Remind the owner to confirm the **Vercel Preview** was tested per WORKFLOW §5 (desktop + 320px; if auth changed: sign-in/up/reset + email links resolve to the Preview origin, never Production; forms behave or show their honest no-op). Record it with `docs/templates/VERCEL-PREVIEW-TEST-TEMPLATE.md`.
- Note: the Preview may sit behind Vercel deployment protection (redirects to Vercel Login) — the owner must be logged into Vercel to click through it. For docs/SQL-only sprints, the Preview shows the unchanged site and the real artifact is the docs/SQL + verification results.

## Output — a single verdict

End with one of:
- **✅ GO — safe to merge & close.** One line per applicable check that passed, plus the post-merge reminders: the owner merges PR, deletes the branch, runs the Production smoke test (WORKFLOW §8), then `/sprint-prompt save` if the record is not yet written; next sprint per ROADMAP.
- **❌ NO-GO.** List each blocking gap with the exact fix; offer to do the ones you safely can (trackers, sprint/review record, doc accuracy) on the task branch now. The owner still performs the merge.

## Never
- Never merge, never push beyond the task branch, never skip hooks/CI. Commit/push only when the sprint's task prompt authorized it (default NO).
- Never auto-fix code or security findings silently — report them and fix only what the owner approves.
- Never assume dashboard-only state (Supabase apply/verify, Vercel env, Preview result) — ask the owner.
- Never restate the gate docs from memory — read them and cite the file/section.
