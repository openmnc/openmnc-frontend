import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ServiceCard from '../components/ServiceCard.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import ScrollReveal from '../components/ScrollReveal.jsx'
import ThreeBackground from '../components/ThreeBackground.jsx'
import GlowButton from '../components/GlowButton.jsx'
import SEO from '../components/SEO.jsx'
import { servicesApi } from '../api/services.js'
import { getServiceIcon, whatsappUrl } from '../utils/helpers.js'
import {
  serviceSchema,
  studentGuidanceFaqSchema,
  b2bFaqSchema,
  courseSchema,
  aeoTechArticleSchema,
  dynamicFaqSchema,
} from '../utils/jsonld.js'

// Slug Aliases for Deep Linking and Dynamic Routing
const SLUG_ALIASES = {
  'custom-software': 'custom-development',
  'software-development': 'custom-development',
  'iot-development': 'industrial-training',
  'iot-engineering': 'industrial-training',
  'b2b-automation': 'business-automation',
  'ai-automation': 'business-automation',
  'academy': 'student-guidance',
  'training': 'industrial-training',
}

const STATIC_SERVICES = [
  {
    slug: 'business-automation',
    title: 'Enterprise AI Automation & Multi-Agent Workflows',
    tagline: 'Multiply revenue. Eliminate repetitive manual work across sectors.',
    icon: 'automation',
    category: 'B2B Enterprise',
    description:
      'We architect autonomous AI agents, enterprise LLM pipelines (OpenAI, Claude, Gemini), and custom business process automations (BPA) for FinTech, Healthcare, E-Commerce, Real Estate, and Manufacturing. Eliminate manual data entry, automate CRM lead routing, and run 24/7 autonomous operations.',
    problem_statement:
      'Businesses lose thousands of work-hours and revenue each month due to fragmented manual data entry, slow lead qualification, and unintegrated SaaS tools.',
    technical_solution:
      'OpenMNC architects custom autonomous AI multi-agent workflows, LLM pipelines, and event-driven automation directly into client CRMs and databases.',
    expected_outcome:
      '90% reduction in manual labor, 3x faster response times, and 24/7 autonomous operations without costly SaaS subscriptions.',
    features: [
      'Custom AI workflow & multi-agent system integration',
      'FinTech, HealthTech & E-Commerce process automation',
      'Enterprise LLM & RAG vector search pipelines',
      'WhatsApp & CRM autonomous lead qualification bots',
      'Zero-downtime reliability & revenue multiplication SLA',
      'Worldwide & domestic delivery with dedicated engineering',
    ],
    faqs: [
      {
        question: 'Can AI really automate my specific industry workflows?',
        answer: 'Yes, we build custom LLM wrappers, autonomous agent workflows, and webhook pipelines tailored to your proprietary data and tools.',
      },
      {
        question: 'How does OpenMNC protect client data privacy?',
        answer: 'We deploy dedicated on-premise or private-cloud inference pipelines with zero public training exposure and enterprise encryption.',
      },
    ],
    sub_services: [
      {
        slug: 'workflow-bots',
        title: 'Autonomous Multi-Agent Workflow Bots',
        tagline: 'Eliminate human coordination bottlenecks',
        problem_statement: 'Manual coordination across departments slows delivery and increases operational overhead.',
        technical_solution: 'LangChain and AutoGen multi-agent orchestrations triggering CRM, ERP, and payment webhooks.',
        expected_outcome: 'Instant task routing and 24/7 automated reconciliation with zero human delay.',
      },
    ],
    order: 1,
    is_active: true,
  },
  {
    slug: 'custom-development',
    title: 'Full-Cycle Software, SaaS & Mobile App Development',
    tagline: 'From visionary concept to high-scale production.',
    icon: 'development',
    category: 'B2B Enterprise',
    description:
      'Transforming ambitious ideas into scalable digital products with deep requirement engineering, modern full-stack architectures (React, Vite, Node, FastAPI, MongoDB), cloud DevOps, and App Store Optimization (ASO). We deliver enterprise-grade software for international startups and domestic market leaders.',
    problem_statement:
      'Companies need alternatives to AppMetrica/AppsFlyer for custom funnel tracking without recurring per-seat fees or data leaks.',
    technical_solution:
      'Custom-built tracking APIs, event ingestion pipelines, and full-stack software integrated directly into the client\'s cloud infrastructure.',
    expected_outcome:
      '100% data ownership with zero third-party subscription fees and microsecond analytics querying.',
    features: [
      'Deep architectural requirement analysis & UX design',
      'Full-stack web apps, SaaS platforms & mobile apps (iOS & Android)',
      'App Store Optimization (ASO) & algorithmic growth',
      'Cloud DevOps, CI/CD pipelines & high-concurrency scaling',
      'Comprehensive QA, security hardening & maintenance SLA',
      'Founder-friendly sprint delivery for global & domestic ventures',
    ],
    faqs: [
      {
        question: 'How long does custom software development take?',
        answer: 'Depends on scope, but we use agile sprints for fast MVP delivery, typically launching production-ready systems in 4 to 8 weeks.',
      },
      {
        question: 'Do you build alternative analytics and attribution systems?',
        answer: 'Yes, we build custom analytics & attribution tracking systems replacing AppMetrica or AppsFlyer with 100% private data ownership.',
      },
    ],
    sub_services: [
      {
        slug: 'analytics-tracking',
        title: 'Custom Analytics & Attribution Engine (AppMetrica / AppsFlyer Alternative)',
        tagline: '100% data ownership with zero third-party subscription fees',
        problem_statement: 'Companies need alternatives to AppMetrica/AppsFlyer for custom funnel tracking without exorbitant per-event pricing or external data sharing.',
        technical_solution: 'Custom-built tracking APIs, lightweight mobile SDKs, and event ingestion pipelines integrated directly into the client\'s infrastructure.',
        expected_outcome: '100% data ownership with zero third-party subscription fees and microsecond attribution query speeds.',
      },
      {
        slug: 'saas-platforms',
        title: 'Scalable SaaS & Cloud Web Platforms',
        tagline: 'Engineered for high concurrency and zero downtime',
        problem_statement: 'Legacy web applications crumble under sudden traffic spikes and unoptimized queries.',
        technical_solution: 'Distributed React, FastAPI, Node, and Redis architectures designed for horizontal scaling.',
        expected_outcome: 'Sub-second page speeds, seamless load balancing, and 99.99% operational uptime.',
      },
    ],
    order: 2,
    is_active: true,
  },
  {
    slug: 'inhouse-products',
    title: 'In-House Products & Games',
    tagline: 'Products we build, publish, and stand behind.',
    icon: 'development',
    category: 'B2B Enterprise',
    description:
      'OpenMNC develops and publishes proprietary custom software, mobile apps, and games on Google Play and Apple App Store. Flagship titles include Kibo VPN (privacy-first tool), Calorie AI (smart nutrition assistant), and CardSnap (digital networking).',
    problem_statement:
      'Users and businesses demand privacy-first tools and smart AI utilities without invasive trackers or exorbitant recurring prices.',
    technical_solution:
      'OpenMNC builds and publishes proprietary mobile utilities with edge-processed data and zero data-mining.',
    expected_outcome:
      'Over 50,000+ app downloads and production-hardened software IP.',
    features: [
      'Google Play & App Store published',
      'Kibo VPN — Privacy & security utility',
      'Calorie AI — Smart health tracker',
      'CardSnap — Intelligent business card tool',
      'Custom mobile games development',
      'Proprietary software innovation',
    ],
    faqs: [
      {
        question: 'Can OpenMNC develop white-label versions of in-house products?',
        answer: 'Yes, we license and customize our proprietary engines (VPN, AI vision, OCR) for enterprise white-label deployment.',
      },
    ],
    sub_services: [],
    order: 3,
    is_active: true,
  },
  {
    slug: 'social-media-management',
    title: 'Social Media Management & Organic Growth',
    tagline: 'Grow organically without heavy ad spend.',
    icon: 'social-media',
    category: 'B2B Enterprise',
    description:
      'High-ROI organic growth for local shops, bakeries, real estate, factories, and solopreneurs across Instagram, Facebook, and YouTube. We research your niche, algorithm-match keywords and hashtags, write viral scripts using our Hook → Engagement → Relativity → Reveal structure, and edit your raw video into polished content.',
    problem_statement:
      'Local businesses burn capital on expensive pay-per-click ads with zero long-term organic retention or audience trust.',
    technical_solution:
      'Algorithmic keyword optimization, high-retention video scripting (Hook → Engage → Reveal), and professional editing.',
    expected_outcome:
      'Up to 10x organic reach and authentic audience trust at a fraction of paid advertisement spend.',
    features: [
      'Instagram, Facebook & YouTube management',
      'Viral scripting (Hook → Engage → Reveal)',
      'Professional video editing & captions',
      'Relatable hashtag & keyword strategy',
      'Algorithm optimization for organic reach',
      'Fraction of ad spend with maximum trust',
    ],
    faqs: [
      {
        question: 'How soon do we see organic reach results?',
        answer: 'Clients typically experience noticeable engagement upticks within 3 to 4 weeks as the platform algorithm indexes relatable video hooks.',
      },
    ],
    sub_services: [],
    order: 4,
    is_active: true,
  },
  {
    slug: 'student-guidance',
    title: 'Student Guidance & College Admission Subsidies',
    tagline: '100% free career guidance. Direct ₹3,000–₹10,000 college fee discounts.',
    icon: 'student-guidance',
    category: 'B2C Academy',
    description:
      'We guide 12th-pass students in selecting the best accredited colleges and career streams based on genuine aptitude — 100% free of charge. Eligible students enrolling in our partner colleges receive an exclusive ₹3,000 to ₹10,000 institutional partnership subsidy directly discounted from college fees, with zero agent commission or hidden charges.',
    problem_statement:
      '12th-pass students and parents are misled by commission brokers into overpriced courses with low placement outcomes.',
    technical_solution:
      '100% free aptitude profiling, university accreditation audits, and industrial partnership fee scholarships.',
    expected_outcome:
      'Direct ₹3,000 to ₹10,000 college admission fee subsidy paid directly by OpenMNC as an industrial partner, with zero student fees.',
    features: [
      '100% free career counseling for 12th Science, Commerce & Arts',
      '₹3,000–₹10,000 direct partner college admission subsidy',
      'B.Tech (CSE, AI/ML, Robotics), BCA, BBA & Diploma roadmaps',
      'Aptitude-to-career alignment with top accredited universities',
      'Direct industrial internship pathway into OpenMNC tech projects',
      'Zero student charges, zero broker fees, complete transparency',
    ],
    faqs: [
      {
        question: 'Why is student career guidance 100% free?',
        answer: 'OpenMNC is an authorized industrial technology partner for accredited institutions. We bridge industry needs with student talent with zero broker fees.',
      },
      {
        question: 'How much subsidy or fee discount do students receive?',
        answer: 'Eligible students receive ₹3,000 to ₹10,000 directly discounted from college admission fees as an industrial subsidy.',
      },
    ],
    sub_services: [
      {
        slug: 'college-selection',
        title: 'Aptitude-Based College Selection',
        tagline: '100% free guidance for 12th pass students',
        problem_statement: 'Students choose colleges based on hearsay rather than faculty, labs, and genuine placement track record.',
        technical_solution: 'Detailed comparative analysis across accredited universities with transparent fee structures.',
        expected_outcome: 'Optimal college admission with guaranteed partner subsidy offset.',
      },
    ],
    order: 5,
    is_active: true,
  },
  {
    slug: 'industrial-training',
    title: 'Advanced Industrial Training',
    tagline: 'Real projects. High-end tech. 3 months.',
    icon: 'training',
    category: 'B2C Academy',
    description:
      'A comprehensive 3-month hands-on industrial training program tackling high-end tech: Robotics, Drones, and AI Smart Home assistants in IoT, plus modern Web and App Development. Affordable pricing at ₹3,000–₹7,000, with college partner subsidies directly offsettable or refundable.',
    problem_statement:
      'Engineering students graduate with only textbook knowledge and zero experience building production IoT hardware or AI cloud systems.',
    technical_solution:
      '3-month hands-on industrial sprints building live Robotics, Drones, IoT embedded firmware, and modern full-stack web applications.',
    expected_outcome:
      'Production-ready GitHub project portfolio, verifiable industrial training certificate, and priority hiring at OpenMNC.',
    features: [
      'Advanced IoT (Robotics, Drones, AI Smart Home)',
      'Modern Web & Application Development',
      '3-month real production project delivery',
      'Coding, hardware & logistics in one frame',
      '₹3,000–₹7,000 affordable pricing structure',
      'Partner subsidy offset / cashback option',
    ],
    faqs: [
      {
        question: 'Do you handle both hardware and software for IoT?',
        answer: 'Yes, we cover full-stack embedded engineering: ESP32/STM32 microcontrollers, sensor protocols, firmware, and cloud IoT dashboards.',
      },
      {
        question: 'Can the training fees be offset?',
        answer: 'Yes, our partner college subsidy allows eligible students to offset or claim refunds of ₹3,000 to ₹7,000 directly.',
      },
    ],
    sub_services: [
      {
        slug: 'custom-hardware',
        title: 'IoT & Embedded Engineering (Robotics, Drones, Firmware)',
        tagline: 'Full-stack embedded engineering to cloud dashboard',
        problem_statement: 'Engineering students lack hands-on experience with production IoT hardware and drone telemetry.',
        technical_solution: 'Full-stack embedded engineering to cloud dashboard with ESP32, sensor buses, firmware, and ROS.',
        expected_outcome: 'Production-ready IoT devices and verified hardware engineering skills.',
      },
    ],
    order: 6,
    is_active: true,
  },
]

export default function Services({ initialSlug }) {
  const params = useParams()
  const rawSlug = initialSlug || params.slug
  const subSlug = params.subSlug
  const resolvedSlug = rawSlug ? (SLUG_ALIASES[rawSlug.toLowerCase()] || rawSlug.toLowerCase()) : null

  const [services, setServices] = useState(STATIC_SERVICES)
  const [activeFaq, setActiveFaq] = useState(null)

  // 100% Dynamic CMS Fetch from FastAPI + MongoDB
  useEffect(() => {
    servicesApi.getAll().then((res) => {
      if (Array.isArray(res.data) && res.data.length > 0) {
        setServices(res.data.filter((s) => s.is_active !== false))
      }
    }).catch(() => {})
  }, [])

  // Auto-scroll to selected service slug if present in URL
  useEffect(() => {
    if (resolvedSlug) {
      const timer = setTimeout(() => {
        const el = document.getElementById(resolvedSlug)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [resolvedSlug, services])

  // Resolve current active service and active sub-service
  const currentService = resolvedSlug ? services.find((s) => s.slug === resolvedSlug) : null
  const subItem = currentService?.sub_services?.find((sub) => sub.slug === subSlug?.toLowerCase()) || null

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 2: ADVANCED SEO & PRECISE METADATA INJECTION
  // Dynamic rule: <title>{data.serviceName} | OpenMNC</title>
  // Description rule: Use problem_statement and technical_solution (150 chars)
  // ═══════════════════════════════════════════════════════════════════════════
  let seoTitle = 'Services & Solutions | OpenMNC'
  let seoDesc = 'Six specialized verticals engineered for global & domestic scaling — from enterprise AI multi-agent workflows to zero-fee student career empowerment.'
  let seoKeywords = 'OpenMNC services, AI automation company Kolkata, Custom software development India, IoT embedded engineering services, B2B AI integration, App development agency, Free student career guidance India, B.Tech industrial training Kolkata'
  let seoCanonical = '/services'

  if (subItem) {
    // Dynamic rule for deep-linked sub-service (e.g. Analytics Tracking or Custom Hardware)
    seoTitle = `${subItem.title} | OpenMNC`
    const problem = subItem.problem_statement || currentService?.problem_statement || ''
    const solution = subItem.technical_solution || currentService?.technical_solution || ''
    const combined = `${problem} ${solution}`.trim()
    seoDesc = combined ? combined.slice(0, 150) : (subItem.tagline || currentService?.description || '').slice(0, 150)
    seoCanonical = `/services/${rawSlug}/${subSlug}`
    seoKeywords = `${subItem.title}, ${rawSlug}, ${subSlug}, OpenMNC, custom software, AEO architecture`
  } else if (currentService) {
    // Dynamic rule: <title>{data.serviceName} | OpenMNC</title>
    seoTitle = `${currentService.title} | OpenMNC`
    const problem = currentService.problem_statement || ''
    const solution = currentService.technical_solution || ''
    const combined = `${problem} ${solution}`.trim()
    seoDesc = combined ? combined.slice(0, 150) : (currentService.description || currentService.tagline || '').slice(0, 150)
    seoCanonical = `/services/${currentService.slug}`
    seoKeywords = `${currentService.title}, OpenMNC, ${currentService.slug}, enterprise technology, AI automation, software engineering`
  }

  // JSON-LD AEO Schemas (TechArticle + Dynamic FAQPage)
  const dynamicSchemas = []
  if (subItem) {
    dynamicSchemas.push(aeoTechArticleSchema(subItem))
  } else if (currentService) {
    dynamicSchemas.push(aeoTechArticleSchema(currentService))
    dynamicSchemas.push(serviceSchema(currentService))
  }
  if (currentService?.faqs?.length > 0) {
    dynamicSchemas.push(dynamicFaqSchema(currentService.faqs))
  } else {
    dynamicSchemas.push(b2bFaqSchema)
    dynamicSchemas.push(studentGuidanceFaqSchema)
  }

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDesc}
        canonical={seoCanonical}
        keywords={seoKeywords}
        schema={dynamicSchemas}
      />

      {/* ══════ HERO SECTION (MOBILE-FIRST GLASSMORPHISM) ══════ */}
      <section
        className="relative pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 bg-navy-950 overflow-hidden"
        aria-label="Services hero"
      >
        {/* Fixed Aspect Ratio Glass Container for 3D Background preventing Layout Shifts on Mobile */}
        <div className="absolute inset-0 aspect-[16/9] sm:aspect-auto overflow-hidden pointer-events-none">
          <ThreeBackground section="hero" className="opacity-40" />
        </div>

        <div className="relative z-10 container-max text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-neon animate-pulse" />
            <span className="text-[11px] sm:text-xs text-white/90 font-semibold tracking-widest uppercase">
              {subItem
                ? `Specialized Deep-Link Solution`
                : currentService
                ? currentService.tagline || 'Specialized Vertical'
                : 'Enterprise & Educational Solutions'}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-6 tracking-tight leading-tight">
            {subItem ? (
              subItem.title
            ) : currentService ? (
              currentService.title
            ) : (
              <>
                Our <span className="gradient-text">Services</span>
              </>
            )}
          </h1>

          <p className="text-white/90 text-sm sm:text-lg max-w-3xl mx-auto leading-relaxed">
            {seoDesc}
          </p>

          {/* Quick Breadcrumb if on Deep Route */}
          {(currentService || subItem) && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-400">
              <Link to="/services" className="hover:text-cyan-neon underline">All Services</Link>
              <span>/</span>
              {currentService && (
                <Link to={`/services/${currentService.slug}`} className="hover:text-cyan-neon underline">
                  {currentService.title}
                </Link>
              )}
              {subItem && (
                <>
                  <span>/</span>
                  <span className="text-cyan-neon font-medium">{subItem.title}</span>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ══════ DEEP-LINK SPECIALIZED SPOTLIGHT (When /services/:slug/:subSlug is visited) ══════ */}
      {subItem && (
        <section className="bg-navy-950 px-4 py-8" aria-label="Deep-link solution details">
          <div className="container-max">
            <div className="glass-card p-6 sm:p-8 md:p-10 border border-cyan-neon/30 bg-white/10 backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-cyan-neon">
                    Authoritative Technical Architecture
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
                    {subItem.title}
                  </h2>
                  {subItem.tagline && (
                    <p className="text-gray-300 text-sm italic mt-1">{subItem.tagline}</p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <GlowButton
                    href={`/contact?intent=b2b&service=${resolvedSlug}&sub=${subItem.slug}`}
                    variant="primary"
                  >
                    Request Technical Proposal →
                  </GlowButton>
                </div>
              </div>

              {/* AEO Problem -> Solution -> Expected Outcome Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="p-5 rounded-xl bg-red-950/20 border border-red-500/20 backdrop-blur-md">
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider block mb-2">
                    🔴 The Problem
                  </span>
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                    {subItem.problem_statement || currentService?.problem_statement}
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-cyan-950/20 border border-cyan-neon/20 backdrop-blur-md">
                  <span className="text-xs font-bold text-cyan-neon uppercase tracking-wider block mb-2">
                    ⚡ The Technical Solution
                  </span>
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                    {subItem.technical_solution || currentService?.technical_solution}
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 backdrop-blur-md">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                    🎯 Expected Outcome
                  </span>
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                    {subItem.expected_outcome || currentService?.expected_outcome}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════ MAIN SERVICES CATALOG (MOBILE-FIRST GLASSMORPHISM) ══════ */}
      <main className="bg-navy-950 section-padding">
        <div className="container-max">
          <div className="space-y-16 sm:space-y-24">
            {services.map((service, i) => {
              const icon = getServiceIcon(service.icon, service.slug)
              const isEven = i % 2 === 0
              return (
                <article
                  key={service.slug}
                  id={service.slug}
                  className="scroll-mt-24"
                  aria-label={service.title}
                >
                  <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${isEven ? '' : 'lg:grid-flow-col-dense'}`}>
                    
                    {/* Text Details Side (7 columns) */}
                    <div className={`lg:col-span-7 ${isEven ? '' : 'lg:col-start-6'}`}>
                      <ScrollReveal direction={isEven ? 'left' : 'right'}>
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-3xl" aria-hidden="true">{icon}</span>
                            {service.category && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-cyan-neon/10 text-cyan-neon border border-cyan-neon/20">
                                {service.category}
                              </span>
                            )}
                          </div>

                          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
                            {service.title}
                          </h2>
                          {service.tagline && (
                            <p className="text-cyan-neon text-xs sm:text-sm font-semibold italic mb-4">
                              {service.tagline}
                            </p>
                          )}
                          <div className="w-12 h-1 bg-cyan-neon rounded-full mb-6" aria-hidden="true" />

                          <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
                            {service.description}
                          </p>

                          {/* AEO Problem -> Solution -> Outcome Glass Card */}
                          {(service.problem_statement || service.technical_solution || service.expected_outcome) && (
                            <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-sm space-y-3">
                              {service.problem_statement && (
                                <div className="text-xs sm:text-sm">
                                  <span className="font-bold text-red-400">Problem: </span>
                                  <span className="text-gray-300">{service.problem_statement}</span>
                                </div>
                              )}
                              {service.technical_solution && (
                                <div className="text-xs sm:text-sm">
                                  <span className="font-bold text-cyan-neon">Solution: </span>
                                  <span className="text-gray-300">{service.technical_solution}</span>
                                </div>
                              )}
                              {service.expected_outcome && (
                                <div className="text-xs sm:text-sm">
                                  <span className="font-bold text-emerald-400">Outcome: </span>
                                  <span className="text-gray-300">{service.expected_outcome}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Key Features List */}
                          {service.features && service.features.length > 0 && (
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6" aria-label={`${service.title} features`}>
                              {service.features.map((f, fi) => (
                                <li key={fi} className="flex items-start gap-2 text-xs sm:text-sm text-gray-300">
                                  <span className="text-cyan-neon mt-0.5 flex-shrink-0" aria-hidden="true">▸</span>
                                  <span>{f}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {/* Deep Link Sub-Services Chips */}
                          {service.sub_services && service.sub_services.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                              <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 block mb-2">
                                Deep-Dive Architectures &amp; Niche Solutions:
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {service.sub_services.map((sub) => (
                                  <Link
                                    key={sub.slug}
                                    to={`/services/${service.slug}/${sub.slug}`}
                                    className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-xs font-semibold text-white/90 hover:text-cyan-neon hover:border-cyan-neon/40 transition-all flex items-center gap-1.5 shadow-[0_8px_32px_0_rgba(31,38,135,0.2)]"
                                  >
                                    <span>🔍 {sub.title}</span>
                                    <span className="text-cyan-neon text-xs">→</span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Interactive Service FAQs Accordion */}
                          {service.faqs && service.faqs.length > 0 && (
                            <div className="mt-6 pt-4 border-t border-white/10">
                              <span className="text-xs font-bold uppercase tracking-wider text-cyan-neon block mb-3">
                                Frequently Asked Questions:
                              </span>
                              <div className="space-y-2">
                                {service.faqs.map((faq, fIdx) => {
                                  const faqId = `${service.slug}-faq-${fIdx}`
                                  const isOpen = activeFaq === faqId
                                  return (
                                    <div
                                      key={fIdx}
                                      className="rounded-xl bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden"
                                    >
                                      <button
                                        type="button"
                                        onClick={() => setActiveFaq(isOpen ? null : faqId)}
                                        className="w-full text-left px-3.5 py-2.5 flex items-center justify-between text-xs sm:text-sm font-semibold text-white/90 hover:text-cyan-neon"
                                      >
                                        <span>Q: {faq.question}</span>
                                        <span className="text-cyan-neon text-xs">{isOpen ? '−' : '+'}</span>
                                      </button>
                                      {isOpen && (
                                        <div className="px-3.5 pb-3 text-xs sm:text-sm text-gray-300 border-t border-white/5 pt-2">
                                          {faq.answer}
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </ScrollReveal>
                    </div>

                    {/* Visual Card Side (5 columns) with Exact Glassmorphism Formula */}
                    <div className={`lg:col-span-5 ${isEven ? '' : 'lg:col-start-1 lg:row-start-1'}`}>
                      <ScrollReveal direction={isEven ? 'right' : 'left'} delay={0.1}>
                        <div className="glass-card p-6 sm:p-8 md:p-10 relative overflow-hidden group hover:border-cyan-neon/40 transition-all duration-300">
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-neon/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
                          <div className="text-5xl sm:text-6xl mb-6 text-center" aria-hidden="true">{icon}</div>
                          
                          <h3 className="font-display text-center text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-cyan-neon transition-colors">
                            {service.title}
                          </h3>
                          <p className="text-center text-gray-300 text-xs sm:text-sm italic mb-6">
                            {service.tagline}
                          </p>

                          <div className="space-y-3 pt-4 border-t border-white/10 text-center">
                            <Link
                              to={`/contact?intent=${service.category?.includes('Academy') ? 'student' : 'b2b'}&service=${service.slug}`}
                              className="w-full block py-2.5 rounded-xl bg-cyan-neon text-navy-950 font-bold text-xs sm:text-sm shadow-cyan-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                              Consult on this Solution →
                            </Link>

                            <a
                              href={whatsappUrl(
                                '918509684056',
                                `Hi OpenMNC! I want to enquire about ${service.title} (${service.slug}).`
                              )}
                              className="w-full block py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/90 text-xs font-medium transition-all"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              💬 WhatsApp Instant Inquiry
                            </a>
                          </div>
                        </div>
                      </ScrollReveal>
                    </div>

                  </div>
                </article>
              )
            })}
          </div>

          {/* ══════ INDUSTRY SECTORS WE TRANSFORM ══════ */}
          <section className="mt-24 sm:mt-28 border-t border-white/10 pt-16 sm:pt-20" aria-label="Industry sectors we serve">
            <SectionHeader
              eyebrow="Sector-Specific Solutions"
              title="Industry Verticals We Empower with AI"
              subtitle="Tailored automation and high-concurrency software built for the exact demands of modern industries."
            />
            <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: '💳',
                  sector: 'FinTech & Financial Services',
                  desc: 'Automated invoice reconciliation, KYC verification pipelines, fraud anomaly alerts, and conversational banking assistants.',
                  tags: ['Invoice Automation', 'KYC Verification', 'Fraud AI'],
                },
                {
                  icon: '🏥',
                  sector: 'Healthcare & Life Sciences',
                  desc: 'HIPAA-compliant LLM clinical documentation summaries, 24/7 patient triage booking bots, and diagnostic report routing.',
                  tags: ['Clinical Summaries', 'Patient Triage', 'HIPAA Bots'],
                },
                {
                  icon: '🛍️',
                  sector: 'E-Commerce & D2C Brands',
                  desc: 'Autonomous customer support agents, dynamic catalog SEO descriptions, and predictive inventory restock notifications.',
                  tags: ['24/7 Support Bots', 'Catalog SEO', 'Inventory AI'],
                },
                {
                  icon: '🏢',
                  sector: 'Real Estate & PropTech',
                  desc: 'WhatsApp AI lead qualification agents, automated CRM updates, and interactive 24/7 site-visit scheduling workflows.',
                  tags: ['WhatsApp Lead AI', 'CRM Sync', 'Visit Booking'],
                },
                {
                  icon: '⚙️',
                  sector: 'Manufacturing & Industrial IoT',
                  desc: 'Microcontroller telemetry, predictive equipment maintenance sensors, and automated drone warehouse inspection.',
                  tags: ['Predictive Maintenance', 'IoT Telemetry', 'Drone AI'],
                },
                {
                  icon: '🎓',
                  sector: 'Education & EdTech',
                  desc: '100% Free career guidance, algorithmic college matching, and direct ₹3,000–₹10,000 institutional admission fee subsidies.',
                  tags: ['Free Counseling', '₹3k-₹10k Subsidy', 'College Roadmaps'],
                },
              ].map((item, idx) => (
                <ScrollReveal key={item.sector} delay={idx * 0.08}>
                  <div className="glass-card p-6 h-full flex flex-col justify-between hover:border-cyan-neon/40 transition-all duration-300">
                    <div>
                      <span className="text-3xl mb-3 block" aria-hidden="true">{item.icon}</span>
                      <h3 className="font-display text-lg font-bold text-white mb-2">{item.sector}</h3>
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4">{item.desc}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/10">
                      {item.tags.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 text-cyan-neon border border-cyan-neon/20">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* ══════ ENTERPRISE B2B FAQ SECTION ══════ */}
          <section className="mt-24 sm:mt-28 border-t border-white/10 pt-16 sm:pt-20" aria-label="Enterprise B2B FAQs" id="b2b-faq">
            <SectionHeader
              eyebrow="Enterprise Client Inquiries"
              title="Enterprise Tech &amp; AI Automation FAQ"
              subtitle="Straight answers on delivery velocity, custom AI models, and full-stack hardware/software capabilities."
            />
            <div className="mt-10 sm:mt-12 max-w-4xl mx-auto space-y-4 sm:space-y-6">
              {[
                {
                  q: 'How long does custom software development take?',
                  a: 'Delivery timelines depend on scope, but we operate in rapid agile sprints for fast MVP delivery. We typically deliver a production-ready MVP in 3 to 6 weeks, followed by bi-weekly releases and continuous monitoring.',
                },
                {
                  q: 'Can AI really automate my specific industry workflows?',
                  a: 'Yes. We do not use generic chatbots. We build custom LLM wrappers, autonomous multi-agent pipelines, and proprietary workflow bots connected directly to your private databases, CRM, and internal APIs.',
                },
                {
                  q: 'Do you handle both hardware and software for IoT solutions?',
                  a: 'Yes, we provide true full-stack embedded engineering: from microcontrollers (ESP32, Raspberry Pi, STM32) and drone telemetry to cloud data pipelines, analytics, and mobile dashboards.',
                },
              ].map((faq, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <div className="glass-card p-5 sm:p-7 border border-white/15 hover:border-cyan-neon/40 transition-all">
                    <h3 className="font-display text-base sm:text-lg font-bold text-white mb-2 flex items-start gap-2.5">
                      <span className="text-cyan-neon">Q.</span>
                      <span>{faq.q}</span>
                    </h3>
                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed pl-6">
                      {faq.a}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* ══════ STUDENT GUIDANCE & COLLEGE ADMISSION SUBSIDY FAQ ══════ */}
          <section className="mt-24 sm:mt-28 border-t border-white/10 pt-16 sm:pt-20" aria-label="Student guidance and college subsidy FAQs" id="student-faq">
            <SectionHeader
              eyebrow="OpenMNC Academy &amp; Student Wing"
              title="College Admission Guidance &amp; Training FAQ"
              subtitle="Transparent answers for students and parents regarding college fee subsidies, real project internships, and certifications."
            />
            <div className="mt-10 sm:mt-12 max-w-4xl mx-auto space-y-4 sm:space-y-6">
              {[
                {
                  q: 'Are the internships paid or do I have to pay for industrial training?',
                  a: 'We strictly separate our tracks: our 3-month hands-on Industrial Training program covers Robotics, IoT, and AI development with an affordable subsidized fee (₹3,000–₹7,000), which can be offset or refunded via college partner subsidies. Selective direct engineering interns for company development roles receive monthly stipends of ₹5,000 to ₹10,000.',
                },
                {
                  q: 'Will I work on real company projects?',
                  a: 'Yes! Students work directly on live production OpenMNC tech components, autonomous AI agent pipelines, and real microcontroller hardware (ESP32, Raspberry Pi, robotics) rather than outdated textbook slides.',
                },
                {
                  q: 'Do I get a certificate after the industrial training?',
                  a: 'Yes, every student who completes deliverables receives an authorized, industry-recognized Industrial Training Completion Certificate, and top performers receive Letters of Recommendation (LOR) and Pre-Placement Offer (PPO) opportunities.',
                },
                {
                  q: 'How can 12th pass students claim the ₹3,000–₹10,000 college admission fee subsidy?',
                  a: 'OpenMNC LLP acts as an official industrial technology training partner for accredited colleges and universities across West Bengal and India. Because we train students directly on industrial projects, our partner colleges authorize an official institutional grant or admission subsidy of ₹3,000 to ₹10,000 deducted directly from the student’s college fees.',
                },
                {
                  q: 'Is OpenMNC career counseling really 100% free with no hidden charges?',
                  a: 'Yes, 100% free. We never charge students or parents a single rupee for counseling, aptitude assessments, or college recommendations. Unlike traditional education brokers who charge high commissions, OpenMNC earns from industrial engineering and training partnerships — passing the savings directly to students.',
                },
              ].map((faq, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <div className="glass-card p-5 sm:p-7 border border-white/15 hover:border-cyan-neon/40 transition-all">
                    <h3 className="font-display text-base sm:text-lg font-bold text-white mb-2 flex items-start gap-2.5">
                      <span className="text-cyan-neon">Q.</span>
                      <span>{faq.q}</span>
                    </h3>
                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed pl-6">
                      {faq.a}
                    </p>
                  </div>
                </ScrollReveal>
              ))}

              <div className="mt-10 text-center glass-card p-6 sm:p-8 border border-cyan-neon/30 bg-cyan-neon/5">
                <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-2">Ready to Plan Your Career or Claim Your Subsidy?</h3>
                <p className="text-gray-300 text-xs sm:text-sm max-w-xl mx-auto mb-6">
                  Consult directly with our academic advisors and lock in your ₹3,000–₹10,000 college partnership discount today.
                </p>
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                  <GlowButton to="/contact?intent=student&service=student-guidance" variant="primary">
                    Claim Free Student Guidance →
                  </GlowButton>
                  <GlowButton
                    href={whatsappUrl('918509684056', 'Hi OpenMNC! I passed 12th and want free college admission guidance and the partner fee subsidy.')}
                    variant="outline"
                  >
                    💬 WhatsApp Counselor
                  </GlowButton>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
