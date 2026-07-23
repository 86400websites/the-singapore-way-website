import Image from 'next/image'
import Link from 'next/link'

import { SITE_LOGO_PATH, SITE_NAME, absoluteUrl } from '@/lib/seo/site'

type CertificateViewProps = {
  certificateId: string
  courseTitle: string
  learnerName: string
  issuedAt: string
  /**
   * `own` is the learner's view of their own certificate. Includes the
   * verification URL and link to share. `verify` is the public verification
   * page itself — shows a "Verified certificate" badge and does not link to
   * itself.
   */
  variant: 'own' | 'verify'
}

function formatIssuedAt(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function CertificateView({
  certificateId,
  courseTitle,
  learnerName,
  issuedAt,
  variant,
}: CertificateViewProps) {
  const verifyUrl = absoluteUrl(`/certificates/${certificateId}`)

  return (
    <article
      aria-label={`Certificate of completion for ${courseTitle}`}
      className="print-cert relative rounded-3xl overflow-hidden bg-white border border-[#ECECEC] shadow-[0_28px_60px_-32px_rgba(17,17,17,0.22)]"
    >
      {/* Top accent rule */}
      <div className="h-1.5 bg-[#C8102E]" aria-hidden="true" />

      <div className="print-cert-inner px-7 md:px-14 lg:px-20 py-10 md:py-14 lg:py-16">
        {/* Inner hairline frame — editorial border, kept light so it prints cleanly */}
        <div
          className="pointer-events-none absolute inset-3 rounded-2xl border border-[#F0E5DF]"
          aria-hidden="true"
        />

        <div className="relative flex flex-col items-center text-center">
          <Image
            src={SITE_LOGO_PATH}
            alt={SITE_NAME}
            width={160}
            height={98}
            className="h-12 md:h-14 w-auto mb-7 md:mb-9"
            priority
          />

          <p className="font-serif text-xl md:text-2xl lg:text-[28px] font-bold tracking-[0.22em] text-[#111111] uppercase">
            Certificate of Completion
          </p>
          <span
            className="block w-12 h-[2px] bg-[#C8102E] rounded-full mt-4 mb-8"
            aria-hidden="true"
          />

          <p className="text-[12px] md:text-[13px] tracking-[0.14em] text-[#666666] uppercase">
            This certificate is presented to
          </p>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#111111] leading-[1.15] tracking-[-0.005em] mt-4 mb-8 max-w-2xl break-words">
            {learnerName}
          </h1>

          <p className="text-[12px] md:text-[13px] tracking-[0.14em] text-[#666666] uppercase">
            for successfully completing
          </p>
          <p className="font-serif text-xl md:text-2xl lg:text-[30px] font-bold text-[#C8102E] leading-[1.25] mt-3 max-w-2xl">
            {courseTitle}
          </p>
          <p className="text-[11px] md:text-[12px] tracking-[0.14em] text-[#666666] uppercase mt-3">
            15 guiding principles for building systems that work
          </p>

          {/* Signature, date, and code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-10 items-end w-full max-w-2xl mt-10 md:mt-14">
            <div className="flex flex-col items-center">
              <p className="font-serif text-lg md:text-xl font-bold text-[#111111] leading-none border-t border-[#111111] pt-3 px-6">
                Maher Kaddoura
              </p>
              <p className="text-[11px] tracking-[0.1em] text-[#666666] uppercase mt-2">
                Author and Instructor
              </p>
            </div>
            <dl className="flex flex-col-reverse items-center gap-2">
              <dt className="text-[11px] font-bold tracking-[0.14em] text-[#666666] uppercase">
                Date issued
              </dt>
              <dd className="text-[14px] md:text-[15px] text-[#111111] tabular-nums">
                <time dateTime={issuedAt}>{formatIssuedAt(issuedAt)}</time>
              </dd>
            </dl>
            <dl className="flex flex-col-reverse items-center gap-2">
              <dt className="text-[11px] font-bold tracking-[0.14em] text-[#666666] uppercase">
                Certificate code
              </dt>
              <dd className="text-[11px] md:text-[12px] text-[#444444] font-mono break-all max-w-[24ch]">
                {certificateId}
              </dd>
            </dl>
          </div>

          {/* Verification */}
          {variant === 'verify' ? (
            <div className="mt-10 md:mt-12 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C7E6D4] bg-[#E8F5EE] text-[#0a8553] text-[11px] font-bold tracking-[0.14em] uppercase">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Verified certificate
            </div>
          ) : (
            <div className="mt-10 md:mt-12 flex flex-col items-center gap-2">
              <p className="text-[11px] font-bold tracking-[0.16em] text-[#C8102E] uppercase">
                Verify this certificate
              </p>
              <p className="text-[12px] text-[#444444] break-all max-w-md">
                {verifyUrl}
              </p>
              <Link href={verifyUrl} className="btn-pill-outline no-print mt-3">
                Open verification page
              </Link>
              <span className="no-print text-[12px] text-[#888888] max-w-md">
                Share this link to let anyone verify your certificate without
                seeing your private progress.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer rule */}
      <div className="h-1 bg-[#111111]" aria-hidden="true" />
    </article>
  )
}
