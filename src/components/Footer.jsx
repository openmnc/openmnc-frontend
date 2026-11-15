import { Link } from 'react-router-dom'

const FOOTER_LINKS = {
  Company: [
    { label: 'Home', to: '/' },
    { label: 'About Us', to: '/about' },
    { label: 'Services', to: '/services' },
    { label: 'Blog & Insights', to: '/blog' },
    { label: 'Careers', to: '/careers' },
    { label: 'Track Application', to: '/careers/track' },
    { label: 'Contact & Consultation', to: '/contact' },
  ],
  Services: [
    { label: 'Business Automation', to: '/services#business-automation' },
    { label: 'App Development', to: '/services#custom-development' },
    { label: 'Social Media', to: '/services#social-media' },
    { label: 'Student Guidance', to: '/services#student-guidance' },
    { label: 'Industrial Training', to: '/services#industrial-training' },
  ],
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="bg-navy-950 border-t border-white/5"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-1 mb-4" aria-label="OpenMNC LLP">
              <span className="font-display text-2xl font-bold text-white">Open</span>
              <span className="font-display text-2xl font-bold text-cyan-neon">MNC</span>
              <span className="ml-0.5 w-2 h-2 rounded-full bg-cyan-neon" aria-hidden="true" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              AI automation, custom software development, social media management,
              student guidance and industrial training company in India.
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
                India
              </p>
            </address>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <nav key={heading} aria-label={`${heading} links`}>
              <h3 className="font-semibold text-white mb-4 text-sm tracking-wider uppercase">
                {heading}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-400 hover:text-cyan-neon transition-colors duration-200"
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
