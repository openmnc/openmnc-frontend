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
  'interview scheduled': 'bg-cyan-neon/10 text-cyan-neon border-cyan-neon/30',
  offer: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/30',
}

export default function ApplicationTracker() {
  const [candidateEmail, setCandidateEmail] = useState('')
  const [candidateName, setCandidateName] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Check if candidate email was saved in localStorage from previous session or application
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
    } catch (err) {
      setError('Could not retrieve applications. Please check your email or try again.')
    } finally {
      setLoading(false)
    }
  }

  // Simulated Google Sign-In for Candidate Portal
  function handleGoogleLogin() {
    // In production, integrate standard Google Identity Services:
    // window.google.accounts.id.prompt()
    // For demo/standalone portal, prompt or sign in with Google email
    const email = prompt('Enter your Google Account email to check your application status:', candidateEmail || 'candidate@gmail.com')
    if (email && email.includes('@')) {
      const name = email.split('@')[0].replace(/[._]/g, ' ')
      setCandidateEmail(email)
      setCandidateName(name)
      setIsAuthenticated(true)
      localStorage.setItem('openmnc_candidate_email', email)
      localStorage.setItem('openmnc_candidate_name', name)
      fetchStatus(email)
    }
  }

  function handleLogout() {
    setIsAuthenticated(false)
    setApplications([])
    localStorage.removeItem('openmnc_candidate_email')
    localStorage.removeItem('openmnc_candidate_name')
  }

  return (
    <>
      <section className="pt-32 pb-16 px-4 bg-navy-950" aria-label="Candidate Application Tracker">
        <div className="container-max text-center max-w-3xl">
          <span className="text-xs text-cyan-neon font-semibold tracking-widest uppercase mb-4 block">
            HR Transparency Portal
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Candidate <span className="gradient-text">Application Tracker</span>
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            Track real-time hiring status, interview updates, and feedback for your job applications at OpenMNC LLP.
          </p>
        </div>
      </section>

      <main className="bg-navy-950 section-padding pt-0">
        <div className="container-max max-w-4xl">
          {!isAuthenticated ? (
            <div className="glass-card p-10 max-w-md mx-auto text-center">
              <div className="w-16 h-16 rounded-2xl bg-cyan-neon/10 border border-cyan-neon/20 flex items-center justify-center text-3xl mx-auto mb-5">
                🔐
              </div>
              <h2 className="font-display text-xl font-bold text-white mb-2">
                Candidate Verification
              </h2>
              <p className="text-gray-400 text-xs leading-relaxed mb-6">
                To prevent spam and protect candidate confidentiality, verify your application email via Google Sign-In.
              </p>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm bg-white text-gray-900 hover:bg-gray-100 transition-all flex items-center justify-center gap-3 shadow-lg mb-4"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Continue with Google
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-navy-900 px-2 text-gray-500">Or use email</span></div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (candidateEmail) {
                    setIsAuthenticated(true)
                    localStorage.setItem('openmnc_candidate_email', candidateEmail)
                    fetchStatus(candidateEmail)
                  }
                }}
                className="space-y-3"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter application email"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg text-xs font-semibold bg-cyan-neon/10 text-cyan-neon border border-cyan-neon/20 hover:bg-cyan-neon/20 transition-all"
                >
                  Track My Status →
                </button>
              </form>
            </div>
          ) : (
            <div>
              {/* Authenticated Candidate Header */}
              <div className="glass-card p-6 mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-gray-500">Logged in candidate</span>
                  <h2 className="font-display text-lg font-bold text-white">
                    {candidateEmail}
                  </h2>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => fetchStatus(candidateEmail)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
                  >
                    Refresh ↻
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                  >
                    Log Out
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="w-8 h-8 border-2 border-cyan-neon/30 border-t-cyan-neon rounded-full animate-spin" />
                </div>
              ) : applications.length === 0 ? (
                <div className="glass-card p-12 text-center">
                  <span className="text-4xl block mb-3">📄</span>
                  <h3 className="font-display text-lg font-bold text-white mb-2">
                    No Applications Found for {candidateEmail}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Haven&apos;t applied yet? Browse our current open roles and submit your resume via Google Drive.
                  </p>
                  <GlowButton to="/careers" variant="primary">
                    View Open Positions →
                  </GlowButton>
                </div>
              ) : (
                <div className="space-y-6">
                  {applications.map((app) => {
                    const statusKey = app.status?.toLowerCase() || 'applied'
                    const badgeClass = STATUS_COLORS[statusKey] || 'bg-gray-500/10 text-gray-400 border-gray-500/30'

                    return (
                      <motion.div
                        key={app.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-6 border border-white/10 hover:border-cyan-neon/30 transition-all"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                          <div>
                            <span className="text-xs text-cyan-neon uppercase tracking-wider font-semibold block mb-1">
                              Role Applied
                            </span>
                            <h3 className="font-display text-xl font-bold text-white">
                              {app.job_title}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Applied on {formatDate(app.applied_at)}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${badgeClass}`}>
                            {app.status}
                          </span>
                        </div>

                        {/* Status Pipeline Tracker */}
                        {statusKey !== 'rejected' && (
                          <div className="my-6 py-4 px-4 bg-white/5 rounded-xl">
                            <p className="text-xs text-gray-400 mb-3 font-medium">Hiring Pipeline Progress</p>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                              {STATUS_PROGRESSION.map((step, idx) => {
                                const currentIndex = STATUS_PROGRESSION.indexOf(app.status)
                                const isPassed = currentIndex >= idx
                                const isCurrent = currentIndex === idx

                                return (
                                  <div
                                    key={step}
                                    className={`p-2 rounded-lg text-xs font-semibold border transition-all ${
                                      isCurrent
                                        ? 'bg-cyan-neon/20 border-cyan-neon text-cyan-neon'
                                        : isPassed
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                        : 'bg-white/5 border-transparent text-gray-500'
                                    }`}
                                  >
                                    <div className="text-[10px] opacity-60 mb-0.5">Step {idx + 1}</div>
                                    <div className="truncate">{step}</div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* Interview Details if available */}
                        {app.interview_date && (
                          <div className="p-4 rounded-xl bg-cyan-neon/10 border border-cyan-neon/30 mb-4 text-xs">
                            <span className="font-bold text-cyan-neon block mb-1">📅 Scheduled Interview</span>
                            <p className="text-gray-300">{app.interview_date}</p>
                          </div>
                        )}

                        {/* Attached Google Drive Resume */}
                        <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between text-xs text-gray-400 gap-2">
                          <div className="flex items-center gap-2">
                            <span>Resume:</span>
                            <a
                              href={app.resume_google_drive_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-neon hover:underline truncate max-w-xs"
                            >
                              Google Drive Link ↗
                            </a>
                          </div>
                          <Link to="/careers" className="text-cyan-neon hover:underline">
                            Explore other roles →
                          </Link>
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
