# The Singapore Way

Marketing and editorial website for *The Singapore Way* by Maher Kaddoura.

## Stack

- React 18 + TypeScript
- Vite 5
- React Router v6 (client-side routing)
- Tailwind CSS

## Local development

Requirements: Node.js 20+ and npm.

```bash
npm ci
npm run dev
```

The dev server runs on http://localhost:5000.

## Build

```bash
npm run build      # type-checks and builds to dist/
npm run preview    # serves the production build locally
```

## Deployment (Vercel)

This repo is configured for Vercel via `vercel.json`:

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- SPA fallback: all unmatched paths rewrite to `/index.html` so React Router deep links (e.g. `/blog/some-slug`) work on refresh and direct navigation.

To deploy:

1. Import the GitHub repository in the Vercel dashboard.
2. Accept the detected settings (they match `vercel.json`).
3. Deploy. Subsequent pushes to `main` will auto-deploy.

No environment variables are required for this version.

## Project structure

- `src/` — application source (pages, components, data)
- `public/assets/` — static images served as-is
- `index.html` — Vite entry HTML
- `tailwind.config.js`, `postcss.config.js` — styling config
- `vite.config.ts`, `tsconfig.json` — build/type config
- `vercel.json` — Vercel deployment config
