import { useEffect, useState } from 'react'

interface RequestModalProps {
  onClose: () => void
  kind: string
  description?: string
}

export default function RequestModal({ onClose, kind, description }: RequestModalProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName || !email || !consent) return
    setSubmitted(true)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-12 sm:pt-16 px-5 bg-[#111111]/40 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="request-modal-title"
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-[0_30px_60px_-20px_rgba(17,17,17,0.4)] border border-[#ECECEC] my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-9 h-9 rounded-full text-[#666666] hover:bg-[#F5F5F5] hover:text-[#111111] transition-colors flex items-center justify-center"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-7 md:p-9">
          {submitted ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-[#fbf5f2] flex items-center justify-center mx-auto mb-5">
                <svg className="w-7 h-7 text-[#C8102E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 id="request-modal-title" className="text-2xl font-bold text-[#111111] mb-3 leading-[1.2]">
                Thanks — we've got your request.
              </h2>
              <p className="text-[15px] text-[#666666] leading-[1.65] mb-6">
                This request form is being connected soon. We'll follow up at{' '}
                <span className="text-[#111111] font-bold">{email}</span> as soon as email delivery is live.
              </p>
              <button onClick={onClose} className="btn-pill" type="button">Close</button>
            </div>
          ) : (
            <>
              <p className="eyebrow mb-3">Request</p>
              <h2 id="request-modal-title" className="text-2xl md:text-3xl font-bold text-[#111111] leading-[1.2] mb-2">
                Get the {kind}
              </h2>
              <p className="text-[15px] text-[#666666] leading-[1.65] mb-6">
                {description || `Share your details and we'll email you the full set as soon as delivery is live.`}
              </p>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="req-fn" className="block text-[12px] font-bold tracking-[0.08em] uppercase text-[#666666] mb-1.5">
                      First name <span className="text-[#C8102E]">*</span>
                    </label>
                    <input
                      id="req-fn"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      autoFocus
                      className="w-full border border-[#E5E5E5] rounded-xl px-4 py-3 text-[15px] text-[#111111] focus:outline-none focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E]/20 bg-[#FAFAFA] transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="req-ln" className="block text-[12px] font-bold tracking-[0.08em] uppercase text-[#666666] mb-1.5">
                      Last name
                    </label>
                    <input
                      id="req-ln"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full border border-[#E5E5E5] rounded-xl px-4 py-3 text-[15px] text-[#111111] focus:outline-none focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E]/20 bg-[#FAFAFA] transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="req-email" className="block text-[12px] font-bold tracking-[0.08em] uppercase text-[#666666] mb-1.5">
                    Email <span className="text-[#C8102E]">*</span>
                  </label>
                  <input
                    id="req-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border border-[#E5E5E5] rounded-xl px-4 py-3 text-[15px] text-[#111111] focus:outline-none focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E]/20 bg-[#FAFAFA] transition-colors"
                  />
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    required
                    className="mt-1 accent-[#C8102E]"
                  />
                  <span className="text-[14px] text-[#444444] leading-snug">
                    I agree to receive emails from <span className="font-bold text-[#111111]">The Singapore Way</span>.
                  </span>
                </label>
                <div className="pt-2">
                  <button type="submit" className="btn-pill w-full sm:w-auto">
                    Send my request
                  </button>
                </div>
                <p className="text-[12px] text-[#888888] leading-snug">
                  Note: email delivery is being connected soon — your details will be queued for follow-up.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
