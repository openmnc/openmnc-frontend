import { Navigate, Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext.jsx'

const SIDEBAR_LINKS = [
  { label: '📊 Dashboard', to: '/admin/dashboard' },
  { label: '📝 Blog & News CMS', to: '/admin/blogs' },
  { label: '👥 Job Applicants', to: '/admin/applications' },
  { label: '💼 Career Openings', to: '/admin/careers' },
  { label: '⚙️ Services CMS', to: '/admin/services' },
  { label: '📬 Inquiries & Leads', to: '/admin/contacts' },
  { label: '⚙️ Site Copy & Settings', to: '/admin/settings' },
]

export default function AdminLayout() {
  const { isAuthenticated, logout } = useAuthContext()
  const navigate = useNavigate()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-navy-950 flex">
      {/* Sidebar */}
      <aside
        className="w-60 flex-shrink-0 bg-navy-900 border-r border-white/5 flex flex-col"
        aria-label="Admin sidebar navigation"
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-1">
            <span className="font-display text-lg font-bold text-white">Open</span>
            <span className="font-display text-lg font-bold text-cyan-neon">MNC</span>
            <span className="ml-0.5 w-1.5 h-1.5 rounded-full bg-cyan-neon" aria-hidden="true" />
          </div>
          <p className="text-gray-500 text-xs mt-1">Admin Panel</p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-4 space-y-1" aria-label="Admin navigation">
          {SIDEBAR_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `
                flex items-center px-3 py-2.5 rounded-lg text-sm transition-all duration-200
                ${isActive
                  ? 'bg-cyan-neon/10 text-cyan-neon border border-cyan-neon/20'
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
            className="flex items-center px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            🌐 View Site
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
            aria-label="Logout"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto" aria-label="Admin content">
        <Outlet />
      </main>
    </div>
  )
}
