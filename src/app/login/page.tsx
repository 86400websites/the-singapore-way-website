import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import AuthUnavailableNotice from '@/components/AuthUnavailableNotice'
import PageHero from '@/components/PageHero'
import { getSafeRedirectPath } from '@/lib/auth/redirects'
import { pageMetadata } from '@/lib/seo/page-metadata'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import LoginForm from './LoginForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = pageMetadata({
  title: 'Sign in',
  description: 'Sign in to your Singapore Way account.',
  path: '/login',
  noindex: true,
})

type LoginPageProps = {
  searchParams?: Promise<{
    next?: string | string[]
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
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

  return (
    <>
      <PageHero
        eyebrow="Account"
        title="Sign in"
        description="Sign in to access your account."
        variant="light"
      />
      <section className="bg-white">
        <div className="max-w-md mx-auto px-5 sm:px-6 lg:px-8 py-12">
          <LoginForm redirectTo={redirectTo} />
        </div>
      </section>
    </>
  )
}
