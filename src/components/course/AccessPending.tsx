import Link from 'next/link'

type AccessPendingProps = {
  courseTitle: string
  courseHref: string
  // If the enrollment row exists but is set to 'revoked', the operator can
  // distinguish the messaging for the learner.
  variant?: 'pending' | 'revoked'
  // The signed-in learner's email, used so they can confirm they're on the
  // right account and forward it to the operator if needed.
  email: string | null
}

export default function AccessPending({
  courseTitle,
  courseHref,
  variant = 'pending',
  email,
}: AccessPendingProps) {
  const isRevoked = variant === 'revoked'

  return (
    <section className="bg-[#fbf5f2] min-h-[calc(100vh-70px)] flex items-center">
      <div className="max-w-2xl mx-auto px-5 sm:px-6 lg:px-8 py-16 md:py-24 text-center w-full">
        <div className="card-editorial p-10 md:p-14">
          <span
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#fbf5f2] border border-[#F0E5DF] mb-8"
            aria-hidden="true"
          >
            <svg className="w-7 h-7 text-[#C8102E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d={
                  isRevoked
                    ? 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z'
                    : 'M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z'
                }
              />
            </svg>
          </span>
          <p className="eyebrow mb-4">{isRevoked ? 'Access paused' : 'Access pending'}</p>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#111111] leading-[1.15] tracking-[-0.01em] mb-5">
            {isRevoked
              ? 'Your access to this course is currently paused.'
              : 'Your access is being enabled.'}
          </h1>
          <span className="editorial-rule mx-auto mb-7" aria-hidden="true" />
          <p className="lede mb-7 max-w-xl mx-auto">
            {isRevoked ? (
              <>
                Your account is signed in, but your enrollment in <strong>{courseTitle}</strong> has
                been paused. Please contact our team and we will look into it.
              </>
            ) : (
              <>
                Your account is signed in, but your enrollment in <strong>{courseTitle}</strong> has
                not yet been confirmed. Our team enables enrollment manually during this first
                release. You will be able to start as soon as we confirm your access.
              </>
            )}
          </p>
          {email && (
            <p className="text-sm text-[#666666] leading-[1.65] mb-9">
              Signed in as <span className="font-semibold text-[#111111] break-all">{email}</span>.
            </p>
          )}
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="mailto:info@thesingaporeway.com?subject=Course%20enrollment%20access"
              className="btn-pill"
            >
              Contact our team
            </Link>
            <Link href={courseHref} className="btn-pill-outline">
              Back to course page
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
