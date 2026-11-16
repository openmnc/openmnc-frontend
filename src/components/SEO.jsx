import { Helmet } from 'react-helmet-async'

const BASE_URL = 'https://openmnc.com'
const DEFAULT_TITLE = 'OpenMNC LLP — Global AI Automation, Custom Software & Enterprise Solutions'
const DEFAULT_DESC = 'OpenMNC LLP is an enterprise AI automation and custom software engineering company based in Kolkata, India. Delivering autonomous AI workflows, SaaS platforms, and free student guidance.'
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
  // Ensure canonical is always absolute and points to the specific route
  const fullCanonical = canonical
    ? (canonical.startsWith('http') ? canonical : `${BASE_URL}${canonical.startsWith('/') ? canonical : '/' + canonical}`)
    : BASE_URL

  const fullImage = image.startsWith('http') ? image : `${BASE_URL}${image.startsWith('/') ? image : '/' + image}`

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

      {/* 2. Canonical URL (Strictly route-specific to prevent duplicate homepage canonicals) */}
      <link rel="canonical" href={fullCanonical} />

      {/* 3. Open Graph / Social Embeds */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="OpenMNC LLP" />
      <meta property="og:locale" content="en_IN" />

      {/* 4. Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullCanonical} />
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
