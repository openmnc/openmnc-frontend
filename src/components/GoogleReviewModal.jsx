import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export const GOOGLE_PLACE_ID = 'ChIJu2lM2mMLAjoRMqerceA25dY'
export const DEFAULT_GOOGLE_REVIEW_URL = `https://search.google.com/local/writereview?placeid=${GOOGLE_PLACE_ID}`
export const DEFAULT_GOOGLE_PROFILE_URL = `https://local.google.com/place?placeid=${GOOGLE_PLACE_ID}&utm_medium=noren&utm_source=gbp&utm_campaign=2026`

export default function GoogleReviewModal({ isOpen, onClose, reviewUrl }) {
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState('qr') // 'qr' | 'badge'

  // If a custom URL is passed via admin settings, use it, otherwise use direct Google review link
  const targetReviewUrl = (reviewUrl && reviewUrl.trim()) ? reviewUrl.trim() : DEFAULT_GOOGLE_REVIEW_URL
  const targetProfileUrl = DEFAULT_GOOGLE_PROFILE_URL

  const handleCopy = () => {
    navigator.clipboard?.writeText(targetReviewUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
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
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-md bg-[#161618] border border-white/16 rounded-3xl p-6 sm:p-7 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),0_28px_60px_-12px_rgba(0,0,0,0.85)] text-center overflow-hidden"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/6 border border-white/10 text-[#86868b] hover:text-white flex items-center justify-center transition-colors text-sm"
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
            Review M/S. OPEN MNC LLP
          </h3>

          <p className="text-[#86868b] text-xs mb-3 leading-relaxed">
            Scan the official Google QR code below with your phone camera or click to open Google Reviews directly.
          </p>

          {/* 5 Golden Stars */}
          <div className="flex justify-center items-center gap-1.5 mb-4 text-[#ff9500] text-lg tabular-nums" aria-label="5 out of 5 stars">
            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            <span className="text-white text-xs font-semibold ml-1.5">5.0 Star Rating</span>
          </div>

          {/* Toggle View: QR Code vs Official Sticker Badge */}
          <div className="inline-flex items-center p-1 rounded-full bg-white/6 border border-white/10 mb-4 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('qr')}
              className={`px-3 py-1 rounded-full transition-all font-medium ${
                viewMode === 'qr'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-[#86868b] hover:text-white'
              }`}
            >
              Google QR
            </button>
            <button
              type="button"
              onClick={() => setViewMode('badge')}
              className={`px-3 py-1 rounded-full transition-all font-medium ${
                viewMode === 'badge'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-[#86868b] hover:text-white'
              }`}
            >
              Official Badge
            </button>
          </div>

          {/* QR Display Area */}
          <div className="relative mx-auto mb-4 group flex items-center justify-center">
            <a
              href={targetReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
              title="Click to write review directly"
            >
              {viewMode === 'qr' ? (
                <div className="w-52 h-52 bg-white p-3 rounded-2xl shadow-xl border border-white/20 flex flex-col items-center justify-center">
                  <img
                    src="/google-qr-framed.png"
                    alt="Official Google Business QR Code for OPEN MNC"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = '/google-qr-code.png'
                    }}
                  />
                </div>
              ) : (
                <div className="w-56 h-64 bg-white p-2 rounded-2xl shadow-xl border border-white/20 flex flex-col items-center justify-center overflow-hidden">
                  <img
                    src="/google-review-badge.png"
                    alt="Official Google Review Sticker Badge for OPEN MNC"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </a>
          </div>

          <div className="text-[11px] text-[#86868b] uppercase tracking-wider font-medium mb-4 flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#34A853] inline-block" />
            Verified Google Business Profile
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <a
              href={targetReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="apple-btn-primary w-full text-xs font-semibold py-2.5 block text-center"
            >
              Write a Google Review →
            </a>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={targetProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="apple-btn-secondary text-xs py-2 block text-center truncate"
              >
                View Profile ↗
              </a>
              <button
                type="button"
                onClick={handleCopy}
                className="apple-btn-secondary text-xs py-2 text-center"
              >
                {copied ? '✓ Copied!' : '🔗 Copy Link'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
