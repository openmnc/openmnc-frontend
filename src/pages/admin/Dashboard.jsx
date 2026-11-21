import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../../api/client.js'

function StatCard({ icon, label, value, loading, to }) {
  return (
    <div className="rounded-2xl bg-[#161618] border border-white/8 p-6 hover:border-white/16 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl" aria-hidden="true">{icon}</span>
        {to && (
          <Link to={to} className="text-xs text-[#2997ff] hover:underline font-medium">View →</Link>
        )}
      </div>
      <div className="text-3xl font-display font-semibold text-[#f5f5f7] mb-1 tabular-nums">
        {loading ? (
          <div className="w-12 h-8 bg-white/10 rounded animate-pulse" aria-hidden="true" />
        ) : value}
      </div>
      <p className="text-[#86868b] text-xs sm:text-sm font-medium">{label}</p>
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState({ services: 0, careers: 0, contacts: 0, settings: 0, blogs: 0, applications: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      apiClient.get('/services'),
      apiClient.get('/careers'),
      apiClient.get('/contact'),
      apiClient.get('/settings'),
      apiClient.get('/blogs/admin/all'),
      apiClient.get('/careers/admin/applications'),
    ]).then(([svc, car, con, set, blg, app]) => {
      setStats({
        services: svc.status === 'fulfilled' ? (svc.value.data?.length || 0) : '—',
        careers: car.status === 'fulfilled' ? (car.value.data?.length || 0) : '—',
        contacts: con.status === 'fulfilled' ? (con.value.data?.length || 0) : '—',
        settings: set.status === 'fulfilled' ? Object.keys(set.value.data || {}).length : '—',
        blogs: blg.status === 'fulfilled' ? (blg.value.data?.length || 0) : '—',
        applications: app.status === 'fulfilled' ? (app.value.data?.length || 0) : '—',
      })
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#f5f5f7] tracking-tight mb-1">
          System Overview
        </h1>
        <p className="text-[#86868b] text-xs sm:text-sm">
          Welcome back. Real-time metrics and administration control for OpenMNC.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        <StatCard icon="📝" label="Blog & Newsroom Articles" value={stats.blogs} loading={loading} to="/admin/blogs" />
        <StatCard icon="👥" label="Candidate Applications" value={stats.applications} loading={loading} to="/admin/applications" />
        <StatCard icon="📬" label="Inquiries & Founder Leads" value={stats.contacts} loading={loading} to="/admin/contacts" />
        <StatCard icon="⚙️" label="Active Engineering Services" value={stats.services} loading={loading} to="/admin/services" />
        <StatCard icon="💼" label="Active Job Openings" value={stats.careers} loading={loading} to="/admin/careers" />
        <StatCard icon="🔧" label="System Preferences" value={stats.settings} loading={loading} to="/admin/settings" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick actions - macOS Preferences List */}
        <div className="rounded-2xl bg-[#161618] border border-white/8 p-6">
          <h2 className="font-semibold text-base text-[#f5f5f7] mb-4">Quick Management Actions</h2>
          <div className="divide-y divide-white/8">
            {[
              { label: 'Add or Edit Engineering Service', to: '/admin/services' },
              { label: 'Post a New Job / Internship Opening', to: '/admin/careers' },
              { label: 'Review Candidate Resumes & CVs', to: '/admin/applications' },
              { label: 'Update Site Headlines & Legal Copy', to: '/admin/settings' },
              { label: 'View Founder Inquiries & WhatsApp Leads', to: '/admin/contacts' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center justify-between py-3 text-xs sm:text-sm text-[#d2d2d7] hover:text-white transition-colors"
              >
                <span>{link.label}</span>
                <span className="text-[#2997ff]" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Site info - macOS Specs layout */}
        <div className="rounded-2xl bg-[#161618] border border-white/8 p-6">
          <h2 className="font-semibold text-base text-[#f5f5f7] mb-4">Legal &amp; Architecture Details</h2>
          <dl className="divide-y divide-white/8 text-xs sm:text-sm">
            {[
              { term: 'Legal Entity', def: 'M/S. OPEN MNC LLP' },
              { term: 'Brand Name', def: 'OpenMNC' },
              { term: 'Managing Director', def: 'Amit Barai' },
              { term: 'Primary Contact', def: 'amit@openmnc.com' },
              { term: 'Direct Phone', def: '+91 8509684056' },
              { term: 'Google Profile Rating', def: '★ 5.0 (Verified)' },
              { term: 'Design System', def: 'Apple Liquid Glass (iOS 26)' },
            ].map(({ term, def }) => (
              <div key={term} className="py-2.5 flex justify-between items-center">
                <dt className="text-[#86868b]">{term}</dt>
                <dd className="text-[#f5f5f7] font-medium font-mono text-right">{def}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
