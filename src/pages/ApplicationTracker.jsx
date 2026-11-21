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
  applied: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'under review': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  shortlisted: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
  'interview scheduled': 'bg-[#2997ff]/15 text-[#2997ff] border-[#2997ff]/30',
  offer: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
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

      <section className="pt-36 pb-12 px-4 bg-black text-center" aria-label="Candidate Tracker Header">
        <div className="max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-[#2997ff] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2997ff]" />
            HR Transparency Portal
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#f5f5f7] tracking-tight mb-4">
            Candidate Application Tracker
          </h1>
          <p className="text-[#a1a1a6] text-sm sm:text-base leading-relaxed">
            Real-time hiring status, interview stages, and feedback for your submissions at OpenMNC.
          </p>
        </div>
      </section>

      <main className="bg-black pb-24 px-4">
        <div className="container-max max-w-3xl mx-auto">
          {!isAuthenticated ? (
            <div className="liquid-glass p-8 sm:p-10 rounded-3xl max-w-md mx-auto text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#2997ff] mx-auto mb-5">
                <Lock className="w-6 h-6" aria-hidden="true" />
              </div>
              <h2 className="font-display text-xl font-semibold text-[#f5f5f7] mb-2">
                Candidate Status Portal
              </h2>
              <p className="text-[#86868b] text-xs leading-relaxed mb-6">
                Enter the email address you used when submitting your job or internship application.
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  {error}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                <div>
                  <label htmlFor="candEmail" className="block text-xs font-medium text-[#d2d2d7] mb-1">
                    Application Email Address
                  </label>
                  <input
                    id="candEmail"
                    type="email"
                    required
                    placeholder="you@gmail.com"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2997ff] transition-colors"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-[#2997ff] w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="rememberMe" className="text-xs text-[#86868b] cursor-pointer">
                    Remember me on this browser
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full text-xs font-semibold tracking-wide bg-[#2997ff] hover:bg-[#0071e3] text-white transition-all"
                >
                  Track My Application Status →
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Authenticated Candidate Header Bar */}
              <div className="rounded-2xl bg-[#161618] border border-white/8 p-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider block">
                    ● Active Session
                  </span>
                  <h2 className="font-display text-lg font-semibold text-[#f5f5f7] mt-0.5">
                    {candidateName ? `${candidateName} (${candidateEmail})` : candidateEmail}
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => fetchStatus(candidateEmail)}
                    className="px-4 py-1.5 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 text-[#d2d2d7] border border-white/10 transition-colors"
                  >
                    Refresh ↻
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-1.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="w-8 h-8 border-2 border-[#2997ff]/30 border-t-[#2997ff] rounded-full animate-spin" />
                </div>
              ) : applications.length === 0 ? (
                <div className="rounded-2xl bg-[#161618] border border-white/8 p-12 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                    <FileText className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-[#f5f5f7] mb-2">
                    No Applications Found for {candidateEmail}
                  </h3>
                  <p className="text-[#86868b] text-xs sm:text-sm mb-6 max-w-md mx-auto">
                    We haven&apos;t received an application from this email yet. Explore our open roles or submit your resume!
                  </p>
                  <Link
                    to="/careers"
                    className="inline-block px-5 py-2.5 rounded-full text-xs font-semibold bg-white text-black hover:bg-[#f5f5f7] transition-all"
                  >
                    View Open Positions &amp; Internships →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => {
                    const statusKey = app.status?.toLowerCase() || 'applied'
                    const badgeClass = STATUS_COLORS[statusKey] || 'bg-white/5 text-[#a1a1a6] border-white/10'

                    return (
                      <motion.div
                        key={app.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl bg-[#161618] border border-white/8 p-6 sm:p-7 hover:border-white/16 transition-all"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                          <div>
                            <span className="text-[10px] text-[#2997ff] uppercase tracking-wider font-semibold block mb-1">
                              Applied Position
                            </span>
                            <h3 className="font-display text-xl font-semibold text-[#f5f5f7]">
                              {app.job_title}
                            </h3>
                            <p className="text-xs text-[#86868b] mt-0.5">
                              Submitted on {formatDate(app.applied_at)}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border uppercase tracking-wider ${badgeClass}`}>
                            {app.status}
                          </span>
                        </div>

                        {/* Status Pipeline Progress Bar */}
                        {statusKey !== 'rejected' && (
                          <div className="my-6 p-4 bg-white/[0.02] border border-white/6 rounded-xl">
                            <p className="text-xs text-[#86868b] mb-3 font-semibold">
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
                                    className={`p-2 rounded-lg text-xs font-medium border transition-all ${
                                      isCurrent
                                        ? 'bg-[#2997ff]/20 text-[#2997ff] border-[#2997ff]/40 font-semibold'
                                        : isPassed
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                        : 'bg-white/[0.01] text-[#86868b] border-white/5'
                                    }`}
                                  >
                                    <span className="block text-[10px] mb-0.5">Stage {idx + 1}</span>
                                    {step}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {app.interview_date && (
                          <div className="mt-4 p-4 rounded-xl bg-[#2997ff]/10 border border-[#2997ff]/20 text-xs text-[#f5f5f7]">
                            <strong className="text-[#2997ff]">Interview Scheduled:</strong> {app.interview_date}
                          </div>
                        )}

                        {app.hr_internal_notes && (
                          <div className="mt-3 p-4 rounded-xl bg-white/[0.02] border border-white/6 text-xs text-[#a1a1a6]">
                            <strong className="text-white">HR Note:</strong> {app.hr_internal_notes}
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
