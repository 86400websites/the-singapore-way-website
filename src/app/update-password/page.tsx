import type { Metadata } from 'next'

import AuthUnavailableNotice from '@/components/AuthUnavailableNotice'
import PageHero from '@/components/PageHero'
import { pageMetadata } from '@/lib/seo/page-metadata'
import { isSupabaseConfigured } from '@/lib/supabase/server'
import UpdatePasswordForm from './UpdatePasswordForm'

export const metadata: Metadata = pageMetadata({
  title: 'Update password',
  description: 'Choose a new password for your Singapore Way account.',
  path: '/update-password',
  noindex: true,
})

export default function UpdatePasswordPage() {
  if (!isSupabaseConfigured()) {
    return <AuthUnavailableNotice />
  }

  return (
    <>
      <PageHero
        eyebrow="Account"
        title="Set a new password"
        description="Choose a new password for your account."
        variant="light"
      />
      <section className="bg-white">
        <div className="max-w-md mx-auto px-5 sm:px-6 lg:px-8 py-12">
          <UpdatePasswordForm />
        </div>
      </section>
    </>
  )
}
