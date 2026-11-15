import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { servicesApi } from '../../api/services.js'
import { getServiceIcon } from '../../utils/helpers.js'

const ICON_OPTIONS = ['automation', 'development', 'social-media', 'student-guidance', 'training', 'consultation']

const FALLBACK_DEFAULT_SERVICES = [
  {
    order: 1,
    slug: 'business-automation',
    title: 'Business Automation & AI Integration',
    tagline: 'Multiply revenue. Eliminate manual work.',
    icon: 'automation',
    description: 'We help businesses automate repetitive tasks, integrate custom AI solutions, increase revenue, and improve operational reliability.',
    features: ['Custom AI workflow automation', 'Revenue multiplication', 'Process optimization', 'Uptime guarantee'],
    is_active: true,
  },
  {
    order: 2,
    slug: 'custom-development',
    title: 'Custom App & Software Development',
    tagline: 'From your idea to a living product.',
    icon: 'development',
    description: 'Transforming visionary ideas into reality with deep requirement analysis, full-cycle development, maintenance, and App Store Optimization (ASO).',
    features: ['Requirement analysis', 'Full-cycle dev & QA', 'ASO optimization', 'Maintenance & SLA'],
    is_active: true,
  },
  {
    order: 3,
    slug: 'inhouse-products',
    title: 'In-House Products & Games',
    tagline: 'Products we build, publish, and stand behind.',
    icon: 'development',
    description: 'OpenMNC develops and publishes proprietary custom software, mobile apps, and games on Google Play and Apple App Store (Kibo VPN, Calorie AI, CardSnap).',
    features: ['Google Play & App Store', 'Kibo VPN utility', 'Calorie AI assistant', 'CardSnap tool'],
    is_active: true,
  },
  {
    order: 4,
    slug: 'social-media-management',
    title: 'Social Media Management & Organic Growth',
    tagline: 'Grow organically without heavy ad spend.',
    icon: 'social-media',
    description: 'High-ROI organic growth for local shops, bakeries, real estate, and solopreneurs across Instagram, Facebook, and YouTube using viral scripts.',
    features: ['Instagram & YouTube growth', 'Viral Hook-Engage scripts', 'Video editing & captions', 'Hashtag strategy'],
    is_active: true,
  },
  {
    order: 5,
    slug: 'student-guidance',
    title: 'Student Guidance & EdTech Engine',
    tagline: '100% free guidance. Real college savings.',
    icon: 'student-guidance',
    description: '100% free career and college counseling for 12th-pass students with partner college fee subsidies of ₹3,000 to ₹10,000.',
    features: ['100% free counseling', '₹3,000–₹10,000 college subsidy', 'Aptitude field alignment', 'Zero charges'],
    is_active: true,
  },
  {
    order: 6,
    slug: 'industrial-training',
    title: 'Advanced Industrial Training',
    tagline: 'Real projects. High-end tech. 3 months.',
    icon: 'training',
    description: '3-month hands-on industrial training tackling high-end tech: Robotics, Drones, and AI Smart Home assistants in IoT, plus modern Web/App Dev.',
    features: ['Advanced IoT (Drones/Robotics)', 'Modern Web & App dev', 'Real production project', 'Partner subsidy offset'],
    is_active: true,
  },
]

function ServiceModal({ service, onClose, onSaved }) {
  const isEdit = Boolean(service?.slug)
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: service || {
      slug: '',
      title: '',
      tagline: '',
      description: '',
      icon: 'automation',
      features: ['Feature 1', 'Feature 2', 'Feature 3'],
      order: 1,
      is_active: true,
    },
  })
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function onSubmit(data) {
    setLoading(true)
    setErr('')
    const features = Array.isArray(data.features)
      ? data.features.filter(Boolean)
      : String(data.features || '').split('\n').map((f) => f.trim()).filter(Boolean)

    const payload = {
      ...data,
      features,
      order: Number(data.order) || 1,
      slug: data.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    }

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
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass-card w-full max-w-lg p-7 max-h-[90vh] overflow-y-auto border border-white/10 rounded-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-bold text-white">
            {isEdit ? 'Edit Service Vertical' : 'Add New Service Vertical'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">✕</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="svc_title" className="block text-xs font-medium text-gray-300 mb-1">Service Title *</label>
            <input
              id="svc_title"
              {...register('title', { required: 'Title is required' })}
              placeholder="e.g. Custom AI Workflow Engineering"
              className="w-full px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
            />
            {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="svc_slug" className="block text-xs font-medium text-gray-300 mb-1">URL Slug *</label>
              <input
                id="svc_slug"
                {...register('slug', { required: 'Slug is required' })}
                disabled={isEdit}
                placeholder="ai-workflow-engineering"
                className="w-full px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none disabled:opacity-60"
              />
              {errors.slug && <p className="text-xs text-red-400 mt-1">{errors.slug.message}</p>}
            </div>

            <div>
              <label htmlFor="svc_order" className="block text-xs font-medium text-gray-300 mb-1">Display Order</label>
              <input
                id="svc_order"
                type="number"
                {...register('order')}
                className="w-full px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="svc_tagline" className="block text-xs font-medium text-gray-300 mb-1">Tagline</label>
            <input
              id="svc_tagline"
              {...register('tagline')}
              placeholder="e.g. Multiply revenue. Eliminate manual work."
              className="w-full px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="svc_icon" className="block text-xs font-medium text-gray-300 mb-1">Icon Category</label>
            <select
              id="svc_icon"
              {...register('icon')}
              className="w-full px-3.5 py-2 rounded-lg bg-navy-900 border border-white/10 text-white text-sm focus:outline-none"
            >
              {ICON_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {getServiceIcon(o, o)} {o}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="svc_description" className="block text-xs font-medium text-gray-300 mb-1">Full Description</label>
            <textarea
              id="svc_description"
              rows={3}
              {...register('description')}
              placeholder="Explain how OpenMNC delivers this service..."
              className="w-full px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none resize-none"
            />
          </div>

          <div>
            <label htmlFor="svc_features" className="block text-xs font-medium text-gray-300 mb-1">
              Key Features / Deliverables (One per line)
            </label>
            <textarea
              id="svc_features"
              rows={4}
              {...register('features')}
              placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
              className="w-full px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="svc_active"
              {...register('is_active')}
              className="accent-cyan-neon w-4 h-4 cursor-pointer"
            />
            <label htmlFor="svc_active" className="text-sm text-gray-300 cursor-pointer">
              Active (Visible on public Services page)
            </label>
          </div>

          {err && <p className="text-red-400 text-xs">{err}</p>}

          <div className="flex gap-3 pt-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-cyan-neon text-navy-950 font-bold text-sm shadow-cyan-glow hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60"
            >
              {loading ? 'Saving...' : 'Save Service'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-white/10 text-gray-300 text-sm hover:bg-white/5"
            >
              Cancel
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
  const [seeding, setSeeding] = useState(false)
  const [modal, setModal] = useState(null)

  function load() {
    setLoading(true)
    servicesApi.getAll(true)
      .then((r) => {
        if (Array.isArray(r.data) && r.data.length > 0) {
          setServices(r.data)
        } else {
          // Fallback to the 6 core services so the page is never blank
          setServices(FALLBACK_DEFAULT_SERVICES)
        }
      })
      .catch(() => {
        setServices(FALLBACK_DEFAULT_SERVICES)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function handleSeedDefaults() {
    setSeeding(true)
    try {
      const res = await servicesApi.seedDefaults()
      if (Array.isArray(res.data) && res.data.length > 0) {
        setServices(res.data)
        alert('All 6 default OpenMNC services have been synchronized with the database!')
      }
    } catch {
      alert('Could not synchronize with database. Displaying local defaults.')
    } finally {
      setSeeding(false)
    }
  }

  async function handleDelete(slug) {
    if (!window.confirm(`Delete service "${slug}"?`)) return
    try {
      await servicesApi.delete(slug)
      load()
    } catch {
      alert('Could not delete service.')
    }
  }

  async function handleToggleStatus(svc) {
    const updated = svc.is_active === false ? true : false
    try {
      await servicesApi.update(svc.slug, { is_active: updated })
      setServices((prev) =>
        prev.map((s) => (s.slug === svc.slug ? { ...s, is_active: updated } : s))
      )
    } catch {
      alert('Failed to update service status.')
    }
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Services CMS</h1>
          <p className="text-gray-400 text-xs mt-0.5">
            {services.length} active and draft vertical(s) configured
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleSeedDefaults}
            disabled={seeding}
            className="px-3 py-2 bg-white/5 hover:bg-white/10 text-cyan-neon border border-cyan-neon/30 rounded-lg font-semibold text-xs transition-all"
            title="Ensures all 6 default OpenMNC services exist in MongoDB"
          >
            {seeding ? 'Syncing...' : '🌱 Sync 6 Default Services'}
          </button>
          <button
            onClick={() => setModal('add')}
            className="px-4 py-2 bg-cyan-neon text-navy-950 rounded-lg font-bold text-xs shadow-cyan-glow hover:scale-105 active:scale-95 transition-all"
            aria-label="Add new service"
          >
            + Add Service
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          <div className="w-8 h-8 border-2 border-cyan-neon/30 border-t-cyan-neon rounded-full animate-spin mx-auto mb-2" />
          Loading services...
        </div>
      ) : (
        <div className="glass-card overflow-x-auto border border-white/5 rounded-xl">
          <table className="w-full text-sm min-w-[700px]" aria-label="Services table">
            <thead className="border-b border-white/5 bg-white/2">
              <tr>
                {['#', 'Title & Tagline', 'Slug (URL)', 'Icon', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-gray-400 font-medium text-xs uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {services.map((svc) => (
                <tr key={svc.slug} className="hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{svc.order || 1}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white">{svc.title}</div>
                    <div className="text-xs text-gray-400 max-w-xs truncate">{svc.tagline}</div>
                  </td>
                  <td className="px-4 py-3 text-cyan-neon font-mono text-xs">/services#{svc.slug}</td>
                  <td className="px-4 py-3 text-gray-300 text-xs">
                    {getServiceIcon(svc.icon, svc.icon)} {svc.icon}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleStatus(svc)}
                      className={`text-xs px-2.5 py-0.5 rounded-full border cursor-pointer transition-all ${
                        svc.is_active !== false
                          ? 'text-green-400 border-green-500/30 bg-green-500/10 hover:bg-green-500/20'
                          : 'text-gray-500 border-gray-500/30 bg-gray-500/10 hover:bg-gray-500/20'
                      }`}
                      title="Click to toggle status"
                    >
                      {svc.is_active !== false ? '● Active' : '○ Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setModal(svc)}
                        className="text-xs text-cyan-neon hover:underline font-semibold"
                        aria-label={`Edit ${svc.title}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(svc.slug)}
                        className="text-xs text-red-400 hover:underline"
                        aria-label={`Delete ${svc.title}`}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <ServiceModal
            service={modal === 'add' ? null : modal}
            onClose={() => setModal(null)}
            onSaved={load}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
