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

  const allowedLinks = ALL_SIDEBAR_LINKS.filter((item) =>
    role === 'admin' ? true : item.roles.includes(role)
  )

  const roleBadgeStyle = {
    admin: 'bg-[#2997ff]/10 text-[#2997ff] border-[#2997ff]/20',
    editor: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
    author: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  }[role] || 'bg-white/5 text-[#a1a1a6] border-white/10'

  return (
    <div className="min-h-screen bg-black flex flex-col lg:flex-row text-[#f5f5f7]">
      {/* Mobile Top Header - Liquid Glass */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#111114]/90 backdrop-blur-xl border-b border-white/8 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-white/5 text-[#a1a1a6] hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="OpenMNC" className="w-6 h-6 object-contain" />
            <span className="font-display text-base font-semibold text-white tracking-tight">OpenMNC</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${roleBadgeStyle}`}>
            {role}
          </span>
          <button
            onClick={handleLogout}
            className="text-xs text-[#86868b] hover:text-white p-1"
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
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Sidebar (macOS Tahoe matte sidebar style) */}
      <aside
        className={`
          fixed lg:static top-0 bottom-0 left-0 z-50
          w-64 flex-shrink-0 bg-[#0d0d0f] border-r border-white/8 flex flex-col
          transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        aria-label="Admin sidebar navigation"
      >
        {/* Brand / Logo */}
        <div className="p-5 border-b border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="OpenMNC" className="w-7 h-7 object-contain" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-base font-semibold text-white tracking-tight">OpenMNC</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#2997ff]" aria-hidden="true" />
              </div>
              <p className="text-[#86868b] text-[11px]">System Console</p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-[#86868b] hover:text-white text-lg p-1"
          >
            ✕
          </button>
        </div>

        {/* User Identity & Role Badge */}
        <div className="px-5 py-3.5 border-b border-white/8 bg-white/[0.01]">
          <div className="text-[11px] text-[#86868b] truncate font-mono mb-1">
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

        {/* Navigation links - Concentric Apple Pills */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto" aria-label="Admin navigation">
          {allowedLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `
                flex items-center px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-white/12 text-white border border-white/12 shadow-sm'
                  : 'text-[#86868b] hover:text-white hover:bg-white/5'
                }
              `}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer links */}
        <div className="p-4 border-t border-white/8 space-y-1">
          <NavLink
            to="/"
            className="flex items-center px-3 py-2 rounded-xl text-xs text-[#86868b] hover:text-white hover:bg-white/5 transition-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            🌐 Public Website
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 rounded-xl text-xs text-[#86868b] hover:text-red-400 hover:bg-red-500/10 transition-all text-left"
            aria-label="Logout"
          >
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* Main content wrapper */}
      <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-black" aria-label="Admin content">
        <Outlet />
      </main>
    </div>
  )
}
