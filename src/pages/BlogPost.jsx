import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import SEO from '../components/SEO.jsx'
import { blogsApi } from '../api/blogs.js'
import { formatDate } from '../utils/helpers.js'
import { blogPostSchema, aeoTechArticleSchema, dynamicFaqSchema } from '../utils/jsonld.js'

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeFaq, setActiveFaq] = useState(null)

  useEffect(() => {
    async function loadPost() {
      setLoading(true)
      setError(false)
      try {
        const res = await blogsApi.getBySlug(slug)
        if (res.data) {
          setPost(res.data)
        } else {
          setError(true)
        }
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    loadPost()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas pt-40 flex justify-center">
        <div className="w-8 h-8 border-2 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !post) {
    return (
      <main className="min-h-screen bg-subtle pt-40 px-4 text-center">
        <div className="max-w-md mx-auto rounded-3xl bg-surface border border-hairline p-8 sm:p-10 shadow-sm">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
            <Search className="w-6 h-6" aria-hidden="true" />
          </div>
          <h1 className="type-h3 text-ink-primary mb-3">Article Not Found</h1>
          <p className="type-body text-ink-secondary text-sm mb-6">
            The requested article could not be loaded. It may have been relocated or updated.
          </p>
          <Link
            to="/blog"
            className="inline-block px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-primary text-white hover:bg-brand-primary-hover transition-all shadow-sm"
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

      {/* Article Header (Light-First Editorial) */}
      <header className="pt-32 sm:pt-40 pb-12 px-4 bg-canvas border-b border-hairline" aria-label="Article Header">
        <div className="section-container max-w-4xl mx-auto">
          <nav className="type-caption text-ink-muted mb-6 flex flex-wrap items-center gap-2" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-brand-primary">Home</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-brand-primary">Newsroom</Link>
            <span>/</span>
            <span className="text-brand-primary font-semibold truncate max-w-xs">{post.title}</span>
          </nav>

          <span className="inline-block px-3 py-1 rounded-full type-meta font-bold uppercase tracking-wider bg-brand-primary/10 text-brand-primary border border-brand-primary/20 mb-4">
            {post.category}
          </span>

          <h1 className="type-h1 text-ink-primary mb-6">
            {post.title}
          </h1>

          {/* Metadata & Author Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-t border-b border-hairline type-caption text-ink-secondary">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-bold flex items-center justify-center text-sm">
                {post.author_name ? post.author_name[0] : 'A'}
              </div>
              <div>
                <p className="text-ink-primary font-semibold">{post.author_name || 'Amit Barai'}</p>
                <p className="type-meta text-ink-muted">{post.author_role || 'Founder & Director, M/S. OPEN MNC LLP'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono type-meta text-ink-muted">
              <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
              <span>•</span>
              <span className="tabular-nums">{post.views_count || 1} views</span>
            </div>
          </div>
        </div>
      </header>

      {/* Article Main Body */}
      <main className="bg-subtle py-12 px-4 overflow-x-clip">
        <div className="section-container max-w-4xl mx-auto">
          {/* Cover Hero Image */}
          {post.cover_image && (
            <div className="rounded-3xl overflow-hidden mb-10 border border-hairline aspect-video max-h-[460px] w-full bg-surface shadow-sm">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Excerpt callout */}
          <div className="p-6 rounded-2xl bg-surface border border-hairline shadow-sm mb-10 type-body text-ink-primary italic border-l-4 border-l-brand-primary">
            {post.excerpt}
          </div>

          {/* AEO Problem -> Solution -> Expected Outcome Grid */}
          {(post.problem_statement || post.technical_solution || post.expected_outcome) && (
            <div className="mb-10 rounded-3xl bg-surface border border-hairline p-6 sm:p-8 space-y-4 shadow-sm">
              <span className="type-meta font-bold uppercase tracking-wider text-brand-primary block font-mono">
                Executive Technical Summary (AEO Architecture)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {post.problem_statement && (
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1 font-mono">
                      The Problem
                    </span>
                    <p className="type-caption text-ink-secondary leading-relaxed">{post.problem_statement}</p>
                  </div>
                )}
                {post.technical_solution && (
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1 font-mono">
                      The Engineering Solution
                    </span>
                    <p className="type-caption text-ink-secondary leading-relaxed">{post.technical_solution}</p>
                  </div>
                )}
                {post.expected_outcome && (
                  <div className="p-4 rounded-xl bg-brand-primary/5 border border-brand-primary/20">
                    <span className="text-xs font-bold text-brand-primary uppercase tracking-wider block mb-1 font-mono">
                      Expected Outcome
                    </span>
                    <p className="type-caption text-ink-secondary leading-relaxed">{post.expected_outcome}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Full Article Content */}
          <article className="rounded-3xl bg-surface border border-hairline shadow-sm p-6 sm:p-10 type-body text-ink-secondary leading-relaxed space-y-6">
            {post.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="type-h3 text-ink-primary mt-8 mb-3">
                    {paragraph.replace('### ', '')}
                  </h3>
                )
              }
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={idx} className="type-h2 text-ink-primary mt-10 mb-4 border-b border-hairline pb-2">
                    {paragraph.replace('## ', '')}
                  </h2>
                )
              }
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n').filter((l) => l.startsWith('- '))
                return (
                  <ul key={idx} className="space-y-2 list-none pl-0 my-4">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 type-body text-ink-secondary">
                        <span className="text-brand-primary mt-1 text-xs">●</span>
                        <span>{item.replace('- ', '')}</span>
                      </li>
                    ))}
                  </ul>
                )
              }
              return <p key={idx} className="type-body text-ink-secondary leading-relaxed">{paragraph}</p>
            })}
          </article>

          {/* Dynamic Article FAQs */}
          {post.faqs && post.faqs.length > 0 && (
            <div className="mt-12 rounded-3xl bg-surface border border-hairline shadow-sm p-6 sm:p-8">
              <h3 className="type-h3 text-ink-primary mb-4">
                Frequently Asked Inquiries
              </h3>
              <div className="divide-y divide-hairline">
                {post.faqs.map((faq, fIdx) => {
                  const faqId = `blog-faq-${fIdx}`
                  const isOpen = activeFaq === faqId
                  return (
                    <div key={fIdx} className="py-4">
                      <button
                        type="button"
                        onClick={() => setActiveFaq(isOpen ? null : faqId)}
                        className="w-full text-left flex items-center justify-between text-sm sm:text-base font-semibold text-ink-primary hover:text-brand-primary transition-colors cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        <span className="text-brand-primary font-bold text-base ml-4">{isOpen ? '−' : '+'}</span>
                      </button>
                      {isOpen && (
                        <div className="mt-3 type-body text-ink-secondary leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Contextual Bottom CTA (Warm Subtle) */}
          <div className="mt-12 p-8 sm:p-10 rounded-3xl bg-subtle border border-hairline shadow-sm text-ink-primary flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="type-h3 text-ink-primary">
                {post.cta_headline || 'Need Engineering or Educational Guidance?'}
              </h3>
              <p className="type-caption text-ink-secondary mt-1">
                Consult with our senior engineering team or explore 100% free counseling.
              </p>
            </div>
            <Link
              to={ctaTargetUrl}
              className="shrink-0 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-brand-primary text-white hover:bg-brand-primary-hover transition-all shadow-md"
            >
              {post.cta_button_text || 'Start Conversation →'}
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
