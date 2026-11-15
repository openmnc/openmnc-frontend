import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ScrollReveal from '../components/ScrollReveal.jsx'
import GlowButton from '../components/GlowButton.jsx'
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
  applied: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  'under review': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  shortlisted: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  'interview scheduled': 'bg-cyan-neon/15 text-cyan-neon border-cyan-neon/40 shadow-cyan-glow-sm',
  offer: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/30',
}

export default function ApplicationTracker() {
  const [candidateEmail, setCandidateEmail] = useState('')
  const [candidateName, setCandidateName] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 1. Check if candidate session exists in browser localStorage
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
      <section className="pt-32 pb-14 px-4 bg-navy-950" aria-label="Candidate Application Tracker">
        <div className="container-max text-center max-w-3xl">
          <span className="text-xs text-cyan-neon font-semibold tracking-widest uppercase mb-4 block">
            HR Transparency Portal
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Candidate <span className="gradient-text">Application Tracker</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Real-time hiring status, interview scheduling, and feedback for your job applications at OpenMNC LLP.
          </p>
        </div>
      </section>

      <main className="bg-navy-950 section-padding pt-0">
        <div className="container-max max-w-4xl">
          {!isAuthenticated ? (
            <div className="glass-card p-8 sm:p-10 max-w-md mx-auto text-center border border-white/10 rounded-2xl shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-cyan-neon/10 border border-cyan-neon/20 flex items-center justify-center text-3xl mx-auto mb-5">
                🔐
              </div>
              <h2 className="font-display text-xl font-bold text-white mb-2">
                Candidate Status Portal
              </h2>
              <p className="text-gray-400 text-xs leading-relaxed mb-6">
                Enter the email address you used when submitting your job or internship application.
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                <div>
                  <label htmlFor="candEmail" className="block text-xs font-medium text-gray-300 mb-1">
                    Application Email Address
                  </label>
                  <input
                    id="candEmail"
                    type="email"
                    required
                    placeholder="you@gmail.com"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-cyan-neon w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="rememberMe" className="text-xs text-gray-400 cursor-pointer">
                    Remember me on this browser (Auto-open my status)
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-cyan-neon text-navy-950 shadow-cyan-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Track My Application Status →
                </button>
              </form>
            </div>
          ) : (
            <div>
              {/* Authenticated Candidate Header Bar */}
              <div className="glass-card p-6 mb-8 flex flex-wrap items-center justify-between gap-4 border border-white/10 rounded-2xl">
                <div>
                  <span className="text-[10px] text-cyan-neon font-semibold uppercase tracking-wider block">
                    ● Active Candidate Session
                  </span>
                  <h2 className="font-display text-lg font-bold text-white mt-0.5">
                    {candidateName ? `${candidateName} (${candidateEmail})` : candidateEmail}
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => fetchStatus(candidateEmail)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all"
                  >
                    Refresh ↻
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all"
                  >
                    Switch Account / Sign Out
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="w-8 h-8 border-2 border-cyan-neon/30 border-t-cyan-neon rounded-full animate-spin" />
                </div>
              ) : applications.length === 0 ? (
                <div className="glass-card p-12 text-center border border-white/5 rounded-2xl">
                  <span className="text-4xl block mb-3">📄</span>
                  <h3 className="font-display text-lg font-bold text-white mb-2">
                    No Applications Found for {candidateEmail}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm mb-6 max-w-md mx-auto">
                    We haven&apos;t received an application from this email yet. Explore open roles or submit your resume!
                  </p>
                  <GlowButton to="/careers" variant="primary">
                    View Open Positions &amp; Internships →
                  </GlowButton>
                </div>
              ) : (
                <div className="space-y-6">
                  {applications.map((app) => {
                    const statusKey = app.status?.toLowerCase() || 'applied'
                    const badgeClass = STATUS_COLORS[statusKey] || 'bg-gray-500/10 text-gray-400 border-gray-500/30'
                    const resumeUrl = app.resume_file_url || app.resume_google_drive_url

                    return (
                      <motion.div
                        key={app.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-6 sm:p-7 border border-white/10 hover:border-cyan-neon/30 transition-all rounded-2xl"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                          <div>
                            <span className="text-[10px] text-cyan-neon uppercase tracking-wider font-bold block mb-1">
                              Applied Position
                            </span>
                            <h3 className="font-display text-xl font-bold text-white">
                              {app.job_title}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Submitted on {formatDate(app.applied_at)}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${badgeClass}`}>
                            {app.status}
                          </span>
                        </div>

                        {/* Status Pipeline Progress Bar */}
                        {statusKey !== 'rejected' && (
                          <div className="my-6 py-4 px-4 bg-white/2 border border-white/5 rounded-xl">
                            <p className="text-xs text-gray-400 mb-3 font-semibold">
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
                                    className={`p-2.5 rounded-lg text-xs font-semibold border transition-all ${
                                      isCurrent
                                        ? 'bg-cyan-neon/20 border-cyan-neon text-cyan-neon shadow-cyan-glow-sm'
                                        : isPassed
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                        : 'bg-white/2 border-white/5 text-gray-500'
                                    }`}
                                  >
                                    <div className="text-[10px] opacity-60 mb-0.5">Stage {idx + 1}</div>
                                    <div className="truncate">{step}</div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* Interview Details if scheduled */}
                        {app.interview_date && (
                          <div className="p-4 rounded-xl bg-cyan-neon/10 border border-cyan-neon/30 mb-4 text-xs">
                            <span className="font-bold text-cyan-neon block mb-1">
                              📅 Confirmed Interview Schedule
                            </span>
                            <p className="text-white font-medium">{app.interview_date}</p>
                            <p className="text-gray-400 text-[11px] mt-1">
                              Please be prepared 5 minutes before the scheduled time. Meeting links will be shared on your email.
                            </p>
                          </div>
                        )}

                        {/* HR Internal/Public Feedback Notes */}
                        {app.hr_internal_notes && (
                          <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 mb-4 text-xs">
                            <span className="font-bold text-purple-300 block mb-1">
                              💬 Recruiter Feedback
                            </span>
                            <p className="text-gray-300">{app.hr_internal_notes}</p>
                          </div>
                        )}

                        {/* Resume Link & Direct WhatsApp Query */}
                        <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between text-xs text-gray-400 gap-3">
                          <div className="flex items-center gap-2">
                            <span>Your Submitted CV:</span>
                            {resumeUrl ? (
                              <a
                                href={resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-neon hover:underline font-semibold"
                              >
                                View CV / Document ↗
                              </a>
                            ) : (
                              <span className="text-gray-500">Not attached</span>
                            )}
                          </div>

                          <div className="flex items-center gap-4">
                            <a
                              href="https://wa.me/918509684056?text=Hi%20OpenMNC%20HR,%20I%20have%20a%20query%20regarding%20my%20job%20application."
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
                            >
                              💬 Questions? Chat with HR
                            </a>
                            <Link to="/careers" className="text-gray-400 hover:text-white">
                              Browse Open Roles →
                            </Link>
                          </div>
                        </div>
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
