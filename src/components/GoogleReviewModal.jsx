import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function GoogleReviewModal({ isOpen, onClose, reviewUrl }) {
  const [copied, setCopied] = useState(false)

  // Direct Google Business Profile review link if provided, otherwise targeted search
  const fallbackSearchUrl = 'https://www.google.com/search?q=OPEN+MNC+LLP+reviews'
  const targetUrl = (reviewUrl && reviewUrl.trim()) ? reviewUrl.trim() : fallbackSearchUrl

  const handleCopy = () => {
    navigator.clipboard?.writeText(targetUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="google-review-modal-title"
      >
        {/* Backdrop click to close */}
        <div
          className="absolute inset-0"
          onClick={onClose}
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-sm bg-[#161618]/95 border border-white/16 rounded-3xl p-6 sm:p-7 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),0_24px_50px_-12px_rgba(0,0,0,0.8)] text-center overflow-hidden backdrop-blur-2xl"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/6 border border-white/10 text-[#86868b] hover:text-white flex items-center justify-center transition-colors text-xs"
            aria-label="Close modal"
          >
            ✕
          </button>

          {/* Google Icon Header */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="font-display font-medium text-[#f5f5f7] text-xs uppercase tracking-wider">
              Google Business Profile
            </span>
          </div>

          <h3
            id="google-review-modal-title"
            className="font-display text-xl font-semibold text-white mb-1 tracking-tight"
          >
            Review OPEN MNC
          </h3>

          <p className="text-[#86868b] text-xs mb-4 leading-relaxed">
            Scan the QR code with your phone camera or click below to leave a 5-star rating on Google.
          </p>

          {/* 5 Golden Stars */}
          <div className="flex justify-center items-center gap-1 mb-4 text-[#ff9500] text-lg tabular-nums" aria-label="5 out of 5 stars">
            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          </div>

          {/* Concentric QR Code Container: Outer 24px padding 8px -> inner 16px radius */}
          <div className="relative mx-auto w-44 h-44 bg-white p-3 rounded-2xl shadow-lg border border-white/20 flex flex-col items-center justify-center mb-4 group">
            <img
              src="/google-qr-code.png"
              alt="Scan QR code to review OPEN MNC on Google"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.src = '/google-review-card.png'
              }}
            />
          </div>

          <div className="text-[10px] text-[#86868b] uppercase tracking-wider font-medium mb-5">
            Verified Entity: OPEN MNC
          </div>

          {/* Primary Action Button */}
          <div className="space-y-2">
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="apple-btn-primary w-full text-xs font-semibold py-2.5"
            >
              Write a Google Review →
            </a>

            <button
              type="button"
              onClick={handleCopy}
              className="w-full py-1.5 text-xs text-[#86868b] hover:text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{copied ? '✓ Link copied!' : '🔗 Copy review link'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
