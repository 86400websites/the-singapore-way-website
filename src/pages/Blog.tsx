import { Link } from 'react-router-dom'
import { blogPosts } from '../data/blogPosts'

export default function Blog() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#111111] text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#C8102E] text-sm font-semibold tracking-widest uppercase mb-4">Blog</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 max-w-3xl">
            Posts
          </h1>
          <p className="text-[#AAAAAA] text-xl max-w-2xl leading-relaxed">
            The Singapore Way is a simple message: tough problems can be solved when a country chooses and applies clear principles.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="group border border-[#E5E5E5] overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="overflow-hidden h-52">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-[#C8102E] text-white text-xs font-bold px-3 py-1 tracking-wide">
                      {post.category}
                    </span>
                    <span className="text-[#999999] text-xs">{post.readTime}</span>
                  </div>
                  <h2 className="text-[#111111] font-bold text-lg leading-tight mb-3 group-hover:text-[#C8102E] transition-colors flex-1">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="text-[#666666] text-sm leading-relaxed mb-5">{post.excerpt}</p>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-[#C8102E] font-semibold text-xs tracking-widest uppercase hover:gap-4 transition-all mt-auto"
                  >
                    Read Article
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
