import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ScrollReveal from '../components/ScrollReveal.jsx'
import GlowButton from '../components/GlowButton.jsx'
import SEO from '../components/SEO.jsx'
import { blogsApi } from '../api/blogs.js'
import { blogPostSchema, aeoTechArticleSchema, dynamicFaqSchema } from '../utils/jsonld.js'
import { formatDate, whatsappUrl } from '../utils/helpers.js'

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeFaq, setActiveFaq] = useState(null)

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
        <div className="max-w-md mx-auto glass-card p-8 sm:p-10 border border-white/20 bg-white/10 backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-2xl">
          <span className="text-4xl block mb-3">🔍</span>
          <h1 className="font-display text-2xl font-bold text-white mb-3">Article Not Found</h1>
          <p className="text-gray-300 text-sm mb-6">
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
  const postSchemas = [
    blogPostSchema(post),
    aeoTechArticleSchema(post),
    dynamicFaqSchema(post.faqs),
  ].filter(Boolean)

  // Contextual CTA destination determination
  const isStudentPost =
    post.category?.toLowerCase().includes('student') ||
    post.target_service_slug === 'student-guidance' ||
    post.target_service_slug === 'industrial-training'

  const ctaTargetUrl = isStudentPost
    ? `/contact?intent=student&service=${post.target_service_slug || 'student-guidance'}`
    : `/contact?intent=b2b&service=${post.target_service_slug || 'custom-development'}`

  // Dynamic Rule: <title>{data.title} | OpenMNC</title>
  const seoTitle = `${post.title} | OpenMNC`

  // Description Rule: Use problem_statement and technical_solution (150 chars)
  const problem = post.problem_statement || ''
  const solution = post.technical_solution || ''
  const combined = `${problem} ${solution}`.trim()
  const seoDesc = combined ? combined.slice(0, 150) : (post.excerpt || post.title).slice(0, 150)

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDesc}
        canonical={`/blog/${post.slug}`}
        image={post.cover_image || 'https://openmnc.com/logo.webp'}
        type="article"
        keywords={Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || 'OpenMNC, Tech Blog, AI'}
        schema={postSchemas}
      />

      {/* Article Header (Mobile-First Glassmorphism) */}
      <header className="pt-28 sm:pt-32 pb-12 sm:pb-14 px-4 bg-navy-950 border-b border-white/10" aria-label="Article Header">
        <div className="container-max max-w-4xl">
          <nav className="text-xs text-gray-400 mb-6 flex flex-wrap items-center gap-2" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-cyan-neon">Home</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-cyan-neon">Blog</Link>
            <span>/</span>
            <span className="text-cyan-neon truncate max-w-xs">{post.title}</span>
          </nav>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-cyan-neon/10 text-cyan-neon border border-cyan-neon/20 mb-4">
            {post.category}
          </span>

          <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            {post.title}
          </h1>

          {/* Metadata & Author Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-t border-b border-white/10 text-xs text-gray-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-neon/20 border border-cyan-neon/30 text-cyan-neon font-bold flex items-center justify-center text-sm">
                {post.author_name ? post.author_name[0] : 'A'}
              </div>
              <div>
                <p className="text-white font-semibold">{post.author_name || 'Amit Barai'}</p>
                <p className="text-gray-400 text-[11px]">{post.author_role || 'Founder & Director, OpenMNC LLP'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-400">
              <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
              <span>•</span>
              <span>{post.views_count || 1} views</span>
            </div>
          </div>
        </div>
      </header>

      {/* Article Main Body */}
      <main className="bg-navy-950 py-10 sm:py-12 px-4">
        <div className="container-max max-w-4xl">
          {/* Cover Hero Image in Fixed Aspect Ratio Container preventing CLS */}
          {post.cover_image && (
            <div className="rounded-2xl overflow-hidden mb-8 sm:mb-10 border border-white/20 aspect-video max-h-[460px] w-full bg-white/5 backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Excerpt callout in Glass Style */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] mb-8 text-white/90 text-sm sm:text-base leading-relaxed italic">
            {post.excerpt}
          </div>

          {/* AEO Problem -> Solution -> Expected Outcome Glass Grid (if present) */}
          {(post.problem_statement || post.technical_solution || post.expected_outcome) && (
            <div className="mb-10 p-5 sm:p-7 rounded-2xl bg-white/10 backdrop-blur-lg border border-cyan-neon/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-neon block">
                Executive Technical Summary (AEO Architecture)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {post.problem_statement && (
                  <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider block mb-1">
                      🔴 The Problem
                    </span>
                    <p className="text-xs text-gray-200 leading-relaxed">{post.problem_statement}</p>
                  </div>
                )}
                {post.technical_solution && (
                  <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-neon/20">
                    <span className="text-xs font-bold text-cyan-neon uppercase tracking-wider block mb-1">
                      ⚡ The Solution
                    </span>
                    <p className="text-xs text-gray-200 leading-relaxed">{post.technical_solution}</p>
                  </div>
                )}
                {post.expected_outcome && (
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                      🎯 Expected Outcome
                    </span>
                    <p className="text-xs text-gray-200 leading-relaxed">{post.expected_outcome}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Full Content (supports multi-paragraph text / markdown) */}
          <article className="prose prose-invert max-w-none text-white/90 leading-relaxed space-y-6 text-sm sm:text-base">
            {post.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="font-display text-lg sm:text-xl font-bold text-white mt-8 mb-3">
                    {paragraph.replace('### ', '')}
                  </h3>
                )
              }
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={idx} className="font-display text-xl sm:text-2xl font-bold text-cyan-neon mt-10 mb-4">
                    {paragraph.replace('## ', '')}
                  </h2>
                )
              }
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n').filter((l) => l.startsWith('- '))
                return (
                  <ul key={idx} className="space-y-2 list-none pl-0 my-4">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-white/90 text-sm sm:text-base">
                        <span className="text-cyan-neon mt-0.5">▸</span>
                        <span>{item.replace('- ', '')}</span>
                      </li>
                    ))}
                  </ul>
                )
              }
              return <p key={idx} className="text-white/90 leading-relaxed">{paragraph}</p>
            })}
          </article>

          {/* Dynamic Article FAQs (if present) */}
          {post.faqs && post.faqs.length > 0 && (
            <div className="mt-12 p-5 sm:p-7 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
              <h3 className="font-display text-lg font-bold text-white mb-4">
                Frequently Asked Inquiries on this Topic:
              </h3>
              <div className="space-y-2">
                {post.faqs.map((faq, fIdx) => {
                  const faqId = `blog-faq-${fIdx}`
                  const isOpen = activeFaq === faqId
                  return (
                    <div key={fIdx} className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setActiveFaq(isOpen ? null : faqId)}
                        className="w-full text-left px-4 py-3 flex items-center justify-between text-xs sm:text-sm font-semibold text-white/90 hover:text-cyan-neon"
                      >
                        <span>Q: {faq.question}</span>
                        <span className="text-cyan-neon text-xs">{isOpen ? '−' : '+'}</span>
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-3 text-xs sm:text-sm text-gray-300 border-t border-white/5 pt-2">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap gap-2 items-center">
              <span className="text-xs text-gray-400 mr-2">Tags:</span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs bg-white/10 text-cyan-neon border border-white/15"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Context-Aware Integrated Call-to-Action with Glassmorphism */}
          <section
            className="mt-12 glass-card p-6 sm:p-10 border border-cyan-neon/30 bg-white/10 backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-2xl relative overflow-hidden"
            aria-label="Actionable Next Step"
          >
            <div className="relative z-10">
              <span className="text-xs text-cyan-neon font-semibold uppercase tracking-wider block mb-2">
                Recommended Solution
              </span>
              <h2 className="font-display text-xl sm:text-3xl font-bold text-white mb-3">
                {post.cta_headline || 'Ready to Take Action on This?'}
              </h2>
              <p className="text-gray-300 text-xs sm:text-base leading-relaxed mb-6 max-w-2xl">
                {isStudentPost
                  ? 'OpenMNC provides 100% free career counseling for 12th-pass students and secures ₹3,000–₹10,000 partner college discounts. Speak directly with our education advisors today.'
                  : 'OpenMNC helps solopreneurs and visionary founders turn complex ideas into living, revenue-generating products with end-to-end development, AI automation, and ASO.'}
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
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
                  className="px-4 py-2.5 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400 hover:bg-green-500/25 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
                >
                  <span aria-hidden="true">💬</span> WhatsApp Inquiry
                </a>
              </div>
            </div>
          </section>

          {/* Author Box */}
          <div className="mt-10 glass-card p-5 sm:p-6 border border-white/20 bg-white/10 backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-glow/20 border border-amber-glow/30 flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0">
              👤
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white">{post.author_name || 'Amit Barai'}</h3>
              <p className="text-amber-glow text-xs font-semibold mb-1.5">Founder &amp; Director at OpenMNC LLP</p>
              <p className="text-gray-300 text-xs leading-relaxed">
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
