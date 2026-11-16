import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthContext } from '../context/AuthContext.jsx'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Blog & Insights', to: '/blog' },
  { label: 'About', to: '/about' },
  { label: 'Careers', to: '/careers' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [candidateEmail, setCandidateEmail] = useState('')
  const location = useLocation()
  const auth = useAuthContext()
  const isAuthenticated = auth?.isAuthenticated || false
  const userRole = auth?.role || 'admin'

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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled
          ? 'bg-black/70 backdrop-blur-md border-b border-cyan-neon/10 shadow-lg'
          : 'bg-black/40 backdrop-blur-md border-b border-white/5'
        }
      `}
      role="banner"
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group"
          aria-label="OpenMNC LLP — Home"
        >
          <img
            src="/logo.png"
            alt="OpenMNC Emblem"
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

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'text-cyan-neon bg-cyan-neon/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right side — Candidate Track + Consultation + Admin Portal */}
        <div className="hidden md:flex items-center gap-3">
          {candidateEmail && (
            <Link
              to="/careers/track"
              className="text-xs font-medium text-purple-300 hover:text-white bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
              title="Track your submitted job applications"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              My Applications
            </Link>
          )}

          <Link
            to="/contact"
            className="
              px-4 py-2 text-sm font-semibold rounded-lg
              bg-cyan-neon text-navy-950
              hover:shadow-cyan-glow transition-all duration-200
              hover:scale-105 active:scale-95
            "
          >
            Get Free Consultation
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
              Admin Portal
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

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t border-white/10 bg-black/80 backdrop-blur-xl overflow-hidden"
          >
            <ul className="px-4 py-4 space-y-1" role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) => `
                      block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                      ${isActive
                        ? 'text-cyan-neon bg-cyan-neon/10'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
              <li className="pt-2 border-t border-white/10">
                <Link
                  to="/contact"
                  className="
                    block px-4 py-3 text-center text-sm font-semibold rounded-lg
                    bg-cyan-neon text-navy-950 hover:shadow-cyan-glow
                    transition-all duration-200
                  "
                >
                  Get Free Consultation
                </Link>
              </li>
              {candidateEmail && (
                <li>
                  <Link
                    to="/careers/track"
                    className="block px-4 py-2 text-xs text-purple-300 hover:text-white bg-purple-500/10 rounded-lg transition-colors"
                  >
                    📋 My Job Applications ({candidateEmail})
                  </Link>
                </li>
              )}
              <li>
                {isAuthenticated ? (
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2 text-xs font-semibold text-cyan-neon bg-cyan-neon/10 rounded-lg hover:bg-cyan-neon hover:text-navy-950 transition-colors"
                  >
                    ⚙️ Open Admin Dashboard ({userRole.toUpperCase()})
                  </Link>
                ) : (
                  <Link
                    to="/admin/login"
                    className="block px-4 py-2 text-xs text-gray-400 hover:text-cyan-neon transition-colors duration-200"
                  >
                    🔒 Admin Portal Access
                  </Link>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
