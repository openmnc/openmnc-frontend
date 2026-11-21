import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Newspaper } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal.jsx'
import ThreeBackground from '../components/ThreeBackground.jsx'
import SEO from '../components/SEO.jsx'
import { blogsApi } from '../api/blogs.js'
import { formatDate } from '../utils/helpers.js'

const DEFAULT_BLOGS = [
  {
    slug: 'turn-app-idea-into-reality',
    title: 'How Visionary Founders Turn App Ideas into Scalable Realities',
    category: 'Engineering & Architecture',
    target_audience: 'Founders & Solopreneurs',
    excerpt: 'A battle-tested blueprint for visionary solopreneurs: why deep requirement analysis beats jumping straight into code, and how to conquer development, maintenance, and App Store Optimization (ASO).',
    cover_image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80',
    author_name: 'Amit Barai',
    author_role: 'Founder & Director',
    tags: ['App Development', 'ASO', 'Startup Advice'],
    created_at: new Date().toISOString(),
  },
  {
    slug: 'free-student-career-guidance-college-subsidy',
    title: '100% Free Career Guidance for 12th-Pass Students: Save ₹3,000–₹10,000 in College Admissions',
    category: 'Career Guidance',
    target_audience: '12th-Pass Students & Parents',
    excerpt: 'Navigating college admissions after 12th standard shouldn’t be stressful or expensive. Discover how OpenMNC provides completely free career consultation and exclusive ₹3,000 to ₹10,000 partner college subsidies.',
    cover_image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    author_name: 'Amit Barai',
    author_role: 'Founder & Director',
    tags: ['Student Guidance', 'College Subsidy', 'Career Counseling'],
    created_at: new Date().toISOString(),
  },
  {
    slug: 'business-automation-ai-revenue-multiplier',
    title: 'Multiply Revenue by Automating Repetitive Tasks with Custom AI Workflows',
    category: 'Automation & AI',
    target_audience: 'Business Owners & Founders',
    excerpt: 'How modern businesses eliminate 20+ hours of weekly manual work and boost profit margins through bespoke AI integrations and automated operational pipelines.',
    cover_image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    author_name: 'Amit Barai',
    author_role: 'Founder & Director',
    tags: ['AI Automation', 'Revenue Growth', 'Efficiency'],
    created_at: new Date().toISOString(),
  },
]

const CATEGORIES = [
  'All',
  'Engineering & Architecture',
  'Career Guidance',
  'Automation & AI',
]

export default function Blog() {
  const [blogs, setBlogs] = useState(DEFAULT_BLOGS)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlogs()
  }, [selectedCategory])

  async function fetchBlogs() {
    setLoading(true)
    try {
      const params = {}
      if (selectedCategory !== 'All') {
        params.category = selectedCategory
      }
      const res = await blogsApi.getAll(params)
      if (Array.isArray(res.data) && res.data.length > 0) {
        setBlogs(res.data)
      } else if (selectedCategory === 'All') {
        setBlogs(DEFAULT_BLOGS)
      } else {
        setBlogs(DEFAULT_BLOGS.filter((b) => b.category === selectedCategory))
      }
    } catch {
      if (selectedCategory === 'All') {
        setBlogs(DEFAULT_BLOGS)
      } else {
        setBlogs(DEFAULT_BLOGS.filter((b) => b.category === selectedCategory))
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredBlogs = blogs.filter((b) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      b.title.toLowerCase().includes(q) ||
      b.excerpt.toLowerCase().includes(q) ||
      (b.tags && b.tags.some((t) => t.toLowerCase().includes(q)))
    )
  })

  return (
    <>
      <SEO
        title="OpenMNC Editorial & Newsroom — Engineering Insights & Career Guides"
        description="Engineering playbooks on custom software development, vibe-coded app audits, production databases, and free student guidance by OpenMNC."
        canonical="/blog"
      />

      {/* Hero Header */}
      <section className="relative pt-36 pb-16 px-4 bg-black overflow-hidden" aria-label="OpenMNC Newsroom">
        <ThreeBackground section="hero" className="opacity-20" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-[#2997ff] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2997ff]" />
            Editorial Newsroom &amp; Architecture Guides
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#f5f5f7] tracking-tight mb-6">
            Engineering Playbooks &amp; Insights
          </h1>
          <p className="text-[#a1a1a6] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
            Technical breakdowns on fixing vibe-coded apps, passing App Store review guidelines,
            and navigating 100% free career choices.
          </p>

          {/* Search bar - Liquid Glass Styling */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, topics, or guides..."
                className="w-full px-5 py-3 pl-11 rounded-full bg-[#161618] border border-white/10 text-white placeholder-[#86868b] focus:outline-none focus:border-[#2997ff] text-sm"
              />
              <span className="absolute left-4 top-3.5 text-[#86868b]" aria-hidden="true">
                <Search className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </section>

      <main className="bg-black pb-24 px-4">
        <div className="container-max max-w-6xl">
          {/* Segmented Filter Pills */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1 rounded-full bg-white/5 border border-white/8 overflow-x-auto max-w-full">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-white/15 text-white shadow-sm'
                      : 'text-[#86868b] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Blogs Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#2997ff]/30 border-t-[#2997ff] rounded-full animate-spin" />
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-16 rounded-2xl bg-[#161618] border border-white/8 p-10 max-w-md mx-auto">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                <Newspaper className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg font-semibold text-[#f5f5f7] mb-2">No Articles Found</h3>
              <p className="text-[#86868b] text-xs">
                Try searching for a different keyword or selecting &quot;All&quot; categories.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((post, idx) => (
                <ScrollReveal key={post.slug || idx} delay={idx * 0.08}>
                  <article className="h-full rounded-2xl bg-[#161618] border border-white/8 hover:border-white/20 transition-all overflow-hidden flex flex-col justify-between group">
                    <div>
                      {/* Cover image with fixed aspect ratio */}
                      <Link to={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden bg-black/40">
                        <img
                          src={post.cover_image || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80'}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/70 backdrop-blur-md text-[#2997ff] border border-white/10">
                          {post.category}
                        </span>
                      </Link>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-xs text-[#86868b] mb-2 font-mono">
                          <time>{formatDate(post.created_at)}</time>
                          <span>•</span>
                          <span>{post.target_audience || 'Engineering'}</span>
                        </div>
                        <h2 className="font-display text-lg font-semibold text-[#f5f5f7] group-hover:text-[#2997ff] transition-colors mb-2.5 line-clamp-2">
                          <Link to={`/blog/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h2>
                        <p className="text-[#a1a1a6] text-xs sm:text-sm leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-0 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-white/10 text-white text-xs flex items-center justify-center font-bold">
                          {post.author_name ? post.author_name[0] : 'A'}
                        </div>
                        <span className="text-xs text-[#86868b]">{post.author_name || 'Amit Barai'}</span>
                      </div>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-xs text-[#2997ff] font-semibold hover:underline"
                      >
                        Read Article →
                      </Link>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          )}

          {/* Bottom Callout Surface */}
          <div className="mt-16 rounded-3xl bg-[#161618] border border-white/8 p-8 sm:p-12 text-center max-w-3xl mx-auto">
            <span className="text-xs text-[#2997ff] uppercase tracking-wider font-semibold block mb-2">
              Have a Technical Question?
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#f5f5f7] mb-3">
              Consult with Senior Engineers Directly
            </h2>
            <p className="text-[#a1a1a6] text-sm mb-6 max-w-lg mx-auto">
              Discuss your codebase audit, cloud database migration, or free student mentorship session with no sales pitch.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/contact"
                className="px-6 py-2.5 rounded-full text-xs font-semibold bg-white text-black hover:bg-[#f5f5f7] transition-all"
              >
                Schedule Engineering Review →
              </Link>
              <Link
                to="/career-guidance"
                className="px-6 py-2.5 rounded-full text-xs font-semibold bg-white/5 text-[#d2d2d7] border border-white/10 hover:bg-white/10 transition-all"
              >
                Student Counseling Portal →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
