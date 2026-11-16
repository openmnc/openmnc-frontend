import { useEffect } from 'react'

const BASE_URL = 'https://openmnc.com'
const DEFAULT_TITLE = 'OpenMNC LLP — Global AI Automation, Custom Software & Enterprise Solutions'
const DEFAULT_DESC = 'OpenMNC LLP is a global technology and AI automation company headquartered in West Bengal, India. We architect custom AI agents, automated enterprise workflows, web & mobile applications, and student career guidance for worldwide and domestic sectors.'
const DEFAULT_IMAGE = `${BASE_URL}/logo.png`
const DEFAULT_KEYWORDS = 'OpenMNC, Open MNC, OpenMNC LLP, global AI automation company, enterprise AI workflows, LLM integration, custom software development, SaaS engineering, FinTech AI automation, Healthcare AI bots, E-commerce automation, best colleges after 12th, free student career guidance, college admission discount subsidy, industrial training IoT robotics, tech company West Bengal India, Amit Barai'

function updateMetaTag(name, content, isProperty = false) {
  if (!content) return
  const attribute = isProperty ? 'property' : 'name'
  let tag = document.querySelector(`meta[${attribute}="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function updateCanonical(url) {
  let link = document.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', url)
}

function updateJsonLd(schemaId, schemaData) {
  const existingScript = document.getElementById(schemaId)
  if (existingScript) {
    existingScript.remove()
  }
  if (!schemaData) return
  const script = document.createElement('script')
  script.id = schemaId
  script.type = 'application/ld+json'
  script.text = JSON.stringify(schemaData)
  document.head.appendChild(script)
}

export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  keywords = DEFAULT_KEYWORDS,
  canonical = '',
  image = DEFAULT_IMAGE,
  type = 'website',
  schema = null,
}) {
  useEffect(() => {
    // 1. Page Title
    document.title = title

    // 2. Standard Meta Tags
    updateMetaTag('title', title)
    updateMetaTag('description', description)
    updateMetaTag('keywords', keywords)
    updateMetaTag('author', 'Amit Barai, OpenMNC LLP')
    updateMetaTag('robots', 'index, follow')

    // 3. Canonical URL
    const fullCanonical = canonical.startsWith('http') ? canonical : `${BASE_URL}${canonical}`
    updateCanonical(fullCanonical)

    // 4. Open Graph (Facebook / LinkedIn / WhatsApp)
    updateMetaTag('og:type', type, true)
    updateMetaTag('og:url', fullCanonical, true)
    updateMetaTag('og:title', title, true)
    updateMetaTag('og:description', description, true)
    updateMetaTag('og:image', image, true)
    updateMetaTag('og:site_name', 'OpenMNC LLP', true)
    updateMetaTag('og:locale', 'en_IN', true)

    // 5. Twitter
    updateMetaTag('twitter:card', 'summary_large_image')
    updateMetaTag('twitter:url', fullCanonical)
    updateMetaTag('twitter:title', title)
    updateMetaTag('twitter:description', description)
    updateMetaTag('twitter:image', image)

    // 6. JSON-LD Schema
    const scriptId = 'page-jsonld-schema'
    if (schema) {
      updateJsonLd(scriptId, schema)
    }

    return () => {
      const el = document.getElementById(scriptId)
      if (el) el.remove()
    }
  }, [title, description, keywords, canonical, image, type, schema])

  return null
}
