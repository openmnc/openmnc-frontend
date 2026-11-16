import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthContext } from '../context/AuthContext.jsx'

const B2B_SERVICES = [
  {
    label: 'AI Automation & Workflows',
    desc: 'Autonomous multi-agent pipelines & LLM integrations',
    to: '/services/business-automation',
    badge: 'B2B',
  },
  {
    label: 'Custom Software & Mobile Apps',
    desc: 'Full-cycle engineering, SaaS platforms & App Store ASO',
    to: '/services/custom-development',
    badge: 'Enterprise',
  },
  {
    label: 'In-House Products & Games',
    desc: 'Kibo VPN, Calorie AI & CardSnap mobile utilities',
    to: '/services/inhouse-products',
    badge: 'Products',
  },
  {
    label: 'Social Media Organic Growth',
    desc: 'Algorithm-optimized high-retention video production',
    to: '/services/social-media-management',
    badge: 'Growth',
  },
]

const B2C_ACADEMY = [
  {
    label: '100% Free Student Guidance',
    desc: 'Aptitude counseling & college roadmaps for 12th pass',
    to: '/services/student-guidance',
    badge: 'Free ₹0',
  },
  {
    label: 'Advanced Industrial Training',
    desc: '3-Month hands-on IoT, Robotics, AI & full-stack training',
    to: '/services/industrial-training',
    badge: '3 Months',
  },
  {
    label: 'College Fee Subsidies (₹3k–₹10k)',
    desc: 'Direct partner college admission fee grant & discounts',
    to: '/services/student-guidance#student-faq',
    badge: 'Subsidy',
  },
  {
    label: 'Engineering Internships',
    desc: 'Work on live OpenMNC production components & stipends',
    to: '/careers',
    badge: 'Paid/Cert',
  },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [b2bOpen, setB2bOpen] = useState(false)
  const [b2cOpen, setB2cOpen] = useState(false)
  const [mobileB2bOpen, setMobileB2bOpen] = useState(false)
  const [mobileB2cOpen, setMobileB2cOpen] = useState(false)
  const [candidateEmail, setCandidateEmail] = useState('')

  const location = useLocation()
  const auth = useAuthContext()
  const isAuthenticated = auth?.isAuthenticated || false

  const b2bTimeoutRef = useRef(null)
  const b2cTimeoutRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
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
    setB2bOpen(false)
    setB2cOpen(false)
  }, [location.pathname])

  const handleB2bEnter = () => {
    clearTimeout(b2bTimeoutRef.current)
    setB2bOpen(true)
  }
  const handleB2bLeave = () => {
    b2bTimeoutRef.current = setTimeout(() => setB2bOpen(false), 200)
  }

  const handleB2cEnter = () => {
    clearTimeout(b2cTimeoutRef.current)
    setB2cOpen(true)
  }
  const handleB2cLeave = () => {
    b2cTimeoutRef.current = setTimeout(() => setB2cOpen(false), 200)
  }

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled
          ? 'bg-black/80 backdrop-blur-md border-b border-cyan-neon/15 shadow-xl'
          : 'bg-black/50 backdrop-blur-md border-b border-white/5'
        }
      `}
      role="banner"
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Brand Logo with explicit width/height for zero CLS */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group flex-shrink-0"
          aria-label="OpenMNC LLP — Home"
        >
          <img
            src="/logo.webp"
            alt="OpenMNC Emblem"
            width="32"
            height="32"
            className="w-8 h-8 object-contain transition-transform duration-200 group-hover:scale-105"
          />
          <div className="flex items-center">
            <span className="font-display text-xl font-bold text-white group-hover:text-cyan-neon transition-colors duration-200">
              Open
            </span>
            <span className="font-display text-xl font-bold text-cyan-neon">
              MNC
            </span>
            <span
              className="ml-0.5 w-1.5 h-1.5 rounded-full bg-cyan-neon animate-glow-pulse"
              aria-hidden="true"
            />
          </div>
        </Link>

        {/* Desktop Navigation with Distinct B2B & B2C Silos */}
        <ul className="hidden lg:flex items-center gap-1" role="list">
          {/* Home */}
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) => `
                px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive ? 'text-cyan-neon bg-cyan-neon/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}
              `}
            >
              Home
            </NavLink>
          </li>

          {/* Silo A: B2B Enterprise Technology Dropdown */}
          <li
            className="relative"
            onMouseEnter={handleB2bEnter}
            onMouseLeave={handleB2bLeave}
          >
            <button
              type="button"
              onClick={() => setB2bOpen((v) => !v)}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5
                ${location.pathname.startsWith('/services') && !location.pathname.includes('student') && !location.pathname.includes('industrial')
                  ? 'text-cyan-neon bg-cyan-neon/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
                }
              `}
              aria-expanded={b2bOpen}
              aria-haspopup="true"
            >
              <span>Enterprise B2B</span>
              <span className={`text-[10px] transition-transform duration-200 ${b2bOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            <AnimatePresence>
              {b2bOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-full left-0 w-80 mt-1 p-2 rounded-2xl bg-navy-950/95 backdrop-blur-xl border border-cyan-neon/20 shadow-2xl z-50"
                >
                  <div className="px-3 py-2 border-b border-white/5 mb-1">
                    <span className="text-[10px] text-cyan-neon font-bold uppercase tracking-wider block">
                      Enterprise Solutions
                    </span>
                    <Link
                      to="/services"
                      className="text-xs text-gray-400 hover:text-white font-medium hover:underline inline-block mt-0.5"
                    >
                      View All Services Overview →
                    </Link>
                  </div>
                  <div className="space-y-1">
                    {B2B_SERVICES.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="block p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-semibold text-white group-hover:text-cyan-neon transition-colors">
                            {item.label}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-neon/10 text-cyan-neon border border-cyan-neon/20 font-bold uppercase">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 leading-tight">
                          {item.desc}
                        </p>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>

          {/* Silo B: B2C Academy & Training Dropdown */}
          <li
            className="relative"
            onMouseEnter={handleB2cEnter}
            onMouseLeave={handleB2cLeave}
          >
            <button
              type="button"
              onClick={() => setB2cOpen((v) => !v)}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5
                ${location.pathname.includes('student') || location.pathname.includes('industrial') || location.pathname === '/academy'
                  ? 'text-cyan-neon bg-cyan-neon/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
                }
              `}
              aria-expanded={b2cOpen}
              aria-haspopup="true"
            >
              <span>Academy &amp; Careers</span>
              <span className={`text-[10px] transition-transform duration-200 ${b2cOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            <AnimatePresence>
              {b2cOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-full left-0 w-80 mt-1 p-2 rounded-2xl bg-navy-950/95 backdrop-blur-xl border border-amber-glow/20 shadow-2xl z-50"
                >
                  <div className="px-3 py-2 border-b border-white/5 mb-1">
                    <span className="text-[10px] text-amber-glow font-bold uppercase tracking-wider block">
                      Education &amp; Student Wing
                    </span>
                    <p className="text-[11px] text-gray-400">
                      Unbiased counseling &amp; real industrial project training
                    </p>
                  </div>
                  <div className="space-y-1">
                    {B2C_ACADEMY.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="block p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-semibold text-white group-hover:text-amber-glow transition-colors">
                            {item.label}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-glow/10 text-amber-glow border border-amber-glow/20 font-bold uppercase">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 leading-tight">
                          {item.desc}
                        </p>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>

          {/* Blog & Insights */}
          <li>
            <NavLink
              to="/blog"
              className={({ isActive }) => `
                px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive ? 'text-cyan-neon bg-cyan-neon/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}
              `}
            >
              Blog
            </NavLink>
          </li>

          {/* Careers */}
          <li>
            <NavLink
              to="/careers"
              className={({ isActive }) => `
                px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive ? 'text-cyan-neon bg-cyan-neon/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}
              `}
            >
              Careers
            </NavLink>
          </li>

          {/* About */}
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) => `
                px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive ? 'text-cyan-neon bg-cyan-neon/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}
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
                px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive ? 'text-cyan-neon bg-cyan-neon/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}
              `}
            >
              Contact
            </NavLink>
          </li>
        </ul>

        {/* Right Side — Actions & Status */}
        <div className="hidden lg:flex items-center gap-3">
          {candidateEmail && (
            <Link
              to="/careers/track"
              className="text-xs font-medium text-purple-300 hover:text-white bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
              title="Track your submitted job applications"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              My Application
            </Link>
          )}

          <Link
            to="/contact"
            className="
              px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg
              bg-cyan-neon text-navy-950
              hover:shadow-cyan-glow transition-all duration-200
              hover:scale-105 active:scale-95
            "
          >
            Get Consultation
          </Link>

          {isAuthenticated ? (
            <Link
              to="/admin/dashboard"
              className="
                px-3 py-1.5 text-xs font-semibold rounded-lg
                bg-cyan-neon/15 text-cyan-neon border border-cyan-neon/30
                hover:bg-cyan-neon hover:text-navy-950
                transition-all duration-200 flex items-center gap-1.5 shadow-sm
              "
              aria-label="Admin Control Center"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-neon animate-pulse" />
              Admin
            </Link>
          ) : (
            <Link
              to="/admin/login"
              className="text-xs text-gray-400 hover:text-cyan-neon transition-colors duration-200 px-2 py-1 flex items-center gap-1"
              aria-label="Admin login"
            >
              Admin Access
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
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
      </nav>

      {/* Mobile Menu with Zero-Orphan Accordion Layout */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden border-t border-white/10 bg-navy-950/98 backdrop-blur-2xl max-h-[85vh] overflow-y-auto"
          >
            <div className="px-4 py-4 space-y-2">
              <Link
                to="/"
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-white hover:bg-white/5"
              >
                Home
              </Link>

              {/* Mobile Silo A Accordion */}
              <div className="border border-cyan-neon/15 rounded-xl p-2.5 bg-white/2">
                <button
                  type="button"
                  onClick={() => setMobileB2bOpen((v) => !v)}
                  className="w-full flex items-center justify-between text-xs font-bold text-cyan-neon uppercase tracking-wider py-1"
                >
                  <span>Enterprise B2B Services</span>
                  <span>{mobileB2bOpen ? '−' : '+'}</span>
                </button>
                {mobileB2bOpen && (
                  <div className="mt-2 space-y-1.5 pl-2 border-l border-cyan-neon/30">
                    <Link
                      to="/services"
                      className="block text-xs text-white font-medium py-1 hover:text-cyan-neon"
                    >
                      All Services Overview →
                    </Link>
                    {B2B_SERVICES.map((s) => (
                      <Link
                        key={s.to}
                        to={s.to}
                        className="block text-xs text-gray-300 hover:text-white py-1"
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Silo B Accordion */}
              <div className="border border-amber-glow/15 rounded-xl p-2.5 bg-white/2">
                <button
                  type="button"
                  onClick={() => setMobileB2cOpen((v) => !v)}
                  className="w-full flex items-center justify-between text-xs font-bold text-amber-glow uppercase tracking-wider py-1"
                >
                  <span>Academy &amp; Student Wing</span>
                  <span>{mobileB2cOpen ? '−' : '+'}</span>
                </button>
                {mobileB2cOpen && (
                  <div className="mt-2 space-y-1.5 pl-2 border-l border-amber-glow/30">
                    {B2C_ACADEMY.map((s) => (
                      <Link
                        key={s.to}
                        to={s.to}
                        className="block text-xs text-gray-300 hover:text-white py-1"
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Core Links */}
              <Link to="/blog" className="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5">
                Blog &amp; Insights
              </Link>
              <Link to="/careers" className="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5">
                Careers &amp; Internships
              </Link>
              <Link to="/about" className="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5">
                About OpenMNC
              </Link>
              <Link to="/contact" className="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5">
                Contact &amp; Support
              </Link>

              {candidateEmail && (
                <Link to="/careers/track" className="block px-3 py-2 rounded-lg text-xs font-semibold text-purple-300 bg-purple-500/10">
                  Track My Application →
                </Link>
              )}

              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                <Link
                  to="/contact"
                  className="block text-center py-2.5 rounded-lg text-xs font-bold bg-cyan-neon text-navy-950 shadow-cyan-glow-sm"
                >
                  Get Free Consultation
                </Link>
                <Link
                  to="/admin/login"
                  className="block text-center py-2 rounded-lg text-xs text-gray-400 hover:text-white bg-white/5"
                >
                  Admin Portal Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
