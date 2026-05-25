import PageHero from '@/components/PageHero'

export default function AuthUnavailableNotice() {
  return (
    <>
      <PageHero
        eyebrow="Account"
        title="Auth is temporarily unavailable"
        description="Auth is temporarily unavailable because Supabase is not configured."
        variant="light"
      />
      <section className="bg-white">
        <div className="max-w-md mx-auto px-5 sm:px-6 lg:px-8 py-12 text-[15px] text-[#444444] leading-[1.65]">
          <p>
            This environment is missing the Supabase URL and publishable key. Once
            they are set, sign-in, sign-up, password reset, and account pages will
            return to normal.
          </p>
        </div>
      </section>
    </>
  )
}
