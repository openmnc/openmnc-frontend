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
  ArrowRight,
  TrendingUp,
  Percent,
  CheckCircle2,
  Star,
} from 'lucide-react'
import ServiceCard from '../components/ServiceCard.jsx'
import StatCounter from '../components/StatCounter.jsx'
import ScrollReveal from '../components/ScrollReveal.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import SEO from '../components/SEO.jsx'
import GoogleReviewModal from '../components/GoogleReviewModal.jsx'
import { servicesApi } from '../api/services.js'
import { settingsApi } from '../api/settings.js'
import { whatsappUrl } from '../utils/helpers.js'
import { localBusinessSchema, b2bFaqSchema } from '../utils/jsonld.js'

// ─── MOTION GRAPHICS & VISUAL DIAGRAMS FOR SILOS ─────────────────────────────

function CommissionLeakDiagram() {
  return (
    <div className="w-full bg-subtle p-4 sm:p-5 rounded-2xl border border-hairline my-4 select-none">
      <div className="text-[11px] font-mono text-ink-muted uppercase tracking-wider mb-2.5 flex items-center justify-between">
        <span>Commission Math Comparison</span>
        <span className="text-red-500 font-semibold">-30% vs 0%</span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-left">
        {/* Aggregator Route */}
        <div className="p-3 rounded-xl bg-red-50/80 border border-red-200">
          <div className="text-[11px] font-semibold text-red-600 mb-1">
            Aggregators
          </div>
          <div className="text-xs text-ink-secondary font-sans">₹10 Lakh GMV</div>
          <div className="text-sm font-bold text-red-600 font-mono mt-0.5">-₹3,00,000</div>
          <div className="text-[10px] text-red-500/80 mt-1">Swiggy/Zomato cut + no customer data</div>
        </div>

        {/* Direct Platform Route */}
        <div className="p-3 rounded-xl bg-blue-50/90 border border-blue-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-7 h-7 bg-blue-600/10 rounded-bl-xl flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" strokeWidth={2.5} />
          </div>
          <div className="text-[11px] font-semibold text-brand-primary mb-1">Your Direct App</div>
          <div className="text-xs text-ink-secondary font-sans">₹10 Lakh GMV</div>
          <div className="text-sm font-bold text-status-success font-mono mt-0.5">₹10,00,000 Kept</div>
          <div className="text-[10px] text-brand-primary mt-1">100% Direct Margins + WhatsApp CRM</div>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-hairline flex items-center justify-between text-[11px] text-ink-muted font-sans">
        <span className="flex items-center gap-1.5 text-brand-primary font-medium">
          <Percent className="w-3.5 h-3.5" />
          Annual Profit Plugged: ₹12L–₹36L
        </span>
        <span className="font-mono text-ink-muted">Zero Middleman</span>
      </div>
    </div>
  )
}

function SocialGrowthDiagram() {
  return (
    <div className="w-full bg-subtle p-4 sm:p-5 rounded-2xl border border-hairline my-4 select-none">
      <div className="text-[11px] font-mono text-ink-muted uppercase tracking-wider mb-2.5 flex items-center justify-between">
        <span>Organic Funnel Flow</span>
        <span className="text-status-success font-semibold">24/7 Engine</span>
      </div>

      <div className="flex items-center justify-between gap-1 sm:gap-2">
        <div className="flex-1 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-center">
          <div className="text-[10px] uppercase font-mono text-ink-muted">Step 1</div>
          <div className="text-xs font-bold text-status-success font-heading">0-3s Hook</div>
          <div className="text-[9px] text-ink-secondary mt-0.5">High retention</div>
        </div>
        <div className="text-emerald-500 text-xs font-bold">→</div>
        <div className="flex-1 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-center">
          <div className="text-[10px] uppercase font-mono text-ink-muted">Step 2</div>
          <div className="text-xs font-bold text-status-success font-heading">Pro Denoise</div>
          <div className="text-[9px] text-ink-secondary mt-0.5">Studio 4K audio</div>
        </div>
        <div className="text-emerald-500 text-xs font-bold">→</div>
        <div className="flex-1 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-center">
          <div className="text-[10px] uppercase font-mono text-ink-muted">Step 3</div>
          <div className="text-xs font-bold text-status-success font-heading">Footfall</div>
          <div className="text-[9px] text-ink-secondary mt-0.5">WhatsApp walk-in</div>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-hairline flex items-center justify-between text-[11px] text-ink-muted font-sans">
        <span className="flex items-center gap-1.5 text-status-success font-medium">
          <TrendingUp className="w-3.5 h-3.5" />
          Organic Viral Growth
        </span>
        <span className="font-mono text-ink-muted">Zero Ad Spend Burn</span>
      </div>
    </div>
  )
}

function CareerGrantDiagram() {
  return (
    <div className="w-full bg-subtle p-4 sm:p-5 rounded-2xl border border-hairline my-4 select-none">
      <div className="text-[11px] font-mono text-ink-muted uppercase tracking-wider mb-2.5 flex items-center justify-between">
        <span>Direct Admission Grant</span>
        <span className="text-amber-600 font-semibold">100% Free ₹0</span>
      </div>

      <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200 flex items-center justify-between gap-3">
        <div className="text-left">
          <span className="text-[10px] uppercase font-mono text-amber-700 font-semibold block">Official Industrial Subsidy</span>
          <span className="text-sm sm:text-base font-extrabold text-ink-primary font-heading">₹3,000 – ₹10,000 Off</span>
          <span className="text-[10px] text-ink-secondary block">Direct deduction on partner college admission fees</span>
        </div>
        <div className="shrink-0 px-3 py-1.5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs uppercase font-sans">
          Apply ₹0
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-hairline flex items-center justify-between text-[11px] text-ink-muted font-sans">
        <span className="flex items-center gap-1.5 text-amber-700 font-medium">
          <GraduationCap className="w-3.5 h-3.5" />
          Zero Agent Brokerage
        </span>
        <span className="font-mono text-ink-muted">12+ Partner Colleges</span>
      </div>
    </div>
  )
}

// ─── VISUAL MOTION LIFECYCLE DIAGRAM (DARK SHOWCASE BAND) ─────────────────────

function EngineeringLifecycleFlow() {
  const steps = [
    {
      num: '01',
      title: 'Vibe Code & Security Audit',
      desc: 'Line-by-line review of AI-generated code (Cursor/Bolt). We eliminate exposed keys, secure Supabase/Firebase RLS, and fix auth crashes.',
      color: 'border-brand-primary/40 text-brand-accent-bright bg-brand-primary/20',
      badge: 'Security',
    },
    {
      num: '02',
      title: 'Production Architecture',
      desc: 'Scalable FastAPI, Node.js, and PostgreSQL schemas with caching and rate limiting. Built to sustain tens of thousands of simultaneous users.',
      color: 'border-sky-500/40 text-sky-400 bg-sky-500/20',
      badge: 'Speed & Scale',
    },
    {
      num: '03',
      title: 'App Store Review & Release',
      desc: 'Compliance with Apple Guideline 4.2 / 2.1 and Google 12-tester closed tracks. We manage reviewer responses until your app is live.',
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/20',
      badge: '100% Approval',
    },
    {
      num: '04',
      title: '24/7 SLA & AMC Support',
      desc: 'Annual OS SDK updates, third-party webhook monitoring, and immediate bug-fix response so your platform never stays down.',
      color: 'border-amber-500/40 text-amber-400 bg-amber-500/20',
      badge: 'Peace of Mind',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {steps.map((st) => (
        <div
          key={st.num}
          className="p-6 rounded-2xl bg-surface border border-hairline hover:border-brand-primary/40 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-2xl font-extrabold text-ink-muted group-hover:text-brand-primary transition-colors">
                {st.num}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${st.color}`}>
                {st.badge}
              </span>
            </div>
            <h3 className="font-heading text-lg font-bold text-ink-primary mb-2 group-hover:text-brand-primary transition-colors">
              {st.title}
            </h3>
            <p className="text-ink-secondary font-sans text-sm leading-relaxed">
              {st.desc}
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-hairline flex items-center gap-1.5 text-xs text-ink-secondary font-medium font-sans">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" />
            <span>Standard SLA Delivery</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── DATA CONFIGURATIONS ──────────────────────────────────────────────────────

const QUICK_PROBLEM_ROUTER = [
  {
    icon: <Zap className="w-6 h-6 text-brand-primary" strokeWidth={1.5} aria-hidden="true" />,
    badge: 'Pillar 1',
    headline: 'AI-Built Code Fix',
    question: 'I built an app with AI (Cursor / Bolt / Lovable) and need it fixed & secured.',
    link: '/services/vibe-coded-app-audit-and-fixing',
    btnText: 'Audit & Fix My App →',
    color: 'hover:border-brand-primary',
  },
  {
    icon: <Rocket className="w-6 h-6 text-brand-accent" strokeWidth={1.5} aria-hidden="true" />,
    badge: 'Pillar 2',
    headline: 'App Store Approval',
    question: 'My app is ready (or rejected) and I need it live on Google Play & App Store.',
    link: '/services/app-store-play-store-publishing-and-approval',
    btnText: 'Get My App Approved →',
    color: 'hover:border-brand-accent',
  },
  {
    icon: <RefreshCw className="w-6 h-6 text-indigo-500" strokeWidth={1.5} aria-hidden="true" />,
    badge: 'Pillar 3',
    headline: 'App & DB Migration',
    question: 'I am buying, selling, or moving an app, database & cloud assets safely.',
    link: '/services/app-transfer-and-database-migration',
    btnText: 'Plan Safe Transfer →',
    color: 'hover:border-indigo-400',
  },
  {
    icon: <Wrench className="w-6 h-6 text-status-success" strokeWidth={1.5} aria-hidden="true" />,
    badge: 'Pillar 4',
    headline: 'Custom Software & SaaS',
    question: 'I want to build a serious, scalable custom SaaS, web or mobile app from scratch.',
    link: '/services/custom-software-and-scalable-app-development',
    btnText: 'Discuss Architecture →',
    color: 'hover:border-status-success',
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-amber-500" strokeWidth={1.5} aria-hidden="true" />,
    badge: 'Pillar 5',
    headline: 'Maintenance & AMC',
    question: 'I have a live app and need reliable ongoing maintenance, OS updates & bug fixing.',
    link: '/services/app-maintenance-and-support',
    btnText: 'Explore AMC Plans →',
    color: 'hover:border-amber-500',
  },
]

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

const STATS = [
  { value: '5+', label: 'Specialized Pillars' },
  { value: '100%', label: 'Free Student Guidance' },
  { value: '50k+', label: 'In-House App Downloads' },
  { value: '12+', label: 'Partner Colleges' },
]

const WHY_US = [
  {
    icon: <Building2 className="w-8 h-8 text-brand-primary" strokeWidth={1.5} aria-hidden="true" />,
    title: 'Architecture-First Engineering',
    desc: 'No fragile shortcuts or endless AI hallucination loops. We model clean database schemas, define modular API contracts, and secure credentials before writing code.',
  },
  {
    icon: <Lock className="w-8 h-8 text-brand-primary" strokeWidth={1.5} aria-hidden="true" />,
    title: '100% IP & NDA Ownership',
    desc: 'Every repository commit, database table, and cloud account belongs exclusively to you under strict mutual non-disclosure agreements.',
  },
  {
    icon: <GraduationCap className="w-8 h-8 text-amber-500" strokeWidth={1.5} aria-hidden="true" />,
    title: 'Zero-Broker Educational Support',
    desc: 'We support 12th-pass students with 100% free career counseling and direct ₹3,000–₹10,000 institutional partner college fee subsidies.',
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

      {/* ══════ SECTION 1: HERO (LIGHT-FIRST CANVAS WITH AMBIENT MESH) ══════ */}
      <section
        className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-canvas bg-ambient-mesh pt-32 pb-20"
        aria-label="Hero — Welcome to OpenMNC"
      >
        <div className="section-container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50/80 text-brand-primary type-eyebrow mb-6 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" aria-hidden="true" />
            Serious Engineering Partner · Serving Founders Worldwide &amp; Across India
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="type-h1 mb-6 text-ink-primary max-w-4xl mx-auto"
          >
            <span>You Focus on Your Customers.</span><br />
            <span className="bg-gradient-to-r from-brand-primary via-blue-700 to-indigo-600 bg-clip-text text-transparent">
              We Handle the Engineering.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="type-lead mx-auto mb-10 text-ink-secondary"
          >
            We don&apos;t just write code—we audit vibe-coded AI prototypes, conquer App Store approvals,
            manage risk-free database migrations, and maintain production-grade software for startups globally.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/services"
              className="w-full sm:w-auto px-8 py-3.5 rounded-btn bg-brand-primary hover:bg-brand-primary-hover text-white font-sans font-semibold text-base transition-all duration-200 shadow-[0_4px_16px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 active:translate-y-0 text-center"
            >
              Explore 5 Engineering Pillars →
            </Link>
            <a
              href={whatsappUrl('918509684056', 'Hi OpenMNC! I want to consult regarding my app/software project.')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-btn bg-surface hover:bg-subtle border border-hairline text-ink-primary font-sans font-medium text-base transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageSquare className="w-4 h-4 text-status-success" strokeWidth={1.5} aria-hidden="true" />
              <span>WhatsApp Senior Engineer</span>
            </a>
          </motion.div>

          {/* Google Review Trust Pill */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex items-center justify-center gap-2 text-xs text-ink-muted font-sans"
          >
            <button
              type="button"
              onClick={() => setReviewModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface border border-hairline hover:border-amber-400 text-ink-secondary hover:text-ink-primary transition-all shadow-sm"
            >
              <span className="text-amber-500 font-bold">★ 5.0 Rating</span>
              <span>on Google Business Profile</span>
              <span className="text-brand-primary font-semibold underline ml-1">Rate Us →</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* ══════ SECTION 2: STATS STRIP (SUBTLE BG) ══════ */}
      <section
        className="py-12 px-4 bg-subtle border-y border-hairline"
        aria-label="OpenMNC by the numbers"
      >
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.1}>
              <StatCounter value={stat.value} label={stat.label} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ══════ SECTION 3: BUSINESS VERTICAL SILOS (CANVAS WITH SURFACE CARDS) ══════ */}
      <section
        className="section-spacing bg-canvas relative"
        aria-label="Core Business Verticals"
      >
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="type-eyebrow block mb-2">
              Clean Vertical Architecture
            </span>
            <h2 className="type-h2 mb-3">
              Explore Our Dedicated Business Verticals
            </h2>
            <p className="type-lead mx-auto">
              We segregate our services into focused, high-authority silos so you get deep expertise with zero distraction:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Silo 1: Custom Web & App Solutions */}
            <ScrollReveal delay={0.05}>
              <div className="p-7 rounded-card bg-surface border border-hairline hover:border-brand-primary/40 transition-all duration-300 flex flex-col justify-between h-full group shadow-sm hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-brand-primary border border-blue-200 font-mono">
                      B2B Software &amp; Apps
                    </span>
                    <span className="text-xs text-ink-muted font-mono">Silo 1</span>
                  </div>
                  <h3 className="type-h3 mb-2 group-hover:text-brand-primary transition-colors">
                    Custom Web &amp; App Solutions
                  </h3>
                  <p className="text-xs text-brand-primary font-medium mb-3 font-sans">
                    Target: Cloud kitchens, D2C brands, pharma, retail, SMEs
                  </p>
                  <p className="type-body mb-2 text-ink-secondary">
                    Stop paying 20%–30% aggregator commissions. We engineer custom direct ordering websites, D2C mobile apps, and customer databases with 100% data ownership.
                  </p>

                  <CommissionLeakDiagram />
                </div>

                <div className="pt-4 border-t border-hairline flex items-center justify-between">
                  <span className="text-xs text-ink-muted font-mono">Plug 30% Margin Leaks</span>
                  <Link
                    to="/solutions/custom-web-app-development"
                    className="text-xs font-bold text-brand-primary group-hover:translate-x-1 transition-transform flex items-center gap-1 font-sans"
                  >
                    Explore Solutions →
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Silo 2: Social Media Management */}
            <ScrollReveal delay={0.12}>
              <div className="p-7 rounded-card bg-surface border border-hairline hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between h-full group shadow-sm hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-status-success border border-emerald-200 font-mono">
                      Organic Growth Engine
                    </span>
                    <span className="text-xs text-ink-muted font-mono">Silo 2</span>
                  </div>
                  <h3 className="type-h3 mb-2 group-hover:text-status-success transition-colors">
                    Social Media Management
                  </h3>
                  <p className="text-xs text-status-success font-medium mb-3 font-sans">
                    Target: Cafes, bakeries, local brands, real estate
                  </p>
                  <p className="type-body mb-2 text-ink-secondary">
                    Turn Instagram &amp; Facebook into a 24/7 footfall engine with Hook-Retention-CTA Reels, professional audio denoising, and direct WhatsApp walk-in workflows.
                  </p>

                  <SocialGrowthDiagram />
                </div>

                <div className="pt-4 border-t border-hairline flex items-center justify-between">
                  <span className="text-xs text-ink-muted font-mono">Zero Ad Spend Burn</span>
                  <Link
                    to="/services/social-media-management"
                    className="text-xs font-bold text-status-success group-hover:translate-x-1 transition-transform flex items-center gap-1 font-sans"
                  >
                    Explore Social Growth →
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Silo 3: Career & Student Guidance */}
            <ScrollReveal delay={0.2}>
              <div className="p-7 rounded-card bg-surface border border-hairline hover:border-amber-400 transition-all duration-300 flex flex-col justify-between h-full group shadow-sm hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-mono">
                      100% Free ₹0 Guidance
                    </span>
                    <span className="text-xs text-ink-muted font-mono">Silo 3</span>
                  </div>
                  <h3 className="type-h3 mb-2 group-hover:text-amber-600 transition-colors">
                    Career &amp; Student Guidance
                  </h3>
                  <p className="text-xs text-amber-700 font-medium mb-3 font-sans">
                    Target: 12th-pass students &amp; parents
                  </p>
                  <p className="type-body mb-2 text-ink-secondary">
                    Completely free career counseling, aptitude matching, and direct ₹3,000–₹10,000 institutional partner college fee subsidies across accredited universities.
                  </p>

                  <CareerGrantDiagram />
                </div>

                <div className="pt-4 border-t border-hairline flex items-center justify-between">
                  <span className="text-xs text-ink-muted font-mono">Partner College Grants</span>
                  <Link
                    to="/career-guidance"
                    className="text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-sans"
                  >
                    Visit Free Portal →
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ══════ SECTION 4: 5-PILLAR PROBLEM SELECTOR (SUBTLE BG) ══════ */}
      <section
        className="section-spacing bg-subtle border-y border-hairline"
        aria-label="Quick Problem Selector"
      >
        <div className="section-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="type-eyebrow block mb-2">
              Instant Solution Finder
            </span>
            <h2 className="type-h2 mb-3">
              Where Are You Right Now?
            </h2>
            <p className="type-body text-ink-secondary mx-auto">
              Click your current technical bottleneck to land directly on the specialized solution you need:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {QUICK_PROBLEM_ROUTER.map((card, i) => (
              <ScrollReveal key={card.headline} delay={i * 0.08}>
                <Link
                  to={card.link}
                  className={`p-6 h-full flex flex-col justify-between rounded-card bg-surface border border-hairline ${card.color} transition-all duration-300 hover:-translate-y-1 group shadow-sm`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="w-10 h-10 rounded-xl bg-subtle border border-hairline flex items-center justify-center shadow-sm" aria-hidden="true">
                        {card.icon}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-subtle text-brand-primary border border-hairline font-mono">
                        {card.badge}
                      </span>
                    </div>
                    <h3 className="type-h3 text-base mb-2 group-hover:text-brand-primary transition-colors">
                      {card.headline}
                    </h3>
                    <p className="type-body text-xs sm:text-[13px] leading-relaxed mb-4 text-ink-secondary">
                      {card.question}
                    </p>
                  </div>

                  <span className="text-xs font-bold text-brand-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform font-sans">
                    {card.btnText}
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ SECTION 4: VISUAL ENGINEERING LIFECYCLE (SUBTLE BG) ══════ */}
      <section className="py-24 px-4 bg-subtle border-y border-hairline" aria-label="How OpenMNC Delivers">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-brand-primary uppercase tracking-widest block mb-2 font-mono">
              How We Engineer Software
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink-primary mb-3 tracking-tight">
              Battle-Tested Engineering Lifecycle
            </h2>
            <p className="text-ink-secondary text-base font-sans leading-relaxed">
              Every system follows our structured 4-phase production roadmap to guarantee zero downtime and 100% code ownership:
            </p>
          </div>

          <EngineeringLifecycleFlow />
        </div>
      </section>

      {/* ══════ SECTION 5: GOOGLE REVIEWS SHOWCASE (SUBTLE BG) ══════ */}
      <section
        className="section-spacing bg-subtle border-b border-hairline"
        aria-label="Client feedback"
      >
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold mb-4 font-sans">
              <span>★ 5.0 Rated on Google Business Profile</span>
            </div>
            <h2 className="type-h2 mb-3">
              Trusted by Founders Worldwide
            </h2>
            <p className="type-lead mx-auto">
              Read real client impressions or scan our Google QR code to leave a review directly:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Review Card 1 */}
            <div className="p-7 rounded-card bg-surface border border-hairline flex flex-col justify-between shadow-sm">
              <div>
                <div className="text-amber-500 text-base mb-3">★★★★★</div>
                <blockquote className="type-body text-ink-secondary italic mb-4">
                  &ldquo;Our vibe-coded app had open Supabase keys and failing Stripe webhooks. OpenMNC audited every file, locked down our RLS, and got us live on the App Store in 10 days flat.&rdquo;
                </blockquote>
              </div>
              <div className="pt-4 border-t border-hairline flex items-center justify-between text-xs">
                <div>
                  <p className="font-heading font-semibold text-ink-primary">Verified Founder</p>
                  <p className="text-ink-muted font-sans">SaaS Startup (US)</p>
                </div>
                <span className="text-brand-primary font-mono text-[11px]">Google Review</span>
              </div>
            </div>

            {/* Review Card 2 */}
            <div className="p-7 rounded-card bg-surface border border-hairline flex flex-col justify-between shadow-sm">
              <div>
                <div className="text-amber-500 text-base mb-3">★★★★★</div>
                <blockquote className="type-body text-ink-secondary italic mb-4">
                  &ldquo;Apple rejected our app twice under Guideline 4.2. Amit and his team refactored our native wrappers, handled closed testing, and secured approval without stress.&rdquo;
                </blockquote>
              </div>
              <div className="pt-4 border-t border-hairline flex items-center justify-between text-xs">
                <div>
                  <p className="font-heading font-semibold text-ink-primary">Mobile App Creator</p>
                  <p className="text-ink-muted font-sans">FinTech Utility (UK)</p>
                </div>
                <span className="text-brand-primary font-mono text-[11px]">Google Review</span>
              </div>
            </div>

            {/* Google QR Card */}
            <div className="p-7 rounded-card bg-surface border border-amber-200 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-36 h-36 p-2 rounded-2xl bg-white border border-hairline shadow-sm mb-3 flex items-center justify-center">
                <img
                  src="/google-qr-framed.png"
                  alt="OPEN MNC Google QR code"
                  className="w-full h-auto object-contain"
                  onError={(e) => { e.target.src = '/google-qr-code.png' }}
                />
              </div>
              <span className="text-xs text-ink-secondary font-medium mb-3 font-sans">
                Scan with phone camera to review us
              </span>
              <button
                type="button"
                onClick={() => setReviewModalOpen(true)}
                className="w-full py-2.5 rounded-btn bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-sm font-sans"
              >
                Rate OPEN MNC on Google →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ SECTION 6: WHY US (CANVAS) ══════ */}
      <section
        className="section-spacing bg-canvas"
        aria-label="Why choose OpenMNC"
        id="why-openmnc"
      >
        <div className="section-container">
          <SectionHeader
            eyebrow="Why OpenMNC"
            title="Engineering First. No Agency Noise."
          />
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {WHY_US.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.15}>
                <div className="p-8 rounded-card bg-surface border border-hairline text-center group hover:border-brand-primary/40 transition-all duration-300 shadow-sm">
                  <div
                    className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-300"
                    aria-hidden="true"
                  >
                    {item.icon}
                  </div>
                  <h3 className="type-h3 mb-3 group-hover:text-brand-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="type-body text-ink-secondary text-sm">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ SECTION 7: BOTTOM CTA (WARM SUBTLE BG) ══════ */}
      <section
        className="relative py-24 px-4 overflow-hidden bg-subtle border-t border-hairline"
        aria-label="Call to action"
      >
        <div className="relative max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-ink-primary mb-4 tracking-tight leading-tight">
              Stop Fighting Broken Code. Ship With Senior Engineers.
            </h2>
            <p className="text-ink-secondary font-sans text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              Book a discovery call with founder Amit Barai. We sign an NDA, audit your requirements, and ship with speed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="w-full sm:w-auto px-8 py-3.5 rounded-btn bg-brand-primary hover:bg-brand-primary-hover text-white font-sans font-semibold text-base transition-all duration-200 shadow-[0_4px_20px_rgba(37,99,235,0.35)] text-center"
              >
                Book a Free Discovery Call →
              </Link>
              <a
                href={whatsappUrl('918509684056', 'Hi Amit! I want to discuss my app project.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 rounded-btn bg-surface hover:bg-white border border-hairline text-ink-primary font-sans font-medium text-base transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageSquare className="w-4 h-4 text-status-success" strokeWidth={1.5} aria-hidden="true" />
                <span>WhatsApp Chat</span>
              </a>
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
