# QA Checklist

The two-part quality gate every branch passes before merge: Part 1 locally before the PR,
Part 2 on the deployed Preview (Vercel for this project) before independent review. Record results and the tested head SHA in the PR.

**The rule: merge only after BOTH parts pass.** Local green is necessary but not sufficient —
env inlining, auth origins, and integrations all behave differently deployed.

---

## Part 1 — LOCAL (before opening the PR)

### Build health
- [ ] Typecheck passes: `pnpm run typecheck`.
- [ ] Lint passes: `pnpm run lint`.
- [ ] Tests pass: N/A — no test script; verification = typecheck + lint + build + gitleaks secret scan in CI + deployed Preview QA.
- [ ] Production build passes: `pnpm run build` — do not skip it because dev "looks fine".

### Automated tests (proportional to the change)
- [ ] If the project has no automated suite, record the architecture-approved reason and the manual coverage used; do not silently skip behavior checks. (This project currently has no test script — the accepted verification stack is typecheck + lint + build + gitleaks in CI + deployed Preview QA; introducing a test script is an open backlog item.)
- [ ] New or changed behavior has regression coverage at the right layer: unit for logic, integration for handlers/data, and end-to-end for critical user flows.
- [ ] Auth, access, or database changes test both allowed and denied states for every affected role (here: anonymous visitor vs signed-in user — there are no other roles).

### Every touched page
- [ ] Renders without errors in the dev server AND on the production build.
- [ ] Zero console errors; no hydration warnings where the selected framework hydrates client UI (Next.js App Router client components) — open DevTools, don't assume.
- [ ] Check pages the change *could* have affected, not just the ones you edited — don't assume isolation.

### Forms (if touched)
- [ ] Client validation fires on bad input with a clear message.
- [ ] Valid submit works end-to-end, or the documented local unavailable state is honest and prevents a fake success (newsletter and contact are no-op-when-absent locally — never a fake success).
- [ ] Success state shows the approved copy; error state is handled — never a silent failure.

### Mobile viewport
- [ ] Every touched page at 320px width: no horizontal scroll, no overlap, tap targets usable.

### Accessibility
- [ ] Keyboard-only pass: logical tab order, visible focus, working skip link, and no keyboard trap in menus/dialogs.
- [ ] Forms have programmatic labels; required, error, and success states are announced and never rely on color alone.
- [ ] Headings and landmarks are meaningful; images have context-appropriate alt text (or empty alt when decorative).
- [ ] Reduced-motion mode works (Framer Motion reveals must respect `prefers-reduced-motion`); content remains usable at 200% zoom.
- [ ] An automated accessibility scan reports no serious issue on each touched page; manual checks above still apply.

### Performance
- [ ] Key touched pages meet the project's recorded performance budget. If none exists yet, record a baseline and confirm this change causes no material regression.
- [ ] Images have dimensions and appropriate sizes; no accidental large asset, font, script, or request was added.

### Content fidelity
- [ ] Every visible string matches the approved copy source VERBATIM — no paraphrasing, no "improvements". (For this site the shipped copy in the repo IS the approved baseline; copy changes go through the normal workflow.)
- [ ] Locked facts/numbers (the exact claims the site makes) read correctly wherever they appear.
- [ ] No unfilled `[placeholder]` tokens reach the DOM.

### Secrets check
- [ ] Verify the selected live env file is ignored without opening it (for example, `git check-ignore .env.local`) and is neither tracked nor staged.
- [ ] Diff scan: no live env file, keys, tokens, or connection strings; placeholder-only `.env.example` contains no real value; no secret has a public prefix.
- [ ] Stage specific files — avoid blanket `git add -A` when there is any risk of catching secrets or caches.

**Why this matters:** everything above is cheap to fix now and expensive to fix after merge.

---

## Part 2 — DEPLOYED PREVIEW (before review and merge — mandatory)

Open the PR's Preview URL. Test the deployed build, not your local one.
Record the provider, URL, and tested head SHA using [templates/VERCEL-PREVIEW-TEST-TEMPLATE.md](./templates/VERCEL-PREVIEW-TEST-TEMPLATE.md) (the supplied Vercel/equivalent record) and link it in the PR.

### Full pass of touched pages
- [ ] Every touched page on desktop: layout, images, interactions.
- [ ] Every touched page on mobile (real device or 320–390px emulation).
- [ ] No layout shift, broken images, or runtime errors.

### Deployed accessibility and performance
- [ ] Run the critical touched flow by keyboard on the Preview; focus, labels, errors, dialogs, and reduced motion behave as they did locally.
- [ ] Run the chosen accessibility scan against the deployed pages; no serious issue remains.
- [ ] Measure the key touched pages on Preview and record the result against the project's budget/baseline; investigate material regressions before merge.

### Conversion flows (three approved conversions)

This project tracks THREE approved conversions. When a change touches any of them, walk that flow end-to-end on the Preview:

- [ ] **Course enrollment** — `/signup` (or `/login`) → signed in → start the course from `/online-course` or `/courses/[slug]` → first gated lesson loads at `/courses/[slug]/learn/[lessonSlug]`.
- [ ] **Book purchase** — `/thebook` → Amazon outbound link opens the correct destination (outbound click, no backend).
- [ ] **Newsletter subscription** — newsletter form → `/api/newsletter` (Mailchimp) → real success state on Preview.
- [ ] Core forms really deliver in the Preview test environment (newsletter via `/api/newsletter`, contact via `/api/contact`). An optional integration may show only its architecture-approved unavailable state; never a fake success.

### Auth (only if the change touches auth — skip otherwise)

Concrete auth journeys for this site: `/login`, `/signup`, `/forgot-password`, `/update-password`, and the validated `?next=` redirect back to the intended gated page.

- [ ] Sign in / sign out / sign up (`/login`, `/signup`) and password reset (`/forgot-password` → `/update-password`) all work on the Preview.
- [ ] Auth email links resolve to the PREVIEW origin, never Production.
- [ ] Gated pages behave correctly per auth state (visitor vs signed-in — the only two roles): `/courses/[slug]/learn/[lessonSlug]`, `/my-learning`, `/account`, and `/learn` redirect visitors to sign-in, and the `?next=` param returns the signed-in user to the page they wanted.

### Course journeys (only if the change touches the course area — skip otherwise)
- [ ] Gated lesson: a signed-in user can open `/courses/[slug]/learn/[lessonSlug]` and progress records correctly.
- [ ] Quiz: submit works, correct/incorrect handling behaves, and progress updates.
- [ ] Certificate issue: completing the course issues the certificate at `/courses/[slug]/certificate`.
- [ ] Public verify: `/certificates/[certificateId]` verifies without signing in and exposes only safe fields.

### Links and images
- [ ] Every link on touched pages resolves — no 404s, no dead anchors.
- [ ] Images load and are not stretched or cropped wrongly.

### Regression spot-check
- [ ] Open 3–5 key UNTOUCHED pages across affected approved shells (public shell and signed-in course/player shell) and confirm no unintended chrome, console, or styling regression.

**Never do this:**
- Never merge on local checks alone.
- Never mark Preview "tested" without actually opening the URL on both viewports.
- Never wave through a Preview failure as "probably an env thing" — diagnose it or fix the env, then re-test.

---

## Recording the result

- [ ] Comment on the PR: Part 1 pass (exact commands, tests, accessibility + results) and Part 2 pass (provider, Preview URL, tested head SHA, viewports, flows, accessibility, and performance results).
- [ ] Anything found and fixed during QA gets re-tested from the top of the affected section.

Next step → independent review via [CODEX-REVIEW-PROMPT.md](./CODEX-REVIEW-PROMPT.md), then the owner merges. At launch time, [LAUNCH-CHECKLIST.md](./LAUNCH-CHECKLIST.md).
