import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import AuthUnavailableNotice from '@/components/AuthUnavailableNotice'
import PageHero from '@/components/PageHero'
import { pageMetadata } from '@/lib/seo/page-metadata'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import AccountActions from './AccountActions'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = pageMetadata({
  title: 'Account',
  description: 'Your Singapore Way account.',
  path: '/account',
  noindex: true,
})

export default async function AccountPage() {
  if (!isSupabaseConfigured()) {
    return <AuthUnavailableNotice />
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/account')
  }

  return (
    <>
      <PageHero
        eyebrow="Account"
        title="Your account"
        description="You are signed in."
        variant="light"
      />
      <section className="bg-white">
        <div className="max-w-md mx-auto px-5 sm:px-6 lg:px-8 py-12">
          <dl className="space-y-3 mb-8">
            <div>
              <dt className="text-xs font-bold tracking-[0.12em] text-gray-500 uppercase">Email</dt>
              <dd className="text-[15px] text-[#111111] mt-1 break-all">{user.email ?? '-'}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold tracking-[0.12em] text-gray-500 uppercase">User ID</dt>
              <dd className="text-[13px] text-gray-600 mt-1 break-all font-mono">{user.id}</dd>
            </div>
          </dl>

          <AccountActions />
        </div>
      </section>
    </>
  )
}
