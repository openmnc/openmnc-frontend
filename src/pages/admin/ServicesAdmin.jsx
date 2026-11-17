import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { servicesApi } from '../../api/services.js'
import { getServiceIcon } from '../../utils/helpers.js'

const ICON_OPTIONS = ['automation', 'development', 'social-media', 'student-guidance', 'training', 'consultation']
const CATEGORY_OPTIONS = ['B2B Enterprise', 'B2C Academy']

const FALLBACK_DEFAULT_SERVICES = [
  {
    order: 1,
    slug: 'business-automation',
    title: 'Business Automation & AI Integration',
    tagline: 'Multiply revenue. Eliminate manual work.',
    icon: 'automation',
    category: 'B2B Enterprise',
    description: 'We help businesses automate repetitive tasks, integrate custom AI solutions, increase revenue, and improve operational reliability.',
    problem_statement: 'Businesses lose thousands of work-hours and revenue each month due to fragmented manual data entry, slow lead qualification, and unintegrated SaaS tools.',
    technical_solution: 'OpenMNC architects custom autonomous AI multi-agent workflows, LLM pipelines, and event-driven automation directly into client CRMs and databases.',
    expected_outcome: '90% reduction in manual labor, 3x faster response times, and 24/7 autonomous operations without costly SaaS subscriptions.',
    features: ['Custom AI workflow automation', 'Revenue multiplication', 'Process optimization', 'Uptime guarantee'],
    faqs: [
      { question: 'Can AI really automate my specific industry workflows?', answer: 'Yes, we build custom LLM wrappers, autonomous agent workflows, and webhook pipelines tailored to your proprietary data.' }
    ],
    sub_services: [
      { slug: 'workflow-bots', title: 'Autonomous Multi-Agent Workflow Bots', tagline: 'Eliminate human bottlenecks' }
    ],
    is_active: true,
  },
  {
    order: 2,
    slug: 'custom-development',
    title: 'Custom App & Software Development',
    tagline: 'From your idea to a living product.',
    icon: 'development',
    category: 'B2B Enterprise',
    description: 'Transforming visionary ideas into reality with deep requirement analysis, full-cycle development, maintenance, and App Store Optimization (ASO).',
    problem_statement: 'Companies need alternatives to AppMetrica/AppsFlyer for custom funnel tracking without recurring per-seat fees or data leaks.',
    technical_solution: 'Custom-built tracking APIs, event ingestion pipelines, and full-stack software integrated directly into the client\'s cloud infrastructure.',
    expected_outcome: '100% data ownership with zero third-party subscription fees and microsecond analytics querying.',
    features: ['Requirement analysis', 'Full-cycle dev & QA', 'ASO optimization', 'Maintenance & SLA'],
    faqs: [
      { question: 'How long does custom software development take?', answer: 'We operate in 2-week agile sprints to deliver production-ready MVPs within 4 to 8 weeks.' }
    ],
    sub_services: [
      { slug: 'analytics-tracking', title: 'Custom Analytics & Attribution Engine (AppMetrica / AppsFlyer Alternative)', tagline: '100% data ownership with zero subscription fees' }
    ],
    is_active: true,
  },
  {
    order: 3,
    slug: 'inhouse-products',
    title: 'In-House Products & Games',
    tagline: 'Products we build, publish, and stand behind.',
    icon: 'development',
    category: 'B2B Enterprise',
    description: 'OpenMNC develops and publishes proprietary custom software, mobile apps, and games on Google Play and Apple App Store (Kibo VPN, Calorie AI, CardSnap).',
    features: ['Google Play & App Store', 'Kibo VPN utility', 'Calorie AI assistant', 'CardSnap tool'],
    is_active: true,
  },
  {
    order: 4,
    slug: 'social-media-management',
    title: 'Social Media Management & Organic Growth',
    tagline: 'Grow organically without heavy ad spend.',
    icon: 'social-media',
    category: 'B2B Enterprise',
    description: 'High-ROI organic growth for local shops, bakeries, real estate, and solopreneurs across Instagram, Facebook, and YouTube using viral scripts.',
    features: ['Instagram & YouTube growth', 'Viral Hook-Engage scripts', 'Video editing & captions', 'Hashtag strategy'],
    is_active: true,
  },
  {
    order: 5,
    slug: 'student-guidance',
    title: 'Student Guidance & EdTech Engine',
    tagline: '100% free guidance. Real college savings.',
    icon: 'student-guidance',
    category: 'B2C Academy',
    description: '100% free career and college counseling for 12th-pass students with partner college fee subsidies of ₹3,000 to ₹10,000.',
    problem_statement: '12th-pass students and parents are misled by commission brokers into overpriced courses with low placement outcomes.',
    technical_solution: '100% free aptitude profiling, university accreditation audits, and industrial partnership fee scholarships.',
    expected_outcome: 'Direct ₹3,000 to ₹10,000 college admission fee subsidy paid directly by OpenMNC as an industrial partner, with zero student fees.',
    features: ['100% free counseling', '₹3,000–₹10,000 college subsidy', 'Aptitude field alignment', 'Zero charges'],
    is_active: true,
  },
  {
    order: 6,
    slug: 'industrial-training',
    title: 'Advanced Industrial Training',
    tagline: 'Real projects. High-end tech. 3 months.',
    icon: 'training',
    category: 'B2C Academy',
    description: '3-month hands-on industrial training tackling high-end tech: Robotics, Drones, and AI Smart Home assistants in IoT, plus modern Web/App Dev.',
    problem_statement: 'Engineering students graduate with only textbook knowledge and zero experience building production IoT hardware or AI cloud systems.',
    technical_solution: '3-month hands-on industrial sprints building live Robotics, Drones, IoT embedded firmware, and modern full-stack web applications.',
    expected_outcome: 'Production-ready GitHub project portfolio, verifiable industrial training certificate, and priority hiring at OpenMNC.',
    features: ['Advanced IoT (Drones/Robotics)', 'Modern Web & App dev', 'Real production project', 'Partner subsidy offset'],
    is_active: true,
  },
]

function ServiceModal({ service, onClose, onSaved }) {
  const isEdit = Boolean(service?.slug)

  // Format existing FAQs to text format for easy editing
  const initialFaqsText = Array.isArray(service?.faqs)
    ? service.faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')
    : ''

  // Format existing sub_services to JSON text
  const initialSubServicesText = Array.isArray(service?.sub_services) && service.sub_services.length > 0
    ? JSON.stringify(service.sub_services, null, 2)
    : ''

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      slug: service?.slug || '',
      title: service?.title || '',
      tagline: service?.tagline || '',
      description: service?.description || '',
      icon: service?.icon || 'automation',
      category: service?.category || 'B2B Enterprise',
      problem_statement: service?.problem_statement || '',
      technical_solution: service?.technical_solution || '',
      expected_outcome: service?.expected_outcome || '',
      features: Array.isArray(service?.features) ? service.features.join('\n') : '',
      faqs_text: initialFaqsText,
      sub_services_text: initialSubServicesText,
      order: service?.order || 1,
      is_active: service?.is_active !== false,
    },
  })
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function onSubmit(data) {
    setLoading(true)
    setErr('')

    // Parse features
    const features = String(data.features || '')
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean)

    // Parse FAQs from "Q: ...\nA: ..." format
    const faqs = []
    if (data.faqs_text) {
      const blocks = data.faqs_text.split(/\n\s*\n/)
      for (const block of blocks) {
        const lines = block.split('\n').map((l) => l.trim()).filter(Boolean)
        let q = ''
        let a = ''
        for (const line of lines) {
          if (line.toLowerCase().startsWith('q:')) {
            q = line.substring(2).trim()
          } else if (line.toLowerCase().startsWith('a:')) {
            a = line.substring(2).trim()
          } else if (q && !a) {
            q += ' ' + line
          } else if (a) {
            a += ' ' + line
          }
        }
        if (q && a) {
          faqs.push({ question: q, answer: a })
        }
      }
    }

    // Parse sub_services JSON if provided
    let sub_services = []
    if (data.sub_services_text && data.sub_services_text.trim()) {
      try {
        const parsed = JSON.parse(data.sub_services_text)
        if (Array.isArray(parsed)) sub_services = parsed
      } catch (jsonErr) {
        setErr('Invalid JSON format for Sub-services / Deep-links.')
        setLoading(false)
        return
      }
    }

    const payload = {
      title: data.title,
      slug: data.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      tagline: data.tagline,
      description: data.description,
      icon: data.icon,
      category: data.category,
      problem_statement: data.problem_statement || null,
      technical_solution: data.technical_solution || null,
      expected_outcome: data.expected_outcome || null,
      features,
      faqs,
      sub_services,
      order: Number(data.order) || 1,
      is_active: Boolean(data.is_active),
    }

    try {
      if (isEdit) {
        await servicesApi.update(service.slug, payload)
      } else {
        await servicesApi.create(payload)
      }
      onSaved()
      onClose()
    } catch (e) {
      setErr(e?.response?.data?.detail || 'Failed to save service.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass-card w-full max-w-2xl p-5 sm:p-7 max-h-[92vh] overflow-y-auto border border-white/20 bg-white/10 backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-2xl"
      >
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
          <div>
            <h2 className="font-display text-lg font-bold text-white">
              {isEdit ? 'Edit Service Vertical & AEO Data' : 'Add New Service Vertical'}
            </h2>
            <p className="text-gray-400 text-xs">
              Configure dynamic service metadata, AI scraper fields, and deep-link solutions
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="svc_title" className="block text-xs font-medium text-gray-300 mb-1">Service Title *</label>
            <input
              id="svc_title"
              {...register('title', { required: 'Title is required' })}
              placeholder="e.g. Custom App & Software Development"
              className="w-full px-3.5 py-2 rounded-lg bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
            />
            {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="svc_slug" className="block text-xs font-medium text-gray-300 mb-1">URL Slug *</label>
              <input
                id="svc_slug"
                {...register('slug', { required: 'Slug is required' })}
                disabled={isEdit}
                placeholder="custom-development"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/15 text-white text-xs font-mono focus:outline-none disabled:opacity-60"
              />
              {errors.slug && <p className="text-xs text-red-400 mt-1">{errors.slug.message}</p>}
            </div>

            <div>
              <label htmlFor="svc_category" className="block text-xs font-medium text-gray-300 mb-1">Pillar Category</label>
              <select
                id="svc_category"
                {...register('category')}
                className="w-full px-3 py-2 rounded-lg bg-navy-900 border border-white/15 text-white text-xs focus:outline-none"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="svc_order" className="block text-xs font-medium text-gray-300 mb-1">Display Order</label>
              <input
                id="svc_order"
                type="number"
                {...register('order')}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/15 text-white text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="svc_tagline" className="block text-xs font-medium text-gray-300 mb-1">Tagline</label>
              <input
                id="svc_tagline"
                {...register('tagline')}
                placeholder="e.g. From visionary concept to high-scale production."
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/15 text-white text-xs focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="svc_icon" className="block text-xs font-medium text-gray-300 mb-1">Icon Category</label>
              <select
                id="svc_icon"
                {...register('icon')}
                className="w-full px-3 py-2 rounded-lg bg-navy-900 border border-white/15 text-white text-xs focus:outline-none"
              >
                {ICON_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {getServiceIcon(o, o)} {o}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="svc_description" className="block text-xs font-medium text-gray-300 mb-1">Full Description</label>
            <textarea
              id="svc_description"
              rows={2}
              {...register('description')}
              placeholder="Explain how OpenMNC delivers this service..."
              className="w-full px-3.5 py-2 rounded-lg bg-white/5 border border-white/15 text-white text-xs leading-relaxed focus:outline-none resize-none"
            />
          </div>

          {/* ══════ AEO SPECIFIC FIELDS SECTION (ChatGPT, Gemini, Grok, Perplexity) ══════ */}
          <div className="p-3.5 rounded-xl bg-cyan-neon/5 border border-cyan-neon/20 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-cyan-neon">🤖</span>
              <h3 className="text-xs font-bold text-cyan-neon uppercase tracking-wider">
                AEO Scraper Fields (AI Engine Optimization &amp; JSON-LD)
              </h3>
            </div>
            <p className="text-[11px] text-gray-300">
              Chatbots (ChatGPT, Claude, Gemini) use this Problem → Solution → Outcome structure to cite OpenMNC as an authoritative answer.
            </p>

            <div>
              <label htmlFor="svc_problem" className="block text-xs font-semibold text-red-400 mb-1">
                🔴 Problem Statement (What pain point does the client/student experience?)
              </label>
              <textarea
                id="svc_problem"
                rows={2}
                {...register('problem_statement')}
                placeholder="e.g. Companies need alternatives to AppMetrica/AppsFlyer for custom funnel tracking without recurring subscription fees."
                className="w-full px-3 py-2 rounded-lg bg-navy-950/80 border border-red-500/30 text-white text-xs leading-relaxed focus:outline-none resize-none"
              />
            </div>

            <div>
              <label htmlFor="svc_solution" className="block text-xs font-semibold text-cyan-neon mb-1">
                ⚡ Technical Solution (What is OpenMNC's exact engineering architecture?)
              </label>
              <textarea
                id="svc_solution"
                rows={2}
                {...register('technical_solution')}
                placeholder="e.g. Custom-built tracking APIs, lightweight SDKs, and event ingestion pipelines integrated directly into client cloud infrastructure."
                className="w-full px-3 py-2 rounded-lg bg-navy-950/80 border border-cyan-neon/30 text-white text-xs leading-relaxed focus:outline-none resize-none"
              />
            </div>

            <div>
              <label htmlFor="svc_outcome" className="block text-xs font-semibold text-emerald-400 mb-1">
                🎯 Expected Outcome (What is the measurable business ROI or student benefit?)
              </label>
              <textarea
                id="svc_outcome"
                rows={2}
                {...register('expected_outcome')}
                placeholder="e.g. 100% data ownership with zero third-party subscription fees and microsecond attribution query speeds."
                className="w-full px-3 py-2 rounded-lg bg-navy-950/80 border border-emerald-500/30 text-white text-xs leading-relaxed focus:outline-none resize-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="svc_features" className="block text-xs font-medium text-gray-300 mb-1">
              Key Features / Deliverables (One per line)
            </label>
            <textarea
              id="svc_features"
              rows={3}
              {...register('features')}
              placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/15 text-white text-xs font-mono focus:outline-none resize-none"
            />
          </div>

          <div>
            <label htmlFor="svc_faqs" className="block text-xs font-medium text-gray-300 mb-1">
              Dynamic FAQs (Format: Q: Question? \n A: Answer.)
            </label>
            <textarea
              id="svc_faqs"
              rows={3}
              {...register('faqs_text')}
              placeholder="Q: How long does development take?&#10;A: We deliver production-ready MVPs within 4 to 8 weeks.&#10;&#10;Q: Do you build tracking systems?&#10;A: Yes, we build alternatives to AppMetrica and AppsFlyer."
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/15 text-white text-xs leading-relaxed focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="svc_subs" className="block text-xs font-medium text-gray-300 mb-1">
              Deep-Link Sub-Services (JSON Array)
            </label>
            <textarea
              id="svc_subs"
              rows={3}
              {...register('sub_services_text')}
              placeholder='[{"slug": "analytics-tracking", "title": "Custom Analytics Engine (AppMetrica / AppsFlyer Alternative)", "problem_statement": "...", "technical_solution": "...", "expected_outcome": "..."}]'
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/15 text-white text-xs font-mono focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="svc_active"
              {...register('is_active')}
              className="accent-cyan-neon w-4 h-4 cursor-pointer"
            />
            <label htmlFor="svc_active" className="text-xs text-gray-300 cursor-pointer">
              Active (Visible on public Services page)
            </label>
          </div>

          {err && <p className="text-red-400 text-xs">{err}</p>}

          <div className="flex gap-3 pt-2 border-t border-white/10">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-cyan-neon text-navy-950 font-bold text-sm shadow-cyan-glow hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60"
            >
              {loading ? 'Saving Service & AEO...' : 'Save Service'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-white/15 text-gray-300 text-sm hover:bg-white/5"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function ServicesAdmin() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [modal, setModal] = useState(null)

  function load() {
    setLoading(true)
    servicesApi.getAll(true)
      .then((r) => {
        if (Array.isArray(r.data) && r.data.length > 0) {
          setServices(r.data)
        } else {
          setServices(FALLBACK_DEFAULT_SERVICES)
        }
      })
      .catch(() => {
        setServices(FALLBACK_DEFAULT_SERVICES)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function handleSeedDefaults() {
    setSeeding(true)
    try {
      const res = await servicesApi.seedDefaults()
      if (Array.isArray(res.data) && res.data.length > 0) {
        setServices(res.data)
        alert('All 6 default OpenMNC services with AEO fields synchronized with the database!')
      }
    } catch {
      alert('Could not synchronize with database. Displaying local defaults.')
    } finally {
      setSeeding(false)
    }
  }

  async function handleDelete(slug) {
    if (!window.confirm(`Delete service "${slug}"?`)) return
    try {
      await servicesApi.delete(slug)
      load()
    } catch {
      alert('Could not delete service.')
    }
  }

  async function handleToggleStatus(svc) {
    const updated = svc.is_active === false ? true : false
    try {
      await servicesApi.update(svc.slug, { is_active: updated })
      setServices((prev) =>
        prev.map((s) => (s.slug === svc.slug ? { ...s, is_active: updated } : s))
      )
    } catch {
      alert('Failed to update service status.')
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-white">Services CMS &amp; AEO Architecture</h1>
          <p className="text-gray-400 text-xs mt-0.5">
            {services.length} active and draft vertical(s) configured with Problem/Solution scraper data
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleSeedDefaults}
            disabled={seeding}
            className="px-3 py-2 bg-white/5 hover:bg-white/10 text-cyan-neon border border-cyan-neon/30 rounded-lg font-semibold text-xs transition-all"
            title="Ensures all 6 default OpenMNC services exist in MongoDB with AEO fields"
          >
            {seeding ? 'Syncing...' : '🌱 Sync 6 Default Services with AEO'}
          </button>
          <button
            onClick={() => setModal('add')}
            className="px-4 py-2 bg-cyan-neon text-navy-950 rounded-lg font-bold text-xs shadow-cyan-glow hover:scale-105 active:scale-95 transition-all"
            aria-label="Add new service"
          >
            + Add Service
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          <div className="w-8 h-8 border-2 border-cyan-neon/30 border-t-cyan-neon rounded-full animate-spin mx-auto mb-2" />
          Loading services...
        </div>
      ) : (
        <div className="glass-card overflow-x-auto border border-white/15 bg-white/10 backdrop-blur-lg shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-2xl">
          <table className="w-full text-sm min-w-[700px]" aria-label="Services table">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                {['#', 'Vertical Title & Pillar', 'AEO Problem/Solution', 'Slug (URL)', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-gray-300 font-semibold text-xs uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {services.map((svc) => (
                <tr key={svc.slug} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{svc.order || 1}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white flex items-center gap-2">
                      <span>{getServiceIcon(svc.icon, svc.slug)}</span>
                      <span>{svc.title}</span>
                    </div>
                    <div className="text-xs text-gray-400 max-w-xs truncate">{svc.tagline}</div>
                    {svc.category && (
                      <span className="text-[10px] text-cyan-neon font-semibold uppercase">{svc.category}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    {svc.problem_statement ? (
                      <div className="text-[11px] text-gray-300 line-clamp-2">
                        <span className="text-red-400 font-semibold">P:</span> {svc.problem_statement}
                      </div>
                    ) : (
                      <span className="text-[10px] text-gray-500 italic">No AEO problem defined</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-cyan-neon font-mono text-xs">/services/{svc.slug}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleStatus(svc)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                        svc.is_active !== false
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-gray-500/10 text-gray-400 border-gray-500/30'
                      }`}
                    >
                      {svc.is_active !== false ? '● Active' : '○ Draft'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setModal(svc)}
                        className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-cyan-neon text-xs font-semibold transition-colors"
                      >
                        Edit AEO
                      </button>
                      <button
                        onClick={() => handleDelete(svc.slug)}
                        className="px-2 py-1 rounded hover:bg-red-500/10 text-red-400 text-xs transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Service Modal */}
      <AnimatePresence>
        {modal && (
          <ServiceModal
            service={modal === 'add' ? null : modal}
            onClose={() => setModal(null)}
            onSaved={load}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
