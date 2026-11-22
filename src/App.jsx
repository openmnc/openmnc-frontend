import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './context/AuthContext.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

// Lazy-loaded public views for minimal bundle size & zero initial CLS
const Home = lazy(() => import('./pages/Home.jsx'))
const Services = lazy(() => import('./pages/Services.jsx'))
const CustomWebAppDevelopment = lazy(() => import('./pages/CustomWebAppDevelopment.jsx'))
const CareerGuidance = lazy(() => import('./pages/CareerGuidance.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const Careers = lazy(() => import('./pages/Careers.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const Blog = lazy(() => import('./pages/Blog.jsx'))
const BlogPost = lazy(() => import('./pages/BlogPost.jsx'))
const ApplicationTracker = lazy(() => import('./pages/ApplicationTracker.jsx'))

// Lazy-loaded admin views (isolated chunk — never loaded by public visitors)
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin.jsx'))
const AdminJoin = lazy(() => import('./pages/admin/AdminJoin.jsx'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout.jsx'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard.jsx'))
const ServicesAdmin = lazy(() => import('./pages/admin/ServicesAdmin.jsx'))
const CareersAdmin = lazy(() => import('./pages/admin/CareersAdmin.jsx'))
const SettingsAdmin = lazy(() => import('./pages/admin/SettingsAdmin.jsx'))
const ContactList = lazy(() => import('./pages/admin/ContactList.jsx'))
const BlogsAdmin = lazy(() => import('./pages/admin/BlogsAdmin.jsx'))
const ApplicationsAdmin = lazy(() => import('./pages/admin/ApplicationsAdmin.jsx'))
const TeamAdmin = lazy(() => import('./pages/admin/TeamAdmin.jsx'))

// Pre-reserved height loader preventing Cumulative Layout Shift (CLS)
function PageLoader() {
  return (
    <div
      className="min-h-screen bg-canvas text-ink-primary flex flex-col items-center justify-center"
      aria-label="Loading content"
    >
      <div className="w-12 h-12 rounded-full border-2 border-brand-primary/20 border-t-brand-primary animate-spin mb-4" />
      <span className="text-xs text-ink-muted font-medium tracking-wider uppercase">
        Loading OpenMNC...
      </span>
    </div>
  )
}

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-canvas text-ink-primary flex flex-col w-full overflow-x-hidden">
      <Navbar />
      <main className="min-h-[70vh] flex-1 w-full overflow-x-hidden">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* ══════ PUBLIC ROUTES (ZERO ORPHANED ROUTES) ══════ */}
              <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
              
              {/* ══════ DEDICATED HIGH-AUTHORITY SERVICE SILOS ══════ */}
              <Route
                path="/solutions/custom-web-app-development"
                element={<PublicLayout><CustomWebAppDevelopment /></PublicLayout>}
              />
              <Route
                path="/solutions"
                element={<Navigate to="/solutions/custom-web-app-development" replace />}
              />
              <Route
                path="/solutions/custom-web-and-app-development"
                element={<Navigate to="/solutions/custom-web-app-development" replace />}
              />
              <Route
                path="/services/custom-web-app-development"
                element={<Navigate to="/solutions/custom-web-app-development" replace />}
              />

              {/* Main Services Hub */}
              <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />

              {/* 5 DEDICATED LASER-FOCUSED SEO PILLAR ROUTES */}
              <Route
                path="/services/vibe-coded-app-audit-and-fixing"
                element={<PublicLayout><Services initialSlug="vibe-coded-app-audit-and-fixing" /></PublicLayout>}
              />
              <Route
                path="/services/app-store-play-store-publishing-and-approval"
                element={<PublicLayout><Services initialSlug="app-store-play-store-publishing-and-approval" /></PublicLayout>}
              />
              <Route
                path="/services/app-transfer-and-database-migration"
                element={<PublicLayout><Services initialSlug="app-transfer-and-database-migration" /></PublicLayout>}
              />
              <Route
                path="/services/custom-software-and-scalable-app-development"
                element={<PublicLayout><Services initialSlug="custom-software-and-scalable-app-development" /></PublicLayout>}
              />
              <Route
                path="/services/app-maintenance-and-support"
                element={<PublicLayout><Services initialSlug="app-maintenance-and-support" /></PublicLayout>}
              />

              {/* Dynamic slug & sub-slug fallback */}
              <Route path="/services/:slug" element={<PublicLayout><Services /></PublicLayout>} />
              <Route path="/services/:slug/:subSlug" element={<PublicLayout><Services /></PublicLayout>} />

              {/* Permanent 301/SPA Client Route Redirects for Deprecated / Old URLs */}
              <Route
                path="/services/business-automation"
                element={<Navigate to="/services" replace />}
              />
              <Route
                path="/business-automation"
                element={<Navigate to="/services" replace />}
              />
              <Route
                path="/custom-development"
                element={<Navigate to="/services/custom-software-and-scalable-app-development" replace />}
              />
              <Route
                path="/inhouse-products"
                element={<PublicLayout><Services initialSlug="inhouse-products" /></PublicLayout>}
              />
              {/* Dedicated Pillar & Core Service Routes */}
              <Route
                path="/services/social-media-management"
                element={<PublicLayout><Services initialSlug="social-media-management" /></PublicLayout>}
              />
              <Route
                path="/social-media-management"
                element={<PublicLayout><Services initialSlug="social-media-management" /></PublicLayout>}
              />

              {/* ══════ BANK-STYLE DEDICATED CAREER GUIDANCE & ACADEMY PORTAL ══════ */}
              <Route
                path="/career-guidance"
                element={<PublicLayout><CareerGuidance /></PublicLayout>}
              />
              <Route
                path="/services/student-guidance"
                element={<Navigate to="/career-guidance" replace />}
              />
              <Route
                path="/student-guidance"
                element={<Navigate to="/career-guidance" replace />}
              />
              <Route
                path="/academy"
                element={<Navigate to="/career-guidance" replace />}
              />
              <Route
                path="/industrial-training"
                element={<PublicLayout><Services initialSlug="industrial-training" /></PublicLayout>}
              />
              <Route
                path="/training"
                element={<PublicLayout><Services initialSlug="industrial-training" /></PublicLayout>}
              />

              {/* Core Company Pages */}
              <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
              <Route path="/careers" element={<PublicLayout><Careers /></PublicLayout>} />
              <Route path="/careers/track" element={<PublicLayout><ApplicationTracker /></PublicLayout>} />
              <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
              <Route path="/blog/:slug" element={<PublicLayout><BlogPost /></PublicLayout>} />
              <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

              {/* ══════ ADMIN & HR PANEL ROUTES ══════ */}
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
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  )
}
