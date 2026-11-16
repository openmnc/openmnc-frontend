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
import { serviceSchema, studentGuidanceFaqSchema, b2bFaqSchema, courseSchema } from '../utils/jsonld.js'

const STATIC_SERVICES = [
  {
    slug: 'business-automation',
    title: 'Enterprise AI Automation & Multi-Agent Workflows',
    tagline: 'Multiply revenue. Eliminate repetitive manual work across sectors.',
    icon: 'automation',
    description:
      'We architect autonomous AI agents, enterprise LLM pipelines (OpenAI, Claude, Gemini), and custom business process automations (BPA) for FinTech, Healthcare, E-Commerce, Real Estate, and Manufacturing. Eliminate manual data entry, automate CRM lead routing, and run 24/7 autonomous operations.',
    features: [
      'Custom AI workflow & multi-agent system integration',
      'FinTech, HealthTech & E-Commerce process automation',
      'Enterprise LLM & RAG vector search pipelines',
      'WhatsApp & CRM autonomous lead qualification bots',
      'Zero-downtime reliability & revenue multiplication SLA',
      'Worldwide & domestic delivery with dedicated engineering',
    ],
  },
  {
    slug: 'custom-development',
    title: 'Full-Cycle Software, SaaS & Mobile App Development',
    tagline: 'From visionary concept to high-scale production.',
    icon: 'code',
    description:
      'Transforming ambitious ideas into scalable digital products with deep requirement engineering, modern full-stack architectures (React, Vite, Node, FastAPI, MongoDB), cloud DevOps, and App Store Optimization (ASO). We deliver enterprise-grade software for international startups and domestic market leaders.',
    features: [
      'Deep architectural requirement analysis & UX design',
      'Full-stack web apps, SaaS platforms & mobile apps (iOS & Android)',
      'App Store Optimization (ASO) & algorithmic growth',
      'Cloud DevOps, CI/CD pipelines & high-concurrency scaling',
      'Comprehensive QA, security hardening & maintenance SLA',
      'Founder-friendly sprint delivery for global & domestic ventures',
    ],
  },
  {
    slug: 'inhouse-products',
    title: 'In-House Products & Games',
    tagline: 'Products we build, publish, and stand behind.',
    icon: 'apps',
    description:
      'OpenMNC develops and publishes proprietary custom software, mobile apps, and games on Google Play and Apple App Store. Flagship titles include Kibo VPN (privacy-first tool), Calorie AI (smart nutrition assistant), and CardSnap (digital networking).',
    features: [
      'Google Play & App Store published',
      'Kibo VPN — Privacy & security utility',
      'Calorie AI — Smart health tracker',
      'CardSnap — Intelligent business card tool',
      'Custom mobile games development',
      'Proprietary software innovation',
    ],
  },
  {
    slug: 'social-media-management',
    title: 'Social Media Management & Organic Growth',
    tagline: 'Grow organically without heavy ad spend.',
    icon: 'social',
    description:
      'High-ROI organic growth for local shops, bakeries, real estate, factories, and solopreneurs across Instagram, Facebook, and YouTube. We research your niche, algorithm-match keywords and hashtags, write viral scripts using our Hook → Engagement → Relativity → Reveal structure, and edit your raw video into polished content.',
    features: [
      'Instagram, Facebook & YouTube management',
      'Viral scripting (Hook → Engage → Reveal)',
      'Professional video editing & captions',
      'Relatable hashtag & keyword strategy',
      'Algorithm optimization for organic reach',
      'Fraction of ad spend with maximum trust',
    ],
  },
  {
    slug: 'student-guidance',
    title: 'Student Guidance & College Admission Subsidies',
    tagline: '100% free career guidance. Direct ₹3,000–₹10,000 college fee discounts.',
    icon: 'education',
    description:
      'We guide 12th-pass students in selecting the best accredited colleges and career streams based on genuine aptitude — 100% free of charge. Eligible students enrolling in our partner colleges receive an exclusive ₹3,000 to ₹10,000 institutional partnership subsidy directly discounted from college fees, with zero agent commission or hidden charges.',
    features: [
      '100% free career counseling for 12th Science, Commerce & Arts',
      '₹3,000–₹10,000 direct partner college admission subsidy',
      'B.Tech (CSE, AI/ML, Robotics), BCA, BBA & Diploma roadmaps',
      'Aptitude-to-career alignment with top accredited universities',
      'Direct industrial internship pathway into OpenMNC tech projects',
      'Zero student charges, zero broker fees, complete transparency',
    ],
  },
  {
    slug: 'industrial-training',
    title: 'Advanced Industrial Training',
    tagline: 'Real projects. High-end tech. 3 months.',
    icon: 'training',
    description:
      'A comprehensive 3-month hands-on industrial training program tackling high-end tech: Robotics, Drones, and AI Smart Home assistants in IoT, plus modern Web and App Development. Affordable pricing at ₹3,000–₹7,000, with college partner subsidies directly offsettable or refundable.',
    features: [
      'Advanced IoT (Robotics, Drones, AI Smart Home)',
      'Modern Web & Application Development',
      '3-month real production project delivery',
      'Coding, hardware & logistics in one frame',
      '₹3,000–₹7,000 affordable pricing structure',
      'Partner subsidy offset / cashback option',
    ],
  },
]

export default function Services({ initialSlug }) {
  const params = useParams()
  const slug = initialSlug || params.slug
  const [services, setServices] = useState(STATIC_SERVICES)

  useEffect(() => {
    servicesApi.getAll().then((res) => {
      if (Array.isArray(res.data) && res.data.length > 0) {
        setServices(res.data.filter((s) => s.is_active !== false))
      }
    }).catch(() => {})
  }, [])

  // Auto-scroll to selected service slug if present in URL
  useEffect(() => {
    if (slug) {
      const timer = setTimeout(() => {
        const el = document.getElementById(slug)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [slug, services])

  const currentService = slug ? services.find((s) => s.slug === slug) : null

  let seoTitle = 'Enterprise B2B Tech Services & OpenMNC Academy | OpenMNC LLP'
  let seoDesc = 'Explore OpenMNC services: AI Business Automation, Custom Software Development, In-House Products, Free Student Guidance, and Industrial Training.'
  let seoKeywords = 'AI automation company Kolkata, Custom software development India, IoT embedded engineering services, B2B AI integration, App development agency, Free student career guidance India, B.Tech industrial training Kolkata'
  let seoSchema = [b2bFaqSchema, studentGuidanceFaqSchema]

  if (currentService) {
    if (slug === 'business-automation') {
      seoTitle = 'AI Automation Company Kolkata & Enterprise Workflows | OpenMNC'
      seoDesc = 'OpenMNC provides enterprise AI automation, autonomous multi-agent pipelines, and LLM workflow integrations for FinTech, Healthcare, and E-commerce.'
      seoKeywords = 'AI automation company Kolkata, B2B AI integration, enterprise AI workflows, autonomous AI agents, business process automation, LLM workflows'
      seoSchema = [serviceSchema(currentService), b2bFaqSchema]
    } else if (slug === 'custom-development') {
      seoTitle = 'Custom Software Development India & Mobile App Agency | OpenMNC'
      seoDesc = 'Full-cycle custom software development, modern SaaS platforms, iOS/Android mobile applications, and App Store Optimization (ASO) by OpenMNC LLP.'
      seoKeywords = 'Custom software development India, App development agency, SaaS engineering, mobile app development, React FastAPI developers'
      seoSchema = [serviceSchema(currentService), b2bFaqSchema]
    } else if (slug === 'industrial-training') {
      seoTitle = 'B.Tech Industrial Training Kolkata & Live IoT Engineering | OpenMNC'
      seoDesc = '3-Month comprehensive industrial training in Advanced IoT, Robotics, Drones, and Full-Stack AI engineering on live OpenMNC production components.'
      seoKeywords = 'B.Tech industrial training Kolkata, IoT embedded engineering services, engineering internships with live projects, robotics training Kolkata'
      seoSchema = [serviceSchema(currentService), courseSchema, studentGuidanceFaqSchema]
    } else if (slug === 'student-guidance') {
      seoTitle = 'Free Student Career Guidance India & College Subsidies | OpenMNC Academy'
      seoDesc = '100% Free career guidance for 12th pass students. Claim ₹3,000 to ₹10,000 in official college admission fee subsidies for B.Tech, BCA, and BBA programs.'
      seoKeywords = 'Free student career guidance India, college admission subsidy, best colleges after 12th pass, btech admission scholarship, career roadmap'
      seoSchema = [serviceSchema(currentService), studentGuidanceFaqSchema]
    } else if (slug === 'inhouse-products') {
      seoTitle = 'In-House Products & Mobile Apps (Kibo VPN, Calorie AI) | OpenMNC'
      seoDesc = 'Proprietary custom software, digital tools, and mobile apps built and published by OpenMNC LLP on Google Play and Apple App Store.'
      seoKeywords = 'Kibo VPN, Calorie AI, CardSnap, in-house mobile apps, proprietary software innovation'
      seoSchema = serviceSchema(currentService)
    } else if (slug === 'social-media-management') {
      seoTitle = 'Social Media Management & Organic Growth Marketing | OpenMNC'
      seoDesc = 'High-ROI organic growth marketing, video scriptwriting, and algorithm-matched content production for businesses and solopreneurs.'
      seoKeywords = 'social media management, organic growth, video editing, algorithm boost, viral marketing'
      seoSchema = serviceSchema(currentService)
    } else {
      seoTitle = `${currentService.title} | OpenMNC Enterprise Solutions`
      seoDesc = currentService.description || currentService.tagline
      seoKeywords = `OpenMNC ${currentService.title}, enterprise AI automation, custom software development, ${currentService.slug}`
      seoSchema = serviceSchema(currentService)
    }
  }

  const seoCanonical = slug ? `/services/${slug}` : '/services'

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDesc}
        canonical={seoCanonical}
        keywords={seoKeywords}
        schema={seoSchema}
      />

      {/* Page Hero */}
      <section
        className="relative pt-32 pb-20 px-4 bg-navy-950 overflow-hidden"
        aria-label="Services hero"
      >
        <ThreeBackground section="hero" className="opacity-40" />
        <div className="relative z-10 container-max text-center">
          <span className="text-xs text-cyan-neon font-semibold tracking-widest uppercase mb-4 block">
            {currentService ? currentService.tagline || 'Specialized Solution' : 'Enterprise & Educational Solutions'}
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
            {currentService ? currentService.title : <>Our <span className="gradient-text">Services</span></>}
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
            {currentService
              ? currentService.description
              : 'Six specialized verticals engineered for global & domestic scaling — from enterprise AI multi-agent workflows to zero-fee student career empowerment.'}
          </p>
        </div>
      </section>

      {/* Services List */}
      <main className="bg-navy-950 section-padding">
        <div className="container-max">
          <div className="space-y-20">
            {services.map((service, i) => {
            const icon = getServiceIcon(service.icon, service.slug)
            const isEven = i % 2 === 0
            return (
              <article
                key={service.slug}
                id={service.slug}
                className="scroll-mt-20"
                aria-label={service.title}
              >
                <div className={`grid lg:grid-cols-2 gap-12 items-center ${isEven ? '' : 'lg:grid-flow-col-dense'}`}>
                  {/* Text side */}
                  <ScrollReveal direction={isEven ? 'left' : 'right'} className={isEven ? '' : 'lg:col-start-2'}>
                    <div>
                      <span className="text-3xl mb-4 inline-block" aria-hidden="true">{icon}</span>
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
                        {service.title}
                      </h2>
                      {service.tagline && (
                        <p className="text-cyan-neon text-sm font-semibold italic mb-4">{service.tagline}</p>
                      )}
                      <div className="w-12 h-1 bg-cyan-neon rounded-full mb-6" aria-hidden="true" />
                      <p className="text-gray-400 leading-relaxed mb-8">
                        {service.description || `Professional ${service.title} services tailored to your business needs.`}
                      </p>
                      {service.features && service.features.length > 0 && (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3" aria-label={`${service.title} features`}>
                          {service.features.map((f, fi) => (
                            <li key={fi} className="flex items-start gap-2 text-sm text-gray-300">
                              <span className="text-cyan-neon mt-0.5 flex-shrink-0" aria-hidden="true">▸</span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </ScrollReveal>

                  {/* Visual card side */}
                  <ScrollReveal direction={isEven ? 'right' : 'left'} delay={0.1} className={isEven ? '' : 'lg:col-start-1 lg:row-start-1'}>
                    <div className="glass-card p-10 relative overflow-hidden group hover:border-cyan-neon/30 transition-all duration-300 hover:shadow-cyan-glow">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-neon/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
                      <div className="text-6xl mb-6 text-center" aria-hidden="true">{icon}</div>
                      <h3 className="font-display text-center text-lg font-bold text-white mb-2 group-hover:text-cyan-neon transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-center text-gray-500 text-sm italic">{service.tagline}</p>
                      <div className="mt-6 pt-6 border-t border-white/5 text-center">
                        <a
                          href="mailto:hello@openmnc.com"
                          className="text-sm text-cyan-neon hover:underline"
                          aria-label={`Enquire about ${service.title}`}
                        >
                          Enquire about this service →
                        </a>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
              </article>
            )
          })}
        </div>

        {/* ══════ INDUSTRY SECTORS WE TRANSFORM ══════ */}
        <section className="mt-28 border-t border-white/5 pt-20" aria-label="Industry sectors we serve">
          <SectionHeader
            eyebrow="Sector-Specific Solutions"
            title="Industry Verticals We Empower with AI"
            subtitle="Tailored automation and high-concurrency software built for the exact demands of modern industries."
          />
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div className="glass-card p-6 h-full flex flex-col justify-between hover:border-cyan-neon/30 transition-all duration-300">
                  <div>
                    <span className="text-3xl mb-3 block" aria-hidden="true">{item.icon}</span>
                    <h3 className="font-display text-lg font-bold text-white mb-2">{item.sector}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4">{item.desc}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
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
        <section className="mt-28 border-t border-white/5 pt-20" aria-label="Enterprise B2B FAQs" id="b2b-faq">
          <SectionHeader
            eyebrow="Enterprise Client Inquiries"
            title="Enterprise Tech &amp; AI Automation FAQ"
            subtitle="Straight answers on delivery velocity, custom AI models, and full-stack hardware/software capabilities."
          />
          <div className="mt-12 max-w-4xl mx-auto space-y-6">
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
                <div className="glass-card p-6 sm:p-7 border border-white/5 hover:border-cyan-neon/30 transition-all">
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
        <section className="mt-28 border-t border-white/5 pt-20" aria-label="Student guidance and college subsidy FAQs" id="student-faq">
          <SectionHeader
            eyebrow="OpenMNC Academy &amp; Student Wing"
            title="College Admission Guidance &amp; Training FAQ"
            subtitle="Transparent answers for students and parents regarding college fee subsidies, real project internships, and certifications."
          />
          <div className="mt-12 max-w-4xl mx-auto space-y-6">
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
                <div className="glass-card p-6 sm:p-7 border border-white/5 hover:border-cyan-neon/30 transition-all">
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

            <div className="mt-10 text-center glass-card p-8 border border-cyan-neon/20 bg-cyan-neon/5">
              <h3 className="font-display text-xl font-bold text-white mb-2">Ready to Plan Your Career or Claim Your Subsidy?</h3>
              <p className="text-gray-300 text-sm max-w-xl mx-auto mb-6">
                Consult directly with our academic advisors and lock in your ₹3,000–₹10,000 college partnership discount today.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <GlowButton to="/contact?intent=student&service=student-guidance" variant="primary">
                  Claim Free Student Guidance →
                </GlowButton>
                <GlowButton
                  href={whatsappUrl('918509684056', 'Hi OpenMNC! I passed 12th and want free college admission guidance and the partner fee subsidy.')}
                  variant="outline"
                >
                  💬 Chat with Counselor on WhatsApp
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
