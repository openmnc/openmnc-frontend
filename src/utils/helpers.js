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
 * Map service slug to an emoji icon.
 */
export function getServiceIcon(icon, slug) {
  const iconMap = {
    automation: '🤖',
    code: '💻',
    development: '💻',
    apps: '📱',
    social: '📈',
    'social-media': '📈',
    education: '🎓',
    'student-guidance': '🎓',
    training: '⚡',
    consultation: '💡',
    default: '⚡',
  }
  if (icon && iconMap[icon]) return iconMap[icon]
  if (slug) {
    for (const key of Object.keys(iconMap)) {
      if (slug.includes(key)) return iconMap[key]
    }
  }
  return iconMap.default
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
