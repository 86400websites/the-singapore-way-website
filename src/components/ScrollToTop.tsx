import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Scroll to the top of the page on route changes so internal nav (footer,
// header, in-page links) lands the user at the top of the destination page.
// Uses 'instant' to bypass the global `html { scroll-behavior: smooth }` rule.
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])

  return null
}
