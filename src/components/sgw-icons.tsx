import type { ReactNode } from 'react'

/**
 * Shared inline-SVG icon system for the Apply/Teach card pages.
 *
 * The Case Studies page (`TeachingMaterialsClient`) established the look:
 * a single 24×24 stroke icon rendered inside a cream block. This module
 * exposes that same renderer plus two keyed icon sets so Localization Kits
 * and Examples render the same premium icons instead of emoji.
 */
export const iconStroke = (path: ReactNode) => (
  <svg
    className="w-8 h-8 sm:w-9 sm:h-9"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    {path}
  </svg>
)

/**
 * Thematic icons keyed by Localization Kit tag. Each path matches the
 * corresponding Case Studies chapter so the same topic reads identically
 * across pages.
 */
export const themeIcons: Record<string, ReactNode> = {
  'leadership-and-governance': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 21h14M6 21V10l6-5 6 5v11M10 21v-6h4v6" />
  ),
  'smart-housing': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.5 12 4l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-9.5Z" />
  ),
  'economic-transformation': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l5-5 4 4 8-8M14 8h6v6" />
  ),
  'talent-development-and-education': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4 2 9l10 5 10-5-10-5Zm-6 7v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4M22 9v6" />
  ),
  'public-health-and-healthcare-system': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 21V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14M12 9v6M9 12h6M3 21h18" />
  ),
  'smart-nation': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 3v6m12-6v6M6 15v6m12-6v6M3 6h6M3 18h6m6-12h6m-6 12h6M9 9h6v6H9z" />
  ),
  'urban-mobility-and-sustainable-transport': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm-2 4h12M9 19l-1 2m8-2 1 2M9 15h.01M15 15h.01" />
  ),
  'water-and-resource-management': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11Z" />
  ),
  'business-and-trade-hub': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18v12H3V7Zm6 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12h18" />
  ),
  'public-trust-and-governance': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a4 4 0 0 0-4 4v3H6a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-2V7a4 4 0 0 0-4-4Zm0 8v4" />
  ),
  'national-identity': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v17M4 4h13l-2 4 2 4H4" />
  ),
  'green-strategy': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 20c0-7 5-13 14-13-1 9-7 14-14 13Zm0 0c2-4 5-7 9-9" />
  ),
  'fostering-innovation-and-entrepreneurship': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 18h6m-5 3h4M12 3a6 6 0 0 0-4 10.5c1 1 1.5 2 1.5 3.5h5c0-1.5.5-2.5 1.5-3.5A6 6 0 0 0 12 3Z" />
  ),
  'culture-and-arts-in-nation-building': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a9 9 0 0 0 0 18c1.5 0 2-1 2-2s-.5-1.5-.5-2.5.5-1.5 2-1.5h2A4.5 4.5 0 0 0 22 10C21.5 6 17 3 12 3Z" />
  ),
  'harnessing-technology-for-the-future': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Zm1-3h4v3h-4V4Zm-1 11h.01M15 15h.01M5 11v4m14-4v4" />
  ),
  'civic-engagement-and-community-building': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm6 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 20c0-2.5 2.5-5 6-5s6 2.5 6 5M14 15c2.5 0 6 1.5 7 5" />
  ),
}

/** Scenario icons for the Examples page, keyed by use-case slug. */
export const exampleIcons: Record<string, ReactNode> = {
  'climate-by-design': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 22v-7m0 0c-3 0-5-2-5-5 3 0 5 2 5 5Zm0 0c0-3 2-5 5-5 0 3-2 5-5 5Z" />
  ),
  'digital-twins': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4 4 8l8 4 8-4-8-4ZM4 12l8 4 8-4M4 16l8 4 8-4" />
  ),
  'from-informal-to-investable': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l5-5 4 4 8-8M14 8h6v6" />
  ),
  'my-city-my-chapter': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.5A8 8 0 1 1 21 12Z" />
  ),
  'redesigning-the-state': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 21h14M6 21V10l6-5 6 5v11M10 21v-6h4v6" />
  ),
  'roots-in-the-sky': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.5 12 4l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-9.5Z" />
  ),
  'smart-streets-safe-cities': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
  ),
  'sovereignty-as-strategy': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm3-12-2.5 5L7 16l2.5-5L15 9Z" />
  ),
  'city-as-a-service': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 3 5 14h5l-1 7 9-12h-5l1-6Z" />
  ),
  'from-learning-to-earning': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4 2 9l10 5 10-5-10-5Zm-6 7v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4M22 9v6" />
  ),
  'scenario-labs': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6M10 3v5l-4.5 9A2 2 0 0 0 7.3 20h9.4a2 2 0 0 0 1.8-3l-4.5-9V3M8 14h8" />
  ),
  'unity-by-platform': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20s-6.5-4.2-9-8.2A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 9 4.8C18.5 15.8 12 20 12 20Z" />
  ),
}

/** Fallback icon when a key is missing — keeps layout stable. */
export const fallbackIcon = iconStroke(
  <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
)
