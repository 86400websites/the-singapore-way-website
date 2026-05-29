import type { Metadata } from 'next'
import Link from 'next/link'
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

  // Friendly name from existing auth metadata only — no extra query, no fallback invented.
  const userMeta = user.user_metadata ?? {}
  const displayName =
    typeof userMeta.full_name === 'string' && userMeta.full_name.trim()
      ? (userMeta.full_name as string)
      : typeof userMeta.name === 'string' && userMeta.name.trim()
        ? (userMeta.name as string)
        : null

  return (
    <>
      <PageHero
        eyebrow="Account"
        title="My Account"
        description="Manage your learning and account from one place."
        variant="light"
        image="/assets/account/my-account-hero.png"
        priority
      />
      <section className="bg-[#F5F5F5] border-t border-[#ECECEC] py-14 md:py-20">
        <div className="max-w-md mx-auto px-5 sm:px-6 lg:px-8">
          <div className="card-editorial p-8 md:p-10">
            {/* Profile summary */}
            <div className="mb-8">
              <p className="eyebrow mb-3">{displayName ? 'Welcome back' : 'Signed in as'}</p>
              {displayName && (
                <p className="text-xl md:text-2xl font-bold text-[#111111] leading-tight mb-1.5">
                  {displayName}
                </p>
              )}
              <p className="text-[15px] text-[#444444] break-all">{user.email ?? '—'}</p>
            </div>

            {/* Primary action */}
            <Link href="/my-learning" className="btn-pill w-full mb-4">
              Go to My Learning
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            <AccountActions />
          </div>
        </div>
      </section>
    </>
  )
}
