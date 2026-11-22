import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap,
  BadgePercent,
  Cpu,
  Briefcase,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react'
import SEO from '../components/SEO.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import ScrollReveal from '../components/ScrollReveal.jsx'
import GoogleReviewModal from '../components/GoogleReviewModal.jsx'
import apiClient from '../api/client.js'
import { whatsappUrl } from '../utils/helpers.js'
import { studentGuidanceFaqSchema, courseSchema } from '../utils/jsonld.js'

const BENEFITS = [
  {
    icon: <GraduationCap className="w-8 h-8 text-amber-500" strokeWidth={1.5} aria-hidden="true" />,
    title: '100% Free Career Guidance',
    desc: 'Unbiased aptitude counseling for 12th Science, Commerce & Arts students. Zero consultation fees, zero agent commissions.',
    badge: '₹0 Student Cost',
  },
  {
    icon: <BadgePercent className="w-8 h-8 text-amber-500" strokeWidth={1.5} aria-hidden="true" />,
    title: '₹3,000 to ₹10,000 Fee Subsidy',
    desc: 'Official industrial partnership subsidy discounted directly from your partner college admission fees.',
    badge: 'Direct Discount',
  },
  {
    icon: <Cpu className="w-8 h-8 text-amber-500" strokeWidth={1.5} aria-hidden="true" />,
    title: '3-Month Industrial Training',
    desc: 'Live hands-on training in Robotics, Drones, IoT microcontrollers, and modern AI/Web engineering.',
    badge: 'Live Projects',
  },
  {
    icon: <Briefcase className="w-8 h-8 text-amber-500" strokeWidth={1.5} aria-hidden="true" />,
    title: 'Internship & PPO Opportunities',
    desc: 'Work on live OpenMNC production systems, earn performance stipends, and build a verified portfolio.',
    badge: 'Career Launch',
  },
]

const ELIGIBLE_COURSES = [
  { code: 'B.Tech / B.E.', name: 'Computer Science, AI & ML, Robotics, IoT & Embedded Systems', duration: '4 Years' },
  { code: 'BCA / BSc IT', name: 'Software Applications, Cloud Computing & Web Technologies', duration: '3 Years' },
  { code: 'BBA', name: 'Business Analytics, Digital Marketing & Tech Management', duration: '3 Years' },
  { code: 'Polytechnic Diploma', name: 'Mechanical, Electrical, Electronics & Computer Engineering', duration: '3 Years' },
]

const FAQS = [
  {
    q: 'Why is student career guidance 100% free with OpenMNC?',
    a: 'OpenMNC is an authorized industrial technology partner for accredited universities. We provide industrial project training and bridge industry requirements with student talent. We earn from industrial engineering partnerships, never from students or parents.',
  },
  {
    q: 'How does the ₹3,000 to ₹10,000 college fee subsidy work?',
    a: 'Because OpenMNC trains students directly on industrial projects, our partner colleges grant an institutional subsidy between ₹3,000 and ₹10,000 directly deducted from your admission fee receipt. There are zero broker commissions or middlemen.',
  },
  {
    q: 'Can students from Science, Commerce, and Arts all apply?',
    a: 'Yes! We guide students across all 12th streams into aligned careers — Science students into B.Tech/Robotics/BCA, Commerce students into FinTech/BBA/Analytics, and Arts students into UI/UX Design, Media, and Management.',
  },
  {
    q: 'Are the colleges recognized and accredited?',
    a: 'Yes, 100%. All partner institutions are UGC-recognized, AICTE-approved, and affiliated with state/central universities with verified campus placement records.',
  },
  {
    q: 'What is the 3-Month Industrial Training program?',
    a: 'It is a practical engineering program where students build physical IoT circuits (ESP32/Raspberry Pi), program autonomous drones, build AI multi-agent software, and deploy web applications with industry mentor guidance.',
  },
]

function CareerRoadmapFlow() {
  const steps = [
    {
      num: '01',
      title: 'Free Aptitude Evaluation',
      desc: 'Fill out your 12th stream & marks. Our academic mentor assesses your real strengths and career goals.',
    },
    {
      num: '02',
      title: 'College & Stream Matching',
      desc: 'Compare UGC/AICTE-accredited partner universities based on genuine placement stats, faculty, and fees.',
    },
    {
      num: '03',
      title: 'Direct Campus Tour & Admission',
      desc: 'Visit verified campuses with transparent fee breakdowns — zero agent commissions or hidden broker fees.',
    },
    {
      num: '04',
      title: '₹3k–₹10k Grant Deducted',
      desc: 'Receive your official OpenMNC Industrial Partnership Grant letter, offset directly against admission fees.',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 my-10">
      {steps.map((st) => (
        <div
          key={st.num}
          className="p-6 rounded-2xl bg-surface border border-hairline hover:border-amber-400/50 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-2xl font-extrabold text-amber-600">
                {st.num}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-amber-300 text-amber-700 bg-amber-50 font-mono">
                Stage {st.num}
              </span>
            </div>
            <h3 className="font-heading text-lg font-bold text-ink-primary mb-2 group-hover:text-amber-600 transition-colors">
              {st.title}
            </h3>
            <p className="text-ink-secondary font-sans text-sm leading-relaxed">
              {st.desc}
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-hairline flex items-center gap-1.5 text-xs text-amber-700 font-medium font-sans">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
            <span>100% Free ₹0 Guidance</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function CareerGuidance() {
  const [activeFaq, setActiveFaq] = useState(null)
  const [submitState, setSubmitState] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [reviewModalOpen, setReviewModalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      lead_type: 'student',
      service_interest: 'student-guidance',
      interested_in_college_subsidy: true,
      interested_in_training: true,
    },
  })

  async function onSubmit(data) {
    setSubmitState('submitting')
    setErrorMsg('')
    try {
      const payload = {
        ...data,
        lead_type: 'student',
        referrer_url: typeof window !== 'undefined' ? window.location.href : '',
        ai_source: 'career_portal_form',
      }
      await apiClient.post('/contact', payload)
      setSubmitState('success')
      reset()
    } catch (err) {
      setErrorMsg(err?.response?.data?.detail || 'Something went wrong. Please connect with us directly on WhatsApp.')
      setSubmitState('error')
    }
  }

  return (
    <>
      <SEO
        title="100% Free Career Guidance & College Admission Subsidies | OpenMNC Academy"
        description="100% Free career guidance for 12th pass students. Claim exclusive ₹3,000 to ₹10,000 partner college fee subsidies and 3-month industrial IoT/AI training across India."
        canonical="/career-guidance"
        keywords="free career guidance 12th pass, college admission subsidy, B.Tech college counseling Kolkata West Bengal, OpenMNC academy, industrial IoT training, free college admission guidance India"
        schema={[studentGuidanceFaqSchema, courseSchema]}
      />

      {/* ══════ SECTION 1: HERO (LIGHT-FIRST CANVAS WITH AMBIENT MESH) ══════ */}
      <section
        className="relative pt-32 pb-20 px-4 bg-canvas bg-ambient-mesh overflow-hidden"
        aria-label="Career Guidance Hero"
      >
        <div className="section-container relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold tracking-wider uppercase mb-6 shadow-sm font-sans">
            <GraduationCap className="w-4 h-4 text-amber-500 shrink-0" aria-hidden="true" />
            <span>OpenMNC Academy &amp; Higher Education Portal · 100% Free For Students</span>
          </div>

          <h1 className="type-h1 mb-6 max-w-4xl mx-auto">
            Confused After 12th? Get <span className="text-amber-600">100% Free Career Guidance</span> &amp; Claim{' '}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              ₹3,000–₹10,000 Fee Subsidies.
            </span>
          </h1>

          <p className="type-lead mx-auto mb-8 text-ink-secondary">
            Don&apos;t pay high broker commissions or risk joining low-placement colleges. As an authorized
            industrial technology partner, OpenMNC helps you choose the right college and stream based on genuine aptitude
            — and discounts ₹3,000 to ₹10,000 directly from your admission fees.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <a
              href="#student-apply"
              className="px-8 py-3.5 rounded-btn bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-base shadow-[0_4px_16px_rgba(245,158,11,0.35)] transition-all w-full sm:w-auto font-sans text-center"
            >
              Claim Free Guidance &amp; Subsidy →
            </a>
            <a
              href={whatsappUrl(
                '918509684056',
                'Hi OpenMNC! I passed 12th and need free career counseling and details on the partner college fee subsidy.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-btn bg-surface hover:bg-subtle border border-hairline text-ink-primary font-medium text-base transition-all flex items-center justify-center gap-2 w-full sm:w-auto font-sans shadow-sm"
            >
              <MessageSquare className="w-4 h-4 text-status-success" aria-hidden="true" />
              <span>Chat With Academic Counselor</span>
            </a>
          </div>

          {/* Quick Trust Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-hairline text-left">
            <div className="p-4 rounded-card bg-surface border border-hairline shadow-sm">
              <span className="text-amber-600 font-bold text-base block font-heading">100% Free</span>
              <span className="text-ink-secondary text-xs sm:text-sm font-sans">Zero student or parent charges</span>
            </div>
            <div className="p-4 rounded-card bg-surface border border-hairline shadow-sm">
              <span className="text-brand-primary font-bold text-base block font-heading">₹3k – ₹10k</span>
              <span className="text-ink-secondary text-xs sm:text-sm font-sans">Direct fee deduction grant</span>
            </div>
            <div className="p-4 rounded-card bg-surface border border-hairline shadow-sm">
              <span className="text-indigo-600 font-bold text-base block font-heading">12+ Partners</span>
              <span className="text-ink-secondary text-xs sm:text-sm font-sans">UGC &amp; AICTE accredited</span>
            </div>
            <div className="p-4 rounded-card bg-surface border border-hairline shadow-sm">
              <span className="text-status-success font-bold text-base block font-heading">Real IoT Labs</span>
              <span className="text-ink-secondary text-xs sm:text-sm font-sans">Robotics &amp; AI project training</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ SECTION 2: THE 4 PILLARS (SUBTLE BG) ══════ */}
      <section className="section-spacing bg-subtle border-y border-hairline" aria-label="Key Benefits">
        <div className="section-container">
          <SectionHeader
            eyebrow="Distinct From Software Services"
            title="The OpenMNC Career &amp; EdTech Engine"
            subtitle="Engineered specifically for students and parents seeking honest college roadmaps and tangible financial relief."
          />

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.1}>
                <div className="p-7 rounded-card bg-surface border border-hairline hover:border-amber-400 transition-all duration-300 h-full flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-4xl" aria-hidden="true">{item.icon}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200 font-mono">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="type-h3 mb-2">{item.title}</h3>
                    <p className="type-body text-ink-secondary text-sm">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ SECTION 3: POPULAR COURSE PATHWAYS (CANVAS) ══════ */}
      <section className="section-spacing bg-canvas" aria-label="Eligible Degree & Diploma Streams">
        <div className="section-container">
          <SectionHeader
            eyebrow="Degree &amp; Diploma Tracks"
            title="Eligible Degree Streams for Partner Subsidies"
            subtitle="Get admission guidance and institutional subsidies across top technical and management universities."
          />

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {ELIGIBLE_COURSES.map((course) => (
              <div key={course.code} className="p-6 rounded-card bg-surface border border-hairline hover:border-amber-400/50 transition-all shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="type-h3 text-lg font-heading">{course.code}</h3>
                  <span className="text-xs px-2.5 py-1 rounded bg-subtle text-brand-primary font-semibold border border-hairline font-mono">
                    {course.duration}
                  </span>
                </div>
                <p className="type-body text-ink-secondary text-sm mb-4">{course.name}</p>
                <div className="text-xs text-amber-600 font-bold flex items-center gap-1.5 font-sans">
                  <span>✓</span> Direct ₹3,000–₹10,000 admission fee grant eligible
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ SECTION 3: HOW THE SUBSIDY PROCESS WORKS (WARM SUBTLE BG) ══════ */}
      <section className="py-24 px-4 bg-subtle border-y border-hairline" aria-label="Step-by-step Process">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-2 font-mono">
              Step-by-Step Transparency
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-ink-primary mb-3 tracking-tight">
              How to Claim Your Admission Subsidy
            </h2>
            <p className="text-ink-secondary text-base font-sans leading-relaxed">
              4 simple steps to save thousands on college tuition with zero broker interference:
            </p>
          </div>

          <CareerRoadmapFlow />
        </div>
      </section>

      {/* ══════ SECTION 4: APPLICATION FORM (SUBTLE BG) ══════ */}
      <section id="student-apply" className="section-spacing bg-subtle border-t border-hairline" aria-label="Student Application Form">
        <div className="max-w-3xl mx-auto px-4">
          <div className="p-8 sm:p-10 rounded-card bg-surface border border-amber-200 shadow-xl relative overflow-hidden">
            <div className="text-center mb-8">
              <span className="type-eyebrow text-amber-600 block mb-2">
                Priority Application
              </span>
              <h2 className="type-h2 text-2xl sm:text-3xl mb-2">
                Apply for Free Career Guidance &amp; College Subsidy
              </h2>
              <p className="type-body text-ink-secondary">
                Takes only 60 seconds. Our counselor will contact you within 24 hours.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {submitState === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500">
                    <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
                  </div>
                  <h3 className="type-h3 text-2xl mb-2">
                    Application Received!
                  </h3>
                  <p className="type-body text-ink-secondary max-w-md mx-auto mb-6">
                    Our academic counselor will review your academic background and call you or reach out via WhatsApp with partner college subsidy details.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitState('idle')}
                    className="text-amber-600 text-xs font-bold hover:underline font-sans"
                  >
                    ← Submit Another Application
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-ink-primary mb-1 font-sans">
                        Student Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register('name', { required: 'Name is required' })}
                        placeholder="Rahul Sharma"
                        className="w-full px-4 py-3 rounded-btn bg-white border border-hairline text-ink-primary placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-sans"
                      />
                      {errors.name && <p className="text-red-500 text-[11px] mt-1 font-sans">{errors.name.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-ink-primary mb-1 font-sans">
                        WhatsApp / Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        {...register('phone', { required: 'Phone number is required' })}
                        placeholder="+91 85096 84056"
                        className="w-full px-4 py-3 rounded-btn bg-white border border-hairline text-ink-primary placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-sans"
                      />
                      {errors.phone && <p className="text-red-500 text-[11px] mt-1 font-sans">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-ink-primary mb-1 font-sans">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        {...register('email', { required: 'Email is required' })}
                        placeholder="rahul@example.com"
                        className="w-full px-4 py-3 rounded-btn bg-white border border-hairline text-ink-primary placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-sans"
                      />
                      {errors.email && <p className="text-red-500 text-[11px] mt-1 font-sans">{errors.email.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-ink-primary mb-1 font-sans">
                        Education Status
                      </label>
                      <select
                        {...register('education_level')}
                        className="w-full px-4 py-3 rounded-btn bg-white border border-hairline text-ink-primary text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-sans cursor-pointer"
                      >
                        <option value="12th Pass (Science - PCM/PCB)">12th Pass (Science - PCM/PCB)</option>
                        <option value="12th Pass (Commerce)">12th Pass (Commerce)</option>
                        <option value="12th Pass (Arts / Humanities)">12th Pass (Arts / Humanities)</option>
                        <option value="Polytechnic Diploma Student">Polytechnic Diploma Student</option>
                        <option value="College Undergraduate">College Undergraduate</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-ink-primary mb-1 font-sans">
                      Preferred Degree Stream or Target Career
                    </label>
                    <input
                      {...register('preferred_field')}
                      placeholder="e.g. B.Tech Computer Science, AI & Robotics, BCA, or BBA"
                      className="w-full px-4 py-3 rounded-btn bg-white border border-hairline text-ink-primary placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-sans"
                    />
                  </div>

                  <div className="p-4 rounded-btn bg-amber-50 border border-amber-200 space-y-2">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs sm:text-sm text-ink-primary font-sans">
                      <input
                        type="checkbox"
                        defaultChecked
                        {...register('interested_in_college_subsidy')}
                        className="mt-0.5 rounded text-amber-500 focus:ring-0"
                      />
                      <span>Apply for ₹3,000 – ₹10,000 Official Partner College Fee Subsidy</span>
                    </label>
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs sm:text-sm text-ink-primary font-sans">
                      <input
                        type="checkbox"
                        defaultChecked
                        {...register('interested_in_training')}
                        className="mt-0.5 rounded text-amber-500 focus:ring-0"
                      />
                      <span>Interested in 3-Month Advanced Industrial IoT &amp; AI Training</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-ink-primary mb-1 font-sans">
                      Your Questions / Specific Target Colleges
                    </label>
                    <textarea
                      rows={3}
                      {...register('message')}
                      placeholder="Tell us what state/city you prefer or any specific doubts about fees, college placement, or course selection..."
                      className="w-full px-4 py-3 rounded-btn bg-white border border-hairline text-ink-primary placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 resize-none font-sans"
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-3.5 rounded-btn bg-red-50 border border-red-200 text-red-600 text-xs font-sans">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitState === 'submitting'}
                    className="w-full py-4 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm uppercase tracking-wider shadow-[0_4px_16px_rgba(245,158,11,0.35)] transition-all disabled:opacity-50 font-sans"
                  >
                    {submitState === 'submitting'
                      ? 'Submitting Application...'
                      : 'Claim 100% Free Guidance & Subsidy →'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ══════ SECTION 5: STUDENT & PARENT FAQS (CANVAS) ══════ */}
      <section className="section-spacing bg-canvas border-t border-hairline" aria-label="Student FAQs">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeader
            eyebrow="Common Questions"
            title="Frequently Asked Questions by Students &amp; Parents"
            subtitle="Transparent details on our zero-fee counseling model and accreditation verification."
          />

          <div className="mt-12 space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx
              return (
                <div
                  key={idx}
                  className="rounded-card bg-surface border border-hairline shadow-sm overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left px-6 py-4 flex items-center justify-between text-base font-semibold text-ink-primary hover:text-amber-600 transition-colors font-heading"
                  >
                    <span>{faq.q}</span>
                    <span className="text-amber-500 text-lg font-mono">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-ink-secondary border-t border-hairline pt-4 leading-relaxed font-sans">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Bottom Review & Rate Callout */}
          <div className="mt-14 p-6 rounded-card bg-subtle text-center border border-hairline">
            <p className="text-sm text-ink-secondary mb-2 font-sans">Have you consulted with our academic advisors?</p>
            <button
              type="button"
              onClick={() => setReviewModalOpen(true)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-amber-600 hover:underline font-sans"
            >
              <span>★ 5.0</span> Rate OpenMNC on Google Business Profile →
            </button>
          </div>
        </div>
      </section>

      <GoogleReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
      />
    </>
  )
}
