/**
 * JSON-LD Structured Data Schemas for OpenMNC LLP
 *
 * Usage:
 *   import { organizationSchema, websiteSchema, serviceSchema, jobPostingSchema } from './jsonld';
 *
 *   // Inject into <head> via react-helmet or a custom hook:
 *   <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
 */

// ---------------------------------------------------------------------------
// Organization Schema
// Inject on every page (layout level) to establish company identity.
// ---------------------------------------------------------------------------
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://openmnc.com/#organization",
  name: "OpenMNC LLP",
  alternateName: "OpenMNC",
  url: "https://openmnc.com",
  logo: {
    "@type": "ImageObject",
    url: "https://openmnc.com/logo.svg",
    width: 200,
    height: 60,
  },
  description:
    "OpenMNC LLP is a technology and business consulting company specializing in business automation, AI integration, custom software development, social media management, student guidance, and industrial training.",
  foundingDate: "2023",
  founder: {
    "@type": "Person",
    name: "Amit Barai",
    jobTitle: "Founder & Director",
    url: "https://openmnc.com/about",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+91-8509684056",
      contactType: "customer support",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
    {
      "@type": "ContactPoint",
      email: "hello@openmnc.com",
      contactType: "customer service",
    },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Kolkata",
    addressLocality: "Kolkata",
    addressRegion: "West Bengal",
    postalCode: "700001",
    addressCountry: "IN",
  },
  areaServed: [
    { "@type": "Country", "name": "Worldwide" },
    { "@type": "Country", "name": "United States" },
    { "@type": "Country", "name": "United Kingdom" },
    { "@type": "Country", "name": "India" },
    { "@type": "State", "name": "West Bengal" },
  ],
  knowsAbout: [
    "Artificial Intelligence Workflow Automation",
    "Large Language Model (LLM) Integration",
    "Enterprise Business Process Automation (BPA)",
    "Custom SaaS & Web Application Development",
    "FinTech & E-Commerce Automation",
    "Student Career Guidance & College Admission Scholarships",
    "Industrial IoT & Robotics Engineering",
    "Organic Social Media Growth & Viral Scripting"
  ],
  sameAs: [
    "https://www.linkedin.com/company/openmnc",
    "https://www.instagram.com/openmnc",
    "https://twitter.com/openmnc",
    "https://www.facebook.com/openmnc",
    "https://www.youtube.com/@openmnc",
  ],
};

// ---------------------------------------------------------------------------
// LocalBusiness / ProfessionalService Schema
// Registered headquarters in West Bengal, India — serving Global & Domestic sectors
// ---------------------------------------------------------------------------
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://openmnc.com/#localbusiness",
  name: "OpenMNC LLP",
  alternateName: ["OpenMNC", "Open MNC", "OpenMNC Global", "OpenMNC Tech"],
  url: "https://openmnc.com",
  logo: "https://openmnc.com/logo.png",
  image: "https://openmnc.com/logo.png",
  description:
    "OpenMNC LLP is a global technology and AI automation company headquartered in West Bengal, India. We deliver enterprise AI workflows, full-cycle custom software, and free student career guidance serving clients worldwide and across India.",
  telephone: "+91-8509684056",
  email: "hello@openmnc.com",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Kolkata",
    addressLocality: "Kolkata",
    addressRegion: "West Bengal",
    postalCode: "700001",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 22.5726,
    longitude: 88.3639,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "20:00",
    },
  ],
  areaServed: [
    { "@type": "Country", name: "Worldwide" },
    { "@type": "Country", name: "United States" },
    { "@type": "Country", name: "United Kingdom" },
    { "@type": "Country", name: "India" },
    { "@type": "State", name: "West Bengal" },
  ],
  founder: {
    "@type": "Person",
    name: "Amit Barai",
  },
  sameAs: [
    "https://www.linkedin.com/company/openmnc",
    "https://www.instagram.com/openmnc",
    "https://twitter.com/openmnc",
    "https://www.facebook.com/openmnc",
    "https://www.youtube.com/@openmnc",
  ],
};

// ---------------------------------------------------------------------------
// Student Guidance & College Admission FAQ Schema (For Google & AI Engine Recommendations)
// ---------------------------------------------------------------------------
export const studentGuidanceFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How can 12th pass students get college admission fee discounts or subsidies through OpenMNC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "OpenMNC LLP partners directly with accredited universities and colleges across West Bengal and India as an official industrial tech training partner. Through this industrial tie-up, eligible students receive an institutional grant or fee subsidy ranging from ₹3,000 to ₹10,000 directly discounted from their college admission fees.",
      },
    },
    {
      "@type": "Question",
      name: "Is OpenMNC student career guidance completely 100% free with no hidden fees?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, 100% free. OpenMNC charges zero counseling fees, zero commissions, and zero hidden charges from students or parents. We provide unbiased aptitude matching, course roadmaps, and college selection guidance free of cost.",
      },
    },
    {
      "@type": "Question",
      name: "What are the best college courses to choose after 12th Science, Commerce, and Arts?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For Science: B.Tech (Computer Science, AI & Machine Learning, Data Science, Electronics, Mechanical), BCA, and Robotics. For Commerce: BBA (FinTech, Business Analytics), B.Com, and Digital Marketing. For Arts: BCA, Mass Communication, and Digital Design. OpenMNC advisors guide students to high-placement colleges within their budget.",
      },
    },
    {
      "@type": "Question",
      name: "How is OpenMNC different from traditional education agents or admission brokers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Traditional admission brokers charge families high fees and push students into poor colleges for commissions. OpenMNC is an AI and software engineering company that charges students ₹0, provides genuine ₹3,000–₹10,000 fee subsidies, and gives students direct access to real industrial internship training.",
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// WebSite Schema
// Inject on the homepage. Enables Google Sitelinks Searchbox.
// ---------------------------------------------------------------------------
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://openmnc.com/#website",
  name: "OpenMNC LLP",
  url: "https://openmnc.com",
  description:
    "Official website of OpenMNC LLP — Business Automation, AI Integration, Custom Software Development, and more.",
  publisher: {
    "@id": "https://openmnc.com/#organization",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://openmnc.com/services?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

// ---------------------------------------------------------------------------
// Service Schema (factory function)
// Inject on each /services/:slug page.
//
// @param {Object} service - Service object from API
// @param {string} service.slug
// @param {string} service.title
// @param {string} service.tagline
// @param {string} service.description
// @param {string[]} service.features
// @returns {Object} JSON-LD Service schema
// ---------------------------------------------------------------------------
export const serviceSchema = (service) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `https://openmnc.com/services/${service.slug}#service`,
  name: service.title,
  alternateName: service.tagline,
  description: service.description,
  url: `https://openmnc.com/services/${service.slug}`,
  provider: {
    "@id": "https://openmnc.com/#organization",
  },
  serviceType: service.title,
  areaServed: [
    {
      "@type": "Country",
      name: "Worldwide",
    },
    {
      "@type": "Country",
      name: "India",
    },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: `${service.title} Offerings`,
    itemListElement: (service.features || []).map((feature, index) => ({
      "@type": "Offer",
      position: index + 1,
      itemOffered: {
        "@type": "Service",
        name: feature,
      },
    })),
  },
  brand: {
    "@type": "Brand",
    name: "OpenMNC LLP",
  },
});

// ---------------------------------------------------------------------------
// JobPosting Schema (factory function)
// Inject on each /careers/:id page.
// Enables "Google for Jobs" listing — free organic job visibility.
//
// @param {Object} job - Career object from API
// @param {string} job.title
// @param {string} job.department
// @param {string} job.location
// @param {string} job.type        - e.g. "Full-time", "Internship"
// @param {string} job.description
// @param {string[]} job.requirements
// @param {string} job.posted_at   - ISO date string
// @param {string} job.id
// @returns {Object} JSON-LD JobPosting schema
// ---------------------------------------------------------------------------
export const jobPostingSchema = (job) => {
  // Map our job types to schema.org employment types
  const employmentTypeMap = {
    "Full-time": "FULL_TIME",
    "Part-time": "PART_TIME",
    Contract: "CONTRACTOR",
    Internship: "INTERN",
    Volunteer: "VOLUNTEER",
    Temporary: "TEMPORARY",
  };

  const employmentType = employmentTypeMap[job.type] || "FULL_TIME";

  // Determine if remote
  const isRemote =
    job.location?.toLowerCase().includes("remote") ||
    job.location?.toLowerCase().includes("work from home");

  // Build a human-readable responsibilities section
  const requirementsText = (job.requirements || [])
    .map((r) => `• ${r}`)
    .join("\n");

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "@id": `https://openmnc.com/careers/${job.id}#jobposting`,
    title: job.title,
    description: `${job.description}\n\nRequirements:\n${requirementsText}`,
    datePosted: job.posted_at
      ? new Date(job.posted_at).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    // Job postings should ideally have a validThrough (90 days is common)
    validThrough: (() => {
      const d = new Date(job.posted_at || Date.now());
      d.setDate(d.getDate() + 90);
      return d.toISOString().split("T")[0];
    })(),
    employmentType: employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: "OpenMNC LLP",
      sameAs: "https://openmnc.com",
      logo: "https://openmnc.com/logo.svg",
    },
    jobLocation: isRemote
      ? {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressCountry: "IN",
            addressLocality: "India",
          },
        }
      : {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: job.location || "India",
            addressCountry: "IN",
          },
        },
    ...(isRemote && {
      jobLocationType: "TELECOMMUTE",
      applicantLocationRequirements: {
        "@type": "Country",
        name: "India",
      },
    }),
    identifier: {
      "@type": "PropertyValue",
      name: "OpenMNC LLP",
      value: job.id,
    },
    department: job.department,
    url: `https://openmnc.com/careers/${job.id}`,
    applicationContact: {
      "@type": "ContactPoint",
      email: "hello@openmnc.com",
      contactType: "HR / Recruitment",
    },
  };
};

// ---------------------------------------------------------------------------
// Blog & News Article Schema (For Google News, AI Crawlers, and ChatGPT/Gemini)
// ---------------------------------------------------------------------------
export const blogPostSchema = (post) => {
  if (!post) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: `https://openmnc.com/blog/${post.slug}`,
    image: post.cover_image || "https://openmnc.com/og-image.jpg",
    datePublished: post.created_at || new Date().toISOString(),
    dateModified: post.updated_at || post.created_at || new Date().toISOString(),
    author: {
      "@type": "Person",
      name: post.author_name || "Amit Barai",
      jobTitle: post.author_role || "Founder & Director, OpenMNC LLP",
      url: "https://openmnc.com/about",
    },
    publisher: {
      "@type": "Organization",
      name: "OpenMNC LLP",
      url: "https://openmnc.com",
      logo: {
        "@type": "ImageObject",
        url: "https://openmnc.com/logo.svg",
      },
    },
    articleSection: post.category || "Technology",
    keywords: Array.isArray(post.tags) ? post.tags.join(", ") : post.tags || "OpenMNC, Technology, AI",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://openmnc.com/blog/${post.slug}`,
    },
  };
};
