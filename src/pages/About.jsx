import ThreeBackground from '../components/ThreeBackground.jsx'
import ScrollReveal from '../components/ScrollReveal.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import GlowButton from '../components/GlowButton.jsx'
import { whatsappUrl } from '../utils/helpers.js'

const VALUES = [
  {
    icon: '🎯',
    title: 'Clarity First',
    desc: 'We spend the first meeting listening, not selling. Understanding your problem deeply means we build exactly what you need.',
  },
  {
    icon: '🤖',
    title: 'AI-Augmented Everything',
    desc: 'From our internal workflows to the products we ship, we apply AI where it creates genuine value.',
  },
  {
    icon: '🤝',
    title: 'Long-Term Partnership',
    desc: 'We are not project vendors. We are technology partners who celebrate your growth as our own.',
  },
  {
    icon: '📚',
    title: 'Community Investment',
    desc: 'Giving back through free student guidance and college partnerships is core to who we are.',
  },
]

const MILESTONES = [
  { year: '2024', event: 'OpenMNC LLP founded by Amit Barai' },
  { year: '2024', event: 'First industrial training cohort launched' },
  { year: '2024', event: '12+ college partnerships established' },
  { year: '2024', event: 'Free student guidance program expanded nationwide' },
]

export default function About() {
  return (
    <>
      {/* Page Hero */}
      <section
        className="relative pt-32 pb-20 px-4 bg-navy-950 overflow-hidden"
        aria-label="About OpenMNC LLP"
      >
        <ThreeBackground section="about" className="opacity-30" />
        <div className="relative z-10 container-max text-center">
          <span className="text-xs text-amber-glow font-semibold tracking-widest uppercase mb-4 block">
            Our Story
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            About <span className="amber-gradient-text">OpenMNC LLP</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            We started with a simple belief: technology should be a multiplier for human potential,
            not a barrier. Everything we build flows from that conviction.
          </p>
        </div>
      </section>

      <main className="bg-navy-950">
        {/* Mission */}
        <section className="section-padding" aria-label="Our mission">
          <div className="container-max grid lg:grid-cols-2 gap-14 items-center">
            <ScrollReveal>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-6">
                We understand your idea first,{' '}
                <span className="gradient-text">then build it.</span>
              </h2>
              <p className="text-gray-400 leading-relaxed mb-5">
                OpenMNC LLP is a future-focused technology company based in India. We specialize in
                AI automation, custom software development, social media management, and comprehensive
                student support programs.
              </p>
              <p className="text-gray-400 leading-relaxed mb-8">
                What sets us apart is our discovery-first approach. Before any code is written,
                we immerse ourselves in your business context, map your workflows, and design solutions
                that solve the root problem — not just the symptoms.
              </p>
              <GlowButton to="/contact" variant="primary">
                Start a Conversation →
              </GlowButton>
            </ScrollReveal>

            {/* Founder card */}
            <ScrollReveal delay={0.2} direction="left">
              <article
                className="glass-card p-8 relative overflow-hidden"
                aria-label="Founder Amit Barai"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-radial from-amber-glow/10 to-transparent rounded-full -translate-y-10 translate-x-10 pointer-events-none" aria-hidden="true" />
                <div className="relative">
                  <div
                    className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-glow/30 to-amber-glow/5 border border-amber-glow/30 flex items-center justify-center text-3xl mb-5"
                    aria-hidden="true"
                  >
                    👤
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white mb-1">Amit Barai</h3>
                  <p className="text-amber-glow text-sm font-semibold mb-5">Founder &amp; Director, OpenMNC LLP</p>
                  <blockquote className="text-gray-300 text-sm leading-relaxed border-l-2 border-amber-glow/50 pl-4 mb-6 italic">
                    "Technology should work for humans — not the other way around.
                    My mission is to make intelligent automation accessible and impactful
                    for every business, and to create pathways for the next generation of
                    tech talent in India."
                  </blockquote>
                  <div className="flex flex-col gap-2 text-sm text-gray-400">
                    <a
                      href="mailto:amit@openmnc.com"
                      className="flex items-center gap-2 hover:text-amber-glow transition-colors"
                      aria-label="Email Amit Barai"
                    >
                      <span aria-hidden="true">✉</span> amit@openmnc.com
                    </a>
                    <a
                      href={whatsappUrl('918509684056', 'Hi Amit! I found OpenMNC and would love to connect.')}
                      className="flex items-center gap-2 hover:text-amber-glow transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="WhatsApp Amit Barai"
                    >
                      <span aria-hidden="true">💬</span> WhatsApp
                    </a>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding bg-navy-900" aria-label="Our values">
          <div className="container-max">
            <SectionHeader
              eyebrow="Core Values"
              title="Principles We Build By"
              accentColor="amber"
            />
            <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {VALUES.map((v, i) => (
                <ScrollReveal key={v.title} delay={i * 0.1}>
                  <div className="glass-card p-6 flex gap-5 items-start group hover:border-amber-glow/30 transition-all duration-300">
                    <div
                      className="text-2xl w-12 h-12 flex-shrink-0 rounded-xl bg-amber-glow/10 border border-amber-glow/20 flex items-center justify-center group-hover:bg-amber-glow/20 transition-colors"
                      aria-hidden="true"
                    >
                      {v.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-2 group-hover:text-amber-glow transition-colors">{v.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="section-padding" aria-label="Company milestones">
          <div className="container-max max-w-2xl mx-auto">
            <SectionHeader
              eyebrow="Timeline"
              title="Our Journey So Far"
              accentColor="amber"
            />
            <ol className="mt-12 relative border-l border-amber-glow/20 pl-8 space-y-10">
              {MILESTONES.map((m, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <li className="relative">
                    <div
                      className="absolute -left-11 w-6 h-6 rounded-full bg-amber-glow/20 border-2 border-amber-glow flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <div className="w-2 h-2 rounded-full bg-amber-glow" />
                    </div>
                    <time className="text-xs text-amber-glow font-semibold tracking-widest uppercase mb-1 block">
                      {m.year}
                    </time>
                    <p className="text-white font-medium">{m.event}</p>
                  </li>
                </ScrollReveal>
              ))}
            </ol>
          </div>
        </section>
      </main>
    </>
  )
}
