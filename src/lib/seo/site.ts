export const SITE_NAME = 'The Singapore Way'

export const SITE_TAGLINE = 'Method, not miracle.'

export const SITE_DESCRIPTION =
  "Singapore's success wasn't a miracle—it was a method. The Singapore Way turns that method into practical principles for leaders, educators, and change-makers across the Global Majority."

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') ?? 'http://localhost:3000'

export const SITE_LOGO_PATH = '/assets/logo/logo-red.png'

export const SITE_TWITTER_HANDLE = '@thesingaporeway'

export const SITE_AUTHOR = 'Maher Kaddoura'

export function absoluteUrl(path = '/') {
  const normalised = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalised}`
}
