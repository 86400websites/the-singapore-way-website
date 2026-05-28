import type { Metadata } from 'next'
import Link from 'next/link'

import CertificateView from '@/components/course/CertificateView'
import { getPublicCertificate } from '@/lib/course/queries'
import { pageMetadata } from '@/lib/seo/page-metadata'

export const dynamic = 'force-dynamic'

type VerifyPageProps = {
  params: Promise<{ certificateId: string }>
}

// The verification page intentionally noindex's. The learner can share the
// URL directly; we do not want every cert to be discoverable via search,
// which would expose every learner's display name in indices.
export async function generateMetadata({ params }: VerifyPageProps): Promise<Metadata> {
  const { certificateId } = await params
  return pageMetadata({
    title: 'Certificate verification',
    description: 'Verify a course completion certificate.',
    path: `/certificates/${certificateId}`,
    noindex: true,
  })
}

export default async function VerifyCertificatePage({ params }: VerifyPageProps) {
  const { certificateId } = await params

  // Cheap shape guard before round-tripping to the RPC. UUIDs are 36 chars
  // with dashes; reject obvious garbage early to avoid noisy RPC calls.
  if (!isLikelyUuid(certificateId)) {
    return <CertificateNotFound certificateId={certificateId} />
  }

  const cert = await getPublicCertificate(certificateId)
  if (!cert) {
    return <CertificateNotFound certificateId={certificateId} />
  }

  return (
    <section className="bg-[#fbf5f2]">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <header className="mb-8 md:mb-10 text-center">
          <p className="eyebrow mb-3">Certificate verification</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#111111] leading-[1.15] tracking-[-0.01em]">
            This certificate is verified.
          </h1>
          <p className="lede mt-4 max-w-xl mx-auto">
            Issued by The Singapore Way. The details below match our records.
          </p>
        </header>

        <CertificateView
          certificateId={cert.id}
          courseTitle={cert.courseTitle}
          learnerName={cert.learnerDisplayName}
          issuedAt={cert.issuedAt}
          variant="verify"
        />

        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          <Link href="/" className="btn-pill-outline">
            About The Singapore Way
          </Link>
        </div>
      </div>
    </section>
  )
}

function isLikelyUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
}

function CertificateNotFound({ certificateId }: { certificateId: string }) {
  return (
    <section className="bg-[#fbf5f2] min-h-[calc(100vh-70px)] flex items-center">
      <div className="max-w-2xl mx-auto px-5 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
        <div className="card-editorial p-10 md:p-14 text-center">
          <p className="eyebrow mb-4">Not found</p>
          <h1 className="text-2xl md:text-3xl font-bold text-[#111111] leading-[1.15] tracking-[-0.01em] mb-5">
            We couldn&rsquo;t verify that certificate.
          </h1>
          <span className="editorial-rule mx-auto mb-7" aria-hidden="true" />
          <p className="lede mb-7 max-w-xl mx-auto">
            The code <span className="font-mono text-[#444444] break-all">{certificateId}</span>{' '}
            doesn&rsquo;t match a certificate on file. Double-check the code and try again, or
            ask the holder to share a fresh verification link.
          </p>
          <Link href="/" className="btn-pill">
            Back to The Singapore Way
          </Link>
        </div>
      </div>
    </section>
  )
}
