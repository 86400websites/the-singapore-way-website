import type { Metadata } from 'next'

import AuthUnavailableNotice from '@/components/AuthUnavailableNotice'
import PageHero from '@/components/PageHero'
import { getRequestOrigin } from '@/lib/request-origin'
import { pageMetadata } from '@/lib/seo/page-metadata'
import { isSupabaseConfigured } from '@/lib/supabase/server'
import ForgotPasswordForm from './ForgotPasswordForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = pageMetadata({
  title: 'Forgot password',
  description: "We'll email you a secure link to set a new password.",
  path: '/forgot-password',
  noindex: true,
})

export default async function ForgotPasswordPage() {
  if (!isSupabaseConfigured()) {
    return <AuthUnavailableNotice />
  }

  const origin = await getRequestOrigin()

  return (
    <>
      <PageHero
        eyebrow="Account"
        title="Reset your password"
        description="We'll email you a secure link to set a new password."
        variant="light"
      />
      <section className="bg-white">
        <div className="max-w-md mx-auto px-5 sm:px-6 lg:px-8 py-12">
          <ForgotPasswordForm origin={origin} />
        </div>
      </section>
    </>
  )
}
