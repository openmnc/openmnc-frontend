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
  ArrowRight,
  ShieldCheck,
  Building,
  Award,
  Sparkles,
} from 'lucide-react'
import SEO from '../components/SEO.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import ScrollReveal from '../components/ScrollReveal.jsx'
import ThreeBackground from '../components/ThreeBackground.jsx'
import GoogleReviewModal from '../components/GoogleReviewModal.jsx'
import apiClient from '../api/client.js'
import { whatsappUrl } from '../utils/helpers.js'
import { studentGuidanceFaqSchema, courseSchema } from '../utils/jsonld.js'

const BENEFITS = [
  {
    icon: <GraduationCap className="w-8 h-8 text-amber-400" strokeWidth={1.5} aria-hidden="true" />,
    title: '100% Free Career Guidance',
    desc: 'Unbiased aptitude counseling for 12th Science, Commerce & Arts students. Zero consultation fees, zero agent commissions.',
    badge: '₹0 Student Cost',
  },
  {
    icon: <BadgePercent className="w-8 h-8 text-amber-400" strokeWidth={1.5} aria-hidden="true" />,
    title: '₹3,000 to ₹10,000 Fee Subsidy',
    desc: 'Official industrial partnership subsidy discounted directly from your partner college admission fees.',
    badge: 'Direct Discount',
  },
  {
    icon: <Cpu className="w-8 h-8 text-amber-400" strokeWidth={1.5} aria-hidden="true" />,
    title: '3-Month Industrial Training',
    desc: 'Live hands-on training in Robotics, Drones, IoT microcontrollers, and modern AI/Web engineering.',
    badge: 'Live Projects',
  },
  {
    icon: <Briefcase className="w-8 h-8 text-amber-400" strokeWidth={1.5} aria-hidden="true" />,
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
          className="p-6 rounded-2xl bg-[#0f172a] border border-amber-500/20 hover:border-amber-400/50 transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-2xl font-extrabold text-amber-500">
                {st.num}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-amber-500/30 text-amber-400 bg-amber-500/10 font-mono">
                Stage {st.num}
              </span>
            </div>
            <h3 className="font-display text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
              {st.title}
            </h3>
            <p className="text-slate-300 font-body text-sm leading-relaxed">
              {st.desc}
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-800 flex items-center gap-1.5 text-xs text-amber-400 font-medium font-body">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
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

      {/* ══════ HERO SECTION ══════ */}
      <section
        className="relative pt-32 pb-20 px-4 bg-[#0B0F19] overflow-hidden"
        aria-label="Career Guidance Hero"
      >
        <div className="absolute inset-0 aspect-[16/9] sm:aspect-auto overflow-hidden pointer-events-none">
          <ThreeBackground section="hero" className="opacity-30" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-6 shadow-sm font-body">
            <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
            <span>OpenMNC Academy &amp; Higher Education Portal · 100% Free For Students</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Confused After 12th? Get <span className="text-amber-400">100% Free Career Guidance</span> &amp; Claim{' '}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              ₹3,000–₹10,000 Fee Subsidies.
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed mb-8 font-body font-normal">
            Don&apos;t pay high broker commissions or risk joining low-placement colleges. As an authorized
            industrial technology partner, OpenMNC helps you choose the right college and stream based on genuine aptitude
            — and discounts ₹3,000 to ₹10,000 directly from your admission fees.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <a
              href="#student-apply"
              className="px-8 py-4 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-base shadow-[0_4px_20px_rgba(245,158,11,0.4)] transition-all w-full sm:w-auto font-body text-center"
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
              className="px-8 py-4 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium text-base transition-all flex items-center justify-center gap-2 w-full sm:w-auto font-body"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              <span>Chat With Academic Counselor</span>
            </a>
          </div>

          {/* Quick Trust Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-800 text-left">
            <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800">
              <span className="text-amber-400 font-bold text-base block font-display">100% Free</span>
              <span className="text-slate-300 text-xs sm:text-sm font-body">Zero student or parent charges</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800">
              <span className="text-blue-400 font-bold text-base block font-display">₹3k – ₹10k</span>
              <span className="text-slate-300 text-xs sm:text-sm font-body">Direct fee deduction grant</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800">
              <span className="text-purple-400 font-bold text-base block font-display">12+ Partners</span>
              <span className="text-slate-300 text-xs sm:text-sm font-body">UGC &amp; AICTE accredited</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800">
              <span className="text-emerald-400 font-bold text-base block font-display">Real IoT Labs</span>
              <span className="text-slate-300 text-xs sm:text-sm font-body">Robotics &amp; AI project training</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ THE 4 PILLARS OF OPENMNC ACADEMY ══════ */}
      <section className="py-20 px-4 bg-[#0a0e1a] border-y border-slate-800" aria-label="Key Benefits">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="Distinct From Software Services"
            title="The OpenMNC Career &amp; EdTech Engine"
            subtitle="Engineered specifically for students and parents seeking honest college roadmaps and tangible financial relief."
          />

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.1}>
                <div className="p-7 rounded-3xl bg-[#0f172a] border border-slate-800 hover:border-amber-400/50 transition-all duration-300 h-full flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-4xl" aria-hidden="true">{item.icon}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed font-body">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ POPULAR COURSE PATHWAYS ══════ */}
      <section className="py-20 px-4 bg-[#0B0F19]" aria-label="Eligible Degree & Diploma Streams">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="Degree &amp; Diploma Tracks"
            title="Eligible Degree Streams for Partner Subsidies"
            subtitle="Get admission guidance and institutional subsidies across top technical and management universities."
          />

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {ELIGIBLE_COURSES.map((course) => (
              <div key={course.code} className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-amber-500/40 transition-all shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display text-lg font-bold text-white">{course.code}</h3>
                  <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-blue-400 font-semibold border border-slate-700 font-mono">
                    {course.duration}
                  </span>
                </div>
                <p className="text-slate-300 text-sm mb-4 leading-relaxed font-body">{course.name}</p>
                <div className="text-xs text-amber-400 font-bold flex items-center gap-1.5 font-body">
                  <span>✓</span> Direct ₹3,000–₹10,000 admission fee grant eligible
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ HOW THE SUBSIDY PROCESS WORKS (WITH VISUAL ROADMAP) ══════ */}
      <section className="py-20 px-4 bg-[#0a0e1a] border-t border-slate-800" aria-label="Step-by-step Process">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="Step-by-Step Transparency"
            title="How to Claim Your Admission Subsidy"
            subtitle="4 simple steps to save thousands on college tuition with zero broker interference."
          />

          <CareerRoadmapFlow />
        </div>
      </section>

      {/* ══════ DIRECT APPLICATION FORM SECTION ══════ */}
      <section id="student-apply" className="py-20 px-4 bg-[#0B0F19]" aria-label="Student Application Form">
        <div className="max-w-3xl mx-auto">
          <div className="p-8 sm:p-10 rounded-3xl bg-[#0f172a] border border-amber-500/30 shadow-2xl relative overflow-hidden">
            <div className="text-center mb-8">
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block mb-2 font-mono">
                Priority Application
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
                Apply for Free Career Guidance &amp; College Subsidy
              </h2>
              <p className="text-slate-300 text-sm font-body">
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
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white mb-2">
                    Application Received!
                  </h3>
                  <p className="text-slate-300 text-sm max-w-md mx-auto mb-6 font-body">
                    Our academic counselor will review your academic background and call you or reach out via WhatsApp with partner college subsidy details.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitState('idle')}
                    className="text-amber-400 text-xs font-bold hover:underline font-body"
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
                      <label className="block text-xs font-medium text-slate-300 mb-1 font-body">
                        Student Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        {...register('name', { required: 'Name is required' })}
                        placeholder="Rahul Sharma"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 font-body"
                      />
                      {errors.name && <p className="text-red-400 text-[11px] mt-1 font-body">{errors.name.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1 font-body">
                        WhatsApp / Phone Number <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        {...register('phone', { required: 'Phone number is required' })}
                        placeholder="+91 85096 84056"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 font-body"
                      />
                      {errors.phone && <p className="text-red-400 text-[11px] mt-1 font-body">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1 font-body">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        {...register('email', { required: 'Email is required' })}
                        placeholder="rahul@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 font-body"
                      />
                      {errors.email && <p className="text-red-400 text-[11px] mt-1 font-body">{errors.email.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1 font-body">
                        Education Status
                      </label>
                      <select
                        {...register('education_level')}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 font-body"
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
                    <label className="block text-xs font-medium text-slate-300 mb-1 font-body">
                      Preferred Degree Stream or Target Career
                    </label>
                    <input
                      {...register('preferred_field')}
                      placeholder="e.g. B.Tech Computer Science, AI & Robotics, BCA, or BBA"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 font-body"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2.5">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs sm:text-sm text-slate-200 font-body">
                      <input
                        type="checkbox"
                        defaultChecked
                        {...register('interested_in_college_subsidy')}
                        className="mt-0.5 rounded text-amber-500 focus:ring-0"
                      />
                      <span>Apply for ₹3,000 – ₹10,000 Official Partner College Fee Subsidy</span>
                    </label>
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs sm:text-sm text-slate-200 font-body">
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
                    <label className="block text-xs font-medium text-slate-300 mb-1 font-body">
                      Your Questions / Specific Target Colleges
                    </label>
                    <textarea
                      rows={3}
                      {...register('message')}
                      placeholder="Tell us what state/city you prefer or any specific doubts about fees, college placement, or course selection..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 resize-none font-body"
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-body">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitState === 'submitting'}
                    className="w-full py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm uppercase tracking-wider shadow-[0_4px_20px_rgba(245,158,11,0.4)] transition-all disabled:opacity-50 font-body"
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

      {/* ══════ STUDENT & PARENT FAQS ══════ */}
      <section className="py-20 px-4 bg-[#0a0e1a] border-t border-slate-800" aria-label="Student FAQs">
        <div className="max-w-4xl mx-auto">
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
                  className="rounded-2xl bg-[#0f172a] border border-slate-800 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left px-6 py-4 flex items-center justify-between text-base font-semibold text-white hover:text-amber-400 transition-colors font-display"
                  >
                    <span>{faq.q}</span>
                    <span className="text-amber-400 text-lg font-mono">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-slate-300 border-t border-slate-800/80 pt-4 leading-relaxed font-body">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Bottom Review & Rate Callout */}
          <div className="mt-14 p-6 rounded-2xl bg-[#0f172a] text-center border border-slate-800">
            <p className="text-sm text-slate-300 mb-2 font-body">Have you consulted with our academic advisors?</p>
            <button
              type="button"
              onClick={() => setReviewModalOpen(true)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:underline font-body"
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
