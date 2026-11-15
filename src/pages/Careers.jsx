import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import ScrollReveal from '../components/ScrollReveal.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import GlowButton from '../components/GlowButton.jsx'
import { careersApi } from '../api/careers.js'
import { jobPostingSchema } from '../utils/jsonld.js'

const TYPE_COLORS = {
  'full-time': 'bg-cyan-neon/10 text-cyan-neon border-cyan-neon/30',
  'part-time': 'bg-amber-glow/10 text-amber-glow border-amber-glow/30',
  internship: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  contract: 'bg-green-500/10 text-green-400 border-green-500/30',
  remote: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
}

const DEFAULT_CAREERS = [
  {
    id: 'full-stack-ai-engineer',
    title: 'Full-Stack AI Developer',
    department: 'Engineering',
    location: 'Remote, India',
    type: 'full-time',
    experience_level: 'Mid-Level',
    salary_range: '₹6,00,000 - ₹12,00,000 / year',
    description: 'We are seeking an ambitious engineer to lead client AI workflow integrations and help build our in-house products.',
    responsibilities: [
      'Architect and build client web applications using React, Vite, and FastAPI',
      'Integrate OpenAI, Claude, and Gemini APIs into production pipelines',
      'Maintain MongoDB database models and optimize query speeds',
    ],
    requirements: [
      '2+ years experience with React and Python (FastAPI/Django/Flask)',
      'Hands-on experience with RESTful APIs, Git, and Docker',
      'Understanding of AI prompting, embeddings, and vector stores',
    ],
    benefits: [
      '100% remote flexibility',
      'Generous learning allowance for AI certifications',
      'Direct mentorship with founder Amit Barai',
    ],
  },
  {
    id: 'iot-robotics-trainer',
    title: 'IoT & Robotics Trainer (Advanced)',
    department: 'EdTech & Training',
    location: 'Hybrid / Remote, India',
    type: 'full-time',
    experience_level: 'Mid-Senior',
    salary_range: '₹5,00,000 - ₹9,00,000 / year',
    description: 'Lead our flagship 3-month industrial training program covering Drones, Robotics, and AI-enabled Smart Home systems.',
    responsibilities: [
      'Mentor college students and trainees on real-world IoT hardware and microcontrollers',
      'Guide trainees through drone assembly, sensor fusion, and robotics programming',
      'Review student project deliverables and certify industry readiness',
    ],
    requirements: [
      'Demonstrated experience in embedded systems, Arduino/ESP32/Raspberry Pi, and robotics',
      'Passion for practical, project-based teaching (no basic boring slides)',
      'Strong communication skills in Hindi and English',
    ],
    benefits: [
      'Hardware lab stipend',
      'Performance bonuses on cohort success',
      'Flexible schedule',
    ],
  },
]

function ApplicationModal({ job, onClose, onSuccess }) {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function onSubmit(data) {
    setSubmitting(true)
    setErrorMsg('')
    try {
      const payload = {
        job_id: job.id || job._id || 'general-application',
        job_title: job.title,
        candidate_name: data.candidate_name,
        candidate_email: data.candidate_email,
        candidate_phone: data.candidate_phone,
        resume_google_drive_url: data.resume_google_drive_url,
        portfolio_or_github_url: data.portfolio_or_github_url,
        linkedin_url: data.linkedin_url,
        cover_note: data.cover_note,
      }
      await careersApi.apply(payload)
      // Save email for quick tracking
      localStorage.setItem('openmnc_candidate_email', data.candidate_email)
      localStorage.setItem('openmnc_candidate_name', data.candidate_name)
      onSuccess(data.candidate_email)
    } catch (err) {
      setErrorMsg(err?.response?.data?.detail || 'Application submission failed. Please verify your Google Drive link.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-card max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-cyan-neon/30"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-[10px] text-cyan-neon font-semibold uppercase tracking-wider block">
              Application
            </span>
            <h3 className="font-display text-xl font-bold text-white">{job.title}</h3>
            <p className="text-xs text-gray-400">{job.department} • {job.location}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg p-1"
          >
            ✕
          </button>
        </div>

        <div className="p-3 mb-5 rounded-lg bg-cyan-neon/5 border border-cyan-neon/20 text-xs text-cyan-neon">
          💡 <strong>Zero-Storage Security:</strong> Please paste a viewable Google Drive link to your CV/Resume (ensure link permissions are set to &quot;Anyone with the link can view&quot;).
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Full Name *</label>
            <input
              {...register('candidate_name', { required: 'Name is required' })}
              placeholder="Amit Barai"
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
            />
            {errors.candidate_name && <p className="text-red-400 text-[11px] mt-0.5">{errors.candidate_name.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Email *</label>
              <input
                type="email"
                {...register('candidate_email', { required: 'Email is required' })}
                placeholder="you@gmail.com"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
              />
              {errors.candidate_email && <p className="text-red-400 text-[11px] mt-0.5">{errors.candidate_email.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Phone</label>
              <input
                type="tel"
                {...register('candidate_phone')}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Google Drive Resume Link *
            </label>
            <input
              type="url"
              {...register('resume_google_drive_url', { required: 'Resume link is required' })}
              placeholder="https://drive.google.com/file/d/..."
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
            />
            {errors.resume_google_drive_url && <p className="text-red-400 text-[11px] mt-0.5">{errors.resume_google_drive_url.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">GitHub / Portfolio URL</label>
              <input
                type="url"
                {...register('portfolio_or_github_url')}
                placeholder="https://github.com/username"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">LinkedIn Profile</label>
              <input
                type="url"
                {...register('linkedin_url')}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Why OpenMNC? (Brief Note)</label>
            <textarea
              rows={3}
              {...register('cover_note')}
              placeholder="Tell us what excites you about this role..."
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40 resize-none"
            />
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {errorMsg}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-lg text-xs font-semibold bg-cyan-neon text-navy-950 hover:bg-cyan-neon/90 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Application →'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function Careers() {
  const [jobs, setJobs] = useState(DEFAULT_CAREERS)
  const [selectedDept, setSelectedDept] = useState('All')
  const [selectedJobForApply, setSelectedJobForApply] = useState(null)
  const [appliedSuccessEmail, setAppliedSuccessEmail] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    careersApi.getAll()
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setJobs(res.data)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const departments = ['All', ...new Set(jobs.map((j) => j.department))]
  const filteredJobs = selectedDept === 'All' ? jobs : jobs.filter((j) => j.department === selectedDept)

  return (
    <>
      {/* Inject Google Jobs Schema for each job */}
      {jobs.map((job) => {
        const schema = jobPostingSchema(job)
        return (
          <script
            key={job.id || job._id}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        )
      })}

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 bg-navy-950 text-center" aria-label="OpenMNC Careers Hero">
        <div className="container-max max-w-3xl">
          <span className="text-xs text-cyan-neon font-semibold tracking-widest uppercase mb-4 block">
            Join Our Mission
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5">
            Build the Future at <span className="gradient-text">OpenMNC</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            We are solving real business challenges through AI automation, custom software, and community education.
            Join our remote-first team in India.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#openings"
              className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-cyan-neon text-navy-950 hover:shadow-cyan-glow transition-all"
            >
              View Open Roles ↓
            </a>
            <Link
              to="/careers/track"
              className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 text-cyan-neon border border-cyan-neon/30 transition-all flex items-center gap-2"
            >
              <span>🔍</span> Track Application Status
            </Link>
          </div>
        </div>
      </section>

      {/* Openings Grid */}
      <main id="openings" className="bg-navy-950 section-padding pt-6">
        <div className="container-max">
          {/* Department Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`
                  px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200
                  ${selectedDept === dept
                    ? 'bg-cyan-neon text-navy-950 shadow-cyan-glow-sm'
                    : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5'
                  }
                `}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Job List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredJobs.map((job, idx) => {
              const typeClass = TYPE_COLORS[job.type?.toLowerCase()] || 'bg-gray-500/10 text-gray-400 border-gray-500/30'
              return (
                <ScrollReveal key={job.id || job._id || idx} delay={idx * 0.1}>
                  <article className="glass-card p-7 hover:border-cyan-neon/40 hover:shadow-cyan-glow-sm transition-all duration-300 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h2 className="font-display text-xl font-bold text-white group-hover:text-cyan-neon transition-colors">
                            {job.title}
                          </h2>
                          <p className="text-gray-400 text-xs mt-0.5">{job.department} • 📍 {job.location}</p>
                        </div>
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider flex-shrink-0 ${typeClass}`}>
                          {job.type}
                        </span>
                      </div>

                      {job.salary_range && (
                        <p className="text-xs text-amber-glow font-semibold mb-3">
                          💰 {job.salary_range}
                        </p>
                      )}

                      <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        {job.description}
                      </p>

                      {job.requirements && job.requirements.length > 0 && (
                        <div className="mb-6 space-y-1.5">
                          <p className="text-xs font-semibold text-gray-300">Key Requirements:</p>
                          {job.requirements.slice(0, 3).map((req, i) => (
                            <p key={i} className="text-xs text-gray-400 flex items-start gap-2">
                              <span className="text-cyan-neon mt-0.5">▸</span>
                              <span>{req}</span>
                            </p>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[11px] text-gray-500">Google Drive Resume Support</span>
                      <button
                        type="button"
                        onClick={() => setSelectedJobForApply(job)}
                        className="px-4 py-2 rounded-lg text-xs font-bold bg-cyan-neon text-navy-950 hover:bg-cyan-neon/90 shadow-cyan-glow-sm transition-all"
                      >
                        Apply Now →
                      </button>
                    </div>
                  </article>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </main>

      {/* Application Modal */}
      {selectedJobForApply && (
        <ApplicationModal
          job={selectedJobForApply}
          onClose={() => setSelectedJobForApply(null)}
          onSuccess={(email) => {
            setSelectedJobForApply(null)
            setAppliedSuccessEmail(email)
          }}
        />
      )}

      {/* Application Success Modal */}
      {appliedSuccessEmail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-8 text-center border border-cyan-neon/40">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="font-display text-2xl font-bold text-white mb-2">Application Submitted!</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your resume link was securely received and synced with HR. You can track real-time hiring updates anytime.
            </p>
            <div className="space-y-3">
              <Link
                to="/careers/track"
                className="block w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-cyan-neon text-navy-950 shadow-cyan-glow"
              >
                Open My Application Tracker →
              </Link>
              <button
                onClick={() => setAppliedSuccessEmail(null)}
                className="text-xs text-gray-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
