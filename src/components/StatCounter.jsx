import { useRef, useEffect, useState } from 'react'
import { useInView } from 'framer-motion'

export default function StatCounter({ value, label, suffix = '', duration = 1800 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  // Extract numeric part from value like "5+", "100%", "50k+", "12+", "3-Month"
  const numericMatch = String(value).match(/^(\d+)/)
  const numericPart = numericMatch ? parseInt(numericMatch[1], 10) : 0
  const afterNum = String(value).replace(/^\d+/, '')

  // CRITICAL SEO BUG FIX: Initialize with real final value so Googlebot, SSR & hydration
  // immediately index the true metric ("5+", "100%", "12+"), NEVER "0+" or "0%"!
  const [displayed, setDisplayed] = useState(numericPart)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    // Only trigger animation when user in a real browser scrolls into viewport
    if (!isInView || hasAnimated || !numericMatch) return
    setHasAnimated(true)
    let start = 0
    const step = numericPart / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= numericPart) {
        setDisplayed(numericPart)
        clearInterval(timer)
      } else {
        setDisplayed(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, hasAnimated, numericPart, duration, numericMatch])

  return (
    <div ref={ref} className="text-center" aria-label={`${value}${suffix} ${label}`}>
      <div className="font-display text-4xl sm:text-5xl font-semibold text-white tracking-tight tabular-nums mb-2">
        <span>{displayed}{afterNum}{suffix}</span>
        <noscript>{value}{suffix}</noscript>
      </div>
      <div className="text-[#86868b] text-xs font-medium tracking-wide uppercase">
        {label}
      </div>
    </div>
  )
}
