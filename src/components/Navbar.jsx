import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthContext } from '../context/AuthContext.jsx'
import GoogleReviewModal from './GoogleReviewModal.jsx'
import { settingsApi } from '../api/settings.js'

// 5 Dedicated Laser-Focused Pillars as defined in the Master Architecture
const SOFTWARE_PILLARS = [
  {
    label: 'Vibe-Coded App Audit & Fixing',
    desc: 'Fix broken auth, secure keys & make AI prototypes production-ready',
    to: '/services/vibe-coded-app-audit-and-fixing',
    badge: 'Pillar 1',
  },
  {
    label: 'Play Store & App Store Publishing',
    desc: 'Pass Apple/Google review, solve 12 testers & fix rejections',
    to: '/services/app-store-play-store-publishing-and-approval',
    badge: 'Pillar 2',
  },
  {
    label: 'App Transfer & Database Migration',
    desc: 'Zero-downtime acquisition transfer, cloud handover & safe exits',
    to: '/services/app-transfer-and-database-migration',
    badge: 'Pillar 3',
  },
  {
    label: 'Scalable Custom App Development',
    desc: 'Full-cycle engineering, scalable SaaS, web & iOS/Android apps',
    to: '/services/custom-software-and-scalable-app-development',
    badge: 'Pillar 4',
  },
  {
    label: 'App Maintenance & Support (AMC)',
    desc: 'OS/SDK updates, 24/7 uptime monitoring & bug fixing safety net',
    to: '/services/app-maintenance-and-support',
    badge: 'Pillar 5',
  },
]

// Bank-Style Segregated Career Guidance & Academy Silo
const CAREER_GUIDANCE_SERVICES = [
  {
    label: '100% Free Career Guidance',
    desc: 'Aptitude counseling & right college roadmaps for 12th pass',
    to: '/career-guidance',
    badge: 'Free ₹0',
  },
  {
    label: 'College Fee Subsidies (₹3k–₹10k)',
    desc: 'Official partner college admission grant & direct fee discounts',
    to: '/career-guidance#subsidies',
    badge: 'Grant',
  },
  {
    label: 'Advanced Industrial Training',
    desc: '3-Month hands-on IoT, Robotics, Drones & full-stack engineering',
    to: '/services/industrial-training',
    badge: '3 Months',
  },
  {
    label: 'Engineering Internships',
    desc: 'Work on live OpenMNC production systems with stipends & LOR',
    to: '/careers',
    badge: 'Paid/Cert',
  },
  {
    label: 'Track Candidate Application',
    desc: 'Check live status of your internship & subsidy applications',
    to: '/careers/track',
    badge: 'Tracker',
  },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [softwareOpen, setSoftwareOpen] = useState(false)
  const [careerOpen, setCareerOpen] = useState(false)
  const [mobileSoftwareOpen, setMobileSoftwareOpen] = useState(false)
  const [mobileCareerOpen, setMobileCareerOpen] = useState(false)
  const [candidateEmail, setCandidateEmail] = useState('')
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [reviewUrl, setReviewUrl] = useState('')

  useEffect(() => {
    settingsApi.getAll().then((res) => {
      if (res.data?.google_review_url) {
        setReviewUrl(res.data.google_review_url)
      }
    }).catch(() => {})
  }, [])

  const location = useLocation()
  const auth = useAuthContext()
  const isAuthenticated = auth?.isAuthenticated || false

  const softwareTimeoutRef = useRef(null)
  const careerTimeoutRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Check candidate session from browser storage
  useEffect(() => {
    const saved = localStorage.getItem('openmnc_candidate_email')
    if (saved) setCandidateEmail(saved)
  }, [location.pathname])

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false)
    setSoftwareOpen(false)
    setCareerOpen(false)
  }, [location.pathname])

  const handleSoftwareEnter = () => {
    clearTimeout(softwareTimeoutRef.current)
    setSoftwareOpen(true)
  }
  const handleSoftwareLeave = () => {
    softwareTimeoutRef.current = setTimeout(() => setSoftwareOpen(false), 180)
  }

  const handleCareerEnter = () => {
    clearTimeout(careerTimeoutRef.current)
    setCareerOpen(true)
  }
  const handleCareerLeave = () => {
    careerTimeoutRef.current = setTimeout(() => setCareerOpen(false), 180)
  }

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${scrolled
            ? 'bg-[#000000]/75 backdrop-blur-2xl border-b border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_12px_40px_-10px_rgba(0,0,0,0.6)]'
            : 'bg-[#000000]/40 backdrop-blur-xl border-b border-white/6'
          }
        `}
        role="banner"
      >
        <nav
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Brand Logo with explicit width/height for zero CLS */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group flex-shrink-0"
            aria-label="OpenMNC — Home"
          >
            <img
              src="/logo.webp"
              alt="OpenMNC Emblem"
              width="28"
              height="28"
              className="w-7 h-7 object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <div className="flex items-center">
              <span className="font-display text-lg font-semibold text-[#f5f5f7] tracking-tight">
                Open
              </span>
              <span className="font-display text-lg font-semibold text-[#2997ff] tracking-tight">
                MNC
              </span>
            </div>
          </Link>

          {/* Desktop Navigation with Bank-Style Clear Product Separation */}
          <ul className="hidden lg:flex items-center gap-1 text-[13px] font-medium" role="list">
            {/* Home */}
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) => `
                  px-3 py-1.5 rounded-full transition-all duration-200
                  ${isActive ? 'text-white bg-white/10' : 'text-[#a1a1a6] hover:text-white hover:bg-white/6'}
                `}
              >
                Home
              </NavLink>
            </li>

            {/* PRODUCT LINE 1: Software & Apps (The 5 Pillars) */}
            <li
              className="relative"
              onMouseEnter={handleSoftwareEnter}
              onMouseLeave={handleSoftwareLeave}
            >
              <button
                type="button"
                onClick={() => setSoftwareOpen((v) => !v)}
                className={`
                  px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5
                  ${location.pathname.startsWith('/services') && !location.pathname.includes('student') && !location.pathname.includes('industrial')
                    ? 'text-white bg-white/10'
                    : 'text-[#a1a1a6] hover:text-white hover:bg-white/6'
                  }
                `}
                aria-expanded={softwareOpen}
                aria-haspopup="true"
              >
                <span>Software &amp; Apps</span>
                <span className={`text-[9px] transition-transform duration-200 opacity-60 ${softwareOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>

              <AnimatePresence>
                {softwareOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full left-0 w-96 mt-2 p-2 rounded-2xl bg-[#161618]/95 backdrop-blur-2xl border border-white/14 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_24px_50px_-12px_rgba(0,0,0,0.7)] z-50"
                  >
                    <div className="px-3 py-2 border-b border-white/6 mb-1 flex items-center justify-between">
                      <span className="text-[10px] text-[#86868b] font-semibold uppercase tracking-wider block">
                        Engineering Pillars
                      </span>
                      <Link
                        to="/services"
                        className="text-[11px] text-[#2997ff] hover:underline font-medium"
                      >
                        All Services Hub →
                      </Link>
                    </div>
                    <div className="space-y-1">
                      {SOFTWARE_PILLARS.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="block p-2.5 rounded-xl hover:bg-white/6 transition-colors group"
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs font-medium text-[#f5f5f7] group-hover:text-[#2997ff] transition-colors">
                              {item.label}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/6 text-[#86868b] border border-white/10 font-semibold uppercase tabular-nums">
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#86868b] leading-tight line-clamp-1">
                            {item.desc}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {/* PRODUCT LINE 2: Career Guidance & Academy */}
            <li
              className="relative"
              onMouseEnter={handleCareerEnter}
              onMouseLeave={handleCareerLeave}
            >
              <button
                type="button"
                onClick={() => setCareerOpen((v) => !v)}
                className={`
                  px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5
                  ${location.pathname.startsWith('/career-guidance') || location.pathname.includes('student') || location.pathname.includes('industrial')
                    ? 'text-white bg-white/10'
                    : 'text-[#a1a1a6] hover:text-white hover:bg-white/6'
                  }
                `}
                aria-expanded={careerOpen}
                aria-haspopup="true"
              >
                <span>Career Guidance</span>
                <span className={`text-[9px] transition-transform duration-200 opacity-60 ${careerOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>

              <AnimatePresence>
                {careerOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full left-0 w-88 mt-2 p-2 rounded-2xl bg-[#161618]/95 backdrop-blur-2xl border border-white/14 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_24px_50px_-12px_rgba(0,0,0,0.7)] z-50"
                  >
                    <div className="px-3 py-2 border-b border-white/6 mb-1 flex items-center justify-between">
                      <span className="text-[10px] text-[#86868b] font-semibold uppercase tracking-wider block">
                        Students &amp; Higher Education
                      </span>
                      <Link
                        to="/career-guidance"
                        className="text-[11px] text-[#ff9500] hover:underline font-medium"
                      >
                        Guidance Portal →
                      </Link>
                    </div>
                    <div className="space-y-1">
                      {CAREER_GUIDANCE_SERVICES.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="block p-2.5 rounded-xl hover:bg-white/6 transition-colors group"
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs font-medium text-[#f5f5f7] group-hover:text-[#ff9500] transition-colors">
                              {item.label}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/6 text-[#86868b] border border-white/10 font-semibold uppercase">
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#86868b] leading-tight line-clamp-1">
                            {item.desc}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {/* Careers */}
            <li>
              <NavLink
                to="/careers"
                className={({ isActive }) => `
                  px-3 py-1.5 rounded-full transition-all duration-200
                  ${isActive ? 'text-white bg-white/10' : 'text-[#a1a1a6] hover:text-white hover:bg-white/6'}
                `}
              >
                Careers
              </NavLink>
            </li>

            {/* Blog */}
            <li>
              <NavLink
                to="/blog"
                className={({ isActive }) => `
                  px-3 py-1.5 rounded-full transition-all duration-200
                  ${isActive ? 'text-white bg-white/10' : 'text-[#a1a1a6] hover:text-white hover:bg-white/6'}
                `}
              >
                Blog
              </NavLink>
            </li>

            {/* About */}
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) => `
                  px-3 py-1.5 rounded-full transition-all duration-200
                  ${isActive ? 'text-white bg-white/10' : 'text-[#a1a1a6] hover:text-white hover:bg-white/6'}
                `}
              >
                About
              </NavLink>
            </li>

            {/* Contact */}
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) => `
                  px-3 py-1.5 rounded-full transition-all duration-200
                  ${isActive ? 'text-white bg-white/10' : 'text-[#a1a1a6] hover:text-white hover:bg-white/6'}
                `}
              >
                Contact
              </NavLink>
            </li>
          </ul>

          {/* Right Side — Google Review Pill + Action */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Google Rating Button */}
            <button
              type="button"
              onClick={() => setReviewModalOpen(true)}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/6 border border-white/12 hover:border-white/24 text-[#f5f5f7] flex items-center gap-1.5 transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)] group"
              title="Review OPEN MNC on Google"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span className="text-[#ff9500] font-semibold tabular-nums">★ 5.0</span>
              <span className="text-[#86868b] text-[11px] group-hover:text-white">Rate Us</span>
            </button>

            {candidateEmail && (
              <Link
                to="/careers/track"
                className="text-xs font-medium text-[#a1a1a6] hover:text-white bg-white/6 border border-white/12 px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5"
                title="Track your submitted job applications"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#2997ff]" />
                Track
              </Link>
            )}

            <Link
              to="/contact"
              className="apple-btn-primary px-4 py-2 text-xs"
            >
              Book a Call
            </Link>

            {isAuthenticated && (
              <Link
                to="/admin/dashboard"
                className="
                  px-3 py-1.5 text-xs font-medium rounded-full
                  bg-white/10 text-white border border-white/20
                  hover:bg-white/20 transition-all duration-200
                "
                aria-label="Admin Control Center"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setReviewModalOpen(true)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/6 border border-white/12 text-[#ff9500] flex items-center gap-1 tabular-nums"
            >
              ★ 5.0 Rate
            </button>

            <button
              className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <div className="w-5 h-5 flex flex-col justify-center gap-1.5" aria-hidden="true">
                <motion.span
                  animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                  className="block w-5 h-0.5 bg-current rounded-full transition-all"
                />
                <motion.span
                  animate={mobileOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                  className="block w-5 h-0.5 bg-current rounded-full transition-all"
                />
                <motion.span
                  animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                  className="block w-5 h-0.5 bg-current rounded-full transition-all"
                />
              </div>
            </button>
          </div>
        </nav>

        {/* Mobile Liquid Glass Sheet */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden border-t border-white/10 bg-[#161618]/98 backdrop-blur-2xl max-h-[85vh] overflow-y-auto"
            >
              <div className="px-4 py-4 space-y-2">
                <Link
                  to="/"
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-white hover:bg-white/6"
                >
                  Home
                </Link>

                {/* Mobile Silo 1: Software & Apps */}
                <div className="border border-white/10 rounded-2xl p-3 bg-white/2">
                  <button
                    type="button"
                    onClick={() => setMobileSoftwareOpen((v) => !v)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-[#f5f5f7] uppercase tracking-wider py-1"
                  >
                    <span>Software &amp; Apps (5 Pillars)</span>
                    <span className="text-[#86868b]">{mobileSoftwareOpen ? '−' : '+'}</span>
                  </button>
                  {mobileSoftwareOpen && (
                    <div className="mt-2 space-y-1.5 pl-2 border-l border-white/10">
                      <Link
                        to="/services"
                        className="block text-xs text-[#2997ff] font-medium py-1"
                      >
                        All Services Overview →
                      </Link>
                      {SOFTWARE_PILLARS.map((s) => (
                        <Link
                          key={s.to}
                          to={s.to}
                          className="block text-xs text-[#86868b] hover:text-white py-1"
                        >
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mobile Silo 2: Career Guidance */}
                <div className="border border-white/10 rounded-2xl p-3 bg-white/2">
                  <button
                    type="button"
                    onClick={() => setMobileCareerOpen((v) => !v)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-[#f5f5f7] uppercase tracking-wider py-1"
                  >
                    <span>Career Guidance &amp; Subsidies</span>
                    <span className="text-[#86868b]">{mobileCareerOpen ? '−' : '+'}</span>
                  </button>
                  {mobileCareerOpen && (
                    <div className="mt-2 space-y-1.5 pl-2 border-l border-white/10">
                      <Link
                        to="/career-guidance"
                        className="block text-xs text-[#ff9500] font-medium py-1"
                      >
                        Career Guidance Portal →
                      </Link>
                      {CAREER_GUIDANCE_SERVICES.map((s) => (
                        <Link
                          key={s.to}
                          to={s.to}
                          className="block text-xs text-[#86868b] hover:text-white py-1"
                        >
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Core Links */}
                <Link to="/careers" className="block px-3 py-2 rounded-xl text-sm text-[#86868b] hover:text-white hover:bg-white/6">
                  Careers &amp; Jobs
                </Link>
                <Link to="/blog" className="block px-3 py-2 rounded-xl text-sm text-[#86868b] hover:text-white hover:bg-white/6">
                  Blog &amp; Insights
                </Link>
                <Link to="/about" className="block px-3 py-2 rounded-xl text-sm text-[#86868b] hover:text-white hover:bg-white/6">
                  About Us
                </Link>
                <Link to="/contact" className="block px-3 py-2 rounded-xl text-sm text-[#86868b] hover:text-white hover:bg-white/6">
                  Contact
                </Link>

                <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false)
                      setReviewModalOpen(true)
                    }}
                    className="w-full text-center py-2.5 rounded-full text-xs font-medium bg-white/6 border border-white/12 text-white flex items-center justify-center gap-2"
                  >
                    <span className="text-[#ff9500] tabular-nums">★ 5.0</span>
                    Rate OPEN MNC on Google
                  </button>
                  <Link
                    to="/contact"
                    className="apple-btn-primary w-full text-center py-2.5 text-xs"
                  >
                    Book a Free Discovery Call
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Google Review Modal */}
      <GoogleReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        reviewUrl={reviewUrl}
      />
    </>
  )
}
