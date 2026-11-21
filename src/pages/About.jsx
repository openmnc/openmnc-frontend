import { Target, Zap, Handshake, GraduationCap, Code2, Mail, MessageSquare } from 'lucide-react'
import ThreeBackground from '../components/ThreeBackground.jsx'
import ScrollReveal from '../components/ScrollReveal.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import GlowButton from '../components/GlowButton.jsx'
import SEO from '../components/SEO.jsx'
import { whatsappUrl } from '../utils/helpers.js'
import { organizationSchema } from '../utils/jsonld.js'

const VALUES = [
  {
    icon: <Target className="w-6 h-6 text-[#2997ff]" />,
    title: 'Clarity First',
    desc: 'We spend the first meeting listening, not selling. Understanding your problem deeply means we build exactly what you need.',
  },
  {
    icon: <Zap className="w-6 h-6 text-[#2997ff]" />,
    title: 'Engineering Rigor',
    desc: 'From architectural reviews to automated CI/CD and zero-vulnerability audits, we build production software engineered to last.',
  },
  {
    icon: <Handshake className="w-6 h-6 text-[#2997ff]" />,
    title: 'Long-Term Partnership',
    desc: 'We are not ticket vendors. We are long-term engineering partners who scale your products and celebrate your revenue growth.',
  },
  {
    icon: <GraduationCap className="w-6 h-6 text-[#2997ff]" />,
    title: 'Community Investment',
    desc: 'Giving back through 100% free student career guidance, college fee subsidies, and open tech mentorship is core to our company mission.',
  },
]

const MILESTONES = [
  { year: '2023', event: 'Initial engineering lab established by Amit Barai, architecting scalable cloud backends and embedded IoT systems' },
  { year: '2024', event: 'Launched App Store Rescue & Vibe-Coded Prototype Audit division for global founders' },
  { year: '2025', event: 'Expanded international software partnerships across UK, US, UAE & established partner college subsidies' },
  { year: '2026', event: 'Formal incorporation of M/S. OPEN MNC LLP and nationwide rollout of 100% Free Career Guidance Portal' },
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

      {/* Page Hero */}
      <section
        className="relative pt-36 pb-20 px-4 bg-black overflow-hidden"
        aria-label="About OpenMNC"
      >
        <ThreeBackground section="about" className="opacity-20" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-[#2997ff] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2997ff]" />
            Corporate Identity &amp; Global Mission
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#f5f5f7] tracking-tight mb-6">
            Engineering Rigor for Founders.{' '}
            <span className="text-[#2997ff] block mt-1">Opportunity for Students.</span>
          </h1>
          <p className="text-[#a1a1a6] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Operating internationally and across India, OpenMNC is a serious, engineering-first technology firm.
            We solve the high-stakes software challenges founders face and provide 100% free educational guidance for the next generation.
          </p>
        </div>
      </section>

      <main className="bg-black">
        {/* Mission & Founder */}
        <section className="section-padding pt-0" aria-label="Our mission and leadership">
          <div className="container-max grid lg:grid-cols-2 gap-10 items-stretch">
            {/* Mission Statement Surface */}
            <ScrollReveal>
              <div className="h-full rounded-2xl bg-[#161618] border border-white/8 p-8 sm:p-10 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#2997ff] uppercase tracking-wider block mb-3">
                    Our Philosophy
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#f5f5f7] tracking-tight mb-6">
                    We understand your business first, then architect the engineering.
                  </h2>
                  <p className="text-[#a1a1a6] leading-relaxed mb-5 text-sm sm:text-base">
                    Too many dev agencies write lines of code without understanding the business stakes. At OpenMNC,
                    we immerse ourselves in your architecture, your risk profile, and your unit economics before writing a single commit.
                  </p>
                  <p className="text-[#a1a1a6] leading-relaxed mb-6 text-sm sm:text-base">
                    Whether you are an indie founder whose vibe-coded MVP is failing security tests, a company blocked by Apple App Store guidelines, or a business that needs scalable cloud architecture, we deliver certainty.
                  </p>
                </div>
                <div>
                  <GlowButton to="/contact" variant="primary">
                    Start an Engineering Review →
                  </GlowButton>
                </div>
              </div>
            </ScrollReveal>

            {/* Founder Card - Concentric Apple Geometry */}
            <ScrollReveal delay={0.2} direction="left">
              <article
                className="h-full rounded-2xl bg-[#161618] border border-white/8 p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden"
                aria-label="Founder Amit Barai"
              >
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white"
                      aria-hidden="true"
                    >
                      <Code2 className="w-8 h-8 text-[#2997ff]" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-semibold text-[#f5f5f7] tracking-tight">Amit Barai</h3>
                      <p className="text-[#2997ff] text-xs font-semibold tracking-wide">
                        Founder &amp; Managing Director
                      </p>
                      <p className="text-[#86868b] text-[11px] font-mono mt-0.5">
                        M/S. OPEN MNC LLP
                      </p>
                    </div>
                  </div>

                  <blockquote className="text-[#d2d2d7] text-sm leading-relaxed border-l-2 border-[#2997ff]/40 pl-4 mb-6 italic">
                    &ldquo;Software should be a multiplier for human vision—not an endless source of stress, broken dependencies, or rejected submissions.
                    Our mission is to give founders absolute peace of mind while opening life-changing career doors for young students across India.&rdquo;
                  </blockquote>
                </div>

                <div className="pt-6 border-t border-white/8 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <a
                      href="mailto:amit@openmnc.com"
                      className="text-[#a1a1a6] hover:text-[#2997ff] transition-colors flex items-center gap-2"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#2997ff]" aria-hidden="true" />
                      <span>amit@openmnc.com</span>
                    </a>
                    <a
                      href={whatsappUrl('918509684056', 'Hi Amit! I found OpenMNC and would like to connect.')}
                      className="text-[#a1a1a6] hover:text-[#2997ff] transition-colors flex items-center gap-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                      <span>Direct WhatsApp</span>
                    </a>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Available for Consultations
                  </span>
                </div>
              </article>
            </ScrollReveal>
          </div>
        </section>

        {/* Values - Single Unified Surface with Hairline Dividers */}
        <section className="section-padding pt-0" aria-label="Our values">
          <div className="container-max">
            <SectionHeader
              eyebrow="Operating Principles"
              title="Built on Rigor, Not Fluff"
              accentColor="cyan"
            />
            <div className="mt-12 rounded-2xl bg-[#161618] border border-white/8 divide-y divide-white/8 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/8">
                {VALUES.slice(0, 2).map((v) => (
                  <div key={v.title} className="p-8 hover:bg-white/[0.02] transition-colors">
                    <div className="mb-3">{v.icon}</div>
                    <h3 className="font-semibold text-lg text-[#f5f5f7] mb-2">{v.title}</h3>
                    <p className="text-[#a1a1a6] text-sm leading-relaxed">{v.desc}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/8">
                {VALUES.slice(2, 4).map((v) => (
                  <div key={v.title} className="p-8 hover:bg-white/[0.02] transition-colors">
                    <div className="mb-3">{v.icon}</div>
                    <h3 className="font-semibold text-lg text-[#f5f5f7] mb-2">{v.title}</h3>
                    <p className="text-[#a1a1a6] text-sm leading-relaxed">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Timeline - Apple Precision Milestone List */}
        <section className="section-padding pt-0" aria-label="Company milestones">
          <div className="container-max max-w-3xl mx-auto">
            <SectionHeader
              eyebrow="Company Timeline"
              title="Our Progression"
              accentColor="cyan"
            />
            <div className="mt-12 rounded-2xl bg-[#161618] border border-white/8 divide-y divide-white/8 overflow-hidden">
              {MILESTONES.map((m, i) => (
                <div key={i} className="p-6 flex items-start gap-6 hover:bg-white/[0.02] transition-colors">
                  <span className="font-mono text-sm font-semibold text-[#2997ff] pt-0.5 tabular-nums">
                    {m.year}
                  </span>
                  <div className="flex-1">
                    <p className="text-[#f5f5f7] text-sm sm:text-base font-medium">{m.event}</p>
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
