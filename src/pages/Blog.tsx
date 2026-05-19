import { Link } from 'react-router-dom'
import { blogPosts } from '../data/blogPosts'

export default function Blog() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#C8102E] tracking-tight">Posts</h1>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
          {blogPosts.map((post) => (
            <article key={post.id} className="group hover:bg-gray-50 transition-colors duration-150">
              <Link to={`/blog/${post.slug}`} className="flex gap-5 items-start p-6">
                <div className="flex-shrink-0 w-28 h-20 overflow-hidden rounded-xl">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[#C8102E] text-[11px] font-bold tracking-wide uppercase">{post.category}</span>
                    <span className="text-gray-300 text-xs">·</span>
                    <span className="text-gray-400 text-xs">{post.readTime}</span>
                  </div>
                  <h2 className="text-[14px] font-bold text-gray-900 leading-snug mb-1.5 group-hover:text-[#C8102E] transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-[13px] text-gray-400 leading-relaxed line-clamp-2">{post.excerpt}</p>
                </div>
                <div className="flex-shrink-0 text-gray-300 group-hover:text-[#C8102E] transition-colors mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
