# The Singapore Way

## Project Overview
An educational/editorial brand website for "The Singapore Way" — a platform built around the book by Maher Kaddoura that provides a practical framework for national and local transformation, rooted in Singapore's proven principles.

## Stack
- React 18 + TypeScript + Vite (frontend)
- React Router v6 (routing)
- Tailwind CSS (styling)
- No backend, auth, or payments in this first version

## Pages / Routes
| Route | Page |
|-------|------|
| `/` | Home |
| `/thebook` | The Book |
| `/learn` | Learn |
| `/apply` | Apply |
| `/teach` | Teach |
| `/ideate` | Ideate |
| `/about` | About |
| `/blog` | Blog |
| `/blog/:slug` | Blog Post |
| `/online-course` | Online Course (Coming Soon) |
| `/podcasts` | Podcast |
| `/localization-kits` | Localization Kits |
| `/possibilities` | Examples / Possibilities |
| `/teaching-materials` | Teaching Materials / Case Studies |
| `/q-a` | Q&A |

## Brand
- Red: `#C8102E`
- Black: `#111111`
- White: `#FFFFFF`
- Gray: `#F5F5F5`
- Font: Inter (Google Fonts)

## Key Copy
- Tagline: "Don't borrow the fruit. Borrow the root." — Maher Kaddoura
- Author: Maher Kaddoura (former Accenture consultant, NUS Advisory Board)
- Contact: info@thesingaporeway.com

## Asset Locations
- Logo: `/public/assets/logo/`
- Home images: `/public/assets/home/`
- Book images: `/public/assets/book/`
- Learn images: `/public/assets/learn/`
- Apply images: `/public/assets/apply/`
- Teach images: `/public/assets/teach/`
- About images: `/public/assets/about/`
- Blog images: `/public/assets/blog/` (post-1.png through post-8.png)
- Source assets: `/assets/` (original)

## Running Locally
```bash
npm run dev
```
Runs on port 3000.

## User Preferences
- All 13+ routes must be built and routable
- No auth, payments, or backend in first version
- Use local assets (no external image URLs)
- Brand-consistent: red/black/white palette, Inter font
- Content sourced from scraped Wix site copy
