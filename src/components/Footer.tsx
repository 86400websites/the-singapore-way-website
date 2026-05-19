import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img
              src="/assets/logo/logo-white.png"
              alt="The Singapore Way"
              className="h-10 w-auto mb-4"
            />
            <p className="text-[#999999] text-sm leading-relaxed mt-4">
              A practical framework for adapting Singapore's proven principles to build resilient, impactful systems tailored to your context.
            </p>
            <p className="mt-4 text-sm text-[#999999]">
              <a href="mailto:info@thesingaporeway.com" className="hover:text-white transition-colors">
                info@thesingaporeway.com
              </a>
            </p>
          </div>

          {/* Learn */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-widest uppercase mb-4">Learn</h4>
            <ul className="space-y-2.5">
              <li><Link to="/thebook" className="text-[#999999] text-sm hover:text-white transition-colors">The Book</Link></li>
              <li><Link to="/online-course" className="text-[#999999] text-sm hover:text-white transition-colors">Online Course</Link></li>
              <li><Link to="/podcasts" className="text-[#999999] text-sm hover:text-white transition-colors">Podcast</Link></li>
              <li><Link to="/blog" className="text-[#999999] text-sm hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/q-a" className="text-[#999999] text-sm hover:text-white transition-colors">Q&A</Link></li>
            </ul>
          </div>

          {/* Apply & Teach */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-widest uppercase mb-4">Apply & Teach</h4>
            <ul className="space-y-2.5">
              <li><Link to="/apply" className="text-[#999999] text-sm hover:text-white transition-colors">Apply</Link></li>
              <li><Link to="/localization-kits" className="text-[#999999] text-sm hover:text-white transition-colors">Localization Kits</Link></li>
              <li><Link to="/possibilities" className="text-[#999999] text-sm hover:text-white transition-colors">Examples</Link></li>
              <li><Link to="/teach" className="text-[#999999] text-sm hover:text-white transition-colors">Teach</Link></li>
              <li><Link to="/teaching-materials" className="text-[#999999] text-sm hover:text-white transition-colors">Case Studies</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-widest uppercase mb-4">About</h4>
            <ul className="space-y-2.5">
              <li><Link to="/about" className="text-[#999999] text-sm hover:text-white transition-colors">About the Author</Link></li>
              <li><Link to="/about" className="text-[#999999] text-sm hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="/about" className="text-[#999999] text-sm hover:text-white transition-colors">What We Stand For</Link></li>
              <li><Link to="/ideate" className="text-[#999999] text-sm hover:text-white transition-colors">Ideate</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#333333] mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#666666] text-xs">
            © 2025 The Singapore Way. All rights reserved. Powered by 86400 Studio
          </p>
          <div className="flex items-center gap-6">
            <a href="mailto:info@thesingaporeway.com" className="text-[#666666] text-xs hover:text-white transition-colors">
              info@thesingaporeway.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
