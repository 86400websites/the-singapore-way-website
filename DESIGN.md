# The Singapore Way — Design System

> **Reference companion to `tech-architecture.md`.** This document defines the visual language; the tech architecture defines the stack. AI tools, designers, and contributors should read both before adding features.

---

## Overview

The Singapore Way brand uses a warm, editorial visual language — serif typography, a structured red/black/white palette, and generous whitespace — to convey authority, clarity, and accessibility. The design is content-first: the framework and the book are the hero; chrome exists to guide rather than decorate.

The site must feel **modern, alive, and captivating** — but in an editorial register. Reference points: The New York Times feature articles, The Atlantic long-reads, Substack publication homepages. Restrained, considered, but never static or brochure-like. Motion and interaction are present but refined, never playful or bouncy.

---

## Stack Alignment

This design system is implemented on the stack defined in `tech-architecture.md`:

- **Tailwind CSS v4** — all tokens below are exposed as CSS variables in `globals.css`
- **shadcn/ui** — all components inherit brand colors/typography via the variables below
- **Framer Motion** — used for the motion patterns defined in §7
- **next/font** — loads Libre Baskerville (no `<link>` to Google Fonts)
- **next/image** — every image; never raw `<img>` tags

---

## 1. Colors

| Token | Value | Use |
|---|---|---|
| Brand Red | `#C8102E` | Primary CTAs, active nav, logo accent, section labels |
| Brand Red Hover | `#A50D26` | Hover state for red elements |
| Black | `#111111` | Body text, headings, nav links |
| Black Hover | `#333333` | Hover state for dark CTAs |
| White | `#FFFFFF` | Page backgrounds, card surfaces |
| Off-white | `#F5F5F5` | Alternate section backgrounds |
| Hero Warm | `#FBF5F2` | Homepage hero section background |
| Mid Gray | `#666666` | Secondary/supporting body text |
| Light Gray | `#E5E5E5` | Borders, dividers |

### CSS Variables (`src/styles/globals.css`)

These map our brand tokens to the variable names shadcn/ui expects, so every shadcn component is automatically on-brand.

```css
@layer base {
  :root {
    /* Brand */
    --brand-red: #C8102E;
    --brand-red-hover: #A50D26;
    --hero-warm: #FBF5F2;

    /* shadcn/ui tokens — light mode only, no dark variant */
    --background: #FFFFFF;
    --foreground: #111111;
    --card: #FFFFFF;
    --card-foreground: #111111;
    --popover: #FFFFFF;
    --popover-foreground: #111111;
    --primary: #C8102E;
    --primary-foreground: #FFFFFF;
    --secondary: #F5F5F5;
    --secondary-foreground: #111111;
    --muted: #F5F5F5;
    --muted-foreground: #666666;
    --accent: #FBF5F2;
    --accent-foreground: #111111;
    --destructive: #C8102E;
    --destructive-foreground: #FFFFFF;
    --border: #E5E5E5;
    --input: #E5E5E5;
    --ring: #C8102E;
    --radius: 9999px;     /* pill buttons — see §6 */
  }
}
```

**No dark mode.** Per the tech architecture, this site is light-mode only. Do not add a dark variant or theme toggle.

---

## 2. Typography

### Font Family

**Libre Baskerville** is the site's single typeface. Classical serif with strong stroke contrast — editorial credibility and warmth. Loaded via `next/font/google` in weights 400 (regular), 400 italic, and 700 (bold).

```ts
// src/app/layout.tsx
import { Libre_Baskerville } from "next/font/google";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-libre-baskerville",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={libreBaskerville.variable}>
      <body className="font-serif">{children}</body>
    </html>
  );
}
```

Then in `tailwind.config.ts`:
```ts
fontFamily: {
  serif: ["var(--font-libre-baskerville)", "Georgia", "Times New Roman", "serif"],
}
```

Fallback stack: `Georgia, 'Times New Roman', serif`

**Do not** load Libre Baskerville via `<link>` to Google Fonts — `next/font` is required for performance and CLS prevention (see Core Web Vitals in `tech-architecture.md`).

### Weights in Use

| Weight | Usage |
|---|---|
| 400 Regular | Body text, paragraph copy, captions, form labels |
| 400 Italic | Pull quotes, emphasized inline text |
| 700 Bold | All headings (h1–h6), buttons, navigation links, section labels |

Only 400, 400 italic, and 700 are loaded. **Do not use** 500/600/semibold — they will fall back and look broken.

### Type Scale & Defaults

| Role | Size | Weight | Line Height | Notes |
|---|---|---|---|---|
| Body | 17px (base) | 400 | 1.6 | Set on `<body>`; comfortable reading rhythm for editorial content |
| h1 | 3.75rem → 4rem (responsive) | 700 | 1.08 | Homepage hero title |
| h2 | 1.5rem → 2rem (responsive) | 700 | 1.2 | Section headings |
| h3 | 1.125rem → 1.25rem | 700 | 1.3 | Card titles, subsection headings |
| Small labels | 11–12px | 700 | — | Uppercase section category tags only |
| Buttons | 13px | 700 | — | Rounded pill CTAs |
| Nav links | 14px | 400–700 | — | Bold for active/primary |

### All-Caps Policy

All-caps is **only** used for small section category labels (e.g., blog post tags like `GOVERNANCE`, `ECONOMICS`). Not used for headings, navigation, buttons, or body copy. Set at 11–12px with tracked letter-spacing for legibility.

### Letter Spacing

- Headings: `-0.01em` (slight tightening for serif at display sizes)
- Body: `0` (default)
- Small uppercase labels: `0.05em` to `0.08em`

### Heading Hierarchy (SEO requirement)

One `<h1>` per page, matching search intent. Headings in order: h1 → h2 → h3. Never skip levels. See SEO checklist in `tech-architecture.md`.

---

## 3. Layout

- Max content width: `max-w-7xl` (80rem / 1280px) with `px-5 sm:px-6 lg:px-8` gutters
- Section vertical rhythm: `py-16 sm:py-20 lg:py-24`
- Hero grid: 12-column at desktop, stacked single-column on mobile
- All sections responsive from 320px viewport upward
- Tap targets minimum 44×44px on mobile

---

## 4. Imagery

- **All images via `next/image`.** Never use raw `<img>` tags. `priority` on above-the-fold images.
- **All images live in `/public/images/`** with descriptive filenames (`hero.jpg`, `book-cover.jpg`, `author-portrait.jpg`, `blog-thumb-1.jpg`).
- **To update an image, replace the file in place** with the same filename — no code changes needed.

### Image Roles

- **Hero:** Square illustration blending into the `#FBF5F2` hero background. 1200×1200 minimum.
- **Book cover:** Prominently displayed on `/thebook`. High-resolution (at least 1000px on the long edge).
- **Blog thumbnails:** 4:3 editorial illustrations. 1200×900.
- **Author photo:** Black-and-white portrait on `/about`. 1000×1250 (portrait orientation).
- **OG images:** 1200×630 for social sharing. Generated dynamically via `app/opengraph-image.tsx`.

### Image Hygiene

- Compress before upload (squoosh.app, TinyJPG) — target under 200KB where possible.
- Always provide meaningful `alt` text — accessibility requirement and helps image search ranking.
- Set explicit `width` and `height` on every `<Image>` to prevent layout shift (CLS).

---

## 5. Buttons

All buttons use Libre Baskerville 700 Bold and pill shape (`rounded-full`).

| Variant | Background | Text | Hover |
|---|---|---|---|
| Primary | `#C8102E` (brand red) | White | `#A50D26` |
| Dark CTA | `#111111` (black) | White | `#333333` |
| Secondary / Outline | Transparent | `#111111` | `#F5F5F5` background |

### shadcn/ui Button Customization

The default shadcn `Button` component uses a moderate `--radius`. For this brand, buttons should always be pill-shaped. Override either:
- Globally via `--radius: 9999px` (already set in §1), **or**
- Per-button via `className="rounded-full"` if you keep a smaller default radius for other components (cards, inputs, etc.)

Recommended: keep `--radius: 0.5rem` for cards/inputs and apply `rounded-full` directly on buttons via a custom button variant.

---

## 6. Navigation

- Font: Libre Baskerville, 14px, weight 400 for links, 700 for active/highlighted item
- Logo: SVG/PNG mark at top-left (lives in `/public/images/logo.svg`)
- Desktop: horizontal link row with dropdown menus; red pill CTA at far right ("Online Course")
- Mobile: hamburger menu using shadcn/ui `Sheet` component
- Active state: bold weight + red underline or red dot indicator

---

## 7. Motion

**Editorial restraint, not playful flourish.** The site must feel alive but never busy. Reference: how NYT scrolly-feature articles use motion — purposeful, smooth, slow easing.

### Allowed motion patterns

- **Scroll-triggered reveals.** Sections and content blocks fade and slide up gently as they enter the viewport. Use `whileInView` from Framer Motion.
- **Stagger reveals.** When a list, grid, or paragraph block enters, items appear in sequence with a 60–100ms stagger.
- **Page transitions.** Smooth fade (200–300ms) between routes.
- **Hover micro-interactions.** Subtle and refined:
  - Buttons: slight color darken (no scale change)
  - Links: animated underline draw
  - Cards: lift via `translate-y-[-2px]` and shadow increase
  - Images: subtle `scale(1.02)` zoom over 400ms

### Easing & Timing

- **Easing:** Use slow cubic-bezier curves like `[0.22, 1, 0.36, 1]` (smooth out). Avoid spring physics.
- **Duration:** 300–600ms for reveals. Hover states 200–300ms.
- **Distance:** Movement should be small — 16–24px of `y` translation maximum for reveals.

### Forbidden motion

- ❌ Bouncy springs, overshoot, elastic easing — feels playful, undermines editorial authority
- ❌ Dramatic scale (1.1+) on hover — feels cheap
- ❌ Excessive parallax — feels gimmicky
- ❌ Flying-in-from-the-side animations — distracting
- ❌ Auto-playing carousels — accessibility issue
- ❌ Cursor effects or magnetic buttons — wrong register for this brand

### Reusable motion primitives

Create these in `src/components/motion/` and reuse everywhere:
- `<FadeIn>` — opacity 0 → 1 on viewport entry
- `<SlideUp>` — opacity 0 + y:20 → opacity 1 + y:0
- `<Stagger>` — wraps children with staggered child variants
- `<Reveal>` — combined slide + fade for section headers

### Accessibility

- **Always respect `prefers-reduced-motion`.** Use Framer Motion's `useReducedMotion` hook. When reduced motion is requested, disable transforms and reduce to a simple opacity fade or no animation at all.
- Use `LazyMotion` with `domAnimation` to keep bundle size small (see `tech-architecture.md` performance checklist).

---

## 8. Forms

All forms use **react-hook-form + zod** (per tech architecture) with shadcn/ui form components.

- Input fields: white background, light gray border (`#E5E5E5`), 1px
- Focus state: brand red ring (`--ring: #C8102E`)
- Error state: red border + red helper text
- Labels: Libre Baskerville 400, 14px, above the input
- Required indicator: red asterisk after label
- Submit buttons: primary pill (brand red) for marketing forms (newsletter), dark CTA for transactional (contact)
- Newsletter form posts to `/api/newsletter` (Mailchimp)
- Contact form posts to `/api/contact` (Resend)

---

## 9. Accessibility (WCAG AA minimum)

- Color contrast: brand red (`#C8102E`) on white passes AA for body text and UI. Black on white passes AAA.
- Never use color alone to convey meaning (e.g., error states get a red border *and* an error message).
- All interactive elements keyboard-navigable.
- Visible focus ring on all focusable elements (use `--ring`).
- Skip-to-content link at the top of every page.
- `lang="en"` on the `<html>` tag.
- Semantic HTML: `<main>`, `<article>`, `<nav>`, `<aside>`, `<section>`, proper heading hierarchy.

---

## 10. Do's and Don'ts

### Do
- Use Libre Baskerville 700 for every heading, button, and nav element.
- Use Libre Baskerville 400 for all body text.
- Reserve `#C8102E` (brand red) for primary CTAs, the logo accent, and active state indicators only.
- Keep body line-height at 1.6 for comfortable editorial reading.
- Use all-caps only for small section category labels.
- Load fonts via `next/font` — never via `<link>` to Google Fonts.
- Use `next/image` for every image — never raw `<img>`.
- Use shadcn/ui components themed via the CSS variables in §1.
- Use Framer Motion with the restrained patterns in §7.
- Always respect `prefers-reduced-motion`.

### Don't
- Don't use Inter or any sans-serif typeface.
- Don't use all-caps for headings, navigation, or buttons.
- Don't add font weights other than 400 and 700 (semibold/500/600 are not loaded and will fall back).
- Don't reduce body font size below 16px.
- Don't introduce new typefaces or icon fonts without updating this document.
- Don't add a dark mode toggle — this site is light-only.
- Don't use bouncy/spring animations — they break the editorial register.
- Don't use raw `<img>`, `<link>` to Google Fonts, or any pattern that violates `tech-architecture.md`.
- Don't introduce a second primary color — brand red is the only accent.
