import { useState } from 'react'

type Tab = 'comprehensive' | 'guided' | 'knowledge' | 'analytics'

export default function Ideate() {
  const [activeTab, setActiveTab] = useState<Tab>('comprehensive')
  const [challenge, setChallenge] = useState('')
  const [context, setContext] = useState('')

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            The Singapore Way Assistant
          </h1>
          <p className="text-sm text-gray-500">
            Strategic Analysis &amp; Consulting powered by Singapore's proven principles
          </p>
          <div className="flex justify-center mt-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab('comprehensive')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeTab === 'comprehensive'
                ? 'bg-[#C8102E] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Comprehensive Analysis
          </button>
          <button
            onClick={() => setActiveTab('guided')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeTab === 'guided'
                ? 'bg-[#C8102E] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Guided Walkthrough
          </button>
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeTab === 'knowledge'
                ? 'bg-[#C8102E] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Knowledge Search
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeTab === 'analytics'
                ? 'bg-[#C8102E] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Analytics
          </button>
        </div>

        {/* Form Panel */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
          {activeTab === 'comprehensive' && (
            <>
              <h2 className="text-base font-bold text-gray-900 mb-1">Comprehensive Analysis</h2>
              <p className="text-xs text-gray-500 mb-5">
                Advanced strategic analysis with multiple frameworks, deep insights, and comprehensive recommendations based on Singapore's proven governance principles.
              </p>
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-2">
                  Strategic Challenge:
                </label>
                <textarea
                  value={challenge}
                  onChange={(e) => setChallenge(e.target.value)}
                  placeholder="Describe your strategic challenge in detail..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#C8102E] resize-none bg-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-2">
                  Organizational Context:
                </label>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Provide context about your organization, sector, stakeholders, and current situation..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#C8102E] resize-none bg-white"
                />
              </div>
              <div className="flex items-center gap-3 mb-5">
                <button className="flex items-center gap-2 bg-gray-800 text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-gray-700 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  Attach context files
                </button>
                <span className="text-xs text-gray-400">Supports .txt now; .pdf/.docx supported via server extraction</span>
              </div>
              <button className="flex items-center gap-2 bg-[#C8102E] text-white text-sm font-bold px-6 py-3 rounded-lg hover:bg-[#a50d26] transition-colors tracking-wide uppercase">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
                Launch Comprehensive Analysis
              </button>
              <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Analysis typically takes 2–5 minutes
              </p>
            </>
          )}

          {activeTab === 'guided' && (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <p className="text-gray-500 text-sm">Guided Walkthrough coming soon</p>
            </div>
          )}

          {activeTab === 'knowledge' && (
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-4">Knowledge Search</h2>
              <input
                type="text"
                placeholder="Search Singapore Way principles, case studies, frameworks..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#C8102E] bg-white"
              />
              <p className="text-xs text-gray-400 mt-3">Search across 15 principles, 17 case studies, and all platform content</p>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-sm">Analytics dashboard coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
