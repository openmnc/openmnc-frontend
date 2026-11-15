import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { settingsApi } from '../../api/settings.js'

const SETTINGS_SECTIONS = [
  {
    id: 'hero',
    title: 'Hero Section',
    description: 'Main headline, sub-headline and call to action buttons on the home page.',
    fields: [
      { key: 'hero_headline', label: 'Hero Headline', type: 'text' },
      { key: 'hero_subheadline', label: 'Hero Sub-headline', type: 'textarea' },
      { key: 'hero_cta_primary', label: 'Primary CTA Text', type: 'text' },
      { key: 'hero_cta_secondary', label: 'Secondary CTA Text', type: 'text' },
    ],
  },
  {
    id: 'about',
    title: 'About & Founder',
    description: 'Company description and founder profile shown on the About section.',
    fields: [
      { key: 'about_title', label: 'About Section Title', type: 'text' },
      { key: 'about_description', label: 'About Description', type: 'textarea' },
      { key: 'founder_name', label: 'Founder Name', type: 'text' },
      { key: 'founder_role', label: 'Founder Role', type: 'text' },
    ],
  },
  {
    id: 'contact',
    title: 'Contact Information',
    description: 'Email, phone, WhatsApp, and location details shown across the website.',
    fields: [
      { key: 'contact_email', label: 'Public Email', type: 'email' },
      { key: 'contact_phone', label: 'Phone Number', type: 'text' },
      { key: 'contact_whatsapp', label: 'WhatsApp Number (with country code)', type: 'text' },
      { key: 'contact_city', label: 'City / Location', type: 'text' },
    ],
  },
]

export default function SettingsAdmin() {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [savingKey, setSavingKey] = useState(null)
  const [saveStatus, setSaveStatus] = useState({}) // { [key]: 'saved' | 'error' }

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    setLoading(true)
    try {
      const res = await settingsApi.getAll()
      setSettings(res.data || {})
    } catch {
      // Fallback defaults if API is not yet loaded
      setSettings({
        hero_headline: 'We Build What You Envision',
        hero_subheadline: 'AI-powered solutions, custom software, and organic growth for solopreneurs and visionary entrepreneurs.',
        hero_cta_primary: 'Explore Our Services',
        hero_cta_secondary: 'Get Free Consultation',
        about_title: 'About OpenMNC LLP',
        about_description: 'OpenMNC LLP is a technology and digital solutions company founded by Amit Barai. We help solopreneurs and visionary entrepreneurs transform their ideas into reality.',
        founder_name: 'Amit Barai',
        founder_role: 'Founder & Director',
        contact_email: 'hello@openmnc.com',
        contact_phone: '+91 8509684056',
        contact_whatsapp: '+91 8509684056',
        contact_city: 'India',
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
        <div className="w-8 h-8 border-2 border-cyan-neon/30 border-t-cyan-neon rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white mb-1">Site Settings</h1>
        <p className="text-gray-400 text-sm">
          Update public copy, headlines, contact details, and founder info dynamically.
        </p>
      </div>

      <div className="space-y-8">
        {SETTINGS_SECTIONS.map((section) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <div className="border-b border-white/5 pb-4 mb-6">
              <h2 className="font-display text-lg font-bold text-white">{section.title}</h2>
              <p className="text-gray-400 text-xs mt-0.5">{section.description}</p>
            </div>

            <div className="space-y-5">
              {section.fields.map((field) => {
                const isSaving = savingKey === field.key
                const status = saveStatus[field.key]
                const value = settings[field.key] ?? ''

                return (
                  <div key={field.key} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor={field.key} className="block text-xs font-medium text-gray-300">
                        {field.label}
                      </label>
                      <span className="text-[10px] text-gray-500 font-mono">{field.key}</span>
                    </div>

                    <div className="flex gap-3">
                      {field.type === 'textarea' ? (
                        <textarea
                          id={field.key}
                          rows={3}
                          value={value}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40 resize-none"
                        />
                      ) : (
                        <input
                          id={field.key}
                          type={field.type}
                          value={value}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
                        />
                      )}

                      <button
                        type="button"
                        onClick={() => handleSave(field.key)}
                        disabled={isSaving}
                        className={`
                          px-4 py-2 rounded-lg text-xs font-semibold self-end transition-all
                          ${status === 'saved'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : status === 'error'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : 'bg-cyan-neon/10 hover:bg-cyan-neon/20 text-cyan-neon border border-cyan-neon/30'
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
