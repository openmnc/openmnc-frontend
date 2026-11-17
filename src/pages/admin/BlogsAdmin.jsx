import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { blogsApi } from '../../api/blogs.js'
import { mediaApi } from '../../api/media.js'
import { formatDate } from '../../utils/helpers.js'

const BLOG_CATEGORIES = [
  'B2B & Tech Solutions',
  'Student Guidance',
  'AI & Automation',
  'Industrial Training',
  'Social Media Growth',
  'General Tech',
]

const TARGET_SERVICES = [
  { slug: 'custom-development', label: 'Custom App & Software Development' },
  { slug: 'business-automation', label: 'Business Automation & AI Integration' },
  { slug: 'student-guidance', label: 'Student Guidance & College Subsidies' },
  { slug: 'industrial-training', label: 'Advanced Industrial Training (3 Months)' },
  { slug: 'social-media-management', label: 'Social Media Management & Organic Growth' },
  { slug: 'inhouse-products', label: 'In-House Products Partnership' },
]

function BlogModal({ blog, onClose, onSaved }) {
  const initialFaqsText = Array.isArray(blog?.faqs)
    ? blog.faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')
    : ''

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: blog?.title || '',
      slug: blog?.slug || '',
      category: blog?.category || 'B2B & Tech Solutions',
      target_audience: blog?.target_audience || 'Founders & Solopreneurs',
      excerpt: blog?.excerpt || '',
      content: blog?.content || '',
      cover_image: blog?.cover_image || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
      author_name: blog?.author_name || 'Amit Barai',
      author_role: blog?.author_role || 'Founder & Director, OpenMNC LLP',
      tags: Array.isArray(blog?.tags) ? blog.tags.join(', ') : blog?.tags || '',
      target_service_slug: blog?.target_service_slug || 'custom-development',
      cta_headline: blog?.cta_headline || 'Have an app or business software idea?',
      cta_button_text: blog?.cta_button_text || 'Build Your Idea With OpenMNC →',
      problem_statement: blog?.problem_statement || '',
      technical_solution: blog?.technical_solution || '',
      expected_outcome: blog?.expected_outcome || '',
      faqs_text: initialFaqsText,
      is_published: blog?.is_published !== false,
    },
  })
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [err, setErr] = useState('')

  const coverImageUrl = watch('cover_image')

  async function handleCloudinaryUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    setErr('')
    try {
      const res = await mediaApi.upload(file, 'openmnc_blogs')
      if (res.data?.url) {
        setValue('cover_image', res.data.url)
      }
    } catch (uploadErr) {
      setErr(uploadErr?.response?.data?.detail || 'Cloudinary upload failed. Check Cloudinary API credentials.')
    } finally {
      setUploadingImage(false)
    }
  }

  async function onSubmit(data) {
    setLoading(true)
    setErr('')
    const tags = typeof data.tags === 'string'
      ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : data.tags || []

    const faqs = []
    if (data.faqs_text) {
      const blocks = data.faqs_text.split(/\n\s*\n/)
      for (const block of blocks) {
        const lines = block.split('\n').map((l) => l.trim()).filter(Boolean)
        let q = ''
        let a = ''
        for (const line of lines) {
          if (line.toLowerCase().startsWith('q:')) {
            q = line.substring(2).trim()
          } else if (line.toLowerCase().startsWith('a:')) {
            a = line.substring(2).trim()
          } else if (q && !a) {
            q += ' ' + line
          } else if (a) {
            a += ' ' + line
          }
        }
        if (q && a) {
          faqs.push({ question: q, answer: a })
        }
      }
    }

    const payload = {
      ...data,
      tags,
      problem_statement: data.problem_statement || null,
      technical_solution: data.technical_solution || null,
      expected_outcome: data.expected_outcome || null,
      faqs,
    }
    delete payload.faqs_text

    try {
      if (blog?.slug) {
        await blogsApi.update(blog.slug, payload)
      } else {
        await blogsApi.create(payload)
      }
      onSaved()
      onClose()
    } catch (e) {
      setErr(e?.response?.data?.detail || 'Save failed. Please check slug uniqueness.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass-card w-full max-w-2xl p-5 sm:p-7 max-h-[92vh] overflow-y-auto border border-white/20 bg-white/10 backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-2xl"
      >
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
          <h2 className="font-display text-lg font-bold text-white">
            {blog ? 'Edit Blog Article & AEO Fields' : 'Write New Article (No-Code CMS)'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Article Title *</label>
            <input
              {...register('title', { required: 'Title is required' })}
              placeholder="e.g. How Visionary Founders Turn App Ideas into Scalable Realities"
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
            />
            {errors.title && <p className="text-red-400 text-[11px] mt-0.5">{errors.title.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">URL Slug *</label>
              <input
                {...register('slug', { required: 'Slug is required' })}
                placeholder="turn-app-idea-into-reality"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Category</label>
              <select
                {...register('category')}
                className="w-full px-3 py-2 rounded-lg bg-navy-900 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
              >
                {BLOG_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Target Audience</label>
              <input
                {...register('target_audience')}
                placeholder="e.g. Founders & Solopreneurs / 12th Students"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
              />
            </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-gray-300">
                Cover Image (Cloudinary CDN Hosted)
              </label>
              {uploadingImage && (
                <span className="text-[11px] text-cyan-neon animate-pulse">
                  Uploading to Cloudinary...
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <input
                {...register('cover_image')}
                placeholder="https://res.cloudinary.com/... or paste image URL"
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
              />
              <label className="px-3 py-2 rounded-lg bg-cyan-neon/10 hover:bg-cyan-neon/20 border border-cyan-neon/30 text-cyan-neon text-xs font-semibold cursor-pointer whitespace-nowrap transition-all flex items-center gap-1.5">
                <span>📁</span>
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCloudinaryUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>
            </div>

            {coverImageUrl && (
              <div className="flex items-center gap-3 pt-1">
                <img
                  src={coverImageUrl}
                  alt="Cover preview"
                  className="w-14 h-10 object-cover rounded border border-white/10"
                />
                <span className="text-[10px] text-gray-400 truncate max-w-sm">
                  {coverImageUrl}
                </span>
              </div>
            )}
          </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Short Excerpt (SEO Meta) *</label>
            <textarea
              rows={2}
              {...register('excerpt', { required: 'Excerpt is required' })}
              placeholder="Brief summary that appears on cards and search engine results..."
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Full Article Content (Markdown / Text) *</label>
            <textarea
              rows={8}
              {...register('content', { required: 'Content is required' })}
              placeholder="Write your article here. Use ## for section headings, ### for subheadings, and - for bullet points."
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
            />
          </div>

          {/* AEO Fields for AI Chatbots & Rich Snippets */}
          <div className="p-3.5 rounded-xl bg-cyan-neon/5 border border-cyan-neon/20 space-y-3">
            <h4 className="text-xs font-bold text-cyan-neon uppercase tracking-wider">
              AEO Scraper Fields (AI Engine Optimization &amp; Search Citations)
            </h4>
            <div>
              <label className="block text-[11px] font-semibold text-red-400 mb-1">
                🔴 Problem Statement
              </label>
              <textarea
                rows={2}
                {...register('problem_statement')}
                placeholder="Core challenge or question this article addresses..."
                className="w-full px-3 py-1.5 rounded-lg bg-navy-950/80 border border-red-500/30 text-white text-xs leading-relaxed focus:outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-cyan-neon mb-1">
                ⚡ Technical Solution
              </label>
              <textarea
                rows={2}
                {...register('technical_solution')}
                placeholder="Technical architecture or methodology recommended..."
                className="w-full px-3 py-1.5 rounded-lg bg-navy-950/80 border border-cyan-neon/30 text-white text-xs leading-relaxed focus:outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-emerald-400 mb-1">
                🎯 Expected Outcome
              </label>
              <textarea
                rows={2}
                {...register('expected_outcome')}
                placeholder="Measurable business or academic outcome..."
                className="w-full px-3 py-1.5 rounded-lg bg-navy-950/80 border border-emerald-500/30 text-white text-xs leading-relaxed focus:outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                Article FAQs (Format: Q: Question? \n A: Answer.)
              </label>
              <textarea
                rows={3}
                {...register('faqs_text')}
                placeholder="Q: Why choose custom tracking over AppsFlyer?&#10;A: 100% data ownership and zero recurring fees."
                className="w-full px-3 py-1.5 rounded-lg bg-navy-950/80 border border-white/15 text-white text-xs leading-relaxed focus:outline-none"
              />
            </div>
          </div>

          {/* Contextual CTA Settings */}
          <div className="p-4 rounded-xl bg-cyan-neon/5 border border-cyan-neon/20 space-y-3">
            <h4 className="text-xs font-bold text-cyan-neon uppercase tracking-wider">
              Integrated Call-to-Action (AI Contextual Routing)
            </h4>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Target Service Route</label>
                <select
                  {...register('target_service_slug')}
                  className="w-full px-3 py-1.5 rounded-lg bg-navy-900 border border-white/10 text-white text-xs focus:outline-none"
                >
                  {TARGET_SERVICES.map((s) => (
                    <option key={s.slug} value={s.slug}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">CTA Headline</label>
                <input
                  {...register('cta_headline')}
                  className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs"
                />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Tags (comma-separated)</label>
              <input
                {...register('tags')}
                placeholder="App Development, ASO, Startup"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="is_published"
                {...register('is_published')}
                className="rounded text-cyan-neon"
              />
              <label htmlFor="is_published" className="text-xs font-medium text-white cursor-pointer">
                Publish immediately to website &amp; AI crawlers
              </label>
            </div>
          </div>

          {err && <div className="p-2 rounded bg-red-500/10 text-red-400 text-xs">{err}</div>}

          <div className="flex gap-3 pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg text-xs font-semibold bg-cyan-neon text-navy-950 hover:bg-cyan-neon/90 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save & Publish Article →'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function BlogsAdmin() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingBlog, setEditingBlog] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    loadBlogs()
  }, [])

  async function loadBlogs() {
    setLoading(true)
    try {
      const res = await blogsApi.getAllAdmin()
      setBlogs(res.data || [])
    } catch {
      // Fallback
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(slug) {
    if (!window.confirm(`Are you sure you want to delete this blog post?`)) return
    try {
      await blogsApi.delete(slug)
      loadBlogs()
    } catch {
      alert('Delete failed.')
    }
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white mb-1">
            Blog &amp; AI Recommendation Hub CMS
          </h1>
          <p className="text-gray-400 text-sm">
            Publish guides, career tips, and tech articles. Optimized for ChatGPT, Gemini, and Google indexing.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingBlog(null)
            setIsModalOpen(true)
          }}
          className="px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-cyan-neon text-navy-950 hover:bg-cyan-neon/90 shadow-cyan-glow-sm transition-all"
        >
          + Write New Article
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-cyan-neon/30 border-t-cyan-neon rounded-full animate-spin" />
        </div>
      ) : blogs.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <span className="text-4xl block mb-3">📝</span>
          <h3 className="font-display text-lg font-bold text-white mb-2">No Articles Yet</h3>
          <p className="text-gray-400 text-sm mb-6">
            Write your first article to start attracting organic searches and AI bot recommendations.
          </p>
          <button
            onClick={() => {
              setEditingBlog(null)
              setIsModalOpen(true)
            }}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-cyan-neon text-navy-950"
          >
            Create Article Now
          </button>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Title &amp; Category</th>
                <th className="py-3 px-4">Audience</th>
                <th className="py-3 px-4">Views</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {blogs.map((b) => (
                <tr key={b.slug} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-white line-clamp-1">{b.title}</p>
                    <span className="text-xs text-cyan-neon">{b.category}</span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-gray-400">
                    {b.target_audience || 'General'}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-gray-300 font-mono">
                    {b.views_count || 0}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        b.is_published
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-gray-500/10 text-gray-400 border-gray-500/30'
                      }`}
                    >
                      {b.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setEditingBlog(b)
                        setIsModalOpen(true)
                      }}
                      className="text-xs text-cyan-neon hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(b.slug)}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <BlogModal
          blog={editingBlog}
          onClose={() => setIsModalOpen(false)}
          onSaved={loadBlogs}
        />
      )}
    </div>
  )
}
