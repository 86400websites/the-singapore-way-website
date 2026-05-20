import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import RequestModal from '../components/RequestModal'

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

const sectionIcons: Record<Section, JSX.Element> = {
  synopsis: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  dilemma: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  themes: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  audience: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
}

const selectChevron =
  'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23888\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/></svg>")'

export default function TeachingMaterials() {
  const [chapter, setChapter] = useState<'all' | string>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const ctaRef = useRef<HTMLDivElement | null>(null)

  const filtered = useMemo(
    () => (chapter === 'all' ? caseStudies : caseStudies.filter((c) => c.chapter === chapter)),
    [chapter]
  )

  const scrollToCta = () => ctaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const openRequest = () => {
    scrollToCta()
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
      />

      <section className="py-14 md:py-20 bg-[#F5F5F5] border-t border-[#ECECEC]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav className="text-[12px] text-[#888888] mb-8 flex items-center gap-2 tracking-[0.04em]" aria-label="Breadcrumb">
            <Link to="/teach" className="hover:text-[#111111] transition-colors">Teach</Link>
            <svg className="w-3 h-3 text-[#CCCCCC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-[#C8102E] font-bold">Case Studies</span>
          </nav>

          {/* CTA card */}
          <div ref={ctaRef} className="card-editorial p-6 md:p-8 mb-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="flex-1">
              <p className="eyebrow mb-2">Get the Case Studies</p>
              <p className="text-[16px] md:text-[17px] text-[#111111] font-bold leading-snug">
                Receive a free case study and the full set by email.
              </p>
            </div>
            <button onClick={() => setModalOpen(true)} className="btn-pill self-start sm:self-auto whitespace-nowrap" type="button">
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
            <div className="card-editorial p-12 text-center">
              <p className="eyebrow-muted mb-3">No matches</p>
              <h3 className="text-xl font-bold text-[#111111] mb-3">No case studies match that filter.</h3>
              <button onClick={() => setChapter('all')} className="btn-pill" type="button">
                Reset filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
              {filtered.map((study) => (
                <CaseStudyCard
                  key={study.chapter}
                  study={study}
                  onRequest={openRequest}
                />
              ))}
            </div>
          )}

        </div>
      </section>

      {modalOpen && <RequestModal onClose={() => setModalOpen(false)} kind="Case Studies" />}
    </div>
  )
}

function CaseStudyCard({ study, onRequest }: { study: CaseStudy; onRequest: () => void }) {
  const [activeSection, setActiveSection] = useState<Section | null>(null)

  const toggle = (s: Section) => setActiveSection((curr) => (curr === s ? null : s))

  return (
    <article className="card-editorial p-6 md:p-7 lg:p-8 flex flex-col group relative hover:border-[#C8102E]/30">
      {/* Hover badge */}
      <span className="absolute top-5 right-5 bg-[#C8102E] text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-[0.06em] uppercase opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none">
        Available via email
      </span>

      {/* Icon block */}
      <div className="icon-block mb-5">
        <span aria-hidden="true">{study.icon}</span>
      </div>

      {/* Title + subtitle */}
      <h3 className="text-[19px] md:text-[20px] font-bold text-[#111111] leading-[1.25] mb-2 pr-24">
        {study.title}
      </h3>
      <p className="text-[15px] text-[#666666] leading-[1.55] mb-5 italic">
        {study.subtitle}
      </p>
      {/* Hairline rule */}
      <span className="block w-10 h-[3px] bg-[#C8102E] rounded-full mb-5" aria-hidden="true" />

      {/* Info buttons */}
      <div className="flex flex-wrap gap-2 mb-5">
        {(Object.keys(sectionLabels) as Section[]).map((s) => {
          const isActive = activeSection === s
          return (
            <button
              key={s}
              onClick={() => toggle(s)}
              type="button"
              aria-expanded={isActive}
              aria-controls={`${study.chapter}-${s}`}
              className={`inline-flex items-center gap-1.5 text-[12px] font-bold tracking-[0.04em] uppercase px-3.5 py-2 sm:py-1.5 rounded-full border transition-all duration-200 ${
                isActive
                  ? 'bg-[#C8102E] text-white border-[#C8102E] shadow-sm'
                  : 'bg-white text-[#666666] border-[#E5E5E5] hover:border-[#C8102E] hover:text-[#C8102E]'
              }`}
            >
              {sectionIcons[s]}
              {sectionLabels[s]}
            </button>
          )
        })}
      </div>

      {/* Expanded section panel */}
      {activeSection && (
        <div
          id={`${study.chapter}-${activeSection}`}
          className="bg-[#fbf5f2] border border-[#F0E5DF] rounded-xl p-5 md:p-6 mb-5 relative"
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <p className="eyebrow">{sectionLabels[activeSection]}</p>
            <button
              onClick={() => setActiveSection(null)}
              aria-label="Close section"
              className="text-[#888888] hover:text-[#111111] transition-colors flex-shrink-0"
              type="button"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <SectionContent study={study} section={activeSection} />
        </div>
      )}

      {/* CTAs */}
      <div className="mt-auto pt-4 border-t border-[#F0F0F0] flex flex-wrap gap-2">
        <button
          onClick={onRequest}
          type="button"
          className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 border border-[#C8102E] text-[#C8102E] text-[12px] font-bold tracking-[0.04em] uppercase px-4 py-2.5 rounded-full hover:bg-[#C8102E] hover:text-white transition-all duration-200"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Teacher's Guide
        </button>
        <button
          onClick={onRequest}
          type="button"
          className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 border border-[#C8102E] text-[#C8102E] text-[12px] font-bold tracking-[0.04em] uppercase px-4 py-2.5 rounded-full hover:bg-[#C8102E] hover:text-white transition-all duration-200"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Student's Guide
        </button>
      </div>
    </article>
  )
}

function SectionContent({ study, section }: { study: CaseStudy; section: Section }) {
  if (section === 'synopsis') {
    return (
      <div className="space-y-3">
        {study.synopsis.map((p, i) => (
          <p key={i} className="text-[15px] text-[#444444] leading-[1.65]">{p}</p>
        ))}
      </div>
    )
  }
  if (section === 'dilemma') {
    return <p className="text-[15px] text-[#444444] leading-[1.65]">{study.dilemma}</p>
  }
  if (section === 'themes') {
    return (
      <ul className="space-y-2">
        {study.themes.map((t, i) => (
          <li key={i} className="text-[15px] text-[#444444] leading-[1.55] flex gap-2">
            <span className="text-[#C8102E] flex-shrink-0 mt-1.5">
              <svg className="w-1.5 h-1.5" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" /></svg>
            </span>
            {t}
          </li>
        ))}
      </ul>
    )
  }
  return (
    <ul className="space-y-2">
      {study.audience.map((a, i) => (
        <li key={i} className="text-[15px] text-[#444444] leading-[1.55] flex gap-2">
          <span className="text-[#C8102E] flex-shrink-0 mt-1.5">
            <svg className="w-1.5 h-1.5" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" /></svg>
          </span>
          {a}
        </li>
      ))}
    </ul>
  )
}
