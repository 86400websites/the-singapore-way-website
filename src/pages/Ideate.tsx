import { useState } from 'react'

type Tab = 'comprehensive' | 'guided' | 'knowledge' | 'analytics'

export default function Ideate() {
  const [activeTab, setActiveTab] = useState<Tab>('comprehensive')
  const [challenge, setChallenge] = useState('')
  const [context, setContext] = useState('')

  const tabs = [
    {
      id: 'comprehensive' as Tab,
      label: 'Comprehensive Analysis',
      icon: (
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: 'guided' as Tab,
      label: 'Guided Walkthrough',
      icon: (
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      id: 'knowledge' as Tab,
      label: 'Knowledge Search',
      icon: (
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      id: 'analytics' as Tab,
      label: 'Analytics',
      icon: (
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="text-center mb-9">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white border border-gray-200 shadow-sm mb-4">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
            The Singapore Way Assistant
          </h1>
          <p className="text-[14px] text-gray-400">
            Strategic Analysis &amp; Consulting powered by Singapore's proven principles
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-[#C8102E] text-white shadow-sm'
                  : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">

          {activeTab === 'comprehensive' && (
            <>
              <h2 className="text-base font-extrabold text-gray-900 tracking-tight mb-1">Comprehensive Analysis</h2>
              <p className="text-[13px] text-gray-400 leading-relaxed mb-7">
                Advanced strategic analysis with multiple frameworks, deep insights, and comprehensive recommendations based on Singapore's proven governance principles.
              </p>
              <div className="mb-5">
                <label className="block text-[11px] font-bold text-gray-500 tracking-[0.1em] uppercase mb-2">
                  Strategic Challenge:
                </label>
                <textarea
                  value={challenge}
                  onChange={(e) => setChallenge(e.target.value)}
                  placeholder="Describe your strategic challenge in detail..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#C8102E] resize-none bg-gray-50 transition-colors"
                />
              </div>
              <div className="mb-5">
                <label className="block text-[11px] font-bold text-gray-500 tracking-[0.1em] uppercase mb-2">
                  Organizational Context:
                </label>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Provide context about your organization, sector, stakeholders, and current situation..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#C8102E] resize-none bg-gray-50 transition-colors"
                />
              </div>
              <div className="flex items-center gap-3 mb-6">
                <button className="flex items-center gap-2 bg-gray-900 text-white text-[12px] font-bold px-4 py-2 rounded-full hover:bg-gray-700 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  Attach context files
                </button>
                <span className="text-[12px] text-gray-400">Supports .txt now; .pdf/.docx supported via server extraction</span>
              </div>
              <button className="flex items-center gap-2.5 bg-[#C8102E] text-white text-[13px] font-bold px-7 py-3.5 rounded-full hover:bg-[#a50d26] transition-all duration-200 tracking-wide uppercase shadow-sm hover:shadow-md">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
                Launch Comprehensive Analysis
              </button>
              <p className="text-[12px] text-gray-400 mt-4 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Analysis typically takes 2–5 minutes
              </p>
            </>
          )}

          {activeTab === 'guided' && (
            <div className="text-center py-14">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <p className="text-gray-400 text-[14px]">Guided Walkthrough coming soon</p>
            </div>
          )}

          {activeTab === 'knowledge' && (
            <>
              <h2 className="text-base font-extrabold text-gray-900 tracking-tight mb-5">Knowledge Search</h2>
              <input
                type="text"
                placeholder="Search Singapore Way principles, case studies, frameworks..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#C8102E] bg-gray-50 transition-colors"
              />
              <p className="text-[12px] text-gray-400 mt-3">Search across 15 principles, 17 case studies, and all platform content</p>
            </>
          )}

          {activeTab === 'analytics' && (
            <div className="text-center py-14">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-400 text-[14px]">Analytics dashboard coming soon</p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
