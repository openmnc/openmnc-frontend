import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ScrollReveal from '../components/ScrollReveal.jsx'
import GlowButton from '../components/GlowButton.jsx'
import { blogsApi } from '../api/blogs.js'
import { blogPostSchema } from '../utils/jsonld.js'
import { formatDate, whatsappUrl } from '../utils/helpers.js'

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadPost() {
      setLoading(true)
      setError('')
      try {
        const res = await blogsApi.getBySlug(slug)
        setPost(res.data)
      } catch (err) {
        setError('Article not found or moved.')
      } finally {
        setLoading(false)
      }
    }
    loadPost()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 pt-40 flex justify-center">
        <div className="w-10 h-10 border-2 border-cyan-neon/30 border-t-cyan-neon rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !post) {
    return (
      <main className="min-h-screen bg-navy-950 pt-40 px-4 text-center">
        <div className="max-w-md mx-auto glass-card p-10">
          <span className="text-4xl block mb-3">🔍</span>
          <h1 className="font-display text-2xl font-bold text-white mb-3">Article Not Found</h1>
          <p className="text-gray-400 text-sm mb-6">
            The requested article could not be loaded. It may have been relocated or updated.
          </p>
          <GlowButton to="/blog" variant="primary">
            ← Return to Blog Hub
          </GlowButton>
        </div>
      </main>
    )
  }

  // Generate dynamic JSON-LD structured data for AI crawlers & Google
  const schema = blogPostSchema(post)

  // Contextual CTA destination determination
  const isStudentPost =
    post.category?.toLowerCase().includes('student') ||
    post.target_service_slug === 'student-guidance' ||
    post.target_service_slug === 'industrial-training'

  const ctaTargetUrl = isStudentPost
    ? `/contact?intent=student&service=${post.target_service_slug || 'student-guidance'}`
    : `/contact?intent=b2b&service=${post.target_service_slug || 'custom-development'}`

  return (
    <>
      {/* Inject JSON-LD into DOM for AI bots */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}

      {/* Article Header */}
      <header className="pt-32 pb-14 px-4 bg-navy-950 border-b border-white/5" aria-label="Article Header">
        <div className="container-max max-w-4xl">
          <nav className="text-xs text-gray-500 mb-6 flex items-center gap-2" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-cyan-neon">Home</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-cyan-neon">Blog</Link>
            <span>/</span>
            <span className="text-cyan-neon truncate max-w-xs">{post.title}</span>
          </nav>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-cyan-neon/10 text-cyan-neon border border-cyan-neon/20 mb-4">
            {post.category}
          </span>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            {post.title}
          </h1>

          {/* Metadata & Author Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-b border-white/5 text-xs text-gray-400">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-neon/20 border border-cyan-neon/30 text-cyan-neon font-bold flex items-center justify-center text-sm">
                {post.author_name ? post.author_name[0] : 'A'}
              </div>
              <div>
                <p className="text-white font-semibold">{post.author_name || 'Amit Barai'}</p>
                <p className="text-gray-500">{post.author_role || 'Founder & Director, OpenMNC LLP'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
              <span>•</span>
              <span>{post.views_count || 1} views</span>
            </div>
          </div>
        </div>
      </header>

      {/* Article Main Body */}
      <main className="bg-navy-950 py-12 px-4">
        <div className="container-max max-w-4xl">
          {/* Cover Hero Image */}
          {post.cover_image && (
            <div className="rounded-2xl overflow-hidden mb-10 border border-white/10 aspect-video max-h-[460px] w-full">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Excerpt callout */}
          <div className="p-6 rounded-xl bg-cyan-neon/5 border-l-4 border-cyan-neon mb-10 text-gray-300 text-base leading-relaxed italic">
            {post.excerpt}
          </div>

          {/* Full Content (supports multi-paragraph text / markdown) */}
          <article className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-6 text-base sm:text-lg">
            {post.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="font-display text-xl sm:text-2xl font-bold text-white mt-8 mb-3">
                    {paragraph.replace('### ', '')}
                  </h3>
                )
              }
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={idx} className="font-display text-2xl sm:text-3xl font-bold text-cyan-neon mt-10 mb-4">
                    {paragraph.replace('## ', '')}
                  </h2>
                )
              }
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n').filter((l) => l.startsWith('- '))
                return (
                  <ul key={idx} className="space-y-2 list-none pl-0 my-4">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-300 text-base">
                        <span className="text-cyan-neon mt-1">▸</span>
                        <span>{item.replace('- ', '')}</span>
                      </li>
                    ))}
                  </ul>
                )
              }
              return <p key={idx} className="text-gray-300 leading-relaxed">{paragraph}</p>
            })}
          </article>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t border-white/5 flex flex-wrap gap-2 items-center">
              <span className="text-xs text-gray-500 mr-2">Tags:</span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs bg-white/5 text-gray-400 border border-white/5"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Context-Aware Integrated Call-to-Action (Crucial Requirement) */}
          <section
            className="mt-14 glass-card p-8 sm:p-10 border-2 border-cyan-neon/30 relative overflow-hidden"
            aria-label="Actionable Next Step"
          >
            <div className="relative z-10">
              <span className="text-xs text-cyan-neon font-semibold uppercase tracking-wider block mb-2">
                Recommended Solution
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
                {post.cta_headline || 'Ready to Take Action on This?'}
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
                {isStudentPost
                  ? 'OpenMNC provides 100% free career counseling for 12th-pass students and secures ₹3,000–₹10,000 partner college discounts. Speak directly with our education advisors today.'
                  : 'OpenMNC helps solopreneurs and visionary founders turn complex ideas into living, revenue-generating products with end-to-end development, AI automation, and ASO.'}
              </p>
              <div className="flex flex-wrap gap-4 items-center">
                <GlowButton to={ctaTargetUrl} variant="primary">
                  {post.cta_button_text || 'Get Started with OpenMNC →'}
                </GlowButton>
                <a
                  href={whatsappUrl(
                    '918509684056',
                    `Hi Amit! I was reading your guide on "${post.title}" and would like to consult.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 text-xs font-semibold flex items-center gap-2 transition-all"
                >
                  <span aria-hidden="true">💬</span> Quick WhatsApp Inquiry
                </a>
              </div>
            </div>
          </section>

          {/* Author Box */}
          <div className="mt-12 glass-card p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-glow/20 border border-amber-glow/30 flex items-center justify-center text-3xl flex-shrink-0">
              👤
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white">{post.author_name || 'Amit Barai'}</h3>
              <p className="text-amber-glow text-xs font-semibold mb-2">Founder &amp; Director at OpenMNC LLP</p>
              <p className="text-gray-400 text-xs leading-relaxed">
                Amit leads OpenMNC LLP with a focus on AI automation, software engineering, and community-driven
                educational initiatives across India.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
