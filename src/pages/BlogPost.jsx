import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import SEO from '../components/SEO.jsx'
import { blogsApi } from '../api/blogs.js'
import { blogPostSchema, aeoTechArticleSchema, dynamicFaqSchema } from '../utils/jsonld.js'
import { formatDate } from '../utils/helpers.js'

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
      <div className="min-h-screen bg-black pt-40 flex justify-center">
        <div className="w-8 h-8 border-2 border-[#2997ff]/30 border-t-[#2997ff] rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !post) {
    return (
      <main className="min-h-screen bg-black pt-40 px-4 text-center">
        <div className="max-w-md mx-auto rounded-3xl bg-[#161618] border border-white/8 p-8 sm:p-10">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
            <Search className="w-6 h-6" aria-hidden="true" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-[#f5f5f7] mb-3">Article Not Found</h1>
          <p className="text-[#a1a1a6] text-sm mb-6">
            The requested article could not be loaded. It may have been relocated or updated.
          </p>
          <Link
            to="/blog"
            className="inline-block px-5 py-2.5 rounded-full text-xs font-semibold bg-white text-black hover:bg-[#f5f5f7] transition-all"
          >
            ← Return to Editorial Newsroom
          </Link>
        </div>
      </main>
    )
  }

  const postSchemas = [
    blogPostSchema(post),
    aeoTechArticleSchema(post),
    dynamicFaqSchema(post.faqs),
  ].filter(Boolean)

  const isStudentPost =
    post.category?.toLowerCase().includes('student') ||
    post.category?.toLowerCase().includes('career') ||
    post.target_service_slug === 'student-guidance'

  const ctaTargetUrl = isStudentPost ? '/career-guidance' : '/contact'

  const seoTitle = `${post.title} | OpenMNC`
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
        keywords={Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || 'OpenMNC, Engineering, Software Architecture'}
        schema={postSchemas}
      />

      {/* Article Header */}
      <header className="pt-36 pb-12 px-4 bg-black border-b border-white/8" aria-label="Article Header">
        <div className="container-max max-w-4xl mx-auto">
          <nav className="text-xs text-[#86868b] mb-6 flex flex-wrap items-center gap-2" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-white">Newsroom</Link>
            <span>/</span>
            <span className="text-[#2997ff] truncate max-w-xs">{post.title}</span>
          </nav>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#2997ff]/10 text-[#2997ff] border border-[#2997ff]/20 mb-4">
            {post.category}
          </span>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#f5f5f7] tracking-tight leading-tight mb-6">
            {post.title}
          </h1>

          {/* Metadata & Author Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-t border-b border-white/8 text-xs text-[#a1a1a6]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 text-white font-semibold flex items-center justify-center text-sm">
                {post.author_name ? post.author_name[0] : 'A'}
              </div>
              <div>
                <p className="text-[#f5f5f7] font-semibold">{post.author_name || 'Amit Barai'}</p>
                <p className="text-[#86868b] text-[11px]">{post.author_role || 'Founder & Director, M/S. OPEN MNC LLP'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs text-[#86868b]">
              <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
              <span>•</span>
              <span className="tabular-nums">{post.views_count || 1} views</span>
            </div>
          </div>
        </div>
      </header>

      {/* Article Main Body */}
      <main className="bg-black py-12 px-4">
        <div className="container-max max-w-4xl mx-auto">
          {/* Cover Hero Image in Fixed Aspect Ratio Container preventing CLS */}
          {post.cover_image && (
            <div className="rounded-3xl overflow-hidden mb-10 border border-white/8 aspect-video max-h-[460px] w-full bg-[#161618]">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Excerpt callout */}
          <div className="p-6 rounded-2xl bg-[#161618] border border-white/8 mb-10 text-[#d2d2d7] text-base leading-relaxed italic border-l-4 border-l-[#2997ff]">
            {post.excerpt}
          </div>

          {/* AEO Problem -> Solution -> Expected Outcome Grid */}
          {(post.problem_statement || post.technical_solution || post.expected_outcome) && (
            <div className="mb-10 rounded-2xl bg-[#161618] border border-white/8 p-6 sm:p-8 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2997ff] block">
                Executive Technical Summary (AEO Architecture)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {post.problem_statement && (
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/6">
                    <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider block mb-1">
                      The Problem
                    </span>
                    <p className="text-xs text-[#a1a1a6] leading-relaxed">{post.problem_statement}</p>
                  </div>
                )}
                {post.technical_solution && (
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/6">
                    <span className="text-xs font-semibold text-[#2997ff] uppercase tracking-wider block mb-1">
                      The Engineering Solution
                    </span>
                    <p className="text-xs text-[#a1a1a6] leading-relaxed">{post.technical_solution}</p>
                  </div>
                )}
                {post.expected_outcome && (
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/6">
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
                      Expected Outcome
                    </span>
                    <p className="text-xs text-[#a1a1a6] leading-relaxed">{post.expected_outcome}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Full Article Content */}
          <article className="rounded-2xl bg-[#161618] border border-white/8 p-6 sm:p-10 text-[#d2d2d7] leading-relaxed space-y-6 text-base">
            {post.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="font-display text-xl font-semibold text-[#f5f5f7] mt-8 mb-3">
                    {paragraph.replace('### ', '')}
                  </h3>
                )
              }
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={idx} className="font-display text-2xl font-semibold text-[#f5f5f7] mt-10 mb-4 border-b border-white/8 pb-2">
                    {paragraph.replace('## ', '')}
                  </h2>
                )
              }
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n').filter((l) => l.startsWith('- '))
                return (
                  <ul key={idx} className="space-y-2 list-none pl-0 my-4">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[#d2d2d7]">
                        <span className="text-[#2997ff] mt-1 text-xs">●</span>
                        <span>{item.replace('- ', '')}</span>
                      </li>
                    ))}
                  </ul>
                )
              }
              return <p key={idx} className="text-[#d2d2d7] leading-relaxed">{paragraph}</p>
            })}
          </article>

          {/* Dynamic Article FAQs */}
          {post.faqs && post.faqs.length > 0 && (
            <div className="mt-12 rounded-2xl bg-[#161618] border border-white/8 p-6 sm:p-8">
              <h3 className="font-display text-xl font-semibold text-[#f5f5f7] mb-4">
                Frequently Asked Inquiries
              </h3>
              <div className="divide-y divide-white/8">
                {post.faqs.map((faq, fIdx) => {
                  const faqId = `blog-faq-${fIdx}`
                  const isOpen = activeFaq === faqId
                  return (
                    <div key={fIdx} className="py-4">
                      <button
                        type="button"
                        onClick={() => setActiveFaq(isOpen ? null : faqId)}
                        className="w-full text-left flex items-center justify-between text-sm sm:text-base font-medium text-[#f5f5f7] hover:text-[#2997ff] transition-colors"
                      >
                        <span>{faq.question}</span>
                        <span className="text-[#2997ff] text-base ml-4">{isOpen ? '−' : '+'}</span>
                      </button>
                      {isOpen && (
                        <div className="mt-3 text-sm text-[#a1a1a6] leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Contextual Bottom CTA */}
          <div className="mt-12 p-8 rounded-3xl bg-[#161618] border border-white/8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-xl font-semibold text-[#f5f5f7]">
                {post.cta_headline || 'Need Engineering or Educational Guidance?'}
              </h3>
              <p className="text-xs text-[#86868b] mt-1">
                Consult with our senior engineering team or explore 100% free counseling.
              </p>
            </div>
            <Link
              to={ctaTargetUrl}
              className="flex-shrink-0 px-6 py-2.5 rounded-full text-xs font-semibold bg-white text-black hover:bg-[#f5f5f7] transition-all"
            >
              {post.cta_button_text || 'Start Conversation →'}
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
