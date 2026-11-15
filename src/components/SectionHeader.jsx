import ScrollReveal from './ScrollReveal.jsx'

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = true,
  accentColor = 'cyan',
  className = '',
}) {
  const accent = accentColor === 'amber' ? 'bg-amber-glow' : 'bg-cyan-neon'
  const textAccent = accentColor === 'amber' ? 'text-amber-glow' : 'text-cyan-neon'

  return (
    <div className={`${centered ? 'text-center' : ''} ${className}`}>
      {eyebrow && (
        <ScrollReveal delay={0}>
          <span className={`inline-block text-xs font-semibold tracking-widest uppercase ${textAccent} mb-3`}>
            {eyebrow}
          </span>
        </ScrollReveal>
      )}
      <ScrollReveal delay={0.1}>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
          {title}
        </h2>
      </ScrollReveal>
      {centered && (
        <ScrollReveal delay={0.15}>
          <div className={`mx-auto w-16 h-1 rounded-full ${accent} mb-6`} />
        </ScrollReveal>
      )}
      {!centered && (
        <div className={`w-16 h-1 rounded-full ${accent} mb-6`} />
      )}
      {subtitle && (
        <ScrollReveal delay={0.2}>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </ScrollReveal>
      )}
    </div>
  )
}
