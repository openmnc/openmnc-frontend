import { useEffect, useState } from 'react'
import ServiceCard from '../components/ServiceCard.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import ScrollReveal from '../components/ScrollReveal.jsx'
import ThreeBackground from '../components/ThreeBackground.jsx'
import { servicesApi } from '../api/services.js'
import { getServiceIcon } from '../utils/helpers.js'

const STATIC_SERVICES = [
  {
    slug: 'business-automation',
    title: 'Business Automation & AI Integration',
    tagline: 'Multiply revenue. Eliminate manual work.',
    icon: 'automation',
    description:
      'We help businesses automate repetitive tasks, integrate custom AI solutions, increase revenue, improve reliability and efficiency, reduce time-consuming manual labor, and become genuinely competitive in an AI-first world.',
    features: [
      'Custom AI workflow automation',
      'Revenue multiplication strategies',
      'Business process optimization',
      'AI integration consulting',
      'Reliability & uptime guarantee',
      'Zero time-waste operations',
    ],
  },
  {
    slug: 'custom-development',
    title: 'Custom App & Software Development',
    tagline: 'From your idea to a living product.',
    icon: 'code',
    description:
      'Transforming visionary ideas into reality with deep requirement analysis, full-cycle development, maintenance, marketing, and App Store Optimization (ASO). We understand your vision first before writing a single line of code.',
    features: [
      'Deep requirement analysis',
      'Full-cycle development & QA',
      'App Store Optimization (ASO)',
      'Marketing & growth support',
      'Ongoing maintenance & SLA',
      'Solopreneur & founder friendly',
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
    title: 'Student Guidance & EdTech Engine',
    tagline: '100% free guidance. Real college savings.',
    icon: 'education',
    description:
      'We guide 12th-pass students to choose their ideal career and college based on aptitude — 100% free of charge. Eligible students enrolling in our partner colleges receive ₹3,000 to ₹10,000 in partnership discounts/subsidies paid by us as an industrial partner.',
    features: [
      '100% free student career consultation',
      '₹3,000–₹10,000 partner college subsidy',
      'Field alignment & aptitude matching',
      'College selection & admission roadmap',
      'Industrial partnership fee discounts',
      'Zero charges or hidden fees for students',
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

export default function Services() {
  const [services, setServices] = useState(STATIC_SERVICES)

  useEffect(() => {
    servicesApi.getAll().then((res) => {
      if (Array.isArray(res.data) && res.data.length > 0) {
        setServices(res.data.filter((s) => s.is_active !== false))
      }
    }).catch(() => {})
  }, [])

  return (
    <>
      {/* Page Hero */}
      <section
        className="relative pt-32 pb-20 px-4 bg-navy-950 overflow-hidden"
        aria-label="Services hero"
      >
        <ThreeBackground section="hero" className="opacity-40" />
        <div className="relative z-10 container-max text-center">
          <span className="text-xs text-cyan-neon font-semibold tracking-widest uppercase mb-4 block">
            What We Offer
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Our <span className="gradient-text">Services</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Six specialized services built to automate, accelerate, and amplify your business —
            plus free support for the next generation of builders.
          </p>
        </div>
      </section>

      {/* Services List */}
      <main className="bg-navy-950 section-padding">
        <div className="container-max space-y-20">
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
      </main>
    </>
  )
}
