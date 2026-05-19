import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const navItems = [
  {
    label: 'THE BOOK',
    href: '/thebook',
    children: [
      { label: 'Buy Book', href: '/thebook' },
    ],
  },
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
  {
    label: 'IDEATE',
    href: '/ideate',
    children: [],
  },
  {
    label: 'ABOUT',
    href: '/about',
    children: [
      { label: 'Author', href: '/about' },
      { label: 'Our Story', href: '/about' },
      { label: 'What We Stand For', href: '/about' },
    ],
  },
]

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const location = useLocation()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMobileOpen(false)
    setOpenDropdown(null)
  }, [location.pathname])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="bg-white border-b border-[#E5E5E5] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="/assets/logo/logo-red.png"
              alt="The Singapore Way"
              className="h-10 md:h-12 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                {item.children.length > 0 ? (
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold tracking-wide transition-colors duration-150 ${
                      location.pathname === item.href || location.pathname.startsWith(item.href + '/')
                        ? 'text-[#C8102E]'
                        : 'text-[#111111] hover:text-[#C8102E]'
                    }`}
                  >
                    {item.label}
                    <svg className={`w-3 h-3 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                ) : (
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `px-3 py-2 text-sm font-semibold tracking-wide transition-colors duration-150 ${
                        isActive ? 'text-[#C8102E]' : 'text-[#111111] hover:text-[#C8102E]'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                )}

                {item.children.length > 0 && openDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-[#E5E5E5] shadow-lg z-50">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        to={child.href}
                        className="block px-4 py-3 text-sm text-[#333333] hover:bg-[#F5F5F5] hover:text-[#C8102E] transition-colors border-b border-[#F0F0F0] last:border-0"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/thebook"
              className="bg-[#C8102E] text-white text-sm font-semibold px-5 py-2.5 hover:bg-[#a50d26] transition-colors"
            >
              Buy Book
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-[#111111]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#E5E5E5] bg-white">
          <div className="px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <div key={item.label}>
                <Link
                  to={item.href}
                  className={`block py-2.5 text-sm font-semibold tracking-wide border-b border-[#F0F0F0] ${
                    location.pathname === item.href ? 'text-[#C8102E]' : 'text-[#111111]'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children.map((child) => (
                  <Link
                    key={child.label}
                    to={child.href}
                    className="block py-2 pl-4 text-sm text-[#666666] hover:text-[#C8102E]"
                    onClick={() => setMobileOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
            <Link
              to="/thebook"
              className="block mt-4 bg-[#C8102E] text-white text-center text-sm font-semibold py-3 hover:bg-[#a50d26] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Buy Book
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
