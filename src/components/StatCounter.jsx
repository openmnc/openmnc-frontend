import { useRef, useEffect, useState } from 'react'
import { useInView } from 'framer-motion'

export default function StatCounter({ value, label, suffix = '', duration = 1800 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [displayed, setDisplayed] = useState(0)

  // Extract numeric part from value like "6+", "100%", "12+"
  const numericMatch = String(value).match(/^(\d+)/)
  const numericPart = numericMatch ? parseInt(numericMatch[1], 10) : 0
  const afterNum = String(value).replace(/^\d+/, '')

  useEffect(() => {
    if (!isInView) return
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
  }, [isInView, numericPart, duration])

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-4xl sm:text-5xl font-semibold text-white tracking-tight tabular-nums mb-2">
        {displayed}{afterNum}{suffix}
      </div>
      <div className="text-[#86868b] text-xs font-medium tracking-wide uppercase">
        {label}
      </div>
    </div>
  )
}
