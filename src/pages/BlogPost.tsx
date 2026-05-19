import { useParams, Link } from 'react-router-dom'
import { blogPosts } from '../data/blogPosts'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = blogPosts.find((p) => p.slug === slug)
  const related = blogPosts.filter((p) => p.slug !== slug).slice(0, 3)

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-5 tracking-tight">Post Not Found</h1>
          <Link to="/blog" className="bg-[#C8102E] text-white text-[13px] font-bold px-7 py-3 rounded-full hover:bg-[#a50d26] transition-all duration-200 shadow-sm hover:shadow-md">
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* Back */}
        <Link to="/blog" className="inline-flex items-center gap-2 text-[#C8102E] text-[13px] font-bold mb-8 hover:gap-3 transition-all duration-200">
          <svg className="w-4 h-4 rotate-180 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          Back to Posts
        </Link>

        {/* Article */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          {/* Image */}
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 object-cover"
          />
          <div className="p-8 md:p-10">
            {/* Meta */}
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#C8102E] text-white text-[11px] font-bold px-3 py-1 rounded-full tracking-wide uppercase">
                {post.category}
              </span>
              <span className="text-[13px] text-gray-400">{post.readTime}</span>
            </div>
            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">{post.title}</h1>

            {/* Content */}
            <p className="text-[16px] text-gray-700 leading-relaxed mb-6 font-medium">{post.excerpt}</p>
            <p className="text-[15px] text-gray-600 leading-relaxed mb-5">
              Singapore's success story is one of the most studied—yet least understood—in modern development history. When we look at what made Singapore work, we see not a miracle but a method: a deliberate, sustained commitment to clear principles, applied consistently over decades.
            </p>
            <p className="text-[15px] text-gray-600 leading-relaxed mb-5">
              The Singapore Way is not about copying Singapore. It's about understanding the roots of that success—and then planting those roots in your own soil, in your own way, with your own resources.
            </p>

            <h2 className="text-lg font-extrabold text-gray-900 tracking-tight mt-9 mb-3">The Core Insight</h2>
            <p className="text-[15px] text-gray-600 leading-relaxed mb-5">
              What Singapore teaches us is that transformation is possible when a society commits to long-term thinking over short-term gains. When institutions are built to last. When talent is developed and rewarded regardless of background.
            </p>

            <h2 className="text-lg font-extrabold text-gray-900 tracking-tight mt-9 mb-3">Adapting, Not Copying</h2>
            <p className="text-[15px] text-gray-600 leading-relaxed mb-5">
              The critical distinction is adaptation versus imitation. What matters is not what Singapore did, but why it worked. When you understand the principles behind the policies, you can generate your own solutions.
            </p>

            <blockquote className="border-l-4 border-[#C8102E] pl-6 my-9 bg-[#fef9f6] py-5 pr-5 rounded-r-lg">
              <p className="text-gray-700 text-[16px] italic leading-relaxed">"Don't borrow the fruit. Borrow the root. Then plant it where you stand."</p>
              <cite className="text-[#C8102E] font-bold text-[13px] mt-2 block not-italic">— Maher Kaddoura</cite>
            </blockquote>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-10">
          <h3 className="text-[16px] font-extrabold text-gray-900 tracking-tight mb-2">Want to learn the full framework?</h3>
          <p className="text-[14px] text-gray-500 mb-6">The Singapore Way book walks through all 17 dimensions with practical tools for adaptation.</p>
          <Link to="/thebook" className="inline-block bg-[#C8102E] text-white text-[13px] font-bold px-7 py-3 rounded-full hover:bg-[#a50d26] transition-all duration-200 shadow-sm hover:shadow-md">
            Get the Book
          </Link>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h3 className="text-[15px] font-extrabold text-gray-900 tracking-tight mb-5">More Posts</h3>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
              {related.map((r) => (
                <Link key={r.id} to={`/blog/${r.slug}`} className="flex gap-4 items-start p-5 hover:bg-gray-50 transition-colors group">
                  <div className="w-20 h-14 flex-shrink-0 overflow-hidden rounded-xl">
                    <img src={r.image} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div>
                    <span className="text-[#C8102E] text-[11px] font-bold tracking-wide uppercase">{r.category}</span>
                    <h4 className="text-[13px] font-bold text-gray-900 group-hover:text-[#C8102E] transition-colors leading-snug mt-0.5">{r.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
