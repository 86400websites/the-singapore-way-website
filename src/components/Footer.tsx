import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')

  return (
    <footer className="bg-[#111111] text-white">
      <div className="max-w-2xl mx-auto px-6 pt-16 pb-10">

        {/* Subscribe Card */}
        <div className="bg-[#1e1e1e] rounded-2xl p-8 mb-10 border border-white/5">
          <div className="w-8 h-[3px] bg-[#C8102E] rounded-full mb-5"></div>
          <h3 className="text-white font-bold text-xl tracking-tight mb-7">Join Thousands Applying The Singapore Way</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 tracking-wider uppercase mb-1.5">
                First Name <span className="text-[#C8102E]">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Aisha"
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#C8102E] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 tracking-wider uppercase mb-1.5">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Khan"
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#C8102E] transition-colors"
              />
            </div>
          </div>
          <div className="mb-5">
            <label className="block text-[11px] font-semibold text-gray-400 tracking-wider uppercase mb-1.5">
              Email Address <span className="text-[#C8102E]">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#C8102E] transition-colors"
            />
          </div>
          <button className="w-full bg-[#C8102E] text-white font-bold py-3 rounded-full hover:bg-[#a50d26] transition-all duration-200 text-[13px] tracking-wide shadow-sm hover:shadow-md">
            Subscribe
          </button>
        </div>

        {/* Browse FAQs */}
        <div className="text-center mb-10">
          <span className="text-gray-500 text-sm">Have a question? </span>
          <Link to="/q-a" className="border border-gray-600 text-gray-300 text-sm px-5 py-1.5 rounded-full hover:border-white hover:text-white transition-all duration-200">
            Browse FAQs
          </Link>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 mb-8"></div>

        {/* Links Grid */}
        <div className="grid grid-cols-3 gap-4 text-center mb-10">
          <div className="space-y-3">
            <Link to="/thebook" className="block text-gray-400 text-[13px] hover:text-white transition-colors">The Book</Link>
            <Link to="/possibilities" className="block text-gray-400 text-[13px] hover:text-white transition-colors">Use Cases</Link>
          </div>
          <div className="space-y-3">
            <Link to="/online-course" className="block text-gray-400 text-[13px] hover:text-white transition-colors">Online Course</Link>
            <Link to="/teaching-materials" className="block text-gray-400 text-[13px] hover:text-white transition-colors">Case Studies</Link>
          </div>
          <div className="space-y-3">
            <Link to="/localization-kits" className="block text-gray-400 text-[13px] hover:text-white transition-colors">Localisation Kits</Link>
            <Link to="/podcasts" className="block text-gray-400 text-[13px] hover:text-white transition-colors">Podcast</Link>
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
