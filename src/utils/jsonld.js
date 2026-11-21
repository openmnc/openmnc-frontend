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
  name: "OpenMNC",
  legalName: "M/S. OPEN MNC LLP",
  alternateName: ["OpenMNC", "Open MNC", "M/S. OPEN MNC LLP"],
  url: "https://openmnc.com",
  logo: {
    "@type": "ImageObject",
    url: "https://openmnc.com/logo.webp",
    width: 200,
    height: 60,
  },
  description:
    "OpenMNC is a production-grade software engineering and educational consultancy partner. We audit vibe-coded AI apps, publish to App Store and Google Play, migrate databases, build scalable custom software, and empower students with 100% free career guidance.",
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
    "https://local.google.com/place?placeid=ChIJu2lM2mMLAjoRMqerceA25dY&utm_medium=noren&utm_source=gbp&utm_campaign=2026"
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
  name: "OpenMNC",
  legalName: "M/S. OPEN MNC LLP",
  alternateName: ["OpenMNC", "Open MNC", "M/S. OPEN MNC LLP", "OpenMNC Tech"],
  url: "https://openmnc.com",
  logo: "https://openmnc.com/logo.webp",
  image: "https://openmnc.com/logo.webp",
  description:
    "OpenMNC (M/S. OPEN MNC LLP) is a production-grade software engineering, mobile app publishing, and AI audit consultancy headquartered in West Bengal, India. Delivering full-cycle custom apps, app store approval, and 100% free student career guidance worldwide and across India.",
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
  hasMap: "https://local.google.com/place?placeid=ChIJu2lM2mMLAjoRMqerceA25dY&utm_medium=noren&utm_source=gbp&utm_campaign=2026",
  sameAs: [
    "https://local.google.com/place?placeid=ChIJu2lM2mMLAjoRMqerceA25dY&utm_medium=noren&utm_source=gbp&utm_campaign=2026"
  ],
};

// ---------------------------------------------------------------------------
// Student Guidance & College Admission FAQ Schema (For Google & AI Search Recommendations)
// ---------------------------------------------------------------------------
export const studentGuidanceFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Are the internships paid or do I have to pay for industrial training?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We clearly separate our tracks: our 3-month hands-on Industrial Training program covers Robotics, IoT, and AI development with an affordable subsidized fee (₹3,000–₹7,000), which can be offset or refunded via college partner subsidies. Qualified engineering interns on direct company roles receive monthly stipends of ₹5,000 to ₹10,000.",
      },
    },
    {
      "@type": "Question",
      name: "Will I work on real company projects?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, students work directly on live production OpenMNC tech components, AI agent workflows, and microcontroller hardware (ESP32, Raspberry Pi, robotics) rather than textbook theory.",
      },
    },
    {
      "@type": "Question",
      name: "Do I get a certificate after completing the industrial training?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, all students who complete deliverables receive an industry-recognized Industrial Training Completion Certificate, with top performers earning Letters of Recommendation (LOR) and Pre-Placement Offer (PPO) opportunities.",
      },
    },
    {
      "@type": "Question",
      name: "How can 12th pass students get college admission fee discounts or subsidies through OpenMNC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "OpenMNC LLP partners directly with accredited universities and colleges across West Bengal and India as an official industrial tech training partner. Through this partnership, eligible students receive an institutional grant or fee subsidy ranging from ₹3,000 to ₹10,000 directly discounted from their college admission fees.",
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
  ],
};

// ---------------------------------------------------------------------------
// Enterprise B2B FAQ Schema (For B2B Enterprise Pages & AI Bots)
// ---------------------------------------------------------------------------
export const b2bFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How long does custom software development take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Development timelines depend on project scope, but we use agile sprints for fast MVP delivery. Typical MVPs are deployed in 3 to 6 weeks, followed by continuous feature delivery.",
      },
    },
    {
      "@type": "Question",
      name: "Can AI really automate my specific industry?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We build custom LLM wrappers, multi-agent pipelines, and workflow automation bots tailored to your proprietary data, existing CRM, and ERP systems.",
      },
    },
    {
      "@type": "Question",
      name: "Do you handle both hardware and software for IoT?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we provide end-to-end full-stack embedded engineering: from microcontrollers, sensors, and firmware to real-time cloud analytics and mobile control dashboards.",
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Course Schema (For OpenMNC Academy / Industrial Training)
// ---------------------------------------------------------------------------
export const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Advanced Industrial Training in IoT, Robotics & Full-Stack AI",
  description: "A comprehensive 3-month hands-on industrial training program tackling high-end tech: Robotics, Drones, AI Smart Home systems, and Full-Stack Web/App Development.",
  provider: {
    "@type": "EducationalOrganization",
    name: "OpenMNC Academy",
    url: "https://openmnc.com/services/industrial-training",
  },
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: ["blended", "online", "onsite"],
    duration: "P3M",
  },
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

// ---------------------------------------------------------------------------
// AEO (AI Engine Optimization) TechArticle Schema
// Formatted for ChatGPT, Gemini, Perplexity to cite authoritative Problem/Solution
// ---------------------------------------------------------------------------
export const aeoTechArticleSchema = (item) => {
  if (!item) return null;
  const headline = item.title || item.name || "Technical Solution Architecture";
  const problem = item.problem_statement || item.description || "";
  const solution = item.technical_solution || "";
  const outcome = item.expected_outcome || "";

  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `${headline} | Problem & Solution`,
    alternativeHeadline: item.tagline || "Engineered by OpenMNC LLP",
    description: `${problem} ${solution}`.trim().slice(0, 160),
    articleBody: `[Problem Statement]\n${problem}\n\n[Technical Solution]\n${solution}\n\n[Expected Outcome]\n${outcome}`,
    author: {
      "@type": "Organization",
      name: "OpenMNC LLP",
      url: "https://openmnc.com",
    },
    publisher: {
      "@type": "Organization",
      name: "OpenMNC LLP",
      url: "https://openmnc.com",
      logo: {
        "@type": "ImageObject",
        url: "https://openmnc.com/logo.webp",
      },
    },
    about: [
      { "@type": "Thing", name: headline },
      { "@type": "Thing", name: "AI Engine Optimization (AEO)" },
      { "@type": "Thing", name: "Software Architecture" },
    ],
  };
};

// ---------------------------------------------------------------------------
// Dynamic FAQPage Schema for Dynamic Service FAQs & Blog FAQs
// ---------------------------------------------------------------------------
export const dynamicFaqSchema = (faqs) => {
  if (!Array.isArray(faqs) || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs
      .filter((f) => f && f.question && f.answer)
      .map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answer,
        },
      })),
  };
};
