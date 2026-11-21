import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import SEO from '../components/SEO.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import ScrollReveal from '../components/ScrollReveal.jsx'
import GlowButton from '../components/GlowButton.jsx'
import ThreeBackground from '../components/ThreeBackground.jsx'
import GoogleReviewModal from '../components/GoogleReviewModal.jsx'
import apiClient from '../api/client.js'
import { whatsappUrl } from '../utils/helpers.js'
import { studentGuidanceFaqSchema, courseSchema } from '../utils/jsonld.js'

const BENEFITS = [
  {
    icon: '🎓',
    title: '100% Free Career Guidance',
    desc: 'Unbiased aptitude counseling for 12th Science, Commerce & Arts students. Zero consultation fees, zero agent commissions.',
    badge: '₹0 Student Cost',
  },
  {
    icon: '💰',
    title: '₹3,000 to ₹10,000 Fee Subsidy',
    desc: 'Official industrial partnership subsidy discounted directly from your partner college admission fees.',
    badge: 'Direct Discount',
  },
  {
    icon: '🤖',
    title: '3-Month Industrial Training',
    desc: 'Live hands-on training in Robotics, Drones, IoT microcontrollers, and modern AI/Web engineering.',
    badge: 'Live Projects',
  },
  {
    icon: '💼',
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

export default function CareerGuidance() {
  const [activeFaq, setActiveFaq] = useState(null)
  const [submitState, setSubmitState] = useState('idle') // idle | submitting | success | error
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
        className="relative pt-28 sm:pt-36 pb-20 px-4 bg-navy-950 overflow-hidden"
        aria-label="Career Guidance Hero"
      >
        <div className="absolute inset-0 aspect-[16/9] sm:aspect-auto overflow-hidden pointer-events-none">
          <ThreeBackground section="hero" className="opacity-30" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-glow/10 border border-amber-glow/30 text-amber-glow text-xs font-semibold tracking-wider uppercase mb-6 shadow-sm">
            <span>🎓</span>
            <span>OpenMNC Academy &amp; Higher Education Portal · 100% Free For Students</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Confused After 12th? Get <span className="text-amber-glow">100% Free Career Guidance</span> &amp; Claim{' '}
            <span className="gradient-text">₹3,000–₹10,000 Fee Subsidies.</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            Don&apos;t pay high broker commissions or risk joining low-placement colleges. As an authorized
            industrial technology partner, OpenMNC helps you choose the right college and stream based on genuine aptitude
            — and discounts ₹3,000 to ₹10,000 directly from your admission fees.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <a
              href="#student-apply"
              className="px-8 py-4 rounded-xl bg-amber-glow text-navy-950 font-bold text-base shadow-amber-glow hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
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
              className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold text-base transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <span>💬</span> Chat With Academic Counselor
            </a>
          </div>

          {/* Quick Trust Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto pt-6 border-t border-white/10 text-left">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-amber-glow font-bold text-sm block">100% Free</span>
              <span className="text-gray-400 text-xs">Zero student or parent charges</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-cyan-neon font-bold text-sm block">₹3k – ₹10k</span>
              <span className="text-gray-400 text-xs">Direct fee deduction grant</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-purple-400 font-bold text-sm block">12+ Partners</span>
              <span className="text-gray-400 text-xs">UGC &amp; AICTE accredited colleges</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-emerald-400 font-bold text-sm block">Real IoT Labs</span>
              <span className="text-gray-400 text-xs">Robotics &amp; AI project training</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ THE 4 PILLARS OF OPENMNC ACADEMY ══════ */}
      <section className="py-20 px-4 bg-navy-900 border-y border-white/5" aria-label="Key Benefits">
        <div className="container-max">
          <SectionHeader
            eyebrow="Distinct From Software Services"
            title="The OpenMNC Career &amp; EdTech Engine"
            subtitle="Engineered specifically for students and parents seeking honest college roadmaps and tangible financial relief."
          />

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.1}>
                <div className="glass-card p-6 h-full flex flex-col justify-between hover:border-amber-glow/40 transition-all duration-300">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-4xl" aria-hidden="true">{item.icon}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-glow/10 text-amber-glow border border-amber-glow/20">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ POPULAR COURSE PATHWAYS ══════ */}
      <section className="py-20 px-4 bg-navy-950" aria-label="Eligible Degree & Diploma Streams">
        <div className="container-max">
          <SectionHeader
            eyebrow="Degree &amp; Diploma Tracks"
            title="Eligible Degree Streams for Partner Subsidies"
            subtitle="Get admission guidance and institutional subsidies across top technical and management universities."
          />

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {ELIGIBLE_COURSES.map((course) => (
              <div key={course.code} className="glass-card p-6 border border-white/10 hover:border-cyan-neon/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display text-lg font-bold text-white">{course.code}</h3>
                  <span className="text-xs px-2.5 py-1 rounded bg-white/5 text-cyan-neon font-semibold border border-white/10">
                    {course.duration}
                  </span>
                </div>
                <p className="text-gray-300 text-xs sm:text-sm mb-4 leading-relaxed">{course.name}</p>
                <div className="text-[11px] text-amber-glow font-bold flex items-center gap-1.5">
                  <span>✓</span> Direct ₹3,000–₹10,000 admission fee grant eligible
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ HOW THE SUBSIDY PROCESS WORKS ══════ */}
      <section className="py-20 px-4 bg-navy-900 border-t border-white/5" aria-label="Step-by-step Process">
        <div className="container-max">
          <SectionHeader
            eyebrow="Step-by-Step Transparency"
            title="How to Claim Your Admission Subsidy"
            subtitle="4 simple steps to save thousands on college tuition with zero broker interference."
          />

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Submit Student Profile',
                desc: 'Fill out the form below with your 12th marks, stream, and preferred field of study.',
              },
              {
                step: '02',
                title: 'Free 1-on-1 Counseling',
                desc: 'Our academic mentor analyzes your career aptitude and discusses optimal college choices with you & your parents.',
              },
              {
                step: '03',
                title: 'College Selection',
                desc: 'Select from our audited, AICTE/UGC-accredited partner institutions with verified placement tracks.',
              },
              {
                step: '04',
                title: 'Direct Fee Deduction',
                desc: 'Receive your official OpenMNC Industrial Partnership Grant letter: ₹3,000 to ₹10,000 discounted from your college fees.',
              },
            ].map((s) => (
              <div key={s.step} className="glass-card p-6 text-center relative">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full border border-amber-glow/40 bg-navy-950 flex items-center justify-center font-display text-amber-glow font-bold">
                  {s.step}
                </div>
                <h3 className="font-display font-bold text-white text-base mb-2">{s.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ DIRECT APPLICATION FORM SECTION ══════ */}
      <section id="student-apply" className="py-20 px-4 bg-navy-950" aria-label="Student Application Form">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card p-6 sm:p-10 border border-amber-glow/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-glow/10 rounded-full blur-2xl pointer-events-none" />

            <div className="text-center mb-8">
              <span className="text-xs text-amber-glow font-bold uppercase tracking-wider block mb-2">
                Priority Application
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
                Apply for Free Career Guidance &amp; College Subsidy
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm">
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
                  <div className="text-5xl mb-4">🎉</div>
                  <h3 className="font-display text-2xl font-bold text-white mb-2">
                    Application Received!
                  </h3>
                  <p className="text-gray-300 text-sm max-w-md mx-auto mb-6">
                    Our academic counselor will review your academic background and call you or reach out via WhatsApp with partner college subsidy details.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitState('idle')}
                    className="text-amber-glow text-xs font-bold hover:underline"
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
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        Student Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        {...register('name', { required: 'Name is required' })}
                        placeholder="Rahul Sharma"
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-glow/40"
                      />
                      {errors.name && <p className="text-red-400 text-[11px] mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        WhatsApp / Phone Number <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        {...register('phone', { required: 'Phone number is required' })}
                        placeholder="+91 85096 84056"
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-glow/40"
                      />
                      {errors.phone && <p className="text-red-400 text-[11px] mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        {...register('email', { required: 'Email is required' })}
                        placeholder="rahul@example.com"
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-glow/40"
                      />
                      {errors.email && <p className="text-red-400 text-[11px] mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
                        Education Status
                      </label>
                      <select
                        {...register('education_level')}
                        className="w-full px-4 py-2.5 rounded-lg bg-navy-900 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-glow/40"
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
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Preferred Degree Stream or Target Career
                    </label>
                    <input
                      {...register('preferred_field')}
                      placeholder="e.g. B.Tech Computer Science, AI & Robotics, BCA, or BBA"
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-glow/40"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-glow/10 border border-amber-glow/20 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                      <input
                        type="checkbox"
                        defaultChecked
                        {...register('interested_in_college_subsidy')}
                        className="rounded text-amber-glow focus:ring-0"
                      />
                      <span>Apply for ₹3,000 – ₹10,000 Official Partner College Fee Subsidy</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                      <input
                        type="checkbox"
                        defaultChecked
                        {...register('interested_in_training')}
                        className="rounded text-amber-glow focus:ring-0"
                      />
                      <span>Interested in 3-Month Advanced Industrial IoT &amp; AI Training</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Your Questions / Specific Target Colleges
                    </label>
                    <textarea
                      rows={3}
                      {...register('message')}
                      placeholder="Tell us what state/city you prefer or any specific doubts about fees, college placement, or course selection..."
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-glow/40 resize-none"
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitState === 'submitting'}
                    className="w-full py-3.5 rounded-xl bg-amber-glow text-navy-950 font-bold text-xs uppercase tracking-wider shadow-amber-glow hover:bg-amber-glow/90 transition-all disabled:opacity-50"
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
      <section className="py-20 px-4 bg-navy-900 border-t border-white/5" aria-label="Student FAQs">
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
                  className="rounded-xl bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between text-sm sm:text-base font-semibold text-white/90 hover:text-amber-glow transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="text-amber-glow text-lg">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-gray-300 border-t border-white/5 pt-3 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Bottom Review & Rate Callout */}
          <div className="mt-14 glass-card p-6 text-center border border-white/10">
            <p className="text-xs text-gray-400 mb-2">Have you consulted with our academic advisors?</p>
            <button
              type="button"
              onClick={() => setReviewModalOpen(true)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:underline"
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
