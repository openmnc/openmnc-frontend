import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Star } from 'lucide-react'
import GoogleReviewModal from './GoogleReviewModal.jsx'
import { settingsApi } from '../api/settings.js'

// Primary B2B Growth & Solution Systems
const CORE_SOLUTIONS = [
  {
    label: 'Web & App Growth Systems',
    desc: 'Direct ordering websites & D2C apps to stop paying 30% commissions',
    to: '/solutions/custom-web-app-development',
    badge: '30% Savings',
    color: 'text-[#2997ff]',
    badgeColor: 'bg-[#2997ff]/10 text-[#2997ff] border-[#2997ff]/30',
  },
  {
    label: 'Social Media Management',
    desc: 'Hook-Retention-CTA reels, audio denoising & 24/7 footfall engine',
    to: '/services/social-media-management',
    badge: 'Organic Footfall',
    color: 'text-emerald-400',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
]

// Specialized Engineering Pillars
const ENGINEERING_PILLARS = [
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
  const [mobileSoftwareOpen, setMobileSoftwareOpen] = useState(false)
  const [mobileCareerOpen, setMobileCareerOpen] = useState(false)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [reviewUrl, setReviewUrl] = useState('')

  const location = useLocation()
  const softwareTimeoutRef = useRef(null)

  useEffect(() => {
    settingsApi.getAll().then((res) => {
      if (res.data?.google_review_url) {
        setReviewUrl(res.data.google_review_url)
      }
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false)
    setSoftwareOpen(false)
  }, [location.pathname])

  // Body scroll lock when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const handleSoftwareEnter = () => {
    clearTimeout(softwareTimeoutRef.current)
    setSoftwareOpen(true)
  }
  const handleSoftwareLeave = () => {
    softwareTimeoutRef.current = setTimeout(() => setSoftwareOpen(false), 180)
  }

  const isServicesActive =
    location.pathname.startsWith('/solutions') ||
    (location.pathname.startsWith('/services') &&
    !location.pathname.includes('industrial') &&
    !location.pathname.includes('student'))

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full overflow-x-hidden
          ${scrolled
            ? 'bg-[#000000]/80 backdrop-blur-2xl border-b border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_12px_40px_-10px_rgba(0,0,0,0.6)]'
            : 'bg-[#000000]/40 backdrop-blur-xl border-b border-white/6'
          }
        `}
        role="banner"
      >
        <nav
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3"
          aria-label="Main navigation"
        >
          {/* Brand Logo with explicit dimensions for zero CLS */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group shrink-0 whitespace-nowrap"
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

          {/* Desktop Navigation: Single-Row Apple Liquid Glass (Strictly hidden below lg / 1024px) */}
          <ul
            className="hidden lg:flex items-center gap-1 xl:gap-2 text-[13px] font-medium shrink-0 whitespace-nowrap"
            role="list"
          >
            {/* SOLUTIONS ▼ (Web & App Growth Systems | Social Media Management) */}
            <li
              className="relative shrink-0"
              onMouseEnter={handleSoftwareEnter}
              onMouseLeave={handleSoftwareLeave}
            >
              <button
                type="button"
                onClick={() => setSoftwareOpen((v) => !v)}
                className={`
                  px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap shrink-0
                  ${isServicesActive
                    ? 'text-white bg-white/10'
                    : 'text-[#a1a1a6] hover:text-white hover:bg-white/6'
                  }
                `}
                aria-expanded={softwareOpen}
                aria-haspopup="true"
              >
                <span>Solutions</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 opacity-70 shrink-0 ${softwareOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              <AnimatePresence>
                {softwareOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full left-0 w-[420px] mt-2 p-3 rounded-2xl bg-[#161618]/95 backdrop-blur-2xl border border-white/14 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_24px_50px_-12px_rgba(0,0,0,0.7)] z-50"
                  >
                    {/* Primary B2B Growth Silos */}
                    <div className="px-3 py-1.5 border-b border-white/6 mb-2 flex items-center justify-between">
                      <span className="text-[10px] text-[#86868b] font-semibold uppercase tracking-wider block">
                        Growth Solutions
                      </span>
                      <Link
                        to="/services"
                        className="text-[11px] text-[#2997ff] hover:underline font-medium"
                      >
                        All Services Hub →
                      </Link>
                    </div>

                    <div className="space-y-1.5 mb-2.5">
                      {CORE_SOLUTIONS.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="block p-3 rounded-xl bg-white/3 hover:bg-white/8 border border-white/6 hover:border-white/12 transition-all group"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs font-semibold ${item.color} group-hover:brightness-125 transition-all`}>
                              {item.label}
                            </span>
                            <span className={`text-[9px] px-2 py-0.5 rounded border font-semibold uppercase ${item.badgeColor}`}>
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#86868b] leading-tight">
                            {item.desc}
                          </p>
                        </Link>
                      ))}
                    </div>

                    {/* Secondary: 5 Engineering Pillars */}
                    <div className="pt-2 border-t border-white/6">
                      <span className="text-[10px] text-[#86868b] font-semibold uppercase tracking-wider block px-3 py-1 mb-1">
                        Specialized Engineering
                      </span>
                      <div className="grid grid-cols-2 gap-1">
                        {ENGINEERING_PILLARS.slice(0, 4).map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            className="block p-2 rounded-lg hover:bg-white/6 transition-colors group"
                          >
                            <span className="text-[11px] font-medium text-[#f5f5f7] group-hover:text-[#2997ff] transition-colors line-clamp-1">
                              {item.label}
                            </span>
                            <span className="text-[10px] text-[#86868b] line-clamp-1">
                              {item.badge}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {/* Career Guidance */}
            <li className="shrink-0">
              <NavLink
                to="/career-guidance"
                className={({ isActive }) => `
                  px-3 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap shrink-0 block
                  ${isActive ? 'text-white bg-white/10' : 'text-[#a1a1a6] hover:text-white hover:bg-white/6'}
                `}
              >
                Career Guidance
              </NavLink>
            </li>

            {/* Blog */}
            <li className="shrink-0">
              <NavLink
                to="/blog"
                className={({ isActive }) => `
                  px-3 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap shrink-0 block
                  ${isActive ? 'text-white bg-white/10' : 'text-[#a1a1a6] hover:text-white hover:bg-white/6'}
                `}
              >
                Blog
              </NavLink>
            </li>

            {/* About */}
            <li className="shrink-0">
              <NavLink
                to="/about"
                className={({ isActive }) => `
                  px-3 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap shrink-0 block
                  ${isActive ? 'text-white bg-white/10' : 'text-[#a1a1a6] hover:text-white hover:bg-white/6'}
                `}
              >
                About
              </NavLink>
            </li>
          </ul>

          {/* Right Side — Compact Review Trigger & Primary CTA Pill (Never wraps) */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0 whitespace-nowrap">
            {/* Google Rating Pill Button */}
            <button
              type="button"
              onClick={() => setReviewModalOpen(true)}
              className="px-2.5 py-1.5 rounded-full text-xs font-medium bg-white/6 border border-white/12 hover:border-white/24 text-[#f5f5f7] flex items-center gap-1.5 transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)] group shrink-0 whitespace-nowrap"
              title="Review OPEN MNC on Google"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span className="text-[#ff9500] font-semibold tabular-nums">★ 5.0</span>
            </button>

            {/* Primary CTA Pill Button */}
            <Link
              to="/contact"
              className="apple-btn-primary px-4 py-1.5 text-xs font-semibold shrink-0 whitespace-nowrap"
            >
              Book a Call
            </Link>
          </div>

          {/* Mobile Liquid Glass Header (<1024px: Logo + Compact CTA + Hamburger) */}
          <div className="flex items-center gap-2 lg:hidden shrink-0">
            <Link
              to="/contact"
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#2997ff] text-white hover:bg-[#0077ed] transition-colors shrink-0 whitespace-nowrap"
            >
              Book Call
            </Link>

            <button
              type="button"
              onClick={() => setReviewModalOpen(true)}
              className="px-2.5 py-1.5 rounded-full text-[11px] font-medium bg-white/6 border border-white/12 text-[#ff9500] flex items-center gap-1 tabular-nums shrink-0 whitespace-nowrap"
              aria-label="Google Rating"
            >
              ★ 5.0
            </button>

            <button
              className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-200 shrink-0"
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

        {/* Mobile Liquid Glass Full-Height Scrollable Drawer with z-50 and Body Scroll Lock */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'calc(100vh - 64px)' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden border-t border-white/10 bg-[#161618]/98 backdrop-blur-2xl fixed top-16 left-0 right-0 bottom-0 z-50 overflow-y-auto w-full"
            >
              <div className="px-5 py-6 space-y-3 pb-24">
                {/* Mobile Silo 1: Solutions Accordion */}
                <div className="border border-white/10 rounded-2xl p-3.5 bg-white/2">
                  <button
                    type="button"
                    onClick={() => setMobileSoftwareOpen((v) => !v)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-[#f5f5f7] uppercase tracking-wider py-1"
                  >
                    <span>Solutions &amp; Software</span>
                    <span className="text-[#86868b] text-base">{mobileSoftwareOpen ? '−' : '+'}</span>
                  </button>
                  {mobileSoftwareOpen && (
                    <div className="mt-2.5 space-y-2 pl-2 border-l border-white/10">
                      <Link
                        to="/solutions/custom-web-app-development"
                        className="block text-xs text-[#2997ff] font-semibold py-1"
                      >
                        Web &amp; App Growth Systems (30% Commission Savings) →
                      </Link>
                      <Link
                        to="/services/social-media-management"
                        className="block text-xs text-emerald-400 font-semibold py-1"
                      >
                        Social Media &amp; Reels Growth (Footfall Engine) →
                      </Link>
                      <div className="pt-2 mt-1 border-t border-white/6">
                        <Link
                          to="/services"
                          className="block text-xs text-gray-400 hover:text-white font-medium py-1"
                        >
                          All Services Hub →
                        </Link>
                        {ENGINEERING_PILLARS.map((s) => (
                          <Link
                            key={s.to}
                            to={s.to}
                            className="block text-xs text-[#a1a1a6] hover:text-white py-1 transition-colors"
                          >
                            {s.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Silo 2: Career Guidance & Subsidies Accordion */}
                <div className="border border-white/10 rounded-2xl p-3.5 bg-white/2">
                  <button
                    type="button"
                    onClick={() => setMobileCareerOpen((v) => !v)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-[#f5f5f7] uppercase tracking-wider py-1"
                  >
                    <span>Career Guidance &amp; Subsidies</span>
                    <span className="text-[#86868b] text-base">{mobileCareerOpen ? '−' : '+'}</span>
                  </button>
                  {mobileCareerOpen && (
                    <div className="mt-2.5 space-y-2 pl-2 border-l border-white/10">
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
                          className="block text-xs text-[#a1a1a6] hover:text-white py-1 transition-colors"
                        >
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Core Navigation Links */}
                <Link
                  to="/blog"
                  className="block px-3 py-2.5 rounded-xl text-sm text-[#d2d2d7] hover:text-white hover:bg-white/6 transition-colors"
                >
                  Blog &amp; Insights
                </Link>
                <Link
                  to="/about"
                  className="block px-3 py-2.5 rounded-xl text-sm text-[#d2d2d7] hover:text-white hover:bg-white/6 transition-colors"
                >
                  About OpenMNC
                </Link>
                <Link
                  to="/careers"
                  className="block px-3 py-2.5 rounded-xl text-sm text-[#d2d2d7] hover:text-white hover:bg-white/6 transition-colors"
                >
                  Careers &amp; Openings
                </Link>
                <Link
                  to="/contact"
                  className="block px-3 py-2.5 rounded-xl text-sm text-[#d2d2d7] hover:text-white hover:bg-white/6 transition-colors"
                >
                  Contact &amp; Bookings
                </Link>

                {/* Mobile Drawer Actions */}
                <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false)
                      setReviewModalOpen(true)
                    }}
                    className="w-full text-center py-2.5 rounded-full text-xs font-medium bg-white/6 border border-white/12 text-white flex items-center justify-center gap-2"
                  >
                    <Star className="w-3.5 h-3.5 text-[#ff9500] fill-[#ff9500]" />
                    <span className="text-[#ff9500] tabular-nums">★ 5.0</span>
                    <span>Rate OPEN MNC on Google</span>
                  </button>
                  <Link
                    to="/contact"
                    className="apple-btn-primary w-full text-center py-3 text-xs font-semibold"
                  >
                    Book a Discovery Call
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
