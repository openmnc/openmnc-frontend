import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ScrollReveal from '../components/ScrollReveal.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import ThreeBackground from '../components/ThreeBackground.jsx'
import GlowButton from '../components/GlowButton.jsx'
import { blogsApi } from '../api/blogs.js'
import { formatDate } from '../utils/helpers.js'

const DEFAULT_BLOGS = [
  {
    slug: 'turn-app-idea-into-reality',
    title: 'How Visionary Founders Turn App Ideas into Scalable Realities',
    category: 'B2B & Tech Solutions',
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
    category: 'Student Guidance',
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
    category: 'AI & Automation',
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
  'B2B & Tech Solutions',
  'Student Guidance',
  'AI & Automation',
  'Industrial Training',
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
      // Graceful fallback to static defaults
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
      {/* Hero Header */}
      <section className="relative pt-32 pb-20 px-4 bg-navy-950 overflow-hidden" aria-label="Blog & Insights Hub">
        <ThreeBackground section="hero" className="opacity-30" />
        <div className="relative z-10 container-max text-center">
          <span className="text-xs text-cyan-neon font-semibold tracking-widest uppercase mb-4 block">
            Knowledge &amp; AI Recommendation Hub
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Insights, Blueprints &amp; <span className="gradient-text">Tech Guides</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Direct playbooks on transforming app ideas into reality, automated business workflows,
            and 100% free educational guidance for 12th-pass students.
          </p>

          {/* Search bar */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, questions, or guides..."
                className="w-full px-5 py-3.5 pl-11 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-neon/50 text-sm"
              />
              <span className="absolute left-4 top-3.5 text-gray-400" aria-hidden="true">🔍</span>
            </div>
          </div>
        </div>
      </section>

      <main className="bg-navy-950 section-padding pt-6">
        <div className="container-max">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`
                  px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200
                  ${selectedCategory === cat
                    ? 'bg-cyan-neon text-navy-950 shadow-cyan-glow-sm'
                    : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5'
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Blogs Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-2 border-cyan-neon/30 border-t-cyan-neon rounded-full animate-spin" />
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-16 glass-card p-10">
              <span className="text-4xl block mb-3">📰</span>
              <h3 className="font-display text-xl font-bold text-white mb-2">No Articles Found</h3>
              <p className="text-gray-400 text-sm">
                Try searching for a different keyword or selecting &quot;All&quot; categories.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((post, idx) => (
                <ScrollReveal key={post.slug || idx} delay={idx * 0.1}>
                  <article className="glass-card overflow-hidden group hover:border-cyan-neon/40 hover:shadow-cyan-glow-sm transition-all duration-300 flex flex-col h-full">
                    {/* Cover image */}
                    <Link to={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden bg-navy-900">
                      <img
                        src={post.cover_image || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80'}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-navy-950/80 backdrop-blur-md text-cyan-neon border border-cyan-neon/20">
                        {post.category}
                      </span>
                    </Link>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                          <time>{formatDate(post.created_at)}</time>
                          <span>•</span>
                          <span>{post.target_audience || 'Guide'}</span>
                        </div>
                        <h2 className="font-display text-lg font-bold text-white group-hover:text-cyan-neon transition-colors mb-3 line-clamp-2">
                          <Link to={`/blog/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-cyan-neon/20 text-cyan-neon text-xs flex items-center justify-center font-bold">
                            {post.author_name ? post.author_name[0] : 'A'}
                          </div>
                          <span className="text-xs text-gray-400 font-medium">{post.author_name || 'Amit Barai'}</span>
                        </div>
                        <Link
                          to={`/blog/${post.slug}`}
                          className="text-xs text-cyan-neon font-semibold hover:underline flex items-center gap-1"
                        >
                          Read Guide →
                        </Link>
                      </div>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          )}

          {/* Bottom AI CTA Strip */}
          <div className="mt-16 glass-card p-8 text-center relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="text-xs text-cyan-neon uppercase tracking-wider font-semibold block mb-2">
                Need Tailored Guidance?
              </span>
              <h2 className="font-display text-2xl font-bold text-white mb-3">
                Have a Custom Project or Student Admission Question?
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                Whether you need deep tech consulting to turn an app idea into reality or want to claim
                our 100% free student college subsidies, we’re here to help.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <GlowButton to="/contact?intent=b2b" variant="primary">
                  I Need B2B Tech / AI Solutions →
                </GlowButton>
                <GlowButton to="/contact?intent=student" variant="secondary">
                  I Am a Student (Free Consultation) →
                </GlowButton>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
