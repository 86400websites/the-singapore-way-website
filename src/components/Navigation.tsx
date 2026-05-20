import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'THE BOOK', href: '/thebook', children: [] },
  {
    label: 'LEARN',
    href: '/learn',
    children: [
      { label: 'Online Course (Coming Soon)', href: '/online-course' },
      { label: 'Podcast', href: '/podcasts' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    label: 'APPLY',
    href: '/apply',
    children: [
      { label: 'Localization Kits', href: '/localization-kits' },
      { label: 'Examples', href: '/possibilities' },
    ],
  },
  {
    label: 'TEACH',
    href: '/teach',
    children: [
      { label: 'Case Studies', href: '/teaching-materials' },
    ],
  },
  { label: 'IDEATE', href: '/ideate', children: [] },
  { label: 'ABOUT', href: '/about', children: [] },
]

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + '/')

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[70px]">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src="/assets/logo/logo-red.png" alt="The Singapore Way" className="h-11 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center">
            {navItems.map((item) => (
              <div key={item.label} className="relative group">
                {item.children.length > 0 ? (
                  <>
                    {/* Top-level link — navigates to the main page */}
                    <Link
                      to={item.href}
                      className={`flex items-center gap-1 px-4 py-2 text-[11px] font-bold tracking-[0.12em] transition-colors ${
                        isActive(item.href) ? 'text-[#C8102E]' : 'text-gray-700 hover:text-[#C8102E]'
                      }`}
                    >
                      {item.label}
                      <svg
                        className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Link>

                    {/* Dropdown — visible on hover and keyboard focus-within */}
                    <div className="absolute top-full left-0 mt-0 w-56 bg-white border border-gray-100 shadow-xl rounded-md z-50 py-1.5 overflow-hidden
                      opacity-0 invisible pointer-events-none
                      group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto
                      group-focus-within:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto
                      transition-all duration-150">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className={`block px-4 py-2.5 text-[13px] hover:bg-gray-50 transition-colors ${
                            location.pathname === child.href ? 'text-[#C8102E] font-semibold' : 'text-gray-600 hover:text-[#C8102E]'
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <NavLink
                    to={item.href}
                    className={({ isActive: a }) =>
                      `px-4 py-2 text-[11px] font-bold tracking-[0.12em] transition-colors ${a ? 'text-[#C8102E]' : 'text-gray-700 hover:text-[#C8102E]'}`
                    }
                  >
                    {item.label}
                  </NavLink>
                )}
              </div>
            ))}
          </nav>

          {/* Online Course CTA */}
          <div className="hidden lg:block">
            <Link
              to="/online-course"
              className="bg-[#C8102E] text-white text-[13px] font-bold px-6 py-2.5 rounded-full hover:bg-[#a50d26] transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Online Course
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="px-6 py-4 space-y-1">
            {navItems.map((item) => (
              <div key={item.label}>
                <Link
                  to={item.href}
                  className={`block py-2.5 text-[11px] font-bold tracking-[0.12em] ${isActive(item.href) ? 'text-[#C8102E]' : 'text-gray-700'}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children.map((child) => (
                  <Link
                    key={child.label}
                    to={child.href}
                    className="block py-2 pl-4 text-[13px] text-gray-500 hover:text-[#C8102E] transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
            <Link
              to="/online-course"
              className="block mt-4 bg-[#C8102E] text-white text-[13px] font-bold py-3 rounded-full text-center hover:bg-[#a50d26] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Online Course
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
