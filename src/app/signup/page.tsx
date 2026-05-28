import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import AuthUnavailableNotice from '@/components/AuthUnavailableNotice'
import PageHero from '@/components/PageHero'
import { getSafeRedirectPath } from '@/lib/auth/redirects'
import { getRequestOrigin } from '@/lib/request-origin'
import { pageMetadata } from '@/lib/seo/page-metadata'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import SignUpForm from './SignUpForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = pageMetadata({
  title: 'Create account',
  description: 'Set up a free Singapore Way account to access your tools and resources.',
  path: '/signup',
  noindex: true,
})

type SignUpPageProps = {
  searchParams?: Promise<{
    next?: string | string[]
  }>
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  if (!isSupabaseConfigured()) {
    return <AuthUnavailableNotice />
  }

  const params = await searchParams
  const redirectTo = getSafeRedirectPath(params?.next)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect(redirectTo)
  }

  const origin = await getRequestOrigin()

  return (
    <>
      <PageHero
        eyebrow="Account"
        title="Create an account"
        description="Set up a free account to access your tools and resources."
        variant="light"
      />
      <section className="bg-[#F5F5F5] border-t border-[#ECECEC] py-14 md:py-20">
        <div className="max-w-md mx-auto px-5 sm:px-6 lg:px-8">
          <div className="card-editorial p-8 md:p-10">
            <SignUpForm origin={origin} redirectTo={redirectTo} />
          </div>
        </div>
      </section>
    </>
  )
}
