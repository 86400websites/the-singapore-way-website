'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'

type Child = { label: string; href: string; desc: string }
type NavItem = { label: string; href: string; children: Child[] }

const navItems: NavItem[] = [
  { label: 'The Book', href: '/thebook', children: [] },
  {
    label: 'Learn',
    href: '/learn',
    children: [
      { label: 'Online Course', href: '/online-course', desc: 'Twelve lessons, quizzes, and a certificate.' },
      { label: 'Podcast', href: '/podcasts', desc: "Conversations on Singapore's rise." },
      { label: 'Blog', href: '/blog', desc: 'Short, practical essays you can use.' },
    ],
  },
  {
    label: 'Apply',
    href: '/apply',
    children: [
      { label: 'Localization Kits', href: '/localization-kits', desc: 'Adapt the principles to your context.' },
      { label: 'Examples', href: '/possibilities', desc: 'See the principles in real scenarios.' },
    ],
  },
  {
    label: 'Teach',
    href: '/teach',
    children: [
      { label: 'Case Studies', href: '/teaching-materials', desc: 'Seventeen studies for the classroom.' },
    ],
  },
  { label: 'Ideate', href: '/ideate', children: [] },
  { label: 'About', href: '/about', children: [] },
]

const navIcon = (path: ReactNode) => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden="true">
    {path}
  </svg>
)

const childIcons: Record<string, ReactNode> = {
  '/online-course': navIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4 2 9l10 5 10-5-10-5Zm-6 7v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4M22 9v6" />
  ),
  '/podcasts': navIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm6-3a6 6 0 0 1-12 0m6 6v3m-3 0h6" />
  ),
  '/blog': navIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 4h6l4 4v11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm6 0v4h4M9 13h6M9 17h6" />
  ),
  '/localization-kits': navIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
  ),
  '/possibilities': navIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 18h6m-5 3h4M12 3a6 6 0 0 0-4 10.5c1 1 1.5 2 1.5 3.5h5c0-1.5.5-2.5 1.5-3.5A6 6 0 0 0 12 3Z" />
  ),
  '/teaching-materials': navIcon(
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2V5Zm2 14h12" />
  ),
}

const chevron = (
  <svg
    className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
  </svg>
)

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const pathname = usePathname() ?? '/'

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  // Auth-aware nav, resolved entirely in the browser so the static site is
  // not forced dynamic. No auth logic changes — this only toggles which
  // account link is shown.
  useEffect(() => {
    if (!isSupabaseConfigured()) return
    let mounted = true
    const supabase = createClient()

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSignedIn(Boolean(data.session))
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session))
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  // Close the mobile drawer on Escape.
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  const accountHref = signedIn ? '/account' : '/login'
  const accountLabel = signedIn ? 'My Account' : 'Log in'

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-[#ECECEC] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px] gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:ring-offset-2" aria-label="The Singapore Way — home">
            <Image
              src="/assets/logo/logo-red.png"
              alt="The Singapore Way"
              width={144}
              height={88}
              className="h-10 lg:h-11 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Primary">
            {navItems.map((item) => {
              const active = isActive(item.href)
              if (item.children.length === 0) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`px-3.5 py-2 rounded-full text-[12px] font-bold tracking-[0.1em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:ring-offset-2 ${
                      active ? 'bg-[#FBF1E7] text-[#C8102E]' : 'text-[#444444] hover:text-[#C8102E] hover:bg-[#FAF8F4]'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              }
              return (
                <div key={item.label} className="relative group">
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    aria-haspopup="true"
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-bold tracking-[0.1em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:ring-offset-2 ${
                      active ? 'bg-[#FBF1E7] text-[#C8102E]' : 'text-[#444444] hover:text-[#C8102E] hover:bg-[#FAF8F4]'
                    }`}
                  >
                    {item.label}
                    {chevron}
                  </Link>

                  {/* Dropdown panel — hover + keyboard focus-within. The pt-3
                      wrapper is a transparent hover bridge to the trigger. */}
                  <div
                    className="absolute left-0 top-full pt-3 w-[320px]
                      opacity-0 invisible translate-y-1 pointer-events-none
                      group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto
                      group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:pointer-events-auto
                      transition-all duration-200 ease-out"
                  >
                    <div className="rounded-2xl bg-white border border-[#ECECEC] shadow-[0_24px_60px_-20px_rgba(17,17,17,0.28)] p-2">
                      {item.children.map((child) => {
                        const childActive = pathname === child.href
                        return (
                          <Link
                            key={child.label}
                            href={child.href}
                            aria-current={childActive ? 'page' : undefined}
                            className={`flex items-start gap-3 rounded-xl px-3 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E] ${
                              childActive ? 'bg-[#FBF1E7]' : 'hover:bg-[#FAF8F4]'
                            }`}
                          >
                            <span
                              className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#FBF1E7] text-[#C8102E]`}
                              aria-hidden="true"
                            >
                              {childIcons[child.href]}
                            </span>
                            <span className="min-w-0">
                              <span className={`block text-[14px] font-bold leading-tight ${childActive ? 'text-[#C8102E]' : 'text-[#111111]'}`}>
                                {child.label}
                              </span>
                              <span className="block text-[12.5px] text-[#777777] leading-snug mt-0.5">
                                {child.desc}
                              </span>
                            </span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </nav>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              href={accountHref}
              className="px-3.5 py-2 rounded-full text-[13px] font-bold text-[#444444] hover:text-[#C8102E] hover:bg-[#FAF8F4] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:ring-offset-2"
            >
              {accountLabel}
            </Link>
            <Link
              href="/online-course"
              className="bg-[#C8102E] text-white text-[13px] font-bold px-5 py-2.5 rounded-full hover:bg-[#a50d26] transition-all duration-200 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E] focus-visible:ring-offset-2"
            >
              Online Course
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="lg:hidden p-2 -mr-2 text-[#444444] rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8102E]"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden border-t border-[#ECECEC] bg-white max-h-[calc(100vh-72px)] overflow-y-auto"
        >
          <div className="px-5 sm:px-6 py-4 space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <div key={item.label} className="py-1">
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={`block px-3 py-3 rounded-xl text-[12px] font-bold tracking-[0.1em] uppercase transition-colors ${
                      active ? 'bg-[#FBF1E7] text-[#C8102E]' : 'text-[#222222] hover:bg-[#FAF8F4]'
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.children.length > 0 && (
                    <div className="mt-1 ml-2 pl-3 border-l border-[#ECECEC] space-y-0.5">
                      {item.children.map((child) => {
                        const childActive = pathname === child.href
                        return (
                          <Link
                            key={child.label}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            aria-current={childActive ? 'page' : undefined}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                              childActive ? 'bg-[#FBF1E7] text-[#C8102E]' : 'text-[#555555] hover:bg-[#FAF8F4] hover:text-[#C8102E]'
                            }`}
                          >
                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#FBF1E7] text-[#C8102E]" aria-hidden="true">
                              {childIcons[child.href]}
                            </span>
                            <span className="text-[14px] font-semibold">{child.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}

            <div className="pt-3 mt-2 border-t border-[#ECECEC] space-y-2">
              <Link
                href={accountHref}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-3 rounded-xl text-[14px] font-bold text-[#222222] hover:bg-[#FAF8F4] transition-colors text-center"
              >
                {accountLabel}
              </Link>
              <Link
                href="/online-course"
                onClick={() => setMobileOpen(false)}
                className="block bg-[#C8102E] text-white text-[14px] font-bold py-3.5 rounded-full text-center hover:bg-[#a50d26] transition-colors"
              >
                Online Course
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
