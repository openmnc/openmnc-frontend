import { motion } from 'framer-motion'
import {
  TrendingDown,
  TrendingUp,
  Percent,
  Database,
  ArrowRight,
  ShieldCheck,
  Zap,
  Bot,
  MessageSquare,
  Users,
  Smartphone,
  Server,
  DollarSign,
  Lock,
} from 'lucide-react'

// Diagram 1: Web & App Dev - 30% Aggregator Commission Leak vs Direct Platform
export function WebAppDevWorkflowDiagram() {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-hairline shadow-sm overflow-hidden my-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-hairline">
        <div>
          <span className="type-meta text-brand-primary uppercase tracking-wider block font-bold">
            Interactive Architecture Flow
          </span>
          <h4 className="type-h3 text-ink-primary">
            Aggregator Commission Leak vs. Direct Ordering System
          </h4>
        </div>
        <span className="type-meta px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary font-semibold self-start sm:self-auto">
          Save 20%–30% On Every Order
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: The Third-Party Aggregator Trap */}
        <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 font-mono">
              Third-Party Aggregator Trap
            </span>
            <TrendingDown className="w-4 h-4 text-amber-700" />
          </div>

          <div className="space-y-3.5">
            <div className="p-3 rounded-xl bg-white border border-amber-500/20 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 text-xs font-bold shrink-0">
                ₹100
              </div>
              <div className="text-xs">
                <p className="font-semibold text-ink-primary">Customer Pays</p>
                <p className="text-ink-secondary text-[11px]">Gross food or merchandise order</p>
              </div>
            </div>

            <div className="flex justify-center text-amber-600">
              <span className="text-xs font-mono font-bold">↓ 20% to 30% Platform Cut Deducted</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-amber-500/20 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-700 text-xs font-bold shrink-0">
                -₹30
              </div>
              <div className="text-xs">
                <p className="font-semibold text-red-700">Commission &amp; Hidden Fees</p>
                <p className="text-ink-secondary text-[11px]">Listing rank ad spend + delivery cut</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-100/60 border border-amber-500/30 flex items-center gap-3">
              <Lock className="w-5 h-5 text-amber-800 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-amber-900">Zero Customer Contact Access</p>
                <p className="text-amber-800 text-[11px]">Phone masked; no WhatsApp re-targeting possible</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: The OpenMNC Direct Engine */}
        <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-mono">
              OpenMNC Direct Platform
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>

          <div className="space-y-3.5">
            <div className="p-3 rounded-xl bg-white border border-emerald-500/20 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 text-xs font-bold shrink-0">
                ₹100
              </div>
              <div className="text-xs">
                <p className="font-semibold text-ink-primary">Customer Pays</p>
                <p className="text-ink-secondary text-[11px]">Direct via UPI, Razorpay, or Cash on Delivery</p>
              </div>
            </div>

            <div className="flex justify-center text-emerald-600">
              <span className="text-xs font-mono font-bold">↓ 0% Commission (Direct Bank Settlement)</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-emerald-500/20 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold shrink-0">
                ₹98+
              </div>
              <div className="text-xs">
                <p className="font-semibold text-emerald-700">Net Retained Margin</p>
                <p className="text-ink-secondary text-[11px]">You keep standard gross profit minus flat gateway fee (~1.8%)</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-100/60 border border-emerald-500/30 flex items-center gap-3">
              <Database className="w-5 h-5 text-emerald-800 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-emerald-900">100% Owned Customer Database</p>
                <p className="text-emerald-800 text-[11px]">Auto WhatsApp receipt + 1-click reorder loyalty loops</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Diagram 2: Social Media Management Funnel Flow
export function SocialMediaWorkflowDiagram() {
  const steps = [
    {
      num: '01',
      title: '0–3s Hook Interrupt',
      desc: 'Pattern-interrupt visual + on-screen caption to stop endless scroll.',
      badge: 'Attention',
    },
    {
      num: '02',
      title: 'Retention & Sound Design',
      desc: 'High-clarity denoised audio, 4K color grading, pacing under 30s.',
      badge: 'Watch Time',
    },
    {
      num: '03',
      title: 'Auto-DM & WhatsApp CTA',
      desc: 'Instant keyword reply ("MENU", "PRICE") delivers links in under 5 seconds.',
      badge: 'Conversion',
    },
    {
      num: '04',
      title: 'Walk-In & Repeat LTV',
      desc: 'Convert views into high-ticket store visits and loyal direct buyers.',
      badge: 'Footfall',
    },
  ]

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-hairline shadow-sm overflow-hidden my-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-hairline">
        <div>
          <span className="type-meta text-emerald-600 uppercase tracking-wider block font-bold">
            Organic Funnel Blueprint
          </span>
          <h4 className="type-h3 text-ink-primary">
            The 4-Step Viral Hook to In-Store Footfall Engine
          </h4>
        </div>
        <span className="type-meta px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold self-start sm:self-auto border border-emerald-200">
          Zero Ad Spend Required
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((st, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -3 }}
            className="p-5 rounded-2xl bg-subtle border border-hairline relative flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-brand-primary">
                  {st.num}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-hairline text-ink-secondary">
                  {st.badge}
                </span>
              </div>
              <h5 className="font-heading text-sm font-bold text-ink-primary mb-1.5">
                {st.title}
              </h5>
              <p className="type-caption text-ink-secondary leading-relaxed">
                {st.desc}
              </p>
            </div>

            {idx < steps.length - 1 && (
              <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-hairline">
                <ArrowRight className="w-4 h-4 text-ink-muted" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Diagram 3: Enterprise Automation Pipeline
export function AutomationWorkflowDiagram() {
  const steps = [
    {
      title: 'Trigger Event',
      desc: 'Inbound WhatsApp, website lead, or webhook trigger',
      icon: Zap,
    },
    {
      title: 'AI Multi-Agent Parser',
      desc: 'Validates phone, classifies intent, extracts requirements',
      icon: Bot,
    },
    {
      title: 'Instant CRM Sync',
      desc: 'Enriches lead profile in database without manual typing',
      icon: Server,
    },
    {
      title: 'Automated Response',
      desc: 'Custom quote or meeting link dispatched in <10 seconds',
      icon: MessageSquare,
    },
  ]

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-hairline shadow-sm overflow-hidden my-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-hairline">
        <div>
          <span className="type-meta text-purple-600 uppercase tracking-wider block font-bold">
            Autonomous Operations
          </span>
          <h4 className="type-h3 text-ink-primary">
            Autonomous Multi-Agent AI Pipeline
          </h4>
        </div>
        <span className="type-meta px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-semibold self-start sm:self-auto border border-purple-200">
          Save 20+ Hours/Week
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((st, idx) => {
          const Icon = st.icon
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-subtle border border-hairline relative"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 mb-3">
                <Icon className="w-5 h-5" />
              </div>
              <h5 className="font-heading text-sm font-bold text-ink-primary mb-1">
                {st.title}
              </h5>
              <p className="type-caption text-ink-secondary leading-relaxed">
                {st.desc}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
