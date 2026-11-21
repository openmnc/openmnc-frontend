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
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="
        relative group flex flex-col p-6 rounded-2xl h-full
        bg-[#161618] border border-white/8
        shadow-[0_4px_20px_rgba(0,0,0,0.35)]
        hover:border-white/18 hover:-translate-y-1
        transition-all duration-300
      "
      aria-label={`Service: ${service.title}`}
    >
      {/* Icon & Index */}
      <div className="mb-5 flex items-center justify-between">
        <span
          className="text-2xl w-11 h-11 flex items-center justify-center rounded-xl bg-white/6 border border-white/10 text-white shadow-sm"
          aria-hidden="true"
        >
          {icon}
        </span>
        <span className="text-xs font-mono text-[#86868b] group-hover:text-white transition-colors tabular-nums">
          0{index + 1}
        </span>
      </div>

      {/* Category Tag */}
      {service.category && (
        <span className="text-[10px] uppercase font-semibold tracking-wider text-[#2997ff] mb-2 block">
          {service.category}
        </span>
      )}

      {/* Title */}
      <h3 className="font-display text-lg font-semibold text-[#f5f5f7] mb-2 group-hover:text-[#2997ff] transition-colors duration-200 leading-snug">
        {service.title}
      </h3>

      {/* Tagline */}
      {service.tagline && (
        <p className="text-[#86868b] text-xs sm:text-sm mb-4 leading-relaxed line-clamp-2">
          {service.tagline}
        </p>
      )}

      {/* Expected Outcome */}
      {service.expected_outcome && (
        <div className="mb-4 p-3 rounded-xl bg-white/4 border border-white/8 text-[11px] text-[#a1a1a6] leading-relaxed">
          <span className="font-semibold text-white">Deliverable:</span> {service.expected_outcome}
        </div>
      )}

      {/* Features list */}
      {features.length > 0 && (
        <ul className="space-y-2 mb-6 flex-1 text-xs text-[#a1a1a6]" aria-label="Key features">
          {features.map((feat, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-[#2997ff] mt-0.5 flex-shrink-0" aria-hidden="true">✓</span>
              <span className="line-clamp-1">{feat}</span>
            </li>
          ))}
        </ul>
      )}

      {/* CTA Button */}
      <Link
        to={`/services/${service.slug}`}
        className="
          mt-auto inline-flex items-center gap-1.5 text-xs font-medium
          text-[#2997ff] group-hover:text-white transition-colors
        "
        aria-label={`Explore ${service.title}`}
      >
        <span>Explore Architecture</span>
        <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">&rarr;</span>
      </Link>
    </motion.article>
  )
}
