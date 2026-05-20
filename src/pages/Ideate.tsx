import { useEffect, useRef, useState } from 'react'

const ASSISTANT_URL =
  'https://sg-way-ai-agent.up.railway.app/frontend/ai-agent.html?embed=true&hide_header=true'

export default function Ideate() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const [iframeHeight, setIframeHeight] = useState(1400)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (!e.data || typeof e.data !== 'object') return
      if (e.data.type === 'SGW_IFRAME_HEIGHT') {
        const h = parseInt(String(e.data.height), 10)
        if (!isNaN(h) && h > 400 && h < 10000) {
          setIframeHeight(h)
        }
      }
    }
    window.addEventListener('message', onMessage)

    // Nudge the iframe a few times after load in case it needs a prompt to report height
    const timers = [400, 1200, 2400].map((delay) =>
      window.setTimeout(() => {
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'SGW_IFRAME_HEIGHT_REQUEST' },
          '*'
        )
      }, delay)
    )

    return () => {
      window.removeEventListener('message', onMessage)
      timers.forEach((t) => window.clearTimeout(t))
    }
  }, [])

  return (
    <div className="bg-white">
      {/* Compact header — keep editorial framing, hand most height to the iframe */}
      <section className="bg-[#fbf5f2] border-b border-[#ECECEC]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="max-w-3xl">
            <p className="eyebrow mb-4">Ideate</p>
            <h1 className="text-3xl sm:text-4xl md:text-[44px] font-bold text-[#111111] leading-[1.12] tracking-[-0.01em] mb-5">
              The Singapore Way Assistant
            </h1>
            <span className="editorial-rule mb-5" aria-hidden="true" />
            <p className="text-[16px] md:text-[18px] text-[#555555] leading-[1.7] max-w-2xl">
              Strategic analysis and consulting powered by Singapore's proven principles. Describe your challenge, attach context, and explore tailored recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Iframe container */}
      <section className="bg-[#F5F5F5] py-8 md:py-12 border-t border-[#ECECEC]">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden border border-[#ECECEC] bg-white shadow-[0_8px_28px_-12px_rgba(17,17,17,0.12)]">
            {!loaded && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-white z-10"
                aria-hidden="true"
              >
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-[13px] text-[#888888] tracking-[0.06em] uppercase font-bold">Loading assistant…</p>
                </div>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={ASSISTANT_URL}
              title="The Singapore Way Assistant"
              loading="lazy"
              onLoad={() => setLoaded(true)}
              allow="clipboard-read; clipboard-write"
              className="block w-full border-0 bg-white"
              style={{ height: `${iframeHeight}px`, minHeight: '700px' }}
            />
          </div>
          <p className="text-[12px] text-[#888888] mt-4 text-center sm:text-left">
            Powered by The Singapore Way Assistant. If the embed fails to load,{' '}
            <a
              href={ASSISTANT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C8102E] font-bold hover:underline"
            >
              open it in a new tab
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  )
}
