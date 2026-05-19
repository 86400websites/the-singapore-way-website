import { useParams, Link } from 'react-router-dom'
import { blogPosts } from '../data/blogPosts'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = blogPosts.find((p) => p.slug === slug)
  const relatedPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 3)

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#111111] mb-4">Post Not Found</h1>
          <p className="text-[#666666] mb-8">The blog post you're looking for doesn't exist.</p>
          <Link to="/blog" className="bg-[#C8102E] text-white font-semibold px-7 py-3.5 hover:bg-[#a50d26] transition-colors">
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#111111] text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link to="/blog" className="inline-flex items-center gap-2 text-[#C8102E] text-sm font-semibold hover:gap-4 transition-all">
              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              Back to Blog
            </Link>
          </div>
          <span className="inline-block bg-[#C8102E] text-white text-xs font-bold px-3 py-1.5 tracking-wide mb-5">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">{post.title}</h1>
          <p className="text-[#AAAAAA] text-lg">{post.readTime}</p>
        </div>
      </section>

      {/* Featured Image */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-80 object-cover shadow-2xl"
        />
      </div>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-[#555555] text-xl leading-relaxed mb-8 font-medium">
              {post.excerpt}
            </p>

            <div className="space-y-6 text-[#555555] text-lg leading-relaxed">
              <p>
                Singapore's success story is one of the most studied — yet least understood — in modern development history. When we look at what made Singapore work, we see not a miracle but a method: a deliberate, sustained commitment to clear principles, applied consistently over decades.
              </p>
              <p>
                The Singapore Way is not about copying Singapore. It's about understanding the roots of that success — and then planting those roots in your own soil, in your own way, with your own resources.
              </p>
              <h2 className="text-2xl font-bold text-[#111111] mt-10 mb-4">The Core Insight</h2>
              <p>
                What Singapore teaches us is that transformation is possible when a society commits to long-term thinking over short-term gains. When institutions are built to last, not just to serve the interests of the moment. When talent is developed and rewarded regardless of background.
              </p>
              <p>
                These principles are not uniquely Singaporean. They are universal — but Singapore applied them with unusual consistency and foresight.
              </p>
              <h2 className="text-2xl font-bold text-[#111111] mt-10 mb-4">Adapting, Not Copying</h2>
              <p>
                The critical distinction is adaptation versus imitation. Singapore's context — a city-state with no natural resources, a small but educated population, and a strategic location — is not your context. What matters is not what Singapore did, but why it worked.
              </p>
              <p>
                When you understand the principles behind the policies, you can generate your own policies that achieve similar outcomes in your own environment.
              </p>
              <blockquote className="border-l-4 border-[#C8102E] pl-6 my-8">
                <p className="text-[#333333] text-xl italic">"Don't borrow the fruit. Borrow the root. Then plant it where you stand."</p>
                <cite className="text-[#C8102E] font-semibold mt-2 block text-sm">— Maher Kaddoura</cite>
              </blockquote>
              <p>
                This is the core of The Singapore Way platform — a framework for extracting principles, adapting them thoughtfully, and building something new and locally appropriate.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 p-10 bg-[#111111] text-white">
            <p className="text-[#C8102E] text-xs font-semibold tracking-widest uppercase mb-3">Go Deeper</p>
            <h3 className="text-2xl font-bold mb-4">Want to learn the full framework?</h3>
            <p className="text-[#AAAAAA] mb-6">The Singapore Way book walks through all 17 dimensions of Singapore's success — with practical tools for adaptation.</p>
            <Link to="/thebook" className="inline-block bg-[#C8102E] text-white font-semibold px-7 py-3.5 text-sm tracking-wide hover:bg-[#a50d26] transition-colors">
              Get the Book
            </Link>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-[#F5F5F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#111111] mb-10">More Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((related) => (
                <Link key={related.id} to={`/blog/${related.slug}`} className="group">
                  <div className="overflow-hidden mb-4 h-48">
                    <img src={related.image} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <span className="text-[#C8102E] text-xs font-bold tracking-wide">{related.category}</span>
                  <h3 className="text-[#111111] font-bold text-base mt-2 group-hover:text-[#C8102E] transition-colors leading-tight">{related.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
