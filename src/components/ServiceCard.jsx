import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getServiceIcon } from '../utils/helpers.js'

export default function ServiceCard({ service, index = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const icon = getServiceIcon(service.icon, service.slug)
  const features = (service.features || []).slice(0, 3)

  function handleMouseMove(e) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 20
    setTilt({ x, y })
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 })
    setHovered(false)
  }

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      style={{
        rotateX: tilt.y,
        rotateY: tilt.x,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`
        relative group glass-card p-6 h-full flex flex-col
        transition-all duration-300 cursor-pointer
        ${hovered ? 'border-cyan-neon/40 shadow-cyan-glow' : ''}
      `}
      aria-label={`Service: ${service.title}`}
    >
      {/* Animated gradient sweep on hover */}
      <div
        className={`
          absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
          transition-opacity duration-500 pointer-events-none
          bg-gradient-to-br from-cyan-neon/5 via-transparent to-transparent
        `}
      />

      {/* Glow dot top-right */}
      <div
        className={`
          absolute -top-px -right-px w-16 h-16 rounded-tr-2xl
          bg-gradient-to-bl from-cyan-neon/20 to-transparent
          opacity-0 group-hover:opacity-100 transition-opacity duration-300
        `}
      />

      {/* Icon */}
      <div className="mb-4 flex items-center gap-3">
        <span
          className="text-3xl w-12 h-12 flex items-center justify-center rounded-xl bg-cyan-neon/10 border border-cyan-neon/20"
          aria-hidden="true"
        >
          {icon}
        </span>
        <div className="w-8 h-px bg-gradient-to-r from-cyan-neon/60 to-transparent" />
      </div>

      {/* Title */}
      <h3 className="font-display text-lg font-bold text-white mb-2 group-hover:text-cyan-neon transition-colors duration-300">
        {service.title}
      </h3>

      {/* Tagline */}
      {service.tagline && (
        <p className="text-gray-400 text-sm italic mb-4">{service.tagline}</p>
      )}

      {/* Features */}
      {features.length > 0 && (
        <ul className="space-y-2 mb-6 flex-1" aria-label="Key features">
          {features.map((feat, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
              <span className="text-cyan-neon mt-0.5 flex-shrink-0" aria-hidden="true">▸</span>
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      )}

      {/* CTA */}
      <Link
        to={`/services#${service.slug}`}
        className="
          mt-auto inline-flex items-center gap-1 text-sm font-semibold
          text-cyan-neon hover:gap-3 transition-all duration-200
        "
        aria-label={`Learn more about ${service.title}`}
      >
        Learn More <span aria-hidden="true">→</span>
      </Link>
    </motion.article>
  )
}
