import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Star } from 'lucide-react'
import GoogleReviewModal from './GoogleReviewModal.jsx'
import { settingsApi } from '../api/settings.js'

const FOOTER_SECTIONS = [
  {
    title: 'Software Solutions (5 Pillars)',
    links: [
      { label: 'Vibe-Coded App Audit & Fixing', to: '/services/vibe-coded-app-audit-and-fixing' },
      { label: 'Play Store & App Store Publishing', to: '/services/app-store-play-store-publishing-and-approval' },
      { label: 'App Transfer & Database Migration', to: '/services/app-transfer-and-database-migration' },
      { label: 'Scalable Custom Software Dev', to: '/services/custom-software-and-scalable-app-development' },
      { label: 'App Maintenance & Support (AMC)', to: '/services/app-maintenance-and-support' },
      { label: 'All Services Overview Hub', to: '/services' },
    ],
  },
  {
    title: 'Career Guidance & Academy',
    links: [
      { label: '100% Free Career Guidance (12th Pass)', to: '/career-guidance' },
      { label: 'College Fee Subsidies (₹3k–₹10k)', to: '/career-guidance#subsidies' },
      { label: '3-Month Advanced Industrial Training', to: '/services/industrial-training' },
      { label: 'Live Engineering Internships', to: '/careers' },
      { label: 'Track Candidate Application', to: '/careers/track' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About OpenMNC', to: '/about' },
      { label: 'Blog & Insights', to: '/blog' },
      { label: 'Contact & Booking', to: '/contact' },
    ],
  },
]

export default function Footer() {
  const year = new Date().getFullYear()
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [reviewUrl, setReviewUrl] = useState('')

  useEffect(() => {
    settingsApi.getAll().then((res) => {
      if (res.data?.google_review_url) {
        setReviewUrl(res.data.google_review_url)
      }
    }).catch(() => {})
  }, [])

  return (
    <>
      <footer
        className="bg-navy-950 border-t border-white/5"
        role="contentinfo"
        aria-label="Site footer"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            {/* Brand column (2 cols on desktop) */}
            <div className="lg:col-span-2">
              <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group" aria-label="OpenMNC">
                <img
                  src="/logo.webp"
                  alt="OpenMNC Emblem"
                  width="32"
                  height="32"
                  className="w-8 h-8 object-contain transition-transform duration-200 group-hover:scale-105"
                />
                <div className="flex items-center">
                  <span className="font-display text-2xl font-bold text-white">Open</span>
                  <span className="font-display text-2xl font-bold text-cyan-neon">MNC</span>
                  <span className="ml-0.5 w-2 h-2 rounded-full bg-cyan-neon" aria-hidden="true" />
                </div>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
                Engineering-first software development, AI app audits, App Store publishing, and the OpenMNC Academy
                providing 100% free career guidance and college fee subsidies across India and worldwide.
              </p>

              {/* Google Business Profile Rating Badge */}
              <div className="mb-6 inline-flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5 flex-shrink-0">
                  <img
                    src="/google-qr-framed.png"
                    alt="Google QR"
                    className="w-full h-full object-contain"
                    onError={(e) => { e.target.src = '/google-qr-code.png' }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-400 text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="text-white font-bold ml-1">5.0 on Google</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(true)}
                    className="text-[11px] text-cyan-neon font-semibold hover:underline block text-left"
                  >
                    Rate OPEN MNC on Google →
                  </button>
                </div>
              </div>

              {/* Contact info with crisp monochrome Lucide icons */}
              <address className="not-italic space-y-2 text-sm text-gray-400">
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-neon shrink-0" aria-hidden="true" />
                  <a href="mailto:hello@openmnc.com" className="hover:text-white transition-colors">
                    hello@openmnc.com
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-cyan-neon shrink-0" aria-hidden="true" />
                  <a href="tel:+918509684056" className="hover:text-white transition-colors">
                    +91 8509684056
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-neon shrink-0" aria-hidden="true" />
                  <span>HQ: West Bengal, India · Serving Worldwide &amp; Domestic</span>
                </p>
              </address>
            </div>

            {/* Three Link Columns for Clean Silos */}
            {FOOTER_SECTIONS.map((section) => (
              <nav key={section.title} aria-label={`${section.title} links`}>
                <h3 className="font-semibold text-white mb-4 text-xs font-display tracking-wider uppercase">
                  {section.title}
                </h3>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-xs sm:text-sm text-gray-400 hover:text-cyan-neon transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  {section.title === 'Company' && (
                    <li>
                      <button
                        type="button"
                        onClick={() => setReviewModalOpen(true)}
                        className="text-xs sm:text-sm text-amber-400 hover:underline flex items-center gap-1.5"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>Review Us on Google</span>
                      </button>
                    </li>
                  )}
                </ul>
              </nav>
            ))}
          </div>

          {/* Bottom bar with Legal Registration Entity Notice (Admin completely removed from public footer) */}
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs">
              &copy; {year} <strong className="text-gray-400 font-normal">M/S. OPEN MNC LLP</strong>. All rights reserved. Founded by{' '}
              <span className="text-gray-400">Amit Barai</span>.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://wa.me/918509684056"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-cyan-neon transition-colors duration-200"
                aria-label="WhatsApp OpenMNC"
              >
                WhatsApp
              </a>
              <span className="text-gray-700" aria-hidden="true">|</span>
              <a
                href="mailto:hello@openmnc.com"
                className="text-xs text-gray-500 hover:text-cyan-neon transition-colors duration-200"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </footer>

      <GoogleReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        reviewUrl={reviewUrl}
      />
    </>
  )
}
