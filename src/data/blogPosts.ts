export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  image: string
  category: string
  readTime: string
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: '3-secrets-behind-singapore-public-trust-south-africa',
    title: '3 Secrets Behind Singapore\'s Public Trust—and How South Africa Can Rebuild It',
    excerpt: 'South Africa faces a deep crisis of trust. Corruption scandals, service delivery failures, and inconsistent leadership have eroded public confidence. Singapore offers a different path.',
    image: '/assets/blog/post-1.png',
    category: 'Governance',
    readTime: '6 min read',
  },
  {
    id: '2',
    slug: '5-principles-singapore-way-transform-south-africa-economy',
    title: '5 Principles from The Singapore Way That Could Transform South Africa\'s Economy',
    excerpt: 'South Africa\'s economy is stuck: high unemployment, persistent inequality, unreliable energy supply. Singapore\'s economic principles offer a practical roadmap for transformation.',
    image: '/assets/blog/post-2.png',
    category: 'Economics',
    readTime: '8 min read',
  },
  {
    id: '3',
    slug: '4-ways-singapore-housing-speaks-to-south-africa-informal-settlements',
    title: '4 Ways Singapore\'s Housing Story Speaks to South Africa\'s Informal Settlements',
    excerpt: 'South Africa\'s informal settlements are one of its toughest challenges: overcrowding, poor infrastructure, and unsafe living conditions. Singapore\'s housing journey offers real lessons.',
    image: '/assets/blog/post-3.png',
    category: 'Housing',
    readTime: '7 min read',
  },
  {
    id: '4',
    slug: '5-singapore-lessons-south-africa-adapt-without-copying',
    title: '5 Singapore Lessons South Africa Can Adapt (Without Copying)',
    excerpt: 'Whenever South Africans hear about Singapore\'s success, the first reaction is often skepticism. But adaptation is not imitation — here\'s how to draw the right lessons.',
    image: '/assets/blog/post-4.png',
    category: 'Adaptation',
    readTime: '6 min read',
  },
  {
    id: '5',
    slug: 'bridging-singapore-to-the-world',
    title: 'Bridging Singapore to the World',
    excerpt: 'How do we take the lessons of a small island city-state and make them relevant to diverse nations with very different histories, cultures, and starting conditions?',
    image: '/assets/blog/post-5.png',
    category: 'Framework',
    readTime: '5 min read',
  },
  {
    id: '6',
    slug: 'can-singapore-principles-work-in-my-country',
    title: 'Can Singapore\'s Principles Work in My Country?',
    excerpt: 'The most common question we get — and one worth answering carefully. The short answer is yes, but only if you understand what you\'re actually trying to replicate.',
    image: '/assets/blog/post-6.png',
    category: 'Framework',
    readTime: '7 min read',
  },
  {
    id: '7',
    slug: 'meritocracy-simplified-opportunity-based-on-ability',
    title: 'Meritocracy Simplified: Opportunity Based on Ability',
    excerpt: 'Singapore\'s meritocracy is one of its most discussed principles — and most misunderstood. Here\'s what it actually means and how to adapt it without its pitfalls.',
    image: '/assets/blog/post-7.png',
    category: 'Policy',
    readTime: '6 min read',
  },
  {
    id: '8',
    slug: 'real-world-examples-countries-adapting-singapore-lessons',
    title: 'Real-World Examples: Countries Already Adapting Singapore\'s Lessons',
    excerpt: 'Singapore\'s rise is often treated as a unique, unrepeatable event. But look around the world and you\'ll find nations already drawing from the same playbook — successfully.',
    image: '/assets/blog/post-8.png',
    category: 'Case Studies',
    readTime: '9 min read',
  },
]
