import { useState } from 'react'
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
  Lock,
  Cpu,
  ShoppingBag,
} from 'lucide-react'
import SEO from '../components/SEO.jsx'
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
  const [repeatRatio, setRepeatRatio] = useState(50)
  const [aggregatorRate, setAggregatorRate] = useState(28)

  const aggregatorCutPct = aggregatorRate / 100
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
      {/* SECTION A: HERO SECTION (LIGHT-FIRST EDITORIAL)                     */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-[85vh] flex items-center justify-center overflow-x-clip bg-canvas pt-32 pb-20"
        aria-label="Custom Web & App Solutions Hero"
      >
        <div className="absolute inset-0 bg-ambient-mesh pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow Pill */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-primary/20 bg-brand-primary/10 text-brand-primary text-xs font-bold tracking-wider uppercase mb-7 shadow-sm font-mono"
          >
            <Percent className="w-3.5 h-3.5 text-brand-primary" aria-hidden="true" />
            <span>Zero Commission Leaks · 100% Customer Data Ownership</span>
          </motion.div>

          {/* H1 Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="type-h1 text-ink-primary max-w-4xl mx-auto mb-6"
          >
            Stop Paying <span className="text-amber-600">30% Rent</span> on Your Own Customers.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.22 }}
            className="type-body text-ink-secondary text-base sm:text-xl leading-relaxed max-w-3xl mx-auto mb-10"
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
            <Link
              to="/contact?intent=b2b&service=custom-web-app-development"
              className="px-7 py-4 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md transition-all text-center"
            >
              Calculate Your Commission Savings (Book a Free Strategy Call) →
            </Link>
            <a
              href="#cloud-kitchen-math"
              className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-ink-primary bg-surface hover:bg-subtle border border-hairline shadow-sm transition-all flex items-center gap-2"
            >
              <span>See the Cloud Kitchen Math</span>
              <span className="text-brand-primary">↓</span>
            </a>
          </motion.div>

          {/* Trust Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="mt-12 pt-8 border-t border-hairline grid grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="type-caption text-ink-secondary font-medium">Save 20%–30% Commissions</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4 text-brand-primary shrink-0" />
              <span className="type-caption text-ink-secondary font-medium">100% Direct Customer Data</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="type-caption text-ink-secondary font-medium">Zero-Cost WhatsApp Retargeting</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="type-caption text-ink-secondary font-medium">Full Code &amp; IP Ownership</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION B: THE PROFIT LEAK (WHY AGGREGATORS KEEP YOU STUCK)        */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section
        className="py-20 px-4 bg-subtle border-y border-hairline"
        aria-label="The Profit Leak"
      >
        <div className="section-container max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="type-meta text-amber-700 font-bold uppercase tracking-wider block mb-2 font-mono">
              The Aggregator Middleman Tax
            </span>
            <h2 className="type-h2 text-ink-primary mb-4">
              Great Food &amp; Great Products Deserve Better Margins
            </h2>
            <p className="type-body text-ink-secondary text-sm sm:text-base leading-relaxed">
              If your cloud kitchen, restaurant, D2C brand, or pharma business is generating{' '}
              <span className="text-ink-primary font-bold">₹2 Lakh to ₹10 Lakh+</span> in monthly sales on
              third-party platforms, you already have a winning product. The problem isn&apos;t demand—it&apos;s
              the middleman tax:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-7 rounded-3xl bg-surface border border-hairline hover:border-red-500/40 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mb-5 text-red-600 font-bold text-lg font-mono">
                  30%
                </div>
                <h3 className="type-h3 text-ink-primary mb-2 group-hover:text-red-600 transition-colors">
                  20% to 30% Commission Cut
                </h3>
                <p className="type-caption text-ink-secondary leading-relaxed">
                  Every time a loyal customer reorders your food or product, you still pay the platform as if
                  they were a brand-new buyer. Why pay rent repeatedly for customers who already love you?
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-hairline type-caption text-red-700 font-semibold flex items-center gap-1.5">
                <span>Leaking ₹30k–₹1L+ monthly profit</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-7 rounded-3xl bg-surface border border-hairline hover:border-amber-500/40 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-5 text-amber-700">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="type-h3 text-ink-primary mb-2 group-hover:text-amber-700 transition-colors">
                  Zero Customer Data
                </h3>
                <p className="type-caption text-ink-secondary leading-relaxed">
                  Aggregators hide phone numbers, order habits, and preferences behind virtual masked numbers.
                  You cannot message, retarget, or reward your own buyers—they remain the platform&apos;s asset,
                  not yours.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-hairline type-caption text-amber-800 font-semibold flex items-center gap-1.5">
                <span>No direct retargeting possible</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-7 rounded-3xl bg-surface border border-hairline hover:border-brand-primary/40 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mb-5 text-brand-primary">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="type-h3 text-ink-primary mb-2 group-hover:text-brand-primary transition-colors">
                  Algorithm Dependency
                </h3>
                <p className="type-caption text-ink-secondary leading-relaxed">
                  One change in platform rankings, ad bidding, or delivery radius adjustments, and your daily
                  order count drops overnight. You are building your business on rented digital land.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-hairline type-caption text-brand-primary font-semibold flex items-center gap-1.5">
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
        className="py-24 px-4 bg-canvas relative overflow-hidden"
        aria-label="Cloud Kitchen Growth Hack"
      >
        <div className="section-container max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="type-meta text-emerald-700 font-bold uppercase tracking-wider block mb-2 font-mono">
              The &ldquo;Aha!&rdquo; Case Study
            </span>
            <h2 className="type-h2 text-ink-primary mb-4">
              Keep Swiggy &amp; Zomato for Discovery. Use Your Own Website for Profit.
            </h2>
            <p className="type-body text-ink-secondary text-sm sm:text-base leading-relaxed">
              You don&apos;t need to quit aggregators, and you don&apos;t need to burn money on ads. Here is
              the exact system we build for local food businesses and cloud kitchens:
            </p>
          </div>

          {/* 3 Growth Hack Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="p-6 rounded-3xl bg-surface border border-hairline shadow-sm relative">
              <span className="text-3xl font-extrabold text-ink-muted/30 absolute top-5 right-5 font-mono">01</span>
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mb-4 text-brand-primary">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="type-h3 text-ink-primary mb-2">Acquire on Aggregators</h3>
              <p className="type-caption text-ink-secondary leading-relaxed">
                Let Swiggy, Zomato, or Blinkit bring you first-time local customers. Treat third-party
                platforms strictly as discovery channels.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-surface border-2 border-brand-primary shadow-md relative">
              <span className="text-3xl font-extrabold text-brand-primary/30 absolute top-5 right-5 font-mono">02</span>
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mb-4 text-brand-primary">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="type-h3 text-ink-primary mb-2">The ₹1 Packaging Card Hack</h3>
              <p className="type-caption text-ink-secondary leading-relaxed">
                Print a simple, sharp insert card and drop it into every delivery bag:{' '}
                <span className="text-emerald-700 font-semibold">
                  &ldquo;Loved our food? Scan this QR to order directly from our website and get a FLAT 10% OFF
                  on every order.&rdquo;
                </span>
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-surface border border-hairline shadow-sm relative">
              <span className="text-3xl font-extrabold text-ink-muted/30 absolute top-5 right-5 font-mono">03</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4 text-emerald-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="type-h3 text-ink-primary mb-2">Compounding Direct Loyalty</h3>
              <p className="type-caption text-ink-secondary leading-relaxed">
                Customers save 10% and get direct WhatsApp updates. You eliminate the 25% aggregator commission,
                pocketing an extra 15% net profit margin on every repeat meal.
              </p>
            </div>
          </div>

          {/* Real Unit Economics Calculator Card */}
          <div className="p-6 sm:p-10 rounded-3xl bg-surface border border-hairline shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-hairline">
              <div>
                <span className="type-meta text-brand-primary font-bold uppercase tracking-wider block font-mono">
                  Interactive Unit Economics
                </span>
                <h3 className="type-h2 text-ink-primary">
                  The Cloud Kitchen Math: Live Commission Calculator
                </h3>
              </div>
              <div className="flex items-center gap-2 type-meta font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Simulate Your Monthly Savings</span>
              </div>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="type-caption font-semibold text-ink-primary block mb-2">
                  Monthly Total Sales (₹): <span className="text-brand-primary font-bold font-mono">{formatINR(monthlySales)}</span>
                </label>
                <input
                  type="range"
                  min={100000}
                  max={2000000}
                  step={25000}
                  value={monthlySales}
                  onChange={(e) => setMonthlySales(Number(e.target.value))}
                  className="w-full accent-brand-primary cursor-pointer"
                />
              </div>

              <div>
                <label className="type-caption font-semibold text-ink-primary block mb-2">
                  Aggregator Commission Cut (%): <span className="text-red-600 font-bold font-mono">{aggregatorRate}%</span>
                </label>
                <input
                  type="range"
                  min={18}
                  max={35}
                  step={1}
                  value={aggregatorRate}
                  onChange={(e) => setAggregatorRate(Number(e.target.value))}
                  className="w-full accent-red-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="type-caption font-semibold text-ink-primary block mb-2">
                  Repeat Orders Migrated to Direct (%): <span className="text-emerald-700 font-bold font-mono">{repeatRatio}%</span>
                </label>
                <input
                  type="range"
                  min={10}
                  max={60}
                  step={5}
                  value={repeatRatio}
                  onChange={(e) => setRepeatRatio(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Calculated Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-hairline">
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-center sm:text-left">
                <span className="type-meta text-red-700 font-bold block mb-1">Total Leaked to Aggregator</span>
                <span className="text-2xl font-extrabold text-red-700 font-mono">
                  {formatINR(pureAggregatorCommission)}/mo
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center sm:text-left">
                <span className="type-meta text-emerald-800 font-bold block mb-1">Extra Monthly Profit Saved</span>
                <span className="text-2xl font-extrabold text-emerald-800 font-mono">
                  +{formatINR(extraMonthlyProfit)}/mo
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 text-center sm:text-left">
                <span className="type-meta text-brand-primary font-bold block mb-1">Yearly Added Bottom-Line</span>
                <span className="text-2xl font-extrabold text-brand-primary font-mono">
                  +{formatINR(extraYearlyProfit)}/yr
                </span>
              </div>
            </div>

            {/* The Result Box */}
            <div className="mt-8 p-5 rounded-2xl bg-subtle border border-hairline flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="type-h3 text-ink-primary">
                  The Result: Your custom website pays for itself within the first 2 to 3 months.
                </p>
                <p className="type-caption text-ink-secondary mt-0.5">
                  And keeps adding ₹3L–₹5L+ in pure profit to your pocket every year after that.
                </p>
              </div>
              <Link
                to="/contact?intent=b2b&service=custom-web-app-development"
                className="px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs uppercase tracking-wider transition-all shrink-0 shadow-md"
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
        className="py-24 px-4 bg-subtle border-y border-hairline"
        aria-label="Built for D2C Brands & Enterprises"
      >
        <div className="section-container max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="type-meta text-brand-primary font-bold uppercase tracking-wider block mb-2 font-mono">
              Beyond Food &amp; Restaurants
            </span>
            <h2 className="type-h2 text-ink-primary mb-4">
              Own Your Customers, Your Data, and Your Retargeting
            </h2>
            <p className="type-body text-ink-secondary text-sm sm:text-base leading-relaxed">
              Selling physical products on Amazon, Flipkart, Zepto, or Blinkit—or running a
              pharmaceutical/distribution network? A custom mobile app and web platform gives you what
              marketplaces never will:{' '}
              <span className="text-ink-primary font-bold">total business intelligence.</span>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* 1. Complete Customer Database */}
            <div className="p-7 rounded-3xl bg-surface border border-hairline hover:border-brand-primary/30 shadow-sm transition-all flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0 mt-1">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h3 className="type-h3 text-ink-primary mb-2">
                  Complete Customer Database
                </h3>
                <p className="type-caption text-ink-secondary leading-relaxed">
                  Capture verified names, phone numbers, addresses, and full order histories. No masked
                  buyer details or restricted communication walls.
                </p>
              </div>
            </div>

            {/* 2. Deep Behavioral Analytics */}
            <div className="p-7 rounded-3xl bg-surface border border-hairline hover:border-purple-500/30 shadow-sm transition-all flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0 mt-1">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="type-h3 text-ink-primary mb-2">
                  Deep Behavioral Analytics
                </h3>
                <p className="type-caption text-ink-secondary leading-relaxed">
                  Know who buys every 30 days, what products they pair together, and who only buys when a
                  discount coupon is active. Make inventory choices backed by your actual data.
                </p>
              </div>
            </div>

            {/* 3. Near-Zero Cost Retargeting */}
            <div className="p-7 rounded-3xl bg-surface border border-hairline hover:border-emerald-500/30 shadow-sm transition-all flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 mt-1">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="type-h3 text-ink-primary mb-2">
                  Near-Zero Cost Retargeting
                </h3>
                <p className="type-caption text-ink-secondary leading-relaxed">
                  Stop paying marketplaces to reach your own buyers. Send targeted WhatsApp reminders, push
                  notifications, or refill alerts directly to the right customer segment at a fraction of ad
                  costs.
                </p>
              </div>
            </div>

            {/* 4. Direct Dispatch & Reliability */}
            <div className="p-7 rounded-3xl bg-surface border border-hairline hover:border-amber-500/30 shadow-sm transition-all flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 mt-1">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="type-h3 text-ink-primary mb-2">
                  Direct Dispatch &amp; Reliability
                </h3>
                <p className="type-caption text-ink-secondary leading-relaxed">
                  Control your packaging, delivery experience, and brand trust from checkout to doorstep. No
                  damage claims or arbitrary seller suspensions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION E: SMARTER SOFTWARE ECONOMICS (LIGHT-FIRST)                 */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section
        className="py-24 px-4 bg-canvas"
        aria-label="Engineering Standards & Pricing"
      >
        <div className="section-container max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="type-meta text-emerald-700 font-bold uppercase tracking-wider block mb-2 font-mono">
              Smarter Software Economics
            </span>
            <h2 className="type-h2 text-ink-primary mb-4">
              Enterprise-Grade Tech. Smart, Competitive Pricing.
            </h2>
            <p className="type-body text-ink-secondary text-sm sm:text-base leading-relaxed">
              Most traditional software agencies charge ₹80,000 to ₹1,00,000+ for a standard business
              website—and even more for mobile apps—while handing you a slow, generic template with zero growth
              strategy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="p-7 rounded-3xl bg-surface border border-hairline shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="type-h3 text-ink-primary mb-2">
                Same (or Better) Specs, Smarter Investment
              </h3>
              <p className="type-caption text-ink-secondary leading-relaxed">
                High-speed modern architecture, custom UI/UX, secure payment gateways, and near-zero monthly
                server overhead—priced competitively for growing Indian businesses.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-7 rounded-3xl bg-surface border border-hairline shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="type-h3 text-ink-primary mb-2">
                Built-In SEO &amp; AI-Era Readiness
              </h3>
              <p className="type-caption text-ink-secondary leading-relaxed">
                Every platform we ship is structured with clean code, fast load times, and semantic SEO so Google
                and AI assistants actively discover and recommend your brand locally.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-7 rounded-3xl bg-surface border border-hairline shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="type-h3 text-ink-primary mb-2">
                Business-First Execution
              </h3>
              <p className="type-caption text-ink-secondary leading-relaxed">
                We don&apos;t just write code and disappear. We help you structure your discount hooks, QR
                packaging cards, analytics dashboards, and retention loops so the software actually makes you
                money.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION F: DARK CONTRAST BAND 1: HOW WE BUILD (MAX 2 RULE)         */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section
        className="py-24 px-4 bg-subtle text-ink-primary border-y border-hairline shadow-sm relative overflow-hidden"
        aria-label="3-Step Build Process"
      >
        <div className="section-container max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="type-meta text-brand-primary font-bold uppercase tracking-wider block mb-2 font-mono">
              Structured Roadmap
            </span>
            <h2 className="type-h2 text-ink-primary mb-4">
              How We Build Your Growth Engine
            </h2>
            <p className="type-body text-ink-secondary text-sm sm:text-base">
              A transparent, battle-tested 3-stage process from your first order audit to full customer migration:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-surface border border-hairline shadow-sm relative hover:shadow-md transition-shadow">
              <span className="text-4xl font-extrabold text-ink-muted/20 absolute top-6 right-6 font-mono">01</span>
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="type-h3 text-ink-primary mb-3">
                Business &amp; Margin Audit
              </h3>
              <p className="type-caption text-ink-secondary leading-relaxed">
                We analyze your current order volume, platform commissions, and repeat-buyer potential to map
                out the exact ROI before a single line of code is written.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-surface border border-hairline shadow-sm relative hover:shadow-md transition-shadow">
              <span className="text-4xl font-extrabold text-ink-muted/20 absolute top-6 right-6 font-mono">02</span>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 mb-6">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="type-h3 text-ink-primary mb-3">
                Custom Engineering &amp; Analytics Setup
              </h3>
              <p className="type-caption text-ink-secondary leading-relaxed">
                We design and develop your branded website or mobile app (iOS/Android) with integrated customer
                databases, coupon engines, and local SEO baked in from day one.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-surface border border-hairline shadow-sm relative hover:shadow-md transition-shadow">
              <span className="text-4xl font-extrabold text-ink-muted/20 absolute top-6 right-6 font-mono">03</span>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-status-success mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="type-h3 text-ink-primary mb-3">
                Launch &amp; Customer Migration
              </h3>
              <p className="type-caption text-ink-secondary leading-relaxed">
                We help you roll out your QR insert strategy, Google Business integration, and retargeting
                workflows so repeat orders start shifting to your platform immediately.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/contact?intent=b2b&service=custom-web-app-development"
              className="inline-block px-8 py-4 rounded-xl bg-white text-ink-primary hover:bg-subtle font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
            >
              Book Your Free Commission &amp; Margin Audit →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SECTION G: MAKING GOOGLE & AI ENGINES RECOMMEND YOU (AEO FAQ)     */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section
        className="py-24 px-4 bg-canvas"
        aria-label="Frequently Asked Questions & AI Search Answers"
      >
        <div className="section-container max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="type-meta text-brand-primary font-bold uppercase tracking-wider block mb-2 font-mono">
              AEO Knowledge Base
            </span>
            <h2 className="type-h2 text-ink-primary mb-3">
              Frequently Asked Questions
            </h2>
            <p className="type-body text-ink-secondary text-xs sm:text-sm">
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
                  className="rounded-3xl border border-hairline bg-surface shadow-sm overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-subtle transition-colors cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="type-h3 text-ink-primary">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-ink-muted transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-brand-primary' : ''
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
                        className="px-5 pb-6 sm:px-6 type-body text-ink-secondary text-xs sm:text-sm leading-relaxed border-t border-hairline pt-4"
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
      {/* SECTION H: DARK CONTRAST BAND 2: CROSS-DISCOVERY BANNER            */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section
        className="py-12 px-4 bg-subtle border-t border-hairline text-ink-primary"
        aria-label="Cross-Discovery Service Link"
      >
        <div className="section-container max-w-4xl mx-auto">
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-hairline flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="text-center sm:text-left">
              <span className="type-meta text-emerald-700 font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 inline-block mb-2 font-mono">
                Cross-Vertical Growth
              </span>
              <h3 className="type-h3 text-ink-primary mb-1">
                Need Traffic for Your New Platform?
              </h3>
              <p className="type-body text-ink-secondary text-xs sm:text-sm max-w-lg">
                Pair your custom ordering platform with organic Hook-Retention-CTA Reels and local footfall
                systems that drive repeat orders on autopilot.
              </p>
            </div>
            <Link
              to="/services/social-media-management"
              className="px-6 py-3.5 rounded-xl bg-status-success hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap shadow-md flex items-center gap-2 group shrink-0"
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
