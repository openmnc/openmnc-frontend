import { useState } from 'react'
import { Navigate, Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext.jsx'

// All available sidebar links with their role requirements
const ALL_SIDEBAR_LINKS = [
  { label: '📊 Dashboard', to: '/admin/dashboard', roles: ['admin', 'editor', 'author'] },
  { label: '📝 Blog & News CMS', to: '/admin/blogs', roles: ['admin', 'editor', 'author'] },
  { label: '⚙️ Services CMS', to: '/admin/services', roles: ['admin', 'editor', 'author'] },
  { label: '💼 Career Openings', to: '/admin/careers', roles: ['admin', 'editor'] },
  { label: '👥 Job Applicants', to: '/admin/applications', roles: ['admin', 'editor'] },
  { label: '📬 Inquiries & Leads', to: '/admin/contacts', roles: ['admin', 'editor'] },
  { label: '👥 Team & Roles', to: '/admin/team', roles: ['admin'] },
  { label: '⚙️ Site Copy & Settings', to: '/admin/settings', roles: ['admin'] },
]

export default function AdminLayout() {
  const { isAuthenticated, user, role, logout } = useAuthContext()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  // Filter links by active user role
  const allowedLinks = ALL_SIDEBAR_LINKS.filter((item) =>
    role === 'admin' ? true : item.roles.includes(role)
  )

  const roleBadgeStyle = {
    admin: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    editor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    author: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  }[role] || 'bg-gray-500/15 text-gray-300 border-gray-500/30'

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col lg:flex-row text-gray-100">
      {/* Mobile Top Header */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-navy-900 border-b border-white/5 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-white/5 text-gray-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
          <div className="flex items-center gap-1">
            <span className="font-display text-base font-bold text-white">Open</span>
            <span className="font-display text-base font-bold text-cyan-neon">MNC</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${roleBadgeStyle}`}>
            {role}
          </span>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-400 hover:text-red-400 p-1"
            title="Logout"
          >
            🚪
          </button>
        </div>
      </header>

      {/* Backdrop for mobile drawer */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Sidebar (Responsive drawer on mobile, static on desktop) */}
      <aside
        className={`
          fixed lg:static top-0 bottom-0 left-0 z-50
          w-64 flex-shrink-0 bg-navy-900 border-r border-white/5 flex flex-col
          transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        aria-label="Admin sidebar navigation"
      >
        {/* Brand / Logo */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1">
              <span className="font-display text-lg font-bold text-white">Open</span>
              <span className="font-display text-lg font-bold text-cyan-neon">MNC</span>
              <span className="ml-0.5 w-1.5 h-1.5 rounded-full bg-cyan-neon animate-pulse" aria-hidden="true" />
            </div>
            <p className="text-gray-500 text-xs mt-0.5">Control Center</p>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white text-lg p-1"
          >
            ✕
          </button>
        </div>

        {/* User Identity & Role Badge */}
        <div className="px-5 py-3.5 border-b border-white/5 bg-white/[0.02]">
          <div className="text-[11px] text-gray-400 truncate font-mono mb-1">
            {user?.email || 'Authenticated User'}
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${roleBadgeStyle}`}>
              {role === 'admin' ? 'Tier 1: Admin' : role === 'editor' ? 'Tier 2: Editor' : 'Tier 3: Author'}
            </span>
            {user?.is_owner && (
              <span className="text-[10px] text-amber-400 font-medium">Owner</span>
            )}
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto" aria-label="Admin navigation">
          {allowedLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `
                flex items-center px-3 py-2.5 rounded-lg text-sm transition-all duration-200
                ${isActive
                  ? 'bg-cyan-neon/10 text-cyan-neon border border-cyan-neon/20 font-medium shadow-cyan-glow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer links */}
        <div className="p-4 border-t border-white/5 space-y-1">
          <NavLink
            to="/"
            className="flex items-center px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            🌐 View Public Website
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-left"
            aria-label="Logout"
          >
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* Main content wrapper with horizontal overflow containment */}
      <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto" aria-label="Admin content">
        <Outlet />
      </main>
    </div>
  )
}
