import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { careersApi } from '../../api/careers.js'

const JOB_TYPES = ['full-time', 'part-time', 'internship', 'contract', 'remote']

function CareerModal({ job, onClose, onSaved }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: job || {
      title: '', department: '', location: 'Remote, India',
      type: 'full-time', description: '', requirements: '', is_active: true,
    },
  })
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function onSubmit(data) {
    setLoading(true)
    setErr('')
    const requirements = String(data.requirements).split('\n').map((r) => r.trim()).filter(Boolean)
    const payload = { ...data, requirements }
    try {
      if (job?._id || job?.id) {
        await careersApi.update(job._id || job.id, payload)
      } else {
        await careersApi.create(payload)
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
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-card w-full max-w-lg p-7 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="font-display text-lg font-bold text-white mb-5">
          {job ? 'Edit Job' : 'Post New Job'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="job-title" className="block text-xs text-gray-400 mb-1">Job Title *</label>
            <input
              id="job-title"
              {...register('title', { required: 'Title is required' })}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
            />
            {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="department" className="block text-xs text-gray-400 mb-1">Department</label>
              <input
                id="department"
                {...register('department')}
                placeholder="Engineering"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-xs text-gray-400 mb-1">Type</label>
              <select
                id="type"
                {...register('type')}
                className="w-full px-3 py-2 rounded-lg bg-navy-900 border border-white/10 text-white text-sm focus:outline-none"
              >
                {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-xs text-gray-400 mb-1">Location</label>
            <input
              id="location"
              {...register('location')}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-xs text-gray-400 mb-1">Description</label>
            <textarea
              id="description"
              rows={3}
              {...register('description')}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none resize-none"
            />
          </div>

          <div>
            <label htmlFor="requirements" className="block text-xs text-gray-400 mb-1">Requirements (one per line)</label>
            <textarea
              id="requirements"
              rows={4}
              {...register('requirements')}
              placeholder="2+ years experience&#10;React / Python&#10;Strong communication"
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none resize-none"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('is_active')} className="accent-cyan-neon w-4 h-4" />
            <span className="text-sm text-gray-300">Active (visible on site)</span>
          </label>

          {err && <p className="text-red-400 text-xs">{err}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-cyan-neon text-navy-950 font-semibold text-sm disabled:opacity-60"
            >
              {loading ? 'Saving...' : 'Save Job'}
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

export default function CareersAdmin() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)

  function load() {
    setLoading(true)
    careersApi.getAll()
      .then((r) => setJobs(Array.isArray(r.data) ? r.data : []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id) {
    if (!window.confirm('Delete this job posting?')) return
    await careersApi.delete(id)
    load()
  }

  async function handleToggle(job) {
    const id = job._id || job.id
    await careersApi.update(id, { is_active: !job.is_active })
    load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Careers</h1>
          <p className="text-gray-400 text-sm">{jobs.length} job posting(s)</p>
        </div>
        <button
          onClick={() => setModal('add')}
          className="px-4 py-2 bg-cyan-neon text-navy-950 rounded-lg font-semibold text-sm hover:shadow-cyan-glow transition-all"
        >
          + Post Job
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm" aria-label="Careers table">
            <thead className="border-b border-white/5">
              <tr>
                {['Title', 'Department', 'Type', 'Location', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-gray-400 font-medium text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {jobs.map((job) => {
                const id = job._id || job.id
                return (
                  <tr key={id} className="hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{job.title}</td>
                    <td className="px-4 py-3 text-gray-400">{job.department}</td>
                    <td className="px-4 py-3 text-gray-400 capitalize">{job.type}</td>
                    <td className="px-4 py-3 text-gray-400">{job.location}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggle(job)}
                        className={`text-xs px-2 py-0.5 rounded-full border transition-all ${
                          job.is_active !== false
                            ? 'text-green-400 border-green-500/30 bg-green-500/10 hover:bg-green-500/20'
                            : 'text-gray-500 border-gray-500/30 bg-gray-500/10 hover:bg-gray-500/20'
                        }`}
                        aria-label={`Toggle active status for ${job.title}`}
                      >
                        {job.is_active !== false ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setModal(job)} className="text-xs text-cyan-neon hover:underline">Edit</button>
                        <button onClick={() => handleDelete(id)} className="text-xs text-red-400 hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                    No job postings yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <CareerModal
            job={modal === 'add' ? null : modal}
            onClose={() => setModal(null)}
            onSaved={load}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
