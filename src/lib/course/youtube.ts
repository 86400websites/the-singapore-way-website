// Narrow YouTube URL handling for the course player. Only the URL shapes the
// approved video tracker uses (youtu.be short links, youtube.com/watch,
// youtube.com/embed) are accepted, and the extracted ID is validated against
// YouTube's 11-character ID alphabet before it is ever interpolated into an
// iframe src — an unexpected database value can never become a frame target.

const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/

export function parseYouTubeId(url: string): string | null {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return null
  }

  if (parsed.protocol !== 'https:') return null

  const host = parsed.hostname.toLowerCase()
  let candidate: string | null = null

  if (host === 'youtu.be') {
    candidate = parsed.pathname.split('/')[1] ?? null
  } else if (
    host === 'www.youtube.com' ||
    host === 'youtube.com' ||
    host === 'm.youtube.com' ||
    host === 'www.youtube-nocookie.com'
  ) {
    if (parsed.pathname === '/watch') {
      candidate = parsed.searchParams.get('v')
    } else if (parsed.pathname.startsWith('/embed/')) {
      candidate = parsed.pathname.split('/')[2] ?? null
    }
  }

  if (!candidate) return null
  return YOUTUBE_ID_PATTERN.test(candidate) ? candidate : null
}

// Privacy-enhanced embed host; rel=0 keeps end-screen suggestions to the same
// channel. No autoplay parameter — playback is always user-initiated.
export function youTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`
}
