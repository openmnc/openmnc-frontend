import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { careersApi } from '../../api/careers.js'

function CareerModal({ job, onClose, onSaved }) {
  const isEdit = Boolean(job?._id || job?.id)
  const defaultType = job?.type || 'internship'

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: job?.title || '',
      department: job?.department || 'Engineering',
      location: job?.location || 'Remote, India',
      type: defaultType,
      experience_level: job?.experience_level || (defaultType === 'internship' ? 'Internship' : 'Mid-Level'),
      salary_range: job?.salary_range || (defaultType === 'internship' ? '₹5,000 - ₹10,000 / month' : '₹6,00,000 - ₹12,00,000 / year'),
      internship_duration: job?.internship_duration || '3 Months (Standard)',
      stipend_range: job?.stipend_range || '₹5,000 - ₹10,000 / month',
      working_days: job?.working_days || '5 Days / Week (Mon - Fri)',
      description: job?.description || '',
      requirements: Array.isArray(job?.requirements) ? job.requirements.join('\n') : (job?.requirements || ''),
      is_active: job?.is_active ?? true,
    },
  })

  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function onSubmit(data) {
    setLoading(true)
    setErr('')
    const requirements = String(data.requirements || '')
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean)

    const payload = {
      ...data,
      requirements,
      salary_range: data.type === 'internship' ? data.stipend_range : data.salary_range,
    }

    try {
      if (isEdit) {
        await careersApi.update(job._id || job.id, payload)
      } else {
        await careersApi.create(payload)
      }
      onSaved()
      onClose()
    } catch (e) {
      setErr(e?.response?.data?.detail || 'Failed to save job.')
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
        className="liquid-glass w-full max-w-xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto rounded-3xl"
      >
        <div className="flex items-center justify-between mb-5 border-b border-white/8 pb-4">
          <h2 className="font-display text-lg font-semibold text-white">
            {isEdit ? 'Edit Opening' : 'Create Job Opening'}
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
            <label className="block text-xs font-medium text-[#d2d2d7] mb-1">Job Title *</label>
            <input
              {...register('title', { required: 'Title is required' })}
              placeholder="e.g. AI Workflow Developer (Internship)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2997ff]"
            />
            {errors.title && <p className="text-red-400 text-[11px] mt-0.5">{errors.title.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#d2d2d7] mb-1">Department</label>
              <select
                {...register('department')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c20] border border-white/10 text-white text-sm focus:outline-none"
              >
                <option value="Engineering">Engineering & Software</option>
                <option value="EdTech & Training">EdTech & Training</option>
                <option value="Design & Product">UI/UX & Product</option>
                <option value="Operations & HR">Operations & HR</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#d2d2d7] mb-1">Opportunity Type</label>
              <select
                {...register('type')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1c20] border border-white/10 text-white text-sm focus:outline-none"
              >
                <option value="internship">🎓 Internship</option>
                <option value="full-time">💼 Full-Time Employment</option>
                <option value="contract">📑 Contract</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#d2d2d7] mb-1">Stipend or Salary Range</label>
              <input
                {...register('stipend_range')}
                placeholder="₹5,000 - ₹10,000 / month"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#2997ff]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#d2d2d7] mb-1">Working Days</label>
              <input
                {...register('working_days')}
                placeholder="5 Days / Week (Mon - Fri)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2997ff]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#d2d2d7] mb-1">Job Description</label>
            <textarea
              rows={3}
              {...register('description')}
              placeholder="Overview of the responsibilities and project work..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2997ff] resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#d2d2d7] mb-1">Requirements (one per line)</label>
            <textarea
              rows={3}
              {...register('requirements')}
              placeholder="Basic knowledge of Python or JavaScript&#10;Hands-on REST API experience"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2997ff]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full text-xs font-semibold bg-[#2997ff] text-white hover:bg-[#0071e3] transition-all disabled:opacity-50"
            >
              {loading ? 'Saving Opening...' : 'Publish Opening →'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function CareersAdmin() {
  const [careers, setCareers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState(null)

  useEffect(() => {
    loadCareers()
  }, [])

  async function loadCareers() {
    setLoading(true)
    try {
      const res = await careersApi.getAll()
      setCareers(res.data || [])
    } catch {
      setCareers([])
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this opening?')) return
    try {
      await careersApi.delete(id)
      loadCareers()
    } catch {
      alert('Failed to delete opening.')
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#f5f5f7] tracking-tight">
            Career &amp; Internship Openings
          </h1>
          <p className="text-[#86868b] text-xs mt-0.5">
            Manage engineering jobs, internships, and applicant pipelines.
          </p>
        </div>
        <button
          onClick={() => { setEditingJob(null); setModalOpen(true) }}
          className="px-5 py-2.5 rounded-full text-xs font-semibold bg-white text-black hover:bg-[#f5f5f7] transition-all self-start sm:self-auto"
        >
          + Post New Opening
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
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Pay / Stipend</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8">
              {careers.map((job) => (
                <tr key={job.id || job._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-white">{job.title}</p>
                    <p className="text-xs text-[#86868b]">{job.department}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/5 text-[#d2d2d7] border border-white/10 uppercase">
                      {job.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-[#2997ff] tabular-nums">
                    {job.stipend_range || job.salary_range || 'Competitive'}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => { setEditingJob(job); setModalOpen(true) }}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 text-white transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(job.id || job._id)}
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
          <CareerModal
            job={editingJob}
            onClose={() => setModalOpen(false)}
            onSaved={loadCareers}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
