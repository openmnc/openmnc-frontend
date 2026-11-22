import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Star } from 'lucide-react'
import GoogleReviewModal from './GoogleReviewModal.jsx'
import { settingsApi } from '../api/settings.js'
import { prefetchApi } from '../api/client.js'

// Primary B2B Growth & Solution Systems
const CORE_SOLUTIONS = [
  {
    label: 'Web & App Growth Systems',
    desc: 'Direct ordering websites & D2C apps to stop paying 30% commissions',
    to: '/solutions/custom-web-app-development',
    badge: '30% Savings',
    color: 'text-brand-primary',
    badgeColor: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20',
  },
  {
    label: 'Social Media Management',
    desc: 'Hook-Retention-CTA reels, audio denoising & 24/7 footfall engine',
    to: '/services/social-media-management',
    badge: 'Organic Footfall',
    color: 'text-status-success',
    badgeColor: 'bg-emerald-500/10 text-status-success border-emerald-500/20',
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
    const handleScroll = () => setScrolled(window.scrollY > 15)
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
    prefetchApi('/services')
    prefetchApi('/settings')
  }
  const handleSoftwareLeave = () => {
    clearTimeout(softwareTimeoutRef.current)
    softwareTimeoutRef.current = setTimeout(() => setSoftwareOpen(false), 280)
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
          fixed top-0 left-0 right-0 z-[100] transition-all duration-300 w-full
          ${scrolled
            ? 'bg-white/90 backdrop-blur-md border-b border-hairline shadow-sm'
            : 'bg-white/80 backdrop-blur-md border-b border-hairline/60'
          }
        `}
        role="banner"
      >
        <nav
          className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 h-16 flex items-center justify-between gap-3 relative"
          aria-label="Main navigation"
        >
          {/* Brand Logo */}
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
              <span className="font-heading text-lg font-bold text-ink-primary tracking-tight">
                Open
              </span>
              <span className="font-heading text-lg font-bold text-brand-primary tracking-tight">
                MNC
              </span>
            </div>
          </Link>

          {/* Desktop Navigation: Light-First Frosted Navigation */}
          <ul
            className="hidden lg:flex items-center gap-1.5 xl:gap-2 text-[14px] font-sans font-medium shrink-0 whitespace-nowrap"
            role="list"
          >
            {/* SOLUTIONS ▼ */}
            <li
              className="relative shrink-0"
              onMouseEnter={handleSoftwareEnter}
              onMouseLeave={handleSoftwareLeave}
            >
              <button
                type="button"
                onClick={() => setSoftwareOpen((v) => !v)}
                className={`
                  px-3.5 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer
                  ${isServicesActive || softwareOpen
                    ? 'text-brand-primary bg-brand-primary/10 font-semibold'
                    : 'text-ink-secondary hover:text-ink-primary hover:bg-subtle'
                  }
                `}
                aria-expanded={softwareOpen}
                aria-haspopup="true"
              >
                <span>Solutions</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 opacity-70 shrink-0 ${softwareOpen ? 'rotate-180 text-brand-primary' : ''}`}
                  aria-hidden="true"
                />
              </button>

              <AnimatePresence>
                {softwareOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                    onMouseEnter={handleSoftwareEnter}
                    onMouseLeave={handleSoftwareLeave}
                    className="absolute top-full left-0 pt-2 z-[200] pointer-events-auto"
                  >
                    <div className="w-[440px] p-4 rounded-2xl bg-white border border-hairline shadow-[0_20px_50px_rgba(0,0,0,0.18)] opacity-100">
                      {/* Primary B2B Growth Silos Header */}
                      <div className="px-1 py-1 border-b border-hairline mb-2.5 flex items-center justify-between">
                        <span className="text-[10px] text-ink-muted font-bold uppercase tracking-wider block font-mono">
                          B2B Growth Systems
                        </span>
                        <Link
                          to="/services"
                          className="text-[11px] text-brand-primary hover:text-brand-primary-hover hover:underline font-semibold font-sans"
                        >
                          All Services Hub →
                        </Link>
                      </div>

                      {/* 2 Core Growth Verticals */}
                      <div className="space-y-2 mb-3">
                        {CORE_SOLUTIONS.map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            className="block p-3 rounded-xl bg-subtle hover:bg-white border border-hairline hover:border-brand-primary/40 transition-all group"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-xs font-bold ${item.color} group-hover:brightness-90 transition-all font-heading`}>
                                {item.label}
                              </span>
                              <span className={`text-[9px] px-2 py-0.5 rounded border font-bold uppercase tracking-wide ${item.badgeColor}`}>
                                {item.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-ink-secondary leading-tight font-sans">
                              {item.desc}
                            </p>
                          </Link>
                        ))}
                      </div>

                      {/* Secondary: Specialized Engineering Pillars */}
                      <div className="pt-2.5 border-t border-hairline">
                        <div className="flex items-center justify-between px-1 mb-2">
                          <span className="text-[10px] text-ink-muted font-bold uppercase tracking-wider block font-mono">
                            Specialized Engineering
                          </span>
                          <span className="text-[9px] text-ink-muted font-mono">5 Pillars</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {ENGINEERING_PILLARS.slice(0, 4).map((item) => (
                            <Link
                              key={item.to}
                              to={item.to}
                              className="block p-2 rounded-xl bg-subtle/60 hover:bg-subtle transition-colors group border border-hairline hover:border-brand-primary/30"
                            >
                              <span className="text-[11px] font-semibold text-ink-primary group-hover:text-brand-primary transition-colors line-clamp-1 block mb-0.5 font-heading">
                                {item.label}
                              </span>
                              <span className="text-[10px] text-ink-muted line-clamp-1 block font-sans">
                                {item.badge}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {/* Career Guidance */}
            <li className="shrink-0" onMouseEnter={() => prefetchApi('/settings')}>
              <NavLink
                to="/career-guidance"
                className={({ isActive }) => `
                  px-3.5 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap shrink-0 block
                  ${isActive ? 'text-brand-primary bg-brand-primary/10 font-semibold' : 'text-ink-secondary hover:text-ink-primary hover:bg-subtle'}
                `}
              >
                Career Guidance
              </NavLink>
            </li>

            {/* Blog */}
            <li className="shrink-0" onMouseEnter={() => prefetchApi('/blogs')}>
              <NavLink
                to="/blog"
                className={({ isActive }) => `
                  px-3.5 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap shrink-0 block
                  ${isActive ? 'text-brand-primary bg-brand-primary/10 font-semibold' : 'text-ink-secondary hover:text-ink-primary hover:bg-subtle'}
                `}
              >
                Blog
              </NavLink>
            </li>

            {/* About */}
            <li className="shrink-0" onMouseEnter={() => prefetchApi('/settings')}>
              <NavLink
                to="/about"
                className={({ isActive }) => `
                  px-3.5 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap shrink-0 block
                  ${isActive ? 'text-brand-primary bg-brand-primary/10 font-semibold' : 'text-ink-secondary hover:text-ink-primary hover:bg-subtle'}
                `}
              >
                About
              </NavLink>
            </li>
          </ul>

          {/* Right Side — Google Review & Primary CTA */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0 whitespace-nowrap">
            <button
              type="button"
              onClick={() => setReviewModalOpen(true)}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-subtle border border-hairline hover:border-brand-primary/40 text-ink-primary flex items-center gap-1.5 transition-all shadow-sm group shrink-0 whitespace-nowrap font-sans"
              title="Review OPEN MNC on Google"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span className="text-amber-500 font-bold tabular-nums">★ 5.0</span>
            </button>

            <Link
              to="/contact"
              className="px-5 py-2 rounded-full bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold shrink-0 whitespace-nowrap shadow-[0_2px_10px_rgba(37,99,235,0.3)] transition-all font-sans"
            >
              Book a Call
            </Link>
          </div>

          {/* Mobile Header (<1024px) */}
          <div className="flex items-center gap-2 lg:hidden shrink-0">
            <Link
              to="/contact"
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors shrink-0 whitespace-nowrap font-sans"
            >
              Book Call
            </Link>

            <button
              type="button"
              onClick={() => setReviewModalOpen(true)}
              className="px-2.5 py-1.5 rounded-full text-[11px] font-medium bg-subtle border border-hairline text-amber-500 flex items-center gap-1 tabular-nums shrink-0 whitespace-nowrap font-sans"
              aria-label="Google Rating"
            >
              ★ 5.0
            </button>

            <button
              className="p-2 rounded-full text-ink-secondary hover:text-ink-primary hover:bg-subtle transition-colors shrink-0"
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

        {/* Mobile Light-First Full-Height Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'calc(100vh - 64px)' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden border-t border-hairline bg-white fixed top-16 left-0 right-0 bottom-0 z-[200] overflow-y-auto w-full shadow-2xl"
            >
              <div className="px-5 py-6 space-y-3 pb-24">
                {/* Mobile Silo 1: Solutions Accordion */}
                <div className="border border-hairline rounded-2xl p-4 bg-subtle">
                  <button
                    type="button"
                    onClick={() => setMobileSoftwareOpen((v) => !v)}
                    className="w-full flex items-center justify-between text-xs font-bold text-ink-primary uppercase tracking-wider py-1 cursor-pointer font-sans"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-primary" />
                      <span>Solutions &amp; Software</span>
                    </div>
                    <span className="text-ink-muted text-base">{mobileSoftwareOpen ? '−' : '+'}</span>
                  </button>
                  {mobileSoftwareOpen && (
                    <div className="mt-3 space-y-2.5 pt-3 border-t border-hairline">
                      <Link
                        to="/solutions/custom-web-app-development"
                        className="block p-3 rounded-xl bg-white border border-hairline transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-brand-primary">Web &amp; App Growth Systems</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-brand-primary/10 text-brand-primary border border-brand-primary/20 font-semibold font-mono">30% Save</span>
                        </div>
                        <p className="text-[11px] text-ink-secondary leading-tight font-sans">
                          Direct ordering websites &amp; D2C apps to stop paying aggregator commissions
                        </p>
                      </Link>
                      <Link
                        to="/services/social-media-management"
                        className="block p-3 rounded-xl bg-white border border-hairline transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-status-success">Social Media &amp; Reels Growth</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-status-success border border-emerald-500/20 font-semibold font-mono">Organic</span>
                        </div>
                        <p className="text-[11px] text-ink-secondary leading-tight font-sans">
                          Hook-Retention-CTA reels &amp; 24/7 footfall engine
                        </p>
                      </Link>
                      <div className="pt-2 border-t border-hairline">
                        <div className="flex items-center justify-between mb-2 px-1">
                          <span className="text-[10px] text-ink-muted font-semibold uppercase tracking-wider font-mono">
                            Specialized Engineering
                          </span>
                          <Link to="/services" className="text-[10px] text-brand-primary font-medium hover:underline font-sans">
                            All Hub →
                          </Link>
                        </div>
                        <div className="grid grid-cols-1 gap-1.5">
                          {ENGINEERING_PILLARS.map((s) => (
                            <Link
                              key={s.to}
                              to={s.to}
                              className="block p-2 rounded-lg bg-white/60 hover:bg-white text-xs text-ink-secondary hover:text-ink-primary transition-colors font-sans"
                            >
                              {s.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Silo 2: Career Guidance Accordion */}
                <div className="border border-hairline rounded-2xl p-4 bg-subtle">
                  <button
                    type="button"
                    onClick={() => setMobileCareerOpen((v) => !v)}
                    className="w-full flex items-center justify-between text-xs font-bold text-ink-primary uppercase tracking-wider py-1 cursor-pointer font-sans"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Career Guidance &amp; Subsidies</span>
                    </div>
                    <span className="text-ink-muted text-base">{mobileCareerOpen ? '−' : '+'}</span>
                  </button>
                  {mobileCareerOpen && (
                    <div className="mt-3 space-y-2 pt-3 border-t border-hairline">
                      <Link
                        to="/career-guidance"
                        className="block text-xs text-amber-600 font-semibold py-1 hover:underline font-sans"
                      >
                        100% Free Career Guidance Portal →
                      </Link>
                      {CAREER_GUIDANCE_SERVICES.map((s) => (
                        <Link
                          key={s.to}
                          to={s.to}
                          className="block text-xs text-ink-secondary hover:text-ink-primary py-1 transition-colors font-sans"
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
                  className="block px-3 py-2.5 rounded-xl text-sm font-sans text-ink-secondary hover:text-ink-primary hover:bg-subtle transition-colors"
                >
                  Blog &amp; Insights
                </Link>
                <Link
                  to="/about"
                  className="block px-3 py-2.5 rounded-xl text-sm font-sans text-ink-secondary hover:text-ink-primary hover:bg-subtle transition-colors"
                >
                  About OpenMNC
                </Link>
                <Link
                  to="/careers"
                  className="block px-3 py-2.5 rounded-xl text-sm font-sans text-ink-secondary hover:text-ink-primary hover:bg-subtle transition-colors"
                >
                  Careers &amp; Openings
                </Link>
                <Link
                  to="/contact"
                  className="block px-3 py-2.5 rounded-xl text-sm font-sans text-ink-secondary hover:text-ink-primary hover:bg-subtle transition-colors"
                >
                  Contact &amp; Bookings
                </Link>

                {/* Mobile Drawer Actions */}
                <div className="pt-4 border-t border-hairline flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false)
                      setReviewModalOpen(true)
                    }}
                    className="w-full text-center py-2.5 rounded-full text-xs font-medium bg-subtle border border-hairline text-ink-primary flex items-center justify-center gap-2 font-sans"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-amber-500 tabular-nums font-bold">★ 5.0</span>
                    <span>Rate OPEN MNC on Google</span>
                  </button>
                  <Link
                    to="/contact"
                    className="w-full text-center py-3 rounded-full bg-brand-primary text-white text-xs font-semibold font-sans shadow-sm"
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
