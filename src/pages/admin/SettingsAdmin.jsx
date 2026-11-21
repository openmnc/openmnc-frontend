import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { settingsApi } from '../../api/settings.js'

const SETTINGS_SECTIONS = [
  {
    id: 'hero',
    title: 'Hero Section Copy',
    description: 'Main display title, subheadline, and primary calls to action on the home page.',
    fields: [
      { key: 'hero_headline', label: 'Display Headline', type: 'text' },
      { key: 'hero_subheadline', label: 'Sub-headline Description', type: 'textarea' },
      { key: 'hero_cta_primary', label: 'Primary Button Label', type: 'text' },
      { key: 'hero_cta_secondary', label: 'Secondary Button Label', type: 'text' },
    ],
  },
  {
    id: 'corporate',
    title: 'Corporate & Legal Info',
    description: 'Formal company registration details for invoices, terms, footer, and schema.',
    fields: [
      { key: 'company_legal_name', label: 'Official Legal Entity Name', type: 'text' },
      { key: 'company_brand_name', label: 'Brand Name (Used in headers/ads)', type: 'text' },
      { key: 'founder_name', label: 'Managing Director / Founder', type: 'text' },
      { key: 'google_review_url', label: 'Google Business Profile Review Link', type: 'text' },
    ],
  },
  {
    id: 'contact',
    title: 'Contact & Communication',
    description: 'Email, direct phone, WhatsApp number, and headquarters location.',
    fields: [
      { key: 'contact_email', label: 'Primary Contact Email', type: 'email' },
      { key: 'contact_phone', label: 'Direct Phone Number', type: 'text' },
      { key: 'contact_whatsapp', label: 'WhatsApp Number (with country code)', type: 'text' },
      { key: 'contact_city', label: 'Headquarters Location', type: 'text' },
    ],
  },
]

export default function SettingsAdmin() {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [savingKey, setSavingKey] = useState(null)
  const [saveStatus, setSaveStatus] = useState({})

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    setLoading(true)
    try {
      const res = await settingsApi.getAll()
      setSettings(res.data || {})
    } catch {
      setSettings({
        hero_headline: 'Engineering-First Software & App Development Partner',
        hero_subheadline: 'We audit, rescue, publish, build, and scale production-grade digital products for founders globally.',
        hero_cta_primary: 'Solve My Problem →',
        hero_cta_secondary: '100% Free Career Guidance',
        company_legal_name: 'M/S. OPEN MNC LLP',
        company_brand_name: 'OpenMNC',
        founder_name: 'Amit Barai',
        google_review_url: 'https://search.google.com/local/writereview?placeid=ChIJu2lM2mMLAjoRMqerceA25dY',
        contact_email: 'amit@openmnc.com',
        contact_phone: '+91 8509684056',
        contact_whatsapp: '918509684056',
        contact_city: 'West Bengal, India',
      })
    } finally {
      setLoading(false)
    }
  }

  function handleChange(key, val) {
    setSettings((prev) => ({ ...prev, [key]: val }))
    setSaveStatus((prev) => ({ ...prev, [key]: undefined }))
  }

  async function handleSave(key) {
    setSavingKey(key)
    try {
      await settingsApi.update(key, settings[key] || '')
      setSaveStatus((prev) => ({ ...prev, [key]: 'saved' }))
      setTimeout(() => {
        setSaveStatus((prev) => ({ ...prev, [key]: undefined }))
      }, 2500)
    } catch {
      setSaveStatus((prev) => ({ ...prev, [key]: 'error' }))
    } finally {
      setSavingKey(null)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="w-8 h-8 border-2 border-[#2997ff]/30 border-t-[#2997ff] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-[#f5f5f7] tracking-tight mb-1">
          System Preferences &amp; Copy
        </h1>
        <p className="text-[#86868b] text-xs sm:text-sm">
          Update public copy, contact information, legal designations, and Google Business links dynamically.
        </p>
      </div>

      <div className="space-y-6">
        {SETTINGS_SECTIONS.map((section) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-[#161618] border border-white/8 p-6 sm:p-8"
          >
            <div className="border-b border-white/8 pb-4 mb-6">
              <h2 className="font-display text-base font-semibold text-white">{section.title}</h2>
              <p className="text-[#86868b] text-xs mt-0.5">{section.description}</p>
            </div>

            <div className="space-y-5">
              {section.fields.map((field) => {
                const isSaving = savingKey === field.key
                const status = saveStatus[field.key]
                const value = settings[field.key] ?? ''

                return (
                  <div key={field.key} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor={field.key} className="block text-xs font-medium text-[#d2d2d7]">
                        {field.label}
                      </label>
                      <span className="text-[10px] text-[#86868b] font-mono">{field.key}</span>
                    </div>

                    <div className="flex gap-3">
                      {field.type === 'textarea' ? (
                        <textarea
                          id={field.key}
                          rows={2}
                          value={value}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2997ff] resize-none"
                        />
                      ) : (
                        <input
                          id={field.key}
                          type={field.type}
                          value={value}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2997ff]"
                        />
                      )}

                      <button
                        type="button"
                        onClick={() => handleSave(field.key)}
                        disabled={isSaving}
                        className={`
                          px-4 py-2 rounded-full text-xs font-semibold self-end transition-all
                          ${status === 'saved'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : status === 'error'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                          }
                          disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                      >
                        {isSaving ? 'Saving...' : status === 'saved' ? 'Saved ✓' : status === 'error' ? 'Retry ✕' : 'Save'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
