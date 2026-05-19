import { Link } from 'react-router-dom'
import { blogPosts } from '../data/blogPosts'

export default function Blog() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold text-[#C8102E] mb-8">Posts</h1>
        <div className="space-y-0 divide-y divide-gray-100">
          {blogPosts.map((post) => (
            <article key={post.id} className="py-6 flex gap-5 items-start group">
              <div className="flex-shrink-0 w-28 h-20 overflow-hidden rounded">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[#C8102E] text-xs font-semibold">{post.category}</span>
                  <span className="text-gray-400 text-xs">·</span>
                  <span className="text-gray-400 text-xs">{post.readTime}</span>
                </div>
                <h2 className="text-sm font-bold text-gray-900 leading-snug mb-1.5 group-hover:text-[#C8102E] transition-colors">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
