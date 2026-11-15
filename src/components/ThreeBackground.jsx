export default function ThreeBackground({ section = 'hero', className = '' }) {
  const isAbout = section === 'about'
  const primaryGlow = isAbout ? 'rgba(245, 158, 11, 0.08)' : 'rgba(14, 165, 233, 0.09)'
  const secondaryGlow = isAbout ? 'rgba(217, 119, 6, 0.04)' : 'rgba(99, 102, 241, 0.06)'

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`} aria-hidden="true">
      {/* Subtle modern geometric dot matrix */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.45) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Top ambient luxury lighting aura */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[450px] rounded-full blur-[120px]"
        style={{
          background: `radial-gradient(circle, ${primaryGlow} 0%, ${secondaryGlow} 50%, transparent 80%)`,
        }}
      />

      {/* Subtle soft edge vignettes */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/40 via-transparent to-navy-950" />
    </div>
  )
}
