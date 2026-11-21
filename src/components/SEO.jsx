import { Helmet } from 'react-helmet-async'

const BASE_URL = 'https://openmnc.com'
const DEFAULT_TITLE = 'OpenMNC | Tech & Career — Custom Software, App Store Publishing & Career Guidance'
const DEFAULT_DESC = 'OpenMNC (M/S. OPEN MNC LLP) delivers production-grade custom software, App Store & Play Store publishing, vibe-coded app audits, and 100% free student career guidance.'
const DEFAULT_IMAGE = `${BASE_URL}/logo.webp`
const DEFAULT_KEYWORDS = 'OpenMNC, AI automation company Kolkata, Custom software development India, IoT embedded engineering services, B2B AI integration, App development agency, Free student career guidance India, B.Tech industrial training Kolkata'

export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  keywords = DEFAULT_KEYWORDS,
  canonical = '',
  image = DEFAULT_IMAGE,
  type = 'website',
  schema = null,
}) {
  // Ensure canonical URL is strictly non-www https://openmnc.com
  let cleanCanonical = canonical
    ? (canonical.startsWith('http') ? canonical : `${BASE_URL}${canonical.startsWith('/') ? canonical : '/' + canonical}`)
    : BASE_URL

  // Strictly enforce non-www https://openmnc.com and normalize slashes
  cleanCanonical = cleanCanonical
    .replace('https://www.openmnc.com', 'https://openmnc.com')
    .replace('http://www.openmnc.com', 'https://openmnc.com')
    .replace('http://openmnc.com', 'https://openmnc.com')

  // Remove trailing slash for sub-routes, retain clean canonical
  if (cleanCanonical !== BASE_URL && cleanCanonical.endsWith('/')) {
    cleanCanonical = cleanCanonical.slice(0, -1)
  }

  let fullImage = image.startsWith('http') ? image : `${BASE_URL}${image.startsWith('/') ? image : '/' + image}`
  fullImage = fullImage
    .replace('https://www.openmnc.com', 'https://openmnc.com')
    .replace('http://www.openmnc.com', 'https://openmnc.com')

  // Support single schema object or array of schema objects
  const schemas = Array.isArray(schema) ? schema.filter(Boolean) : schema ? [schema] : []

  return (
    <Helmet>
      {/* 1. Primary Page Metadata */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Amit Barai, OpenMNC LLP" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      {/* 2. Canonical URL (Strictly route-specific non-www https://openmnc.com) */}
      <link rel="canonical" href={cleanCanonical} />

      {/* 3. Open Graph / Social Embeds */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={cleanCanonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="OpenMNC LLP" />
      <meta property="og:locale" content="en_IN" />

      {/* 4. Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={cleanCanonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* 5. Rich Snippets & AI Semantic Web (JSON-LD) */}
      {schemas.map((s, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  )
}
