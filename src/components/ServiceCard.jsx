import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getServiceIcon } from '../utils/helpers.js'

export default function ServiceCard({ service, index = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  const icon = getServiceIcon(service.icon, service.slug)
  const features = (service.features || []).slice(0, 3)

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      className="
        relative group flex flex-col p-4 sm:p-6 md:p-7 rounded-2xl h-full
        bg-white/10 backdrop-blur-lg border border-white/20
        shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
        hover:border-cyan-neon/40 hover:bg-white/[0.14] hover:-translate-y-1
        transition-all duration-300 cursor-pointer
      "
      aria-label={`Service: ${service.title}`}
    >
      {/* Icon & Counter */}
      <div className="mb-4 sm:mb-5 flex items-center justify-between">
        <span
          className="text-2xl sm:text-3xl w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-cyan-neon/15 border border-cyan-neon/30 text-cyan-neon shadow-sm"
          aria-hidden="true"
        >
          {icon}
        </span>
        <span className="text-xs font-mono font-medium text-gray-400 group-hover:text-cyan-neon transition-colors">
          0{index + 1}
        </span>
      </div>

      {/* Category / Pillar Tag */}
      {service.category && (
        <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-neon/90 mb-1.5 block">
          {service.category}
        </span>
      )}

      {/* Title */}
      <h3 className="font-display text-base sm:text-lg font-bold text-white/95 mb-2 group-hover:text-cyan-neon transition-colors duration-200">
        {service.title}
      </h3>

      {/* Tagline */}
      {service.tagline && (
        <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed line-clamp-2">
          {service.tagline}
        </p>
      )}

      {/* Problem / Solution preview badge if present */}
      {service.expected_outcome && (
        <div className="mb-4 p-2.5 rounded-xl bg-cyan-neon/5 border border-cyan-neon/15 text-[11px] text-cyan-neon/90">
          <span className="font-semibold text-white">Outcome:</span> {service.expected_outcome}
        </div>
      )}

      {/* Features */}
      {features.length > 0 && (
        <ul className="space-y-1.5 sm:space-y-2 mb-5 sm:mb-6 flex-1 text-xs sm:text-sm text-gray-300" aria-label="Key features">
          {features.map((feat, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-cyan-neon mt-0.5 flex-shrink-0" aria-hidden="true">▸</span>
              <span className="line-clamp-1">{feat}</span>
            </li>
          ))}
        </ul>
      )}

      {/* CTA */}
      <Link
        to={`/services/${service.slug}`}
        className="
          mt-auto inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold
          text-cyan-neon group-hover:text-white transition-colors
        "
        aria-label={`Explore ${service.title}`}
      >
        <span>Explore Solution</span>
        <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">&rarr;</span>
      </Link>
    </motion.article>
  )
}
