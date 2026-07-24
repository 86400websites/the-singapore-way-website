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

/**
 * Fan of thin red rays for one corner, drawn for the top-left and mirrored into
 * the other three corners with scale transforms. Sized by the `--cert-corner`
 * custom property so it scales with the certificate at every breakpoint and in
 * print. Purely decorative.
 */
function CornerRays({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={`h-[var(--cert-corner)] w-[var(--cert-corner)] ${className ?? ''}`}
      fill="none"
      stroke="#C8102E"
      aria-hidden="true"
    >
      <line x1="6" y1="6" x2="106" y2="9" strokeWidth="1" strokeOpacity="0.9" />
      <line x1="6" y1="6" x2="94" y2="33" strokeWidth="1" strokeOpacity="0.45" />
      <line x1="6" y1="6" x2="68" y2="68" strokeWidth="1" strokeOpacity="0.75" />
      <line x1="6" y1="6" x2="33" y2="94" strokeWidth="1" strokeOpacity="0.45" />
      <line x1="6" y1="6" x2="9" y2="106" strokeWidth="1" strokeOpacity="0.9" />
    </svg>
  )
}

/**
 * Letterspaced caps flanked by thin hairlines, e.g. "This certificate is
 * proudly presented to". Wraps (no nowrap) so the text stays readable at 320px.
 */
function FlankedEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 md:gap-4 w-full max-w-xl">
      <span className="flex-1 min-w-3 h-px bg-[#D3CEC4]" aria-hidden="true" />
      <p className="text-[11px] md:text-[12px] tracking-[0.16em] md:tracking-[0.18em] text-[#666666] uppercase">
        {children}
      </p>
      <span className="flex-1 min-w-3 h-px bg-[#D3CEC4]" aria-hidden="true" />
    </div>
  )
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
      className="print-cert relative overflow-hidden rounded-lg bg-[#FAF9F6] shadow-[0_28px_60px_-32px_rgba(17,17,17,0.22)] [--cert-corner:52px] md:[--cert-corner:84px]"
    >
      {/* Ornamental red frame: double-line rectangle, corner ray fans, and open
          circles at the four corners where the lines meet. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-3 md:inset-4 border border-[#C8102E] rounded-[2px]" />
        <div className="absolute inset-[18px] md:inset-[24px] border border-[#C8102E]/40 rounded-[1px]" />

        <CornerRays className="absolute top-3 left-3 md:top-4 md:left-4" />
        <CornerRays className="absolute top-3 right-3 md:top-4 md:right-4 -scale-x-100" />
        <CornerRays className="absolute bottom-3 left-3 md:bottom-4 md:left-4 -scale-y-100" />
        <CornerRays className="absolute bottom-3 right-3 md:bottom-4 md:right-4 -scale-100" />

        <span className="absolute top-3 left-3 md:top-4 md:left-4 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C8102E] bg-[#FAF9F6]" />
        <span className="absolute top-3 right-3 md:top-4 md:right-4 h-2 w-2 translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C8102E] bg-[#FAF9F6]" />
        <span className="absolute bottom-3 left-3 md:bottom-4 md:left-4 h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full border border-[#C8102E] bg-[#FAF9F6]" />
        <span className="absolute bottom-3 right-3 md:bottom-4 md:right-4 h-2 w-2 translate-x-1/2 translate-y-1/2 rounded-full border border-[#C8102E] bg-[#FAF9F6]" />
      </div>

      <div className="print-cert-inner relative px-8 md:px-16 lg:px-20 py-10 md:py-14 lg:py-16">
        <div className="relative flex flex-col items-center text-center">
          <Image
            src={SITE_LOGO_PATH}
            alt={SITE_NAME}
            width={160}
            height={98}
            className="h-12 md:h-14 w-auto mb-7 md:mb-9"
            priority
          />

          <p className="font-serif font-normal text-2xl md:text-3xl lg:text-[36px] tracking-[0.16em] md:tracking-[0.22em] text-[#1A1A1A] uppercase leading-tight">
            Certificate of Completion
          </p>
          <span
            className="block w-12 h-[2px] bg-[#C8102E] rounded-full mt-4 mb-8"
            aria-hidden="true"
          />

          <FlankedEyebrow>This certificate is proudly presented to</FlankedEyebrow>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#111111] leading-[1.15] tracking-[-0.005em] mt-5 mb-8 max-w-2xl break-words">
            {learnerName}
          </h1>

          <FlankedEyebrow>For successfully completing</FlankedEyebrow>
          <p className="font-serif text-xl md:text-2xl lg:text-[30px] font-bold text-[#C8102E] leading-[1.25] mt-4 max-w-2xl">
            {courseTitle}
          </p>
          <p className="text-[11px] md:text-[12px] tracking-[0.16em] text-[#444444] uppercase mt-3">
            15 guiding principles for building systems that work
          </p>

          {/* Signature, date, and code */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-center gap-8 sm:gap-0 w-full max-w-3xl mt-10 md:mt-14">
            <div className="flex-1 flex flex-col items-center px-4">
              <p className="font-serif text-lg md:text-xl font-bold text-[#111111] leading-none border-t border-[#111111] pt-3 px-6 whitespace-nowrap">
                Maher Kaddoura
              </p>
              <p className="text-[11px] tracking-[0.1em] text-[#666666] uppercase mt-2">
                Author and Instructor
              </p>
            </div>
            <span
              className="hidden sm:block w-px h-12 bg-[#D3CEC4] self-center"
              aria-hidden="true"
            />
            <dl className="flex-1 flex flex-col-reverse items-center gap-2 px-4">
              <dt className="text-[11px] font-bold tracking-[0.14em] text-[#666666] uppercase">
                Date issued
              </dt>
              <dd className="text-[14px] md:text-[15px] text-[#111111] tabular-nums">
                <time dateTime={issuedAt}>{formatIssuedAt(issuedAt)}</time>
              </dd>
            </dl>
            <span
              className="hidden sm:block w-px h-12 bg-[#D3CEC4] self-center"
              aria-hidden="true"
            />
            <dl className="flex-1 flex flex-col-reverse items-center gap-2 px-4">
              <dt className="text-[11px] font-bold tracking-[0.14em] text-[#666666] uppercase">
                Certificate code
              </dt>
              <dd className="text-[11px] md:text-[12px] text-[#444444] font-mono break-all max-w-[24ch] print:max-w-none print:break-normal print:whitespace-nowrap">
                {certificateId}
              </dd>
            </dl>
          </div>

          {/* Bottom rule with a centred open circle */}
          <div
            className="flex items-center w-full max-w-3xl mt-10 md:mt-12"
            aria-hidden="true"
          >
            <span className="flex-1 h-px bg-[#D3CEC4]" />
            <span className="mx-3 h-2.5 w-2.5 rounded-full border border-[#C8102E] bg-[#FAF9F6]" />
            <span className="flex-1 h-px bg-[#D3CEC4]" />
          </div>

          {/* Verification */}
          {variant === 'verify' ? (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C7E6D4] bg-[#E8F5EE] text-[#0a8553] text-[11px] font-bold tracking-[0.14em] uppercase">
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
            <div className="mt-6 flex flex-col items-center gap-2">
              <p className="text-[11px] font-bold tracking-[0.16em] text-[#C8102E] uppercase">
                Verify this certificate
              </p>
              {/* Real anchor so browser print-to-PDF embeds a genuine link
                  annotation carrying the full URL. In print the URL is forced
                  onto one line; on screen it may wrap (break-all) at 320px. */}
              <a
                href={verifyUrl}
                className="focus-ring text-[12px] text-[#444444] underline decoration-[#D3CEC4] underline-offset-2 break-all max-w-md print:max-w-none print:break-normal print:whitespace-nowrap"
              >
                {verifyUrl}
              </a>
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
    </article>
  )
}
