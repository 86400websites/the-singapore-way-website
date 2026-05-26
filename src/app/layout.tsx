import type { ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'
import { Libre_Baskerville } from 'next/font/google'

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import {
  SITE_AUTHOR,
  SITE_DESCRIPTION,
  SITE_LOGO_PATH,
  SITE_NAME,
  SITE_TWITTER_HANDLE,
  SITE_URL,
  absoluteUrl,
} from '@/lib/seo/site'
import Providers from './providers'
import '../styles/globals.css'

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-libre-baskerville',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Method, not miracle`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_AUTHOR }],
  creator: SITE_AUTHOR,
  publisher: SITE_NAME,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Method, not miracle`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Method, not miracle`,
    description: SITE_DESCRIPTION,
    creator: SITE_TWITTER_HANDLE,
    site: SITE_TWITTER_HANDLE,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: SITE_LOGO_PATH,
    apple: SITE_LOGO_PATH,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
  themeColor: '#C8102E',
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: absoluteUrl(SITE_LOGO_PATH),
  description: SITE_DESCRIPTION,
  founder: {
    '@type': 'Person',
    name: SITE_AUTHOR,
  },
  sameAs: ['https://maherkaddoura.com/english'],
}

type RootLayoutProps = {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={libreBaskerville.variable}>
      <body className="min-h-screen bg-background font-serif text-foreground antialiased">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </body>
    </html>
  )
}
