import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { servicesApi } from '../../api/services.js'
import { getServiceIcon } from '../../utils/helpers.js'

const ICON_OPTIONS = ['automation', 'development', 'social-media', 'student-guidance', 'training', 'consultation']

function ServiceModal({ service, onClose, onSaved }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: service || {
      slug: '', title: '', tagline: '', description: '', icon: 'automation',
      features: ['', '', ''], order: 1, is_active: true,
    },
  })
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function onSubmit(data) {
    setLoading(true)
    setErr('')
    // Parse features from comma-separated if string
    const features = Array.isArray(data.features)
      ? data.features.filter(Boolean)
      : String(data.features).split('\n').map((f) => f.trim()).filter(Boolean)

    const payload = { ...data, features, order: Number(data.order) }
    try {
      if (service?.slug) {
        await servicesApi.update(service.slug, payload)
      } else {
        await servicesApi.create(payload)
      }
      onSaved()
      onClose()
    } catch (e) {
      setErr(e?.response?.data?.detail || 'Save failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={service ? 'Edit service' : 'Add new service'}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-card w-full max-w-lg p-7 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="font-display text-lg font-bold text-white mb-5">
          {service ? 'Edit Service' : 'Add New Service'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {[
            { name: 'title', label: 'Title', required: true },
            { name: 'slug', label: 'Slug (URL)', required: true },
            { name: 'tagline', label: 'Tagline' },
          ].map(({ name, label, required }) => (
            <div key={name}>
              <label htmlFor={name} className="block text-xs text-gray-400 mb-1">{label}</label>
              <input
                id={name}
                {...register(name, required ? { required: `${label} is required` } : {})}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
              />
              {errors[name] && <p className="text-xs text-red-400 mt-0.5">{errors[name].message}</p>}
            </div>
          ))}

          <div>
            <label htmlFor="icon" className="block text-xs text-gray-400 mb-1">Icon</label>
            <select
              id="icon"
              {...register('icon')}
              className="w-full px-3 py-2 rounded-lg bg-navy-900 border border-white/10 text-white text-sm focus:outline-none"
            >
              {ICON_OPTIONS.map((o) => (
                <option key={o} value={o}>{getServiceIcon(o, o)} {o}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-xs text-gray-400 mb-1">Description</label>
            <textarea
              id="description"
              rows={3}
              {...register('description')}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40 resize-none"
            />
          </div>

          <div>
            <label htmlFor="features" className="block text-xs text-gray-400 mb-1">Features (one per line)</label>
            <textarea
              id="features"
              rows={4}
              {...register('features')}
              placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="order" className="block text-xs text-gray-400 mb-1">Sort Order</label>
              <input
                id="order"
                type="number"
                {...register('order')}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none"
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('is_active')} className="accent-cyan-neon w-4 h-4" />
                <span className="text-sm text-gray-300">Active</span>
              </label>
            </div>
          </div>

          {err && <p className="text-red-400 text-xs">{err}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-cyan-neon text-navy-950 font-semibold text-sm disabled:opacity-60"
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
  const [modal, setModal] = useState(null) // null | 'add' | service object

  function load() {
    setLoading(true)
    servicesApi.getAll()
      .then((r) => setServices(Array.isArray(r.data) ? r.data : []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function handleDelete(slug) {
    if (!window.confirm('Delete this service?')) return
    await servicesApi.delete(slug)
    load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Services</h1>
          <p className="text-gray-400 text-sm">{services.length} service(s) configured</p>
        </div>
        <button
          onClick={() => setModal('add')}
          className="px-4 py-2 bg-cyan-neon text-navy-950 rounded-lg font-semibold text-sm hover:shadow-cyan-glow transition-all"
          aria-label="Add new service"
        >
          + Add Service
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm" aria-label="Services table">
            <thead className="border-b border-white/5">
              <tr>
                {['#', 'Title', 'Slug', 'Tagline', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-gray-400 font-medium text-xs uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {services.map((svc) => (
                <tr key={svc.slug} className="hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3 text-gray-500">{svc.order}</td>
                  <td className="px-4 py-3 text-white font-medium">{svc.title}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{svc.slug}</td>
                  <td className="px-4 py-3 text-gray-400 max-w-xs truncate">{svc.tagline}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${svc.is_active !== false ? 'text-green-400 border-green-500/30 bg-green-500/10' : 'text-gray-500 border-gray-500/30 bg-gray-500/10'}`}>
                      {svc.is_active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setModal(svc)}
                        className="text-xs text-cyan-neon hover:underline"
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
              {services.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                    No services yet. Click &ldquo;Add Service&rdquo; to get started.
                  </td>
                </tr>
              )}
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
