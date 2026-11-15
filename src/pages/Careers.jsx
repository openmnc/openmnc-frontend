import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import ScrollReveal from '../components/ScrollReveal.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import GlowButton from '../components/GlowButton.jsx'
import { careersApi } from '../api/careers.js'
import { jobPostingSchema } from '../utils/jsonld.js'

const TYPE_COLORS = {
  'full-time': 'bg-cyan-neon/15 text-cyan-neon border-cyan-neon/30',
  'part-time': 'bg-amber-glow/15 text-amber-glow border-amber-glow/30',
  internship: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  contract: 'bg-green-500/15 text-green-400 border-green-500/30',
  remote: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
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
    working_days: '5 Days / Week (Mon - Fri) [Default]',
    description: 'Hands-on live project training on building autonomous AI agents, LLM tool pipelines, and FastAPI integrations with senior guidance.',
    responsibilities: [
      'Build API workflows using Python, FastAPI, and MongoDB',
      'Integrate OpenAI, Claude, and Gemini model tool functions',
      'Deploy and test responsive React frontend widgets',
    ],
    requirements: [
      'Basic knowledge of Python or JavaScript',
      'Curiosity for AI prompting and automation workflows',
      'Eager to work on production software (no boring textbook tasks)',
    ],
    benefits: [
      'Certificate of Internship & Completion',
      'Letter of Recommendation (LOR)',
      'Pre-Placement Offer (PPO) Opportunity',
      'High-Growth Performance Bonus',
      '100% Remote Flexibility',
    ],
  },
  {
    id: 'full-stack-ai-engineer',
    title: 'Full-Stack AI Developer',
    department: 'Engineering',
    location: 'Remote, India',
    type: 'full-time',
    experience_level: 'Mid-Level',
    salary_range: '₹6,00,000 - ₹12,00,000 / year',
    working_days: '5 Days / Week',
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
    working_days: '5 Days / Week',
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
  // Pre-load candidate data from browser storage if they applied previously!
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

  // Resume Upload Mode: 'file' | 'drive'
  const [resumeMode, setResumeMode] = useState('file')
  const [uploadedResumeUrl, setUploadedResumeUrl] = useState('')
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [uploadingFile, setUploadingFile] = useState(false)
  const fileInputRef = useRef(null)

  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleFileSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return

    // 10 MB limit
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

    // Must have either an uploaded file or a Google Drive URL
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

      // Save candidate session to browser storage for seamless persistence
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-card max-w-xl w-full p-6 sm:p-8 max-h-[92vh] overflow-y-auto border border-cyan-neon/30 rounded-2xl shadow-2xl"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between mb-4 border-b border-white/5 pb-3">
          <div>
            <span className="text-[10px] text-cyan-neon font-bold uppercase tracking-wider block">
              Direct Candidate Application
            </span>
            <h3 className="font-display text-xl font-bold text-white mt-0.5">{job.title}</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {job.department} • {job.location} • {job.stipend_range || job.salary_range || 'Competitive'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Candidate Name */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Full Name *</label>
            <input
              {...register('candidate_name', { required: 'Full name is required' })}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
            />
            {errors.candidate_name && <p className="text-red-400 text-[11px] mt-0.5">{errors.candidate_name.message}</p>}
          </div>

          {/* Email & Phone */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Email Address *</label>
              <input
                type="email"
                {...register('candidate_email', { required: 'Valid email is required' })}
                placeholder="your.email@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
              />
              {errors.candidate_email && <p className="text-red-400 text-[11px] mt-0.5">{errors.candidate_email.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Mobile / WhatsApp Number</label>
              <input
                type="tel"
                {...register('candidate_phone')}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
              />
            </div>
          </div>

          {/* Streamlined Education & Experience (Quick, not deep/tedious) */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Highest Qualification</label>
              <select
                {...register('education_level')}
                className="w-full px-3.5 py-2.5 rounded-lg bg-navy-900 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
              >
                <option value="Bachelor's / Undergraduate">Bachelor&apos;s / Undergrad (B.Tech / BCA / B.Sc / etc.)</option>
                <option value="12th Pass / Intermediate">12th Pass / High School</option>
                <option value="Master's / Postgraduate">Master&apos;s / Postgraduate (M.Tech / MCA / MBA)</option>
                <option value="Diploma / Polytechnic">Diploma / Polytechnic</option>
                <option value="Self-Taught / Other">Self-Taught / Developer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Current Experience Status</label>
              <select
                {...register('experience_status')}
                className="w-full px-3.5 py-2.5 rounded-lg bg-navy-900 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
              >
                <option value="Fresher / College Student">Fresher / College Student</option>
                <option value="0 - 1 Years Experience">0 - 1 Years Experience</option>
                <option value="1 - 3 Years Experience">1 - 3 Years Experience</option>
                <option value="3+ Years Professional">3+ Years Professional</option>
              </select>
            </div>
          </div>

          {/* CV / Resume Section: Direct Upload OR Google Drive Link */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>📄</span> Resume / CV Upload *
              </span>
              <div className="flex bg-navy-900 p-0.5 rounded-lg border border-white/10 text-[11px]">
                <button
                  type="button"
                  onClick={() => setResumeMode('file')}
                  className={`px-2.5 py-1 rounded font-semibold transition-all ${
                    resumeMode === 'file' ? 'bg-cyan-neon text-navy-950 shadow-sm' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setResumeMode('drive')}
                  className={`px-2.5 py-1 rounded font-semibold transition-all ${
                    resumeMode === 'drive' ? 'bg-cyan-neon text-navy-950 shadow-sm' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Google Drive Link
                </button>
              </div>
            </div>

            {resumeMode === 'file' ? (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {uploadedResumeUrl ? (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold truncate">
                      <span>✓</span>
                      <span className="truncate">{uploadedFileName || 'Resume uploaded'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedResumeUrl('')
                        setUploadedFileName('')
                      }}
                      className="text-xs text-red-400 hover:underline ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={uploadingFile}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-4 border-2 border-dashed border-cyan-neon/30 hover:border-cyan-neon/60 rounded-xl bg-white/2 hover:bg-white/5 transition-all text-center cursor-pointer"
                  >
                    {uploadingFile ? (
                      <span className="text-xs text-cyan-neon flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-cyan-neon border-t-transparent rounded-full animate-spin" />
                        Uploading document to Cloud CDN...
                      </span>
                    ) : (
                      <div>
                        <span className="text-sm font-semibold text-white block mb-0.5">
                          Click to upload CV (PDF / DOCX)
                        </span>
                        <span className="text-[11px] text-gray-400">
                          Max 10MB &bull; Stored directly on high-speed CDN
                        </span>
                      </div>
                    )}
                  </button>
                )}
              </div>
            ) : (
              <div>
                <input
                  type="url"
                  {...register('resume_google_drive_url')}
                  placeholder="https://drive.google.com/file/d/.../view"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  💡 Ensure sharing is set to &ldquo;Anyone with the link can view&rdquo;.
                </p>
              </div>
            )}
          </div>

          {/* Links: GitHub & LinkedIn */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">GitHub / Portfolio URL</label>
              <input
                type="url"
                {...register('portfolio_or_github_url')}
                placeholder="https://github.com/your-username"
                className="w-full px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">LinkedIn Profile</label>
              <input
                type="url"
                {...register('linkedin_url')}
                placeholder="https://linkedin.com/in/your-profile"
                className="w-full px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
              />
            </div>
          </div>

          {/* Brief Note */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Short Pitch / Why OpenMNC? (Optional)
            </label>
            <textarea
              rows={2}
              {...register('cover_note')}
              placeholder="What interests you most about this opportunity?"
              className="w-full px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-neon/40 resize-none"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {errorMsg}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploadingFile}
              className="flex-1 py-2.5 rounded-lg text-xs font-bold bg-cyan-neon text-navy-950 hover:shadow-cyan-glow disabled:opacity-50 transition-all"
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
      {/* Google Jobs Schema */}
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
            Solving real business challenges through AI automation, custom software, and robotics.
            Apply for full-time roles or industrial internships with stipends &amp; certificates.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#openings"
              className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-cyan-neon text-navy-950 hover:shadow-cyan-glow transition-all"
            >
              View Open Roles &amp; Internships ↓
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
              const isIntern = job.type?.toLowerCase() === 'internship'
              const typeClass = TYPE_COLORS[job.type?.toLowerCase()] || 'bg-gray-500/10 text-gray-400 border-gray-500/30'
              const pay = job.stipend_range || job.salary_range

              return (
                <ScrollReveal key={job.id || job._id || idx} delay={idx * 0.1}>
                  <article className="glass-card p-7 hover:border-cyan-neon/40 hover:shadow-cyan-glow-sm transition-all duration-300 flex flex-col justify-between h-full border border-white/5 rounded-2xl">
                    <div>
                      {/* Top Badges */}
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

                      {/* Pay & Schedule Row */}
                      <div className="flex flex-wrap items-center gap-3 mb-4 text-xs font-semibold">
                        {pay && (
                          <span className="text-amber-glow bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md">
                            💰 {pay}
                          </span>
                        )}
                        {job.internship_duration && (
                          <span className="text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-md">
                            ⏱ Duration: {job.internship_duration}
                          </span>
                        )}
                        {job.working_days && (
                          <span className="text-gray-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                            🗓 {job.working_days}
                          </span>
                        )}
                      </div>

                      <p className="text-gray-300 text-sm leading-relaxed mb-4">
                        {job.description}
                      </p>

                      {/* Requirements */}
                      {job.requirements && job.requirements.length > 0 && (
                        <div className="mb-4 space-y-1.5">
                          <p className="text-xs font-semibold text-gray-300">Key Requirements:</p>
                          {job.requirements.slice(0, 3).map((req, i) => (
                            <p key={i} className="text-xs text-gray-400 flex items-start gap-2">
                              <span className="text-cyan-neon mt-0.5">▸</span>
                              <span>{req}</span>
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Perks & Benefits Pills */}
                      {job.benefits && job.benefits.length > 0 && (
                        <div className="mb-5 flex flex-wrap gap-1.5">
                          {job.benefits.slice(0, 4).map((b, i) => (
                            <span key={i} className="text-[10px] bg-white/5 border border-white/5 text-gray-400 px-2 py-0.5 rounded-full">
                              ✓ {b}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Apply Footer */}
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[11px] text-gray-500">
                        {isIntern ? '🎓 Includes Certificate & LOR' : '⚡ Fast 48h HR Review'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedJobForApply(job)}
                        className="px-5 py-2 rounded-lg text-xs font-bold bg-cyan-neon text-navy-950 hover:bg-cyan-neon/90 shadow-cyan-glow-sm hover:scale-105 active:scale-95 transition-all"
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
          <div className="glass-card max-w-md w-full p-8 text-center border border-cyan-neon/40 rounded-2xl shadow-2xl">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="font-display text-2xl font-bold text-white mb-2">Application Submitted!</h3>
            <p className="text-gray-400 text-xs leading-relaxed mb-6">
              Your application has been received and stored in the HR system. Your session is now saved in your browser so you can track your status anytime!
            </p>
            <div className="space-y-3">
              <Link
                to="/careers/track"
                className="block w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-cyan-neon text-navy-950 shadow-cyan-glow hover:scale-[1.02] transition-all"
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
