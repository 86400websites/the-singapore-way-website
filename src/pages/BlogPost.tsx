import { useParams, Link } from 'react-router-dom'
import { blogPosts } from '../data/blogPosts'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = blogPosts.find((p) => p.slug === slug)
  const related = blogPosts.filter((p) => p.slug !== slug).slice(0, 3)

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <Link to="/blog" className="bg-[#C8102E] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#a50d26] transition-colors">
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back */}
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-[#C8102E] text-sm font-semibold mb-8 hover:gap-3 transition-all">
          <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          Back to Posts
        </Link>

        {/* Category */}
        <span className="inline-block bg-[#C8102E] text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
          {post.category}
        </span>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-3">{post.title}</h1>
        <p className="text-gray-400 text-sm mb-8">{post.readTime}</p>

        {/* Image */}
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-64 object-cover rounded-lg mb-8"
        />

        {/* Content */}
        <div className="prose prose-sm max-w-none">
          <p className="text-base text-gray-700 leading-relaxed mb-6 font-medium">{post.excerpt}</p>
          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            Singapore's success story is one of the most studied—yet least understood—in modern development history. When we look at what made Singapore work, we see not a miracle but a method: a deliberate, sustained commitment to clear principles, applied consistently over decades.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            The Singapore Way is not about copying Singapore. It's about understanding the roots of that success—and then planting those roots in your own soil, in your own way, with your own resources.
          </p>

          <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">The Core Insight</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            What Singapore teaches us is that transformation is possible when a society commits to long-term thinking over short-term gains. When institutions are built to last. When talent is developed and rewarded regardless of background.
          </p>

          <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">Adapting, Not Copying</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            The critical distinction is adaptation versus imitation. What matters is not what Singapore did, but why it worked. When you understand the principles behind the policies, you can generate your own solutions.
          </p>

          <blockquote className="border-l-4 border-[#C8102E] pl-5 my-8">
            <p className="text-gray-700 text-base italic">"Don't borrow the fruit. Borrow the root. Then plant it where you stand."</p>
            <cite className="text-[#C8102E] font-semibold text-sm mt-2 block not-italic">— Maher Kaddoura</cite>
          </blockquote>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gray-50 rounded-lg p-8 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Want to learn the full framework?</h3>
          <p className="text-sm text-gray-500 mb-5">The Singapore Way book walks through all 17 dimensions with practical tools for adaptation.</p>
          <Link to="/thebook" className="inline-block bg-[#C8102E] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#a50d26] transition-colors">
            Get the Book
          </Link>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-12">
            <h3 className="text-base font-bold text-gray-900 mb-6">More Posts</h3>
            <div className="space-y-4 divide-y divide-gray-100">
              {related.map((r) => (
                <div key={r.id} className="flex gap-4 items-start pt-4 group">
                  <div className="w-20 h-14 flex-shrink-0 overflow-hidden rounded">
                    <img src={r.image} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div>
                    <span className="text-[#C8102E] text-xs font-semibold">{r.category}</span>
                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#C8102E] transition-colors leading-snug mt-0.5">
                      <Link to={`/blog/${r.slug}`}>{r.title}</Link>
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
