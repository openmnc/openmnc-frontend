import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { CheckCircle2 } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import GlowButton from '../components/GlowButton.jsx'
import SEO from '../components/SEO.jsx'
import { careersApi } from '../api/careers.js'
import { jobPostingSchema } from '../utils/jsonld.js'

const TYPE_COLORS = {
  'full-time': 'bg-brand-primary/10 text-brand-primary border-brand-primary/20',
  'part-time': 'bg-amber-50 text-amber-800 border-amber-200',
  internship: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  contract: 'bg-purple-50 text-purple-800 border-purple-200',
  remote: 'bg-blue-50 text-blue-800 border-blue-200',
}

const DEFAULT_CAREERS = [
  {
    id: 'ai-workflow-developer-intern',
    title: 'AI Workflow Developer (Internship)',
    department: 'Engineering',
    location: 'Remote, India',
    type: 'internship',
    experience_level: 'Fresher / Student',
    internship_duration: '3 Months (Standard)',
    stipend_range: '₹5,000 - ₹10,000 / month',
    working_days: '5 Days / Week (Mon - Fri)',
    description: 'Hands-on live project training on building autonomous AI agents, LLM tool pipelines, and FastAPI integrations with senior engineering mentorship.',
    responsibilities: [
      'Build API workflows using Python, FastAPI, and MongoDB',
      'Integrate OpenAI, Claude, and Gemini model tool functions',
      'Deploy and test responsive React frontend widgets',
    ],
    requirements: [
      'Basic knowledge of Python or JavaScript',
      'Curiosity for AI prompting and automation workflows',
      'Eager to work on production software with real users',
    ],
    benefits: [
      'Certificate of Internship & Completion',
      'Letter of Recommendation (LOR)',
      'Pre-Placement Offer (PPO) Opportunity',
      '100% Remote Flexibility',
    ],
  },
  {
    id: 'full-stack-ai-engineer',
    title: 'Full-Stack Software Engineer',
    department: 'Engineering',
    location: 'Remote, India',
    type: 'full-time',
    experience_level: 'Mid-Level',
    salary_range: '₹6,00,000 - ₹12,00,000 / year',
    working_days: '5 Days / Week',
    description: 'Architect client web applications, database migrations, and production-grade software for international clients.',
    responsibilities: [
      'Architect and build client web applications using React, Vite, and FastAPI',
      'Integrate OpenAI, Claude, and Gemini APIs into production pipelines',
      'Maintain MongoDB & PostgreSQL database models and optimize query speeds',
    ],
    requirements: [
      '2+ years experience with React and Python (FastAPI/Django)',
      'Hands-on experience with RESTful APIs, Git, and Docker',
      'Understanding of AI prompting, embeddings, and vector stores',
    ],
    benefits: [
      '100% remote flexibility',
      'Annual learning allowance for engineering certifications',
      'Direct collaboration with founder Amit Barai',
    ],
  },
  {
    id: 'iot-robotics-trainer',
    title: 'IoT & Robotics Trainer (EdTech)',
    department: 'EdTech & Training',
    location: 'Hybrid / Remote, India',
    type: 'full-time',
    experience_level: 'Mid-Senior',
    salary_range: '₹5,00,000 - ₹9,00,000 / year',
    working_days: '5 Days / Week',
    description: 'Lead our flagship 3-month industrial training program covering Drones, Robotics, and AI-enabled Smart Home systems.',
    responsibilities: [
      'Mentor college students and trainees on real-world IoT hardware and microcontrollers',
      'Guide trainees through drone assembly, sensor fusion, and robotics programming',
      'Review student project deliverables and certify industry readiness',
    ],
    requirements: [
      'Demonstrated experience in embedded systems, Arduino/ESP32/Raspberry Pi, and robotics',
      'Passion for practical, project-based teaching',
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
  const savedEmail = localStorage.getItem('openmnc_candidate_email') || ''
  const savedName = localStorage.getItem('openmnc_candidate_name') || ''
  const savedPhone = localStorage.getItem('openmnc_candidate_phone') || ''

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      candidate_name: savedName,
      candidate_email: savedEmail,
      candidate_phone: savedPhone,
      education_level: "Bachelor's / Undergraduate",
      experience_status: "Fresher / College Student",
      resume_google_drive_url: '',
      portfolio_or_github_url: '',
      linkedin_url: '',
      cover_note: '',
    },
  })

  const [uploadedResumeUrl, setUploadedResumeUrl] = useState('')
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [uploadingFile, setUploadingFile] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleFileSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Selected file exceeds 10MB. Please choose a smaller file or paste a Google Drive link.')
      return
    }

    setUploadingFile(true)
    setErrorMsg('')
    try {
      const res = await careersApi.uploadResume(file)
      if (res.data?.url) {
        setUploadedResumeUrl(res.data.url)
        setUploadedFileName(file.name)
      } else {
        setErrorMsg('Failed to process upload. Please paste a Google Drive link instead.')
      }
    } catch (err) {
      setErrorMsg(err?.response?.data?.detail || 'Document upload failed. You can paste a Google Drive link below.')
    } finally {
      setUploadingFile(false)
    }
  }

  async function onSubmit(data) {
    setSubmitting(true)
    setErrorMsg('')

    const finalFileUrl = uploadedResumeUrl || ''
    const finalDriveUrl = data.resume_google_drive_url?.trim() || ''

    if (!finalFileUrl && !finalDriveUrl) {
      setErrorMsg('Please upload your resume file or provide a Google Drive link.')
      setSubmitting(false)
      return
    }

    try {
      const payload = {
        job_id: job.id || job._id || 'general-application',
        job_title: job.title,
        candidate_name: data.candidate_name,
        candidate_email: data.candidate_email,
        candidate_phone: data.candidate_phone,
        education_level: data.education_level,
        experience_status: data.experience_status,
        resume_file_url: finalFileUrl,
        resume_google_drive_url: finalDriveUrl || finalFileUrl,
        portfolio_or_github_url: data.portfolio_or_github_url,
        linkedin_url: data.linkedin_url,
        cover_note: data.cover_note,
      }

      await careersApi.apply(payload)

      localStorage.setItem('openmnc_candidate_email', data.candidate_email)
      localStorage.setItem('openmnc_candidate_name', data.candidate_name)
      if (data.candidate_phone) {
        localStorage.setItem('openmnc_candidate_phone', data.candidate_phone)
      }

      onSuccess(data.candidate_email)
    } catch (err) {
      setErrorMsg(err?.response?.data?.detail || 'Application submission failed. Please verify your details.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-dark-band/70 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="max-w-xl w-full p-6 sm:p-8 max-h-[92vh] overflow-y-auto rounded-3xl bg-surface border border-hairline shadow-2xl"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between mb-5 border-b border-hairline pb-4">
          <div>
            <span className="type-meta text-brand-primary font-bold uppercase tracking-wider block font-mono">
              Direct Candidate Application
            </span>
            <h3 className="type-h3 text-ink-primary mt-0.5">{job.title}</h3>
            <p className="type-caption text-ink-secondary mt-0.5">
              {job.department} • {job.location} • <span className="tabular-nums font-semibold text-brand-primary">{job.stipend_range || job.salary_range || 'Competitive'}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-subtle hover:bg-white border border-hairline text-ink-secondary hover:text-ink-primary flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block type-caption font-semibold text-ink-primary mb-1">Full Name *</label>
            <input
              {...register('candidate_name', { required: 'Full name is required' })}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-hairline text-ink-primary text-sm focus:outline-none focus:border-brand-primary transition-colors shadow-sm"
            />
            {errors.candidate_name && <p className="text-red-600 text-[11px] mt-0.5">{errors.candidate_name.message}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block type-caption font-semibold text-ink-primary mb-1">Email Address *</label>
              <input
                type="email"
                {...register('candidate_email', { required: 'Email is required' })}
                placeholder="you@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-hairline text-ink-primary text-sm focus:outline-none focus:border-brand-primary transition-colors shadow-sm"
              />
              {errors.candidate_email && <p className="text-red-600 text-[11px] mt-0.5">{errors.candidate_email.message}</p>}
            </div>
            <div>
              <label className="block type-caption font-semibold text-ink-primary mb-1">WhatsApp / Phone *</label>
              <input
                {...register('candidate_phone', { required: 'Phone is required' })}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-hairline text-ink-primary text-sm focus:outline-none focus:border-brand-primary transition-colors shadow-sm"
              />
              {errors.candidate_phone && <p className="text-red-600 text-[11px] mt-0.5">{errors.candidate_phone.message}</p>}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block type-caption font-semibold text-ink-primary mb-1">Education Level</label>
              <select
                {...register('education_level')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-hairline text-ink-primary text-sm focus:outline-none shadow-sm"
              >
                <option value="12th Pass">12th Pass (Higher Secondary)</option>
                <option value="Bachelor's / Undergraduate">Bachelor's / Undergraduate (B.Tech, BCA, BSc)</option>
                <option value="Master's / Postgraduate">Master's / Postgraduate (M.Tech, MCA)</option>
                <option value="Diploma">Diploma / Polytechnic</option>
              </select>
            </div>
            <div>
              <label className="block type-caption font-semibold text-ink-primary mb-1">Experience Status</label>
              <select
                {...register('experience_status')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-hairline text-ink-primary text-sm focus:outline-none shadow-sm"
              >
                <option value="Fresher / College Student">Fresher / College Student</option>
                <option value="1-2 Years Experience">1–2 Years Experience</option>
                <option value="3+ Years Experience">3+ Years Experience</option>
              </select>
            </div>
          </div>

          {/* Resume Upload Box */}
          <div className="p-4 rounded-2xl bg-subtle border border-hairline space-y-3">
            <span className="type-caption font-semibold text-ink-primary block">
              Upload Resume / CV (PDF or Word)
            </span>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="text-xs text-ink-secondary file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-surface file:text-ink-primary file:border file:border-hairline hover:file:bg-subtle cursor-pointer shadow-sm"
              />
              {uploadingFile && <span className="text-xs text-brand-primary animate-pulse">Uploading...</span>}
            </div>
            {uploadedFileName && (
              <p className="text-xs text-emerald-700 font-mono font-medium">
                ✓ Attached: {uploadedFileName}
              </p>
            )}

            <div className="pt-2 border-t border-hairline">
              <label className="block type-meta text-ink-muted mb-1">
                Or share Google Drive / Dropbox link:
              </label>
              <input
                {...register('resume_google_drive_url')}
                placeholder="https://drive.google.com/file/d/..."
                className="w-full px-3 py-2 rounded-lg bg-white border border-hairline text-ink-primary text-xs focus:outline-none focus:border-brand-primary shadow-sm"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block type-caption font-semibold text-ink-primary mb-1">GitHub or Portfolio</label>
              <input
                {...register('portfolio_or_github_url')}
                placeholder="https://github.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-hairline text-ink-primary text-sm focus:outline-none focus:border-brand-primary shadow-sm"
              />
            </div>
            <div>
              <label className="block type-caption font-semibold text-ink-primary mb-1">LinkedIn Profile</label>
              <input
                {...register('linkedin_url')}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-hairline text-ink-primary text-sm focus:outline-none focus:border-brand-primary shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block type-caption font-semibold text-ink-primary mb-1">Brief Introduction (Optional)</label>
            <textarea
              rows={2}
              {...register('cover_note')}
              placeholder="Tell us what you're excited to work on..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-hairline text-ink-primary text-sm focus:outline-none focus:border-brand-primary resize-none shadow-sm"
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-red-600 p-2.5 rounded-lg bg-red-50 border border-red-200">
              {errorMsg}
            </p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-brand-primary hover:bg-brand-primary-hover text-white transition-all disabled:opacity-50 shadow-md cursor-pointer"
            >
              {submitting ? 'Submitting Application...' : 'Submit Application →'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function Careers() {
  const [careers, setCareers] = useState(DEFAULT_CAREERS)
  const [selectedJob, setSelectedJob] = useState(null)
  const [filterType, setFilterType] = useState('All')
  const [successEmail, setSuccessEmail] = useState('')

  useEffect(() => {
    careersApi.getAll()
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setCareers(res.data)
        }
      })
      .catch(() => {})
  }, [])

  const filteredJobs = filterType === 'All'
    ? careers
    : careers.filter((j) => j.type === filterType || (filterType === 'internship' && j.type === 'internship'))

  return (
    <>
      <SEO
        title="Careers & Engineering Internships — OpenMNC"
        description="Join OpenMNC as a software engineer, AI workflow developer, or IoT robotics mentor. Competitive stipends, remote flexibility, and production-grade engineering."
        canonical="/careers"
      />

      {/* Page Hero (Light-First Editorial) */}
      <section className="pt-32 sm:pt-40 pb-16 px-4 bg-canvas text-center overflow-x-clip relative" aria-label="OpenMNC Careers">
        <div className="absolute inset-0 bg-ambient-mesh pointer-events-none" />
        <div className="section-container max-w-4xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full type-meta font-bold uppercase tracking-wider bg-brand-primary/10 border border-brand-primary/20 text-brand-primary mb-6 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
            Join Our Engineering Team
          </span>
          <h1 className="type-h1 text-ink-primary mb-6">
            Build Real Software.{' '}
            <span className="text-brand-primary block mt-1">No Textbook Tasks.</span>
          </h1>
          <p className="type-body text-ink-secondary text-base sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
            Whether you are a senior developer or an ambitious student seeking hands-on production experience,
            OpenMNC offers high-autonomy roles with transparent compensation and mentorship.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/careers/track"
              className="px-6 py-3 rounded-xl type-caption font-semibold bg-surface hover:bg-subtle text-ink-primary border border-hairline transition-all shadow-sm"
            >
              Track Existing Application →
            </Link>
            <Link
              to="/career-guidance"
              className="px-6 py-3 rounded-xl type-caption font-bold uppercase tracking-wider bg-brand-primary/10 hover:bg-brand-primary/15 text-brand-primary border border-brand-primary/20 transition-all shadow-sm"
            >
              12th-Pass Free Career Portal →
            </Link>
          </div>
        </div>
      </section>

      <main className="bg-subtle pb-24 px-4 overflow-x-clip">
        <div className="section-container max-w-5xl mx-auto">
          {/* Segmented Filter Pills */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex p-1.5 rounded-full bg-surface border border-hairline shadow-sm gap-1">
              {['All', 'internship', 'full-time'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    filterType === type
                      ? 'bg-brand-primary text-white shadow-sm'
                      : 'text-ink-secondary hover:text-ink-primary hover:bg-subtle'
                  }`}
                >
                  {type === 'All' ? 'All Roles' : type === 'internship' ? 'Internships' : 'Full-Time'}
                </button>
              ))}
            </div>
          </div>

          {/* Success Notification */}
          {successEmail && (
            <div className="mb-8 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="type-h3 text-emerald-950">Application Received!</h3>
              <p className="type-body text-ink-secondary text-xs sm:text-sm mt-1">
                We have registered your application for <strong className="text-ink-primary">{successEmail}</strong>.
                You can track your real-time review status anytime in our candidate tracker.
              </p>
              <Link
                to="/careers/track"
                className="mt-3 inline-block px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              >
                Open Candidate Tracker →
              </Link>
            </div>
          )}

          {/* Jobs List - Light Surface */}
          <div className="space-y-4">
            {filteredJobs.map((job) => {
              const badgeClass = TYPE_COLORS[job.type] || 'bg-subtle text-ink-secondary border-hairline'

              return (
                <article
                  key={job.id || job._id}
                  className="rounded-3xl bg-surface border border-hairline p-6 sm:p-8 hover:border-brand-primary/40 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full type-meta font-bold uppercase tracking-wider border ${badgeClass}`}>
                        {job.type}
                      </span>
                      <span className="type-caption text-ink-muted">
                        {job.department} • {job.location}
                      </span>
                    </div>

                    <h2 className="type-h2 text-ink-primary">
                      {job.title}
                    </h2>

                    <p className="type-body text-ink-secondary text-xs sm:text-sm line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-brand-primary pt-1">
                      <span className="tabular-nums font-bold">
                        {job.stipend_range || job.salary_range || 'Competitive'}
                      </span>
                      {job.working_days && (
                        <span className="text-ink-muted font-sans">• {job.working_days}</span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0">
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-brand-primary hover:bg-brand-primary-hover text-white transition-all shadow-sm cursor-pointer"
                    >
                      Apply Now →
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </main>

      {/* Application Modal */}
      <AnimatePresence>
        {selectedJob && (
          <ApplicationModal
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
            onSuccess={(email) => {
              setSelectedJob(null)
              setSuccessEmail(email)
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
