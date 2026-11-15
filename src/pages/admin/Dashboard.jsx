import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import apiClient from '../../api/client.js'

function StatCard({ icon, label, value, loading, to }) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl" aria-hidden="true">{icon}</span>
        {to && (
          <Link to={to} className="text-xs text-cyan-neon hover:underline">View →</Link>
        )}
      </div>
      <div className="text-3xl font-display font-bold text-white mb-1">
        {loading ? (
          <div className="w-12 h-8 bg-white/10 rounded animate-pulse" aria-hidden="true" />
        ) : value}
      </div>
      <p className="text-gray-400 text-sm">{label}</p>
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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-gray-400 text-sm">Welcome back, Amit. Here&apos;s your site overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        <StatCard icon="📝" label="Blog Articles" value={stats.blogs} loading={loading} to="/admin/blogs" />
        <StatCard icon="👥" label="Job Applications" value={stats.applications} loading={loading} to="/admin/applications" />
        <StatCard icon="📬" label="Inquiries & Leads" value={stats.contacts} loading={loading} to="/admin/contacts" />
        <StatCard icon="⚙️" label="Active Services" value={stats.services} loading={loading} to="/admin/services" />
        <StatCard icon="💼" label="Job Openings" value={stats.careers} loading={loading} to="/admin/careers" />
        <StatCard icon="🔧" label="Site Copy & Settings" value={stats.settings} loading={loading} to="/admin/settings" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick links */}
        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: 'Add a New Service', to: '/admin/services' },
              { label: 'Post a Job Opening', to: '/admin/careers' },
              { label: 'Update Hero Text', to: '/admin/settings' },
              { label: 'View Contact Submissions', to: '/admin/contacts' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center justify-between px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-gray-300 hover:text-white transition-all duration-200"
              >
                {link.label}
                <span className="text-cyan-neon" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="glass-card p-6">
          <h2 className="font-semibold text-white mb-4">Site Info</h2>
          <dl className="space-y-3 text-sm">
            {[
              { term: 'Company', def: 'OpenMNC LLP' },
              { term: 'Founder', def: 'Amit Barai' },
              { term: 'Admin Email', def: 'amit@openmnc.com' },
              { term: 'Public Email', def: 'hello@openmnc.com' },
              { term: 'Phone', def: '+91 8509684056' },
              { term: 'Site URL', def: 'https://openmnc.com' },
            ].map(({ term, def }) => (
              <div key={term} className="flex justify-between">
                <dt className="text-gray-500">{term}</dt>
                <dd className="text-gray-300">{def}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
