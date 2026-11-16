import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ThreeBackground from '../components/ThreeBackground.jsx'
import ServiceCard from '../components/ServiceCard.jsx'
import StatCounter from '../components/StatCounter.jsx'
import ScrollReveal from '../components/ScrollReveal.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import GlowButton from '../components/GlowButton.jsx'
import SEO from '../components/SEO.jsx'
import { servicesApi } from '../api/services.js'
import { settingsApi } from '../api/settings.js'
import { whatsappUrl } from '../utils/helpers.js'
import { localBusinessSchema } from '../utils/jsonld.js'

// Static fallback data matching OpenMNC LLP's core verticals
const DEFAULT_SERVICES = [
  {
    slug: 'business-automation',
    title: 'Business Automation & AI Integration',
    tagline: 'Multiply revenue. Eliminate repetitive manual work.',
    icon: 'automation',
    features: ['Custom AI workflow automation', 'Revenue multiplication strategies', 'Reliability & zero time-waste operations'],
  },
  {
    slug: 'custom-development',
    title: 'Custom App & Software Development',
    tagline: 'From your visionary idea to reality.',
    icon: 'code',
    features: ['Deep requirement understanding', 'Full-cycle engineering & QA', 'App Store Optimization (ASO) & marketing'],
  },
  {
    slug: 'inhouse-products',
    title: 'In-House Products & Games',
    tagline: 'Products we build, publish, and stand behind.',
    icon: 'apps',
    features: ['Kibo VPN, Calorie AI & CardSnap', 'Published on Google Play & App Store', 'Custom software & game development'],
  },
  {
    slug: 'social-media-management',
    title: 'Social Media Management & Organic Growth',
    tagline: 'High-ROI organic growth without heavy ad spend.',
    icon: 'social',
    features: ['High-retention scripting (Hook → Engage → Reveal)', 'Video editing, hashtags & algorithm boost', 'Instagram, Facebook & YouTube management'],
  },
  {
    slug: 'student-guidance',
    title: 'Student Guidance & EdTech Engine',
    tagline: '100% free career guidance. Real college savings.',
    icon: 'education',
    features: ['100% free consultation for 12th-pass students', '₹3,000–₹10,000 partner college subsidies', 'Career alignment & zero student charges'],
  },
  {
    slug: 'industrial-training',
    title: 'Advanced Industrial Training',
    tagline: 'Real-world projects. High-end tech. 3 months.',
    icon: 'training',
    features: ['Advanced IoT (Robotics, Drones, AI Smart Home)', 'Web & Application development tracks', '₹3,000–₹7,000 pricing with subsidy offset'],
  },
]

const STATS = [
  { value: '6+', label: 'Services Offered' },
  { value: '100%', label: 'Free Student Guidance' },
  { value: '3', label: 'Month Training Program', suffix: ' mo' },
  { value: '12+', label: 'Partner Colleges' },
]

const WHY_US = [
  {
    icon: '🤖',
    title: 'AI-First Thinking',
    desc: 'Every solution we design starts with the question: how can AI make this 10x better? We embed intelligence into your workflows from day one.',
  },
  {
    icon: '🎓',
    title: 'Zero Cost for Students',
    desc: 'We believe talent should not be limited by finances. Career guidance, resume reviews, and mentorship are completely free for students.',
  },
  {
    icon: '🔄',
    title: 'Full-Cycle Support',
    desc: 'From ideation and design to development, launch, and beyond — we stay with you at every stage of your product journey.',
  },
]

const PROCESS = [
  { step: '01', title: 'Understand', desc: 'We deep-dive into your idea, goals, and challenges before writing a single line of code.' },
  { step: '02', title: 'Design', desc: 'Architecture, UX wireframes, and AI integration strategy are planned for maximum impact.' },
  { step: '03', title: 'Build', desc: 'Agile development sprints with regular demos. You always know what is happening.' },
  { step: '04', title: 'Launch', desc: 'Deployment, SEO, app store submission, and ongoing monitoring — handled end to end.' },
]

export default function Home() {
  const [services, setServices] = useState(DEFAULT_SERVICES)
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch services and settings in parallel, fall back gracefully
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

  const heroHeadline = settings?.hero_headline || 'Transform Your Business with AI-Powered Solutions'
  const heroSubline = settings?.hero_subline || 'OpenMNC LLP builds intelligent automation, custom software, and future-ready digital products — plus free career guidance for students across India.'

  return (
    <>
      <SEO
        title="OpenMNC LLP — Global AI Automation, Custom Software & Enterprise Solutions"
        description="OpenMNC LLP is a global technology and AI automation company headquartered in West Bengal, India. We architect custom AI agents, automated enterprise workflows, web & mobile applications, and student career guidance for worldwide and domestic sectors."
        canonical="/"
        keywords="OpenMNC, Open MNC, OpenMNC LLP, global AI automation company, enterprise AI workflows, LLM integration, custom software development, SaaS engineering, FinTech AI automation, Healthcare AI bots, E-commerce automation, best colleges after 12th, free student career guidance, college admission discount subsidy, industrial training IoT robotics, tech company West Bengal India, Amit Barai"
        schema={localBusinessSchema}
      />

      {/* ══════ HERO SECTION ══════ */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient"
        aria-label="Hero — Welcome to OpenMNC LLP"
      >
        {/* 3D Background */}
        <ThreeBackground section="hero" />

        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-950/20 to-navy-950 pointer-events-none" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-radial from-cyan-neon/5 via-transparent to-transparent pointer-events-none" aria-hidden="true" />

        {/* Hero content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 text-xs font-semibold tracking-wider uppercase mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" aria-hidden="true" />
            Global AI &amp; Enterprise Software · Worldwide &amp; Domestic · HQ West Bengal, India
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.12] tracking-tight mb-6"
          >
            <span className="text-white">{heroHeadline.split(' ').slice(0, 3).join(' ')}</span>
            {' '}
            <span className="gradient-text">{heroHeadline.split(' ').slice(3).join(' ')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-slate-300 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto mb-10 font-normal"
          >
            {heroSubline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <GlowButton to="/services" variant="primary" className="text-base px-8 py-4">
              Explore Services →
            </GlowButton>
            <GlowButton
              href={whatsappUrl('918509684056', 'Hi OpenMNC! I would like a free consultation.')}
              variant="outline"
              className="text-base px-8 py-4"
            >
              💬 Get Free Consultation
            </GlowButton>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-16 flex flex-col items-center gap-2 text-gray-500"
            aria-hidden="true"
          >
            <span className="text-xs tracking-widest uppercase">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-5 h-5 border-b-2 border-r-2 border-gray-500 rotate-45"
            />
          </motion.div>
        </div>
      </section>

      {/* ══════ STATS BAR ══════ */}
      <section
        className="py-16 px-4 bg-navy-900 border-y border-white/5"
        aria-label="OpenMNC by the numbers"
      >
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-10">
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
            eyebrow="What We Do"
            title="Services Built for the Future"
            subtitle="From AI automation to student mentorship — everything we do is designed to create lasting impact."
          />
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((service, i) => (
              <ServiceCard key={service.slug || i} service={service} index={i} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <GlowButton to="/services" variant="outline">
              View All Services →
            </GlowButton>
          </div>
        </div>
      </section>

      {/* ══════ ABOUT STRIP ══════ */}
      <section
        className="section-padding bg-navy-900"
        aria-label="About OpenMNC LLP"
        id="about"
      >
        <div className="container-max grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <ScrollReveal>
              <span className="text-xs text-cyan-neon font-semibold tracking-widest uppercase mb-3 block">
                About Us
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
                We understand your idea first,
                <span className="gradient-text"> then build it.</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="text-gray-400 leading-relaxed mb-6">
                OpenMNC LLP is an India-based technology company founded by{' '}
                <strong className="text-white">Amit Barai</strong>. We work with startups,
                SMEs, and enterprises to build AI-driven automation, full-stack applications,
                and digital marketing strategies that multiply revenue and eliminate inefficiency.
              </p>
              <p className="text-gray-400 leading-relaxed mb-8">
                Beyond business, we passionately support students through completely free career
                guidance, resume preparation, and 3-month industrial training programs in
                partnership with 12+ colleges across India.
              </p>
              <GlowButton to="/about" variant="outline">
                Our Full Story →
              </GlowButton>
            </ScrollReveal>
          </div>

          {/* Founder card */}
          <ScrollReveal delay={0.2} direction="left">
            <article
              className="glass-card p-8 relative overflow-hidden"
              aria-label="Founder — Amit Barai"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-cyan-neon/10 to-transparent rounded-full -translate-y-8 translate-x-8" aria-hidden="true" />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-neon/30 to-cyan-neon/5 border border-cyan-neon/30 flex items-center justify-center text-2xl mb-4" aria-hidden="true">
                  👤
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-1">Amit Barai</h3>
                <p className="text-cyan-neon text-sm font-semibold mb-4">Founder &amp; Director, OpenMNC LLP</p>
                <blockquote className="text-gray-400 text-sm italic leading-relaxed border-l-2 border-cyan-neon/40 pl-4">
                  "Technology should work for humans — not the other way around. 
                  Our goal is to make AI accessible and impactful for every business, 
                  regardless of size."
                </blockquote>
                <div className="mt-6 flex items-center gap-3">
                  <a
                    href="mailto:amit@openmnc.com"
                    className="text-xs text-gray-400 hover:text-cyan-neon transition-colors duration-200"
                    aria-label="Email Amit Barai"
                  >
                    ✉ amit@openmnc.com
                  </a>
                </div>
              </div>
            </article>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════ WHY OPENMNC ══════ */}
      <section
        className="section-padding bg-navy-950"
        aria-label="Why choose OpenMNC"
        id="why-openmnc"
      >
        <div className="container-max">
          <SectionHeader
            eyebrow="Why OpenMNC"
            title="Built Different. Built Better."
          />
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {WHY_US.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.15}>
                <div className="glass-card p-8 text-center group hover:border-cyan-neon/30 transition-all duration-300">
                  <div
                    className="text-4xl mb-5 w-16 h-16 mx-auto rounded-2xl bg-cyan-neon/10 border border-cyan-neon/20 flex items-center justify-center group-hover:bg-cyan-neon/20 transition-colors duration-300"
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

      {/* ══════ PROCESS ══════ */}
      <section
        className="section-padding bg-navy-900"
        aria-label="Our process"
        id="process"
      >
        <div className="container-max">
          <SectionHeader
            eyebrow="How We Work"
            title="From Idea to Launch"
            subtitle="A transparent, iterative process that keeps you in control at every step."
          />
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connecting line on desktop */}
            <div
              className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-cyan-neon/30 to-transparent"
              aria-hidden="true"
            />
            {PROCESS.map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 0.12}>
                <div className="relative text-center">
                  <div
                    className="w-16 h-16 mx-auto mb-5 rounded-full border-2 border-cyan-neon/40 bg-navy-950 flex items-center justify-center font-display text-cyan-neon text-lg font-bold"
                    aria-hidden="true"
                  >
                    {item.step}
                  </div>
                  <h3 className="font-display text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed px-2">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ STUDENT GUIDANCE & COLLEGE SUBSIDY SPOTLIGHT ══════ */}
      <section
        className="py-20 px-4 bg-navy-950 border-t border-cyan-neon/15 relative overflow-hidden"
        aria-label="Student guidance and college admission subsidies"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-neon/5 rounded-full blur-3xl pointer-events-none" />
        <div className="container-max">
          <div className="glass-card p-8 sm:p-12 border border-cyan-neon/20 bg-gradient-to-br from-cyan-neon/10 via-navy-900 to-navy-950 relative overflow-hidden">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-neon/15 text-cyan-neon border border-cyan-neon/30 mb-4 uppercase tracking-wider">
                  <span>🎓</span> 100% Free Guidance · ₹3,000–₹10,000 College Subsidies
                </span>
                <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
                  Choosing the Best College After 12th?{' '}
                  <span className="gradient-text">Claim Your Institutional Fee Subsidy.</span>
                </h2>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
                  Don&apos;t pay hefty agent commissions or risk enrolling in low-placement colleges. As an industrial technology partner, 
                  OpenMNC helps 12th-pass students choose the right B.Tech, BCA, BBA, or Diploma course — and offsets 
                  <strong> ₹3,000 to ₹10,000 directly from your admission fees</strong>.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200">
                    <span className="text-cyan-neon font-bold block mb-0.5">✓ ₹0 Cost</span>
                    100% Free counseling, zero broker fees
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200">
                    <span className="text-cyan-neon font-bold block mb-0.5">✓ ₹3k - ₹10k</span>
                    Official college fee discount grant
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200">
                    <span className="text-cyan-neon font-bold block mb-0.5">✓ Real Internships</span>
                    Live IoT, AI &amp; Web project training
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  <GlowButton to="/contact?intent=student&service=student-guidance" variant="primary">
                    Claim College Subsidy &amp; Guidance →
                  </GlowButton>
                  <GlowButton to="/services/student-guidance#student-faq" variant="outline">
                    Read College FAQs
                  </GlowButton>
                </div>
              </div>
              <div className="lg:col-span-4 text-center hidden lg:block">
                <div className="w-48 h-48 mx-auto rounded-3xl bg-cyan-neon/10 border border-cyan-neon/30 flex flex-col items-center justify-center p-6 shadow-cyan-glow">
                  <span className="text-5xl mb-2">🏛️</span>
                  <p className="font-display font-bold text-white text-base">Accredited Colleges</p>
                  <p className="text-cyan-neon text-xs font-semibold mt-1">₹3,000–₹10,000 Off</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ CTA SECTION ══════ */}
      <section
        className="relative py-28 px-4 overflow-hidden"
        aria-label="Call to action — Get started with OpenMNC"
        style={{ background: 'linear-gradient(135deg, #0a0e1a 0%, #0d1226 40%, #001a1a 100%)' }}
      >
        <div className="absolute inset-0 bg-gradient-radial from-cyan-neon/8 via-transparent to-transparent pointer-events-none" aria-hidden="true" />
        <div className="relative container-max text-center">
          <ScrollReveal>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5">
              Ready to transform your idea?
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
              Let&apos;s build something extraordinary together.
              Book a free consultation — no commitment required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <GlowButton
                href={whatsappUrl('918509684056', 'Hi! I want to transform my business with OpenMNC.')}
                variant="primary"
                className="text-base px-8 py-4"
              >
                💬 WhatsApp Us
              </GlowButton>
              <GlowButton
                href="mailto:hello@openmnc.com"
                variant="outline"
                className="text-base px-8 py-4"
              >
                ✉ Email Us
              </GlowButton>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════ CONTACT TEASER ══════ */}
      <section
        className="py-10 px-4 bg-navy-950 border-t border-white/5"
        aria-label="Contact information"
      >
        <div className="container-max">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-400">
            <a
              href="mailto:hello@openmnc.com"
              className="flex items-center gap-2 hover:text-cyan-neon transition-colors duration-200"
            >
              <span className="text-cyan-neon" aria-hidden="true">✉</span>
              hello@openmnc.com
            </a>
            <span className="hidden sm:block w-px h-4 bg-gray-700" aria-hidden="true" />
            <a
              href="tel:+918509684056"
              className="flex items-center gap-2 hover:text-cyan-neon transition-colors duration-200"
            >
              <span className="text-cyan-neon" aria-hidden="true">📞</span>
              +91 8509684056
            </a>
            <span className="hidden sm:block w-px h-4 bg-gray-700" aria-hidden="true" />
            <span className="flex items-center gap-2">
              <span className="text-cyan-neon" aria-hidden="true">📍</span>
              India
            </span>
          </div>
        </div>
      </section>
    </>
  )
}
