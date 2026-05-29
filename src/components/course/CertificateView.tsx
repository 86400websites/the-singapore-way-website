import Image from 'next/image'
import Link from 'next/link'

import { SITE_LOGO_PATH, SITE_NAME, absoluteUrl } from '@/lib/seo/site'

type CertificateViewProps = {
  certificateId: string
  courseTitle: string
  learnerName: string
  issuedAt: string
  /**
   * `own` is the learner's view of their own certificate. Includes a verify
   * link to share. `verify` is the public verification page itself — shows a
   * "verified" badge and does not link to itself.
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
      className="relative rounded-3xl overflow-hidden bg-white border border-[#ECECEC] shadow-[0_28px_60px_-32px_rgba(17,17,17,0.22)]"
    >
      {/* Top accent rule */}
      <div className="h-1.5 bg-[#C8102E]" aria-hidden="true" />

      <div className="px-7 md:px-14 lg:px-20 py-10 md:py-16 lg:py-20">
        <div className="flex flex-col items-center text-center">
          <Image
            src={SITE_LOGO_PATH}
            alt={SITE_NAME}
            width={160}
            height={98}
            className="h-12 md:h-14 w-auto mb-8 md:mb-10"
            priority
          />

          <p className="text-[11px] md:text-[12px] font-bold tracking-[0.32em] text-[#666666] uppercase">
            Certificate of Completion
          </p>
          <span className="block w-12 h-[2px] bg-[#C8102E] rounded-full mt-5 mb-9" aria-hidden="true" />

          <p className="text-[13px] md:text-[14px] tracking-[0.06em] text-[#666666] uppercase">
            issued to
          </p>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#111111] leading-[1.15] tracking-[-0.005em] mt-4 mb-10 max-w-2xl break-words">
            {learnerName}
          </h1>

          <p className="text-[13px] md:text-[14px] tracking-[0.06em] text-[#666666] uppercase">
            for successfully completing
          </p>
          <h2 className="text-xl md:text-2xl lg:text-[28px] font-bold text-[#111111] leading-[1.25] mt-3 max-w-2xl">
            {courseTitle}
          </h2>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-14 mt-12 md:mt-16">
            <div className="sm:text-right">
              <dt className="text-[11px] font-bold tracking-[0.14em] text-[#666666] uppercase">
                Date issued
              </dt>
              <dd className="text-[15px] text-[#111111] mt-2 tabular-nums">
                <time dateTime={issuedAt}>{formatIssuedAt(issuedAt)}</time>
              </dd>
            </div>
            <div className="sm:text-left">
              <dt className="text-[11px] font-bold tracking-[0.14em] text-[#666666] uppercase">
                Certificate code
              </dt>
              <dd className="text-[13px] md:text-[14px] text-[#444444] mt-2 font-mono break-all">
                {certificateId}
              </dd>
            </div>
          </dl>

          {variant === 'verify' ? (
            <div className="mt-12 md:mt-14 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C7E6D4] bg-[#E8F5EE] text-[#0a8553] text-[11px] font-bold tracking-[0.14em] uppercase">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Verified
            </div>
          ) : (
            <div className="mt-12 md:mt-14 flex flex-col sm:flex-row items-center gap-3">
              <Link href={verifyUrl} className="btn-pill">
                Open verification page
              </Link>
              <span className="text-[12px] text-[#888888] break-all max-w-md">
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
