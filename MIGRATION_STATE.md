# Migration State

## Current branch
codex/migrate-next15-architecture

## Source files read
- tech-architecture.md
- DESIGN.md
- AGENTS.md
- CLAUDE.md
- WORKFLOW.md
- README.md
- threat_model.md
- package.json
- package-lock.json presence
- .env.example
- index.html
- vite.config.ts
- vercel.json
- tsconfig.json
- tailwind.config.js
- postcss.config.js
- src/main.tsx
- src/App.tsx
- src/index.css
- src/pages/*.tsx
- src/components/*.tsx
- src/lib/*.ts and src/lib/*.tsx
- src/data/blogPosts.ts
- public/assets/** inventory
- assets/** inventory
- Content and Copy/** inventory, sitemap-discovered.md, scrape-notes.md, link-map.md, assets-discovered.md
- main pages/** inventory

## Current stack detected
The current app is a React 18 single-page app built with Vite 5 and TypeScript. Routing is handled by react-router-dom v6 inside src/App.tsx. Styling uses Tailwind CSS v3 plus custom classes in src/index.css. Static images are served from public/assets and referenced by string paths such as /assets/home/framework.png. The app currently has a browser-only Supabase auth client using VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.

The repository uses npm today: package-lock.json is present, package.json scripts call vite/tsc directly, and vercel.json runs npm run build with framework "vite" and outputDirectory "dist".

Phase 2 status update: package scripts now target Next.js through pnpm. The legacy React Router app still exists for migration reference, but its page files were moved from `src/pages` to `src/legacy-pages` so Next does not treat them as Pages Router routes.

Phase 3 status update: Tailwind CSS v4 is now installed and wired into the Next App Router through `src/styles/globals.css` and `@tailwindcss/postcss`.

Phase 4 status update: shadcn/ui foundation metadata, aliases, utility helper, starter UI component, and required support dependencies are now present. No routes import the new UI component yet.

Phase 5 status update: DESIGN.md light-only tokens, Tailwind v4 theme mappings, Libre Baskerville via `next/font`, global editorial typography defaults, and brand-aligned starter button styling are now present.

Phase 6 status update (Slice A): App Router Navigation and Footer client components, root layout shell (Navigation + main + Footer), and the real homepage have been migrated. Legacy Navigation/Footer/ScrollToTop moved to `src/legacy-components/` and are still imported by the legacy `src/App.tsx` for migration reference only.

Phase 6 status update (Slice B): Six top-level marketing routes — `/thebook`, `/learn`, `/apply`, `/teach`, `/ideate`, `/about` — are now served by the Next App Router. The legacy `src/components/PageHero.tsx` is shared (as a Server Component) by the new pages and the legacy SPA reference. Legacy editorial primitive classes (`eyebrow`, `eyebrow-muted`, `lede`, `prose-body`, `editorial-rule`, `card-editorial`, `icon-block`, `btn-pill`, `btn-pill-outline`) were ported from `src/index.css` into `src/styles/globals.css` inside `@layer components` so the migrated pages render with the same visual system.

Phase 6 status update (Slice C): The remaining six static marketing routes — `/online-course`, `/podcasts`, `/localization-kits`, `/possibilities`, `/teaching-materials`, `/q-a` — are now served by the Next App Router. `src/components/RequestModal.tsx` now carries `"use client"` so it can be shared by App Router client pages and the legacy SPA reference simultaneously. All static marketing surface area is now App Router-native; only the data-driven blog (`/blog`, `/blog/[slug]`) and auth surfaces remain in `src/legacy-pages/`.

Phase 6 status update (Slice D): `/blog` and `/blog/[slug]` are now served by the Next App Router as Server Components. `generateStaticParams` enumerates all 15 slugs from `src/data/blogPosts.ts` so each post prerenders at build time as SSG (`●`). The legacy editorial 404 panel is preserved for unknown slugs (dynamicParams left at default to match legacy SPA behavior). Only the auth surfaces (`/login`, `/signup`, `/forgot-password`, `/update-password`, `/account`) now remain in `src/legacy-pages/`.

Phase 7 status update: Repo cleanup pass — deleted all reference / build-helper folders that were used to scaffold the migration but are not part of the running website, plus the orphaned Vite SPA scaffolding. Public asset paths and runtime behavior are unchanged. `<img>` → `next/image` migration and `/public/assets/` → `/public/images/` move were deliberately deferred to a later Phase 7b.

Phase 8 status update: Supabase SSR foundation and App Router auth routes are complete. `@supabase/ssr` is installed; browser/server Supabase clients, middleware session refresh, shared auth error classification, safe redirect handling, and `/login`, `/signup`, `/forgot-password`, `/update-password`, `/account` App Router pages compile and build. A disposable Supabase user was created through the public auth API with explicit user permission, bad-credentials handling returned an auth error, sign-up returned an active session, and signed-in `/account` rendered via cookie-backed SSR. Legacy auth files, Vite scaffolding types, and Vite/React Router dependencies were removed after verification.

Phase 7b status update: Raw `<img>` tags in active App Router pages and shared components were migrated to `next/image` while preserving every existing `/assets/...` public URL. No public assets were moved or deleted, and no redirects were added. `corepack pnpm run typecheck` and `corepack pnpm run build` pass after the image migration.

Phase 9 status update: Forms foundation is installed and wired. Added `react-hook-form`, `@hookform/resolvers`, `zod`, and `@radix-ui/react-label`; added shadcn-style form/input/textarea/label primitives; added shared zod schemas under `src/lib/validation/forms.ts`; migrated the low-risk newsletter footer and request modal to `react-hook-form` + zod without adding route handlers or email delivery. `corepack pnpm run typecheck` and `corepack pnpm run build` pass.

Phase 10 status update: Newsletter and request/contact route handlers are wired server-side. Added Mailchimp and Resend dependencies, server-only env placeholders in `.env.example`, `/api/newsletter` and `/api/contact` route handlers, Mailchimp/Resend helper modules, and client form submission states in the existing footer newsletter form and request modal. Provider keys remain server-only; no `.env.local` values were read or printed. `corepack pnpm run typecheck` and `corepack pnpm run build` pass.

Phase 11 status update: PostHog and Sentry safe-placeholder integration is in place. Added `@sentry/nextjs`, `posthog-js`, and `posthog-node`. Created `instrumentation.ts` + `instrumentation-client.ts` + `sentry.server.config.ts` + `sentry.edge.config.ts` + `src/app/global-error.tsx` + `src/lib/posthog/{client,server}.ts`. Converted `src/app/providers.tsx` to a Client Component that conditionally mounts `<PostHogProvider>`. Wrapped `next.config.ts` with `withSentryConfig`. Every integration no-ops when the corresponding env var is missing — the app builds and runs locally without Sentry/PostHog keys. `.env.example` documents `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`. `corepack pnpm run typecheck` and `corepack pnpm run build` pass; the build also successfully uploaded source maps to the configured Sentry project on the verification run.

Phase 12 status update: SEO foundation is in place. Added `NEXT_PUBLIC_SITE_URL` to `.env.example`. Added `src/lib/seo/site.ts` (constants) and `src/lib/seo/page-metadata.ts` (per-page helper). Updated `src/app/layout.tsx` with `metadataBase`, `title.template`, default OpenGraph + Twitter cards, light-only `viewport`, and a JSON-LD `Organization` schema in `<head>`. Added `src/app/sitemap.ts` (14 marketing routes + 15 blog slugs), `src/app/robots.ts` (allow all, disallow `/api/` and auth routes, point to sitemap), and `src/app/opengraph-image.tsx` (edge-runtime 1200×630 dynamic OG using brand red + Libre Baskerville). Added unique title + description + canonical + OG/Twitter to every marketing route, refactored the six `"use client"` pages (`/ideate`, `/podcasts`, `/localization-kits`, `/possibilities`, `/teaching-materials`, `/q-a`) into Server Component wrappers + sibling `*Client.tsx` children so each can export `metadata`. Added `generateMetadata` to `/blog/[slug]/page.tsx` for per-post titles/descriptions. Added `robots: { index: false, follow: false }` to all five auth pages. `corepack pnpm run typecheck` and `corepack pnpm run build` pass; build now emits 37 routes including `/sitemap.xml`, `/robots.txt`, and `/opengraph-image`. Public URLs, copy, and visible behavior are unchanged.

Phase 13 status update: Security headers, rate limiting, Cloudflare Turnstile, and CI are in place — every integration follows the safe-placeholder pattern (no-op when env vars are absent). Added security headers + a starter Content-Security-Policy to `next.config.ts` via `async headers()` (X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, HSTS 2y preload, Permissions-Policy deny camera/microphone/geolocation/interest-cohort, and a CSP that allows `'self'` plus Supabase, PostHog, Sentry, Cloudflare Turnstile, Wixstatic media, and the Railway-hosted Ideate iframe). Added `@upstash/ratelimit` + `@upstash/redis` and `src/lib/rate-limit.ts` (5 req/min sliding window per IP, no-op when Upstash env vars are missing); wired into `/api/newsletter` and `/api/contact` returning 429 with `Retry-After` on exceedance. Added Cloudflare Turnstile: `src/components/TurnstileWidget.tsx` (client widget, renders nothing when sitekey absent, theme-aware for the dark Footer vs light RequestModal) and `src/lib/turnstile/verify.ts` (server verification, no-op when `TURNSTILE_SECRET_KEY` absent). Wired the widget into Footer newsletter and RequestModal; submit buttons disable until a token is captured when Turnstile is configured. Added `.github/workflows/ci.yml` running `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm build` on pull requests and pushes to main, plus a separate `gitleaks-action` job. `.env.example` documents `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, and `TURNSTILE_SECRET_KEY`. `corepack pnpm run typecheck` and `corepack pnpm run build` pass; build still emits all 37 routes with essentially unchanged per-route sizes (the Turnstile CDN script only loads when a sitekey is configured).

Phase 14 status update: End-to-end verification of the complete migration. Clean install (`pnpm install --frozen-lockfile`), typecheck, and build all pass from a fresh `.next/` state. Production server (`pnpm start`) smoke-tested: all 14 marketing pages, both blog routes, `/sitemap.xml`, `/robots.txt`, and `/opengraph-image` return 200; `/account` returns 307 to `/login?next=/account` when unauthenticated; all four public auth pages return 200; both API routes correctly return 400 on bad zod payload and reach Mailchimp/Resend on valid payload. All six security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, HSTS, Permissions-Policy, Content-Security-Policy) ship on both static and API routes. Sitemap contains the expected 29 URLs. Robots.txt allows root and disallows `/api/` + all five auth surfaces. `.env.local` is gitignored and was never committed; tracked files contain no high-risk secret patterns (Supabase service-role, Stripe live keys, SendGrid, AWS access keys, etc.). Verification surfaced and fixed two real bugs from earlier phases: (1) Phase 12 OG image used `display: 'inline-block'` which Satori rejects — changed to `display: 'flex'`; (2) Phase 11 Sentry client SDK now requires exporting `onRouterTransitionStart` from `instrumentation-client.ts` — added. Decision on the discovered-but-unimplemented routes (`/post/[slug]`, `/quick-bites`, `/thank-you`, `/user-dashboard`, `/ar`, `/ar/*`): all documented as out of scope for launch with no redirect (rationale + override path in the Phase 14 handoff snapshot below). Phase 15 (final migration report) is the only remaining phase.

Phase 15 status update: Final migration report shipped at [`MIGRATION_REPORT.md`](./MIGRATION_REPORT.md). It is the owner-facing canonical summary — TL;DR, starting state, ending state, per-phase deliverables (cross-linking the handoff snapshots in this file), bugs caught during verification, deferred items, files/folders removed, dependencies removed, acknowledgements (Codex + Claude), and the compact pre-launch checklist. No code changes. Migration is complete; only the pre-launch platform configuration remains, and that is documented in both this file and `MIGRATION_REPORT.md`.

Review-polish pass status update: Small targeted cleanup after the independent review. Removed the stale `./index.html` entry from `tailwind.config.js` (file no longer exists). Dropped the dead `interest-cohort=()` directive from Permissions-Policy in `next.config.ts` (FLoC was retired). Added `installCommand: pnpm install --frozen-lockfile` to `vercel.json` to match CI exactly. Swept all 5 uses of `font-extrabold` in `src/app/page.tsx` to `font-bold` so the rendered weight matches the 400/700 weights actually loaded by `next/font`. Added a 32×32 brand-red `src/app/favicon.ico` so legacy crawlers and link previewers stop 404-ing. Added `isSupabaseConfigured()` to both `src/lib/supabase/{client,server}.ts` and a new shared `<AuthUnavailableNotice />` component; wired the early-return check into all 5 auth pages (`/login`, `/signup`, `/forgot-password`, `/update-password`, `/account`) so Vercel Preview without Supabase env now renders a graceful notice instead of 500. Set up ESLint properly with the Next 16 flat-config convention: `eslint` ^9 + `eslint-config-next` ^16, `eslint.config.mjs` composing `next/core-web-vitals` + `next/typescript`, `pnpm run lint` script, and a CI `Lint` step between typecheck and build. `react/no-unescaped-entities` is project-wide off (editorial copy uses straight quotes consistently — escaping every apostrophe would be a no-op rendering change with a huge diff); `import/no-anonymous-default-export` is off for config files. The new `react-hooks/set-state-in-effect` rule surfaced a real (but benign) Phase 13 issue in `TurnstileWidget` — fixed by replacing the post-mount `useEffect` with a `useState` lazy initializer that seeds from `window.turnstile` at first render. `pnpm install --frozen-lockfile`, `pnpm run lint`, `pnpm run typecheck`, `pnpm run build` all pass; route count is now 38 (added `favicon.ico`).

## Target architecture
The locked target from tech-architecture.md is:
- Next.js 15 with App Router
- TypeScript strict mode
- pnpm as package manager
- Tailwind CSS v4
- shadcn/ui
- Framer Motion
- react-hook-form plus zod
- lucide-react
- Supabase with @supabase/ssr split browser/server clients
- Mailchimp for marketing/newsletter email through server route handlers
- Resend for transactional email through server route handlers
- PostHog analytics/session replay
- Sentry error tracking
- Vercel hosting
- GitHub source control and PR workflow

Expected app shape includes src/app/layout.tsx, page.tsx route files, route handlers under src/app/api, providers, sitemap.ts, robots.ts, opengraph-image.tsx, instrumentation.ts, Sentry config files, src/components/ui, src/components/motion, src/lib/supabase/client.ts, src/lib/supabase/server.ts, validation schemas, and src/styles/globals.css.

## Target design system
The locked design system from DESIGN.md is a light-only editorial brand system:
- Libre Baskerville loaded with next/font, weights 400, 400 italic, and 700 only
- Brand red #C8102E, red hover #A50D26, black #111111, white #FFFFFF, off-white #F5F5F5, hero warm #FBF5F2, mid gray #666666, light gray #E5E5E5
- Tailwind v4 and shadcn/ui tokens exposed as CSS variables in globals.css
- max-w-7xl layout, px-5 sm:px-6 lg:px-8 gutters, generous section rhythm
- pill buttons, restrained editorial cards, active nav styling, mobile Sheet nav
- next/image for all images, no raw img tags
- Framer Motion primitives in src/components/motion with restrained reveal, stagger, and hover patterns
- Forms built with react-hook-form, zod, and shadcn/ui form components
- Light mode only, no dark mode toggle

## Route map
Current React route -> target Next.js App Router destination:

- / -> src/app/page.tsx
- /thebook -> src/app/thebook/page.tsx
- /learn -> src/app/learn/page.tsx
- /apply -> src/app/apply/page.tsx
- /teach -> src/app/teach/page.tsx
- /ideate -> src/app/ideate/page.tsx
- /about -> src/app/about/page.tsx
- /blog -> src/app/blog/page.tsx
- /blog/:slug -> src/app/blog/[slug]/page.tsx
- /online-course -> src/app/online-course/page.tsx
- /podcasts -> src/app/podcasts/page.tsx
- /localization-kits -> src/app/localization-kits/page.tsx
- /possibilities -> src/app/possibilities/page.tsx
- /teaching-materials -> src/app/teaching-materials/page.tsx
- /q-a -> src/app/q-a/page.tsx
- /login -> src/app/login/page.tsx
- /signup -> src/app/signup/page.tsx
- /forgot-password -> src/app/forgot-password/page.tsx
- /update-password -> src/app/update-password/page.tsx
- /account -> src/app/account/page.tsx, protected by server/client auth guard preserving existing behavior

Routes found in Content and Copy but not currently implemented in src/App.tsx need explicit migration decisions before changing public URLs:
- /post/[slug]
- /quick-bites
- /thank-you
- /user-dashboard
- /ar and /ar/*

These should either be implemented, redirected with approved 301 rules, or documented as intentionally out of scope. Do not silently remove or change them.

## Asset map
Current asset folders and recommended targets:

- public/assets/logo/* -> public/images/logo/*, or keep /assets/logo/* until redirects/references are approved
- public/assets/home/* -> public/images/home/*
- public/assets/book/* -> public/images/book/*
- public/assets/learn/* -> public/images/learn/*
- public/assets/apply/* -> public/images/apply/*
- public/assets/teach/* -> public/images/teach/*
- public/assets/about/* -> public/images/about/*
- public/assets/blog/* -> public/images/blog/*
- assets/0. Logo/* -> source/reference originals; do not delete
- assets/1. Home Page Images/* -> source/reference originals; do not delete
- assets/2. The Book Images/* -> source/reference originals; do not delete
- assets/3. Learn Page Images/* -> source/reference originals; do not delete
- assets/4. Apply Page Images/* -> source/reference originals; do not delete
- assets/5. Teach Page Images/* -> source/reference originals; do not delete
- assets/7. About Page Images/* -> source/reference originals; do not delete
- assets/Blog Images/* -> source/reference originals; do not delete
- main pages/*.png -> visual reference screenshots; do not delete

The target architecture prefers /public/images, but public URLs must not be changed without approval. A safe migration can initially keep /public/assets paths and later move to /public/images only with redirects or deliberate approval.

## Supabase/auth notes
Current Supabase usage is browser-only:
- src/lib/supabase.ts creates a @supabase/supabase-js client from import.meta.env.VITE_SUPABASE_URL and import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY.
- AuthContext manages getSession, onAuthStateChange, signInWithPassword, signUp, resetPasswordForEmail, updateUser, and signOut.
- /account is protected by ProtectedRoute.
- Login redirects only to safe same-origin relative paths from location.state.
- Password reset currently redirects to /update-password.

Migration risks:
- Next.js requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY for browser use, plus server-only keys only in server contexts if needed.
- Do not expose SUPABASE_SECRET_KEY, service_role keys, sb_secret keys, database passwords, JWT secrets, or connection strings in client components.
- Auth redirect URLs may need updates in Supabase and Vercel when moving from Vite SPA to Next routes.
- Preserve existing auth behavior unless the user explicitly approves a change.
- Consider @supabase/ssr and middleware/cookie behavior carefully before replacing the current localStorage-based SPA session model.

## Completed phases
### Phase 1 - Next.js 15 App Router foundation
Completed in this phase:
- Added a minimal `src/app` App Router foundation.
- Added `src/app/layout.tsx` with an `html lang="en"` root layout and a providers wrapper.
- Added `src/app/providers.tsx` as a no-op provider boundary for future PostHog/Supabase/Sentry providers.
- Added `src/app/page.tsx` as a temporary foundation placeholder.
- Avoided `next/*` imports because Next dependencies are not installed until Phase 2.
- Did not change current Vite runtime behavior, current routes, public URLs, assets, auth behavior, package scripts, dependencies, or deployment config.

Files changed in this phase:
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/providers.tsx`
- `MIGRATION_STATE.md`

Commands run in this phase:
- `git status --short`
- `git branch --show-current`
- `npm run build` - failed initially because local dependencies were not installed and `tsc` was unavailable.
- `npm ci` - installed the current npm dependency set from `package-lock.json`.
- `npm run build` - failed in the sandbox because Vite/esbuild could not read the repository path.
- `npm run build` with approved elevated execution - passed.
- `git status --short`

Build/typecheck result:
- Current Vite build passed after dependency install and elevated rerun.
- TypeScript passed as part of `npm run build`.

Known risks:
- `src/app/page.tsx` is a temporary placeholder and must not be treated as the final migrated homepage.
- Phase 1 intentionally does not make the project runnable as Next.js yet; package migration is next.
- Existing uncommitted state remains: `DESIGN.md` modified and `tech-architecture.md` untracked were already present before Phase 1.
- `git status` emits warnings about denied access to the user-level Git ignore file at `C:\Users\Khalid Siddiqui/.config/git/ignore`; this did not block status output.

### Phase 2 - pnpm/package migration
Completed in this phase:
- Switched package scripts from Vite/npm workflow to Next.js scripts intended for pnpm:
  - `dev`: `next dev`
  - `build`: `next build`
  - `start`: `next start`
  - `typecheck`: `tsc --noEmit`
- Added `packageManager: pnpm@10.12.1`.
- Added Next.js 15 dependency and React 19 dependency range.
- Added `@types/node` and React 19 type packages.
- Generated `pnpm-lock.yaml`.
- Removed `package-lock.json` to avoid mixed package-manager lockfiles.
- Updated `vercel.json` from Vite output settings to Next.js framework settings with `pnpm run build`.
- Added a minimal `next.config.ts`.
- Let Next add required TypeScript options and generated `next-env.d.ts`.
- Added `.next/` and `tsconfig.tsbuildinfo` to `.gitignore`.
- Moved legacy React Router page files from `src/pages` to `src/legacy-pages` to avoid accidental Next Pages Router route registration.
- Updated `src/App.tsx` lazy imports to point at `src/legacy-pages`.
- Fixed a React 19 type compatibility issue in `src/legacy-pages/TeachingMaterials.tsx` by replacing the global `JSX.Element` type with `ReactNode`.
- Did not port routes, content, images, auth, forms, analytics, SEO, or public URLs in this phase.

Files changed in this phase:
- `.gitignore`
- `package.json`
- `package-lock.json` removed
- `pnpm-lock.yaml`
- `next-env.d.ts`
- `next.config.ts`
- `tsconfig.json`
- `vercel.json`
- `src/App.tsx`
- `src/pages/*` moved to `src/legacy-pages/*`
- `src/legacy-pages/TeachingMaterials.tsx`
- `MIGRATION_STATE.md`

Commands run in this phase:
- `git status --short`
- `git branch --show-current`
- `pnpm --version` - failed because `pnpm` was not on PATH.
- `node --version`
- `corepack --version`
- `corepack prepare pnpm@10.12.1 --activate` - failed in sandbox due user-level Corepack cache permissions.
- `corepack prepare pnpm@10.12.1 --activate` with approved elevated execution - passed.
- `pnpm install` - failed because `pnpm` was not on PATH in this shell.
- `corepack pnpm install` - failed in sandbox due npm registry access restrictions.
- `corepack pnpm install` with approved elevated execution - passed.
- `corepack pnpm run typecheck` - initially failed on React 19 `JSX.Element` typing in the legacy TeachingMaterials page; passed after the type-only fix.
- `corepack pnpm run build` - initially failed because Next treated `src/pages` as Pages Router routes; passed after moving legacy pages to `src/legacy-pages`.
- `git status --short`

Build/typecheck result:
- `corepack pnpm run typecheck` passes.
- `corepack pnpm run build` passes.
- Next.js build currently emits the temporary App Router `/` route from `src/app/page.tsx`; the real site routes are not migrated yet.

Known risks:
- The migrated Next build is only a temporary foundation and does not yet render the current production site content.
- `src/legacy-pages` is an intermediate holding location for the old React Router pages; route migration must port these into `src/app`.
- Legacy Vite dependencies remain temporarily because unported files still reference Vite/React Router-era types and modules.
- `corepack pnpm install` reported ignored build scripts for `esbuild` and `sharp`; the current Next build still passed.
- Existing uncommitted state remains: `DESIGN.md` modified and `tech-architecture.md` untracked were already present before these phases.
- `git status` continues to emit warnings about denied access to the user-level Git ignore file at `C:\Users\Khalid Siddiqui/.config/git/ignore`; this did not block status output.

### Phase 3 - Tailwind CSS v4 setup
Completed in this phase:
- Updated Tailwind from v3 to v4 in `package.json`.
- Added `@tailwindcss/postcss`.
- Removed the direct `autoprefixer` dependency from `package.json`.
- Updated `postcss.config.js` to use the Tailwind v4 PostCSS plugin.
- Added `src/styles/globals.css` with Tailwind v4 import.
- Loaded the existing `tailwind.config.js` from `src/styles/globals.css` via `@config` for compatibility during the migration.
- Imported `src/styles/globals.css` from `src/app/layout.tsx`.
- Regenerated `pnpm-lock.yaml`.
- Did not add shadcn/ui, design tokens, next/font, route migration, asset migration, auth changes, form wiring, analytics, SEO, or security headers in this phase.

Files changed in this phase:
- `package.json`
- `pnpm-lock.yaml`
- `postcss.config.js`
- `src/app/layout.tsx`
- `src/styles/globals.css`
- `MIGRATION_STATE.md`

Commands run in this phase:
- `git branch --show-current`
- `git status --short`
- `corepack pnpm install` - prompted for interactive node_modules reinstall confirmation and did not complete the intended update.
- `corepack pnpm install --force` - timed out in the sandbox after starting node_modules recreation.
- `corepack pnpm install --force` with approved elevated execution - passed and updated dependencies/lockfile.
- `corepack pnpm run typecheck` - passed.
- `corepack pnpm run build` - passed.
- `git status --short`

Build/typecheck result:
- `corepack pnpm run typecheck` passes.
- `corepack pnpm run build` passes.
- The Next build still renders only the temporary App Router `/` route from `src/app/page.tsx`; real route/content migration has not started.

Known risks:
- `tailwind.config.js` still reflects the legacy Tailwind v3-era configuration shape and is loaded only for compatibility. Phase 5 should replace or adapt this into the locked DESIGN.md token system.
- `src/index.css` remains as legacy Vite-era CSS and is not imported by the Next App Router.
- Legacy Vite dependencies remain temporarily because unported files still reference Vite/React Router-era modules.
- `corepack pnpm install --force` again reported ignored build scripts for `esbuild` and `sharp`; typecheck and build still passed.
- Existing uncommitted state remains: `DESIGN.md` modified and `tech-architecture.md` untracked were already present before these phases.
- `git status` continues to emit warnings about denied access to the user-level Git ignore file at `C:\Users\Khalid Siddiqui/.config/git/ignore`; this did not block status output.

### Phase 4 - shadcn/ui foundation
Completed in this phase:
- Added `components.json` with shadcn/ui configuration for the existing Tailwind v4 global CSS entry, `src/components/ui`, `src/lib/utils`, and lucide icons.
- Added the TypeScript `@/*` path alias to `tsconfig.json`.
- Added `src/lib/utils.ts` with the standard `cn` helper using `clsx` and `tailwind-merge`.
- Added a starter `src/components/ui/button.tsx` shadcn-style button primitive.
- Added the minimal runtime dependencies needed by the shadcn foundation and starter button:
  - `@radix-ui/react-slot`
  - `class-variance-authority`
  - `clsx`
  - `lucide-react`
  - `tailwind-merge`
- Regenerated `pnpm-lock.yaml`.
- Did not import the new button into any route or component.
- Did not change public routes, copy, images, auth, forms, analytics, SEO, or public URLs in this phase.

Files changed in this phase:
- `components.json`
- `package.json`
- `pnpm-lock.yaml`
- `tsconfig.json`
- `src/lib/utils.ts`
- `src/components/ui/button.tsx`
- `MIGRATION_STATE.md`

Commands run in this phase:
- `git branch --show-current`
- `git status --short`
- `corepack pnpm add @radix-ui/react-slot class-variance-authority clsx lucide-react tailwind-merge` - failed because pnpm selected a different store than the existing `node_modules`.
- `corepack pnpm add @radix-ui/react-slot class-variance-authority clsx lucide-react tailwind-merge --store-dir "C:\Users\Khalid Siddiqui\AppData\Local\pnpm\store\v10"` - failed in sandbox due npm registry access restrictions.
- `corepack pnpm add @radix-ui/react-slot class-variance-authority clsx lucide-react tailwind-merge --store-dir "C:\Users\Khalid Siddiqui\AppData\Local\pnpm\store\v10"` with approved elevated execution - passed.
- `corepack pnpm run typecheck` - passed.
- `corepack pnpm run build` - passed.
- `git status --short`

Build/typecheck result:
- `corepack pnpm run typecheck` passes.
- `corepack pnpm run build` passes.
- The Next build still renders only the temporary App Router `/` route from `src/app/page.tsx`; real route/content migration has not started.

Known risks:
- The shadcn button uses token class names such as `bg-primary`, `text-primary-foreground`, and `bg-background`; Phase 5 must define the locked DESIGN.md token system in `src/styles/globals.css`.
- The starter shadcn component is intentionally unused, so there is no user-facing behavior change yet.
- `tailwind.config.js` still reflects the legacy compatibility configuration until Phase 5.
- Legacy Vite dependencies remain temporarily because unported files still reference Vite/React Router-era modules.
- The elevated pnpm add reported ignored build scripts for `esbuild` and `sharp`; typecheck and build still passed.
- Existing uncommitted state remains: `DESIGN.md` modified and `tech-architecture.md` untracked were already present before these phases.
- `git status` continues to emit warnings about denied access to the user-level Git ignore file at `C:\Users\Khalid Siddiqui/.config/git/ignore`; this did not block status output.

### Phase 5 - DESIGN.md tokens, Libre Baskerville via next/font, light-mode-only styling
Completed in this phase:
- Loaded Libre Baskerville through `next/font/google` in `src/app/layout.tsx` with weights 400 and 700 plus normal and italic styles.
- Applied the Libre Baskerville font variable to `<html>` and App Router body defaults.
- Added DESIGN.md light-only brand variables and shadcn/ui token variables to `src/styles/globals.css`.
- Added Tailwind CSS v4 `@theme inline` mappings so utilities like `bg-background`, `text-foreground`, `bg-primary`, `border-border`, and brand color utilities resolve to the locked tokens.
- Added global base defaults for light color scheme, body font size/line height, heading weight, selection color, and form-control font inheritance.
- Updated `tailwind.config.js` font families to use `var(--font-libre-baskerville)` with the approved serif fallback stack.
- Updated the starter shadcn `Button` primitive to use pill shape, 13px text, 700 weight, 44px minimum touch target, brand red hover, and light-only token classes.
- Did not migrate routes, move assets, change public URLs, change auth behavior, wire forms, add analytics, implement SEO, or add dark mode.

Files changed in this phase:
- `src/app/layout.tsx`
- `src/styles/globals.css`
- `tailwind.config.js`
- `src/components/ui/button.tsx`
- `MIGRATION_STATE.md`

Commands run in this phase:
- `git branch --show-current`
- `git status --short`
- `corepack pnpm run typecheck` - passed.
- `corepack pnpm run build` - failed in the sandbox because `next/font` could not fetch Libre Baskerville from Google Fonts due restricted network access.
- `corepack pnpm run build` with approved elevated execution - passed.
- `git status --short`

Build/typecheck result:
- `corepack pnpm run typecheck` passes.
- `corepack pnpm run build` passes with approved network access for the `next/font` Google Fonts fetch.
- The Next build still renders only the temporary App Router `/` route from `src/app/page.tsx`; real route/content migration has not started.

Known risks:
- First-time local builds may need network access for `next/font/google` to fetch Libre Baskerville; the elevated verification build passed.
- The global design foundation is in place, but the migrated public pages have not yet been rebuilt with the design system.
- `src/index.css` remains as legacy Vite-era CSS and is not imported by the Next App Router.
- Legacy Vite dependencies remain temporarily because unported files still reference Vite/React Router-era modules.
- Existing uncommitted state remains: `DESIGN.md` modified and `tech-architecture.md` untracked were already present before these phases.
- `git status` continues to emit warnings about denied access to the user-level Git ignore file at `C:\Users\Khalid Siddiqui/.config/git/ignore`; this did not block status output.

### Phase 6 - Route migration from React Router to App Router

#### Slice A - Shared layout shell + homepage
Completed in this slice:
- Moved the legacy shared components from `src/components/` to `src/legacy-components/` so they remain available as reference for the migration without colliding with App Router versions:
  - `src/components/Navigation.tsx` -> `src/legacy-components/Navigation.tsx`
  - `src/components/Footer.tsx` -> `src/legacy-components/Footer.tsx`
  - `src/components/ScrollToTop.tsx` -> `src/legacy-components/ScrollToTop.tsx`
- Updated the legacy `src/App.tsx` imports to point at `./legacy-components/*` so the legacy SPA reference still typechecks.
- Added App Router `src/components/Navigation.tsx` as a `"use client"` component using `next/link` and `usePathname`. Markup, classes, dropdown behavior, mobile menu toggle, brand colors, and copy preserved verbatim from the legacy Navigation. Logo still served from `/assets/logo/logo-red.png` via raw `<img>` pending Phase 7.
- Added App Router `src/components/Footer.tsx` as a `"use client"` component (newsletter form fields retain local `useState`; subscribe button stays a visual-only no-op exactly like the legacy footer until Phase 9/10 wires real submission). All internal links switched to `next/link`.
- Updated `src/app/layout.tsx` to wrap `{children}` with `<Navigation />`, `<main className="flex-1">`, and `<Footer />` inside a `min-h-screen flex flex-col` shell, matching the legacy SPA chrome.
- Replaced the temporary `src/app/page.tsx` placeholder with the full Home page content migrated from `src/legacy-pages/Home.tsx`. Rendered as a Server Component; only RR `Link` swapped for `next/link` and an unused `useState`-free pillars array kept inline.
- Did not port `ScrollToTop`: the Next.js App Router restores scroll position on route changes by default.
- Did not move any public assets, change any public URLs, change auth, add `next/image`, add metadata/SEO, add analytics, or add new dependencies.

Files changed in this slice:
- `src/App.tsx` (legacy imports retargeted)
- `src/components/Navigation.tsx` (new, App Router)
- `src/components/Footer.tsx` (new, App Router)
- `src/components/Footer.tsx` -> `src/legacy-components/Footer.tsx` (rename)
- `src/components/Navigation.tsx` -> `src/legacy-components/Navigation.tsx` (rename)
- `src/components/ScrollToTop.tsx` -> `src/legacy-components/ScrollToTop.tsx` (rename)
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `MIGRATION_STATE.md`

Commands run in this slice:
- `git status --short`
- `git branch --show-current`
- `git mv src/components/Navigation.tsx src/legacy-components/Navigation.tsx`
- `git mv src/components/Footer.tsx src/legacy-components/Footer.tsx`
- `git mv src/components/ScrollToTop.tsx src/legacy-components/ScrollToTop.tsx`
- `corepack pnpm run typecheck` - passed.
- `corepack pnpm run build` - passed; Next build now emits `/` and `/_not-found`, both prerendered as static.
- `git status --short`

Build/typecheck result:
- `corepack pnpm run typecheck` passes.
- `corepack pnpm run build` passes; the App Router `/` route now renders the real Home page chrome and content.

Known risks:
- Internal links from Navigation, Footer, and the Home page point at routes (`/thebook`, `/learn`, `/apply`, `/teach`, `/ideate`, `/about`, `/blog`, `/online-course`, `/podcasts`, `/localization-kits`, `/possibilities`, `/teaching-materials`, `/q-a`) that do not yet exist under `src/app/`. Until later Phase 6 slices land, clicking them will return Next.js 404s in dev/prod. Public URLs themselves are unchanged.
- Raw `<img>` tags were intentionally retained on the migrated Navigation and Home page to keep the visual delta zero. Conversion to `next/image` is Phase 7 work.
- Footer subscribe button still does nothing (matches legacy behavior); real wiring is Phase 9/10.
- `src/legacy-components/*` and `src/legacy-pages/*` are reference-only and are not rendered by the Next build; they continue to import `react-router-dom` and the legacy Vite-era types.
- Existing uncommitted state remains: `DESIGN.md` modified and `tech-architecture.md` untracked were already present before these phases.
- First-time builds may still require network access for `next/font/google` to fetch Libre Baskerville.

#### Slice B - Marketing top-level routes
Completed in this slice:
- Ported the legacy editorial primitive classes (`eyebrow`, `eyebrow-muted`, `lede`, `prose-body`, `editorial-rule`, `card-editorial`, `icon-block`, `btn-pill`, `btn-pill-outline`) from `src/index.css` into `src/styles/globals.css` inside `@layer components`, so App Router pages render with the same visual system as the legacy SPA. The legacy `src/index.css` was intentionally not deleted (it stays as a reference for the remaining slices).
- Created `src/app/thebook/page.tsx` from `src/legacy-pages/TheBook.tsx` (Server Component, no router APIs needed).
- Created `src/app/learn/page.tsx` from `src/legacy-pages/Learn.tsx`; RR `Link` → `next/link`; imports the shared `PageHero` via the `@/components` alias.
- Created `src/app/apply/page.tsx` from `src/legacy-pages/Apply.tsx`; RR `Link` → `next/link`; uses shared `PageHero`.
- Created `src/app/teach/page.tsx` from `src/legacy-pages/Teach.tsx`; RR `Link` → `next/link`; uses shared `PageHero`.
- Created `src/app/ideate/page.tsx` from `src/legacy-pages/Ideate.tsx` as a `"use client"` component (preserves `useEffect`/`useRef`/`useState` and the iframe `postMessage` height handshake).
- Created `src/app/about/page.tsx` from `src/legacy-pages/About.tsx` (Server Component).
- `src/components/PageHero.tsx` was left in place (no router APIs, no client state) and is now shared between the legacy SPA reference and the new App Router pages.
- Did not migrate `next/image`, did not change copy/markup beyond `Link` swaps, did not change public URLs, did not touch auth, did not add metadata/SEO/analytics/API routes, and did not add new dependencies.

Files changed in this slice:
- `src/styles/globals.css` (new `@layer components` block with editorial primitives)
- `src/app/thebook/page.tsx` (new)
- `src/app/learn/page.tsx` (new)
- `src/app/apply/page.tsx` (new)
- `src/app/teach/page.tsx` (new)
- `src/app/ideate/page.tsx` (new, `"use client"`)
- `src/app/about/page.tsx` (new)
- `MIGRATION_STATE.md`

Commands run in this slice:
- `git status --short`
- `corepack pnpm run typecheck` - passed.
- `corepack pnpm run build` - passed; build now emits `/`, `/about`, `/apply`, `/ideate`, `/learn`, `/teach`, `/thebook`, and `/_not-found`, all prerendered as static (`○`). `/ideate` ships ~1.5 kB of client JS because of the iframe height handshake; the others are minimal.
- `git status --short`

Build/typecheck result:
- `corepack pnpm run typecheck` passes.
- `corepack pnpm run build` passes; all six new marketing routes prerender successfully.

Known risks:
- Internal links from Navigation/Footer/Home still point at routes that have not been ported yet (`/online-course`, `/podcasts`, `/localization-kits`, `/possibilities`, `/teaching-materials`, `/q-a`, `/blog`, `/blog/[slug]`, `/login`, `/signup`, `/forgot-password`, `/update-password`, `/account`). Clicking these will return a Next 404. Public URLs themselves remain unchanged.
- Raw `<img>` tags retained throughout (Phase 7).
- `src/index.css` still contains the legacy editorial primitives (and other legacy-only classes like `btn-primary`, `section-container`, `page-hero`). It is not imported by the App Router; it is only reachable from the legacy SPA reference. It will be removed when legacy code is dropped at the end of the migration.
- `src/components/PageHero.tsx` is currently shared between legacy and new pages. If a later slice needs PageHero-specific behavior that diverges, this should be revisited.
- Existing uncommitted state remains: `DESIGN.md` modified and `tech-architecture.md` untracked were already present before these phases.
- First-time builds may still require network access for `next/font/google` to fetch Libre Baskerville.

#### Slice C - Remaining static marketing routes
Completed in this slice:
- Added `"use client"` to `src/components/RequestModal.tsx` so it can be imported by App Router client pages and remain importable by the legacy SPA reference (the directive is a no-op string under Vite/React). No other change to the modal: it is still a visual-only success message; real submission is deferred to Phase 9/10.
- Created `src/app/online-course/page.tsx` from `src/legacy-pages/OnlineCourse.tsx` as a Server Component (RR `Link` → `next/link`).
- Created `src/app/podcasts/page.tsx` from `src/legacy-pages/Podcast.tsx` as a `"use client"` component (preserves `useState`/`useRef`/`useEffect` audio playback, seek handshake, episode list state).
- Created `src/app/localization-kits/page.tsx` from `src/legacy-pages/LocalizationKits.tsx` as a `"use client"` component (filter state + RequestModal + RR `Link` → `next/link`).
- Created `src/app/possibilities/page.tsx` from `src/legacy-pages/Possibilities.tsx` as a `"use client"` component (modal + RequestModal + RR `Link` → `next/link`).
- Created `src/app/teaching-materials/page.tsx` from `src/legacy-pages/TeachingMaterials.tsx` as a `"use client"` component (chapter filter, expandable per-card section panels, RequestModal). Internal `CaseStudyCard` + `SectionContent` helpers are kept inside the same client module to preserve the legacy state-per-card behavior.
- Created `src/app/q-a/page.tsx` from `src/legacy-pages/QA.tsx` as a `"use client"` component (single open/close FAQ index).
- Shared `src/components/PageHero.tsx` continues to serve both legacy and new pages.
- Did not migrate raw `<img>` to `next/image`, did not change copy/markup beyond `Link` swaps, did not change public URLs, did not touch auth, did not add metadata/SEO/analytics/API routes, did not wire RequestModal to a real backend, and did not add new dependencies.

Files changed in this slice:
- `src/components/RequestModal.tsx` (added `"use client"` directive)
- `src/app/online-course/page.tsx` (new, Server Component)
- `src/app/podcasts/page.tsx` (new, `"use client"`)
- `src/app/localization-kits/page.tsx` (new, `"use client"`)
- `src/app/possibilities/page.tsx` (new, `"use client"`)
- `src/app/teaching-materials/page.tsx` (new, `"use client"`)
- `src/app/q-a/page.tsx` (new, `"use client"`)
- `MIGRATION_STATE.md`

Commands run in this slice:
- `git status --short`
- `corepack pnpm run typecheck` - passed.
- `corepack pnpm run build` - passed; build now emits 14 routes, all prerendered as static (`○`): `/`, `/about`, `/apply`, `/ideate` (~1.5 kB JS), `/learn`, `/localization-kits` (~4.8 kB JS), `/online-course`, `/podcasts` (~3.18 kB JS), `/possibilities` (~4.25 kB JS), `/q-a` (~2.78 kB JS), `/teach`, `/teaching-materials` (~13.1 kB JS), `/thebook`, plus `/_not-found`.
- `git status --short`

Build/typecheck result:
- `corepack pnpm run typecheck` passes.
- `corepack pnpm run build` passes; all twelve static marketing routes prerender successfully.

Known risks:
- The blog routes (`/blog`, `/blog/[slug]`) and the auth surfaces (`/login`, `/signup`, `/forgot-password`, `/update-password`, `/account`) still 404 from the App Router. Public URLs themselves remain unchanged.
- RequestModal's submit button still only shows a local "Thanks — we've got your request." state. No email is sent. Real wiring is Phase 9/10.
- Raw `<img>` tags retained throughout (Phase 7).
- `/teaching-materials` is the largest client page (~13.1 kB JS, ~17 hard-coded case studies + per-card expand state). Consider splitting case study data out into a separate module and/or static JSON in a later cleanup pass.
- `src/index.css` still contains the legacy editorial primitives and legacy-only classes. It is not imported by the App Router; it is only reachable from the legacy SPA reference and will be removed when legacy code is dropped at the end of the migration.
- Existing uncommitted state remains: `DESIGN.md` modified and `tech-architecture.md` untracked were already present before these phases.
- First-time builds may still require network access for `next/font/google` to fetch Libre Baskerville.

#### Slice D - Blog routes
Completed in this slice:
- Created `src/app/blog/page.tsx` from `src/legacy-pages/Blog.tsx` as a Server Component. Imports `blogPosts` directly from `@/data/blogPosts`. RR `Link` → `next/link`. Featured-post-plus-grid layout preserved verbatim.
- Created `src/app/blog/[slug]/page.tsx` from `src/legacy-pages/BlogPost.tsx` as a Server Component. RR `useParams` → Next 15 async `params` (Promise-typed). RR `Link` → `next/link`.
- Added `generateStaticParams` returning all 15 slugs from `blogPosts` so each post route prerenders at build time.
- Preserved the legacy inline editorial 404 panel for missing slugs. `dynamicParams` was left at the Next default so unknown slugs render on demand and show the same 404 panel as the legacy SPA (no behavior change for unknown URLs).
- The article body markup that was hard-coded in the legacy `BlogPost.tsx` (intro paragraphs, "The Core Insight", "Adapting, Not Copying", pull quote) is preserved verbatim. Post-specific data (title, excerpt, category, readTime, image) is sourced from `blogPosts.ts` exactly as before.
- Did not migrate raw `<img>` to `next/image`, did not change copy/markup beyond `Link` swaps and the Next 15 `params` await, did not change public URLs, did not touch auth, did not add metadata/SEO/analytics/API routes, and did not add new dependencies.

Files changed in this slice:
- `src/app/blog/page.tsx` (new, Server Component)
- `src/app/blog/[slug]/page.tsx` (new, Server Component, `generateStaticParams`)
- `MIGRATION_STATE.md`

Commands run in this slice:
- `git status --short`
- `corepack pnpm run typecheck` - passed.
- `corepack pnpm run build` - passed; build now emits 17 routes (16 unique paths + the `/blog/[slug]` template). `/blog/[slug]` is marked SSG (`●`) with 15 prerendered slugs at build time.
- `git status --short`

Build/typecheck result:
- `corepack pnpm run typecheck` passes.
- `corepack pnpm run build` passes. `/blog` is prerendered static (`○`); `/blog/[slug]` is prerendered SSG (`●`) for all 15 known slugs.

Known risks:
- Auth surfaces (`/login`, `/signup`, `/forgot-password`, `/update-password`, `/account`) still 404 from the App Router. These are deliberately deferred to Phase 8 (Supabase client/server migration with @supabase/ssr). Public URLs themselves remain unchanged.
- The hard-coded article body in `src/app/blog/[slug]/page.tsx` (carried over verbatim from the legacy SPA) is the same for every post — it always reads "Singapore's success story is one of the most studied..." regardless of which slug renders. This is pre-existing legacy behavior, not introduced by this slice. Real per-post content is a content-modeling task outside Phase 6 scope.
- Unknown slugs render via dynamic SSR (not 404 from Next) and show the legacy editorial 404 panel. If we later want known-only routing (and Next's default 404 styling for unknowns), set `export const dynamicParams = false` in `src/app/blog/[slug]/page.tsx`. That is a deliberate behavior change and should be approved before flipping.
- Raw `<img>` tags retained throughout (Phase 7).
- `src/index.css` and the legacy code under `src/legacy-pages/` + `src/legacy-components/` remain reference-only and are not bundled by Next; final removal happens at the end of the migration.
- Existing uncommitted state remains: `DESIGN.md` modified and `tech-architecture.md` untracked were already present before these phases.
- First-time builds may still require network access for `next/font/google` to fetch Libre Baskerville.

### Phase 7 - Repo cleanup (asset/scaffolding pruning)
Completed in this phase:
- **Reference / build-helper folders deleted (user-authorized; these were never served by the live site):**
  - `Content and Copy/` (~53 MB) — scrape notes, copy CSV/JSON/XLSX, raw HTML, sitemap-discovered, link-map, raw-text, the per-page `.md` extracts. Used during the initial audit only.
  - `main pages/` (~14 MB) — visual reference screenshots used during design / page-build work.
  - `assets/` (capital A, ~17 MB) — source/reference image originals. The live site never served these; only `public/assets/` is served.
  - `dist/` (~22 MB) — stale Vite build output. The Vercel deploy now uses `.next`.
  - Total reclaimed: ~106 MB.
- **Orphaned Vite SPA scaffolding deleted (not used by the App Router runtime):**
  - `src/App.tsx` — Vite SPA root that wired the legacy React Router pages.
  - `src/main.tsx` — Vite entry point that mounted `<App />`.
  - `src/index.css` — legacy Vite-era global stylesheet. Never imported by the App Router (the App Router uses `src/styles/globals.css`).
  - `index.html` — Vite entry HTML. Not used by Next; Next has its own root layout at `src/app/layout.tsx`.
  - `vite.config.ts` — Vite build config.
- **Non-auth legacy pages deleted from `src/legacy-pages/`** (all now have App Router equivalents under `src/app/`):
  - `About.tsx`, `Apply.tsx`, `Blog.tsx`, `BlogPost.tsx`, `Home.tsx`, `Ideate.tsx`, `Learn.tsx`, `LocalizationKits.tsx`, `OnlineCourse.tsx`, `Podcast.tsx`, `Possibilities.tsx`, `QA.tsx`, `Teach.tsx`, `TeachingMaterials.tsx`, `TheBook.tsx`.
- **`src/legacy-components/` folder deleted** (`Navigation.tsx`, `Footer.tsx`, `ScrollToTop.tsx`) — App Router equivalents live at `src/components/Navigation.tsx` and `src/components/Footer.tsx`; scroll restoration is built into the App Router.
- **Kept on purpose (Phase 8 spec):**
  - `src/legacy-pages/Login.tsx`, `SignUp.tsx`, `ForgotPassword.tsx`, `UpdatePassword.tsx`, `Account.tsx` — reference implementations for Phase 8 (Supabase client/server migration). They are the authoritative spec for the current sign-in / sign-up / reset / update / account flows, including error classification (`AuthErrorCode`), redirect behavior, and `sessionCreated` handling.
  - `src/lib/AuthContext.tsx`, `src/lib/ProtectedRoute.tsx`, `src/lib/supabase.ts` — current Vite-era auth + Supabase client. Will be replaced in Phase 8 with `src/lib/supabase/client.ts` + `src/lib/supabase/server.ts` (per tech-architecture.md). Kept as reference until the new flow is verified end-to-end.
  - `src/vite-env.d.ts` — provides the `ImportMetaEnv` type declarations the legacy auth code uses for `import.meta.env.VITE_SUPABASE_*`. Removing it would break the legacy auth-page typecheck.
  - `public/assets/**` (~21 MB) — every image referenced by App Router pages lives here. All 8 subfolders (`about/`, `apply/`, `blog/`, `book/`, `home/`, `learn/`, `logo/`, `teach/`) are actively loaded.
  - `src/data/blogPosts.ts` — actively consumed by `/blog` and `/blog/[slug]`.
- **Not changed (deferred):**
  - `package.json` — `vite`, `@vitejs/plugin-react`, `react-router-dom` left in deps. Vite/plugin are now unused at runtime but harmless; `react-router-dom` is still imported by the kept auth legacy pages. Removal can happen alongside Phase 8 when the legacy auth code is finally dropped.
  - Raw `<img>` → `next/image` migration. Public asset paths intentionally not moved from `/public/assets/` to `/public/images/`. Deferred to Phase 7b after Phase 8 ships.
  - The previously discovered but never-implemented legacy routes (`/post/[slug]`, `/quick-bites`, `/thank-you`, `/user-dashboard`, `/ar`, `/ar/*`) still need an explicit decision (implement, 301-redirect, or document as out of scope) before any cleanup pass that would silently drop them.

Files changed in this phase:
- Deleted: `Content and Copy/` (entire folder)
- Deleted: `main pages/` (entire folder)
- Deleted: `assets/` (entire folder, capital A — repo-root reference originals)
- Deleted: `dist/` (entire folder)
- Deleted: `src/legacy-components/` (entire folder)
- Deleted: 15 files in `src/legacy-pages/` (non-auth pages)
- Deleted: `src/App.tsx`, `src/main.tsx`, `src/index.css`
- Deleted: `index.html`, `vite.config.ts`
- Modified: `MIGRATION_STATE.md`

Commands run in this phase:
- `ls`, `du -sh ...` for inventory
- `grep` for `/assets/` references across `src/app/` and `src/components/` to confirm `public/assets/` is still needed
- `grep` for imports across the kept auth legacy pages to confirm they don't reference anything being deleted
- `rm -rf "Content and Copy" "main pages" "assets" "dist"`
- `rm` for the 15 non-auth legacy pages, `legacy-components/`, `src/App.tsx`, `src/main.tsx`, `src/index.css`, `index.html`, `vite.config.ts`
- `corepack pnpm run typecheck` - passed.
- `corepack pnpm run build` - passed; all 17 routes still emit (`/`, `/about`, `/apply`, `/blog`, `/blog/[slug]` with 15 slugs, `/ideate`, `/learn`, `/localization-kits`, `/online-course`, `/podcasts`, `/possibilities`, `/q-a`, `/teach`, `/teaching-materials`, `/thebook`, `/_not-found`).
- `git status --short`

Build/typecheck result:
- `corepack pnpm run typecheck` passes.
- `corepack pnpm run build` passes; identical route table to Slice D. No regression.

Known risks:
- `package.json` still lists `vite`, `@vitejs/plugin-react` (unused at runtime) and `react-router-dom` (still used at typecheck time by the kept auth legacy pages). All three should be removed at the end of Phase 8 when the legacy auth code is dropped.
- `src/vite-env.d.ts` is retained ONLY because the kept legacy auth code uses `import.meta.env`. Removing it would break typecheck for those files.
- The legacy auth code still uses the old Vite env-var names (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`). Phase 8 will introduce the Next-flavored names (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`).
- Raw `<img>` tags retained throughout (Phase 7b).
- Existing uncommitted state remains: `DESIGN.md` modified and `tech-architecture.md` untracked were already present before these phases.
- First-time builds may still require network access for `next/font/google` to fetch Libre Baskerville.
- Git records this slice as a very large diff (~290 deletions across the four reference folders). PR reviewers should treat the deletions as bulk-trust (folders explicitly authorized by the user) and focus review on the kept-vs-deleted boundary in `src/` and the repo root.

## Next phase
**None — migration complete.** Phase 15 shipped the final report at [`MIGRATION_REPORT.md`](./MIGRATION_REPORT.md). A small review-polish pass landed after that (snapshot at the bottom of this file). The only remaining work is platform configuration (Vercel env vars + provider dashboards + GitHub UI toggles), and that is documented in both `MIGRATION_REPORT.md` and the Phase 14 handoff snapshot below. This branch is ready for review and merge into `main` once the pre-launch checklist is green.

## Open questions
None blocking for the audit. Before implementation, decisions are needed on whether to preserve/implement discovered legacy routes (/post/*, /ar/*, /quick-bites, /thank-you, /user-dashboard) or redirect them.

## Hard stop rules
- Do not work on main.
- Do not push.
- Do not merge.
- Do not delete large folders.
- Do not delete public assets.
- Do not change public URLs without asking.
- Do not change auth behavior without asking.
- Do not commit .env.local or secrets.
- Do not expose Supabase secret keys, service role keys, sb_secret keys, database passwords, JWT secrets, or connection strings in frontend code.
- Make the smallest safe changes.
- Preserve existing copy, routes, content, images, and user-facing behavior.
- Use pnpm for the migrated Next.js project.
- Treat tech-architecture.md as the technical source of truth.
- Treat DESIGN.md as the visual/design source of truth.

## Handoff instructions
Another agent, especially Claude Code, should continue from this file and the chat audit. Start by re-checking the branch with git branch --show-current and confirm it is not main. Re-read tech-architecture.md, DESIGN.md, AGENTS.md, CLAUDE.md, WORKFLOW.md, package.json, the current App Router shell, the Supabase SSR modules under `src/lib/supabase/`, and this MIGRATION_STATE.md.

Do not begin by deleting public assets or moving public URLs. Keep each phase reviewable and preserve current routes, copy, images, and behavior. Run the relevant checks after each phase. Do not push, merge, or commit unless explicitly instructed.

Phases 1-5 are complete. Phase 6 is complete for all non-auth routes. Phase 7 (repo cleanup pass) is complete: reference folders (`Content and Copy/`, `main pages/`, `assets/`, `dist/`) and orphaned Vite scaffolding (`index.html`, `vite.config.ts`, `src/App.tsx`, `src/main.tsx`, `src/index.css`, `src/legacy-components/`, the 15 non-auth files in `src/legacy-pages/`) have all been removed. The five auth legacy pages (Login, SignUp, ForgotPassword, UpdatePassword, Account) and `src/lib/{AuthContext,ProtectedRoute,supabase}.ts` are intentionally kept as the Phase 8 spec. The `<img>` → `next/image` migration and `/public/assets/` → `/public/images/` move are deferred to Phase 7b after Phase 8. The next agent should continue with Phase 8 (Supabase client/server migration + auth route porting). Use `corepack pnpm ...` commands unless `pnpm` is available directly on PATH.

Current correction: Phases 1-10 and Phase 7b are now complete. Continue with Phase 11 only: PostHog/Sentry safe placeholder setup. Do not add SEO metadata, security headers, or CI yet.

## Clean handoff snapshot

Note: this section originally captured an older pre-Phase-8 handoff and is retained as historical audit context only. The authoritative current state is the top-level `Phase 8 status update`, `Next phase`, and `Phase 8 handoff snapshot` sections in this file.

### 1. Exactly what is completed
- Phase 1 - Next.js 15 App Router foundation:
  - Added `src/app/layout.tsx`, `src/app/page.tsx`, and `src/app/providers.tsx`.
  - Kept the homepage as a temporary placeholder only.
- Phase 2 - pnpm/package migration:
  - Switched package scripts to Next.js commands for pnpm.
  - Added `packageManager: pnpm@10.12.1`.
  - Added Next.js 15 / React 19 package foundation.
  - Generated `pnpm-lock.yaml`.
  - Removed `package-lock.json`.
  - Added `next.config.ts` and `next-env.d.ts`.
  - Updated `vercel.json` for Next.js.
  - Moved legacy React Router pages from `src/pages/*` to `src/legacy-pages/*`.
  - Updated `src/App.tsx` legacy lazy imports.
  - Fixed `src/legacy-pages/TeachingMaterials.tsx` React 19 type compatibility.
- Phase 3 - Tailwind CSS v4 setup:
  - Added `@tailwindcss/postcss`.
  - Updated `postcss.config.js`.
  - Added `src/styles/globals.css`.
  - Imported global styles in the App Router layout.
  - Left `tailwind.config.js` loaded through `@config` for migration compatibility.
- Phase 4 - shadcn/ui foundation:
  - Added `components.json`.
  - Added the `@/*` TypeScript path alias.
  - Added `src/lib/utils.ts` with `cn()`.
  - Added `src/components/ui/button.tsx`.
  - Added shadcn support dependencies: `@radix-ui/react-slot`, `class-variance-authority`, `clsx`, `lucide-react`, and `tailwind-merge`.
- Phase 5 - DESIGN.md tokens, Libre Baskerville, light-mode-only styling:
  - Loaded Libre Baskerville through `next/font/google`.
  - Added DESIGN.md light-only brand/shadcn CSS variables.
  - Added Tailwind v4 `@theme inline` mappings.
  - Added global editorial typography defaults.
  - Updated Tailwind font fallback config.
  - Updated the starter shadcn button to use pill, 700-weight, brand-red styling.
- Phase 6 Slice A - Shared layout shell + homepage:
  - Moved legacy `Navigation`, `Footer`, and `ScrollToTop` to `src/legacy-components/` (preserved as reference; still imported by legacy `src/App.tsx`).
  - Added App Router `src/components/Navigation.tsx` as a `"use client"` component using `next/link` + `usePathname`.
  - Added App Router `src/components/Footer.tsx` as a `"use client"` component using `next/link`; subscribe button kept as a visual-only no-op to match current behavior.
  - Wired `<Navigation>` + `<main>` + `<Footer>` into `src/app/layout.tsx`.
  - Replaced the placeholder `src/app/page.tsx` with the migrated Home page content as a Server Component.
- Phase 6 Slice B - Top-level marketing routes:
  - Ported the editorial primitive classes (eyebrow, eyebrow-muted, lede, prose-body, editorial-rule, card-editorial, icon-block, btn-pill, btn-pill-outline) from legacy `src/index.css` into `src/styles/globals.css` inside `@layer components`.
  - Created `src/app/thebook/page.tsx`, `src/app/learn/page.tsx`, `src/app/apply/page.tsx`, `src/app/teach/page.tsx`, and `src/app/about/page.tsx` as Server Components.
  - Created `src/app/ideate/page.tsx` as a `"use client"` component (iframe height handshake preserved verbatim).
  - Shared `src/components/PageHero.tsx` between legacy and new pages.
- Phase 6 Slice C - Remaining static marketing routes:
  - Added `"use client"` to `src/components/RequestModal.tsx` so it can be shared by App Router client pages and the legacy SPA reference.
  - Created `src/app/online-course/page.tsx` as a Server Component.
  - Created `src/app/podcasts/page.tsx`, `src/app/localization-kits/page.tsx`, `src/app/possibilities/page.tsx`, `src/app/teaching-materials/page.tsx`, and `src/app/q-a/page.tsx` as `"use client"` components.
  - All twelve static marketing routes are now App Router-native.
- Phase 6 Slice D - Blog routes:
  - Created `src/app/blog/page.tsx` as a Server Component (RR `Link` → `next/link`, layout preserved).
  - Created `src/app/blog/[slug]/page.tsx` as a Server Component with `generateStaticParams` enumerating all 15 slugs from `src/data/blogPosts.ts`. Each slug prerenders at build time as SSG.
  - Preserved the legacy inline editorial 404 panel for unknown slugs (dynamicParams left at default).
- Phase 7 - Repo cleanup:
  - Deleted reference / build-helper folders: `Content and Copy/` (~53 MB), `main pages/` (~14 MB), `assets/` (~17 MB), `dist/` (~22 MB). ~106 MB reclaimed.
  - Deleted orphaned Vite scaffolding: `index.html`, `vite.config.ts`, `src/App.tsx`, `src/main.tsx`, `src/index.css`.
  - Deleted `src/legacy-components/` (Navigation, Footer, ScrollToTop).
  - Deleted 15 non-auth files from `src/legacy-pages/` (now served by App Router equivalents under `src/app/`).
  - Kept the five auth legacy pages and `src/lib/{AuthContext,ProtectedRoute,supabase}.ts` as Phase 8 reference. Kept `src/vite-env.d.ts` because the legacy auth code uses `import.meta.env`.
  - `<img>` → `next/image` migration and `public/assets/` → `public/images/` move deferred to Phase 7b.

### 2. Exactly what is unfinished
- Phase 6 - Route migration from React Router to Next.js App Router (Slices A, B, C, and D complete; only auth surfaces remain, deferred to Phase 8).
- Phase 7b - `<img>` → `next/image` migration, and optional `public/assets/` → `public/images/` move with redirects.
- Phase 7 - Asset/image migration to `public/images` with `next/image`.
- Phase 8 - Supabase client/server migration.
- Phase 9 - Forms + zod + react-hook-form foundation.
- Phase 10 - Newsletter/contact route handlers only if existing forms require them.
- Phase 11 - PostHog/Sentry safe placeholder setup.
- Phase 12 - SEO: metadata, sitemap, robots, OG.
- Phase 13 - Security headers and CI.
- Phase 14 - Build/typecheck verification after full migration.
- Phase 15 - Final migration report.
- The Home page, all twelve static marketing pages, and both blog routes (`/`, `/thebook`, `/learn`, `/apply`, `/teach`, `/ideate`, `/about`, `/online-course`, `/podcasts`, `/localization-kits`, `/possibilities`, `/teaching-materials`, `/q-a`, `/blog`, `/blog/[slug]`) are now rendered by the App Router. Only the auth surfaces (`/login`, `/signup`, `/forgot-password`, `/update-password`, `/account`) still live in `src/legacy-pages/*` — deliberately deferred to Phase 8 (Supabase client/server migration).
- Phase 7 cleanup pass removed all reference / build-helper folders and orphaned Vite scaffolding (~106 MB + scaffold files). Only the five auth legacy pages and the legacy auth lib code remain in `src/legacy-pages/` and `src/lib/` as Phase 8 spec.
- Legacy Vite/React Router code still exists for migration reference.
- Supabase auth behavior has not been migrated or changed.
- Public asset URLs have not been changed.
- Form behavior and email behavior have not been changed.

### 3. Files changed
Current git status shows changes in these areas:
- Modified: `.gitignore`
- Modified: `DESIGN.md` (pre-existing before the migration phases)
- Deleted: `package-lock.json`
- Modified: `package.json`
- Modified: `postcss.config.js`
- Modified: `src/App.tsx`
- Deleted from old location: `src/pages/About.tsx`
- Deleted from old location: `src/pages/Account.tsx`
- Deleted from old location: `src/pages/Apply.tsx`
- Deleted from old location: `src/pages/Blog.tsx`
- Deleted from old location: `src/pages/BlogPost.tsx`
- Deleted from old location: `src/pages/ForgotPassword.tsx`
- Deleted from old location: `src/pages/Home.tsx`
- Deleted from old location: `src/pages/Ideate.tsx`
- Deleted from old location: `src/pages/Learn.tsx`
- Deleted from old location: `src/pages/LocalizationKits.tsx`
- Deleted from old location: `src/pages/Login.tsx`
- Deleted from old location: `src/pages/OnlineCourse.tsx`
- Deleted from old location: `src/pages/Podcast.tsx`
- Deleted from old location: `src/pages/Possibilities.tsx`
- Deleted from old location: `src/pages/QA.tsx`
- Deleted from old location: `src/pages/SignUp.tsx`
- Deleted from old location: `src/pages/Teach.tsx`
- Deleted from old location: `src/pages/TeachingMaterials.tsx`
- Deleted from old location: `src/pages/TheBook.tsx`
- Deleted from old location: `src/pages/UpdatePassword.tsx`
- Modified: `tailwind.config.js`
- Modified: `tsconfig.json`
- Modified: `vercel.json`
- Untracked: `MIGRATION_STATE.md`
- Untracked: `components.json`
- Untracked: `next-env.d.ts`
- Untracked: `next.config.ts`
- Untracked: `pnpm-lock.yaml`
- Untracked: `src/app/`
- Untracked: `src/components/ui/`
- Untracked: `src/legacy-pages/`
- Untracked: `src/lib/utils.ts`
- Untracked: `src/styles/`
- Untracked: `tech-architecture.md` (pre-existing before the migration phases)

### 4. Commands run
Important commands run across the completed phases:
- `git branch --show-current`
- `git status --short`
- `npm ci`
- `npm run build`
- `npm run build` with approved elevated execution
- `pnpm --version`
- `node --version`
- `corepack --version`
- `corepack prepare pnpm@10.12.1 --activate`
- `corepack prepare pnpm@10.12.1 --activate` with approved elevated execution
- `corepack pnpm install`
- `corepack pnpm install` with approved elevated execution
- `corepack pnpm install --force`
- `corepack pnpm install --force` with approved elevated execution
- `corepack pnpm add @radix-ui/react-slot class-variance-authority clsx lucide-react tailwind-merge`
- `corepack pnpm add @radix-ui/react-slot class-variance-authority clsx lucide-react tailwind-merge --store-dir "C:\Users\Khalid Siddiqui\AppData\Local\pnpm\store\v10"`
- `corepack pnpm add @radix-ui/react-slot class-variance-authority clsx lucide-react tailwind-merge --store-dir "C:\Users\Khalid Siddiqui\AppData\Local\pnpm\store\v10"` with approved elevated execution
- `corepack pnpm run typecheck`
- `corepack pnpm run build`
- `corepack pnpm run build` with approved elevated execution

### 5. Current build/typecheck status
- Latest `corepack pnpm run typecheck`: passed.
- Latest `corepack pnpm run build`: passed with approved elevated execution.
- A sandbox-only build attempt failed because `next/font/google` could not fetch Libre Baskerville from Google Fonts under restricted network access. The elevated rerun passed.
- Current build output is not the fully migrated website yet; it only includes the temporary App Router `/` route and `_not-found`.

### 6. Current git status summary
- Current branch: `codex/migrate-next15-architecture`.
- The worktree is dirty with the migration changes listed above.
- The old `src/pages/*` files show as deleted because they were moved to `src/legacy-pages/*`.
- `MIGRATION_STATE.md`, `tech-architecture.md`, `components.json`, `pnpm-lock.yaml`, Next foundation files, legacy page copies, and style/app folders are currently untracked.
- `git status` emits warnings about denied access to `C:\Users\Khalid Siddiqui/.config/git/ignore`; this did not block status output.
- No commits, pushes, merges, or branch changes were performed.

### 7. Errors or broken areas
- The migrated Next app is not feature-complete yet. It does not render the current production site pages because route migration has not started.
- Builds using `next/font/google` may require network access on first fetch of Libre Baskerville.
- `src/index.css` remains legacy Vite CSS and is not imported by the Next App Router.
- Legacy Vite dependencies remain temporarily because unported legacy files still reference Vite/React Router-era modules.
- Supabase/auth still uses the legacy browser-only Vite environment pattern in legacy code; it has not been moved to the target Next.js client/server split.
- Forms/email, analytics, Sentry, SEO, security headers, CI, and asset migration are not implemented yet.
- Discovered but not currently implemented/confirmed routes still need decisions before any public URL changes: `/post/[slug]`, `/quick-bites`, `/thank-you`, `/user-dashboard`, `/ar`, and `/ar/*`.

### 8. Next safest step
Phase 6 (route migration) and Phase 7 (repo cleanup) are complete. The next safest step is **Phase 8 — Supabase client/server migration**. Install `@supabase/ssr`, add `src/lib/supabase/client.ts` (browser client) and `src/lib/supabase/server.ts` (server client with cookie helpers), set up `middleware.ts` for cookie-based session refresh, then port the five auth surfaces (`/login`, `/signup`, `/forgot-password`, `/update-password`, `/account`) into `src/app/`. The kept legacy auth code under `src/legacy-pages/{Login,SignUp,ForgotPassword,UpdatePassword,Account}.tsx` and `src/lib/{AuthContext,ProtectedRoute,supabase}.ts` is the authoritative spec for the current behavior — preserve error classification (`AuthErrorCode`), `sessionCreated` branching on sign-up, login redirect to safe same-origin relative paths from `location.state`, password reset redirect to `/update-password`. Only after the new flow is verified end-to-end, delete the legacy auth code, delete `src/vite-env.d.ts`, and uninstall `vite` / `@vitejs/plugin-react` / `react-router-dom` from `package.json`. Phase 7b (raw `<img>` → `next/image`, optional `public/assets/` → `public/images/` move with redirects) and a decision on the never-implemented legacy routes (`/post/[slug]`, `/quick-bites`, `/thank-you`, `/user-dashboard`, `/ar`, `/ar/*`) remain after Phase 8.

### 9. Ready-to-copy Claude Code continuation prompt
```text
You are my senior migration engineer and technical safety reviewer.

Repository branch:
codex/migrate-next15-architecture

Continue the migration one controlled phase at a time. Read first:
- MIGRATION_STATE.md
- tech-architecture.md
- DESIGN.md
- AGENTS.md
- CLAUDE.md
- WORKFLOW.md
- package.json
- current git status
- src/App.tsx
- src/legacy-pages/*
- src/components/*
- src/lib/AuthContext.tsx
- src/lib/supabase.ts

Task:
Phase 6 route migration is complete for all non-auth routes. Execute only Phase 8 - Supabase client/server migration. Install @supabase/ssr, add src/lib/supabase/client.ts and src/lib/supabase/server.ts using the new sb_publishable_*/sb_secret_* key convention from tech-architecture.md, wire middleware.ts for cookie-based session refresh, then port /login, /signup, /forgot-password, /update-password, /account into src/app/. Preserve existing auth behavior (sign-in/sign-up/reset/update flows, error classification, /account protection) and current Supabase redirect URLs. Do not change public URLs, do not expose SUPABASE_SECRET_KEY to the browser, and do not delete the legacy AuthContext until the new flow is verified end-to-end.

Safety rules:
- Do not work on main.
- Do not push.
- Do not merge.
- Do not delete large folders.
- Do not delete public assets.
- Do not change public URLs unless required and explained.
- Do not change auth behavior unless required and explained.
- Do not commit .env.local or secrets.
- Do not expose server-only keys in client code.
- Preserve current content, routes, images, copy, and behavior.
- Make the smallest safe change.
- Stop if the next step would be destructive.

Phase 6 constraints:
- Do not move assets to public/images yet; that is Phase 7.
- Do not migrate Supabase/auth yet; that is Phase 8.
- Do not wire new server forms, analytics, SEO, or security headers yet.
- Keep existing /assets public image paths unless an explicit approved redirect/move plan exists.
- Replace the temporary src/app/page.tsx only as part of migrating the real homepage content.
- Prefer small route groups or shared components that keep the build passing.

Before editing:
1. Summarize the exact Phase 6 slice you are about to do.
2. List the files you expect to change.
3. Proceed only if safe.

After editing:
1. Run corepack pnpm run typecheck.
2. Run corepack pnpm run build.
3. Run git status --short.
4. Update MIGRATION_STATE.md with completed work, files changed, commands run, build/typecheck result, known risks, exact next phase, and handoff notes.

Stop after this one Phase 6 slice. Do not start Phase 7.
```

## Phase 8 handoff snapshot

### Work completed
- Installed `@supabase/ssr` with pnpm and kept `@supabase/supabase-js`.
- Added `src/lib/supabase/client.ts` using `createBrowserClient` and `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Added `src/lib/supabase/server.ts` using `createServerClient` and Next `cookies()` helpers.
- Added root `middleware.ts` using the canonical Supabase SSR cookie refresh pattern and `supabase.auth.getUser()`.
- Middleware matcher excludes `_next/static`, `_next/image`, `favicon.ico`, and `/assets/`.
- Added `src/lib/auth/errors.ts` with the legacy `AuthErrorCode` union and the same `classifyAuthError` behavior.
- Added `src/lib/auth/redirects.ts` for safe same-origin relative `next` redirect handling.
- Added `src/lib/request-origin.ts` for server-side origin resolution via request headers or `NEXT_PUBLIC_SITE_URL`.
- Added App Router auth pages:
  - `src/app/login/page.tsx`
  - `src/app/signup/page.tsx`
  - `src/app/forgot-password/page.tsx`
  - `src/app/update-password/page.tsx`
  - `src/app/account/page.tsx`
- Added client form/action components under the auth route folders.
- Preserved the legacy behaviors:
  - Login accepts only a safe `?next=` path that starts with `/` and not `//`, defaulting to `/account`.
  - Sign-up branches on Supabase `data.session` as `sessionCreated`.
  - Sign-up email confirmation redirects to `<origin>/login`.
  - Password reset redirects to `<origin>/update-password`.
  - `/account` checks the user server-side and redirects unauthenticated users to `/login?next=/account`.
  - Sign-out returns the user to `/login`.
- Updated `.env.example` with the new `NEXT_PUBLIC_SUPABASE_*` names and removed the Vite-era Supabase env names after legacy cleanup.
- Created an explicitly authorized disposable Supabase user through the public auth API for verification.
- Verified bad-credentials auth returns an error from Supabase.
- Verified sign-up returns an active session in this project (`sessionCreated=true`).
- Verified signed-in `/account` renders with cookie-backed SSR using the Supabase session cookies.
- Verified unauthenticated `/account` redirects to `/login?next=/account`.
- Deleted the legacy auth pages and old auth helper files after verification.
- Deleted `src/vite-env.d.ts`.
- Removed `vite`, `@vitejs/plugin-react`, and `react-router-dom` from `package.json`.
- Regenerated `pnpm-lock.yaml` after dependency cleanup.

### Work intentionally unfinished
- Phase 8 is complete.
- Password-reset email delivery and reset-link click-through were not fully exercised because that requires inbox access. The route, redirect URL, and Supabase reset request wiring are implemented and build-clean.
- Phase 7b remains: raw `<img>` to `next/image`, with public asset URL preservation unless a redirect/move plan is approved.
- Phase 9 remains: forms foundation with react-hook-form + zod.

### Files changed in this Phase 8 pass
- `.env.example`
- `package.json`
- `pnpm-lock.yaml`
- `middleware.ts`
- `src/lib/auth/errors.ts`
- `src/lib/auth/redirects.ts`
- `src/lib/request-origin.ts`
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/app/login/page.tsx`
- `src/app/login/LoginForm.tsx`
- `src/app/signup/page.tsx`
- `src/app/signup/SignUpForm.tsx`
- `src/app/forgot-password/page.tsx`
- `src/app/forgot-password/ForgotPasswordForm.tsx`
- `src/app/update-password/page.tsx`
- `src/app/update-password/UpdatePasswordForm.tsx`
- `src/app/account/page.tsx`
- `src/app/account/AccountActions.tsx`
- Deleted: `src/legacy-pages/Login.tsx`
- Deleted: `src/legacy-pages/SignUp.tsx`
- Deleted: `src/legacy-pages/ForgotPassword.tsx`
- Deleted: `src/legacy-pages/UpdatePassword.tsx`
- Deleted: `src/legacy-pages/Account.tsx`
- Deleted: `src/legacy-pages/` after it became empty
- Deleted: `src/lib/AuthContext.tsx`
- Deleted: `src/lib/ProtectedRoute.tsx`
- Deleted: `src/lib/supabase.ts`
- Deleted: `src/vite-env.d.ts`
- `MIGRATION_STATE.md`

### Commands run in this Phase 8 pass
- `git branch --show-current` - confirmed `codex/migrate-next15-architecture`.
- `Get-Content -Raw ...` reads for the required state, architecture, design, process, package/config, App Router shell, and legacy auth files.
- `git status --short` - captured current dirty state.
- `corepack pnpm run build` - confirmed pre-edit build was green.
- `corepack pnpm add @supabase/ssr` - failed due pnpm store mismatch.
- `corepack pnpm add @supabase/ssr --store-dir "C:\Users\Khalid Siddiqui\AppData\Local\pnpm\store\v10"` - failed in sandbox due registry access restrictions.
- `corepack pnpm add @supabase/ssr --store-dir "C:\Users\Khalid Siddiqui\AppData\Local\pnpm\store\v10"` with approved elevated execution - passed.
- `rg "AuthContext|useAuth|ProtectedRoute|../lib/supabase|./supabase|react-router-dom|vite-env" src .env.example package.json` - confirmed remaining legacy auth references.
- `corepack pnpm run typecheck` - passed after adding the new auth routes.
- `corepack pnpm run build` - passed after adding the new auth routes.
- `Test-Path .env.local` - returned `False`; contents were not read.
- `Test-Path .env.local` - later returned `True`; contents were not read.
- `corepack pnpm run dev --hostname 127.0.0.1 --port 3000` - starts and loads `.env.local`, but dev-mode HTTP probing was unreliable under sandbox network restrictions around `next/font`.
- `corepack pnpm run build` - initially failed in sandbox on `next/font` Google Fonts fetch; passed with approved elevated network execution.
- `corepack pnpm run typecheck` - passed after the successful build regenerated `.next/types`.
- `corepack pnpm run start --hostname 127.0.0.1 --port 3000` plus `curl.exe` route smoke - verified public/auth route HTTP behavior.
- Disposable Supabase auth verification with approved elevated network execution - bad credentials returned an auth error, sign-up returned `sessionCreated=true`, signed-in `/account` returned 200 and contained the disposable user email.
- Deleted the legacy auth files and `src/vite-env.d.ts`.
- `corepack pnpm install --store-dir "C:\Users\Khalid Siddiqui\AppData\Local\pnpm\store\v10"` - passed and removed `react-router-dom`, `vite`, and `@vitejs/plugin-react` from the lockfile.
- `rg "react-router-dom|AuthContext|ProtectedRoute|VITE_SUPABASE|vite-env|@vitejs|from '../lib/supabase'|from './supabase'|vite" src package.json .env.example pnpm-lock.yaml` - found no stale references.
- `corepack pnpm run typecheck` - passed after cleanup.
- `corepack pnpm run build` - failed in sandbox on `next/font` Google Fonts fetch, then passed with approved elevated network execution.
- `corepack pnpm run start --hostname 127.0.0.1 --port 3000` plus `curl.exe` route smoke - verified final production route behavior after cleanup.
- `git status --short` - captured final dirty state.

### Build/typecheck result
- Latest `corepack pnpm run typecheck`: passed.
- Latest `corepack pnpm run build`: passed with approved elevated network access for `next/font`.
- After `.env.local` was added, `corepack pnpm run build` initially failed in the sandbox because `next/font` could not fetch Libre Baskerville from Google Fonts; rerunning with approved elevated network access passed.
- After the successful build regenerated `.next/types`, `corepack pnpm run typecheck` passed again.
- Build now includes dynamic auth routes:
  - `/account`
  - `/forgot-password`
  - `/login`
  - `/signup`
  - `/update-password`
- Existing non-auth App Router routes still build.
- `react-router-dom`, `vite`, and `@vitejs/plugin-react` are no longer installed project dependencies.

### Local route smoke after `.env.local` was added
- Confirmed `.env.local` exists without reading or printing its contents.
- `corepack pnpm run dev --hostname 127.0.0.1 --port 3000` starts and loads `.env.local`; dev-mode HTTP probing was unreliable in the sandbox because `next/font` network fetches were blocked.
- Rebuilt with approved network access and used `corepack pnpm run start --hostname 127.0.0.1 --port 3000` for a production route smoke.
- Route smoke results:
  - `/` returned 200.
  - `/login` returned 200.
  - `/signup` returned 200.
  - `/forgot-password` returned 200.
  - `/update-password` returned 200.
  - `/account` returned `307 Temporary Redirect` with `location: /login?next=/account`.
- After explicit permission to create a disposable user, Supabase auth verification passed:
  - Bad credentials returned an auth error.
  - Sign-up succeeded with `sessionCreated=true`.
  - Signed-in `/account` returned 200 and contained the disposable user email.
- Final production route smoke after cleanup:
  - `/` returned 200.
  - `/login` returned 200.
  - `/signup` returned 200.
  - `/forgot-password` returned 200.
  - `/update-password` returned 200.
  - `/account` returned `307 Temporary Redirect` with `location: /login?next=/account` when unauthenticated.

### Known risks and broken areas
- Runtime visits to server-authenticated routes (`/login`, `/signup`, `/account`) require `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Middleware safely no-ops when the public Supabase env vars are missing so non-auth routes can still run without local Supabase configuration.
- The disposable auth test user may remain in the Supabase project unless removed manually from the Supabase dashboard.
- Password reset email delivery and reset-link click-through were not fully exercised because this environment does not have inbox access.
- No `SUPABASE_SECRET_KEY`, service role key, `sb_secret_*`, database password, JWT secret, or connection string was added.
- No public URLs were changed.
- No public assets were touched.
- No SEO, Sentry, PostHog, newsletter/contact route handlers, or `next/image` migration was started.

### Exact next step
Proceed to Phase 9 only: add the forms foundation with react-hook-form + zod. Do not implement newsletter/contact route handlers, Mailchimp, Resend, analytics, SEO, or security headers in that phase unless explicitly approved.

## Phase 7b handoff snapshot

### Work completed
- Migrated raw `<img>` usage in active App Router pages and shared components to `next/image`.
- Preserved all current `/assets/...` public image URLs.
- Did not move files from `public/assets/` to `public/images/`.
- Did not add redirects.
- Used `priority` for above-the-fold images already rendered in the first viewport.
- Used `fill` within existing aspect-ratio wrappers for card/hero images to preserve layout behavior.
- Kept fixed intrinsic dimensions for logo/icon/book/author images where dimensions were known.
- Confirmed there are no remaining raw `<img>` tags in `src/app` or `src/components`.

### Files changed in this Phase 7b pass
- `src/components/Navigation.tsx`
- `src/app/page.tsx`
- `src/app/about/page.tsx`
- `src/app/apply/page.tsx`
- `src/app/learn/page.tsx`
- `src/app/blog/page.tsx`
- `src/app/blog/[slug]/page.tsx`
- `src/app/podcasts/page.tsx`
- `src/app/teach/page.tsx`
- `src/app/thebook/page.tsx`
- `MIGRATION_STATE.md`

### Commands run in this Phase 7b pass
- `git branch --show-current` - confirmed `codex/migrate-next15-architecture`.
- `git status --short` - captured the existing dirty migration worktree.
- `Get-Content -Raw MIGRATION_STATE.md`
- `Get-Content -Raw DESIGN.md`
- `Get-Content -Raw tech-architecture.md`
- `rg -n "<img|<Image|/assets/|backgroundImage" src/app src/components src/data next.config.ts package.json`
- `Get-ChildItem -Recurse -File public\assets | Select-Object FullName,Length`
- `Add-Type -AssemblyName System.Drawing; Get-ChildItem -Recurse -File public\assets ...` - read local image dimensions.
- `rg -n "<img" src/app src/components` - no remaining raw image tags after migration.
- `corepack pnpm run typecheck` - passed.
- `corepack pnpm run build` - passed.

### Build/typecheck result
- Latest `corepack pnpm run typecheck`: passed.
- Latest `corepack pnpm run build`: passed.
- Build output still includes the migrated static marketing routes, SSG blog routes, and dynamic auth routes.

### Known risks and deferred work
- `public/assets/**` is intentionally still the live public image location. The target `/public/images/` move remains deferred because public URL changes require explicit approval and a redirect plan.
- `backgroundImage` usages for inline select chevrons remain in `src/app/localization-kits/page.tsx` and `src/app/teaching-materials/page.tsx`; these are CSS data-URI controls, not content images.
- Large source/reference folder deletions from Phase 7 remain in the dirty worktree.
- No form library, route handler, Mailchimp, Resend, analytics, SEO, security headers, or CI work was started.

### Exact next step
Phase 9 is now complete. Proceed to Phase 10 only: newsletter/contact route handlers if existing forms require them. Keep Mailchimp and Resend server-only; do not expose provider secrets to client code.

## Phase 9 handoff snapshot

### Work completed
- Installed the locked form foundation dependencies:
  - `react-hook-form`
  - `@hookform/resolvers`
  - `zod`
  - `@radix-ui/react-label`
- Added shadcn-style form primitives:
  - `src/components/ui/form.tsx`
  - `src/components/ui/input.tsx`
  - `src/components/ui/label.tsx`
  - `src/components/ui/textarea.tsx`
- Added shared zod schemas in `src/lib/validation/forms.ts` for:
  - newsletter signup
  - resource request modal
  - auth email
  - login
  - signup
  - update password
- Migrated `src/components/Footer.tsx` newsletter fields to `react-hook-form` + zod validation.
- Migrated `src/components/RequestModal.tsx` to `react-hook-form` + zod validation.
- Preserved Phase 10 separation: no `/api/newsletter`, no `/api/contact`, no Mailchimp, no Resend, and no email delivery was added.

### Files changed in this Phase 9 pass
- `package.json`
- `pnpm-lock.yaml`
- `src/components/Footer.tsx`
- `src/components/RequestModal.tsx`
- `src/components/ui/form.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/label.tsx`
- `src/components/ui/textarea.tsx`
- `src/lib/validation/forms.ts`
- `MIGRATION_STATE.md`

### Commands run in this Phase 9 pass
- `git branch --show-current` - confirmed `codex/migrate-next15-architecture`.
- `git status --short` - captured the existing dirty migration worktree.
- `Get-Content -Raw MIGRATION_STATE.md`
- `Get-Content -Raw package.json`
- `rg -n "<form|useState\(|submit|onSubmit|input|textarea|select" src/app src/components src/lib`
- `Get-Content -Raw src/components/Footer.tsx`
- `Get-Content -Raw src/components/RequestModal.tsx`
- `Get-Content -Raw src/app/login/LoginForm.tsx`
- `Get-Content -Raw src/app/signup/SignUpForm.tsx`
- `corepack pnpm add react-hook-form @hookform/resolvers zod @radix-ui/react-label` - failed due pnpm store mismatch.
- `corepack pnpm add react-hook-form @hookform/resolvers zod @radix-ui/react-label --store-dir "C:\Users\Khalid Siddiqui\AppData\Local\pnpm\store\v10"` - failed in sandbox due npm registry access restrictions.
- `corepack pnpm add react-hook-form @hookform/resolvers zod @radix-ui/react-label --store-dir "C:\Users\Khalid Siddiqui\AppData\Local\pnpm\store\v10"` with approved elevated network execution - passed.
- `corepack pnpm run typecheck` - passed.
- `corepack pnpm run build` - passed.
- `rg -n "react-hook-form|zod|zodResolver|newsletterSignupSchema|resourceRequestSchema|<Form|FormField|from '@/components/ui/(form|input|textarea|label)'" src package.json`
- `git diff --check` - passed; emitted only existing CRLF normalization warnings.
- `git status --short`

### Build/typecheck result
- Latest `corepack pnpm run typecheck`: passed.
- Latest `corepack pnpm run build`: passed.
- Build output still includes the migrated static marketing routes, SSG blog routes, and dynamic auth routes.

### Known risks and deferred work
- Footer newsletter validation is now client-side only; it does not submit to Mailchimp yet.
- Request modal validation is now client-side only; it still shows the existing "email delivery is being connected soon" confirmation and does not send email.
- The pages that mount `RequestModal` now include the form stack in their client bundle, increasing first-load JS on those pages. This is expected for Phase 9 and can be revisited during performance tuning.
- Auth forms have shared schemas available, but their Phase 8 behavior was left unchanged in this pass to avoid auth regressions.
- No server route handlers, Mailchimp, Resend, analytics, SEO, security headers, or CI work was started.

### Exact next step
Phase 10 is now complete. Proceed to Phase 11 only: PostHog/Sentry safe placeholder setup. Do not add SEO metadata, security headers, or CI in that phase.

## Phase 10 handoff snapshot

### Work completed
- Installed Phase 10 server dependencies:
  - `@mailchimp/mailchimp_marketing`
  - `resend`
- Added server-only env placeholders to `.env.example`:
  - `MAILCHIMP_API_KEY`
  - `MAILCHIMP_SERVER_PREFIX`
  - `MAILCHIMP_AUDIENCE_ID`
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL`
  - `RESEND_TO_EMAIL`
- Added `src/lib/server-env.ts` for server-only env validation without leaking values.
- Added `src/lib/mailchimp/marketing.ts` to upsert newsletter subscribers into the configured Mailchimp audience.
- Added `src/lib/resend/send.ts` to send resource/contact requests through Resend.
- Added route handlers:
  - `src/app/api/newsletter/route.ts`
  - `src/app/api/contact/route.ts`
- Extended `src/lib/validation/forms.ts` with `contactRequestSchema`.
- Wired `src/components/Footer.tsx` newsletter form to `POST /api/newsletter`.
- Wired `src/components/RequestModal.tsx` to `POST /api/contact`.
- Added `src/types/mailchimp-marketing.d.ts` because the Mailchimp SDK does not ship TypeScript declarations.
- Updated `next.config.ts` with `serverExternalPackages: ['@mailchimp/mailchimp_marketing']` to keep the server-only Mailchimp SDK external and remove an optional dependency bundling warning.
- Did not read or print `.env.local`.
- Did not add any `NEXT_PUBLIC_` Mailchimp or Resend variables.

### Files changed in this Phase 10 pass
- `.env.example`
- `package.json`
- `pnpm-lock.yaml`
- `next.config.ts`
- `src/app/api/newsletter/route.ts`
- `src/app/api/contact/route.ts`
- `src/components/Footer.tsx`
- `src/components/RequestModal.tsx`
- `src/lib/mailchimp/marketing.ts`
- `src/lib/resend/send.ts`
- `src/lib/server-env.ts`
- `src/lib/validation/forms.ts`
- `src/types/mailchimp-marketing.d.ts`
- `MIGRATION_STATE.md`

### Commands run in this Phase 10 pass
- `git branch --show-current` - confirmed `codex/migrate-next15-architecture`.
- `Get-Content -Raw MIGRATION_STATE.md`
- `Get-Content -Raw .env.example`
- `Get-Content -Raw package.json`
- `Get-Content -Raw src/components/Footer.tsx`
- `Get-Content -Raw src/components/RequestModal.tsx`
- `Get-Content -Raw src/lib/validation/forms.ts`
- `rg -n "RequestModal|setModalOpen|onClick=.*modal|kind=|description=" src/app src/components`
- `Get-ChildItem -Recurse -File src\app\api -ErrorAction SilentlyContinue`
- `corepack pnpm add @mailchimp/mailchimp_marketing resend --store-dir "C:\Users\Khalid Siddiqui\AppData\Local\pnpm\store\v10"` - failed in sandbox due npm registry access restrictions.
- `corepack pnpm add @mailchimp/mailchimp_marketing resend --store-dir "C:\Users\Khalid Siddiqui\AppData\Local\pnpm\store\v10"` with approved elevated network execution - passed.
- `corepack pnpm run typecheck` - initially failed because the Mailchimp SDK has no declaration file.
- `corepack pnpm run typecheck` - passed after adding the local Mailchimp declaration.
- `corepack pnpm run build` - passed, but initially emitted a Mailchimp SDK optional dependency bundling warning.
- `corepack pnpm run build` - passed cleanly after externalizing the Mailchimp SDK through `next.config.ts`.
- `rg -n "MAILCHIMP|RESEND|SUPABASE_SECRET|sb_secret|service_role|DATABASE_URL|JWT_SECRET|NEXT_PUBLIC_(MAILCHIMP|RESEND)" src .env.example package.json next.config.ts`
- `git diff --check` - passed; emitted only existing CRLF normalization warnings.
- `git status --short`

### Build/typecheck result
- Latest `corepack pnpm run typecheck`: passed.
- Latest `corepack pnpm run build`: passed.
- Build output now includes dynamic route handlers:
  - `/api/contact`
  - `/api/newsletter`
- Secret-boundary scan found Mailchimp/Resend env names only in `.env.example` and server helper modules. No provider values were present or printed.

### Known risks and deferred work
- Runtime newsletter submissions require `MAILCHIMP_API_KEY`, `MAILCHIMP_SERVER_PREFIX`, and `MAILCHIMP_AUDIENCE_ID` in the deployment environment.
- Runtime request/contact submissions require `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `RESEND_TO_EMAIL`.
- Missing provider config returns a 503 JSON response rather than failing the build.
- The request modal success copy changed from "email delivery is being connected soon" to a live follow-up message because the form is now wired to Resend.
- No PostHog, Sentry, SEO metadata, sitemap, robots, security headers, CI, or final migration report work was started.

### Exact next step
Proceed to Phase 11 only: PostHog/Sentry safe placeholder setup. Keep analytics/error tracking keys out of client code unless they are intentionally public variables, and do not start SEO or security-header work yet.

## Phase 11 handoff snapshot

### Work completed
- Installed Phase 11 observability dependencies:
  - `@sentry/nextjs` (10.53.1)
  - `posthog-js` (1.376.0)
  - `posthog-node` (5.35.1)
- Added safe-placeholder env documentation to `.env.example`:
  - `NEXT_PUBLIC_SENTRY_DSN` (browser-safe Sentry DSN; empty → Sentry no-op)
  - `SENTRY_AUTH_TOKEN` (server/build-only; source-map upload)
  - `SENTRY_ORG`
  - `SENTRY_PROJECT`
  - `NEXT_PUBLIC_POSTHOG_KEY` (browser; empty → PostHog no-op)
  - `NEXT_PUBLIC_POSTHOG_HOST` (defaults to `https://us.i.posthog.com`)
- Added Sentry runtime config files, every one gated on `NEXT_PUBLIC_SENTRY_DSN`:
  - `instrumentation-client.ts` (replaces the deprecated `sentry.client.config.ts` for Next 15 / Turbopack forward-compat). Uses `tracesSampleRate: 0.1`, `replaysOnErrorSampleRate: 1.0`.
  - `sentry.server.config.ts` — `tracesSampleRate: 0.1`.
  - `sentry.edge.config.ts` — `tracesSampleRate: 0.1`.
- Added `instrumentation.ts` at the repo root with the Next-required `register()` hook that imports `sentry.server.config` under the `nodejs` runtime and `sentry.edge.config` under the `edge` runtime. Re-exports `Sentry.captureRequestError` as `onRequestError` for App Router error reporting.
- Added `src/app/global-error.tsx` — Sentry-aware root error boundary using `useEffect(() => Sentry.captureException(error))`. Renders an editorial 500-style fallback with brand styling and a Try-again button.
- Added `src/lib/posthog/client.ts` — `'use client'` module exporting `initPostHog()` and the `posthog` singleton. Safely no-ops when `NEXT_PUBLIC_POSTHOG_KEY` is missing, the import runs in a non-browser environment, or PostHog has already been initialized. Configures `capture_pageview: 'history_change'`, `capture_pageleave: true`, `autocapture: true`, and `persistence: 'localStorage+cookie'`.
- Added `src/lib/posthog/server.ts` — uses Node's `'server-only'` guard. Exports `getServerPostHog()` returning a lazily-created `PostHog` Node client (or `null` when the key is missing). Configured with `flushAt: 1, flushInterval: 0` for serverless-friendly delivery.
- Converted `src/app/providers.tsx` to a Client Component that:
  - Always calls `initPostHog()` from `useEffect` (no-op when key is absent).
  - Returns `<PostHogProvider client={posthog}>` only when `NEXT_PUBLIC_POSTHOG_KEY` is set; otherwise passes children through, preserving the existing zero-overhead wrapper.
- Wrapped `next.config.ts` with `withSentryConfig(nextConfig, …)`:
  - `silent` and `sourcemaps.disable` are both bound to `!sentryEnabled`, where `sentryEnabled` is true only when `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and `SENTRY_PROJECT` are all present.
  - `telemetry: false` to avoid the Sentry CLI telemetry ping.
  - When any of the three Sentry build-time vars are missing, source-map upload silently skips and the build still passes.
- Did not add SEO metadata, sitemap, robots, OG images, security headers, CSP, CI, rate-limiting, CAPTCHA, or any explicit `posthog.capture(...)` event wiring. All deferred to later phases.

### Files changed in this Phase 11 pass
- `.env.example`
- `package.json`
- `pnpm-lock.yaml`
- `next.config.ts`
- `instrumentation.ts` (new)
- `instrumentation-client.ts` (new — see deprecation note below)
- `sentry.server.config.ts` (new)
- `sentry.edge.config.ts` (new)
- `src/app/global-error.tsx` (new)
- `src/app/providers.tsx` (now `'use client'`, mounts `PostHogProvider` conditionally)
- `src/lib/posthog/client.ts` (new)
- `src/lib/posthog/server.ts` (new)
- `MIGRATION_STATE.md`

### Commands run in this Phase 11 pass
- `git branch --show-current` — confirmed `codex/migrate-next15-architecture`.
- `git status --short` — captured pre-edit worktree.
- `Read` of `MIGRATION_STATE.md`, `package.json`, `next.config.ts`, `.env.example`, `src/app/providers.tsx`, `src/app/layout.tsx`, `src/lib/server-env.ts`.
- `ls instrumentation.ts sentry.*.config.ts` — confirmed none existed.
- `corepack pnpm add @sentry/nextjs posthog-js posthog-node --store-dir "C:\Users\Khalid Siddiqui\AppData\Local\pnpm\store\v10"` — passed; warned about ignored postinstall scripts for `@sentry/cli`, `core-js`, `protobufjs`. Benign for a placeholder build (no source-map CLI invocations from postinstall).
- Wrote the eight new files listed above.
- `corepack pnpm run typecheck` — passed.
- `corepack pnpm run build` — initially emitted a deprecation warning about `sentry.client.config.ts`.
- `mv sentry.client.config.ts instrumentation-client.ts` (the file was still untracked, so `git mv` was not appropriate).
- `corepack pnpm run build` — re-run, passed cleanly; deprecation warning gone. Source-map upload succeeded against the configured Sentry org/project. 35 pages generated.
- `git status --short` — captured post-edit worktree.

### Build/typecheck result
- Latest `corepack pnpm run typecheck`: passed.
- Latest `corepack pnpm run build`: passed.
- Route table emitted by the build:
  - **Static (`○`):** `/`, `/about`, `/apply`, `/blog`, `/ideate`, `/learn`, `/localization-kits`, `/online-course`, `/podcasts`, `/possibilities`, `/q-a`, `/teach`, `/teaching-materials`, `/thebook`, `/_not-found`.
  - **SSG (`●`):** `/blog/[slug]` with 15 prerendered slugs.
  - **Dynamic (`ƒ`):** `/account`, `/api/contact`, `/api/newsletter`, `/forgot-password`, `/login`, `/signup`, `/update-password`. These are runtime-rendered because they read auth cookies or accept POST bodies.
- First Load JS shared baseline rose from ~102 kB to ~180 kB due to the Sentry client SDK + replay shim. Per-route page weights are unchanged from Phase 10 plus the shared bump.
- During the verification run the build successfully uploaded source maps to Sentry org `86400-7v`, project `javascript-nextjs`, release `423ab4c410cadc197336625fa3403e47cb60cc36`, because `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and `SENTRY_PROJECT` were present in `.env.local`.
- Sentry CLI emitted a handful of benign "could not determine a source map reference" warnings for ~4 internal Next chunks (`_error.js`, a couple of small framework chunks). These are pre-existing artifacts of how Next bundles those files and were not introduced by Phase 11.

### Known risks and deferred work
- Sentry client SDK adds ~78 kB to the shared First Load JS baseline. This is expected for a Sentry-enabled site; revisit during Phase 13 (security/perf headers + CI) and the final performance pass if the budget is tight.
- The placeholder Sentry config currently leaves `replaysSessionSampleRate: 0` so PostHog session replay can own that surface area. If both Sentry session replay AND PostHog session replay are eventually desired, decide which one is canonical to avoid double-recording.
- PostHog initialization happens client-side from `useEffect` in `src/app/providers.tsx`. SSR rendered HTML does not include any `posthog.*` calls, so server-rendered output is identical with or without a configured key. No `posthog.capture(...)` calls are wired yet — autocapture handles the initial event coverage. Explicit events for `signup`, `cta_click`, `form_submit`, `newsletter_subscribe` per tech-architecture.md are a follow-up.
- `next.config.ts` now imports `withSentryConfig` from `@sentry/nextjs`. If the dependency is ever removed, the config file must be reverted in the same pass, otherwise the build will fail at import time.
- Sentry source maps are uploaded on every build where the three build-time vars are set. On CI without those secrets, the upload step is skipped silently — confirm Vercel project envs are configured before relying on stack-trace symbolication in prod.
- `instrumentation-client.ts` is the Next 15 / Turbopack convention; `sentry.client.config.ts` is no longer supported for client-side Sentry init under Turbopack. The two other `sentry.{server,edge}.config.ts` files are still supported (they continue to be loaded by `instrumentation.ts` under the appropriate runtime).
- No `.env.local` values were read, printed, or committed. The Sentry org/project surfaced in the build output came from the Sentry CLI's own log line, not from anything this phase wrote.
- No SEO metadata, sitemap, robots, OG images, security headers, CSP, rate-limiting, CAPTCHA, CI workflow, or final migration report was started.
- The discovered-but-never-implemented legacy routes (`/post/[slug]`, `/quick-bites`, `/thank-you`, `/user-dashboard`, `/ar`, `/ar/*`) still need an explicit decision (implement, 301-redirect, or document as out of scope) before Phase 13/14 cleanup.

### Exact next step
Proceed to **Phase 12 only**: SEO foundation.
- Add per-route `metadata` exports (unique title 50–60 chars, description 140–160 chars, canonical URL, OpenGraph + Twitter Card) for every public route in `src/app/`.
- Add `src/app/sitemap.ts` enumerating all 14 static marketing routes + the 15 known blog slugs.
- Add `src/app/robots.ts` allowing all crawlers and pointing to `/sitemap.xml`.
- Add `src/app/opengraph-image.tsx` for a dynamic site-wide OG image (1200×630, under 1 MB, readable text, light editorial styling).
- Add JSON-LD `Organization` schema in `src/app/layout.tsx` (or a tiny shared component) so it's present on every page.
- Set `NEXT_PUBLIC_SITE_URL` in `.env.example` (canonical/sitemap origin) — should already exist for Supabase redirects; if not, add it.
- Do **not** start security headers, CSP, CI, rate-limiting, or CAPTCHA work — those are Phase 13.
- Do **not** wire explicit PostHog events for `signup`, `cta_click`, `form_submit`, `newsletter_subscribe` in this phase; they can land alongside Phase 13/14 as a polish pass.

## Phase 12 handoff snapshot

### Work completed
- Added `NEXT_PUBLIC_SITE_URL` to `.env.example` with a local default of `http://localhost:3000`. This is the canonical origin used by `metadataBase`, the sitemap, robots, the OG image, and the existing Phase 8 auth redirect helper (`src/lib/request-origin.ts` was already reading it).
- Added `src/lib/seo/site.ts` with locked site constants: `SITE_NAME`, `SITE_TAGLINE`, `SITE_DESCRIPTION`, `SITE_URL` (env-derived, trailing slash stripped), `SITE_LOGO_PATH`, `SITE_TWITTER_HANDLE`, `SITE_AUTHOR`, and a small `absoluteUrl(path)` helper.
- Added `src/lib/seo/page-metadata.ts` with a `pageMetadata({ title, description, path, noindex? })` helper that returns a `Metadata` object pre-populated with `title`, `description`, `alternates.canonical`, `openGraph.{title,description,url}`, `twitter.{title,description}`, and optionally `robots: { index: false, follow: false }`.
- Updated `src/app/layout.tsx`:
  - Added `metadataBase: new URL(SITE_URL)` so every page's relative canonical path resolves to an absolute URL.
  - Added a default `metadata` export with `title.template` (`"%s — The Singapore Way"`) and `title.default` (`"The Singapore Way — Method, not miracle"`), site-level description, `applicationName`, `authors`, `creator`, `publisher`, default `alternates.canonical: '/'`, default `openGraph` (website type, site name, en_US locale), default `twitter` (summary_large_image, brand handle), `robots: { index: true, follow: true }`, and `icons` pointing at the brand logo.
  - Added a `viewport` export (`device-width`, `colorScheme: 'light'`, `themeColor: '#C8102E'`).
  - Embedded a JSON-LD `Organization` schema in `<script type="application/ld+json">` inside `<body>` so it's present on every page.
- Added `src/app/sitemap.ts` enumerating all 14 marketing routes with priorities (`/` = 1.0, top-level marketing = 0.7–0.9, `/blog` = 0.8) and all 15 blog slugs (priority 0.6, monthly change frequency). All URLs are absolute via `absoluteUrl()`.
- Added `src/app/robots.ts` allowing all crawlers with explicit disallows for `/api/`, `/account`, `/login`, `/signup`, `/forgot-password`, `/update-password`, and pointing to `<SITE_URL>/sitemap.xml`.
- Added `src/app/opengraph-image.tsx` — edge-runtime, 1200×630, brand-aligned. Uses a soft warm gradient background (`#fbf5f2` → `#ffffff` → `#fbf5f2`), brand-red eyebrow with site name, large serif headline ("Method, not miracle."), supporting tagline, and footer with `thesingaporeway.com` + author credit. No external font fetch — falls back to system serif to keep the edge render fast and dependency-free.
- Added per-page `metadata` to every marketing route:
  - `/` — "Method, not miracle" + framework description.
  - `/thebook` — "The Book" + 17-chapter framework summary.
  - `/learn` — "Learn" + course/podcast/blog summary.
  - `/apply` — "Apply" + kits + adaptation framing.
  - `/teach` — "Teach" + 17 case studies framing.
  - `/about` — "About" + method/mindset framing.
  - `/online-course` — "Online Course — Coming Soon" + interim alternatives.
  - `/blog` — "Blog" + clear-lessons framing.
- Refactored the six `"use client"` pages into Server Component page wrappers + sibling client child components, so each page can export `metadata`:
  - `/ideate/page.tsx` (Server) → `/ideate/IdeateClient.tsx` (Client). Renames the iframe-handshake component.
  - `/podcasts/page.tsx` (Server) → `/podcasts/PodcastsClient.tsx` (Client). Audio playback state preserved.
  - `/localization-kits/page.tsx` (Server) → `/localization-kits/LocalizationKitsClient.tsx` (Client). Filter + RequestModal preserved.
  - `/possibilities/page.tsx` (Server) → `/possibilities/PossibilitiesClient.tsx` (Client). RequestModal preserved.
  - `/teaching-materials/page.tsx` (Server) → `/teaching-materials/TeachingMaterialsClient.tsx` (Client). All 17 case studies + per-card expand state preserved.
  - `/q-a/page.tsx` (Server) → `/q-a/QAClient.tsx` (Client). FAQ accordion preserved.
  - The refactor was done by `mv`-renaming each file (preserving content exactly) and writing a thin server wrapper that exports `metadata` and renders the client child.
- Added `generateMetadata` to `src/app/blog/[slug]/page.tsx`: per-post title (post.title), description (post.excerpt), canonical (`/blog/<slug>`). Unknown slugs return a noindex `Post not found` metadata block so they don't pollute search results.
- Added `robots: { index: false, follow: false }` to all five auth pages via `pageMetadata({ ..., noindex: true })`:
  - `/login`, `/signup`, `/forgot-password`, `/update-password`, `/account`.
  These are also disallowed in `robots.ts` for belt-and-braces.
- Did not change copy, layout, behavior, public URLs, or assets. Did not start security headers, CSP, rate-limiting, CAPTCHA, CI, or PostHog event capture.

### Files changed in this Phase 12 pass
- `.env.example`
- `src/lib/seo/site.ts` (new)
- `src/lib/seo/page-metadata.ts` (new)
- `src/app/layout.tsx`
- `src/app/sitemap.ts` (new)
- `src/app/robots.ts` (new)
- `src/app/opengraph-image.tsx` (new)
- `src/app/page.tsx`
- `src/app/thebook/page.tsx`
- `src/app/learn/page.tsx`
- `src/app/apply/page.tsx`
- `src/app/teach/page.tsx`
- `src/app/about/page.tsx`
- `src/app/online-course/page.tsx`
- `src/app/blog/page.tsx`
- `src/app/blog/[slug]/page.tsx`
- `src/app/ideate/page.tsx` (now Server) + `src/app/ideate/IdeateClient.tsx` (new, was `page.tsx`)
- `src/app/podcasts/page.tsx` (now Server) + `src/app/podcasts/PodcastsClient.tsx` (new, was `page.tsx`)
- `src/app/localization-kits/page.tsx` (now Server) + `src/app/localization-kits/LocalizationKitsClient.tsx` (new, was `page.tsx`)
- `src/app/possibilities/page.tsx` (now Server) + `src/app/possibilities/PossibilitiesClient.tsx` (new, was `page.tsx`)
- `src/app/teaching-materials/page.tsx` (now Server) + `src/app/teaching-materials/TeachingMaterialsClient.tsx` (new, was `page.tsx`)
- `src/app/q-a/page.tsx` (now Server) + `src/app/q-a/QAClient.tsx` (new, was `page.tsx`)
- `src/app/login/page.tsx`, `src/app/signup/page.tsx`, `src/app/forgot-password/page.tsx`, `src/app/update-password/page.tsx`, `src/app/account/page.tsx` (added noindex metadata)
- `MIGRATION_STATE.md`

### Commands run in this Phase 12 pass
- `git branch --show-current` — confirmed `codex/migrate-next15-architecture`.
- `git status --short` — captured pre-edit worktree.
- `Read` of `src/lib/request-origin.ts`, all 14 marketing pages, all 5 auth pages, `src/app/layout.tsx`, `.env.example`.
- `mv` for each of the six client page renames.
- `corepack pnpm run typecheck` — passed.
- `corepack pnpm run build` — passed; 37 routes emitted. Sentry CLI also re-uploaded source maps because `.env.local` has Sentry build vars present.
- `git status --short` — captured post-edit worktree.

### Build/typecheck result
- Latest `corepack pnpm run typecheck`: passed.
- Latest `corepack pnpm run build`: passed.
- Route table emitted by the build (37 total):
  - **Static (`○`):** `/`, `/about`, `/apply`, `/blog`, `/ideate`, `/learn`, `/localization-kits`, `/online-course`, `/podcasts`, `/possibilities`, `/q-a`, `/teach`, `/teaching-materials`, `/thebook`, `/_not-found`, `/sitemap.xml`, `/robots.txt`.
  - **SSG (`●`):** `/blog/[slug]` with 15 prerendered slugs.
  - **Dynamic (`ƒ`):** `/account`, `/api/contact`, `/api/newsletter`, `/forgot-password`, `/login`, `/signup`, `/update-password`, `/opengraph-image`.
- Per-route page weights are unchanged from Phase 11 (the SEO additions are SSR-only and add 0 KB to client bundles). The six client-page refactors did not change client bundle sizes — the move-the-file approach kept identical code on the client side.
- Build emitted one expected informational warning: `⚠ Using edge runtime on a page currently disables static generation for that page` — this is the OG image, which is rendered on-demand by design.

### Known risks and deferred work
- `NEXT_PUBLIC_SITE_URL` should be set in the Vercel project environment to the real production origin (e.g. `https://thesingaporeway.com`) before launch. Without it, `metadataBase`, the sitemap, robots, and the OG image will all fall back to `http://localhost:3000`, which would publish broken canonical URLs.
- The dynamic OG image renders fast but uses generic system serif because no font is bundled into the edge runtime. If the brand requires Libre Baskerville specifically on the OG card, a follow-up phase can fetch the font from `next/font` and embed it via `ImageResponse`'s `fonts` option.
- Per-post canonical metadata on `/blog/[slug]` uses `post.excerpt` as the description verbatim. If any excerpt exceeds ~160 chars, search engines may truncate; current excerpts are well under that.
- The `/teaching-materials` and `/localization-kits` page refactors split the existing client code into two files but did NOT split the giant inline case-studies data array. Bundle size on `/teaching-materials` remains ~11.6 kB of client JS for the 17 case studies — same as before. A future cleanup could move the data into a `.json` or separate `*.data.ts` module.
- JSON-LD `Organization` schema currently lists only one `sameAs` (maherkaddoura.com). Add real social profiles (LinkedIn, X/Twitter, YouTube, etc.) when they're confirmed.
- `SITE_TWITTER_HANDLE` is set to `@thesingaporeway` as a sensible default. If the real handle differs, update `src/lib/seo/site.ts`.
- The OG image is currently site-wide — every page uses the same default OG card. Per-page `opengraph-image.tsx` files (e.g. `src/app/blog/[slug]/opengraph-image.tsx` for per-post OG cards with post title) are a polish-pass enhancement; not in this phase.
- Sitemap `priority` and `changeFrequency` values are guidance to crawlers, not commitments. Adjust as content cadence becomes clearer.
- The discovered-but-never-implemented legacy routes (`/post/[slug]`, `/quick-bites`, `/thank-you`, `/user-dashboard`, `/ar`, `/ar/*`) still need an explicit decision before Phase 13/14 cleanup.
- No security headers, CSP, rate-limiting, CAPTCHA, CI workflow, or final migration report was started.

### Exact next step
Proceed to **Phase 13 only**: security headers + CI.
- Add `headers()` in `next.config.ts` returning `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`, `Permissions-Policy` (deny camera/microphone/geolocation by default), and a starter `Content-Security-Policy` that allows `'self'` plus the third-party origins this site actually uses (Supabase auth, PostHog, Sentry, Mailchimp, Resend webhook origins, the Railway-hosted Ideate iframe, the Wixstatic podcast/video CDNs).
- Add rate limiting to `/api/newsletter` and `/api/contact` (Upstash Redis recommended; Vercel KV acceptable). Use a per-IP token bucket; return `429` with a friendly JSON body on exceedance.
- Add Cloudflare Turnstile to the Footer newsletter form and `RequestModal` (server-side verify in the route handlers; client widget in the form).
- Add `.github/workflows/ci.yml` running `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm build` on every PR. Add `gitleaks-action` for committed-secret detection. Cache the pnpm store.
- Do **not** start Phase 14 (final build/typecheck verification) or Phase 15 (final migration report) until Phase 13 lands.

## Phase 13 handoff snapshot

### Work completed
- **Security headers + CSP in `next.config.ts`**:
  - Added an `async headers()` returning a single `source: '/:path*'` rule with:
    - `X-Frame-Options: DENY`
    - `X-Content-Type-Options: nosniff`
    - `Referrer-Policy: strict-origin-when-cross-origin`
    - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (2 years, preload-eligible)
    - `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`
    - `Content-Security-Policy` covering `default-src 'self'`, plus per-directive allow-lists for the third-party origins this site actually uses today: Supabase (`https://*.supabase.co` + `wss://*.supabase.co`), PostHog (`https://us.i.posthog.com`, `https://eu.i.posthog.com`), Sentry (`https://*.sentry.io`, `https://*.ingest.sentry.io`), Cloudflare Turnstile (`https://challenges.cloudflare.com`), Wixstatic media (`https://static.wixstatic.com`), Railway-hosted Ideate iframe (`https://sg-way-ai-agent.up.railway.app`).
  - `script-src` and `style-src` include `'unsafe-inline'` because Next.js hydration scripts and Framer Motion inline styles require it. `script-src` also includes `'unsafe-eval'` because some bundled deps need it. Tightening to a nonce-based CSP is a future refactor (requires middleware-level header rewriting).
  - `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`, `object-src 'none'`, `upgrade-insecure-requests` for defense-in-depth alongside `X-Frame-Options`.
- **Rate limiting** with Upstash Redis:
  - Installed `@upstash/ratelimit` (2.0.8) + `@upstash/redis` (1.38.0).
  - Added `src/lib/rate-limit.ts` exposing `checkRateLimit(identifier, { prefix, limit, window })` and `clientIpFromRequest(request)`. Limiters are cached per `prefix` so each route reuses the same instance. When `UPSTASH_REDIS_REST_URL` or `UPSTASH_REDIS_REST_TOKEN` is missing, the limiter returns `{ success: true, ... }` with permissive defaults so dev/preview environments without Redis still accept submissions.
  - Wired into `src/app/api/newsletter/route.ts` and `src/app/api/contact/route.ts` with a sliding-window of 5 requests per minute per IP. On exceedance: `429` JSON with a friendly message and a `Retry-After` header derived from `result.reset`.
  - IP resolution falls back from `x-forwarded-for` → `x-real-ip` → `0.0.0.0` to stay safe under any reverse proxy (Vercel sets `x-forwarded-for`).
- **Cloudflare Turnstile** (CAPTCHA on public forms):
  - Added `src/lib/turnstile/verify.ts` (`'server-only'`) with `verifyTurnstileToken(token, remoteIp?)` returning `{ ok: true, configured: false }` when `TURNSTILE_SECRET_KEY` is absent, `{ ok: false, reason: 'missing-token' | 'invalid-token' | 'network-error' }` on real failures, and `{ ok: true, configured: true }` when Cloudflare confirms the token via the `siteverify` endpoint.
  - Added `src/components/TurnstileWidget.tsx` — `'use client'` component that loads `https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit` via `next/script` and calls `window.turnstile.render()` once on mount, holding the callback in a ref so the widget never re-renders when its parent re-renders. Renders nothing when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is absent. Accepts `theme: 'light' | 'dark' | 'auto'` so the dark Footer and light RequestModal each get appropriate styling.
  - Wired into `src/components/Footer.tsx` (dark theme) and `src/components/RequestModal.tsx` (light theme). When `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set, the submit button stays disabled until the user solves the challenge.
  - Wired server-side verification into `/api/newsletter` and `/api/contact`. The form posts now include `turnstileToken` alongside the zod-validated payload; the routes destructure it before validation, verify it against Cloudflare, and return `401` with a friendly message if verification fails.
- **`.env.example`** now documents the four new variables:
  - `UPSTASH_REDIS_REST_URL`
  - `UPSTASH_REDIS_REST_TOKEN`
  - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (browser; widget hidden when empty)
  - `TURNSTILE_SECRET_KEY` (server-only; verification skipped when empty)
- **CI** workflow at `.github/workflows/ci.yml`:
  - Triggers: `pull_request`, `push` to `main`, `workflow_dispatch`.
  - Concurrency group cancels in-progress runs on the same ref to save minutes.
  - Two jobs:
    - `build`: checkout → setup pnpm 10.12.1 → setup Node 20 with pnpm cache → `pnpm install --frozen-lockfile` → `pnpm run typecheck` → `pnpm run build`. `NEXT_TELEMETRY_DISABLED=1`. `NODE_OPTIONS=--max-old-space-size=4096` so the build doesn't OOM on the default GitHub runner.
    - `gitleaks`: checkout with full history → `gitleaks/gitleaks-action@v2`.
  - The build job runs without any provider secrets because every integration is safe-no-op when its env vars are absent (Supabase, Mailchimp, Resend, Sentry source-map upload, PostHog, Upstash, Turnstile, Cloudflare).
- Did not start Phase 14 (final build/typecheck verification + smoke tests) or Phase 15 (final migration report). Did not change public URLs, copy, layout, or visible behavior. Did not enable a strict (nonce-based) CSP. Did not implement Dependabot, secret scanning toggles, or branch-protection rules — those are GitHub UI settings the project owner configures.

### Files changed in this Phase 13 pass
- `next.config.ts` — added `headers()` + CSP, kept the existing Mailchimp `serverExternalPackages` and Sentry `withSentryConfig` wrapper.
- `package.json`, `pnpm-lock.yaml` — added `@upstash/ratelimit` + `@upstash/redis`.
- `.env.example` — added Upstash + Turnstile placeholders.
- `src/lib/rate-limit.ts` (new) — Upstash sliding-window limiter + IP helper.
- `src/lib/turnstile/verify.ts` (new) — server-side Turnstile verifier.
- `src/components/TurnstileWidget.tsx` (new) — client widget.
- `src/components/Footer.tsx` — imports widget, requires token when configured, sends `turnstileToken` to `/api/newsletter`.
- `src/components/RequestModal.tsx` — imports widget, requires token when configured, sends `turnstileToken` to `/api/contact`.
- `src/app/api/newsletter/route.ts` — rate limit check → Turnstile verify → existing zod + Mailchimp flow.
- `src/app/api/contact/route.ts` — rate limit check → Turnstile verify → existing zod + Resend flow.
- `.github/workflows/ci.yml` (new) — build + gitleaks jobs.
- `MIGRATION_STATE.md`

### Commands run in this Phase 13 pass
- `git branch --show-current` — confirmed `codex/migrate-next15-architecture`.
- `git status --short` — captured pre-edit state.
- `Read` of `src/app/api/newsletter/route.ts`, `src/app/api/contact/route.ts`, `src/components/Footer.tsx`, `src/components/RequestModal.tsx`, `src/lib/validation/forms.ts`.
- `corepack pnpm add @upstash/ratelimit @upstash/redis --store-dir "C:\Users\Khalid Siddiqui\AppData\Local\pnpm\store\v10"` — passed. (Same `@sentry/cli`/`core-js`/`protobufjs` postinstall warning Codex documented in Phase 11; benign.)
- Wrote all new files listed above; edited the existing ones.
- `corepack pnpm run typecheck` — passed.
- `corepack pnpm run build` — passed; 37 routes still emit, Sentry source maps uploaded again because `.env.local` has the build vars present.
- `git status --short` — captured post-edit state.

### Build/typecheck result
- Latest `corepack pnpm run typecheck`: passed.
- Latest `corepack pnpm run build`: passed.
- Route table is identical to Phase 12 (37 routes: 15 static, 15 SSG slugs, 8 dynamic, plus `/sitemap.xml`, `/robots.txt`, `/opengraph-image`).
- Per-route page weights are essentially unchanged from Phase 12. `/localization-kits` and `/possibilities` ticked up by ~0.1–1 KB because they mount the modal which now imports `TurnstileWidget`. The Turnstile CDN script itself is only fetched in the browser when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set.
- The `⚠ Using edge runtime on a page currently disables static generation for that page` info-level warning for `/opengraph-image` still appears (unchanged, by design).

### Known risks and deferred work
- **CSP `'unsafe-inline'` / `'unsafe-eval'`** in `script-src` are a deliberate compromise to keep Next.js hydration + Framer Motion working without a nonce-based rewrite. They are still better than no CSP at all (the directive still blocks unknown third-party origins), but a future refactor should move to per-request nonces injected via middleware. Tracking issue is implicit in this snapshot.
- **CSP allow-list reflects today's third-party usage.** Adding any new third-party (e.g. Stripe, Cal.com, YouTube embeds, Vercel Analytics) requires extending the relevant directive — otherwise it will be blocked in the browser console. Sentry org `86400-7v` / project `javascript-nextjs` ingests under `*.ingest.sentry.io` which is already allowed.
- **Rate limiter no-ops without Upstash provisioned.** Until `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set in the Vercel project, the abuse-prevention layer on `/api/newsletter` and `/api/contact` is effectively disabled. Provision an Upstash Redis (or Vercel KV — adapter is similar) before launch.
- **Turnstile no-ops without the two env vars.** Until `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` are set, the widget doesn't render and the server skips verification. Provision a Turnstile site in the Cloudflare dashboard, copy the keys, and set them in Vercel before launch.
- **Turnstile sitekey is read on the client via `process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY`** — this is the standard pattern but means a build redeploy is required if you change it. Vercel triggers a redeploy when env vars change, so this is fine in practice.
- **`Content-Security-Policy` is applied to every route via `/:path*`** including API and OG image routes. If a future route handler needs to set its own CSP (rare), it can override per-route via `headers()` rules above the wildcard.
- **No Dependabot / GitHub secret-scanning config** is checked in. Those toggles live in the GitHub repo Settings UI under Security. Recommend enabling: Dependabot security updates, Dependabot version updates, and Secret scanning push protection.
- **CI runs against a public clean install** — no Vercel preview, no Lighthouse/PSI step. Phase 14 should add a manual checklist (or a Lighthouse CI step) confirming the deployed Preview hits the perf budget in tech-architecture.md.
- **`gitleaks-action`** v2 emits a SARIF report. Pushing protection (blocking secret-bearing pushes) is a separate GitHub UI toggle.
- **Branch protection on `main`** (require PR, require CI green, no force-push) is configured in the GitHub UI; CLAUDE.md / WORKFLOW.md document the policy.
- **The discovered-but-never-implemented legacy routes** (`/post/[slug]`, `/quick-bites`, `/thank-you`, `/user-dashboard`, `/ar`, `/ar/*`) still need an explicit decision (implement, 301-redirect via `next.config.ts` `async redirects()`, or document as out of scope) before Phase 14 launch verification.

### Exact next step
Proceed to **Phase 14 only**: final build/typecheck verification of the complete migration end-to-end.
- From a clean state: `rm -rf .next && corepack pnpm install --frozen-lockfile && corepack pnpm run typecheck && corepack pnpm run build`. Confirm both pass.
- Smoke-test every public route in dev (`corepack pnpm run dev`): confirm `/`, `/thebook`, `/learn`, `/apply`, `/teach`, `/ideate`, `/about`, `/online-course`, `/podcasts`, `/localization-kits`, `/possibilities`, `/teaching-materials`, `/q-a`, `/blog`, a handful of `/blog/[slug]` routes, `/sitemap.xml`, `/robots.txt`, `/opengraph-image` all return 200 and look correct.
- Smoke-test API routes: `POST /api/newsletter` and `POST /api/contact` with valid payloads (with and without `turnstileToken`).
- Confirm security headers ship on the production build with `curl -I http://localhost:3000/` (after `pnpm start`). Verify all six headers + the CSP appear.
- Confirm `/account` server-redirects to `/login?next=/account` when unauthenticated; confirm sign-in flow end-to-end with a disposable Supabase user.
- Confirm `.env.local` is in `.gitignore` and no secret was committed (`git log -p .env.local` should fail with "no such path").
- Confirm the CI workflow passes against a real PR (open one against this branch into a throwaway branch or `main` and verify the green check).
- Make the explicit decision on the discovered legacy routes (`/post/[slug]`, `/quick-bites`, `/thank-you`, `/user-dashboard`, `/ar`, `/ar/*`) — implement, 301-redirect, or document as out of scope. Add the chosen approach to `next.config.ts` (`async redirects()`) or to the launch checklist.
- Verify `NEXT_PUBLIC_SITE_URL` is set in the Vercel project to the real production origin so `metadataBase`, sitemap, robots, and OG canonical URLs point at production.
- Verify Supabase Auth redirect URLs in the Supabase dashboard include `<origin>/login`, `<origin>/update-password`, `<origin>/account` for both the production origin and any Vercel preview URLs you want to allow.
- Verify Resend sending domain is verified (SPF + DKIM + DMARC) before launch — required for `/api/contact` to deliver email.
- Do not start Phase 15 (final migration report) until Phase 14's checklist is green. Phase 15 is the wrap-up document.

## Phase 14 handoff snapshot

### Work completed
Phase 14 is verification, not new feature work. The pass surfaced and fixed two real bugs from earlier phases (see below) and produced a green end-to-end smoke result.

#### Clean-state build verification
- `corepack pnpm install --frozen-lockfile --store-dir "..."` — passed. Lockfile is in sync with `package.json`; no install drift.
- `rm -rf .next && corepack pnpm run typecheck` — passed cleanly from a fresh state.
- `corepack pnpm run build` — passed; 37 routes emitted exactly as in Phase 13.

#### Bugs caught and fixed
1. **Phase 12 OG image bug.** `src/app/opengraph-image.tsx` used `display: 'inline-block'` on the brand-red dot `<span>`. Satori (the OG renderer behind `next/og`) only accepts `display: 'flex' | 'block' | 'none' | '-webkit-box'`. The error did not surface at build time because the OG route uses edge runtime and is rendered on-demand (`ƒ` in the build summary). It first appeared at runtime when `curl /opengraph-image` returned an empty reply and the server logged `Invalid value for CSS property "display"`. **Fix:** changed `display: 'inline-block'` → `display: 'flex'` (visual result identical for a 12×12 dot).
2. **Phase 11 Sentry navigation hook deprecation.** `@sentry/nextjs` 10.x now expects every project to export `onRouterTransitionStart = Sentry.captureRouterTransitionStart` from `instrumentation-client.ts` to instrument App Router client-side navigations. The server emitted an `ACTION REQUIRED` log on every boot. **Fix:** added the one-line export.

#### Production-server smoke test (`pnpm start --hostname 127.0.0.1 --port 3000`)
All routes verified after the two fixes above landed.

| Route | Expected | Actual |
|---|---|---|
| `/`, `/thebook`, `/learn`, `/apply`, `/teach`, `/ideate`, `/about`, `/online-course`, `/podcasts`, `/localization-kits`, `/possibilities`, `/teaching-materials`, `/q-a`, `/blog` | 200 | 200 (14/14) |
| `/blog/what-is-the-singapore-way` (representative slug) | 200 | 200 |
| `/sitemap.xml`, `/robots.txt`, `/opengraph-image` | 200 | 200 (3/3) |
| `/account` unauthenticated | 307 → `/login?next=/account` | 307, location matches |
| `/login`, `/signup`, `/forgot-password`, `/update-password` | 200 | 200 (4/4) |
| `POST /api/newsletter` with `{}` (bad payload) | 400 + zod message | 400 `{"ok":false,"message":"Invalid input"}` |
| `POST /api/contact` with `{}` (bad payload) | 400 + zod message | 400 `{"ok":false,"message":"Invalid input"}` |
| `POST /api/newsletter` with valid `{firstName,email}` | 200 or 502/503 depending on Mailchimp config | 502 (reached Mailchimp, fake test email rejected — route is wired correctly) |

#### Security headers verification
`curl -sI` against both `/` (static) and `/api/newsletter` (dynamic route handler) returns all six Phase 13 headers verbatim:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`
- Full `Content-Security-Policy` with all 12 directives (default-src, script-src, style-src, img-src, font-src, connect-src, frame-src, media-src, frame-ancestors, base-uri, form-action, object-src, upgrade-insecure-requests) and the allow-listed origins for Supabase, PostHog (us+eu), Sentry, Cloudflare Turnstile, Wixstatic, and the Railway-hosted Ideate iframe.

#### Rate limit smoke
Ten rapid `POST /api/newsletter` calls all returned 400 (zod validation rejecting empty payload), confirming the rate-limit module no-ops correctly in dev without Upstash provisioned. The safe-placeholder pattern lets dev/preview environments work without Redis; in production the limiter activates as soon as `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` are set.

#### SEO endpoint content verification
- `GET /robots.txt` returns the expected User-Agent rules, Allow `/`, Disallow `/api/`, `/account`, `/login`, `/signup`, `/forgot-password`, `/update-password`, plus the `Sitemap:` line. Origin shown is from `NEXT_PUBLIC_SITE_URL` (currently `http://localhost:3000`; must be set to the real production origin in Vercel).
- `GET /sitemap.xml` returns 29 `<url>` entries: 14 marketing routes + 15 known blog slugs. Each URL uses the configured site origin.
- `GET /opengraph-image` returns 200 with `Content-Type: image/png` (1200×630 brand-aligned card).

#### Secrets / gitignore audit
- `.gitignore` lists `.env`, `.env.local`, `.env.*.local` (lines 19–21).
- `git log --all -- .env.local .env .env.*.local` returns no history → never committed.
- `git check-ignore -v .env.local` → ignored by `.gitignore:20`.
- `git ls-files | grep ^.env` → only `.env.example` is tracked.
- High-risk secret-pattern scan across all tracked files (`sb_secret_`, `service_role`, `sk_live_`, `sk_test_*`, `xkeysib-`, SendGrid keys, AWS access keys, Google OAuth tokens) → only `WORKFLOW.md` matches, and both matches are documentation explicitly describing what NOT to do, not real secret values.
- `.env.example` audit: every var either has an empty value or a safe default (`http://localhost:3000`, `https://us.i.posthog.com`). No real secret values were checked in.

#### Decision: discovered-but-unimplemented routes
The migration audit found five route patterns referenced in the scraped legacy content that were never implemented in the original React Router `App.tsx`:
- `/post/[slug]`
- `/quick-bites`
- `/thank-you`
- `/user-dashboard`
- `/ar` and `/ar/*`

**Decision: all five are out of scope for launch. No 301 redirects added. They will return Next.js 404s.**

Rationale:
- None of these routes were ever live in the React Router SPA. They appeared only in the audit's scraped content (likely from an even older site iteration or planned-but-unbuilt content).
- A 404 is the correct response for content that does not exist. A misdirected redirect is worse than a 404 because it sends users to unrelated content and dilutes search relevance.
- Without confirmation that real users have bookmarks pointing at these URLs, a redirect is guessing at intent.
- `/ar` and `/ar/*` (Arabic content) would require translated copy, locale routing infrastructure (`next-intl` or built-in i18n), and reviewed Arabic editorial content — a multi-week feature, not a launch-blocking item.

**Override path:** if the team wants any of these served before launch, add an `async redirects()` to `next.config.ts`:
```ts
async redirects() {
  return [
    { source: '/post/:slug', destination: '/blog/:slug', permanent: true },
    { source: '/user-dashboard', destination: '/account', permanent: true },
  ]
}
```
The two highest-confidence candidates are `/post/:slug` → `/blog/:slug` (legacy blog URL pattern) and `/user-dashboard` → `/account` (legacy account URL). The other three (`/quick-bites`, `/thank-you`, `/ar*`) have no clean target.

### Files changed in this Phase 14 pass
- `src/app/opengraph-image.tsx` — `display: 'inline-block'` → `display: 'flex'` on the brand-red dot.
- `instrumentation-client.ts` — added `export const onRouterTransitionStart = Sentry.captureRouterTransitionStart`.
- `MIGRATION_STATE.md`

### Commands run in this Phase 14 pass
- `git branch --show-current` — confirmed `codex/migrate-next15-architecture`.
- `corepack pnpm install --frozen-lockfile --store-dir "..."` — lockfile clean.
- `rm -rf .next && corepack pnpm run typecheck` — passed.
- `corepack pnpm run build` (×2: once before fixes to capture the route table, once after fixes to confirm clean) — passed.
- `corepack pnpm run start --hostname 127.0.0.1 --port 3000` (background, ×2) — first run logged the OG `display` error and the Sentry deprecation, second run logged neither.
- `curl` smoke test of 18 public/SEO routes + 5 auth routes + 2 API routes (both with bad and valid payloads) + 10× rate-limit smoke.
- `curl -sI` against `/` and `/api/newsletter` to verify all six security headers ship on both static and dynamic routes.
- `git log --all -- .env.local .env .env.*.local`, `git check-ignore -v .env.local`, `git ls-files | grep ^.env`, and a regex scan of tracked files for high-risk secret patterns.
- `taskkill //PID … //F` to stop the background server cleanly after each smoke pass.

### Build/typecheck result
- Latest `corepack pnpm run typecheck`: passed (clean fresh-state run).
- Latest `corepack pnpm run build`: passed (clean fresh-state run, no deprecation warnings after the Sentry fix).
- Latest production-server smoke: all 23 verified URLs returned the expected status codes; security headers verified live.

### Pre-launch checklist (for the project owner — Phase 14 cannot complete these from this branch)

**Vercel environment variables.** Set in the Vercel project settings for both Production and Preview environments. Required for the corresponding integration to leave safe-placeholder mode:
- [ ] `NEXT_PUBLIC_SITE_URL` → real production origin (e.g. `https://thesingaporeway.com`). Without this, `metadataBase`, sitemap, robots, and OG canonical URLs all resolve to `http://localhost:3000`.
- [ ] `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (auth pages 500 without these).
- [ ] `MAILCHIMP_API_KEY` + `MAILCHIMP_SERVER_PREFIX` + `MAILCHIMP_AUDIENCE_ID` (newsletter form returns 503 without these).
- [ ] `RESEND_API_KEY` + `RESEND_FROM_EMAIL` + `RESEND_TO_EMAIL` (request modal returns 503 without these).
- [ ] `NEXT_PUBLIC_SENTRY_DSN` (browser + server error capture); `SENTRY_AUTH_TOKEN` + `SENTRY_ORG` + `SENTRY_PROJECT` (source-map upload at build time).
- [ ] `NEXT_PUBLIC_POSTHOG_KEY` + `NEXT_PUBLIC_POSTHOG_HOST` (analytics + session replay; PostHog stays dormant without these).
- [ ] `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (rate limiter is dormant without these; abuse-prevention layer effectively off).
- [ ] `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` (CAPTCHA dormant without these; spam-prevention layer effectively off).

**Provider configuration (outside Vercel).**
- [ ] Supabase Auth → Configuration → URL Configuration: add the production origin to the allow-list (`<origin>/login`, `<origin>/update-password`, `<origin>/account`), plus any preview-deploy origins.
- [ ] Supabase RLS: enable Row Level Security on every table with default-deny policies before any user data lands.
- [ ] Resend → Domains: verify the sending domain (SPF + DKIM + DMARC) before launch. Required for `/api/contact` to deliver.
- [ ] Mailchimp → confirm `MAILCHIMP_AUDIENCE_ID` is the correct list and the API key has audience-write permission.
- [ ] Cloudflare → create a Turnstile site, copy the site key + secret key into Vercel.
- [ ] Upstash → create a Redis database (or use Vercel KV), copy the REST URL + REST token into Vercel.
- [ ] Sentry → confirm the org/project match what's already in `.env.local`; consider enabling the Vercel ↔ Sentry integration so releases auto-link to deploys.
- [ ] PostHog → pick `us` vs `eu` host region based on audience; enable autocapture + session replay + web vitals in the project settings.

**GitHub repo configuration (UI toggles, not in repo).**
- [ ] Settings → Branches → branch protection on `main`: require PR, require CI green (Phase 13 workflow), no direct pushes, no force-push.
- [ ] Settings → Security → enable Dependabot security updates, Dependabot version updates, Secret scanning, Secret scanning push protection.
- [ ] Settings → Pages: confirm not in use (deploy is via Vercel, not GitHub Pages).

**Final pre-launch smoke (post-deploy on production URL).**
- [ ] Hit the production homepage in a browser; confirm Network panel shows no CSP violations.
- [ ] Sign up / sign in with a real address via `/signup` and `/login`; confirm cookies set and `/account` renders user info.
- [ ] Submit the Footer newsletter form; confirm subscriber lands in Mailchimp.
- [ ] Open the request modal on `/localization-kits` or `/teaching-materials`; submit; confirm Resend delivers the email.
- [ ] If Turnstile is configured: confirm the widget appears and the form rejects when not solved.
- [ ] `curl -I https://<production>/` and confirm all six security headers.
- [ ] Submit the production sitemap to Google Search Console + Bing Webmaster Tools.
- [ ] PageSpeed Insights against the homepage and a blog post; confirm LCP < 2.5s, CLS < 0.1, INP < 200ms per tech-architecture.md.

### Known risks and deferred work
- **Strict CSP (nonce-based) is still deferred.** The current CSP allows `'unsafe-inline'` + `'unsafe-eval'` in `script-src` because Next 15 hydration scripts and Framer Motion inline styles need it. Moving to per-request nonces requires middleware-level header rewriting and is a follow-up refactor.
- **CI does not run Lighthouse/PSI yet.** The pre-launch smoke (above) covers it manually. Adding a Lighthouse CI step against the Vercel preview URL is a recommended polish.
- **Five legacy routes documented as out of scope** (`/post/[slug]`, `/quick-bites`, `/thank-you`, `/user-dashboard`, `/ar`, `/ar/*`). They will 404. Override path documented above.
- **Sentry source-map upload uses the org/project found in `.env.local`** (`86400-7v` / `javascript-nextjs`). Confirm Vercel project envs match before launch so production stack traces symbolicate.
- **Disposable Supabase user from Phase 8 verification** may still exist in the Supabase project. Remove manually from the dashboard if cleanup is desired.
- **Phase 7b raw-image cleanup** is complete (all `<img>` are `next/image`); the `public/assets/` → `public/images/` move was intentionally NOT done to preserve the existing public URLs. If the brand later wants the cleaner `/images/` path, set up a redirect rule and move the files in one shot.
- **PostHog explicit event capture** (`signup`, `cta_click`, `form_submit`, `newsletter_subscribe` per tech-architecture.md) is not wired yet — autocapture covers initial coverage. Add as a polish pass once PostHog is provisioned.

### Exact next step
Proceed to **Phase 15**: final migration report.
- Phase 15 is a written summary, not a code change. It should consolidate: (a) starting state (Vite SPA, npm, Tailwind v3, React Router, browser-only Supabase), (b) ending state (Next 15 App Router, pnpm, Tailwind v4, shadcn, Framer Motion, react-hook-form + zod, Supabase SSR, Mailchimp + Resend route handlers, Sentry + PostHog, security headers + CSP + rate limit + Turnstile, CI), (c) per-phase deliverables (cross-link the handoff snapshots above), (d) explicit deferred items (strict CSP, Lighthouse in CI, PostHog explicit events, legacy routes, Arabic content), and (e) the pre-launch checklist from this snapshot.
- Phase 15 should not introduce any new code. If it surfaces an issue, treat it as a Phase 14b verification miss and fix before writing the report.

## Review-polish pass handoff snapshot

After Phase 15, an independent review surfaced 13 non-blocking items. The user authorised 7 of them for a targeted polish pass; the other 6 (CSP nonce refactor, Sentry source-map upload behaviour, per-post OG cards, Lighthouse CI, Twitter handle confirmation, Bagdgeted hard-coded data extraction) remain documented as follow-ups. This snapshot covers the 7 that shipped.

### Work completed
1. **`tailwind.config.js`** — removed the stale `"./index.html"` entry from the `content` array (the file was deleted in Phase 7). Tailwind v4 + `@source` continues to scan `src/**/*.{js,ts,jsx,tsx}` as before.
2. **`next.config.ts`** — dropped the dead `interest-cohort=()` directive from `Permissions-Policy` (FLoC was retired by Chrome). All other security headers and the CSP allow-list are unchanged.
3. **`vercel.json`** — added `"installCommand": "pnpm install --frozen-lockfile"` so Vercel uses the exact install Vercel previews already expect (matches CI).
4. **Font weight consistency (`src/app/page.tsx`)** — replaced all 5 occurrences of `font-extrabold` (Tailwind weight 800) with `font-bold` (700). DESIGN.md explicitly loads only weights 400 + 700 via `next/font`, so `font-extrabold` was being synthesised by the browser. Now the rendered weight matches what's loaded. No copy or layout change.
5. **`src/app/favicon.ico`** — added a proper 32×32 brand-red (`#C8102E`) ICO file (4286 bytes; valid ICONDIR + 32-bpp BITMAPINFOHEADER + XOR/AND masks; verified with a header dump). Next 15 App Router serves it at `/favicon.ico` via the special-file convention. The existing `metadata.icons.icon` in `src/app/layout.tsx` still points at `/assets/logo/logo-red.png` (a richer PNG for visible tabs); both coexist as Next emits multiple `<link rel="icon">` tags. Legacy crawlers and link previewers no longer 404 on `/favicon.ico`.
6. **Supabase graceful missing-env handling** — added `isSupabaseConfigured(): boolean` to both `src/lib/supabase/client.ts` and `src/lib/supabase/server.ts`. The original throw-on-missing-env behaviour inside `createClient()` is preserved as a loud safety rail for accidental misuse. Added a new shared `src/components/AuthUnavailableNotice.tsx` (renders `<PageHero>` + a short explanatory paragraph). All 5 auth page entry-points now early-return the notice when `isSupabaseConfigured()` is false:
   - `src/app/login/page.tsx`
   - `src/app/signup/page.tsx`
   - `src/app/forgot-password/page.tsx`
   - `src/app/update-password/page.tsx`
   - `src/app/account/page.tsx`
   When Supabase env IS present, behaviour is unchanged (server checks `auth.getUser()`, redirects authenticated users, mounts the existing forms). On Vercel Preview without `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` set, the 5 auth pages now return 200 with the unavailable notice instead of 500.
7. **ESLint** — installed `eslint` ^9.39.4 (downgraded from the initial 10.x install to stay inside the peer-dep ranges declared by `eslint-plugin-import` / `-jsx-a11y` / `-react` that `eslint-config-next` pulls in transitively) plus `eslint-config-next` ^16.2.6. Added a flat-config `eslint.config.mjs` composing `next/core-web-vitals` + `next/typescript` (both ship native flat configs in `eslint-config-next` 16 — no `@eslint/eslintrc` `FlatCompat` bridge needed). Added `"lint": "eslint ."` to `package.json` and a `Lint` step to `.github/workflows/ci.yml` between Typecheck and Build. Chose `eslint .` over `next lint` because `next lint` was deprecated in Next 15 and removed in Next 16; the flat-config + direct ESLint command is the forward-compatible path.

### ESLint rules tuned
The initial lint run surfaced 37 errors + 3 warnings, almost all stylistic:
- **`react/no-unescaped-entities`** — 35 errors across 13 files. The editorial copy uses straight `'` and `"` characters consistently; escaping them to `&apos;` / `&quot;` is a no-op for the rendered browser output and would create a massive diff. Set to `'off'` project-wide with a comment explaining why. This is a standard exception for editorial-content sites.
- **`import/no-anonymous-default-export`** — fired on `tailwind.config.js`. Set to `'off'` for `*.config.{js,mjs,ts}` only via a `files`-scoped block. Idiomatic exception for config files.
- **`react-hooks/set-state-in-effect`** (real fix, not disabled) — fired on `src/components/TurnstileWidget.tsx`. The Phase 13 pattern called `setScriptReady(true)` from a mount `useEffect` when `window.turnstile` was already loaded. Replaced with a `useState<boolean>(() => typeof window !== 'undefined' && !!window.turnstile)` lazy initializer that seeds the same value synchronously at first render, eliminating the cascading-render risk. Behaviour is identical; one fewer `useEffect`.

After these rule tunes and the Turnstile fix, lint passes with zero errors and zero warnings.

### Files changed in this pass
- `tailwind.config.js` — drop stale `index.html` content entry.
- `next.config.ts` — drop `interest-cohort=()` from Permissions-Policy.
- `vercel.json` — add `installCommand`.
- `src/app/page.tsx` — `font-extrabold` × 5 → `font-bold`.
- `src/app/favicon.ico` (new, 4286-byte 32×32 brand-red ICO).
- `src/lib/supabase/client.ts` — add `isSupabaseConfigured()`.
- `src/lib/supabase/server.ts` — add `isSupabaseConfigured()`.
- `src/components/AuthUnavailableNotice.tsx` (new shared component).
- `src/app/login/page.tsx`, `src/app/signup/page.tsx`, `src/app/forgot-password/page.tsx`, `src/app/update-password/page.tsx`, `src/app/account/page.tsx` — import + early-return on `!isSupabaseConfigured()`.
- `src/components/TurnstileWidget.tsx` — replace `useEffect` "is script already loaded" check with `useState` lazy initializer.
- `package.json` — add `eslint` + `eslint-config-next` devDeps and `"lint": "eslint ."` script.
- `pnpm-lock.yaml` — regenerated for the eslint additions.
- `eslint.config.mjs` (new flat config).
- `.github/workflows/ci.yml` — add Lint step between Typecheck and Build.
- `MIGRATION_STATE.md`.

### Commands run
- `git branch --show-current` — confirmed `codex/migrate-next15-architecture`.
- `git status --short` — pre/post snapshots.
- File reads: every file listed in the polish-pass prompt.
- `corepack pnpm add -D eslint eslint-config-next @eslint/eslintrc --store-dir "..."` — initial install with eslint 10.x.
- Peer-dep inspection showed `eslint-plugin-import` / `-jsx-a11y` / `-react` only support eslint ≤ 9.
- `corepack pnpm remove @eslint/eslintrc --store-dir "..."` — removed unused FlatCompat bridge (eslint-config-next 16 ships native flat config).
- `corepack pnpm add -D eslint@^9 --store-dir "..."` — pinned to 9.39.4.
- `corepack pnpm install --frozen-lockfile --store-dir "..."` — verified lockfile clean.
- `corepack pnpm run lint` — initially 37 errors + 3 warnings, then green after rule tunes + Turnstile fix.
- `corepack pnpm run typecheck` — passed.
- `corepack pnpm run build` — passed; 38 routes emitted (the new `favicon.ico` route adds one to the table).
- Inline `node -e` to generate the brand-red ICO (no script committed to the repo).
- Inline `node -e` to dump the ICO header for verification.

### Build / typecheck / lint result
- `pnpm install --frozen-lockfile`: passed.
- `pnpm run lint`: passed (0 errors, 0 warnings).
- `pnpm run typecheck`: passed.
- `pnpm run build`: passed; 38 routes emitted (15 static `○`, 15 SSG `●` blog slugs, 8 dynamic `ƒ`, plus `favicon.ico`). Shared First Load JS baseline ticked to ~183 kB (incidental from this build's chunk reshuffle, not from polish-pass code). Sentry source-map upload completed.

### Remaining risks
- **None of the 6 risks called out in the review changed.** Specifically:
  - CSP still uses `'unsafe-inline'` + `'unsafe-eval'` (nonce refactor deferred).
  - Sentry source-map upload still runs on every local build when `.env.local` has the build vars.
  - 10 unreferenced assets in `public/assets/` (6 new editorial photos the user added + 4 legacy variants).
  - Sitemap / robots / OG still default to `http://localhost:3000` if `NEXT_PUBLIC_SITE_URL` isn't set in Vercel.
  - `SITE_TWITTER_HANDLE` is still hard-coded.
  - CI has no Lighthouse / perf check.
- **New small risk:** the `AuthUnavailableNotice` copy is hard-coded English. If/when the site adds i18n, this will need translation.
- **ESLint rule tunes:** `react/no-unescaped-entities` is OFF project-wide. If editorial copy is later normalised to curly quotes / smart apostrophes, the rule can be re-enabled.
- **Brand-red favicon** is a flat 32×32 solid square. Functional but not artful; replace with a real logomark when the brand has one sized for 32×32 / 16×16.

### Next recommended step
Branch is ready for review and a Vercel Preview push. Recommended order:
1. Set `NEXT_PUBLIC_SITE_URL` plus at minimum `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in the Vercel project's Preview environment (the rest of the env-var checklist in `MIGRATION_REPORT.md` becomes blocking only as you exercise the corresponding features).
2. Push the branch and open a PR. CI now runs install + typecheck + lint + build + gitleaks.
3. Smoke-test the Preview URL: homepage, blog, an auth page, the Footer newsletter, a RequestModal submit. Check the Network tab for any CSP-blocked third-party request.
4. After Preview is green, the pre-launch checklist in `MIGRATION_REPORT.md` is the runway to production.
