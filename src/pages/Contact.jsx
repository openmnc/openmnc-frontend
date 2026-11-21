import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollReveal from '../components/ScrollReveal.jsx'
import SEO from '../components/SEO.jsx'
import GoogleReviewModal from '../components/GoogleReviewModal.jsx'
import apiClient from '../api/client.js'
import { settingsApi } from '../api/settings.js'
import { whatsappUrl } from '../utils/helpers.js'
import { localBusinessSchema } from '../utils/jsonld.js'

export default function Contact() {
  const [searchParams] = useSearchParams()
  const initialIntent = searchParams.get('intent') === 'student' ? 'student' : 'b2b'
  const initialService = searchParams.get('service') || ''
  const aiReferral = searchParams.get('ref') || searchParams.get('source') || ''

  const [activeTab, setActiveTab] = useState(initialIntent)
  const [submitState, setSubmitState] = useState('idle') // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [reviewUrl, setReviewUrl] = useState('')

  useEffect(() => {
    settingsApi.getAll().then((res) => {
      if (res.data?.google_review_url) {
        setReviewUrl(res.data.google_review_url)
      }
    }).catch(() => {})
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      lead_type: initialIntent,
      service_interest: initialService,
      wants_nda: true,
    },
  })

  // Sync tab with form state
  useEffect(() => {
    setValue('lead_type', activeTab)
  }, [activeTab, setValue])

  useEffect(() => {
    if (initialService) {
      setValue('service_interest', initialService)
    }
  }, [initialService, setValue])

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
      setErrorMsg(err?.response?.data?.detail || 'Something went wrong. Please reach out via WhatsApp or email directly.')
      setSubmitState('error')
    }
  }

  return (
    <>
      <SEO
        title="Contact OpenMNC LLP — Global & Domestic Tech Consultation"
        description="Contact OpenMNC LLP. Direct WhatsApp (+91 8509684056) and consultation for global & domestic founders, B2B software partnerships, and free student college admission subsidies."
        canonical="/contact"
        keywords="contact OpenMNC, OpenMNC phone number, software consultation, AI consultation, student guidance contact, college admission subsidy contact"
        schema={localBusinessSchema}
      />

      {/* Page Hero */}
      <section className="pt-32 pb-14 px-4 bg-navy-950" aria-label="Contact OpenMNC">
        <div className="container-max text-center">
          <span className="text-xs text-cyan-neon font-semibold tracking-widest uppercase mb-4 block">
            Worldwide &amp; Domestic Inquiries · HQ West Bengal, India
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Let&apos;s Build Your <span className="gradient-text">Vision</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Direct routing to specialized advisors: whether you are a visionary founder building software,
            or a student claiming college admission subsidies.
          </p>

          {/* AI Recommendation Context Banner */}
          {(initialService || aiReferral) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-neon/10 border border-cyan-neon/30 text-cyan-neon text-xs font-medium"
            >
              <span>🤖</span>
              <span>
                Recommended by AI for <strong>{initialService.replace(/-/g, ' ') || 'Specialized Solutions'}</strong> — personalized form activated below.
              </span>
            </motion.div>
          )}
        </div>
      </section>

      <main className="bg-navy-950 section-padding pt-0">
        <div className="container-max grid lg:grid-cols-12 gap-12">
          {/* Left Column — Contact Info & Direct Channels (4 cols) */}
          <aside className="lg:col-span-4" aria-label="Contact information">
            <ScrollReveal>
              <h2 className="font-display text-xl font-bold text-white mb-6">
                Direct Channels
              </h2>
            </ScrollReveal>

            <div className="space-y-4 mb-8">
              {[
                { icon: '✉', label: 'Inquiries Email', value: 'hello@openmnc.com', href: 'mailto:hello@openmnc.com' },
                { icon: '📞', label: 'Founder Contact', value: '+91 8509684056', href: 'tel:+918509684056' },
                { icon: '🏢', label: 'Headquarters', value: 'Kolkata, West Bengal, India (Serving Globally & Domestically)', href: null },
              ].map((item) => (
                <div key={item.label} className="glass-card p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-neon/10 border border-cyan-neon/20 flex items-center justify-center text-sm flex-shrink-0 text-cyan-neon">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 uppercase tracking-wide">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-white text-xs hover:text-cyan-neon transition-colors font-medium">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-white text-xs font-medium">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Direct WhatsApp Action */}
            <a
              href={whatsappUrl(
                '918509684056',
                `Hi Amit! I want to consult regarding ${activeTab === 'student' ? 'Student Guidance / College Subsidy' : 'B2B Solutions & Custom Apps'}.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 w-full px-5 py-3.5 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 text-xs font-bold transition-all shadow-sm mb-6"
            >
              <span className="text-lg">💬</span>
              Chat Directly on WhatsApp
            </a>

            {/* Google Review Trust Card */}
            <div className="glass-card p-5 border border-amber-400/20 text-center mb-6">
              <span className="text-amber-400 text-base block mb-1">★★★★★</span>
              <p className="text-white text-xs font-bold mb-1">Google Business Profile</p>
              <p className="text-gray-400 text-[11px] mb-3">Rate OPEN MNC or read verified client reviews on Google.</p>
              <button
                type="button"
                onClick={() => setReviewModalOpen(true)}
                className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <span>⭐</span> Review Us on Google
              </button>
            </div>

            {/* Trust box */}
            <div className="glass-card p-5 text-xs text-gray-400 space-y-2">
              <p className="text-white font-semibold">🔒 Our Guarantee:</p>
              <p>• Zero spam — we only contact you regarding your explicit inquiry.</p>
              <p>• Strict mutual NDA before sharing repository or business details.</p>
              <p>• 100% Free Consultation for all 12th-pass students.</p>
              <p>• Direct conversation with senior engineering leadership.</p>
            </div>
          </aside>

          {/* Right Column — Intent-Based Form (8 cols) */}
          <section className="lg:col-span-8" aria-label="Lead Capture Form">
            <ScrollReveal direction="left">
              <div className="glass-card p-6 sm:p-8 border border-white/10">
                {/* Intent Tabs */}
                <div className="flex border-b border-white/10 mb-8 pb-3 gap-2 overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setActiveTab('b2b')}
                    className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
                      activeTab === 'b2b'
                        ? 'bg-cyan-neon text-navy-950 shadow-cyan-glow-sm'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <span>💼</span>
                    B2B &amp; Founders
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('student')}
                    className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
                      activeTab === 'student'
                        ? 'bg-amber-glow text-navy-950 shadow-amber-glow-sm'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <span>🎓</span>
                    Student Guidance &amp; Subsidy
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('general')}
                    className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
                      activeTab === 'general'
                        ? 'bg-white/20 text-white'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <span>⚡</span>
                    General Inquiry
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {submitState === 'success' ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="text-5xl mb-4">🎉</div>
                      <h3 className="font-display text-2xl font-bold text-white mb-2">
                        Inquiry Received!
                      </h3>
                      <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
                        {activeTab === 'student'
                          ? 'Our educational counselors will review your details and reach out within 24 hours regarding your college subsidy and guidance options.'
                          : 'Our solutions team will analyze your project scope and schedule a discovery call with founder Amit Barai.'}
                      </p>
                      <button
                        onClick={() => setSubmitState('idle')}
                        className="text-cyan-neon text-xs font-bold hover:underline"
                      >
                        ← Submit Another Inquiry
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
                      {/* Name & Email Row */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-300 mb-1">
                            Full Name <span className="text-red-400">*</span>
                          </label>
                          <input
                            {...register('name', { required: 'Name is required' })}
                            placeholder="Amit Barai"
                            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
                          />
                          {errors.name && <p className="text-red-400 text-[11px] mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-300 mb-1">
                            Email Address <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="email"
                            {...register('email', { required: 'Email is required' })}
                            placeholder="you@example.com"
                            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
                          />
                          {errors.email && <p className="text-red-400 text-[11px] mt-1">{errors.email.message}</p>}
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">
                          Phone / WhatsApp Number
                        </label>
                        <input
                          type="tel"
                          {...register('phone')}
                          placeholder="+91 85096 84056"
                          className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
                        />
                      </div>

                      {/* ----------------- B2B SPECIFIC FIELDS ----------------- */}
                      {activeTab === 'b2b' && (
                        <div className="space-y-4 pt-2 border-t border-white/5">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-300 mb-1">
                                Company / Startup Name
                              </label>
                              <input
                                {...register('company_name')}
                                placeholder="e.g. Acme Tech / Stealth"
                                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-300 mb-1">
                                Primary Tech Requirement
                              </label>
                              <select
                                {...register('service_interest')}
                                className="w-full px-4 py-2.5 rounded-lg bg-navy-900 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
                              >
                                <option value="vibe-coded-app-audit-and-fixing">Pillar 1: Vibe-Coded App Audit &amp; Fixing (Cursor/Bolt/Lovable)</option>
                                <option value="app-store-play-store-publishing-and-approval">Pillar 2: Play Store &amp; App Store Publishing / Policy Fix</option>
                                <option value="app-transfer-and-database-migration">Pillar 3: App Transfer &amp; Database Migration (Acquisitions)</option>
                                <option value="custom-software-and-scalable-app-development">Pillar 4: Custom Software, SaaS &amp; Scalable Mobile Apps</option>
                                <option value="app-maintenance-and-support">Pillar 5: App Maintenance, DevOps &amp; Support (AMC)</option>
                                <option value="business-automation">Enterprise AI Automation &amp; Multi-Agent Workflows</option>
                                <option value="social-media-management">Organic Social Media &amp; Video Growth</option>
                                <option value="inhouse-products">In-House Products Partnership</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-300 mb-1">
                                Estimated Budget Range
                              </label>
                              <select
                                {...register('budget_range')}
                                className="w-full px-4 py-2.5 rounded-lg bg-navy-900 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
                              >
                                <option value="₹25k - ₹75k">₹25,000 – ₹75,000 (MVP / Audit / ASO)</option>
                                <option value="₹75k - ₹2.5L">₹75,000 – ₹2,50,000 (Full Build / Migration)</option>
                                <option value="₹2.5L - ₹10L">₹2,50,000 – ₹10,00,000 (Scaling / SaaS)</option>
                                <option value="₹10L+">₹10,00,000+ (Enterprise)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-300 mb-1">
                                Target Timeline
                              </label>
                              <select
                                {...register('project_timeline')}
                                className="w-full px-4 py-2.5 rounded-lg bg-navy-900 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
                              >
                                <option value="Immediate (< 2 weeks)">Immediate (&lt; 2 weeks)</option>
                                <option value="1 - 2 Months">1 – 2 Months</option>
                                <option value="Exploratory / Planning">Exploratory / Planning</option>
                              </select>
                            </div>
                          </div>

                          {/* NDA Request Checkbox (Blueprint Part 4) */}
                          <div className="pt-2">
                            <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                              <input
                                type="checkbox"
                                defaultChecked
                                {...register('wants_nda')}
                                className="rounded text-cyan-neon focus:ring-0"
                              />
                              <span>
                                I want an NDA before sharing repository or business details.
                              </span>
                            </label>
                          </div>
                        </div>
                      )}

                      {/* ----------------- STUDENT SPECIFIC FIELDS ----------------- */}
                      {activeTab === 'student' && (
                        <div className="space-y-4 pt-2 border-t border-white/5">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-300 mb-1">
                                Current Education Level
                              </label>
                              <select
                                {...register('education_level')}
                                className="w-full px-4 py-2.5 rounded-lg bg-navy-900 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
                              >
                                <option value="12th Pass (Recent)">12th Pass (Recent / Current Year)</option>
                                <option value="Diploma Student">Diploma Student</option>
                                <option value="Undergraduate (B.Tech / BCA / BSc)">Undergraduate (B.Tech / BCA / BSc)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-300 mb-1">
                                Preferred Tech / Study Field
                              </label>
                              <input
                                {...register('preferred_field')}
                                placeholder="e.g. Computer Science, AI, Robotics, IoT"
                                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
                              />
                            </div>
                          </div>

                          <div className="p-4 rounded-xl bg-amber-glow/10 border border-amber-glow/20 space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                              <input
                                type="checkbox"
                                defaultChecked
                                {...register('interested_in_college_subsidy')}
                                className="rounded text-amber-glow focus:ring-0"
                              />
                              <span>
                                Apply for ₹3,000 – ₹10,000 Partner College Fee Subsidy
                              </span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                              <input
                                type="checkbox"
                                defaultChecked
                                {...register('interested_in_training')}
                                className="rounded text-amber-glow focus:ring-0"
                              />
                              <span>
                                Interested in 3-Month Advanced Industrial Training (IoT/Drones/Robotics/AI)
                              </span>
                            </label>
                          </div>
                        </div>
                      )}

                      {/* Message / Details */}
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">
                          {activeTab === 'student'
                            ? 'Your Question or Target Colleges / Goals'
                            : 'Brief Description of Your Idea / Requirements'}
                        </label>
                        <textarea
                          rows={4}
                          {...register('message', { required: 'Please provide brief details' })}
                          placeholder={
                            activeTab === 'student'
                              ? 'Tell us which stream you completed in 12th and what college or career you are aiming for...'
                              : 'Describe your app idea, business workflow bottlenecks, or video marketing goals...'
                          }
                          className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40 resize-none"
                        />
                        {errors.message && <p className="text-red-400 text-[11px] mt-1">{errors.message.message}</p>}
                      </div>

                      {errorMsg && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                          {errorMsg}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={submitState === 'submitting'}
                        className={`
                          w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all
                          flex items-center justify-center gap-2
                          ${activeTab === 'student'
                            ? 'bg-amber-glow text-navy-950 hover:bg-amber-glow/90 shadow-amber-glow-sm'
                            : 'bg-cyan-neon text-navy-950 hover:bg-cyan-neon/90 shadow-cyan-glow-sm'
                          }
                          disabled:opacity-50
                        `}
                      >
                        {submitState === 'submitting' ? (
                          'Submitting Inquiry...'
                        ) : activeTab === 'student' ? (
                          'Claim Free Consultation & Subsidy →'
                        ) : (
                          'Submit B2B Project Inquiry →'
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
