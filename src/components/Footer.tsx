'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import TurnstileWidget from '@/components/TurnstileWidget'
import {
  newsletterSignupSchema,
  type NewsletterSignupValues,
} from '@/lib/validation/forms'

const turnstileRequired = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

export default function Footer() {
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const handleTurnstileToken = useCallback((token: string | null) => {
    setTurnstileToken(token)
  }, [])
  const form = useForm<NewsletterSignupValues>({
    resolver: zodResolver(newsletterSignupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
  })

  const onSubmit = async (values: NewsletterSignupValues) => {
    setSubmitMessage(null)
    setSubmitError(null)

    const response = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, turnstileToken }),
    })
    const result = (await response.json().catch(() => null)) as { message?: string } | null

    if (!response.ok) {
      setSubmitError(result?.message ?? 'Unable to subscribe right now. Please try again later.')
      return
    }

    form.reset()
    setTurnstileToken(null)
    setSubmitMessage(
      "Thank you for subscribing! You'll receive our newsletters and updates directly in your inbox.",
    )
  }

  return (
    <footer className="bg-[#111111] text-white">
      <div className="max-w-2xl mx-auto px-6 pt-16 pb-10">

        {/* Subscribe Card */}
        <div className="bg-[#1e1e1e] rounded-2xl p-8 mb-10 border border-white/5">
          <div className="w-8 h-[3px] bg-[#C8102E] rounded-full mb-5"></div>
          <h3 className="text-white font-bold text-xl tracking-tight mb-7">Join Thousands Applying The Singapore Way</h3>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label htmlFor="newsletter-first-name" className="block text-[11px] font-semibold text-gray-400 tracking-wider uppercase mb-1.5">
                  First Name <span className="text-[#C8102E]">*</span>
                </label>
                <input
                  id="newsletter-first-name"
                  type="text"
                  {...form.register('firstName')}
                  placeholder="Aisha"
                  className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-3.5 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#C8102E] transition-colors"
                />
                {form.formState.errors.firstName && (
                  <p className="mt-1.5 text-[11px] text-[#ff8da0]" role="alert">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="newsletter-last-name" className="block text-[11px] font-semibold text-gray-400 tracking-wider uppercase mb-1.5">Last Name</label>
                <input
                  id="newsletter-last-name"
                  type="text"
                  {...form.register('lastName')}
                  placeholder="Khan"
                  className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-3.5 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#C8102E] transition-colors"
                />
              </div>
            </div>
            <div className="mb-5">
              <label htmlFor="newsletter-email" className="block text-[11px] font-semibold text-gray-400 tracking-wider uppercase mb-1.5">
                Email Address <span className="text-[#C8102E]">*</span>
              </label>
              <input
                id="newsletter-email"
                type="email"
                {...form.register('email')}
                placeholder="you@example.com"
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-3.5 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#C8102E] transition-colors"
              />
              {form.formState.errors.email && (
                <p className="mt-1.5 text-[11px] text-[#ff8da0]" role="alert">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            {turnstileRequired && (
              <div className="mb-4">
                <TurnstileWidget onToken={handleTurnstileToken} theme="dark" />
              </div>
            )}
            {(submitError || submitMessage) && (
              <p
                className={`mb-4 text-[12px] leading-snug ${submitError ? 'text-[#ff8da0]' : 'text-gray-300'}`}
                role={submitError ? 'alert' : 'status'}
              >
                {submitError ?? submitMessage}
              </p>
            )}
            <button
              type="submit"
              disabled={
                form.formState.isSubmitting || (turnstileRequired && !turnstileToken)
              }
              className="w-full bg-[#C8102E] text-white font-bold py-3 rounded-full hover:bg-[#a50d26] transition-all duration-200 text-[13px] tracking-wide shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {form.formState.isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>

        {/* Browse FAQs */}
        <div className="text-center mb-10">
          <span className="text-gray-500 text-sm">Have a question? </span>
          <Link href="/q-a" className="border border-gray-600 text-gray-300 text-sm px-5 py-1.5 rounded-full hover:border-white hover:text-white transition-all duration-200">
            Browse FAQs
          </Link>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 mb-8"></div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 text-center mb-10">
          <div className="space-y-3">
            <Link href="/thebook" className="block text-gray-400 text-[13px] py-1 hover:text-white transition-colors">The Book</Link>
            <Link href="/possibilities" className="block text-gray-400 text-[13px] py-1 hover:text-white transition-colors">Use Cases</Link>
          </div>
          <div className="space-y-3">
            <Link href="/online-course" className="block text-gray-400 text-[13px] py-1 hover:text-white transition-colors">Online Course</Link>
            <Link href="/teaching-materials" className="block text-gray-400 text-[13px] py-1 hover:text-white transition-colors">Case Studies</Link>
          </div>
          <div className="space-y-3 col-span-2 sm:col-span-1">
            <Link href="/localization-kits" className="block text-gray-400 text-[13px] py-1 hover:text-white transition-colors">Localisation Kits</Link>
            <Link href="/podcasts" className="block text-gray-400 text-[13px] py-1 hover:text-white transition-colors">Podcast</Link>
          </div>
        </div>

        {/* Divider + Copyright */}
        <div className="border-t border-white/5 pt-6 text-center">
          <p className="text-gray-600 text-xs mb-1.5">© 2025 The Singapore Way. All rights reserved. Powered by 86400 Studio</p>
          <a href="mailto:info@thesingaporeway.com" className="text-gray-600 text-xs hover:text-gray-300 transition-colors">
            info@thesingaporeway.com
          </a>
        </div>
      </div>
    </footer>
  )
}
