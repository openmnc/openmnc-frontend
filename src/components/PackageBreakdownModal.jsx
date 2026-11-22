import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, ShieldCheck, Clock, ArrowRight, MessageSquare, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { whatsappUrl } from '../utils/helpers.js'

export default function PackageBreakdownModal({ isOpen, onClose, selectedPackage, growthGuarantee, timelinePhases }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen || !selectedPackage) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-surface rounded-3xl border border-hairline shadow-2xl overflow-hidden flex flex-col z-10"
          role="dialog"
          aria-modal="true"
          aria-labelledby="breakdown-modal-title"
        >
          {/* Header */}
          <div className="p-6 sm:p-8 bg-subtle border-b border-hairline flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-wider mb-2">
                <span>{selectedPackage.badge || 'Package Breakdown'}</span>
              </div>
              <h3 id="breakdown-modal-title" className="type-h2 text-ink-primary">
                {selectedPackage.name}
              </h3>
              <p className="type-caption text-ink-secondary mt-1">
                Ideal for: {selectedPackage.best_for}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-full bg-white border border-hairline text-ink-secondary hover:text-ink-primary hover:bg-subtle transition-all cursor-pointer shadow-sm"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
            {/* Pricing Summary */}
            <div className="p-5 rounded-2xl bg-canvas border border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="type-meta text-ink-muted">Investment</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-ink-primary tracking-tight font-display">
                    {selectedPackage.monthly_price}
                  </span>
                  <span className="type-meta text-ink-secondary font-medium">
                    {selectedPackage.billing_period}
                  </span>
                </div>
                <span className="type-meta text-ink-muted block mt-0.5">
                  {selectedPackage.quarterly_total} (Inclusive of GST &amp; Invoicing)
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <Link
                  to={`/contact?intent=b2b&service=social-media-management&plan=${selectedPackage.plan_param}`}
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold uppercase tracking-wider text-center shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Inquire About This Plan</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={whatsappUrl(
                    '918509684056',
                    `Hi Amit! I want to consult regarding the ${selectedPackage.name} (${selectedPackage.monthly_price}/mo) plan.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-surface border border-hairline hover:bg-subtle text-ink-primary text-xs font-semibold text-center transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Deliverables Table */}
            <div>
              <h4 className="type-h3 text-ink-primary mb-3">
                Included Deliverables Breakdown
              </h4>
              <div className="rounded-2xl border border-hairline overflow-hidden bg-surface">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-subtle border-b border-hairline">
                    <tr>
                      <th className="py-3 px-4 font-bold text-ink-primary">Category</th>
                      <th className="py-3 px-4 font-bold text-ink-primary">Allocation / Feature</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline">
                    <tr>
                      <td className="py-3 px-4 font-medium text-ink-secondary">High-Retention Reels</td>
                      <td className="py-3 px-4 font-bold text-brand-primary">{selectedPackage.reels_count}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-ink-secondary">Static / Carousel Posts</td>
                      <td className="py-3 px-4 text-ink-primary">{selectedPackage.posts_count}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-ink-secondary">Instagram &amp; FB Stories</td>
                      <td className="py-3 px-4 text-ink-primary">{selectedPackage.stories_count}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-ink-secondary">Video Production Mode</td>
                      <td className="py-3 px-4 text-ink-primary font-semibold">{selectedPackage.shooting_mode}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-ink-secondary">Platform Access</td>
                      <td className="py-3 px-4 text-emerald-700 font-medium">100% Privacy-First Meta Business Suite (Zero Password Sharing)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Included Features Checklist */}
            <div>
              <h4 className="type-h3 text-ink-primary mb-3">
                Full Scope of Work
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedPackage.features?.map((feat, fi) => (
                  <div key={fi} className="p-3 rounded-xl bg-subtle border border-hairline flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="type-body text-ink-secondary leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Not Included / Clear Boundaries */}
            <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-2 text-amber-800">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono">
                  Clear Scope Boundaries (What&apos;s Not Included)
                </h4>
              </div>
              <ul className="text-xs sm:text-sm text-ink-secondary space-y-1.5 list-disc pl-5">
                <li>Paid ad spend budget (all plans focus strictly on organic compounding reach; ad spend is paid directly by client to Meta if opted).</li>
                <li>Physical actors/models fees if professional hired talent is requested beyond founder/staff on-camera presence.</li>
                <li>Guaranteed direct sales (we guarantee reach, impressions, and engagement; product-market fit, pricing, and sales closing remain founder responsibility).</li>
              </ul>
            </div>

            {/* 90-Day Execution Timeline */}
            {timelinePhases && timelinePhases.length > 0 && (
              <div>
                <h4 className="type-h3 text-ink-primary mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-primary" />
                  <span>Month 1–3 Execution Timeline</span>
                </h4>
                <div className="space-y-3">
                  {timelinePhases.map((phase, pi) => (
                    <div key={pi} className="p-4 rounded-xl bg-subtle border border-hairline">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-brand-primary font-mono uppercase">
                          {phase.phase}: {phase.title}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {phase.metric}
                        </span>
                      </div>
                      <p className="type-body text-ink-secondary text-xs sm:text-sm mb-2">
                        {phase.desc}
                      </p>
                      <div className="text-xs text-ink-primary font-medium bg-white p-2 rounded-lg border border-hairline">
                        <strong className="text-brand-primary">Expected Reality: </strong>
                        {phase.expectation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Accountable Guarantee */}
            {growthGuarantee && (
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                  <h4 className="type-h3 text-emerald-950">
                    {growthGuarantee.title}
                  </h4>
                </div>
                <p className="type-body text-ink-secondary text-xs sm:text-sm mb-3">
                  {growthGuarantee.summary}
                </p>
                <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs text-ink-secondary">
                  <strong className="text-emerald-900 block mb-1">The Mutual Partnership Condition:</strong>
                  {growthGuarantee.condition}
                </div>
              </div>
            )}
          </div>

          {/* Footer CTA */}
          <div className="p-4 sm:p-6 bg-subtle border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="type-meta text-ink-muted text-center sm:text-left">
              100% Privacy-First Meta Business Suite • Mutual NDA • Transparent Invoicing
            </span>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 sm:w-auto px-5 py-2.5 rounded-xl bg-white border border-hairline text-ink-secondary hover:text-ink-primary text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              <Link
                to={`/contact?intent=b2b&service=social-media-management&plan=${selectedPackage.plan_param}`}
                onClick={onClose}
                className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold uppercase tracking-wider text-center shadow-sm"
              >
                Inquire Now
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
