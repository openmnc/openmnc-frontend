import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  Phone,
  Building2,
  Bot,
  MessageSquare,
  Star,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  Zap,
  CheckCircle2,
  ArrowRight,
  Check,
} from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal.jsx'
import SEO from '../components/SEO.jsx'
import GoogleReviewModal from '../components/GoogleReviewModal.jsx'
import apiClient from '../api/client.js'
import { settingsApi } from '../api/settings.js'
import { whatsappUrl } from '../utils/helpers.js'
import { localBusinessSchema } from '../utils/jsonld.js'

// ─── Reusable chip components ────────────────────────────────────────────────

function RadioChips({ name, options, register, watch, color = 'blue' }) {
  const val = watch(name)
  const colorMap = {
    blue:    { active: 'bg-blue-600 text-white border-blue-600', hover: 'hover:border-blue-300 hover:text-blue-600' },
    amber:   { active: 'bg-amber-500 text-white border-amber-500', hover: 'hover:border-amber-300 hover:text-amber-600' },
    emerald: { active: 'bg-emerald-600 text-white border-emerald-600', hover: 'hover:border-emerald-300 hover:text-emerald-600' },
  }
  const c = colorMap[color] || colorMap.blue
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <label key={opt.value} className="cursor-pointer">
          <input type="radio" {...register(name)} value={opt.value} className="sr-only" />
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-body font-medium border transition-all cursor-pointer
            ${val === opt.value ? c.active + ' shadow-sm' : `bg-white text-slate-600 border-slate-200 ${c.hover}`}`}>
            {opt.label}
          </span>
        </label>
      ))}
    </div>
  )
}

function CheckboxChips({ options, selected, onChange, color = 'blue' }) {
  const colorMap = {
    blue:    { active: 'bg-blue-600 text-white border-blue-600' },
    emerald: { active: 'bg-emerald-600 text-white border-emerald-600' },
  }
  const c = colorMap[color] || colorMap.blue
  const toggle = (val) => {
    onChange(selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val])
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button key={opt} type="button" onClick={() => toggle(opt)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-medium border transition-all
            ${selected.includes(opt) ? c.active : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'}`}>
          {selected.includes(opt) && <Check className="w-3 h-3" strokeWidth={2.5} />}
          {opt}
        </button>
      ))}
    </div>
  )
}

const inputCls = 'w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm font-body focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all'
const selectCls = 'w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-body focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 appearance-none cursor-pointer'
const labelCls = 'block text-sm font-medium font-body text-slate-700 mb-1.5'
const fieldGroupCls = 'space-y-5 pt-4 border-t border-slate-100'

// ─── Service-specific dynamic field panels ───────────────────────────────────

function FieldsCustomDev({ register, watch }) {
  return (
    <motion.div key="custom-dev" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className={fieldGroupCls}>
      <div>
        <label className={labelCls}>App Type</label>
        <RadioChips name="app_type" options={[{ value: 'web', label: 'Web App' }, { value: 'mobile', label: 'Mobile App' }, { value: 'both', label: 'Both' }]} register={register} watch={watch} />
      </div>
      <div>
        <label className={labelCls}>Your Industry</label>
        <select {...register('industry')} className={selectCls}>
          <option value="">Select your industry</option>
          <option value="cloud_kitchen">Cloud Kitchen / Restaurant</option>
          <option value="d2c_brand">D2C Brand / E-commerce</option>
          <option value="pharma">Pharma / Medical</option>
          <option value="real_estate">Real Estate / PropTech</option>
          <option value="retail">Retail / Shop</option>
          <option value="healthcare">Healthcare / Clinic</option>
          <option value="education">Education / EdTech</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Budget Range</label>
          <select {...register('budget_range')} className={selectCls}>
            <option value="₹25k – ₹75k">₹25,000 – ₹75,000 (MVP / Audit)</option>
            <option value="₹75k – ₹2.5L">₹75,000 – ₹2,50,000 (Full Build)</option>
            <option value="₹2.5L – ₹10L">₹2.5L – ₹10L (SaaS / Scaling)</option>
            <option value="₹10L+">₹10L+ (Enterprise)</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Target Timeline</label>
          <select {...register('project_timeline')} className={selectCls}>
            <option value="Immediate (&lt; 2 weeks)">Immediate (&lt; 2 weeks)</option>
            <option value="1 – 2 Months">1 – 2 Months</option>
            <option value="3 – 6 Months">3 – 6 Months</option>
            <option value="Exploratory / Planning">Exploratory / Planning</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelCls}>Existing App?</label>
        <RadioChips name="has_existing_app" options={[{ value: 'no', label: 'No, Greenfield' }, { value: 'yes', label: 'Yes, Needs Redesign' }]} register={register} watch={watch} />
      </div>
      <label className="flex items-start gap-2.5 cursor-pointer text-sm text-slate-700 font-body">
        <input type="checkbox" defaultChecked {...register('wants_nda')} className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
        <span>Request mutual NDA before sharing project details or repository.</span>
      </label>
    </motion.div>
  )
}

function FieldsSocialMedia({ register, watch }) {
  const [platforms, setPlatforms] = useState(['Instagram'])
  return (
    <motion.div key="social" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className={fieldGroupCls}>
      <div>
        <label className={labelCls}>Platforms <span className="text-slate-400 font-normal">(select all that apply)</span></label>
        <CheckboxChips options={['Instagram', 'Facebook', 'YouTube', 'LinkedIn']} selected={platforms} onChange={setPlatforms} color="emerald" />
        <input type="hidden" {...register('platforms')} value={platforms.join(', ')} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Business Type</label>
          <select {...register('business_type')} className={selectCls}>
            <option value="">Select type</option>
            <option value="restaurant_cafe">Restaurant / Cafe</option>
            <option value="bakery">Bakery / Desserts</option>
            <option value="real_estate">Real Estate</option>
            <option value="d2c_brand">D2C Brand / Products</option>
            <option value="fitness">Fitness / Wellness</option>
            <option value="retail_shop">Retail Shop</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Monthly Budget</label>
          <select {...register('budget_range')} className={selectCls}>
            <option value="₹8k – ₹15k">₹8,000 – ₹15,000 / month</option>
            <option value="₹15k – ₹30k">₹15,000 – ₹30,000 / month</option>
            <option value="₹30k – ₹60k">₹30,000 – ₹60,000 / month</option>
            <option value="₹60k+">₹60,000+ / month</option>
          </select>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Current Followers (across platforms)</label>
          <select {...register('current_followers')} className={selectCls}>
            <option value="0 – 1k">0 – 1,000</option>
            <option value="1k – 10k">1,000 – 10,000</option>
            <option value="10k – 50k">10,000 – 50,000</option>
            <option value="50k+">50,000+</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Primary Goal</label>
          <select {...register('social_goal')} className={selectCls}>
            <option value="footfall">Drive Footfall / Walk-ins</option>
            <option value="online_orders">Boost Online Orders</option>
            <option value="brand_awareness">Brand Awareness</option>
            <option value="lead_gen">Lead Generation</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelCls}>Raw Footage / Content Available?</label>
        <RadioChips name="has_footage" options={[{ value: 'yes', label: 'Yes, we shoot content' }, { value: 'no', label: 'No, need full production' }]} register={register} watch={watch} color="emerald" />
      </div>
    </motion.div>
  )
}

function FieldsVibeAudit({ register, watch }) {
  const [problems, setProblems] = useState([])
  return (
    <motion.div key="vibe" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className={fieldGroupCls}>
      <div>
        <label className={labelCls}>AI Tool Used to Build the App</label>
        <RadioChips name="ai_tool_used" options={[
          { value: 'Cursor', label: 'Cursor' }, { value: 'Lovable', label: 'Lovable' },
          { value: 'Bolt.new', label: 'Bolt.new' }, { value: 'Replit', label: 'Replit' },
          { value: 'v0.dev', label: 'v0.dev' }, { value: 'Other', label: 'Other' }
        ]} register={register} watch={watch} />
      </div>
      <div>
        <label className={labelCls}>Current Hosting</label>
        <select {...register('current_hosting')} className={selectCls}>
          <option value="">Select hosting</option>
          <option value="Vercel">Vercel</option>
          <option value="Railway">Railway</option>
          <option value="Supabase">Supabase</option>
          <option value="Firebase">Firebase</option>
          <option value="AWS / GCP">AWS / GCP</option>
          <option value="Render">Render</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label className={labelCls}>Main Problem(s) <span className="text-slate-400 font-normal">(select all that apply)</span></label>
        <CheckboxChips
          options={['Broken Authentication', 'Exposed API Keys', 'App Crashes / Slow', 'Payment Issues', 'App Store Rejected']}
          selected={problems}
          onChange={setProblems}
        />
        <input type="hidden" {...register('main_problems')} value={problems.join(', ')} />
      </div>
      <div>
        <label className={labelCls}>GitHub / Code Access Possible?</label>
        <RadioChips name="github_access" options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No, will arrange' }]} register={register} watch={watch} />
      </div>
    </motion.div>
  )
}

function FieldsAppStore({ register, watch }) {
  const appStatus = watch('app_status')
  return (
    <motion.div key="appstore" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className={fieldGroupCls}>
      <div>
        <label className={labelCls}>Target Platform</label>
        <RadioChips name="platform" options={[
          { value: 'ios', label: 'iOS App Store' }, { value: 'android', label: 'Google Play Store' }, { value: 'both', label: 'Both' }
        ]} register={register} watch={watch} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>App Status</label>
          <select {...register('app_status')} className={selectCls}>
            <option value="ready">Ready to submit</option>
            <option value="rejected">Previously rejected</option>
            <option value="in_progress">Build in progress</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Developer Account</label>
          <select {...register('developer_account')} className={selectCls}>
            <option value="mine">Yes, mine</option>
            <option value="client">Yes, client's account</option>
            <option value="need_help">Need help creating one</option>
          </select>
        </div>
      </div>
      {appStatus === 'rejected' && (
        <div>
          <label className={labelCls}>Rejection Reason (from Apple / Google)</label>
          <textarea rows={3} {...register('rejection_reason')} placeholder="e.g. Guideline 4.2.2 — Minimum Functionality, or describe the rejection email..." className={inputCls + ' resize-none'} />
        </div>
      )}
    </motion.div>
  )
}

function FieldsTransfer({ register }) {
  return (
    <motion.div key="transfer" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className={fieldGroupCls}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Source Platform / Stack</label>
          <input {...register('source_platform')} placeholder="e.g. Firebase, AWS, Shopify" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Destination Platform</label>
          <input {...register('destination_platform')} placeholder="e.g. Supabase, GCP, Custom" className={inputCls} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Database Size Estimate</label>
          <select {...register('db_size')} className={selectCls}>
            <option value="&lt; 1 GB">&lt; 1 GB</option>
            <option value="1 – 10 GB">1 – 10 GB</option>
            <option value="10 – 100 GB">10 – 100 GB</option>
            <option value="100 GB+">100 GB+</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Active Users to Migrate</label>
          <select {...register('active_users')} className={selectCls}>
            <option value="&lt; 1,000">&lt; 1,000</option>
            <option value="1k – 10k">1,000 – 10,000</option>
            <option value="10k – 100k">10,000 – 100,000</option>
            <option value="100k+">100,000+</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelCls}>Deadline Urgency</label>
        <select {...register('project_timeline')} className={selectCls}>
          <option value="ASAP – Legal/Acquisition">ASAP — Legal / Acquisition in progress</option>
          <option value="Planned 1–3 months">Planned (1–3 months)</option>
          <option value="Exploratory">Exploratory / No fixed date</option>
        </select>
      </div>
    </motion.div>
  )
}

function FieldsAutomation({ register, watch }) {
  const [tools, setTools] = useState([])
  return (
    <motion.div key="automation" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className={fieldGroupCls}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Your Industry</label>
          <select {...register('industry')} className={selectCls}>
            <option value="">Select industry</option>
            <option value="ecommerce">E-commerce / Retail</option>
            <option value="real_estate">Real Estate / PropTech</option>
            <option value="healthcare">Healthcare</option>
            <option value="finance">Finance / FinTech</option>
            <option value="hr">HR / Recruitment</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Team Size</label>
          <RadioChips name="team_size" options={[
            { value: 'Solo', label: 'Solo' }, { value: '2–10', label: '2–10' },
            { value: '11–50', label: '11–50' }, { value: '50+', label: '50+' }
          ]} register={register} watch={watch} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Manual Process to Automate</label>
        <textarea rows={3} {...register('process_to_automate')} placeholder="Describe the repetitive manual task — e.g. 'We manually copy leads from WhatsApp to our CRM every day'" className={inputCls + ' resize-none'} />
      </div>
      <div>
        <label className={labelCls}>Tools Currently Used <span className="text-slate-400 font-normal">(select all)</span></label>
        <CheckboxChips
          options={['Sheets / Excel', 'CRM (Zoho/HubSpot)', 'WhatsApp', 'Email', 'Custom Software', 'Other']}
          selected={tools}
          onChange={setTools}
        />
        <input type="hidden" {...register('current_tools')} value={tools.join(', ')} />
      </div>
    </motion.div>
  )
}

function FieldsGenericB2B({ register }) {
  return (
    <motion.div key="generic-b2b" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className={fieldGroupCls}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Estimated Budget</label>
          <select {...register('budget_range')} className={selectCls}>
            <option value="₹25k – ₹75k">₹25,000 – ₹75,000</option>
            <option value="₹75k – ₹2.5L">₹75,000 – ₹2,50,000</option>
            <option value="₹2.5L – ₹10L">₹2.5L – ₹10L</option>
            <option value="₹10L+">₹10L+ (Enterprise)</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Target Timeline</label>
          <select {...register('project_timeline')} className={selectCls}>
            <option value="Immediate (&lt; 2 weeks)">Immediate (&lt; 2 weeks)</option>
            <option value="1 – 2 Months">1 – 2 Months</option>
            <option value="Exploratory / Planning">Exploratory / Planning</option>
          </select>
        </div>
      </div>
      <label className="flex items-start gap-2.5 cursor-pointer text-sm text-slate-700 font-body">
        <input type="checkbox" defaultChecked {...register('wants_nda')} className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
        <span>Request mutual NDA before sharing project details.</span>
      </label>
    </motion.div>
  )
}

// ─── Main service router ──────────────────────────────────────────────────────

function DynamicB2BFields({ register, watch }) {
  const serviceInterest = watch('service_interest')
  const renderFields = () => {
    switch (serviceInterest) {
      case 'custom-software-and-scalable-app-development':
      case 'inhouse-products':
        return <FieldsCustomDev register={register} watch={watch} />
      case 'social-media-management':
        return <FieldsSocialMedia register={register} watch={watch} />
      case 'vibe-coded-app-audit-and-fixing':
        return <FieldsVibeAudit register={register} watch={watch} />
      case 'app-store-play-store-publishing-and-approval':
        return <FieldsAppStore register={register} watch={watch} />
      case 'app-transfer-and-database-migration':
        return <FieldsTransfer register={register} />
      case 'business-automation':
        return <FieldsAutomation register={register} watch={watch} />
      default:
        return <FieldsGenericB2B register={register} />
    }
  }
  return <AnimatePresence mode="wait">{renderFields()}</AnimatePresence>
}

// ─── Main page component ──────────────────────────────────────────────────────

export default function Contact() {
  const [searchParams] = useSearchParams()
  const initialIntent = searchParams.get('intent') === 'student' ? 'student' : 'b2b'
  const initialService = searchParams.get('service') || ''
  const initialPlan = searchParams.get('plan') || ''
  const aiReferral = searchParams.get('ref') || searchParams.get('source') || ''

  const [activeTab, setActiveTab] = useState(initialIntent)
  const [submitState, setSubmitState] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [reviewUrl, setReviewUrl] = useState('')

  useEffect(() => {
    settingsApi.getAll().then((res) => {
      if (res.data?.google_review_url) setReviewUrl(res.data.google_review_url)
    }).catch(() => {})
  }, [])

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    defaultValues: {
      lead_type: initialIntent,
      service_interest: initialService || 'custom-software-and-scalable-app-development',
      wants_nda: true,
    },
  })

  useEffect(() => { setValue('lead_type', activeTab) }, [activeTab, setValue])
  useEffect(() => { if (initialService) setValue('service_interest', initialService) }, [initialService, setValue])
  useEffect(() => {
    if (initialPlan) {
      const formatted = initialPlan.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      setValue('message', `Inquiring about ${formatted} plan for Social Media Management & Organic Growth.`)
    }
  }, [initialPlan, setValue])

  async function onSubmit(data) {
    setSubmitState('submitting')
    setErrorMsg('')
    try {
      const payload = {
        ...data,
        lead_type: activeTab,
        referrer_url: typeof window !== 'undefined' ? window.location.href : '',
        ai_source: aiReferral || (document.referrer.includes('chatgpt') ? 'chatgpt' : document.referrer.includes('google') ? 'google' : 'direct'),
      }
      await apiClient.post('/contact', payload)
      setSubmitState('success')
      reset()
    } catch (err) {
      setErrorMsg(err?.response?.data?.detail || 'Something went wrong. Please reach out via WhatsApp directly.')
      setSubmitState('error')
    }
  }

  return (
    <>
      <SEO
        title="Contact OpenMNC LLP — Book a Free Strategy Call | Kolkata, India"
        description="Contact OpenMNC LLP for custom web/app development, social media management, or free student career guidance. Direct WhatsApp +91 8509684056. HQ Kolkata, serving worldwide."
        canonical="/contact"
        keywords="contact OpenMNC, OpenMNC phone number, software consultation Kolkata, AI consultation, student guidance contact, college admission subsidy"
        schema={localBusinessSchema}
      />

      {/* Page Hero — Warm Creamy Light theme */}
      <section className="pt-32 pb-14 px-4 bg-canvas" aria-label="Contact OpenMNC">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-[11px] text-brand-primary font-semibold tracking-widest uppercase mb-4 block font-body">
            Worldwide &amp; Domestic Inquiries · HQ West Bengal, India
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-ink-primary mb-4 leading-tight tracking-tight">
            Let&apos;s Build Your <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">Vision</span>
          </h1>
          <p className="text-ink-secondary text-lg md:text-xl max-w-2xl mx-auto font-body leading-relaxed">
            Direct routing to specialized advisors — whether you are a founder building software,
            a business owner scaling online, or a student claiming college subsidies.
          </p>

          {(initialService || aiReferral) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-body font-medium"
            >
              <Bot className="w-4 h-4 text-blue-600 shrink-0" aria-hidden="true" />
              <span>
                Recommended by AI for <strong>{initialService.replace(/-/g, ' ') || 'Specialized Solutions'}</strong> — form pre-filled below.
              </span>
            </motion.div>
          )}
        </div>
      </section>

      <main className="bg-subtle py-0 pb-20 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-14">

          {/* Left Column — Contact Info */}
          <aside className="lg:col-span-4 pt-8" aria-label="Contact information">
            <ScrollReveal>
              <h2 className="font-display text-xl font-bold text-slate-900 mb-5">Direct Channels</h2>
            </ScrollReveal>

            <div className="space-y-3 mb-6">
              {[
                { icon: <Mail className="w-4 h-4 text-blue-600 shrink-0" strokeWidth={1.5} />, label: 'Inquiries Email', value: 'hello@openmnc.com', href: 'mailto:hello@openmnc.com' },
                { icon: <Phone className="w-4 h-4 text-blue-600 shrink-0" strokeWidth={1.5} />, label: 'Founder Direct', value: '+91 8509684056', href: 'tel:+918509684056' },
                { icon: <Building2 className="w-4 h-4 text-blue-600 shrink-0" strokeWidth={1.5} />, label: 'Headquarters', value: 'Kolkata, West Bengal, India', href: null },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-[0_1px_3px_rgba(15,23,42,0.06)] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 uppercase tracking-wide font-body font-medium">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-slate-900 text-sm hover:text-blue-600 transition-colors font-body font-medium">{item.value}</a>
                    ) : (
                      <p className="text-slate-900 text-sm font-body font-medium">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp */}
            <a
              href={whatsappUrl('918509684056', `Hi Amit! I want to consult regarding ${activeTab === 'student' ? 'Student Guidance / College Subsidy' : 'B2B Solutions & Custom Apps'}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 w-full px-5 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-body font-semibold transition-all mb-4 shadow-[0_4px_16px_rgba(16,185,129,0.3)]"
            >
              <MessageSquare className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
              <span>Chat Directly on WhatsApp</span>
            </a>

            {/* Google Review */}
            <div className="p-5 rounded-2xl bg-white border border-amber-200 text-center mb-4">
              <span className="text-amber-400 text-base block mb-1">★★★★★</span>
              <p className="text-slate-900 text-sm font-body font-bold mb-1">Google Business Profile</p>
              <p className="text-slate-500 text-xs font-body mb-3">Rate OPEN MNC or read verified client reviews.</p>
              <button
                type="button"
                onClick={() => setReviewModalOpen(true)}
                className="w-full py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-xs font-body font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" aria-hidden="true" />
                <span>Review Us on Google</span>
              </button>
            </div>

            {/* Guarantee box */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 text-sm text-slate-600 font-body space-y-2">
              <p className="text-slate-900 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" strokeWidth={1.5} aria-hidden="true" />
                <span>Our Guarantee:</span>
              </p>
              <p>• Zero spam — only relevant contact about your inquiry.</p>
              <p>• Strict mutual NDA before sharing repo or business details.</p>
              <p>• 100% Free Consultation for all 12th-pass students.</p>
              <p>• Direct conversation with senior engineering leadership.</p>
            </div>
          </aside>

          {/* Right Column — Form */}
          <section className="lg:col-span-8 pt-8" aria-label="Enquiry Form">
            <ScrollReveal direction="left">
              <div className="bg-white border border-slate-200 shadow-[0_1px_3px_rgba(15,23,42,0.08),0_4px_16px_rgba(15,23,42,0.06)] rounded-2xl p-6 sm:p-8">

                {/* Intent Tabs */}
                <div className="flex border-b border-slate-100 mb-7 pb-4 gap-2 overflow-x-auto">
                  {[
                    { key: 'b2b', icon: <Briefcase className="w-3.5 h-3.5" strokeWidth={1.5} />, label: 'B2B & Founders' },
                    { key: 'student', icon: <GraduationCap className="w-3.5 h-3.5" strokeWidth={1.5} />, label: 'Student Guidance' },
                    { key: 'general', icon: <Zap className="w-3.5 h-3.5" strokeWidth={1.5} />, label: 'General Inquiry' },
                  ].map(tab => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-body font-semibold uppercase tracking-wide transition-all flex items-center gap-2 whitespace-nowrap ${
                        activeTab === tab.key
                          ? tab.key === 'student' ? 'bg-amber-500 text-white shadow-sm' : tab.key === 'general' ? 'bg-slate-800 text-white' : 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-50 text-slate-500 hover:text-slate-800 border border-slate-200'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {submitState === 'success' ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-14"
                    >
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-blue-600" strokeWidth={1.5} aria-hidden="true" />
                      </div>
                      <h3 className="font-display text-2xl font-bold text-slate-900 mb-2">Inquiry Received!</h3>
                      <p className="text-slate-600 font-body text-sm max-w-md mx-auto mb-6">
                        {activeTab === 'student'
                          ? 'Our counselors will review your details and reach out within 24 hours about your college subsidy and guidance options.'
                          : 'Our solutions team will analyze your project and schedule a discovery call with founder Amit Barai within 1 business day.'}
                      </p>
                      <button onClick={() => setSubmitState('idle')} className="text-blue-600 text-xs font-body font-semibold hover:underline flex items-center gap-1 mx-auto">
                        <ArrowRight className="w-3.5 h-3.5 rotate-180" strokeWidth={1.5} />
                        Submit Another Inquiry
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key={activeTab}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-5"
                    >
                      {/* Always-visible: Name + Email */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>Full Name <span className="text-red-500">*</span></label>
                          <input
                            {...register('name', { required: 'Name is required' })}
                            placeholder="Amit Barai"
                            className={inputCls}
                          />
                          {errors.name && <p className="text-red-500 text-[11px] mt-1 font-body">{errors.name.message}</p>}
                        </div>
                        <div>
                          <label className={labelCls}>Email Address <span className="text-red-500">*</span></label>
                          <input
                            type="email"
                            {...register('email', { required: 'Email is required' })}
                            placeholder="you@example.com"
                            className={inputCls}
                          />
                          {errors.email && <p className="text-red-500 text-[11px] mt-1 font-body">{errors.email.message}</p>}
                        </div>
                      </div>

                      <div>
                        <label className={labelCls}>Phone / WhatsApp</label>
                        <input type="tel" {...register('phone')} placeholder="+91 85096 84056" className={inputCls} />
                      </div>

                      {/* ─── B2B TAB ─── */}
                      {activeTab === 'b2b' && (
                        <>
                          <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                            <div>
                              <label className={labelCls}>Company / Startup Name</label>
                              <input {...register('company_name')} placeholder="e.g. Acme Tech / Stealth" className={inputCls} />
                            </div>
                            <div>
                              <label className={labelCls}>Service Interest <span className="text-red-500">*</span></label>
                              <select {...register('service_interest', { required: true })} className={selectCls}>
                                <optgroup label="B2B Growth Systems">
                                  <option value="custom-software-and-scalable-app-development">Custom Web & App Development</option>
                                  <option value="social-media-management">Social Media Management</option>
                                </optgroup>
                                <optgroup label="Specialized Engineering">
                                  <option value="vibe-coded-app-audit-and-fixing">Vibe-Coded App Audit & Fixing</option>
                                  <option value="app-store-play-store-publishing-and-approval">App Store / Play Store Publishing</option>
                                  <option value="app-transfer-and-database-migration">App Transfer & Database Migration</option>
                                  <option value="business-automation">Business Automation & AI Workflows</option>
                                  <option value="app-maintenance-and-support">App Maintenance & AMC</option>
                                </optgroup>
                                <optgroup label="Other">
                                  <option value="inhouse-products">In-House Products Partnership</option>
                                </optgroup>
                              </select>
                            </div>
                          </div>

                          {/* Dynamic fields based on selected service */}
                          <DynamicB2BFields register={register} watch={watch} />
                        </>
                      )}

                      {/* ─── STUDENT TAB ─── */}
                      {activeTab === 'student' && (
                        <div className={fieldGroupCls}>
                          <div>
                            <label className={labelCls}>Current Education Level</label>
                            <select {...register('education_level')} className={selectCls}>
                              <option value="Currently in 12th">Currently in 12th grade</option>
                              <option value="12th Pass (this year)">12th Pass — this year</option>
                              <option value="12th Pass (prev year)">12th Pass — previous year</option>
                              <option value="Diploma Student">Diploma Student</option>
                              <option value="Undergraduate">Undergraduate (B.Tech / BCA / BSc)</option>
                            </select>
                          </div>
                          <div>
                            <label className={labelCls}>Your Stream</label>
                            <RadioChips name="stream" options={[
                              { value: 'Science (PCM)', label: 'Science (PCM)' },
                              { value: 'Science (PCB)', label: 'Science (PCB)' },
                              { value: 'Commerce', label: 'Commerce' },
                              { value: 'Arts', label: 'Arts / Humanities' },
                            ]} register={register} watch={watch} color="amber" />
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className={labelCls}>Interested Field</label>
                              <select {...register('preferred_field')} className={selectCls}>
                                <option value="">Select field</option>
                                <option value="Computer Science / IT">Computer Science / IT</option>
                                <option value="Electronics / Robotics / IoT">Electronics / Robotics / IoT</option>
                                <option value="AI & Data Science">AI & Data Science</option>
                                <option value="Mechanical Engineering">Mechanical Engineering</option>
                                <option value="Business / MBA">Business / MBA</option>
                                <option value="I need guidance to decide">I need guidance to decide</option>
                              </select>
                            </div>
                            <div>
                              <label className={labelCls}>Annual Fee Budget</label>
                              <select {...register('fee_budget')} className={selectCls}>
                                <option value="Under ₹60k/yr">Under ₹60,000/yr</option>
                                <option value="₹60k – ₹1.5L/yr">₹60,000 – ₹1,50,000/yr</option>
                                <option value="₹1.5L – ₹3L/yr">₹1,50,000 – ₹3,00,000/yr</option>
                                <option value="Above ₹3L/yr">Above ₹3,00,000/yr</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className={labelCls}>Your State & City</label>
                            <input {...register('location')} placeholder="e.g. West Bengal, Kolkata" className={inputCls} />
                          </div>
                          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2.5">
                            <label className="flex items-start gap-2.5 cursor-pointer text-sm text-slate-700 font-body">
                              <input type="checkbox" defaultChecked {...register('interested_in_college_subsidy')} className="mt-0.5 rounded border-amber-300 text-amber-500 focus:ring-amber-400" />
                              <span>Apply for ₹3,000 – ₹10,000 Partner College Fee Subsidy</span>
                            </label>
                            <label className="flex items-start gap-2.5 cursor-pointer text-sm text-slate-700 font-body">
                              <input type="checkbox" defaultChecked {...register('interested_in_training')} className="mt-0.5 rounded border-amber-300 text-amber-500 focus:ring-amber-400" />
                              <span>Interested in 3-Month Advanced Industrial Training (IoT / Drones / Robotics / AI)</span>
                            </label>
                          </div>
                        </div>
                      )}

                      {/* Message / Details — always visible */}
                      <div>
                        <label className={labelCls}>
                          {activeTab === 'student'
                            ? 'Your Question or Target Colleges / Goals'
                            : 'Brief Description of Your Requirements'}
                          <span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <textarea
                          rows={4}
                          {...register('message', { required: 'Please provide brief details' })}
                          placeholder={
                            activeTab === 'student'
                              ? 'Tell us which stream you completed in 12th and what college or career you are aiming for...'
                              : 'Describe your project idea, the problem you want solved, or questions you have...'
                          }
                          className={inputCls + ' resize-none'}
                        />
                        {errors.message && <p className="text-red-500 text-[11px] mt-1 font-body">{errors.message.message}</p>}
                      </div>

                      {errorMsg && (
                        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-body flex items-start gap-2">
                          <span className="shrink-0 mt-0.5">⚠</span>
                          <span>{errorMsg} <a href="https://wa.me/918509684056" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Contact via WhatsApp</a></span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={submitState === 'submitting'}
                        className={`w-full py-3.5 rounded-full font-body font-semibold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
                          ${activeTab === 'student'
                            ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-[0_4px_20px_rgba(245,158,11,0.35)]'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-[0_4px_20px_rgba(37,99,235,0.35)] hover:shadow-[0_6px_28px_rgba(37,99,235,0.45)] hover:-translate-y-0.5 active:translate-y-0'
                          }`}
                      >
                        {submitState === 'submitting' ? (
                          <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Submitting...</span>
                        ) : activeTab === 'student' ? (
                          <>Claim Free Consultation & Subsidy <ArrowRight className="w-4 h-4" strokeWidth={1.5} /></>
                        ) : (
                          <>Submit B2B Project Inquiry <ArrowRight className="w-4 h-4" strokeWidth={1.5} /></>
                        )}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </ScrollReveal>
          </section>
        </div>
      </main>

      <GoogleReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        reviewUrl={reviewUrl}
      />
    </>
  )
}
