import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Zap,
  Rocket,
  RefreshCw,
  Wrench,
  ShieldCheck,
  Building2,
  Lock,
  GraduationCap,
  MessageSquare,
} from 'lucide-react'
import ThreeBackground from '../components/ThreeBackground.jsx'
import ServiceCard from '../components/ServiceCard.jsx'
import StatCounter from '../components/StatCounter.jsx'
import ScrollReveal from '../components/ScrollReveal.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import GlowButton from '../components/GlowButton.jsx'
import SEO from '../components/SEO.jsx'
import GoogleReviewModal from '../components/GoogleReviewModal.jsx'
import { servicesApi } from '../api/services.js'
import { settingsApi } from '../api/settings.js'
import { whatsappUrl } from '../utils/helpers.js'
import { localBusinessSchema, b2bFaqSchema } from '../utils/jsonld.js'

// Quick Problem Router Cards with crisp monochrome / styled Lucide icons
const QUICK_PROBLEM_ROUTER = [
  {
    icon: <Zap className="w-6 h-6 text-cyan-neon" aria-hidden="true" />,
    badge: 'Pillar 1',
    headline: 'AI-Built Code Fix',
    question: 'I built an app with AI (Cursor / Bolt / Lovable) and need it fixed & secured.',
    link: '/services/vibe-coded-app-audit-and-fixing',
    btnText: 'Audit & Fix My App →',
    color: 'border-cyan-neon/30 hover:border-cyan-neon',
  },
  {
    icon: <Rocket className="w-6 h-6 text-sky-400" aria-hidden="true" />,
    badge: 'Pillar 2',
    headline: 'App Store Approval',
    question: 'My app is ready (or rejected) and I need it live on Google Play & App Store.',
    link: '/services/app-store-play-store-publishing-and-approval',
    btnText: 'Get My App Approved →',
    color: 'border-sky-400/30 hover:border-sky-400',
  },
  {
    icon: <RefreshCw className="w-6 h-6 text-purple-400" aria-hidden="true" />,
    badge: 'Pillar 3',
    headline: 'App & DB Migration',
    question: 'I am buying, selling, or moving an app, database & cloud assets safely.',
    link: '/services/app-transfer-and-database-migration',
    btnText: 'Plan Safe Transfer →',
    color: 'border-purple-500/30 hover:border-purple-500',
  },
  {
    icon: <Wrench className="w-6 h-6 text-emerald-400" aria-hidden="true" />,
    badge: 'Pillar 4',
    headline: 'Custom Software & SaaS',
    question: 'I want to build a serious, scalable custom SaaS, web or mobile app from scratch.',
    link: '/services/custom-software-and-scalable-app-development',
    btnText: 'Discuss Architecture →',
    color: 'border-emerald-400/30 hover:border-emerald-400',
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-amber-400" aria-hidden="true" />,
    badge: 'Pillar 5',
    headline: 'Maintenance & AMC',
    question: 'I have a live app and need reliable ongoing maintenance, OS updates & bug fixing.',
    link: '/services/app-maintenance-and-support',
    btnText: 'Explore AMC Plans →',
    color: 'border-amber-400/30 hover:border-amber-400',
  },
]

// Default Services matching the 5 Pillars + Core Verticals
const DEFAULT_SERVICES = [
  {
    slug: 'vibe-coded-app-audit-and-fixing',
    title: 'Vibe-Coded App Audit & Fixing',
    tagline: 'Turn AI prototypes from Cursor & Bolt into production apps.',
    icon: 'audit',
    features: ['Line-by-line security audit', 'Supabase/Firebase RLS hardening', 'Stripe & webhook stabilization'],
  },
  {
    slug: 'app-store-play-store-publishing-and-approval',
    title: 'Play Store & App Store Publishing',
    tagline: 'Pass Apple/Google review & fix repeat policy violations.',
    icon: 'apps',
    features: ['Guideline 4.2 & 2.1 compliance', '12 testers closed testing management', 'Direct reviewer resolution appeal'],
  },
  {
    slug: 'app-transfer-and-database-migration',
    title: 'App Transfer & Database Migration',
    tagline: 'Zero-downtime acquisition transfer & cloud handover.',
    icon: 'transfer',
    features: ['Retain 100% store reviews & users', 'Dry-run database verification', 'Stripe & RevenueCat continuity'],
  },
  {
    slug: 'custom-software-and-scalable-app-development',
    title: 'Custom Software & Scalable Apps',
    tagline: 'Engineered for high-scale businesses from day one.',
    icon: 'code',
    features: ['React 18, FastAPI & PostgreSQL', 'Cross-platform iOS/Android apps', '100% source code ownership'],
  },
  {
    slug: 'app-maintenance-and-support',
    title: 'App Maintenance & Support (AMC)',
    tagline: '24/7 uptime monitoring, security patches & bug fixes.',
    icon: 'maintenance',
    features: ['Annual OS/SDK compliance checks', 'Priority SLA bug response', 'Dedicated monthly feature hours'],
  },
  {
    slug: 'business-automation',
    title: 'Enterprise AI Workflow Automation',
    tagline: 'Multiply revenue and eliminate repetitive manual tasks.',
    icon: 'automation',
    features: ['Autonomous AI multi-agent pipelines', 'CRM & WhatsApp lead qualification', 'Zero time-waste operations'],
  },
]

// Hero Metrics strictly initialized in StatCounter so Googlebot never sees "0"
const STATS = [
  { value: '5+', label: 'Specialized Pillars' },
  { value: '100%', label: 'Free Student Guidance' },
  { value: '50k+', label: 'In-House App Downloads' },
  { value: '12+', label: 'Partner Colleges' },
]

const WHY_US = [
  {
    icon: <Building2 className="w-8 h-8 text-cyan-neon" aria-hidden="true" />,
    title: 'Architecture-First Engineering',
    desc: 'No fragile shortcuts or endless AI loops. We model clean database schemas, define modular API contracts, and secure credentials before writing code.',
  },
  {
    icon: <Lock className="w-8 h-8 text-cyan-neon" aria-hidden="true" />,
    title: '100% IP & NDA Ownership',
    desc: 'Every repository commit, database table, and cloud account belongs exclusively to you under strict mutual non-disclosure agreements.',
  },
  {
    icon: <GraduationCap className="w-8 h-8 text-cyan-neon" aria-hidden="true" />,
    title: 'Zero-Broker Educational Support',
    desc: 'We support students across India with 100% free career counseling and direct ₹3,000–₹10,000 institutional partner college fee subsidies.',
  },
]

export default function Home() {
  const [services, setServices] = useState(DEFAULT_SERVICES)
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)

  useEffect(() => {
    Promise.allSettled([
      servicesApi.getAll(),
      settingsApi.getAll(),
    ]).then(([svcResult, setResult]) => {
      if (svcResult.status === 'fulfilled' && Array.isArray(svcResult.value?.data)) {
        const data = svcResult.value.data.filter((s) => s.is_active !== false)
        if (data.length > 0) setServices(data)
      }
      if (setResult.status === 'fulfilled' && setResult.value?.data) {
        setSettings(setResult.value.data)
      }
    }).finally(() => setLoading(false))
  }, [])

  return (
    <>
      <SEO
        title="OpenMNC | Tech & Career — Custom Software, App Store Publishing & Career Guidance"
        description="OpenMNC is a production-grade custom software, web, and mobile app engineering partner. We audit vibe-coded apps, publish to App Store/Play Store, migrate databases, and provide free student career guidance."
        canonical="/"
        keywords="vibe coded app audit, publish app on play store, fix app store rejection, app transfer service, custom software development india, free career guidance 12th pass, openmnc"
        schema={[localBusinessSchema, b2bFaqSchema]}
      />

      {/* ══════ HERO SECTION ══════ */}
      <section
        className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-hero-gradient"
        aria-label="Hero — Welcome to OpenMNC"
      >
        <ThreeBackground section="hero" />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-950/20 to-navy-950 pointer-events-none" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-radial from-cyan-neon/5 via-transparent to-transparent pointer-events-none" aria-hidden="true" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-neon/30 bg-cyan-neon/10 text-cyan-neon text-xs font-semibold tracking-wider uppercase mb-8 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-neon animate-pulse" aria-hidden="true" />
            Serious Engineering Partner · Serving Founders Worldwide &amp; Across India
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.12] tracking-tight mb-6"
          >
            <span className="text-white">You Focus on Your Customers.</span><br />
            <span className="gradient-text">We Handle the Engineering.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-slate-300 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto mb-10 font-normal"
          >
            We don&apos;t just write code—we audit vibe-coded AI prototypes, conquer App Store approvals,
            manage risk-free database migrations, and maintain production-grade software for startups globally.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <GlowButton to="/services" variant="primary" className="text-base px-8 py-4">
              Explore 5 Engineering Pillars →
            </GlowButton>
            <GlowButton
              href={whatsappUrl('918509684056', 'Hi OpenMNC! I want to consult regarding my app/software project.')}
              variant="outline"
              className="text-base px-8 py-4 flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              <span>WhatsApp Senior Engineer</span>
            </GlowButton>
          </motion.div>

          {/* Google Review Trust Pill */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400"
          >
            <button
              type="button"
              onClick={() => setReviewModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:border-amber-400/40 text-gray-300 hover:text-white transition-all"
            >
              <span className="text-amber-400 font-bold">★ 5.0 Rating</span>
              <span>on Google Business Profile</span>
              <span className="text-cyan-neon font-semibold underline ml-1">Rate Us →</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* ══════ BANK-STYLE SEPARATION SWITCHER BANNER ══════ */}
      <section className="bg-navy-900 border-y border-amber-glow/20 py-4 px-4" aria-label="Audience Switcher">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-amber-glow shrink-0" aria-hidden="true" />
            <div>
              <strong className="text-white text-xs sm:text-sm block">
                Are you a Student or Parent seeking 12th Pass Career Guidance &amp; College Subsidies?
              </strong>
              <p className="text-gray-400 text-[11px] sm:text-xs">
                We have a dedicated, 100% free portal with ₹3,000 to ₹10,000 institutional partner fee grants.
              </p>
            </div>
          </div>
          <Link
            to="/career-guidance"
            className="px-4 py-2 rounded-lg bg-amber-glow text-navy-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-glow/90 shadow-amber-glow whitespace-nowrap"
          >
            Visit Career Guidance Portal →
          </Link>
        </div>
      </section>

      {/* ══════ PART 4: INTERACTIVE 5-CARD QUICK PROBLEM ROUTER ══════ */}
      <section
        className="py-16 px-4 bg-navy-950 border-b border-white/5"
        aria-label="Quick Problem Selector"
      >
        <div className="container-max">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-cyan-neon uppercase tracking-wider block mb-2">
              Instant Solution Finder
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white mb-2">
              Where Are You Right Now?
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm">
              Click your current technical bottleneck to land directly on the specialized solution you need:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {QUICK_PROBLEM_ROUTER.map((card, i) => (
              <ScrollReveal key={card.headline} delay={i * 0.08}>
                <Link
                  to={card.link}
                  className={`glass-card p-5 h-full flex flex-col justify-between rounded-2xl border ${card.color} transition-all duration-300 hover:scale-[1.03] group`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-9 h-9 rounded-xl bg-white/6 border border-white/10 flex items-center justify-center shadow-sm" aria-hidden="true">
                        {card.icon}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-cyan-neon border border-white/10">
                        {card.badge}
                      </span>
                    </div>
                    <h3 className="font-display text-sm font-bold text-white mb-2 group-hover:text-cyan-neon transition-colors">
                      {card.headline}
                    </h3>
                    <p className="text-gray-300 text-xs leading-relaxed mb-4">
                      {card.question}
                    </p>
                  </div>

                  <span className="text-xs font-bold text-cyan-neon flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    {card.btnText}
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ STATS BAR (Initial Final Values Indexed by Googlebot) ══════ */}
      <section
        className="py-14 px-4 bg-navy-900 border-b border-white/5"
        aria-label="OpenMNC by the numbers"
      >
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.1}>
              <StatCounter value={stat.value} label={stat.label} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ══════ SERVICES GRID ══════ */}
      <section
        className="section-padding bg-navy-950"
        aria-label="Our services"
        id="services"
      >
        <div className="container-max">
          <SectionHeader
            eyebrow="The 5 Engineering Pillars"
            title="Laser-Focused Digital Product Engineering"
            subtitle="Generic software agencies try to do everything poorly. We focus on 5 mission-critical challenges founders face when shipping real apps."
          />
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((service, i) => (
              <ServiceCard key={service.slug || i} service={service} index={i} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <GlowButton to="/services" variant="outline">
              Explore Complete Services Hub &amp; Architecture →
            </GlowButton>
          </div>
        </div>
      </section>

      {/* ══════ GOOGLE REVIEWS SHOWCASE ══════ */}
      <section
        className="section-padding bg-navy-900 border-y border-white/5"
        aria-label="Client feedback"
      >
        <div className="container-max">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-4">
              <span>★ 5.0 Rated on Google Business Profile</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white mb-3">
              Trusted by Founders Worldwide
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm">
              Read real client impressions or scan our Google QR code to leave a review directly:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Review Card 1 */}
            <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="text-amber-400 text-sm mb-3">★★★★★</div>
                <blockquote className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4 italic">
                  &ldquo;Our vibe-coded app had open Supabase keys and failing Stripe webhooks. OpenMNC audited every file, locked down our RLS, and got us live on the App Store in 10 days flat.&rdquo;
                </blockquote>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <div>
                  <p className="text-white font-semibold">Verified Founder</p>
                  <p className="text-gray-500">SaaS Startup (US)</p>
                </div>
                <span className="text-cyan-neon font-mono text-[11px]">Google Review</span>
              </div>
            </div>

            {/* Review Card 2 */}
            <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="text-amber-400 text-sm mb-3">★★★★★</div>
                <blockquote className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4 italic">
                  &ldquo;Apple rejected our app twice under Guideline 4.2. Amit and his team refactored our native wrappers, handled closed testing, and secured approval without stress.&rdquo;
                </blockquote>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <div>
                  <p className="text-white font-semibold">Mobile App Creator</p>
                  <p className="text-gray-500">FinTech Utility (UK)</p>
                </div>
                <span className="text-cyan-neon font-mono text-[11px]">Google Review</span>
              </div>
            </div>

            {/* Google QR Card */}
            <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center border-amber-500/20">
              <div className="w-36 h-36 p-2 rounded-2xl bg-white shadow-xl mb-3 flex items-center justify-center">
                <img
                  src="/google-qr-framed.png"
                  alt="OPEN MNC Google QR code"
                  className="w-full h-auto object-contain"
                  onError={(e) => { e.target.src = '/google-qr-code.png' }}
                />
              </div>
              <span className="text-[11px] text-gray-300 font-medium mb-3">
                Scan with phone camera to review us
              </span>
              <button
                type="button"
                onClick={() => setReviewModalOpen(true)}
                className="w-full py-2 rounded-xl bg-amber-500 text-navy-950 font-bold text-xs hover:bg-amber-400 transition-all shadow-sm"
              >
                Rate OPEN MNC on Google →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ WHY US ══════ */}
      <section
        className="section-padding bg-navy-950"
        aria-label="Why choose OpenMNC"
        id="why-openmnc"
      >
        <div className="container-max">
          <SectionHeader
            eyebrow="Why OpenMNC"
            title="Engineering First. No Agency Noise."
          />
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {WHY_US.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.15}>
                <div className="glass-card p-8 text-center group hover:border-cyan-neon/30 transition-all duration-300">
                  <div
                    className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-cyan-neon/10 border border-cyan-neon/20 flex items-center justify-center group-hover:bg-cyan-neon/20 transition-colors duration-300"
                    aria-hidden="true"
                  >
                    {item.icon}
                  </div>
                  <h3 className="font-display text-lg font-bold text-white mb-3 group-hover:text-cyan-neon transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ BOTTOM CTA ══════ */}
      <section
        className="relative py-24 px-4 overflow-hidden"
        aria-label="Call to action"
        style={{ background: 'linear-gradient(135deg, #0a0e1a 0%, #0d1226 40%, #001a1a 100%)' }}
      >
        <div className="relative container-max text-center">
          <ScrollReveal>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-white mb-4">
              Stop Fighting Broken Code. Ship With Senior Engineers.
            </h2>
            <p className="text-gray-400 text-base sm:text-lg mb-8 max-w-xl mx-auto">
              Book a discovery call with founder Amit Barai. We sign an NDA, audit your requirements, and ship with speed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <GlowButton
                to="/contact"
                variant="primary"
                className="text-base px-8 py-4"
              >
                Book a Free Discovery Call →
              </GlowButton>
              <GlowButton
                href={whatsappUrl('918509684056', 'Hi Amit! I want to discuss my app project.')}
                variant="outline"
                className="text-base px-8 py-4 flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <span>WhatsApp Chat</span>
              </GlowButton>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <GoogleReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        reviewUrl={settings?.google_review_url}
      />
    </>
  )
}
