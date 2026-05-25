import { ImageResponse } from 'next/og'

import { SITE_NAME, SITE_TAGLINE } from '@/lib/seo/site'

export const runtime = 'edge'
export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '88px 96px',
          background: 'linear-gradient(135deg, #fbf5f2 0%, #ffffff 60%, #fbf5f2 100%)',
          color: '#111111',
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: '9999px',
              background: '#C8102E',
              display: 'flex',
            }}
          />
          <span
            style={{
              fontSize: 22,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              fontWeight: 700,
              color: '#C8102E',
            }}
          >
            The Singapore Way
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 28,
            maxWidth: 980,
          }}
        >
          <div
            style={{
              fontSize: 92,
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: '-0.01em',
              color: '#111111',
              display: 'flex',
            }}
          >
            Method, not miracle.
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.45,
              color: '#444444',
              display: 'flex',
            }}
          >
            Practical principles for leaders, educators, and change-makers across the Global Majority.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontSize: 22,
            color: '#666666',
          }}
        >
          <span>thesingaporeway.com</span>
          <span style={{ color: '#111111', fontWeight: 700 }}>By Maher Kaddoura</span>
        </div>
      </div>
    ),
    size,
  )
}
