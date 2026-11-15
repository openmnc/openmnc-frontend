import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { careersApi } from '../../api/careers.js'

const JOB_TYPES = [
  { value: 'internship', label: '🎓 Internship (Student / Freshers)' },
  { value: 'full-time', label: '💼 Full-Time Employment' },
  { value: 'part-time', label: '⏱️ Part-Time' },
  { value: 'contract', label: '📑 Contract / Freelance' },
  { value: 'remote', label: '🌐 Remote Project' },
]

const DURATION_OPTIONS = ['1 Month', '2 Months', '3 Months (Standard)', '6 Months', 'Flexible']

const STIPEND_PRESETS = [
  '₹1,000 - ₹5,000 / month',
  '₹5,000 - ₹10,000 / month',
  '₹10,000 - ₹20,000 / month',
  'Performance-based Stipend + PPO',
  'Unpaid / Industrial Training Certificate',
]

const SCHEDULE_OPTIONS = [
  '5 Days / Week (Mon - Fri) [Default]',
  '6 Days / Week',
  'Flexible Schedule / Part-Time Hours',
  'Weekends Only',
]

const COMMON_BENEFITS = [
  'Certificate of Internship & Completion',
  'Letter of Recommendation (LOR)',
  'Pre-Placement Offer (PPO) Opportunity',
  'High-Growth Performance Bonus',
  '100% Remote Flexibility',
  '1-on-1 Mentorship with Founders',
  'Industry Project Portfolio Showcase',
]

function CareerModal({ job, onClose, onSaved }) {
  const isEdit = Boolean(job?._id || job?.id)
  const defaultType = job?.type || 'internship'

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      title: job?.title || '',
      department: job?.department || 'Engineering',
      location: job?.location || 'Remote, India',
      type: defaultType,
      experience_level: job?.experience_level || (defaultType === 'internship' ? 'Internship' : 'Mid-Level'),
      salary_range: job?.salary_range || (defaultType === 'internship' ? '₹5,000 - ₹10,000 / month' : '₹6,00,000 - ₹12,00,000 / year'),
      internship_duration: job?.internship_duration || '3 Months (Standard)',
      stipend_range: job?.stipend_range || '₹5,000 - ₹10,000 / month',
      working_days: job?.working_days || '5 Days / Week (Mon - Fri) [Default]',
      description: job?.description || '',
      requirements: Array.isArray(job?.requirements) ? job.requirements.join('\n') : (job?.requirements || ''),
      is_active: job?.is_active ?? true,
    },
  })

  const [selectedBenefits, setSelectedBenefits] = useState(
    Array.isArray(job?.benefits) && job.benefits.length > 0
      ? job.benefits
      : ['Certificate of Internship & Completion', 'Letter of Recommendation (LOR)', 'Pre-Placement Offer (PPO) Opportunity']
  )

  const selectedType = watch('type')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  function toggleBenefit(b) {
    if (selectedBenefits.includes(b)) {
      setSelectedBenefits(selectedBenefits.filter((item) => item !== b))
    } else {
      setSelectedBenefits([...selectedBenefits, b])
    }
  }

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
      benefits: selectedBenefits,
      salary_range: selectedType === 'internship' ? data.stipend_range : data.salary_range,
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
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass-card w-full max-w-2xl p-7 max-h-[90vh] overflow-y-auto border border-white/10 rounded-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-xl font-bold text-white">
              {isEdit ? 'Edit Opening' : 'Create Job / Internship Opening'}
            </h2>
            <p className="text-gray-400 text-xs mt-0.5">
              Fill in key requirements, schedule, and stipend/pay range.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 text-lg rounded-lg"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Job Title & Department */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-xs font-medium text-gray-300 mb-1">
                Job / Internship Title *
              </label>
              <input
                id="title"
                {...register('title', { required: 'Title is required' })}
                placeholder="e.g. AI Workflow Developer (Intern)"
                className="w-full px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
              />
              {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label htmlFor="department" className="block text-xs font-medium text-gray-300 mb-1">
                Department
              </label>
              <select
                id="department"
                {...register('department')}
                className="w-full px-3.5 py-2 rounded-lg bg-navy-900 border border-white/10 text-white text-sm focus:outline-none"
              >
                <option value="Engineering">Engineering & AI</option>
                <option value="EdTech & Training">EdTech & Training</option>
                <option value="Marketing & Growth">Marketing & Social Media</option>
                <option value="Design & Product">UI/UX & Product</option>
                <option value="Operations & HR">Operations & HR</option>
              </select>
            </div>
          </div>

          {/* Job Type & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="block text-xs font-medium text-gray-300 mb-1">
                Opportunity Type
              </label>
              <select
                id="type"
                {...register('type')}
                className="w-full px-3.5 py-2 rounded-lg bg-navy-900 border border-white/10 text-white text-sm focus:outline-none"
              >
                {JOB_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-xs font-medium text-gray-300 mb-1">
                Location & Mode
              </label>
              <input
                id="location"
                {...register('location')}
                placeholder="Remote, India or Hybrid"
                className="w-full px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* DYNAMIC CONDITIONAL SECTION: IF INTERNSHIP */}
          {selectedType === 'internship' ? (
            <div className="p-4 rounded-xl bg-purple-950/25 border border-purple-500/30 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider">
                <span>🎓 Internship Configuration</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="internship_duration" className="block text-xs text-gray-300 mb-1">
                    Internship Duration
                  </label>
                  <select
                    id="internship_duration"
                    {...register('internship_duration')}
                    className="w-full px-3 py-2 rounded-lg bg-navy-900 border border-purple-500/30 text-white text-sm focus:outline-none"
                  >
                    {DURATION_OPTIONS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="stipend_range" className="block text-xs text-gray-300 mb-1">
                    Monthly Stipend Range
                  </label>
                  <select
                    id="stipend_range"
                    {...register('stipend_range')}
                    className="w-full px-3 py-2 rounded-lg bg-navy-900 border border-purple-500/30 text-white text-sm focus:outline-none"
                  >
                    {STIPEND_PRESETS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="salary_range" className="block text-xs font-medium text-gray-300 mb-1">
                  Salary / Compensation Range
                </label>
                <input
                  id="salary_range"
                  {...register('salary_range')}
                  placeholder="e.g. ₹6,00,000 - ₹12,00,000 / year"
                  className="w-full px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="experience_level" className="block text-xs font-medium text-gray-300 mb-1">
                  Experience Level
                </label>
                <select
                  id="experience_level"
                  {...register('experience_level')}
                  className="w-full px-3.5 py-2 rounded-lg bg-navy-900 border border-white/10 text-white text-sm focus:outline-none"
                >
                  <option value="Entry-Level">Entry-Level (0-2 years)</option>
                  <option value="Mid-Level">Mid-Level (2-5 years)</option>
                  <option value="Senior">Senior (5+ years)</option>
                  <option value="Lead / Principal">Lead / Principal</option>
                </select>
              </div>
            </div>
          )}

          {/* Working Days / Schedule */}
          <div>
            <label htmlFor="working_days" className="block text-xs font-medium text-gray-300 mb-1">
              Work Schedule & Commitment
            </label>
            <select
              id="working_days"
              {...register('working_days')}
              className="w-full px-3.5 py-2 rounded-lg bg-navy-900 border border-white/10 text-white text-sm focus:outline-none"
            >
              {SCHEDULE_OPTIONS.map((sc) => (
                <option key={sc} value={sc}>{sc}</option>
              ))}
            </select>
          </div>

          {/* Quick Perks & Benefits Checkboxes */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-2">
              Perks, Bonuses & Benefits (Click to toggle)
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMON_BENEFITS.map((b) => {
                const isSelected = selectedBenefits.includes(b)
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => toggleBenefit(b)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all text-left ${
                      isSelected
                        ? 'bg-cyan-neon/15 border-cyan-neon/50 text-cyan-neon font-semibold'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {b}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Description & Requirements */}
          <div>
            <label htmlFor="description" className="block text-xs font-medium text-gray-300 mb-1">
              Role Summary & What They Will Build
            </label>
            <textarea
              id="description"
              rows={3}
              {...register('description', { required: 'Description is required' })}
              placeholder="Explain the role, learning curve, and impact at OpenMNC..."
              className="w-full px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none resize-none"
            />
          </div>

          <div>
            <label htmlFor="requirements" className="block text-xs font-medium text-gray-300 mb-1">
              Candidate Requirements (One item per line)
            </label>
            <textarea
              id="requirements"
              rows={3}
              {...register('requirements')}
              placeholder="Basic Python or JavaScript knowledge&#10;Eagerness to learn production AI workflows&#10;Strong problem solving mindset"
              className="w-full px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none resize-none font-mono text-xs"
            />
          </div>

          {/* Active status */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is_active"
              {...register('is_active')}
              className="accent-cyan-neon w-4 h-4 cursor-pointer"
            />
            <label htmlFor="is_active" className="text-sm text-gray-300 cursor-pointer">
              Active Opening (Visible to candidates on public site)
            </label>
          </div>

          {err && <p className="text-red-400 text-xs">{err}</p>}

          <div className="flex gap-3 pt-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-cyan-neon text-navy-950 font-bold text-sm shadow-cyan-glow hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60"
            >
              {loading ? 'Saving Opening...' : isEdit ? 'Update Opening' : 'Publish Opening'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-white/10 text-gray-300 text-sm hover:bg-white/5 transition-all"
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
    if (!window.confirm('Delete this opening?')) return
    await careersApi.delete(id)
    load()
  }

  async function handleToggleActive(job) {
    const updatedStatus = !job.is_active
    await careersApi.update(job._id || job.id, { is_active: updatedStatus })
    load()
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Career & Internship Openings</h1>
          <p className="text-gray-400 text-xs mt-0.5">
            {jobs.length} total position(s) published for candidates
          </p>
        </div>
        <button
          onClick={() => setModal('add')}
          className="px-4 py-2.5 bg-cyan-neon text-navy-950 rounded-lg font-bold text-xs shadow-cyan-glow hover:scale-105 active:scale-95 transition-all self-start sm:self-auto"
        >
          + Post New Opening / Internship
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          <div className="w-8 h-8 border-2 border-cyan-neon/30 border-t-cyan-neon rounded-full animate-spin mx-auto mb-2" />
          Loading positions...
        </div>
      ) : (
        <div className="glass-card overflow-x-auto border border-white/5 rounded-xl">
          <table className="w-full text-sm min-w-[700px]" aria-label="Careers table">
            <thead className="border-b border-white/5 bg-white/2">
              <tr>
                {['Position Title', 'Department', 'Type & Schedule', 'Compensation / Stipend', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-gray-400 font-medium text-xs uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {jobs.map((job) => {
                const isIntern = job.type === 'internship'
                return (
                  <tr key={job._id || job.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{job.title}</div>
                      <div className="text-[11px] text-gray-500">{job.location || 'Remote'}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-300 text-xs">
                      {job.department}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        isIntern
                          ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                          : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                      }`}>
                        {job.type?.toUpperCase()}
                      </span>
                      {job.internship_duration && (
                        <div className="text-[11px] text-gray-400 mt-1 font-mono">
                          ⏱ {job.internship_duration}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-300 text-xs font-mono">
                      {job.stipend_range || job.salary_range || 'Competitive'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(job)}
                        className={`text-xs px-2.5 py-0.5 rounded-full border cursor-pointer transition-all ${
                          job.is_active !== false
                            ? 'text-green-400 border-green-500/30 bg-green-500/10 hover:bg-green-500/20'
                            : 'text-gray-500 border-gray-500/30 bg-gray-500/10 hover:bg-gray-500/20'
                        }`}
                        title="Click to toggle visibility"
                      >
                        {job.is_active !== false ? '● Active' : '○ Draft'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setModal(job)}
                          className="text-xs text-cyan-neon hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(job._id || job.id)}
                          className="text-xs text-red-400 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500 text-xs">
                    No openings posted yet. Click &ldquo;+ Post New Opening / Internship&rdquo; to begin.
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
