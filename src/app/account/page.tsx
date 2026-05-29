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

  return (
    <>
      <PageHero
        eyebrow="Account"
        title="Your account"
        description="You are signed in."
        variant="light"
        image="/assets/account/my-account-hero.png"
        imageAlt="Editorial illustration representing your Singapore Way account"
        priority
      />
      <section className="bg-[#F5F5F5] border-t border-[#ECECEC] py-14 md:py-20">
        <div className="max-w-md mx-auto px-5 sm:px-6 lg:px-8">
          <div className="card-editorial p-8 md:p-10">
            <Link
              href="/my-learning"
              className="btn-pill w-full mb-8"
            >
              Go to My Learning
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
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>

            <dl className="space-y-5 mb-8">
              <div>
                <dt className="text-[11px] font-bold tracking-[0.14em] text-[#666666] uppercase">Email</dt>
                <dd className="text-[15px] text-[#111111] mt-1.5 break-all">{user.email ?? '-'}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold tracking-[0.14em] text-[#666666] uppercase">User ID</dt>
                <dd className="text-[13px] text-[#666666] mt-1.5 break-all font-mono">{user.id}</dd>
              </div>
            </dl>

            <AccountActions />
          </div>
        </div>
      </section>
    </>
  )
}
