import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')

  return (
    <footer className="bg-[#1a1a1a] text-white pt-16 pb-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Subscribe Card */}
        <div className="bg-[#222222] rounded-lg p-8 mb-8">
          <div className="w-8 h-0.5 bg-[#C8102E] mb-4"></div>
          <h3 className="text-white font-bold text-lg mb-6">Join Thousands Applying The Singapore Way</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                First Name <span className="text-[#C8102E]">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Aisha"
                className="w-full bg-transparent border border-gray-600 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C8102E]"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Khan"
                className="w-full bg-transparent border border-gray-600 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C8102E]"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-1">
              Email Address <span className="text-[#C8102E]">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-transparent border border-gray-600 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C8102E]"
            />
          </div>
          <button className="w-full bg-[#C8102E] text-white font-bold py-2.5 rounded-full hover:bg-[#a50d26] transition-colors text-sm">
            Subscribe
          </button>
        </div>

        {/* Browse FAQs */}
        <div className="text-center mb-8">
          <span className="text-gray-400 text-sm">Have a question? </span>
          <Link to="/q-a" className="border border-gray-400 text-white text-sm px-4 py-1.5 rounded-full hover:border-white transition-colors">
            Browse FAQs
          </Link>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-3 gap-2 text-center mb-8">
          <div className="space-y-2">
            <Link to="/thebook" className="block text-gray-400 text-sm hover:text-white transition-colors">The Book</Link>
            <Link to="/possibilities" className="block text-gray-400 text-sm hover:text-white transition-colors">Use Cases</Link>
          </div>
          <div className="space-y-2">
            <Link to="/online-course" className="block text-gray-400 text-sm hover:text-white transition-colors">Online Course</Link>
            <Link to="/teaching-materials" className="block text-gray-400 text-sm hover:text-white transition-colors">Case Studies</Link>
          </div>
          <div className="space-y-2">
            <Link to="/localization-kits" className="block text-gray-400 text-sm hover:text-white transition-colors">Localisation Kits</Link>
            <Link to="/podcasts" className="block text-gray-400 text-sm hover:text-white transition-colors">Podcast</Link>
          </div>
        </div>

        {/* Divider + Copyright */}
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-500 text-xs mb-1">© 2025 The Singapore Way. All rights reserved. Powered by 86400 Studio</p>
          <a href="mailto:info@thesingaporeway.com" className="text-gray-500 text-xs hover:text-white transition-colors underline">
            info@thesingaporeway.com
          </a>
        </div>
      </div>
    </footer>
  )
}
