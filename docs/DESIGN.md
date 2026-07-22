# DESIGN.md — The Design System in Code

The taste contract for The Singapore Way: how the approved design decisions become code.
`docs/TECH-ARCHITECTURE.md` fixes the *mechanics*; this file fixes the *taste*. This project adopted the SOP
post-launch, so the shipped site is the approved design deliverable: the tables below are filled from the
live tokens and components in the repo; implementation never re-decides a visual question.

## 1. Binding rules (read first)

- [ ] **Mockups + approved copy are the source of truth.** The developer never invents a color, spacing value, or layout — and never rewrites approved copy. New strings (errors, labels, empty states) follow the written brand-voice rules (Appendix A).
- [ ] **Drift rule:** if a built page disagrees with its mockup, **flag it** in `docs/PROJECT-STATUS.md` → Open decisions — never silently pick one.
- [ ] **Code-wins tie-break:** where this file and the shipped tokens disagree, the code wins — update this file in the same PR.
- [ ] Locked facts/numbers the site claims are implemented verbatim and never drift through copy edits.

Post-launch note: this site is live and there are no separate mockup files — the shipped pages themselves are
the approved baseline. Copy changes go through the normal workflow (`docs/WORKFLOW.md`), never ad hoc edits.

## 2. Tokens (one source of truth in code)

All tokens live in **`src/styles/globals.css`**: raw values are defined on `:root` inside `@layer base`, and
`@theme inline` maps them to Tailwind v4 utilities (e.g. `bg-brand-red`, `text-foreground`). The legacy
`tailwind.config.js` mirrors the brand colors for older class names. Components should read tokens —
**never inline hex in markup**. A rebrand must be a one-file change.

> Honest status: parts of the shipped code predate this rule and use brand hex via Tailwind arbitrary values
> (e.g. `text-[#111111]`, `bg-[#fbf5f2]` in `src/components/PageHero.tsx` and page files). The values match
> the palette below exactly. New code should prefer the token-backed utilities; consolidation is incremental,
> not a rewrite.

**Light mode only (locked decision).** `color-scheme: light` is set in `globals.css` and
`colorScheme: 'light'` in `src/app/layout.tsx` viewport. There are no dark variants — do not add a dark mode
or theme toggle.

### Colors

| Role | Token | Hex | Contrast note |
|---|---|---|---|
| Primary action (brand red) | `--primary` / `--brand-red` | `#C8102E` | White on it ≈ 5.9:1 — passes 4.5:1 AA |
| Primary hover | `--brand-red-hover` | `#A50D26` | Hover state for red elements |
| Page background | `--background` / `--brand-white` | `#FFFFFF` | |
| Surface / card | `--card` | `#FFFFFF` | Cards separate via `#ECECEC` border + shadow, not fill (`.card-editorial`) |
| Alternate section wash | `--secondary` / `--muted` / `--brand-off-white` | `#F5F5F5` | |
| Accent (sparing) — warm hero wash | `--accent` / `--hero-warm` | `#FBF5F2` | One recorded role: homepage hero, `PageHero` `warm` variant, `.icon-block` |
| Body text / headings | `--foreground` / `--brand-black` | `#111111` | ≈ 18.9:1 on white — AAA |
| Dark CTA hover | `--brand-black-hover` | `#333333` | |
| Secondary text | `--muted-foreground` / `--brand-mid-gray` | `#666666` | ≈ 5.7:1 on white — passes AA |
| Prose body ink | `.lede` / `.prose-body` classes | `#444444` | Long-form editorial copy |
| Borders / dividers / inputs | `--border` / `--input` / `--brand-light-gray` | `#E5E5E5` | Decorative only |
| Focus ring | `--ring` | `#C8102E` | Also `.focus-ring` utility class |

Radius: base `--radius: 0.5rem` (cards, inputs). Buttons are pill-shaped via `rounded-full` baked into the
`Button` component — not via `--radius`. Brand red is the only accent color; never introduce a second.

### Type scale

| Level | Token / class | Size (fluid ok) | Weight | Line-height |
|---|---|---|---|---|
| Display / h1 (home hero — the benchmark) | `text-4xl sm:text-5xl lg:text-6xl` in `src/app/page.tsx` | 36px → 48px → 60px | 700 | 1.08 |
| Standard page h1 | `PageHero` (`src/components/PageHero.tsx`) | `text-3xl sm:text-4xl md:text-[44px] lg:text-5xl` | 700 | 1.12 |
| h2 / h3 | Tailwind utilities per section; global base rule in `globals.css` sets all headings to 700 weight, `-0.01em` tracking | h2 ≈ 1.5–2rem, h3 ≈ 1.125–1.25rem responsive | 700 | ~1.2 / ~1.3 |
| Body | `<body>` rule in `globals.css`; `.lede` / `.prose-body` for editorial prose | 17px base (prose 16–18px) — never smaller than 16px | 400 | 1.6 (prose 1.7) |
| Small / eyebrow | `.eyebrow` / `.eyebrow-muted` in `globals.css` | 11px, tracking `0.14em` | 700 | All-caps only for tracked eyebrows (see Appendix C) |
| Buttons / link-arrows | `buttonVariants` (`src/components/ui/button.tsx`), `.btn-pill`, `.link-arrow` | 13px (link-arrow 12px, tracking `0.08em`) | 700 | — |

Fonts: **Libre Baskerville is the site's only typeface** — display *and* body. Loaded via `next/font/google`
in `src/app/layout.tsx` (variable `--font-libre-baskerville`, weights 400 + 400 italic + 700,
`display: 'swap'`); never via a `<link>` to Google Fonts. Both `--font-serif` **and** `--font-sans` alias to
`var(--font-libre-baskerville), Georgia, "Times New Roman", serif` in `globals.css` and
`tailwind.config.js` — there is no separate body sans; this is deliberate. Load only 400/400i/700 — weights
500/600 are not loaded and will fall back broken. One `<h1>` per page; never skip heading levels.

### Spacing

There are no `--space-section` / `--space-card` tokens in this repo. The spacing system is a **fixed Tailwind
utility convention**, applied verbatim:

| Convention | Value | Where it lives |
|---|---|---|
| Section vertical rhythm | `py-16 sm:py-20 lg:py-24` (heroes up to `lg:py-28`; course player uses a tighter `py-10 md:py-14 lg:py-16`) | Utility classes on each `<section>` in `src/app/**/page.tsx` and `src/components/PageHero.tsx` |
| Content container | `max-w-7xl mx-auto px-5 sm:px-6 lg:px-8` | Every section wrapper (21 occurrences across the app) — generous rhythm; cramped spacing is the #1 amateur tell |
| Card chrome | `.card-editorial` / `.card-link` (`rounded-2xl`, `#ECECEC` border, hover lift + shadow); padding set per component | `@layer components` in `src/styles/globals.css` |

A new spacing pattern → follows the existing convention and is recorded here. Never invent values ad hoc.

## 3. Component register (spec → code)

One shared component per pattern — never two implementations of the same thing.
Spec source for all rows: the shipped site (approved baseline) + the tokens in §2.

| Component | Spec source | Code file | Notes |
|---|---|---|---|
| Button (primary/secondary) | shipped baseline + tokens | `src/components/ui/button.tsx` | cva variants `default`/`destructive`/`outline`/`secondary`/`ghost`/`link`; pill (`rounded-full`), 13px/700, `min-h-11`; default = `--primary` red with `hover:bg-brand-red-hover`. CSS-only twins `.btn-pill` / `.btn-pill-outline` in `globals.css` |
| Form field + errors | shipped baseline | `src/components/ui/form.tsx`, `input.tsx`, `label.tsx`, `textarea.tsx`; zod schemas in `src/lib/validation/forms.ts` | react-hook-form + zod; error = red border **and** message text (never color alone); validation messages follow brand voice |
| Card | shipped baseline | `src/components/ui/card.tsx` + `.card-editorial` / `.card-link` / `.card-thumb` / `.card-accent-top` in `globals.css` | Hover: `-translate-y-[2px]` lift + shadow, 300ms, brand easing |
| Page hero | shipped baseline | `src/components/PageHero.tsx` | Variants `light` / `warm` / `dark` / `red`; renders the page's single `<h1>` + editorial rule |
| Public shell header / footer | locked chrome | `src/components/Navigation.tsx`, `src/components/Footer.tsx` | Mounted once in `src/app/layout.tsx` — see §4. Footer hosts the newsletter form |
| Course player navigation (signed-in shell) | locked chrome | `src/components/course/LessonSidebar.tsx`, `src/components/course/LessonNav.tsx` | Inner chrome of the course player — see §4 |
| Course UI | shipped baseline | `src/components/course/` (`QuizRunner`, `MarkCompleteButton`, `MyLearningCard`, `CertificateView`, `CourseFAQ`, `LessonBody`) | Course-area patterns live here, nowhere else |
| Motion primitives | shipped baseline | `src/components/motion/Reveal.tsx`, `src/components/motion/RevealStagger.tsx` | See §5 — the only entrance-animation implementations |

## 4. Locked shell chrome

Shells approved for this site: **public + signed-in course** (access model `PUBLIC_PLUS_GATED`; no admin
shell, no roles beyond anonymous vs signed-in). Each shell has one locked navigation system:

1. **Public shell** — `Navigation` (top) + `Footer` (bottom), mounted once in `src/app/layout.tsx` around
   every route. `Navigation` is auth-aware: it reads the Supabase session client-side and swaps its
   account/sign-in controls, but its structure is identical on every page.
2. **Signed-in course shell** — the same outer chrome, plus the course player's inner chrome rendered by
   `src/app/courses/[slug]/learn/[lessonSlug]/page.tsx`: a two-column grid with `LessonSidebar`
   (module/lesson outline + progress) and `LessonNav` (prev/next) around the lesson body.

Chrome is identical on every page **within its shell** and is never redesigned per page. A transparent header
that solidifies on scroll would be a state of the public shell, not a fork. Adding or changing a shell
requires an updated sitemap/mockup and explicit client authorization, recorded as a decision.

Why this matters: public and course areas may need different navigation, but one-off page chrome is the
fastest way for a site to stop feeling like one product.

## 5. Motion rules

- Register: restrained, **entrance-only reveals** via `Reveal` and `RevealStagger`
  (`src/components/motion/`), built on Framer Motion `LazyMotion` + `domAnimation` + `strict`. Don't mix
  registers — coherence beats novelty. Editorial reference: NYT feature articles — purposeful, smooth, slow.
- Locked parameters (values from the shipped components):
  - One easing curve: `cubic-bezier(0.22, 1, 0.36, 1)` (`EASE` constant in both motion components; also the card-hover easing in `globals.css`).
  - Reveal duration default **0.55s** (stay within ~300–600ms); hover transitions 200–300ms.
  - Travel: default **y = 16px**, never more than ~24px.
  - Stagger: **0.08s** between children, 0.04s `delayChildren`; viewport `once: true`, `-10%` bottom margin.
  - Hover scale ≤ 1.02, and only on images — buttons darken color (never scale), cards lift `-2px` with a shadow increase.
- Every animation respects `prefers-reduced-motion`: both components call `useReducedMotion` and drop
  transforms to an opacity-only fade.
- Light-mode-only site: there are no theme-dependent motion or color states to design for.
- **Never do this:** no parallax, cursor effects, magnetic buttons, springs/overshoot/elastic easing,
  fly-in-from-the-side entrances, dramatic hover scale (1.1+), or auto-playing motion/carousels without
  explicit, dated client sign-off recorded as a decision ID — and exceptions can be RETIRED, recorded the
  same way.

## 6. Accessibility checklist (WCAG AA minimum)

- [ ] Contrast: 4.5:1 body text, 3:1 large text/UI — verify photo-scrim pairs on the **rendered page**, not just math. (Palette math: `#C8102E` on white ≈ 5.9:1, `#111111` on white ≈ 18.9:1, `#666666` on white ≈ 5.7:1.)
- [ ] Visible focus ring on every interactive element; fully keyboard-navigable. (Shipped: `--ring` `#C8102E`, `.focus-ring` utility, `focus-visible` rings on buttons and card links.)
- [ ] Never color alone to convey meaning (errors, badges, states).
- [ ] Semantic HTML, correct `lang` (`lang="en"` set in `src/app/layout.tsx`), skip-to-content link. **Known gap:** no skip-to-content link is implemented today — backlog candidate; do not check this item until it ships.
- [ ] Tap targets ≥ 44×44px (buttons ship `min-h-11` = 44px); no horizontal scroll from 320px up (`min-width: 320px` on `body`).
- [ ] Images use `next/image` with explicit dimensions (no layout shift); alt text conveys the image's useful context and may name a known person/event when that identification matters.

## 7. Working rules

- [ ] The **benchmark page is home (`/`)** — `src/app/page.tsx`. Every new page measures against it.
- [ ] Placeholder assets go in at the **correct aspect ratio** and are flagged — wrong-ratio placeholders lock in broken layouts. (Ratios per role in Appendix B.)
- [ ] Client master assets stay in a gitignored source folder (client cloud drive is canon); only optimized, size-budgeted outputs are committed to `public/assets/`.
- [ ] Record reverted design experiments here so they aren't retried. (None recorded yet.)
- [ ] Design changes update this file in the same PR.

Next step → build pages sprint by sprint via `docs/WORKFLOW.md`, checking each against the benchmark and this
file before the PR.

---

## Appendix A — Brand voice & visual register

Carried over from the predevelopment design system (the retired root design doc):

- Warm, editorial visual language — serif typography, structured red/black/white palette, generous
  whitespace — conveying authority, clarity, and accessibility. Content-first: the framework and the book
  are the hero; chrome guides rather than decorates.
- Register references: The New York Times feature articles, The Atlantic long-reads, Substack publication
  homepages. Modern, alive, and captivating — but restrained; never playful, bouncy, or brochure-static.
- New UI strings (errors, labels, empty states) are written in this register: plain, direct, warm.

## Appendix B — Imagery rules

- All images via `next/image` (never raw `<img>`); `priority` on above-the-fold images; explicit dimensions.
- Assets live under `public/assets/` organized by feature subfolder (`/assets/home/`, `/assets/about/`,
  `/assets/book/`, `/assets/blog/`, `/assets/logo/`, …). **To update an image, replace the file in place with
  the same filename** — no code change needed.
- Roles: hero — square illustration blending into the `#FBF5F2` wash, ≥ 1200×1200; book cover — ≥ 1000px long
  edge on `/thebook`; blog thumbnails — 4:3 editorial illustrations, 1200×900; author photo — black-and-white
  portrait, 1000×1250; OG images — 1200×630, generated by `src/app/opengraph-image.tsx`.
- Hygiene: compress before committing (target < 200KB where possible); meaningful `alt` text on everything.

## Appendix C — Typography guardrails

- All-caps is **only** for small tracked labels: `.eyebrow` (11px / 700 / `0.14em`), `.link-arrow`
  (12px / 700 / `0.08em`), and blog category tags. Never for headings, navigation labels, buttons, or body.
- Only Libre Baskerville 400, 400 italic, and 700 are loaded — 500/600/semibold will fall back and look
  broken. Do not add typefaces or icon fonts without updating this file.
- Headings track `-0.01em`; body tracks 0. Body text never drops below 16px.

## Appendix D — Forms

- Inputs: white background, `#E5E5E5` 1px border; focus = brand-red ring (`--ring`); labels 400 / 14px above
  the field; error = red border **plus** helper text.
- All forms are react-hook-form + zod (`src/lib/validation/forms.ts`) on shadcn/ui form components.
- Newsletter form (in `Footer`) posts to `/api/newsletter` (Mailchimp); contact/apply flows post to
  `/api/contact` (Resend). Both are Turnstile-protected and rate-limited server-side — form UI must surface
  their honest error states, never fake success.
