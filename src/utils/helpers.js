import React from 'react'
import {
  Bot,
  Code2,
  Smartphone,
  TrendingUp,
  GraduationCap,
  Zap,
  Lightbulb,
  ShieldCheck,
  RefreshCw,
  Wrench,
  Database,
} from 'lucide-react'

/**
 * Format a date string to a readable format.
 */
export function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Truncate text to a given length.
 */
export function truncate(text, maxLen = 120) {
  if (!text) return ''
  return text.length > maxLen ? text.slice(0, maxLen) + '...' : text
}

/**
 * Map service slug or icon identifier to a crisp monochrome Lucide icon.
 */
export function getServiceIcon(icon, slug) {
  const iconMap = {
    audit: ShieldCheck,
    'vibe-coded': ShieldCheck,
    apps: Smartphone,
    publishing: Smartphone,
    transfer: RefreshCw,
    migration: Database,
    code: Code2,
    development: Code2,
    custom: Code2,
    maintenance: Wrench,
    amc: Wrench,
    support: Wrench,
    automation: Bot,
    social: TrendingUp,
    'social-media': TrendingUp,
    education: GraduationCap,
    'student-guidance': GraduationCap,
    training: Zap,
    consultation: Lightbulb,
    default: Zap,
  }

  let IconComponent = iconMap.default
  if (icon && iconMap[icon]) {
    IconComponent = iconMap[icon]
  } else if (slug) {
    for (const key of Object.keys(iconMap)) {
      if (slug.includes(key)) {
        IconComponent = iconMap[key]
        break
      }
    }
  }

  return React.createElement(IconComponent, { className: 'w-6 h-6 text-current' })
}

/**
 * Build a WhatsApp URL.
 */
export function whatsappUrl(phone, message = '') {
  const clean = phone.replace(/\D/g, '')
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${clean}${message ? `?text=${encoded}` : ''}`
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Generate a random float between min and max.
 */
export function randBetween(min, max) {
  return Math.random() * (max - min) + min
}

/**
 * Optimize Cloudinary image URLs for WebP/AVIF auto-format & quality (cuts payload size by 80%).
 */
export function optimizeCloudinaryUrl(url, width = 800) {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) {
    return url || ''
  }
  if (url.includes('/upload/f_auto') || url.includes('/upload/q_auto')) {
    return url
  }
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`)
}
