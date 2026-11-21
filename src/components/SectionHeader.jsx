import ScrollReveal from './ScrollReveal.jsx'

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = true,
  className = '',
}) {
  return (
    <div className={`${centered ? 'text-center' : ''} ${className}`}>
      {eyebrow && (
        <ScrollReveal delay={0}>
          <span className="inline-block text-[11px] font-semibold tracking-widest uppercase text-[#2997ff] mb-3">
            {eyebrow}
          </span>
        </ScrollReveal>
      )}
      <ScrollReveal delay={0.08}>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#f5f5f7] mb-4 tracking-tight leading-tight">
          {title}
        </h2>
      </ScrollReveal>
      {subtitle && (
        <ScrollReveal delay={0.16}>
          <p className="text-[#86868b] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </ScrollReveal>
      )}
    </div>
  )
}
