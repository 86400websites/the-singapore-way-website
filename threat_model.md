# Threat Model

## Project Overview

The Singapore Way is a static React 18 + TypeScript + Vite single-page application that serves editorial and educational content about the book and framework of the same name. In the current production scope there is no backend, authentication, database, payments, admin panel, or third-party API integration; the application renders bundled content and local assets to public visitors.

Production assumptions for this scan:
- Production traffic is terminated over Replit-managed TLS.
- The app is not currently deployed from this workspace.
- Only code that would ship in a production build is in scope.
- Vite development-server settings are dev-only unless a production path explicitly uses them.

## Assets

- **Site integrity and published content** — visitors rely on the site to present accurate editorial content and links. Any client-side injection that altered rendered content would directly affect user trust.
- **Visitor-entered contact details** — the footer and localization-kit pages collect email/name values in local component state. These fields do not currently submit anywhere, but if wired up later they would become personal data worth protecting.
- **Brand reputation and outbound trust** — external links and public messaging are part of the site’s trust surface. Malicious script injection or unsafe redirects would harm visitors and the brand even without a backend.
- **Build-time configuration and bundled code** — secrets or privileged endpoints accidentally embedded in the frontend bundle would be publicly exposed to every visitor.

## Trust Boundaries

- **Browser to bundled SPA** — every route is public and executes entirely in the visitor’s browser. URL parameters, DOM state, and any future form inputs are untrusted.
- **Source content to rendered UI** — local TypeScript data files and asset paths are rendered into the DOM. These values must remain treated as data and not be interpreted as HTML or script.
- **Production build to development tooling** — `vite.config.ts` contains dev-server settings (`host: '0.0.0.0'`, `allowedHosts: true`) that are relevant for local development but are not part of the static production artifact.
- **Public site to external destinations** — outbound links to Amazon, the author site, Google Fonts, and `mailto:` URLs cross from the site into third-party-controlled destinations.

## Scan Anchors

- **Production entry points:** `index.html`, `src/main.tsx`, `src/App.tsx`
- **Public routes:** `src/pages/**/*.tsx`, especially `src/pages/BlogPost.tsx` and `src/data/blogPosts.ts` for the only dynamic route parameter lookup
- **User-input UI without backend persistence:** `src/components/Footer.tsx`, `src/pages/LocalizationKits.tsx`
- **Dev-only areas usually out of scope:** `vite.config.ts` dev server settings, local preview/dev scripts in `package.json`

## Threat Categories

### Tampering

Because this is a public client-only SPA, the main tampering risk is client-side content injection. URL parameters and any future CMS/form data must never be rendered with `dangerouslySetInnerHTML`, assigned to `innerHTML`, or passed into script-capable DOM sinks. Dynamic routing in `src/pages/BlogPost.tsx` must remain a lookup over trusted local content rather than a mechanism for interpreting user-controlled markup.

Required guarantees:
- Route parameters and form inputs MUST be treated as untrusted data.
- Rendered content MUST remain plain React text/attributes, not raw HTML injection.
- Any future form submission or CMS integration MUST validate and sanitize untrusted content before rendering.

### Information Disclosure

There is no backend or database in the present architecture, so the primary disclosure risk is accidental publication of secrets, internal endpoints, or personal data in the frontend bundle. Any value shipped in client code should be assumed public.

Required guarantees:
- Secrets, API keys, tokens, and private endpoints MUST NOT be embedded in frontend code or static assets.
- Error handling and future analytics integrations MUST NOT expose stack traces, credentials, or sensitive visitor data in the browser.
- Any future collection of names/emails MUST be sent only to an explicitly reviewed backend or third-party form handler and must not be logged or stored in the bundle.

### Spoofing

The current production site has no authentication boundary, so classic account spoofing is not applicable. The remaining spoofing concern is misleading navigation or unsafe outbound flows that could make visitors believe they are still interacting with the site when they have been sent elsewhere.

Required guarantees:
- External links opened in a new tab MUST preserve safe opener behavior.
- Future contact/signup flows MUST clearly identify the receiving party before collecting visitor data.

### Elevation of Privilege

There are no privileged roles or server-side actions in the present build, so privilege-escalation threats are largely absent. The main future-facing guarantee is that any later introduction of admin, auth, or API features would create a new trust boundary and require a refreshed threat model before release.

Required guarantees:
- Production releases MUST NOT assume client-side route structure provides access control.
- Any future authenticated or administrative feature MUST add server-side authorization before being considered in production scope.
