import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, FileText } from 'lucide-react'
import SEO from '../components/SEO.jsx'
import { careersApi } from '../api/careers.js'
import { formatDate } from '../utils/helpers.js'

const STATUS_PROGRESSION = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Interview Scheduled',
  'Offer',
]

const STATUS_COLORS = {
  applied: 'bg-blue-50 text-blue-800 border-blue-200',
  'under review': 'bg-amber-50 text-amber-800 border-amber-200',
  shortlisted: 'bg-purple-50 text-purple-800 border-purple-200',
  'interview scheduled': 'bg-brand-primary/10 text-brand-primary border-brand-primary/20',
  offer: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  rejected: 'bg-red-50 text-red-800 border-red-200',
}

export default function ApplicationTracker() {
  const [candidateEmail, setCandidateEmail] = useState('')
  const [candidateName, setCandidateName] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('openmnc_candidate_email')
    const savedName = localStorage.getItem('openmnc_candidate_name')
    if (saved) {
      setCandidateEmail(saved)
      if (savedName) setCandidateName(savedName)
      setIsAuthenticated(true)
      fetchStatus(saved)
    }
  }, [])

  async function fetchStatus(email) {
    setLoading(true)
    setError('')
    try {
      const res = await careersApi.trackApplications(email)
      setApplications(res.data || [])
    } catch {
      setError('Could not retrieve applications. Please check your email and try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleLoginSubmit(e) {
    e.preventDefault()
    if (!candidateEmail || !candidateEmail.includes('@')) {
      setError('Please enter a valid application email.')
      return
    }
    const derivedName = candidateName || candidateEmail.split('@')[0].replace(/[._]/g, ' ')
    setCandidateName(derivedName)
    setIsAuthenticated(true)

    if (rememberMe) {
      localStorage.setItem('openmnc_candidate_email', candidateEmail)
      localStorage.setItem('openmnc_candidate_name', derivedName)
    }
    fetchStatus(candidateEmail)
  }

  function handleLogout() {
    setIsAuthenticated(false)
    setApplications([])
    localStorage.removeItem('openmnc_candidate_email')
    localStorage.removeItem('openmnc_candidate_name')
    localStorage.removeItem('openmnc_candidate_phone')
  }

  return (
    <>
      <SEO
        title="Candidate Application Tracker — OpenMNC Careers"
        description="Check real-time hiring status, interview scheduling, and feedback for your job applications at OpenMNC."
        canonical="/careers/track"
      />

      {/* Header (Light-First Editorial) */}
      <section className="pt-32 sm:pt-40 pb-12 px-4 bg-canvas text-center overflow-x-clip relative" aria-label="Candidate Tracker Header">
        <div className="absolute inset-0 bg-ambient-mesh pointer-events-none" />
        <div className="section-container max-w-3xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full type-meta font-bold uppercase tracking-wider bg-brand-primary/10 border border-brand-primary/20 text-brand-primary mb-6 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
            HR Transparency Portal
          </span>
          <h1 className="type-h1 text-ink-primary mb-4">
            Candidate Application Tracker
          </h1>
          <p className="type-body text-ink-secondary text-sm sm:text-base leading-relaxed">
            Real-time hiring status, interview stages, and feedback for your submissions at OpenMNC.
          </p>
        </div>
      </section>

      <main className="bg-subtle pb-24 px-4 overflow-x-clip">
        <div className="section-container max-w-3xl mx-auto">
          {!isAuthenticated ? (
            <div className="p-8 sm:p-10 rounded-3xl bg-surface border border-hairline shadow-sm max-w-md mx-auto text-center">
              <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary mx-auto mb-5">
                <Lock className="w-6 h-6" aria-hidden="true" />
              </div>
              <h2 className="type-h3 text-ink-primary mb-2">
                Candidate Status Portal
              </h2>
              <p className="type-caption text-ink-secondary leading-relaxed mb-6">
                Enter the email address you used when submitting your job or internship application.
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
                  {error}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                <div>
                  <label htmlFor="candEmail" className="block type-caption font-semibold text-ink-primary mb-1">
                    Application Email Address
                  </label>
                  <input
                    id="candEmail"
                    type="email"
                    required
                    placeholder="you@gmail.com"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-hairline text-ink-primary text-sm focus:outline-none focus:border-brand-primary transition-colors shadow-sm"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-brand-primary w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="rememberMe" className="type-caption text-ink-muted cursor-pointer">
                    Remember me on this browser
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-brand-primary hover:bg-brand-primary-hover text-white transition-all shadow-md cursor-pointer"
                >
                  Track My Application Status →
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Authenticated Candidate Header Bar */}
              <div className="rounded-3xl bg-surface border border-hairline shadow-sm p-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="type-meta text-emerald-700 font-bold uppercase tracking-wider block font-mono">
                    ● Active Session
                  </span>
                  <h2 className="type-h3 text-ink-primary mt-0.5">
                    {candidateName ? `${candidateName} (${candidateEmail})` : candidateEmail}
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => fetchStatus(candidateEmail)}
                    className="px-4 py-2 rounded-xl type-caption font-semibold bg-subtle hover:bg-white border border-hairline text-ink-primary transition-colors cursor-pointer shadow-sm"
                  >
                    Refresh ↻
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-xl type-caption font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="w-8 h-8 border-2 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
                </div>
              ) : applications.length === 0 ? (
                <div className="rounded-3xl bg-surface border border-hairline shadow-sm p-12 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-subtle border border-hairline flex items-center justify-center text-ink-muted">
                    <FileText className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h3 className="type-h3 text-ink-primary mb-2">
                    No Applications Found for {candidateEmail}
                  </h3>
                  <p className="type-body text-ink-secondary text-xs sm:text-sm mb-6 max-w-md mx-auto">
                    We haven&apos;t received an application from this email yet. Explore our open roles or submit your resume!
                  </p>
                  <Link
                    to="/careers"
                    className="inline-block px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-brand-primary hover:bg-brand-primary-hover text-white transition-all shadow-md"
                  >
                    View Open Positions &amp; Internships →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => {
                    const statusKey = app.status?.toLowerCase() || 'applied'
                    const badgeClass = STATUS_COLORS[statusKey] || 'bg-subtle text-ink-secondary border-hairline'

                    return (
                      <motion.div
                        key={app.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-3xl bg-surface border border-hairline shadow-sm p-6 sm:p-7 hover:border-brand-primary/30 transition-all"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                          <div>
                            <span className="type-meta text-brand-primary uppercase tracking-wider font-bold block mb-1 font-mono">
                              Applied Position
                            </span>
                            <h3 className="type-h3 text-ink-primary">
                              {app.job_title}
                            </h3>
                            <p className="type-caption text-ink-muted mt-0.5">
                              Submitted on {formatDate(app.applied_at)}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full type-meta font-bold uppercase tracking-wider border ${badgeClass}`}>
                            {app.status}
                          </span>
                        </div>

                        {/* Status Pipeline Progress Bar */}
                        {statusKey !== 'rejected' && (
                          <div className="my-6 p-4 bg-subtle border border-hairline rounded-2xl">
                            <p className="type-caption font-bold text-ink-primary mb-3">
                              Hiring Progression Stages
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                              {STATUS_PROGRESSION.map((step, idx) => {
                                const currentIndex = STATUS_PROGRESSION.indexOf(app.status)
                                const isPassed = currentIndex >= idx
                                const isCurrent = currentIndex === idx

                                return (
                                  <div
                                    key={step}
                                    className={`p-2 rounded-xl text-xs font-medium border transition-all ${
                                      isCurrent
                                        ? 'bg-brand-primary text-white border-brand-primary font-bold shadow-sm'
                                        : isPassed
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                                        : 'bg-white text-ink-muted border-hairline'
                                    }`}
                                  >
                                    <span className="block text-[10px] mb-0.5 opacity-80">Stage {idx + 1}</span>
                                    {step}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {app.interview_date && (
                          <div className="mt-4 p-4 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-xs text-ink-primary">
                            <strong className="text-brand-primary">Interview Scheduled:</strong> {app.interview_date}
                          </div>
                        )}

                        {app.hr_internal_notes && (
                          <div className="mt-3 p-4 rounded-xl bg-subtle border border-hairline text-xs text-ink-secondary">
                            <strong className="text-ink-primary">HR Note:</strong> {app.hr_internal_notes}
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
