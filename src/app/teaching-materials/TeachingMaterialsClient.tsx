'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import PageHero from '@/components/PageHero'
import RequestModal from '@/components/RequestModal'
import RevealStagger from '@/components/motion/RevealStagger'

type Section = 'synopsis' | 'dilemma' | 'themes' | 'audience'

interface CaseStudy {
  icon: string
  chapter: string
  title: string
  subtitle: string
  synopsis: string[]
  dilemma: string
  themes: string[]
  audience: string[]
}

const iconStroke = (path: ReactNode) => (
  <svg className="w-8 h-8 sm:w-9 sm:h-9" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden="true">
    {path}
  </svg>
)

const studyIcons: Record<string, ReactNode> = {
  'chapter-1': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 21h14M6 21V10l6-5 6 5v11M10 21v-6h4v6" />
  ),
  'chapter-2': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.5 12 4l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-9.5Z" />
  ),
  'chapter-3': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l5-5 4 4 8-8M14 8h6v6" />
  ),
  'chapter-4': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4 2 9l10 5 10-5-10-5Zm-6 7v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4M22 9v6" />
  ),
  'chapter-5': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 21V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14M12 9v6M9 12h6M3 21h18" />
  ),
  'chapter-6': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 3v6m12-6v6M6 15v6m12-6v6M3 6h6M3 18h6m6-12h6m-6 12h6M9 9h6v6H9z" />
  ),
  'chapter-7': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm-2 4h12M9 19l-1 2m8-2 1 2M9 15h.01M15 15h.01" />
  ),
  'chapter-8': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11Z" />
  ),
  'chapter-9': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18v12H3V7Zm6 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12h18" />
  ),
  'chapter-10': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a4 4 0 0 0-4 4v3H6a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-2V7a4 4 0 0 0-4-4Zm0 8v4" />
  ),
  'chapter-11': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v17M4 4h13l-2 4 2 4H4" />
  ),
  'chapter-12': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 20c0-7 5-13 14-13-1 9-7 14-14 13Zm0 0c2-4 5-7 9-9" />
  ),
  'chapter-13': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 18h6m-5 3h4M12 3a6 6 0 0 0-4 10.5c1 1 1.5 2 1.5 3.5h5c0-1.5.5-2.5 1.5-3.5A6 6 0 0 0 12 3Z" />
  ),
  'chapter-14': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a9 9 0 0 0 0 18c1.5 0 2-1 2-2s-.5-1.5-.5-2.5.5-1.5 2-1.5h2A4.5 4.5 0 0 0 22 10C21.5 6 17 3 12 3Z" />
  ),
  'chapter-15': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Zm1-3h4v3h-4V4Zm-1 11h.01M15 15h.01M5 11v4m14-4v4" />
  ),
  'chapter-16': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm6 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 20c0-2.5 2.5-5 6-5s6 2.5 6 5M14 15c2.5 0 6 1.5 7 5" />
  ),
  'chapter-17': iconStroke(
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 16.5 6 19l3-1 1-3-2.5-1.5L4.5 16.5Zm10-10 5 5M9 15l6-6 5 5-6 6-5-5Zm10-9a3 3 0 0 1-2 4l-2-2a3 3 0 0 1 4-2Z" />
  ),
}

const caseStudies: CaseStudy[] = [
  {
    icon: '🏛️',
    chapter: 'chapter-1',
    title: 'Leadership and Governance',
    subtitle: "From chaos to clockwork: how leadership built Singapore's backbone.",
    synopsis: [
      "This case chronicles Singapore's transformative journey from post-colonial turmoil to global stability and economic strength, focusing on the leadership ethos that shaped it. Through strategic governance, consistent policymaking, and forward-thinking succession planning, Singapore evolved from a nation plagued by instability and riots to one of the world's most stable and successful societies.",
      "The case also explores the development of Tuas Port, a $20 billion infrastructure project, as a practical manifestation of visionary leadership in action.",
    ],
    dilemma:
      "How can sustained leadership and consistent governance be institutionalized in a way that balances authority, adaptability, and long-term vision — especially in volatile or resource-scarce contexts?",
    themes: [
      'Visionary and consistent leadership',
      'Governance models for national stability',
      'Policy continuity across leadership transitions',
      'Anti-corruption as a trust-building tool',
      'Strategic national planning through mega-projects (e.g. Tuas Port)',
    ],
    audience: [
      'Public administration students',
      'Policy-makers and government advisors',
      'Business and leadership educators',
      'Urban planners and development strategists',
      'Leaders in emerging economies',
    ],
  },
  {
    icon: '🏠',
    chapter: 'chapter-2',
    title: 'Smart Housing',
    subtitle: "From slums to smart living: Singapore's social housing revolution.",
    synopsis: [
      "This case study explores Singapore's ambitious transformation of its housing sector, turning a country plagued by slums and severe overcrowding into one of the world's most successful models for public housing. Through the Housing and Development Board (HDB), Singapore didn't just build houses — it built inclusive, smart, and sustainable communities.",
      'The chapter highlights innovations like the Ethnic Integration Policy, green infrastructure, and digital twins that turned housing into a platform for equity, national identity, and long-term resilience.',
    ],
    dilemma:
      'How can governments provide inclusive, sustainable housing in urban environments with limited land and high population density — without sacrificing social cohesion or economic viability?',
    themes: [
      'Public policy and affordable housing',
      'Social integration and equity through urban design',
      'Green architecture and sustainability in public infrastructure',
      'Governance and long-term urban planning',
      'Technology integration in urban management (e.g. digital twins)',
    ],
    audience: [
      'Public policy and urban planning students',
      'Government officials and city planners',
      'Housing authority and social welfare professionals',
      'MBA and MPA programs exploring public-private innovation',
      'Educators and consultants in social development and inclusive design',
    ],
  },
  {
    icon: '📈',
    chapter: 'chapter-3',
    title: 'Economic Transformation',
    subtitle: "From struggle to strategy: Singapore's economic leap.",
    synopsis: [
      "This case explores how Singapore transformed itself from a vulnerable, underdeveloped island into one of the world's most competitive economies in just a few decades. At independence in 1965, the nation faced high unemployment, minimal industry, and a GDP per capita of just US$516. By 2025, that figure had soared to over US$82,000.",
      "The case highlights Singapore's bold economic policies, from attracting foreign investment and developing manufacturing zones to building a global trade hub with institutions like the Economic Development Board (EDB) and Changi Airport.",
    ],
    dilemma:
      'How can a small or resource-limited nation turn structural disadvantages into economic advantages — and ensure that growth benefits all citizens?',
    themes: [
      'Open economy strategy and global trade',
      'Role of state agencies like EDB in economic transformation',
      'Industrialization and export-led growth',
      'Resilience through adaptation (Asian financial crisis, COVID-19)',
      'Economic inclusion alongside national development',
    ],
    audience: [
      'Economics, international business, and public policy students',
      'Leaders in trade, investment, and development strategy',
      'Entrepreneurs and small-state policymakers',
      'Urban planners and institutional designers',
      'Students of Southeast Asian studies or postcolonial development',
    ],
  },
  {
    icon: '🎓',
    chapter: 'chapter-4',
    title: 'Talent Development and Education',
    subtitle: "Learning to lead: Singapore's talent revolution.",
    synopsis: [
      "Singapore — once a nation where more than half the population was illiterate — engineered one of the world's most effective and equitable education systems. The story reveals how education and workforce development became the backbone of national success.",
      "From early childhood to lifelong learning, Singapore invested in people as its greatest resource. Initiatives such as SkillsFuture, the Institute of Technical Education (ITE), and Singapore's bilingual policy uplifted every level of society, emphasising inclusion, upskilling, and a national culture of learning.",
    ],
    dilemma:
      'How can a nation shape a future-ready, inclusive, and competitive talent pipeline when starting from low educational attainment and scarce resources?',
    themes: [
      'Education as a national development strategy',
      'Inclusive and equitable talent systems',
      'Skills-based learning and lifelong education',
      'Public-private partnerships in upskilling',
      'Cultural identity through bilingual policy',
    ],
    audience: [
      'Educators and education policymakers',
      'Workforce development professionals',
      'Public administrators and social innovators',
      'Leaders in developing countries and city governments',
      'MBA, MPA, and Education Leadership students',
    ],
  },
  {
    icon: '🏥',
    chapter: 'chapter-5',
    title: 'Public Health and Healthcare System',
    subtitle: "Healthcare for all: Singapore's strategy for universal, sustainable care.",
    synopsis: [
      'Chapter 5 examines how Singapore created a world-class healthcare system — affordable, efficient, and inclusive — despite starting from a position of poverty, overcrowding, and epidemics. Today, Singapore spends just 5% of GDP on healthcare, yet achieves life expectancy rates among the highest in the world.',
      'This case explores the evolution of its hybrid public-private model, including MediShield Life, Medisave, Healthier SG, and its focus on prevention over intervention.',
    ],
    dilemma: 'How can a country deliver affordable, universal healthcare while avoiding spiralling costs and dependency?',
    themes: [
      'Universal healthcare with financial sustainability',
      'Role of preventive health and public education',
      'Shared responsibility: citizen, state, and private sector',
      'Technological and policy innovation in healthcare',
      'Health equity across income and age groups',
    ],
    audience: [
      'Public health and policy students',
      'Healthcare administrators and system designers',
      'Leaders in aging societies and emerging economies',
      'Urban planners and health-focused economists',
      'Graduate programs in governance, development, and social innovation',
    ],
  },
  {
    icon: '🌐',
    chapter: 'chapter-6',
    title: 'Smart Nation',
    subtitle: 'Smart Nation: designing the digital future.',
    synopsis: [
      "In Chapter 6, we dive into Singapore's bold transformation into a Smart Nation — one where technology isn't just a tool, but a national strategy. The chapter showcases how a small island state leveraged data, connectivity, and automation to solve real-world problems, from transport and housing to payments and healthcare.",
      'Singapore became a place where 99% of homes enjoy gigabit-speed internet, digital trade exceeds $300 billion, and everyday life is seamlessly integrated with digital systems.',
    ],
    dilemma:
      'How can governments use digital innovation to serve everyone — without leaving the vulnerable behind or losing public trust?',
    themes: [
      'Digital transformation as national policy',
      'Citizen-centred tech design',
      'The role of data and trust in smart systems',
      'Equity in innovation: who benefits, who risks exclusion?',
      'Public-private collaboration in digital infrastructure',
    ],
    audience: [
      'Public policy and digital governance students',
      'Urban planners and smart city architects',
      'Leaders in tech, infrastructure, or civic innovation',
      'Educators in STEM, public service, or ethics',
      'MBA/MPA programs exploring digital transformation',
    ],
  },
  {
    icon: '🚌',
    chapter: 'chapter-7',
    title: 'Urban Mobility and Sustainable Transport',
    subtitle: "Mobility by design: Singapore's journey to seamless, sustainable transport.",
    synopsis: [
      "Singapore's transformation from rickshaws on muddy roads to a global model of urban mobility is no accident. It's the result of a carefully choreographed mix of long-term planning, bold policies, and green innovation.",
      'Chapter 7 unveils how the city-state built a sustainable, equitable, and technologically advanced transport system — from Electronic Road Pricing to mass transit expansion and car quota systems.',
    ],
    dilemma:
      'How can a fast-growing city ensure affordable, accessible, and low-emission mobility — without sacrificing economic growth or quality of life?',
    themes: [
      'Urban transport as a pillar of sustainable development',
      'Public transport equity and behavioural nudges',
      'Road pricing, land use, and car ownership control',
      'Infrastructure design for climate resilience and accessibility',
      'Policy trade-offs between convenience, congestion, and emissions',
    ],
    audience: [
      'Urban planning, policy, and environmental studies students',
      'City leaders, transport engineers, and mobility consultants',
      'Public administration, economics, and sustainability programs',
      'Anyone exploring the future of liveable, green cities',
    ],
  },
  {
    icon: '💧',
    chapter: 'chapter-8',
    title: 'Water and Resource Management',
    subtitle: "From thirst to thrive: Singapore's water resilience revolution.",
    synopsis: [
      "In a nation with no natural lakes and scarce land, Singapore's early dependence on imported water threatened both sovereignty and sustainability. Instead of accepting scarcity, Singapore innovated its way to water abundance — through rainwater collection, aggressive recycling (NEWater), desalination, and behavioural nudging.",
      'This case explores how visionary leadership, long-term planning, and public engagement helped Singapore transform vulnerability into national strength — achieving 100% water self-sufficiency.',
    ],
    dilemma:
      'How can a resource-scarce nation achieve water security without relying on imports — and can its model work in other countries facing climate-driven shortages?',
    themes: [
      'Water security as national security',
      'Circular resource innovation (recycling, desalination)',
      'Strategic autonomy vs. geopolitical dependence',
      'Public trust in reclaimed water',
      'Sustainability and resilience planning under climate pressure',
    ],
    audience: [
      'Public policy and environmental studies students',
      'Leaders in infrastructure, utilities, and municipal governance',
      'NGOs and advocates in water access and climate justice',
      'Educators exploring SDG 6 (Clean Water and Sanitation)',
      'Technologists in urban resilience or circular economy',
    ],
  },
  {
    icon: '🤝',
    chapter: 'chapter-9',
    title: 'Singapore as a Business and Trade Hub',
    subtitle: 'Open ports, open minds: how Singapore became a global trade powerhouse.',
    synopsis: [
      "From a muddy dock with fishing boats in the 1960s to a thriving business and logistics hub processing over S$1.2 trillion in trade by 2024, Singapore's rise as a global commerce centre was no accident. Through strategic infrastructure, transparent regulations, and a pro-business stance, Singapore created a welcoming environment for over 7,500 international companies.",
      'This case explores how a small island nation outpaced geography with vision — becoming a magnet for trade, finance, and innovation while maintaining local relevance and integrity.',
    ],
    dilemma: 'How can nations build a globally competitive, open economy without sacrificing sovereignty, inclusivity, or long-term stability?',
    themes: [
      'Trade facilitation and smart infrastructure',
      'Rule-based governance and business confidence',
      'Strategic location + regulatory clarity as business magnet',
      'Balancing globalisation with national interests',
      'Long-term investment in trust, talent, and trade',
    ],
    audience: [
      'Students of business, economics, and international trade',
      'Policymakers and urban economic planners',
      'Professionals in logistics, governance, and FDI strategy',
      'Development economists and startup ecosystem builders',
      'Government reformers exploring ease-of-doing-business models',
    ],
  },
  {
    icon: '⚖️',
    chapter: 'chapter-10',
    title: 'Public Trust and Governance',
    subtitle: "Clean hands, common cause: Singapore's journey to public trust.",
    synopsis: [
      "From racial riots and rampant corruption in the 1960s to a society where 92% of citizens trust their government in 2024, Singapore's story is a global benchmark for governance transformation. This case explores how the island nation built a durable social compact — anchored in zero-tolerance for corruption, visible public service, and duty-sharing policies like National Service.",
      'Through decisive leadership, institutional reform, and a cultural commitment to fairness and order, Singapore constructed a trust-based governance system that delivers stability, accountability, and national unity.',
    ],
    dilemma:
      'How can governments earn and maintain public trust — especially in divided or post-conflict societies — without becoming authoritarian or overly punitive?',
    themes: [
      'Governance as a two-way social contract',
      'Anti-corruption as a foundation for national dignity',
      'Rule of law, transparency, and equal accountability',
      'The role of symbolic policies (e.g. National Service) in trust-building',
      'Institutional and cultural levers that reduce fragmentation',
    ],
    audience: [
      'Public policy and political science students',
      'Civic leaders and reform advocates',
      'Educators in nation-building or post-conflict contexts',
      'Governance scholars and legal reform practitioners',
      'Anyone studying public trust, integrity systems, or citizen engagement',
    ],
  },
  {
    icon: '🏳️',
    chapter: 'chapter-11',
    title: 'National Identity and Multiculturalism',
    subtitle: 'Unity in diversity: how Singapore forged a shared identity.',
    synopsis: [
      'This chapter shows how Singapore deliberately blended multiracial policies, shared symbols, and everyday interactions to forge a unified national identity. Through public housing quotas, bilingual education, and inclusive celebrations, Singapore built trust and unity across diverse communities — turning diversity into an asset, not a fault line.',
    ],
    dilemma: 'How can a multicultural society foster a cohesive national identity while respecting distinct cultural traditions?',
    themes: [
      'Policies for racial and religious harmony',
      'Bilingual education as a bridge between cultures',
      'Shared public spaces and symbols as integration tools',
      'Balancing majority-minority dynamics',
    ],
    audience: [
      'Students of sociology, multicultural studies, and public policy',
      'Civic leaders and interfaith advocates',
      'Educators working on diversity and inclusion programs',
      'Urban designers focused on inclusive public spaces',
    ],
  },
  {
    icon: '🌿',
    chapter: 'chapter-12',
    title: "Singapore's Green Strategy",
    subtitle: 'Greener than growth: how Singapore balances progress and planet.',
    synopsis: [
      "Despite being one of the world's most urbanized nations, Singapore has managed to make environmental sustainability a pillar of national identity and strategy. From vertical gardens and the 'City in a Garden' vision to carbon taxes and coastal protection plans, the country is proof that small size does not limit green ambition.",
      'This case examines how Singapore made sustainability a cross-sector commitment, embedding green thinking in urban planning, energy innovation, and climate resilience — alongside ongoing tensions between development and biodiversity.',
    ],
    dilemma:
      'How can a resource-constrained, high-growth city-state lead the world in sustainability — without compromising economic competitiveness or urban expansion?',
    themes: [
      'Environmental governance and cross-ministry alignment',
      'Long-term urban planning and coastal resilience (Tuas, Marina Barrage)',
      'Renewable energy adoption and technological innovation',
      'Citizen engagement and behavioural change',
      'Climate finance and green economy transition',
    ],
    audience: [
      'Urban planners and sustainability leaders',
      'Environmental policy students and professionals',
      'Business and civic leaders navigating green transitions',
      'Youth leaders interested in climate action and innovation',
      'Governments of small states or high-density cities',
    ],
  },
  {
    icon: '💡',
    chapter: 'chapter-13',
    title: 'Fostering Innovation and Entrepreneurship',
    subtitle: 'From hawkers to unicorns: how Singapore engineered a startup ecosystem.',
    synopsis: [
      "Singapore's economic journey is often told through trade and industrialisation — but its recent leap into innovation, research, and entrepreneurship may be its boldest move yet. Once home to hawkers and small-scale merchants, Singapore is now a bustling innovation hub, with over 2,000 startups and S$20 billion in research spending annually.",
      'This case explores how a nation with few natural resources built fertile ground for startups, patents, and venture funding — blending predictability with bold experimentation.',
    ],
    dilemma: 'How can a highly structured and risk-averse society foster bold entrepreneurship without losing its economic discipline?',
    themes: [
      'Innovation policy and cross-sector support structures',
      'The role of education, R&D, and IP systems in startup growth',
      'Public-private partnerships for entrepreneurship',
      'The balance between control and creative risk',
      'Cultural and social shifts that support innovation',
    ],
    audience: [
      'Startup founders, accelerators, and ecosystem builders',
      'Policymakers crafting national innovation strategies',
      'Students of entrepreneurship, business, and public policy',
      'Technologists and investors in emerging markets',
      'Civic and educational leaders interested in economic diversification',
    ],
  },
  {
    icon: '🎨',
    chapter: 'chapter-14',
    title: 'The Role of Culture and the Arts in Nation-Building',
    subtitle: 'Harmony in colour: how Singapore used the arts to build a nation.',
    synopsis: [
      "Singapore's cultural journey is a powerful, under-discussed pillar of national development. While policy, trade, and technology shaped its global reputation, it was the intentional elevation of culture, tradition, and the arts that helped turn this diverse island into a cohesive, proud society.",
      'This case tells the story of how festivals, museums, public performances, and storytelling platforms became tools for unity, identity, and inclusivity — from quiet kampong songs to million-visitor stages like the Esplanade.',
    ],
    dilemma: 'How can a state with diverse roots and a pragmatic culture invest in creativity without diluting its values — or losing its sense of control?',
    themes: [
      'Culture as nation-building infrastructure',
      'Government support for arts and expression',
      'Multiculturalism, identity, and narrative blending',
      'Balancing structure with creative freedom',
      'Arts as trust-building and social cohesion tools',
    ],
    audience: [
      'Civic planners, arts administrators, and cultural policymakers',
      'Students of sociology, public policy, arts leadership, urban design',
      'Educators interested in national identity through culture',
      'Innovators in media, community development, youth engagement',
      'Anyone curious how nations shape unity through creativity',
    ],
  },
  {
    icon: '💻',
    chapter: 'chapter-15',
    title: 'Harnessing Technology for the Future',
    subtitle: "Smart Nation, bold moves: Singapore's tech leap toward tomorrow.",
    synopsis: [
      "Singapore didn't just digitise — it strategically transformed its infrastructure, governance, and services using bold initiatives like AI integration, smart traffic lights, and a seamless public services grid.",
      "This case traces how the government blended visionary planning with experimental agility — from traffic optimisation and cashless economies to AI-powered healthcare and data dashboards.",
      'It also navigates risks: surveillance anxiety, funding fatigue, and rapid obsolescence.',
    ],
    dilemma: 'How does a nation use technology to serve its people — without losing the human connection or leaving segments of society behind?',
    themes: [
      'Tech policy as public service infrastructure',
      'Agile governance and long-term tech strategy',
      'Public trust and adoption in national digital programs',
      'Balancing innovation with equity, ethics, and inclusion',
      'How AI, data, and automation shape future-ready nations',
    ],
    audience: [
      'Students of public policy, urban innovation, digital governance',
      'Tech entrepreneurs, civic designers, smart city architects',
      'Educators and developers exploring ethical digital transformation',
      'Government professionals shaping AI or data initiatives',
      'Global leaders exploring inclusive technology strategies',
    ],
  },
  {
    icon: '👥',
    chapter: 'chapter-16',
    title: 'Civic Engagement and Community Building',
    subtitle: 'From fractured to family: how Singapore built community from trust, faith, and shared action.',
    synopsis: [
      "Singapore today is one of the world's tightest-knit urban communities. But in the 1960s, it was a fragmented society marked by distrust, ethnic segregation, and silence between faiths. This case explores how Singapore wove connection, unity, and civic belonging — not through force, but through clever policy, youth leadership, and shared spaces.",
      "From the founding of People's Association Community Centres, to the integration of housing neighbourhoods, to the celebration of multicultural food, festivals, and shared language — this case shows how deliberate social design turned divided roots into a deeply connected people.",
    ],
    dilemma: 'How do you build trust between strangers and unity across faiths, generations, and cultures — especially when division is your starting point?',
    themes: [
      'Designing for social cohesion and inclusion',
      'Civic trust as infrastructure',
      'Youth and interfaith engagement in multicultural societies',
      'Urban policy as community architecture',
      'From social fragmentation to participatory citizenship',
    ],
    audience: [
      'Public policy, urban studies, and social innovation students',
      'Leaders in community development and local governance',
      'Youth organisers, educators, and NGO workers',
      'Faith-based and interfaith coalition leaders',
      'Urban designers and planners working on social cohesion',
    ],
  },
  {
    icon: '🔮',
    chapter: 'chapter-17',
    title: 'The Future of Singapore',
    subtitle: "Future-proofing a nation: Singapore's leap into tomorrow.",
    synopsis: [
      "As Singapore looks beyond its golden decades of transformation, Chapter 17 paints a candid picture of emerging uncertainties and resilient ambition. From global climate threats and economic shifts to demographic imbalances and geopolitical tensions, Singapore faces a crucial question: how can a small nation not only survive but lead in a rapidly evolving world?",
      'This case explores how Singapore is preparing for what comes next — through proactive aging policies, sustainability pivots, AI innovation, workforce upskilling, and enhanced global diplomacy.',
    ],
    dilemma: 'How can Singapore strategically navigate the dual challenge of preserving its achievements while transforming itself to thrive in an uncertain future?',
    themes: [
      'Scenario planning and foresight in policy-making',
      'Leadership during transitions',
      'Societal resilience under aging, automation, and global disruption',
      'Innovation governance and ethics',
      'Diplomacy for small states in turbulent global contexts',
    ],
    audience: [
      'Public policy and administration students',
      'Government officials and urban planners',
      'Innovation and strategic foresight professionals',
      'MBA or MPA students in leadership or emerging markets tracks',
      'International relations and security studies cohorts',
    ],
  },
]

const sectionLabels: Record<Section, string> = {
  synopsis: 'Synopsis',
  dilemma: 'Central Dilemma',
  themes: 'Learning Themes',
  audience: 'Intended Audience',
}

const sectionIcons: Record<Section, ReactNode> = {
  synopsis: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  dilemma: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  themes: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3" strokeWidth={2} />
      <circle cx="12" cy="12" r="7" strokeWidth={2} />
      <circle cx="12" cy="12" r="10.5" strokeWidth={1.5} strokeDasharray="2 3" />
    </svg>
  ),
  audience: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
}

const downloadIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
  </svg>
)

const selectChevron =
  'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23888\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/></svg>")'

export default function TeachingMaterialsClient() {
  const [chapter, setChapter] = useState<'all' | string>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const ctaRef = useRef<HTMLDivElement | null>(null)

  const filtered = useMemo(
    () => (chapter === 'all' ? caseStudies : caseStudies.filter((c) => c.chapter === chapter)),
    [chapter]
  )

  const scrollToCta = () => ctaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const openRequest = () => {
    setModalOpen(true)
  }

  return (
    <div className="bg-white">
      <PageHero
        eyebrow="Teach · Case Studies"
        title="Real systems. Real lessons."
        description="Seventeen case studies that bring the book to life — in classrooms, policy circles, and national strategy discussions."
        align="left"
        variant="light"
        image="/assets/teach/case-studies.png"        priority
      />

      <section className="py-12 md:py-16 bg-[#F5F5F5] border-t border-[#ECECEC]">
        <div className="max-w-[1040px] mx-auto px-5 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav className="text-[12px] text-[#888888] mb-6 flex items-center gap-2 tracking-[0.04em]" aria-label="Breadcrumb">
            <Link href="/teach" className="hover:text-[#111111] transition-colors">Teach</Link>
            <svg className="w-3 h-3 text-[#CCCCCC]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-[#C8102E] font-bold">Case Studies</span>
          </nav>

          {/* CTA card (also the scroll target) */}
          <div
            ref={ctaRef}
            id="request-cta"
            className="card-editorial p-6 md:p-8 mb-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 scroll-mt-[90px]"
          >
            <div className="flex-1">
              <p className="eyebrow mb-2">Get the Case Studies</p>
              <p className="text-[16px] md:text-[17px] text-[#111111] font-bold leading-snug">
                Receive a curated list of Case Studies by email.
              </p>
            </div>
            <button
              onClick={openRequest}
              type="button"
              className="btn-pill self-start sm:self-auto whitespace-nowrap"
            >
              Request Case Studies
            </button>
          </div>

          {/* Filter */}
          <div className="mb-8 max-w-md">
            <label htmlFor="cs-chapter" className="block text-[11px] font-bold tracking-[0.12em] uppercase text-[#666666] mb-2">
              Filter by chapter
            </label>
            <select
              id="cs-chapter"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              className="w-full border border-[#E5E5E5] rounded-full px-5 py-3 text-[14px] text-[#111111] focus:outline-none focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E]/20 bg-white shadow-sm appearance-none bg-no-repeat bg-[length:1.25rem] bg-[right_1rem_center] pr-12"
              style={{ backgroundImage: selectChevron }}
            >
              <option value="all">All 17 chapters</option>
              {caseStudies.map((c) => (
                <option key={c.chapter} value={c.chapter}>{c.title}</option>
              ))}
            </select>
          </div>

          {/* Result count */}
          <p className="text-[13px] text-[#888888] mb-6">
            Showing <span className="text-[#111111] font-bold">{filtered.length}</span> of {caseStudies.length} case studies
            {chapter !== 'all' && (
              <button
                onClick={() => setChapter('all')}
                className="ml-3 text-[#C8102E] font-bold hover:underline"
                type="button"
              >
                Reset filter
              </button>
            )}
          </p>

          {/* Grid / Empty */}
          {filtered.length === 0 ? (
            <div className="bg-[#f9f9f9] border border-black/5 rounded-[15px] p-10 text-center">
              <h3 className="text-xl font-bold text-[#111111] mb-3">No case studies match that filter.</h3>
              <button
                onClick={() => setChapter('all')}
                type="button"
                className="btn-pill"
              >
                Reset filter
              </button>
            </div>
          ) : (
            <RevealStagger
              className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-[30px]"
              stagger={0.05}
            >
              {filtered.map((study) => (
                <CaseStudyCard
                  key={study.chapter}
                  study={study}
                  onRequest={() => {
                    scrollToCta()
                    openRequest()
                  }}
                />
              ))}
            </RevealStagger>
          )}

        </div>
      </section>

      {modalOpen && (
        <RequestModal
          onClose={() => setModalOpen(false)}
          kind="Case Studies"
          formType="case-studies"
        />
      )}
    </div>
  )
}

function CaseStudyCard({ study, onRequest }: { study: CaseStudy; onRequest: () => void }) {
  const [activeSection, setActiveSection] = useState<Section | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const triggerToRestoreRef = useRef<HTMLButtonElement | null>(null)

  const restoreTriggerFocus = useCallback(() => {
    window.requestAnimationFrame(() => {
      triggerToRestoreRef.current?.focus()
    })
  }, [])

  const close = useCallback(() => {
    setActiveSection(null)
    restoreTriggerFocus()
  }, [restoreTriggerFocus])

  useEffect(() => {
    if (!activeSection) return

    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [activeSection, close])

  return (
    <article className="group relative bg-[#f9f9f9] rounded-[15px] p-5 sm:p-6 lg:px-6 lg:py-[28px] flex flex-col items-center text-center shadow-[0_4px_12px_rgba(0,0,0,0.10)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:-translate-y-[5px] transition-all duration-300 min-h-[260px] overflow-hidden">
      {/* Available via email — diagonal hover badge */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 -right-3 rotate-6 bg-[#C8102E] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-[0_10px_24px_rgba(200,16,46,0.25)] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200"
      >
        Available via email
      </span>

      {/* Cream icon block, upper-left */}
      <div className="self-start mb-5 w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] rounded-[15px] bg-[#FBF1E7] text-[#C8102E] flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.08]">
        {studyIcons[study.chapter] ?? (
          <svg className="w-8 h-8 sm:w-9 sm:h-9" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
          </svg>
        )}
      </div>

      {/* Title + red underline + subtitle */}
      <h3 className="text-[18px] sm:text-[20px] font-bold text-[#181C14] leading-[1.25] tracking-[-0.005em] px-2">
        {study.title}
      </h3>
      <span className="block w-12 h-1 bg-[#C8102E] rounded-full mt-3" aria-hidden="true" />
      <p className="text-[15px] sm:text-[16px] text-[#555555] leading-[1.5] mt-4 mb-5 px-2">
        {study.subtitle}
      </p>

      {/* Circular icon buttons */}
      <div className="flex gap-3 sm:gap-4 mb-6" aria-hidden={activeSection ? true : undefined}>
        {(Object.keys(sectionLabels) as Section[]).map((s) => {
          const isActive = activeSection === s
          return (
            <button
              key={s}
              onClick={(event) => {
                triggerToRestoreRef.current = event.currentTarget
                setActiveSection(s)
              }}
              type="button"
              aria-expanded={isActive}
              aria-controls={`${study.chapter}-${s}`}
              aria-label={sectionLabels[s]}
              title={sectionLabels[s]}
              tabIndex={activeSection ? -1 : undefined}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:ring-offset-2 ${
                isActive
                  ? 'bg-[#C8102E] text-white'
                  : 'bg-[#FBF1E7] text-[#C8102E] hover:-translate-y-0.5 hover:shadow-sm'
              }`}
            >
              {sectionIcons[s]}
            </button>
          )
        })}
      </div>

      {/* Red pill buttons */}
      <div className="w-full mt-auto flex flex-col sm:flex-row flex-nowrap gap-3 sm:gap-3 justify-center" aria-hidden={activeSection ? true : undefined}>
        <button
          onClick={onRequest}
          type="button"
          tabIndex={activeSection ? -1 : undefined}
          className="flex-1 min-w-0 whitespace-nowrap inline-flex items-center justify-center gap-1.5 bg-[#C8102E] text-white text-[13px] sm:text-[14px] font-bold px-3 sm:px-4 py-2.5 rounded-full hover:bg-[#a50d26] hover:-translate-y-0.5 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:ring-offset-2"
        >
          <span className="shrink-0">{downloadIcon}</span>
          <span className="whitespace-nowrap">Teacher&rsquo;s Guide</span>
        </button>
        <button
          onClick={onRequest}
          type="button"
          tabIndex={activeSection ? -1 : undefined}
          className="flex-1 min-w-0 whitespace-nowrap inline-flex items-center justify-center gap-1.5 bg-[#C8102E] text-white text-[13px] sm:text-[14px] font-bold px-3 sm:px-4 py-2.5 rounded-full hover:bg-[#a50d26] hover:-translate-y-0.5 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:ring-offset-2"
        >
          <span className="shrink-0">{downloadIcon}</span>
          <span className="whitespace-nowrap">Student&rsquo;s Guide</span>
        </button>
      </div>

      {/* Popover overlay inside the card */}
      {activeSection && (
        <div
          id={`${study.chapter}-${activeSection}`}
          role="dialog"
          aria-modal="false"
          aria-label={sectionLabels[activeSection]}
          className="absolute inset-0 z-10 bg-white/[0.97] rounded-[15px] shadow-[0_8px_20px_rgba(0,0,0,0.15)] p-6 sm:p-7 overflow-y-auto text-left"
        >
          <button
            ref={closeButtonRef}
            onClick={close}
            type="button"
            aria-label="Close"
            className="absolute top-3 right-3 w-9 h-9 rounded-full text-[#666666] hover:bg-[#F5F5F5] hover:text-[#111111] transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h4 className="text-[#C8102E] text-[18px] sm:text-[20px] font-bold leading-tight mb-3 pr-10">
            {sectionLabels[activeSection]}
          </h4>
          <SectionContent study={study} section={activeSection} />
        </div>
      )}
    </article>
  )
}

function SectionContent({ study, section }: { study: CaseStudy; section: Section }) {
  if (section === 'synopsis') {
    return (
      <div className="space-y-3">
        {study.synopsis.map((p, i) => (
          <p key={i} className="text-[14.5px] text-[#555555] leading-[1.55]">{p}</p>
        ))}
      </div>
    )
  }
  if (section === 'dilemma') {
    return <p className="text-[14.5px] text-[#555555] leading-[1.55]">{study.dilemma}</p>
  }
  const items = section === 'themes' ? study.themes : study.audience
  return (
    <ul className="space-y-2">
      {items.map((t, i) => (
        <li key={i} className="text-[14.5px] text-[#555555] leading-[1.5] flex gap-2">
          <span className="text-[#C8102E] flex-shrink-0 mt-2">
            <svg className="w-1.5 h-1.5" fill="currentColor" viewBox="0 0 8 8" aria-hidden="true"><circle cx="4" cy="4" r="4" /></svg>
          </span>
          {t}
        </li>
      ))}
    </ul>
  )
}
