import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { blogsApi } from '../../api/blogs.js'
import { mediaApi } from '../../api/media.js'
import { formatDate } from '../../utils/helpers.js'

const BLOG_CATEGORIES = [
  'Engineering & Architecture',
  'Career Guidance',
  'Automation & AI',
  'Industrial Training',
  'General Tech',
]

function BlogModal({ blog, onClose, onSaved }) {
  const initialFaqsText = Array.isArray(blog?.faqs)
    ? blog.faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')
    : ''

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: blog?.title || '',
      slug: blog?.slug || '',
      category: blog?.category || 'Engineering & Architecture',
      target_audience: blog?.target_audience || 'Founders & Solopreneurs',
      excerpt: blog?.excerpt || '',
      content: blog?.content || '',
      cover_image: blog?.cover_image || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
      author_name: blog?.author_name || 'Amit Barai',
      author_role: blog?.author_role || 'Founder & Director, M/S. OPEN MNC LLP',
      tags: Array.isArray(blog?.tags) ? blog.tags.join(', ') : blog?.tags || '',
      target_service_slug: blog?.target_service_slug || 'vibe-coded-app-audit-and-fixing',
      cta_headline: blog?.cta_headline || 'Have a custom software or app codebase question?',
      cta_button_text: blog?.cta_button_text || 'Start an Engineering Review →',
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
      setErr(uploadErr?.response?.data?.detail || 'Cloudinary upload failed.')
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
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="liquid-glass w-full max-w-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto rounded-3xl"
      >
        <div className="flex items-center justify-between mb-5 border-b border-white/8 pb-4">
          <h2 className="font-display text-lg font-semibold text-white">
            {blog ? 'Edit Newsroom Article' : 'Draft New Article'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-[#86868b] hover:text-white flex items-center justify-center transition-colors">✕</button>
        </div>

        {err && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#d2d2d7] mb-1">Article Title *</label>
            <input
              {...register('title', { required: 'Title is required' })}
              placeholder="e.g. How Visionary Founders Turn App Ideas into Scalable Realities"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2997ff]"
            />
            {errors.title && <p className="text-red-400 text-[11px] mt-0.5">{errors.title.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#d2d2d7] mb-1">URL Slug *</label>
              <input
                {...register('slug', { required: 'Slug is required' })}
                placeholder="turn-app-idea-into-reality"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2997ff]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#d2d2d7] mb-1">Category</label>
              <select
                {...register('category')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c20] border border-white/10 text-white text-sm focus:outline-none"
              >
                {BLOG_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#d2d2d7] mb-1">Target Audience</label>
              <input
                {...register('target_audience')}
                placeholder="e.g. Founders & Solopreneurs"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2997ff]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#d2d2d7] mb-1">Tags (comma separated)</label>
              <input
                {...register('tags')}
                placeholder="App Development, ASO, Startup Advice"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2997ff]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#d2d2d7] mb-1">Summary / Excerpt *</label>
            <textarea
              rows={2}
              {...register('excerpt', { required: 'Excerpt is required' })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2997ff] resize-none"
            />
          </div>

          {/* Cover image with upload */}
          <div>
            <label className="block text-xs font-medium text-[#d2d2d7] mb-1">Cover Image URL</label>
            <input
              {...register('cover_image')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2997ff]"
            />
            <div className="mt-1 flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleCloudinaryUpload}
                className="text-xs text-[#86868b] file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-white/10 file:text-white cursor-pointer"
              />
              {uploadingImage && <span className="text-xs text-[#2997ff] animate-pulse">Uploading image...</span>}
            </div>
          </div>

          {/* AEO Fields Surface */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/8 space-y-3">
            <span className="text-xs font-semibold text-[#2997ff] uppercase tracking-wider block">
              AEO Architecture Fields (Google Knowledge Graph & AI Crawlers)
            </span>
            <div>
              <label className="block text-[11px] text-[#86868b] mb-1">Problem Statement</label>
              <textarea
                rows={2}
                {...register('problem_statement')}
                placeholder="The exact founder or business problem this article solves..."
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#2997ff] resize-none"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#86868b] mb-1">Technical Solution</label>
              <textarea
                rows={2}
                {...register('technical_solution')}
                placeholder="The engineering architecture or method used to resolve it..."
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#2997ff] resize-none"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#86868b] mb-1">Expected Outcome</label>
              <textarea
                rows={2}
                {...register('expected_outcome')}
                placeholder="Measurable business or academic impact..."
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#2997ff] resize-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#d2d2d7] mb-1">Full Article Content (Markdown format) *</label>
            <textarea
              rows={8}
              {...register('content', { required: 'Content is required' })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2997ff]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#d2d2d7] mb-1">
              FAQs (Format: Q: Question? \n A: Answer...)
            </label>
            <textarea
              rows={3}
              {...register('faqs_text')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#2997ff]"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_published"
              {...register('is_published')}
              className="accent-[#2997ff] w-4 h-4 cursor-pointer"
            />
            <label htmlFor="is_published" className="text-xs text-[#d2d2d7] cursor-pointer">
              Publish immediately on public website
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full text-xs font-semibold bg-[#2997ff] text-white hover:bg-[#0071e3] transition-all disabled:opacity-50"
            >
              {loading ? 'Saving Article...' : 'Save Article & Update Schema →'}
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
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    loadBlogs()
  }, [])

  async function loadBlogs() {
    setLoading(true)
    try {
      const res = await blogsApi.getAdminAll()
      setBlogs(res.data || [])
    } catch {
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(slug) {
    if (!window.confirm(`Delete article "${slug}"?`)) return
    try {
      await blogsApi.delete(slug)
      loadBlogs()
    } catch {
      alert('Failed to delete article.')
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#f5f5f7] tracking-tight">
            Newsroom &amp; Editorial CMS
          </h1>
          <p className="text-[#86868b] text-xs mt-0.5">
            Publish technical playbooks, AEO schemas, and student career articles.
          </p>
        </div>
        <button
          onClick={() => { setEditingBlog(null); setModalOpen(true) }}
          className="px-5 py-2.5 rounded-full text-xs font-semibold bg-white text-black hover:bg-[#f5f5f7] transition-all self-start sm:self-auto"
        >
          + Draft New Article
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#2997ff]/30 border-t-[#2997ff] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="rounded-2xl bg-[#161618] border border-white/8 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/8 bg-white/[0.02] text-[#86868b] text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Article</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8">
              {blogs.map((b) => (
                <tr key={b.slug} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-white">{b.title}</p>
                    <p className="text-xs text-[#86868b] font-mono">/blog/{b.slug}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/5 text-[#d2d2d7] border border-white/10">
                      {b.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-[#86868b] tabular-nums">
                    {formatDate(b.created_at)}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => { setEditingBlog(b); setModalOpen(true) }}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 text-white transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(b.slug)}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
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

      <AnimatePresence>
        {modalOpen && (
          <BlogModal
            blog={editingBlog}
            onClose={() => setModalOpen(false)}
            onSaved={loadBlogs}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
