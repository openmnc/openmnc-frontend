import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { servicesApi } from '../../api/services.js'

const CATEGORY_OPTIONS = ['Engineering & App Services', 'Educational Guidance & Training']

function ServiceModal({ service, onClose, onSaved }) {
  const isEdit = Boolean(service?.slug)

  const initialFaqsText = Array.isArray(service?.faqs)
    ? service.faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')
    : ''

  const initialSubServicesText = Array.isArray(service?.sub_services) && service.sub_services.length > 0
    ? JSON.stringify(service.sub_services, null, 2)
    : ''

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      slug: service?.slug || '',
      title: service?.title || '',
      tagline: service?.tagline || '',
      description: service?.description || '',
      icon: service?.icon || 'development',
      category: service?.category || 'Engineering & App Services',
      problem_statement: service?.problem_statement || '',
      technical_solution: service?.technical_solution || '',
      expected_outcome: service?.expected_outcome || '',
      features: Array.isArray(service?.features) ? service.features.join('\n') : '',
      faqs_text: initialFaqsText,
      sub_services_text: initialSubServicesText,
      order: service?.order || 1,
      is_active: service?.is_active !== false,
    },
  })
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function onSubmit(data) {
    setLoading(true)
    setErr('')

    const features = String(data.features || '')
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean)

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

    let sub_services = []
    if (data.sub_services_text && data.sub_services_text.trim()) {
      try {
        const parsed = JSON.parse(data.sub_services_text)
        if (Array.isArray(parsed)) sub_services = parsed
      } catch {
        setErr('Invalid JSON format for Sub-services.')
        setLoading(false)
        return
      }
    }

    const payload = {
      ...data,
      features,
      faqs,
      sub_services,
    }
    delete payload.faqs_text
    delete payload.sub_services_text

    try {
      if (isEdit) {
        await servicesApi.update(service.slug, payload)
      } else {
        await servicesApi.create(payload)
      }
      onSaved()
      onClose()
    } catch (e) {
      setErr(e?.response?.data?.detail || 'Failed to save service.')
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
            {isEdit ? 'Edit Engineering Service' : 'Add New Service Pillar'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-[#86868b] hover:text-white flex items-center justify-center transition-colors">✕</button>
        </div>

        {err && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#d2d2d7] mb-1">Service Title *</label>
              <input
                {...register('title', { required: 'Title is required' })}
                placeholder="e.g. Vibe-Coded App Audit & Fixing"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2997ff]"
              />
              {errors.title && <p className="text-red-400 text-[11px] mt-0.5">{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-[#d2d2d7] mb-1">URL Slug *</label>
              <input
                {...register('slug', { required: 'Slug is required' })}
                placeholder="vibe-coded-app-audit-and-fixing"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2997ff]"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#d2d2d7] mb-1">Category</label>
              <select
                {...register('category')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c20] border border-white/10 text-white text-sm focus:outline-none"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#d2d2d7] mb-1">Tagline</label>
              <input
                {...register('tagline')}
                placeholder="Turn AI prototypes into real production apps"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2997ff]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#d2d2d7] mb-1">Full Service Description</label>
            <textarea
              rows={3}
              {...register('description')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2997ff] resize-none"
            />
          </div>

          {/* AEO Fields */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/8 space-y-3">
            <span className="text-xs font-semibold text-[#2997ff] uppercase tracking-wider block">
              SEO &amp; AEO Architecture
            </span>
            <div>
              <label className="block text-[11px] text-[#86868b] mb-1">Problem Statement</label>
              <textarea
                rows={2}
                {...register('problem_statement')}
                placeholder="Founders building MVPs with Cursor/Lovable getting stuck before launch..."
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#2997ff] resize-none"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#86868b] mb-1">Engineering Solution</label>
              <textarea
                rows={2}
                {...register('technical_solution')}
                placeholder="Complete code security review, DB restructuring, API hardening..."
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#2997ff] resize-none"
              />
            </div>
            <div>
              <label className="block text-[11px] text-[#86868b] mb-1">Expected Outcome</label>
              <textarea
                rows={2}
                {...register('expected_outcome')}
                placeholder="100% production ready, zero API leaks, passing App Store tests..."
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#2997ff] resize-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#d2d2d7] mb-1">Core Deliverables (one per line)</label>
            <textarea
              rows={3}
              {...register('features')}
              placeholder="Architecture & dependency security audit&#10;Supabase / Postgres schema hardening"
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

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full text-xs font-semibold bg-[#2997ff] text-white hover:bg-[#0071e3] transition-all disabled:opacity-50"
            >
              {loading ? 'Saving Service...' : 'Publish Service Pillar →'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function ServicesAdmin() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)

  useEffect(() => {
    loadServices()
  }, [])

  async function loadServices() {
    setLoading(true)
    try {
      const res = await servicesApi.getAll()
      setServices(res.data || [])
    } catch {
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(slug) {
    if (!window.confirm(`Delete service "${slug}"?`)) return
    try {
      await servicesApi.delete(slug)
      loadServices()
    } catch {
      alert('Failed to delete service.')
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#f5f5f7] tracking-tight">
            Services &amp; SEO Landing Pages
          </h1>
          <p className="text-[#86868b] text-xs mt-0.5">
            Manage the 5 core engineering pillars, problem routers, and deliverables.
          </p>
        </div>
        <button
          onClick={() => { setEditingService(null); setModalOpen(true) }}
          className="px-5 py-2.5 rounded-full text-xs font-semibold bg-white text-black hover:bg-[#f5f5f7] transition-all self-start sm:self-auto"
        >
          + Add Service Pillar
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
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8">
              {services.map((svc) => (
                <tr key={svc.slug} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-white">{svc.title}</p>
                    <p className="text-xs text-[#86868b] font-mono">/services/{svc.slug}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/5 text-[#d2d2d7] border border-white/10">
                      {svc.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-[#86868b] tabular-nums">
                    #{svc.order || 1}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => { setEditingService(svc); setModalOpen(true) }}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 text-white transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(svc.slug)}
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
          <ServiceModal
            service={editingService}
            onClose={() => setModalOpen(false)}
            onSaved={loadServices}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
