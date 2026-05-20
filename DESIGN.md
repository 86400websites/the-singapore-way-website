# The Singapore Way — Design System

## Overview

The Singapore Way brand uses a warm, editorial visual language — serif typography, a structured red/black/white palette, and generous whitespace — to convey authority, clarity, and accessibility. The design is content-first: the framework and the book are the hero; chrome exists to guide rather than decorate.

---

## Colors

| Token | Value | Use |
|---|---|---|
| Brand Red | `#C8102E` | Primary CTAs, active nav, logo accent, section labels |
| Black | `#111111` | Body text, headings, nav links |
| White | `#FFFFFF` | Page backgrounds, card surfaces |
| Off-white | `#F5F5F5` | Alternate section backgrounds |
| Hero Warm | `#fbf5f2` | Homepage hero section background |
| Mid Gray | `#666666` | Secondary/supporting body text |
| Light Gray | `#E5E5E5` | Borders, dividers |

---

## Typography

### Font Family

**Libre Baskerville** is the site's single typeface. It is a classical serif face with strong contrast between thick and thin strokes, lending editorial credibility and warmth. It is loaded from Google Fonts in weights 400 (regular), 400 italic, and 700 (bold).

```
https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap
```

Fallback stack: `Georgia, 'Times New Roman', serif`

### Weights in Use

| Weight | Usage |
|---|---|
| 400 Regular | Body text, paragraph copy, captions, form labels |
| 400 Italic | Pull quotes, emphasized inline text |
| 700 Bold | All headings (h1–h6), buttons, navigation links, section labels |

### Type Scale & Defaults

| Role | Size | Weight | Line Height | Notes |
|---|---|---|---|---|
| Body | 17px (base) | 400 | 1.6 | Set on `<body>`; comfortable reading rhythm for editorial content |
| h1 | 3.75rem → 4rem (responsive) | 700 | 1.08 | Homepage hero title |
| h2 | 1.5rem → 2rem (responsive) | 700 | 1.2 | Section headings |
| h3 | 1.125rem → 1.25rem | 700 | 1.3 | Card titles, subsection headings |
| Small labels | 11–12px | 700 | — | Uppercase section category tags only |
| Buttons | 13px | 700 | — | Rounded pill CTAs |
| Nav links | 14px | 400–700 | — | Tailwind default; bold for active/primary |

### All-Caps Policy

All-caps is **only** used for small section category labels (e.g., blog post tags like `GOVERNANCE`, `ECONOMICS`). It is not used for headings, navigation, buttons, or general body copy. These labels are set at 11–12px with tracked letter-spacing to remain legible at small size.

### Letter Spacing

- Headings: `-0.01em` (slight tightening for serif at display sizes)
- Body: `0` (default, no tracking modification)
- Small uppercase labels: `0.05em` to `0.08em` (opens up well at small size)

---

## Layout

- Max content width: `max-w-7xl` (80rem / 1280px) with `px-5 sm:px-6 lg:px-8` gutters
- Section vertical rhythm: `py-16 sm:py-20 lg:py-24`
- Hero grid: 12-column at desktop, stacked single-column on mobile

---

## Buttons

All buttons use Libre Baskerville 700 Bold.

| Variant | Background | Text | Shape |
|---|---|---|---|
| Primary | `#C8102E` | White | `rounded-full`, pill |
| Secondary / Outline | Transparent | `#111111` | `rounded-full` with border |
| Dark CTA | `#111111` | White | `rounded-full` |

Hover states darken the background by one step (`#a50d26` for red, `#333` for black).

---

## Navigation

- Font: Libre Baskerville, 14px, weight 400 for links, 700 for the active/highlighted item
- Logo: SVG/PNG mark at top-left
- Desktop: horizontal link row with dropdown menus; red pill CTA at far right ("Online Course")
- Mobile: hamburger menu

---

## Imagery

- Hero: square illustration blending into the `#fbf5f2` hero background
- Book cover: displayed prominently on `/thebook`
- Blog thumbnails: 4:3 editorial illustrations
- Author photo: black-and-white portrait on `/about`

---

## Do's and Don'ts

### Do
- Use Libre Baskerville 700 for every heading, button, and nav element.
- Use Libre Baskerville 400 for all body text.
- Reserve `#C8102E` (brand red) for primary CTAs, the logo accent, and active state indicators only.
- Keep body line-height at 1.6 for comfortable editorial reading.
- Use all-caps only for small section category labels.

### Don't
- Don't use Inter or any sans-serif typeface.
- Don't use all-caps for headings, navigation, or buttons.
- Don't add font weights other than 400 and 700 (semibold/500/600 are not loaded and will fall back).
- Don't reduce body font size below 16px.
- Don't introduce new typefaces or icon fonts without updating this document.
