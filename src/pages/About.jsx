import { Target, Zap, Handshake, GraduationCap, Code2, Mail, MessageSquare, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import SEO from '../components/SEO.jsx'
import { whatsappUrl } from '../utils/helpers.js'
import { organizationSchema } from '../utils/jsonld.js'

const VALUES = [
  {
    icon: <Target className="w-6 h-6 text-brand-primary" strokeWidth={1.5} />,
    title: 'Clarity First',
    desc: 'We spend the first meeting listening, not selling. Understanding your problem deeply means we build exactly what you need.',
  },
  {
    icon: <Zap className="w-6 h-6 text-brand-primary" strokeWidth={1.5} />,
    title: 'Engineering Rigor',
    desc: 'From architectural reviews to automated CI/CD and zero-vulnerability audits, we build production software engineered to last.',
  },
  {
    icon: <Handshake className="w-6 h-6 text-brand-primary" strokeWidth={1.5} />,
    title: 'Long-Term Partnership',
    desc: 'We are not ticket vendors. We are long-term engineering partners who scale your products and celebrate your revenue growth.',
  },
  {
    icon: <GraduationCap className="w-6 h-6 text-brand-primary" strokeWidth={1.5} />,
    title: 'Community Investment',
    desc: 'Giving back through 100% free student career guidance, college fee subsidies, and open tech mentorship is core to our company mission.',
  },
]

const MILESTONES = [
  { year: '2023', event: 'Initial engineering lab established by Amit Barai, architecting scalable cloud backends and embedded IoT systems.' },
  { year: '2024', event: 'Launched App Store Rescue & Vibe-Coded Prototype Audit division for global founders.' },
  { year: '2025', event: 'Expanded international software partnerships across UK, US, UAE & established partner college subsidies.' },
  { year: '2026', event: 'Formal incorporation of M/S. OPEN MNC LLP and nationwide rollout of 100% Free Career Guidance Portal.' },
]

export default function About() {
  return (
    <>
      <SEO
        title="About OpenMNC — Global Engineering Firm & Production Software Partner"
        description="Learn about OpenMNC (M/S. OPEN MNC LLP), founded by Amit Barai. Operating internationally and across India, we audit, rescue, build, and scale production-grade software and empower students through career guidance."
        canonical="/about"
        schema={organizationSchema}
        keywords="About OpenMNC, M/S OPEN MNC LLP, Amit Barai, production software development, vibe coded app audit, app store approval, student career mentorship"
      />

      {/* ══════ SECTION 1: HERO (LIGHT-FIRST CANVAS WITH AMBIENT MESH) ══════ */}
      <section
        className="relative pt-32 pb-20 px-4 bg-canvas bg-ambient-mesh overflow-hidden"
        aria-label="About OpenMNC"
      >
        <div className="section-container relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 border border-blue-200 text-brand-primary mb-6 type-eyebrow">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            Corporate Identity &amp; Global Mission
          </span>
          <h1 className="type-h1 mb-6 max-w-4xl mx-auto">
            Engineering Rigor for Founders.{' '}
            <span className="bg-gradient-to-r from-brand-primary to-indigo-600 bg-clip-text text-transparent block mt-1">
              Opportunity for Students.
            </span>
          </h1>
          <p className="type-lead mx-auto text-ink-secondary">
            Operating internationally and across India, OpenMNC is a serious, engineering-first technology firm.
            We solve high-stakes software bottlenecks for founders and provide 100% free educational guidance for the next generation.
          </p>
        </div>
      </section>

      <main className="bg-canvas">
        {/* ══════ SECTION 2: MISSION & FOUNDER (SUBTLE BG) ══════ */}
        <section className="section-spacing bg-subtle border-y border-hairline" aria-label="Our mission and leadership">
          <div className="section-container grid lg:grid-cols-2 gap-8 items-stretch">
            {/* Mission Statement Card */}
            <ScrollReveal>
              <div className="h-full rounded-card bg-surface border border-hairline p-8 sm:p-10 flex flex-col justify-between shadow-sm">
                <div>
                  <span className="type-eyebrow block mb-3 text-brand-primary">
                    Our Philosophy
                  </span>
                  <h2 className="type-h2 text-2xl sm:text-3xl mb-5">
                    We understand your business first, then architect the engineering.
                  </h2>
                  <p className="type-body mb-4 text-ink-secondary">
                    Too many dev agencies write lines of code without understanding the business stakes. At OpenMNC,
                    we immerse ourselves in your architecture, your risk profile, and your unit economics before writing a single commit.
                  </p>
                  <p className="type-body text-ink-secondary mb-8">
                    Whether you are an indie founder whose vibe-coded MVP is failing security tests, a company blocked by Apple App Store guidelines, or a business that needs scalable cloud architecture, we deliver certainty.
                  </p>
                </div>
                <div>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-btn bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-semibold transition-all font-sans shadow-sm"
                  >
                    Start an Engineering Review →
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Founder Card */}
            <ScrollReveal delay={0.2} direction="left">
              <article
                className="h-full rounded-card bg-surface border border-hairline p-8 sm:p-10 flex flex-col justify-between shadow-sm relative overflow-hidden"
                aria-label="Founder Amit Barai"
              >
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-brand-primary shadow-sm shrink-0"
                      aria-hidden="true"
                    >
                      <Code2 className="w-7 h-7 text-brand-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="type-h3 text-xl sm:text-2xl font-bold">Amit Barai</h3>
                      <p className="text-brand-primary text-xs font-semibold tracking-wide font-sans">
                        Founder &amp; Managing Director
                      </p>
                      <p className="text-ink-muted text-xs font-mono mt-0.5">
                        M/S. OPEN MNC LLP
                      </p>
                    </div>
                  </div>

                  <blockquote className="type-body text-ink-secondary border-l-2 border-brand-primary pl-4 mb-6 italic">
                    &ldquo;Software should be a multiplier for human vision—not an endless source of stress, broken dependencies, or rejected submissions.
                    Our mission is to give founders absolute peace of mind while opening life-changing career doors for young students across India.&rdquo;
                  </blockquote>
                </div>

                <div className="pt-6 border-t border-hairline flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex flex-col gap-2">
                    <a
                      href="mailto:amit@openmnc.com"
                      className="text-ink-secondary hover:text-brand-primary transition-colors flex items-center gap-2 font-sans"
                    >
                      <Mail className="w-3.5 h-3.5 text-brand-primary" aria-hidden="true" />
                      <span>amit@openmnc.com</span>
                    </a>
                    <a
                      href={whatsappUrl('918509684056', 'Hi Amit! I found OpenMNC and would like to connect.')}
                      className="text-ink-secondary hover:text-brand-primary transition-colors flex items-center gap-2 font-sans"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-status-success" aria-hidden="true" />
                      <span>Direct WhatsApp</span>
                    </a>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-status-success border border-emerald-200 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
                    Available for Consultations
                  </span>
                </div>
              </article>
            </ScrollReveal>
          </div>
        </section>

        {/* ══════ SECTION 3: OPERATING PRINCIPLES (CANVAS) ══════ */}
        <section className="section-spacing bg-canvas" aria-label="Our values">
          <div className="section-container">
            <SectionHeader
              eyebrow="Operating Principles"
              title="Built on Rigor, Not Fluff"
            />
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              {VALUES.map((v) => (
                <div key={v.title} className="p-8 rounded-card bg-surface border border-hairline shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
                    {v.icon}
                  </div>
                  <h3 className="type-h3 text-lg mb-2">{v.title}</h3>
                  <p className="type-body text-ink-secondary text-sm">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ SECTION 4: COMPANY PROGRESSION (SUBTLE BG) ══════ */}
        <section className="section-spacing bg-subtle border-t border-hairline" aria-label="Company milestones">
          <div className="max-w-4xl mx-auto px-5 sm:px-8">
            <SectionHeader
              eyebrow="Company Timeline"
              title="Our Progression"
            />
            <div className="mt-12 rounded-card bg-surface border border-hairline divide-y divide-hairline overflow-hidden shadow-sm">
              {MILESTONES.map((m, i) => (
                <div key={i} className="p-6 flex items-start gap-5 hover:bg-subtle/50 transition-colors">
                  <span className="font-mono text-sm font-bold text-brand-primary pt-0.5 tabular-nums">
                    {m.year}
                  </span>
                  <div className="flex-1">
                    <p className="type-body text-ink-primary font-medium text-sm sm:text-base">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
