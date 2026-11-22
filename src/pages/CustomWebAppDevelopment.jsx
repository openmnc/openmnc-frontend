import { useState, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  Percent,
  Database,
  Users,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Zap,
  BarChart3,
  MessageSquare,
  QrCode,
  CheckCircle2,
  DollarSign,
  Layers,
  ArrowUpRight,
  Lock,
  Cpu,
  ShoppingBag,
  Flame,
} from 'lucide-react'
import SEO from '../components/SEO.jsx'
import ThreeBackground from '../components/ThreeBackground.jsx'
import GlowButton from '../components/GlowButton.jsx'
import { whatsappUrl } from '../utils/helpers.js'

// FAQ Data from Blueprint
const AEO_FAQS = [
  {
    q: 'How can a cloud kitchen in India reduce Swiggy and Zomato commissions?',
    a: 'The most effective method is a hybrid model: keep Swiggy and Zomato for new customer discovery, and include a printed QR card inside every delivery order offering a flat 10% discount on direct orders through your own custom ordering website. Shifting just 40%–50% of repeat orders to your own platform saves 15%–20% in net margins immediately.',
  },
  {
    q: 'How much does it cost to maintain a custom ordering website or D2C app every month?',
    a: 'Unlike subscription-heavy SaaS builders that charge high monthly fees or per-order commissions, our custom-engineered platforms are built on optimized modern cloud infrastructure, keeping your monthly running costs close to zero while giving you 100% ownership of the code and database.',
  },
  {
    q: 'Why should D2C and pharma brands build their own app if they already sell on Amazon and Flipkart?',
    a: 'Marketplaces do not share customer contact details or behavioral data. Having your own mobile app and web store gives you full analytics—tracking repeat purchase cycles, product preferences, and coupon usage—allowing you to retarget loyal customers directly via push notifications and WhatsApp at almost zero marketing cost.',
  },
  {
    q: 'What makes your custom software development different from standard ₹80,000–₹1,00,000 agency websites?',
    a: 'Instead of delivering a static brochure website at inflated agency rates, we deliver high-performance, SEO- and AI-optimized revenue systems at a competitive price—complete with customer analytics, conversion funnels, and local visibility strategies built in from day one.',
  },
]

// Structured Data for Google & AI Engine Optimization (AEO)
const customWebAppServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': 'https://openmnc.com/solutions/custom-web-app-development#service',
  name: 'Custom Web & App Development for Cloud Kitchens & D2C Brands',
  alternateName: 'Direct Ordering Websites & D2C Mobile Apps to Stop Aggregator Commissions',
  description:
    'Turn aggregator customers into loyal direct buyers. OpenMNC builds custom ordering websites, D2C mobile apps, and analytics systems that save 20–30% in commissions and give you 100% customer data ownership.',
  url: 'https://openmnc.com/solutions/custom-web-app-development',
  provider: {
    '@type': 'Organization',
    name: 'OpenMNC LLP',
    url: 'https://openmnc.com',
    logo: 'https://openmnc.com/logo.webp',
  },
  serviceType: 'E-Commerce & Food Ordering Software Development',
  areaServed: [
    { '@type': 'Country', name: 'India' },
    { '@type': 'Country', name: 'Worldwide' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Custom Web & App Growth Systems',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Direct Food Ordering Platform for Cloud Kitchens',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'D2C E-Commerce Mobile App & Customer Database',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Automated WhatsApp Retargeting & Coupon Engine',
        },
      },
    ],
  },
}

const customWebAppFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: AEO_FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
  })),
}

export default function CustomWebAppDevelopment() {
  const [openFaq, setOpenFaq] = useState(null)
  
  // Interactive Monthly Math Simulator
  const [monthlySales, setMonthlySales] = useState(400000)
  const [repeatRatio, setRepeatRatio] = useState(50) // percentage shifting to direct

  // Dynamic calculations based on formula
  const aggregatorCutPct = 0.28
  const directDiscountPct = 0.10

  const pureAggregatorCommission = Math.round(monthlySales * aggregatorCutPct)
  const pureAggregatorNet = monthlySales - pureAggregatorCommission

  const directPortion = Math.round(monthlySales * (repeatRatio / 100))
  const remainingAggregatorPortion = monthlySales - directPortion
  const hybridAggregatorCommission = Math.round(remainingAggregatorPortion * aggregatorCutPct)
  const hybridDirectDiscount = Math.round(directPortion * directDiscountPct)
  const hybridNet = monthlySales - hybridAggregatorCommission - hybridDirectDiscount
  const extraMonthlyProfit = hybridNet - pureAggregatorNet
  const extraYearlyProfit = extraMonthlyProfit * 12

  const formatINR = (val) =>
    '₹' + Number(val).toLocaleString('en-IN')

  return (
    <>
      <SEO
        title="Custom Web & App Development for Cloud Kitchens & D2C Brands | Stop Paying 30% Commissions"
        description="Turn aggregator customers into loyal direct buyers. We build custom ordering websites, D2C mobile apps, and analytics systems that save 20–30% in commissions and give you 100% customer data ownership."
        canonical="/solutions/custom-web-app-development"
        keywords="reduce Swiggy Zomato commission, D2C app development India, own ordering website, cloud kitchen online ordering system, food delivery website development, D2C e-commerce platform, pharma distribution app, stop paying 30 percent commission, OpenMNC"
        schema={[customWebAppServiceSchema, customWebAppFaqSchema]}
      />

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION A: HERO SECTION (ABOVE THE FOLD)                           */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-hero-gradient pt-28 pb-20"
        aria-label="Custom Web & App Solutions Hero"
      >
        <ThreeBackground section="hero" />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#000000]/60 to-[#000000] pointer-events-none" aria-hidden="true" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-radial from-[#2997ff]/12 via-[#ff9500]/6 to-transparent blur-3xl pointer-events-none" aria-hidden="true" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow Pill */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#2997ff]/30 bg-[#2997ff]/10 text-[#2997ff] text-xs font-semibold tracking-wider uppercase mb-7 shadow-sm"
          >
            <Percent className="w-3.5 h-3.5 text-[#2997ff]" aria-hidden="true" />
            <span>Zero Commission Leaks · 100% Customer Data Ownership</span>
          </motion.div>

          {/* H1 Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.12] tracking-tight text-white mb-6"
          >
            Stop Paying <span className="text-[#ff9500]">30% Rent</span> on Your Own Customers.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.22 }}
            className="text-[#d2d2d7] text-base sm:text-xl leading-relaxed max-w-3xl mx-auto mb-10 font-normal"
          >
            Marketplaces like Swiggy, Zomato, Amazon, and Flipkart are great for finding new buyers—but
            terrible for keeping them. We engineer custom ordering websites and mobile apps that turn
            marketplace shoppers into your direct, repeat customers with zero commission leaks.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <GlowButton
              to="/contact?intent=b2b&service=custom-web-app-development"
              variant="primary"
              className="text-xs sm:text-sm px-7 py-4 font-semibold tracking-wide"
            >
              Calculate Your Commission Savings (Book a Free Strategy Call) →
            </GlowButton>
            <a
              href="#cloud-kitchen-math"
              className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-medium text-white/90 hover:text-white bg-white/6 hover:bg-white/10 border border-white/12 transition-all flex items-center gap-2"
            >
              <span>See the Cloud Kitchen Math</span>
              <span className="text-[#2997ff]">↓</span>
            </a>
          </motion.div>

          {/* Trust Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="mt-12 pt-8 border-t border-white/8 grid grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs text-gray-300">Save 20%–30% Commissions</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4 text-[#2997ff] shrink-0" />
              <span className="text-xs text-gray-300">100% Direct Customer Data</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs text-gray-300">Zero-Cost WhatsApp Retargeting</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-[#ff9500] shrink-0" />
              <span className="text-xs text-gray-300">Full Code &amp; IP Ownership</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION B: THE PROFIT LEAK (WHY AGGREGATORS KEEP YOU STUCK)        */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section
        className="py-20 px-4 bg-[#0a0a0c] border-y border-white/6"
        aria-label="The Profit Leak"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#ff9500] uppercase tracking-wider block mb-2">
              The Aggregator Middleman Tax
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white mb-4">
              Great Food &amp; Great Products Deserve Better Margins
            </h2>
            <p className="text-[#a1a1a6] text-sm sm:text-base leading-relaxed">
              If your cloud kitchen, restaurant, D2C brand, or pharma business is generating{' '}
              <span className="text-white font-semibold">₹2 Lakh to ₹10 Lakh+</span> in monthly sales on
              third-party platforms, you already have a winning product. The problem isn&apos;t demand—it&apos;s
              the middleman tax:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-7 rounded-2xl bg-[#161618] border border-white/10 hover:border-red-500/40 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5 text-red-400 font-bold text-lg">
                  30%
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                  20% to 30% Commission Cut
                </h3>
                <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                  Every time a loyal customer reorders your food or product, you still pay the platform as if
                  they were a brand-new buyer. Why pay rent repeatedly for customers who already love you?
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/6 text-[11px] text-red-400/90 font-medium flex items-center gap-1.5">
                <span>Leaking ₹30k–₹1L+ monthly profit</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-7 rounded-2xl bg-[#161618] border border-white/10 hover:border-amber-400/40 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5 text-amber-400">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                  Zero Customer Data
                </h3>
                <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                  Aggregators hide phone numbers, order habits, and preferences behind virtual masked numbers.
                  You cannot message, retarget, or reward your own buyers—they remain the platform&apos;s asset,
                  not yours.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/6 text-[11px] text-amber-400/90 font-medium flex items-center gap-1.5">
                <span>No direct retargeting possible</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-7 rounded-2xl bg-[#161618] border border-white/10 hover:border-[#2997ff]/40 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#2997ff]/10 border border-[#2997ff]/20 flex items-center justify-center mb-5 text-[#2997ff]">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2 group-hover:text-[#2997ff] transition-colors">
                  Algorithm Dependency
                </h3>
                <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                  One change in platform rankings, ad bidding, or delivery radius adjustments, and your daily
                  order count drops overnight. You are building your business on rented digital land.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/6 text-[11px] text-[#2997ff]/90 font-medium flex items-center gap-1.5">
                <span>Vulnerable to platform policy changes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION C: THE "AHA!" CASE STUDY — THE CLOUD KITCHEN GROWTH HACK  */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section
        id="cloud-kitchen-math"
        className="py-24 px-4 bg-[#000000] relative overflow-hidden"
        aria-label="Cloud Kitchen Growth Hack"
      >
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">
              The &ldquo;Aha!&rdquo; Case Study
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white mb-4">
              Keep Swiggy &amp; Zomato for Discovery. Use Your Own Website for Profit.
            </h2>
            <p className="text-[#a1a1a6] text-sm sm:text-base leading-relaxed">
              You don&apos;t need to quit aggregators, and you don&apos;t need to burn money on ads. Here is
              the exact system we build for local food businesses and cloud kitchens:
            </p>
          </div>

          {/* 3 Growth Hack Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="p-6 rounded-2xl bg-[#161618] border border-white/10 relative">
              <span className="text-3xl font-extrabold text-white/20 absolute top-5 right-5 font-mono">01</span>
              <div className="w-10 h-10 rounded-xl bg-white/6 border border-white/10 flex items-center justify-center mb-4 text-[#2997ff]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-bold text-white mb-2">Acquire on Aggregators</h3>
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                Let Swiggy, Zomato, or Blinkit bring you first-time local customers. Treat third-party
                platforms strictly as discovery channels.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#161618] border border-[#2997ff]/40 shadow-[0_0_25px_rgba(41,151,255,0.12)] relative">
              <span className="text-3xl font-extrabold text-[#2997ff]/40 absolute top-5 right-5 font-mono">02</span>
              <div className="w-10 h-10 rounded-xl bg-[#2997ff]/20 border border-[#2997ff]/40 flex items-center justify-center mb-4 text-[#2997ff]">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-bold text-white mb-2">The ₹1 Packaging Card Hack</h3>
              <p className="text-xs sm:text-sm text-[#d2d2d7] leading-relaxed">
                Print a simple, sharp insert card and drop it into every delivery bag:{' '}
                <span className="text-emerald-400 font-medium">
                  &ldquo;Loved our food? Scan this QR to order directly from our website and get a FLAT 10% OFF
                  on every order.&rdquo;
                </span>
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#161618] border border-white/10 relative">
              <span className="text-3xl font-extrabold text-white/20 absolute top-5 right-5 font-mono">03</span>
              <div className="w-10 h-10 rounded-xl bg-white/6 border border-white/10 flex items-center justify-center mb-4 text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-bold text-white mb-2">Convert &amp; Keep Forever</h3>
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                Customers love saving 10% (plus avoiding inflated menu prices and platform fees). You save the
                25%–30% commission. Both sides win.
              </p>
            </div>
          </div>

          {/* ══════ THE EXACT MONTHLY MATH TABLE ══════ */}
          <div className="rounded-3xl bg-[#161618] border border-white/12 p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <span className="text-xs font-bold text-[#2997ff] uppercase tracking-wider block">
                  The Blueprint Verification
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white mt-1">
                  The Monthly Math (Example: Cloud Kitchen doing ₹4,00,000/month)
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap self-start sm:self-auto">
                <Flame className="w-3.5 h-3.5" /> +₹4,32,000 / year Extra Profit
              </span>
            </div>

            {/* Responsive Table Container */}
            <div className="overflow-x-auto mt-6">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-[#86868b] font-medium text-xs uppercase tracking-wider">
                    <th className="py-3 px-3">Metric</th>
                    <th className="py-3 px-3 text-red-300">100% on Aggregators</th>
                    <th className="py-3 px-3 text-emerald-300 bg-emerald-500/5 rounded-t-xl">
                      Hybrid Model (50% Repeat Orders on Your Website)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/6 text-gray-200">
                  <tr className="hover:bg-white/2 transition-colors">
                    <td className="py-3.5 px-3 font-medium text-white">Monthly Gross Orders</td>
                    <td className="py-3.5 px-3 font-mono">₹4,00,000</td>
                    <td className="py-3.5 px-3 font-mono text-emerald-400 bg-emerald-500/5">
                      ₹4,00,000 <span className="text-[#86868b] text-xs font-sans">(₹2L Aggregator + ₹2L Direct)</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/2 transition-colors">
                    <td className="py-3.5 px-3 font-medium text-white">Aggregator Commission (~28%)</td>
                    <td className="py-3.5 px-3 font-mono text-red-400">-₹1,12,000</td>
                    <td className="py-3.5 px-3 font-mono text-emerald-400 bg-emerald-500/5">
                      -₹56,000 <span className="text-[#86868b] text-xs font-sans">(only on new/aggregator orders)</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/2 transition-colors">
                    <td className="py-3.5 px-3 font-medium text-white">Direct Customer 10% Discount</td>
                    <td className="py-3.5 px-3 font-mono">₹0</td>
                    <td className="py-3.5 px-3 font-mono text-amber-400 bg-emerald-500/5">
                      -₹20,000 <span className="text-[#86868b] text-xs font-sans">(your customer&apos;s incentive to switch)</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/2 transition-colors">
                    <td className="py-3.5 px-3 font-medium text-white">Monthly Platform Running Cost</td>
                    <td className="py-3.5 px-3 font-mono">₹0</td>
                    <td className="py-3.5 px-3 font-mono text-gray-300 bg-emerald-500/5">
                      Near-Zero <span className="text-[#86868b] text-xs font-sans">(lightweight, optimized cloud hosting)</span>
                    </td>
                  </tr>
                  <tr className="border-t-2 border-white/20 font-bold bg-white/2">
                    <td className="py-4 px-3 text-white">Net Revenue Retained</td>
                    <td className="py-4 px-3 font-mono text-white">₹2,88,000</td>
                    <td className="py-4 px-3 font-mono text-white text-base bg-emerald-500/10">
                      ₹3,24,000
                    </td>
                  </tr>
                  <tr className="bg-emerald-500/10 font-extrabold text-emerald-400 border-t border-emerald-500/30">
                    <td className="py-4 px-3 text-white">Extra Profit Saved</td>
                    <td className="py-4 px-3 text-gray-400">—</td>
                    <td className="py-4 px-3 font-mono text-base sm:text-lg">
                      +₹36,000 / month <span className="text-xs text-emerald-300 font-sans block sm:inline sm:ml-2">(+₹4,32,000 / year)</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Interactive Slider Extension */}
            <div className="mt-8 pt-6 border-t border-white/10 bg-white/2 p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-white uppercase tracking-wider">
                  Test With Your Own Monthly Revenue:
                </span>
                <span className="text-sm font-bold text-[#2997ff] font-mono">
                  {formatINR(monthlySales)} / mo
                </span>
              </div>
              <input
                type="range"
                min="100000"
                max="2000000"
                step="50000"
                value={monthlySales}
                onChange={(e) => setMonthlySales(Number(e.target.value))}
                className="w-full accent-[#2997ff] h-2 bg-white/10 rounded-lg cursor-pointer"
                aria-label="Monthly Sales Slider"
              />
              <div className="flex items-center justify-between text-[11px] text-[#86868b] mt-1.5 font-mono">
                <span>₹1,00,000</span>
                <span>₹10,00,000</span>
                <span>₹20,00,000</span>
              </div>

              <div className="mt-4 pt-4 border-t border-white/6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-white/4">
                  <span className="text-[11px] text-[#86868b] block">Current 28% Commission Leak</span>
                  <span className="text-sm font-bold text-red-400 font-mono">
                    {formatINR(pureAggregatorCommission)}/mo
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-[11px] text-emerald-400 font-medium block">Extra Monthly Profit Saved</span>
                  <span className="text-base font-extrabold text-emerald-400 font-mono">
                    +{formatINR(extraMonthlyProfit)}/mo
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#2997ff]/10 border border-[#2997ff]/20">
                  <span className="text-[11px] text-[#2997ff] font-medium block">Yearly Added Bottom-Line</span>
                  <span className="text-base font-extrabold text-[#2997ff] font-mono">
                    +{formatINR(extraYearlyProfit)}/yr
                  </span>
                </div>
              </div>
            </div>

            {/* The Result Box */}
            <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-[#2997ff]/15 to-emerald-500/15 border border-emerald-500/30 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm sm:text-base font-bold text-white">
                  The Result: Your custom website pays for itself within the first 2 to 3 months.
                </p>
                <p className="text-xs sm:text-sm text-emerald-300/90 mt-0.5">
                  And keeps adding ₹3L–₹5L+ in pure profit to your pocket every year after that.
                </p>
              </div>
              <Link
                to="/contact?intent=b2b&service=custom-web-app-development"
                className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-gray-200 transition-colors shrink-0 shadow-lg"
              >
                Start Saving Now →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION D: BUILT FOR D2C BRANDS, E-COMMERCE & PHARMA ENTERPRISES   */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section
        className="py-24 px-4 bg-[#0a0a0c] border-y border-white/6"
        aria-label="Built for D2C Brands & Enterprises"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#2997ff] uppercase tracking-wider block mb-2">
              Beyond Food &amp; Restaurants
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white mb-4">
              Own Your Customers, Your Data, and Your Retargeting
            </h2>
            <p className="text-[#a1a1a6] text-sm sm:text-base leading-relaxed">
              Selling physical products on Amazon, Flipkart, Zepto, or Blinkit—or running a
              pharmaceutical/distribution network? A custom mobile app and web platform gives you what
              marketplaces never will:{' '}
              <span className="text-white font-semibold">total business intelligence.</span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* 1. Complete Customer Database */}
            <div className="p-7 rounded-2xl bg-[#161618] border border-white/10 hover:border-white/20 transition-all flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#2997ff]/10 border border-[#2997ff]/20 flex items-center justify-center text-[#2997ff] shrink-0 mt-1">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-white mb-2">
                  Complete Customer Database
                </h3>
                <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                  Capture verified names, phone numbers, addresses, and full order histories. No masked
                  buyer details or restricted communication walls.
                </p>
              </div>
            </div>

            {/* 2. Deep Behavioral Analytics */}
            <div className="p-7 rounded-2xl bg-[#161618] border border-white/10 hover:border-white/20 transition-all flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 mt-1">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-white mb-2">
                  Deep Behavioral Analytics
                </h3>
                <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                  Know who buys every 30 days, what products they pair together, and who only buys when a
                  discount coupon is active. Make inventory choices backed by your actual data.
                </p>
              </div>
            </div>

            {/* 3. Near-Zero Cost Retargeting */}
            <div className="p-7 rounded-2xl bg-[#161618] border border-white/10 hover:border-white/20 transition-all flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-1">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-white mb-2">
                  Near-Zero Cost Retargeting
                </h3>
                <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                  Stop paying marketplaces to reach your own buyers. Send targeted WhatsApp reminders, push
                  notifications, or refill alerts directly to the right customer segment at a fraction of ad
                  costs.
                </p>
              </div>
            </div>

            {/* 4. Direct Dispatch & Reliability */}
            <div className="p-7 rounded-2xl bg-[#161618] border border-white/10 hover:border-white/20 transition-all flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-1">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-white mb-2">
                  Direct Dispatch &amp; Reliability
                </h3>
                <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                  Control your packaging, delivery experience, and brand trust from checkout to doorstep. No
                  damage claims or arbitrary seller suspensions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION E: PREMIUM ENGINEERING WITHOUT INFLATED AGENCY FEES        */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section
        className="py-24 px-4 bg-[#000000]"
        aria-label="Engineering Standards & Pricing"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">
              Smarter Software Economics
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white mb-4">
              Enterprise-Grade Tech. Smart, Competitive Pricing.
            </h2>
            <p className="text-[#a1a1a6] text-sm sm:text-base leading-relaxed">
              Most traditional software agencies charge ₹80,000 to ₹1,00,000+ for a standard business
              website—and even more for mobile apps—while handing you a slow, generic template with zero growth
              strategy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="p-7 rounded-2xl bg-[#161618] border border-white/10 hover:border-white/20 transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#2997ff]/10 border border-[#2997ff]/20 flex items-center justify-center text-[#2997ff] mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-bold text-white mb-2">
                Same (or Better) Specs, Smarter Investment
              </h3>
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                High-speed modern architecture, custom UI/UX, secure payment gateways, and near-zero monthly
                server overhead—priced competitively for growing Indian businesses.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-7 rounded-2xl bg-[#161618] border border-white/10 hover:border-white/20 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-bold text-white mb-2">
                Built-In SEO &amp; AI-Era Readiness
              </h3>
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                Every platform we ship is structured with clean code, fast load times, and semantic SEO so Google
                and AI assistants actively discover and recommend your brand locally.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-7 rounded-2xl bg-[#161618] border border-white/10 hover:border-white/20 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-bold text-white mb-2">
                Business-First Execution
              </h3>
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                We don&apos;t just write code and disappear. We help you structure your discount hooks, QR
                packaging cards, analytics dashboards, and retention loops so the software actually makes you
                money.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION F: HOW WE BUILD YOUR GROWTH ENGINE                        */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section
        className="py-24 px-4 bg-[#0a0a0c] border-y border-white/6"
        aria-label="3-Step Build Process"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#ff9500] uppercase tracking-wider block mb-2">
              Structured Roadmap
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white mb-4">
              How We Build Your Growth Engine
            </h2>
            <p className="text-[#a1a1a6] text-sm sm:text-base">
              A transparent, battle-tested 3-stage process from your first order audit to full customer migration:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="p-8 rounded-2xl bg-[#161618] border border-white/10 relative">
              <span className="text-4xl font-extrabold text-white/10 absolute top-6 right-6 font-mono">01</span>
              <div className="w-12 h-12 rounded-xl bg-[#2997ff]/10 border border-[#2997ff]/20 flex items-center justify-center text-[#2997ff] mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-3">
                Business &amp; Margin Audit
              </h3>
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                We analyze your current order volume, platform commissions, and repeat-buyer potential to map
                out the exact ROI before a single line of code is written.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-2xl bg-[#161618] border border-white/10 relative">
              <span className="text-4xl font-extrabold text-white/10 absolute top-6 right-6 font-mono">02</span>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-3">
                Custom Engineering &amp; Analytics Setup
              </h3>
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                We design and develop your branded website or mobile app (iOS/Android) with integrated customer
                databases, coupon engines, and local SEO baked in from day one.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-2xl bg-[#161618] border border-white/10 relative">
              <span className="text-4xl font-extrabold text-white/10 absolute top-6 right-6 font-mono">03</span>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-white mb-3">
                Launch &amp; Customer Migration
              </h3>
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                We help you roll out your QR insert strategy, Google Business integration, and retargeting
                workflows so repeat orders start shifting to your platform immediately.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <GlowButton
              to="/contact?intent=b2b&service=custom-web-app-development"
              variant="primary"
              className="text-xs sm:text-sm px-8 py-4 font-semibold"
            >
              Book Your Free Commission &amp; Margin Audit →
            </GlowButton>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION G: MAKING GOOGLE & AI ENGINES RECOMMEND YOU (AEO FAQ)     */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section
        className="py-24 px-4 bg-[#000000]"
        aria-label="Frequently Asked Questions & AI Search Answers"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#2997ff] uppercase tracking-wider block mb-2">
              AEO Knowledge Base
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-[#a1a1a6] text-xs sm:text-sm">
              Authoritative answers curated for founders, Googlebot, and AI assistants (ChatGPT, Gemini,
              Perplexity):
            </p>
          </div>

          <div className="space-y-4">
            {AEO_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-[#161618] overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-white/2 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-sm sm:text-base font-semibold text-white">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#86868b] transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-[#2997ff]' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-5 pb-6 sm:px-6 text-xs sm:text-sm text-[#a1a1a6] leading-relaxed border-t border-white/6 pt-4"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* CROSS-DISCOVERY BANNER: NEED TRAFFIC FOR YOUR NEW PLATFORM?        */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section
        className="py-12 px-4 bg-[#0a0a0c] border-t border-white/8"
        aria-label="Cross-Discovery Service Link"
      >
        <div className="max-w-4xl mx-auto">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#161618] via-[#1c1c1e] to-[#161618] border border-white/12 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="text-center sm:text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-block mb-2">
                Cross-Vertical Growth
              </span>
              <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-1">
                Need Traffic for Your New Platform?
              </h3>
              <p className="text-xs sm:text-sm text-[#86868b] max-w-lg">
                Pair your custom ordering platform with organic Hook-Retention-CTA Reels and local footfall
                systems that drive repeat orders on autopilot.
              </p>
            </div>
            <Link
              to="/services/social-media-management"
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap shadow-lg flex items-center gap-2 group"
            >
              <span>Explore Social Media Growth</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
