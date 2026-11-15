import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Services from './pages/Services.jsx'
import About from './pages/About.jsx'
import Careers from './pages/Careers.jsx'
import Contact from './pages/Contact.jsx'
import Blog from './pages/Blog.jsx'
import BlogPost from './pages/BlogPost.jsx'
import ApplicationTracker from './pages/ApplicationTracker.jsx'

// Admin Views
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminJoin from './pages/admin/AdminJoin.jsx'
import AdminLayout from './pages/admin/AdminLayout.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import ServicesAdmin from './pages/admin/ServicesAdmin.jsx'
import CareersAdmin from './pages/admin/CareersAdmin.jsx'
import SettingsAdmin from './pages/admin/SettingsAdmin.jsx'
import ContactList from './pages/admin/ContactList.jsx'
import BlogsAdmin from './pages/admin/BlogsAdmin.jsx'
import ApplicationsAdmin from './pages/admin/ApplicationsAdmin.jsx'
import TeamAdmin from './pages/admin/TeamAdmin.jsx'

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/careers" element={<PublicLayout><Careers /></PublicLayout>} />
          <Route path="/careers/track" element={<PublicLayout><ApplicationTracker /></PublicLayout>} />
          <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
          <Route path="/blog/:slug" element={<PublicLayout><BlogPost /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

          {/* Admin & HR Panel Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/join" element={<AdminJoin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="blogs" element={<BlogsAdmin />} />
            <Route path="applications" element={<ApplicationsAdmin />} />
            <Route path="services" element={<ServicesAdmin />} />
            <Route path="careers" element={<CareersAdmin />} />
            <Route path="team" element={<TeamAdmin />} />
            <Route path="settings" element={<SettingsAdmin />} />
            <Route path="contacts" element={<ContactList />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<PublicLayout><Home /></PublicLayout>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
