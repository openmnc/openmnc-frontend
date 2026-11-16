import { Link } from 'react-router-dom'

const FOOTER_SECTIONS = [
  {
    title: 'Enterprise B2B',
    links: [
      { label: 'AI Automation & Workflows', to: '/services/business-automation' },
      { label: 'Custom App & Software Dev', to: '/services/custom-development' },
      { label: 'In-House Products (Kibo VPN)', to: '/services/inhouse-products' },
      { label: 'Social Media Organic Growth', to: '/services/social-media-management' },
      { label: 'All Enterprise Services', to: '/services' },
    ],
  },
  {
    title: 'Academy & Careers',
    links: [
      { label: '100% Free Student Guidance', to: '/services/student-guidance' },
      { label: 'Advanced Industrial Training', to: '/services/industrial-training' },
      { label: 'College Fee Subsidies (₹3k-₹10k)', to: '/services/student-guidance#student-faq' },
      { label: 'Live Internships & Jobs', to: '/careers' },
      { label: 'Track Candidate Application', to: '/careers/track' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Home', to: '/' },
      { label: 'About OpenMNC', to: '/about' },
      { label: 'Blog & Tech Insights', to: '/blog' },
      { label: 'Contact & Consultation', to: '/contact' },
    ],
  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="bg-navy-950 border-t border-white/5"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand column (2 cols on desktop) */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group" aria-label="OpenMNC LLP">
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
              Enterprise AI automation, full-cycle software development, and the OpenMNC Academy 
              empowering students with free guidance and industrial training across India and worldwide.
            </p>
            {/* Contact info */}
            <address className="not-italic space-y-2 text-sm text-gray-400">
              <p>
                <span className="text-cyan-neon">✉</span>{' '}
                <a href="mailto:hello@openmnc.com" className="hover:text-white transition-colors">
                  hello@openmnc.com
                </a>
              </p>
              <p>
                <span className="text-cyan-neon">📞</span>{' '}
                <a href="tel:+918509684056" className="hover:text-white transition-colors">
                  +91 8509684056
                </a>
              </p>
              <p>
                <span className="text-cyan-neon">📍</span>{' '}
                HQ: West Bengal, India · Serving Worldwide &amp; Domestic
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
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            &copy; {year} OpenMNC LLP. All rights reserved. Founded by{' '}
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
            <span className="text-gray-700" aria-hidden="true">|</span>
            <Link
              to="/admin/login"
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors duration-200"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
