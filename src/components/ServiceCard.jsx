import { useRef, useState } from 'react'
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
        relative group p-6 sm:p-7 rounded-2xl h-full flex flex-col
        bg-slate-900/80 border border-slate-800 hover:border-sky-500/40
        hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer
      "
      aria-label={`Service: ${service.title}`}
    >
      {/* Icon */}
      <div className="mb-5 flex items-center justify-between">
        <span
          className="text-2xl w-12 h-12 flex items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400"
          aria-hidden="true"
        >
          {icon}
        </span>
        <span className="text-xs font-mono font-medium text-slate-500 group-hover:text-sky-400 transition-colors">
          0{index + 1}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-display text-lg font-bold text-white mb-2 group-hover:text-sky-400 transition-colors duration-200">
        {service.title}
      </h3>

      {/* Tagline */}
      {service.tagline && (
        <p className="text-slate-400 text-sm mb-4 leading-relaxed">{service.tagline}</p>
      )}

      {/* Features */}
      {features.length > 0 && (
        <ul className="space-y-2 mb-6 flex-1" aria-label="Key features">
          {features.map((feat, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="text-sky-400 mt-0.5 flex-shrink-0" aria-hidden="true">&bull;</span>
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      )}

      {/* CTA */}
      <Link
        to={`/services#${service.slug}`}
        className="
          mt-auto inline-flex items-center gap-1.5 text-sm font-semibold
          text-sky-400 group-hover:text-sky-300 transition-colors
        "
        aria-label={`Learn more about ${service.title}`}
      >
        Learn More <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">&rarr;</span>
      </Link>
    </motion.article>
  )
}
