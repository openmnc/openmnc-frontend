import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { AlertTriangle, Lightbulb, MessageSquare, GraduationCap } from 'lucide-react'
import ServiceCard from '../components/ServiceCard.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import ScrollReveal from '../components/ScrollReveal.jsx'
import ThreeBackground from '../components/ThreeBackground.jsx'
import GlowButton from '../components/GlowButton.jsx'
import SEO from '../components/SEO.jsx'
import GoogleReviewModal from '../components/GoogleReviewModal.jsx'
import { servicesApi } from '../api/services.js'
import { getServiceIcon, whatsappUrl } from '../utils/helpers.js'
import {
  serviceSchema,
  studentGuidanceFaqSchema,
  b2bFaqSchema,
  aeoTechArticleSchema,
  dynamicFaqSchema,
} from '../utils/jsonld.js'

// Slug Aliases for Deep Linking and Dynamic Routing across all 5 Pillars
const SLUG_ALIASES = {
  // Pillar 1: Vibe-Coded App Audit & Fixing
  'vibe-coded-app-audit-and-fixing': 'vibe-coded-app-audit-and-fixing',
  'vibe-code-audit': 'vibe-coded-app-audit-and-fixing',
  'vibe-coded-app-audit': 'vibe-coded-app-audit-and-fixing',
  'fix-ai-app': 'vibe-coded-app-audit-and-fixing',
  'cursor-fix': 'vibe-coded-app-audit-and-fixing',

  // Pillar 2: App Store & Play Store Publishing & Approval
  'app-store-play-store-publishing-and-approval': 'app-store-play-store-publishing-and-approval',
  'app-store-publishing': 'app-store-play-store-publishing-and-approval',
  'play-store-publishing': 'app-store-play-store-publishing-and-approval',
  'play-store-approval': 'app-store-play-store-publishing-and-approval',
  'app-publishing': 'app-store-play-store-publishing-and-approval',

  // Pillar 3: App Transfer & Full Database Migration
  'app-transfer-and-database-migration': 'app-transfer-and-database-migration',
  'app-transfer': 'app-transfer-and-database-migration',
  'database-migration': 'app-transfer-and-database-migration',
  'app-migration': 'app-transfer-and-database-migration',

  // Pillar 4: Custom Software & Scalable App Development
  'custom-software-and-scalable-app-development': 'custom-software-and-scalable-app-development',
  'custom-development': 'custom-software-and-scalable-app-development',
  'custom-software': 'custom-software-and-scalable-app-development',
  'software-development': 'custom-software-and-scalable-app-development',

  // Pillar 5: App Maintenance & Long-Term Support
  'app-maintenance-and-support': 'app-maintenance-and-support',
  'app-maintenance': 'app-maintenance-and-support',
  'amc': 'app-maintenance-and-support',
  'support': 'app-maintenance-and-support',

  // B2B Automation & AI
  'business-automation': 'business-automation',
  'b2b-automation': 'business-automation',
  'ai-automation': 'business-automation',

  // B2C Academy
  'student-guidance': 'student-guidance',
  'academy': 'student-guidance',
  'industrial-training': 'industrial-training',
  'training': 'industrial-training',
}

const STATIC_SERVICES = [
  // ══════════════════════════════════════════════════════════════════════════
  // PILLAR 1: VIBE-CODED APP AUDIT & FIXING
  // ══════════════════════════════════════════════════════════════════════════
  {
    slug: 'vibe-coded-app-audit-and-fixing',
    pillar: 'Pillar 1',
    meta_title: 'Vibe-Coded App Audit & Production Fixing | Turn AI Prototypes into Real Apps - OPEN MNC',
    meta_description: 'Built your app with Cursor, Lovable, Bolt, or Replit? OPEN MNC audits your code, fixes security leaks, cleans up databases, and gets your vibe-coded app production-ready.',
    h1_heading: 'Built Your App with AI? We Audit, Secure, and Make Your Vibe-Coded App Production-Ready.',
    title: 'Vibe-Coded & AI-Built App Audit, Security Fix & Production Launch',
    tagline: 'AI tools get you 80% there fast—the last 20% breaks in production. We ship the rest.',
    icon: 'audit',
    category: 'AI Code Audit & Rescue',
    supported_tools: ['Cursor', 'Lovable', 'Bolt', 'Replit', 'v0', 'Windsurf', 'Next.js', 'Supabase', 'Firebase'],
    description:
      'AI coding tools get you 80% there fast—the last 20% breaks in production. Senior engineers at OpenMNC audit your AI-generated codebase, seal security vulnerabilities, optimize your database, and ship a stable, high-performance product without forcing a complete rewrite.',
    problem_statement:
      'AI fix loops, exposed API keys, missing database Row-Level Security (RLS), and webhook failures under real traffic prevent AI prototypes from launching.',
    technical_solution:
      'Comprehensive line-by-line architecture audit, RLS security enforcement, query indexing, payment webhook bulletproofing, and automated CI/CD staging environments.',
    expected_outcome:
      'Production-ready, battle-hardened web or mobile app launching safely in 1 to 2 weeks with 100% IP ownership retained by you.',
    problems_grid: [
      {
        title: 'Exposed API Keys & Missing RLS',
        desc: 'AI coding tools frequently leave Supabase/Firebase keys with open read/write access, letting anyone scrape your database.',
      },
      {
        title: 'Spaghetti Code & Infinite AI Loops',
        desc: 'Asking AI to fix one UI bug breaks three other screens due to lack of modular architecture and state management.',
      },
      {
        title: 'Payment & Webhook Failures',
        desc: 'Stripe, Razorpay, and authentication webhooks silently fail or duplicate under real multi-user concurrency.',
      },
      {
        title: 'Slow Queries & High Cloud Bills',
        desc: 'Unindexed tables and unoptimized serverless calls cause sluggish response times and unexpected monthly cloud costs.',
      },
    ],
    deliverables: [
      { title: 'Full Codebase & Architecture Audit', desc: 'Line-by-line review of frontend, backend, and API routes to eliminate dead code and bottlenecks.' },
      { title: 'Security Hardening & Key Protection', desc: 'Environment variable securing, proper JWT/session auth, and strict Supabase/Firebase RLS rules.' },
      { title: 'Database & Performance Refactoring', desc: 'Indexing slow queries, normalizing schemas, memory leak cleanup, and asset optimization.' },
      { title: 'Payment & Third-Party Stabilization', desc: 'Bulletproofing Stripe, Razorpay, email triggers, and third-party webhook receivers.' },
      { title: 'Production Deployment & CI/CD Setup', desc: 'Clean staging/production pipelines, automated database backups, and Sentry error monitoring.' },
    ],
    process_steps: [
      { step: '01', title: 'Private Repo Access & NDA', desc: 'We sign a mutual NDA and gain secure, read-only access to your GitHub repo.' },
      { step: '02', title: '48-Hour Deep Audit Report', desc: 'Receive a prioritized vulnerability and performance checklist with exact fix recommendations.' },
      { step: '03', title: 'Systematic Refactoring', desc: 'Senior engineers patch vulnerabilities, refactor broken logic, and optimize databases.' },
      { step: '04', title: 'Clean Handover or Launch', desc: 'We verify all production flows, run staging tests, and deploy your live app.' },
    ],
    features: [
      'Line-by-line security & code quality review',
      'Row-Level Security (RLS) enforcement',
      'Stripe & Razorpay webhook stabilization',
      'Fast query indexing & memory leak fixes',
      'Strict NDA & 100% intellectual property guarantee',
      'Zero unnecessary rewrite philosophy',
    ],
    cross_link: {
      text: 'Ready to publish after securing your app?',
      title: 'Play Store & App Store Publishing Service',
      to: '/services/app-store-play-store-publishing-and-approval',
    },
    faqs: [
      {
        question: 'Will you force me to rewrite my entire app from scratch?',
        answer: 'No, absolutely not. We preserve what works and refactor only what is broken, insecure, or unscalable.',
      },
      {
        question: 'Do you sign an NDA before checking my GitHub repo?',
        answer: 'Yes, 100%. We sign a mutual Non-Disclosure Agreement before receiving access, and all intellectual property remains exclusively yours.',
      },
      {
        question: 'How long does a vibe-coded app audit and fix take?',
        answer: 'The initial deep audit report is delivered within 48 to 72 hours. Code refactoring and security fixes typically take 1 to 2 weeks.',
      },
    ],
    order: 1,
    is_active: true,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // PILLAR 2: PLAY STORE & APP STORE PUBLISHING & REJECTION FIX
  // ══════════════════════════════════════════════════════════════════════════
  {
    slug: 'app-store-play-store-publishing-and-approval',
    pillar: 'Pillar 2',
    meta_title: 'App Store & Google Play Publishing Service | Fix Rejections & Policy Violations - OPEN MNC',
    meta_description: 'Struggling with Apple App Store rejections or Google Play policy violations? OPEN MNC handles compliance, testing, metadata, and submission to get your app approved stress-free.',
    h1_heading: 'Hassle-Free Google Play & Apple App Store Publishing—We Handle Policy Compliance & Rejections.',
    title: 'Play Store & App Store Publishing, Policy Compliance & Rejection Fix',
    tagline: 'Don’t risk account bans or weeks of rejection loops. We stay until your app is live.',
    icon: 'apps',
    category: 'Store Publishing & Compliance',
    description:
      'Publishing a mobile app on the Apple App Store and Google Play Console is stricter than ever. We audit your build against strict developer guidelines, fix Guideline 4.2/2.1 rejections, handle closed testing (12 testers), set up Data Safety declarations, and get your app approved stress-free.',
    problem_statement:
      'Apple App Store Guideline 4.2 / 5.1.1 rejections and Google Play 12-tester closed testing rules cause weeks of delay and risk account suspensions.',
    technical_solution:
      'Pre-submission policy audit, release build signing (AAB/IPA), closed-testing coordinator management, privacy policy flow implementation, and professional appeal writing.',
    expected_outcome:
      '100% approved and publicly live app on Google Play and Apple App Store under your own developer accounts.',
    problems_grid: [
      {
        title: 'Apple Guideline 4.2 (Minimum Functionality)',
        desc: 'Rejections for apps that Apple flags as simple web wrappers, requiring native device capabilities and offline handling.',
      },
      {
        title: 'Apple Guideline 2.1 (App Completeness & Crashes)',
        desc: 'Reviewer rejections caused by demo login issues, hidden links, placeholder text, or unexpected crashes on iPad test devices.',
      },
      {
        title: 'Google Play 12-Testers Closed Testing',
        desc: 'Mandatory 14-day closed testing with 12 active opted-in testers required for new personal Google Play Console developer accounts.',
      },
      {
        title: 'Data Safety & Account Deletion Mandate',
        desc: 'Apple Guideline 5.1.1 and Google Play privacy policies requiring in-app account deletion buttons and exact data usage forms.',
      },
    ],
    deliverables: [
      { title: 'Pre-Submission Policy & Technical Audit', desc: 'Verifying permissions, privacy disclosures, account deletion flows, and SDK target levels.' },
      { title: 'Build Signing & Store Console Configuration', desc: 'Generating release AAB/IPA builds, production signing keystores, provisioning profiles, and store metadata.' },
      { title: 'Store Listing Optimization (ASO Basics)', desc: 'Optimized screenshots formatting, content ratings, privacy URLs, and reviewer demo credentials.' },
      { title: 'Rejection Appeal & Code Remediation', desc: 'Decoding reviewer rejections, writing Resolution Center replies, and updating code to comply.' },
      { title: 'Production Release Monitoring', desc: 'Tracking build status until the app is approved and publicly downloadable worldwide.' },
    ],
    process_steps: [
      { step: '01', title: 'Share Rejection or Build', desc: 'Share your App Store / Google Play rejection screenshot or fresh mobile build.' },
      { step: '02', title: 'Compliance Gap Checklist', desc: 'We identify all policy non-compliance issues across code, privacy forms, and UI.' },
      { step: '03', title: 'Code Fixes & Store Setup', desc: 'We implement required flows (account deletion, permissions) and configure console metadata.' },
      { step: '04', title: 'Submission & Live Approval', desc: 'We manage reviewer communication, answer questions, and secure official live approval.' },
    ],
    features: [
      'Apple App Store Guideline compliance (2.1, 4.2, 5.1.1)',
      'Google Play 12-testers closed testing guidance',
      'Target API Level & modern SDK compliance',
      'In-app account deletion technical implementation',
      'Direct reviewer resolution center messaging',
      'Published 100% under YOUR own developer accounts',
    ],
    cross_link: {
      text: 'Need ongoing app maintenance after launch?',
      title: 'App Maintenance, Bug Fixing & DevOps AMC',
      to: '/services/app-maintenance-and-support',
    },
    faqs: [
      {
        question: 'Can you help if my app was already rejected multiple times?',
        answer: 'Yes, absolutely. We specialize in diagnosing repetitive rejection notices, refactoring the underlying code or UI, and drafting professional resolution appeals.',
      },
      {
        question: 'Will the app be published under MY developer account?',
        answer: 'Yes, always under your own Apple Developer and Google Play Console accounts so that you retain 100% ownership, revenue, and customer reviews.',
      },
      {
        question: 'Do you implement the required in-app account deletion flow?',
        answer: 'Yes, both Apple and Google mandate this. We implement both the frontend user deletion button and the backend database wipe endpoint.',
      },
    ],
    order: 2,
    is_active: true,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // PILLAR 3: APP OWNERSHIP TRANSFER & FULL DATABASE MIGRATION
  // ══════════════════════════════════════════════════════════════════════════
  {
    slug: 'app-transfer-and-database-migration',
    pillar: 'Pillar 3',
    meta_title: 'App Transfer & Full Database Migration Service | Safe Exit & Handover - OPEN MNC',
    meta_description: 'Selling, buying, or moving an app? OPEN MNC handles end-to-end Play Store & App Store transfers, full database migration, cloud handover, and zero-downtime transitions.',
    h1_heading: 'Selling, Buying, or Moving an App? Safe App Transfer & Full Database Migration.',
    title: 'App Ownership Transfer, Full Database & Infrastructure Migration',
    tagline: 'Zero data loss. Zero subscription breaks. Complete technical handover.',
    icon: 'transfer',
    category: 'Acquisition & Migration',
    description:
      'One wrong step during an app transfer can break live users, wipe databases, or lock out recurring subscriptions. OpenMNC manages the complete technical handover—store accounts, databases (Firebase, Supabase, PostgreSQL, MongoDB), APIs, domains, and payment gateways—with zero data loss.',
    problem_statement:
      'App transfers and database migrations frequently cause corrupted user data, broken in-app subscriptions, and extended downtime during acquisitions.',
    technical_solution:
      'Dry-run staging migrations, official Apple/Google store account transfer workflows, automated schema validation, and safe credential rotation.',
    expected_outcome:
      'Seamless transfer with 100% database integrity, preserved store reviews and ratings, and zero interruption for live subscribers.',
    problems_grid: [
      {
        title: 'App Sellers (Fast Escrow Release)',
        desc: 'Handing over a clean, documented codebase, store listing, and live database to the buyer smoothly so acquisition funds release quickly on Acquire.com or Flippa.',
      },
      {
        title: 'App Buyers (Acquisition Due Diligence)',
        desc: 'Technical due diligence before buying, followed by safely moving all assets into your own cloud accounts so previous owners retain zero lingering access.',
      },
      {
        title: 'Account & Entity Consolidations',
        desc: 'Moving apps from individual/agency developer accounts to corporate LLP/Pvt Ltd accounts without losing rankings or active subscriptions.',
      },
      {
        title: 'Cloud & Database Migrations',
        desc: 'Migrating legacy servers (Heroku, Firebase, Supabase, AWS, MongoDB Atlas) without taking the app offline or corrupting live user hashes.',
      },
    ],
    deliverables: [
      { title: 'App Store & Google Play Transfer', desc: 'Preparing transfer prerequisites, removing conflicts, and executing official store transfers.' },
      { title: 'Full Database Migration & Verification', desc: 'Exporting, transforming, and migrating user tables, auth hashes, media buckets, and relational schemas.' },
      { title: 'Cloud, Domain & DNS Handover', desc: 'Migrating AWS/GCP/Vercel environments, DNS routing, GitHub repositories, and APNs/FCM push notification keys.' },
      { title: 'Payment & Subscription Continuity', desc: 'Safely updating Stripe, Razorpay, or RevenueCat billing webhooks so recurring revenue does not break.' },
      { title: 'Security Lockout & Credential Rotation', desc: 'Rotating all API keys, database passwords, and admin tokens post-transfer for exclusive buyer control.' },
    ],
    process_steps: [
      { step: '01', title: 'Asset & Dependency Audit', desc: 'We map out every store account, database, cloud server, DNS provider, and payment gateway.' },
      { step: '02', title: 'Staging Dry-Run Migration', desc: 'We test the database migration on a staging replica to verify table integrity and zero schema loss.' },
      { step: '03', title: 'Live Cutover & Store Transfer', desc: 'Execute scheduled cutover during low-traffic hours and initiate official Apple/Google transfers.' },
      { step: '04', title: 'Key Rotation & Handover', desc: 'Rotate all credentials, revoke old agency access, and deliver verified documentation.' },
    ],
    features: [
      'Preserve existing App Store & Google Play ratings and reviews',
      'Zero downtime database migration with dry-run verification',
      'Stripe & RevenueCat subscription webhook continuity',
      'Push notification certificate (APNs/FCM) transfer',
      'Credential rotation & complete access lockout',
      'Escrow-friendly milestone verification for Acquire.com & Flippa',
    ],
    cross_link: {
      text: 'Acquired an app and need new scalable features?',
      title: 'Scalable Custom Software & App Development',
      to: '/services/custom-software-and-scalable-app-development',
    },
    faqs: [
      {
        question: 'Will we lose our existing app reviews, ratings, and users during a store transfer?',
        answer: 'No! When transferred properly through the official Apple App Store and Google Play transfer workflows, all existing reviews, star ratings, and automatic app update paths remain completely intact.',
      },
      {
        question: 'Can you migrate our database without taking the app offline for days?',
        answer: 'Yes. We run shadow migrations and dry-run tests on staging environments first, enabling near-zero downtime live cutovers.',
      },
      {
        question: 'Do you sign NDAs for confidential acquisitions?',
        answer: 'Yes, strict NDAs and escrow-friendly milestone verifications are standard protocol for all transfer engagements.',
      },
    ],
    order: 3,
    is_active: true,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // PILLAR 4: SCALABLE CUSTOM SOFTWARE & MOBILE APP DEV
  // ══════════════════════════════════════════════════════════════════════════
  {
    slug: 'custom-software-and-scalable-app-development',
    pillar: 'Pillar 4',
    meta_title: 'Scalable Custom Software, Web & Mobile App Development | Built for Growth - OPEN MNC',
    meta_description: 'Planning a serious digital product? OPEN MNC architects and builds scalable custom software, SaaS platforms, web apps, and iOS/Android mobile apps tailored to your business.',
    h1_heading: 'Custom Software, Web & Mobile Apps Engineered for Serious, Scalable Businesses.',
    title: 'Scalable Custom Software, Web & Mobile App Development',
    tagline: 'Off-the-shelf templates hit a ceiling fast. We engineer software that scales to 100k+ users.',
    icon: 'development',
    category: 'Full-Cycle Engineering',
    description:
      'We partner with ambitious founders, funded startups, and growing enterprises to build fast, secure, and scalable digital products. From multi-tenant SaaS platforms to native iOS/Android apps and AI workflows, we handle architecture, sprint development, QA, and cloud scaling.',
    problem_statement:
      'Off-the-shelf templates and low-code platforms hit performance ceilings, compromise data privacy, and become expensive technical debt.',
    technical_solution:
      'Architecture-first engineering using modern full-stack frameworks (React, Vite, Node, FastAPI, MongoDB, PostgreSQL) with 100% source code ownership.',
    expected_outcome:
      'Production-grade custom software built for high concurrency, microsecond database queries, and seamless future feature expansion.',
    problems_grid: [
      {
        title: 'Custom Web Apps & SaaS Platforms',
        desc: 'Multi-tenant dashboards, high-speed customer portals, billing engines, and modern SaaS architectures built on React, FastAPI, and Postgres.',
      },
      {
        title: 'Cross-Platform Mobile Apps (iOS & Android)',
        desc: 'Smooth, 60fps mobile applications engineered with React Native or Flutter, designed for immediate store compliance.',
      },
      {
        title: 'Business Automation & Internal CRM Portals',
        desc: 'Custom internal workflows, automated client lead routing, and inventory systems that replace messy, unscalable spreadsheets.',
      },
      {
        title: 'AI & Autonomous Workflow Integrations',
        desc: 'Embedding custom LLMs (OpenAI, Claude, Gemini), smart document parsers, and autonomous multi-agent pipelines directly into your software.',
      },
    ],
    deliverables: [
      { title: 'Architecture-First Blueprint', desc: 'Clean database schema modeling, API contract definition, and UX wireframes before writing code.' },
      { title: 'Agile Sprint Development', desc: 'Transparent weekly demos, live staging URLs, and milestone deliveries with no black-box agency delays.' },
      { title: '100% Source Code & IP Ownership', desc: 'Every repository commit, cloud account, and database belongs exclusively to you from day one.' },
      { title: 'Security Hardening & QA Testing', desc: 'Automated unit tests, load testing, role-based access control (RBAC), and penetration auditing.' },
      { title: 'Production Launch & Store Release', desc: 'Zero-downtime deployment, CDN acceleration, DNS setup, and App Store / Play Store approvals.' },
    ],
    process_steps: [
      { step: '01', title: 'Technical Discovery', desc: 'Deep dive into your product requirements, user personas, and scalability goals.' },
      { step: '02', title: 'UI/UX & Architecture', desc: 'Interactive prototypes, database schema modeling, and third-party API mapping.' },
      { step: '03', title: 'Sprint Development', desc: 'Bi-weekly sprint deliverables with live staging links and direct founder communication.' },
      { step: '04', title: 'QA & Security Hardening', desc: 'End-to-end stress testing, input validation, and compliance checks.' },
      { step: '05', title: 'Store & Cloud Launch', desc: 'Smooth live deployment, store listing publication, and post-launch monitoring.' },
    ],
    features: [
      'React 18, Vite, FastAPI & MongoDB / PostgreSQL tech stack',
      'Cross-platform iOS and Android mobile development',
      'Enterprise LLM and autonomous AI agent tool pipelines',
      'Role-based access control (RBAC) and high security',
      '100% source code and intellectual property ownership',
      'Transparent milestone-based pricing with zero hidden fees',
    ],
    cross_link: {
      text: 'Need long-term support and maintenance after launch?',
      title: 'App Maintenance & Long-Term Support (AMC)',
      to: '/services/app-maintenance-and-support',
    },
    faqs: [
      {
        question: 'How do you price custom software projects?',
        answer: 'We provide either transparent fixed-scope milestone pricing for well-defined builds, or dedicated monthly engineering retainers for rapidly evolving products.',
      },
      {
        question: 'Do I own 100% of the source code and intellectual property?',
        answer: 'Yes, 100%. Our legal agreement guarantees that all code, repositories, designs, and cloud accounts belong exclusively to your company.',
      },
      {
        question: 'Can you build an MVP fast without creating technical debt?',
        answer: 'Yes. We engineer lean MVPs on clean, modular architectures so you never have to throw away code when scaling to thousands of active users.',
      },
    ],
    order: 4,
    is_active: true,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // PILLAR 5: APP MAINTENANCE, DEVOPS & SUPPORT (AMC)
  // ══════════════════════════════════════════════════════════════════════════
  {
    slug: 'app-maintenance-and-support',
    pillar: 'Pillar 5',
    meta_title: 'App Maintenance, Bug Fixing & Ongoing Support Services (AMC) | OPEN MNC',
    meta_description: 'Keep your web and mobile apps fast, secure, and updated. OPEN MNC provides reliable ongoing app maintenance, OS/SDK updates, bug fixes, server monitoring, and feature upgrades.',
    h1_heading: 'Reliable App Maintenance & Support—Keep Your Software Fast, Secure, and Always Online.',
    title: 'App Maintenance, DevOps, Security & Long-Term Support (AMC)',
    tagline: 'Launching your app is only Day 1. We keep your software fast, updated, and secure.',
    icon: 'maintenance',
    category: 'Ongoing Support & DevOps',
    description:
      'Mobile operating systems update annually, database storage fills up, and unmaintained code becomes vulnerable to security breaches. OpenMNC provides reliable Annual Maintenance Contracts (AMC) and ongoing DevOps support, serving as your dedicated engineering safety net at a fraction of the cost of an in-house team.',
    problem_statement:
      'Google Play/Apple annual SDK deadlines remove unmaintained apps from stores, while silent server crashes and security exploits cause unexpected downtime.',
    technical_solution:
      'Proactive SDK upgrades, 24/7 uptime monitoring, automated database backups, priority bug fixing SLAs, and continuous monthly feature sprints.',
    expected_outcome:
      '99.9% uptime, perpetual store compliance, rapid bug resolution, and steady product evolution without hiring full-time internal developers.',
    problems_grid: [
      {
        title: 'Mandatory Store SDK Upgrades',
        desc: 'Google Play and Apple enforce mandatory annual API/SDK deadline removals for apps that fail to update their target build versions.',
      },
      {
        title: 'Silent Server & Database Crashes',
        desc: 'Database storage filling up, memory leaks, expired SSL certificates, and cloud instance crashes that go unnoticed without monitoring.',
      },
      {
        title: 'Vulnerabilities in Outdated Packages',
        desc: 'Security holes in unpatched npm, Python, or framework libraries that expose user credentials to automated bots.',
      },
      {
        title: 'Disappearing Freelancers',
        desc: 'The original developer is unresponsive when an urgent production crash strikes on a weekend or during user traffic spikes.',
      },
    ],
    deliverables: [
      { title: 'Proactive OS & Store Compliance Updates', desc: 'Keeping your app compliant with new iOS/Android releases and store policies.' },
      { title: 'Priority Bug Fixing & Crash SLAs', desc: 'Monitoring error analytics via Sentry and resolving production bugs under defined response times.' },
      { title: 'Server, Database & Backup Management', desc: 'Automated daily database backups, SSL renewals, security patches, and cloud cost tuning.' },
      { title: 'Performance Optimization', desc: 'Speeding up slow query endpoints, caching heavy responses, and managing traffic spikes.' },
      { title: 'Continuous Feature Enhancements', desc: 'Monthly bank of engineering hours dedicated to minor UI tweaks, new integrations, and improvements.' },
    ],
    process_steps: [
      { step: '01', title: 'Takeover Audit', desc: 'We inspect your current repository, cloud servers, and third-party dependencies to document technical debt.' },
      { step: '02', title: 'Monitoring Setup', desc: 'We install uptime ping monitors, automated error reporting, and scheduled database backup routines.' },
      { step: '03', title: 'Stabilization & Patching', desc: 'We update outdated packages, fix known errors, and establish clean staging/production environments.' },
      { step: '04', title: 'Ongoing Retainer & SLA', desc: 'Continuous weekly maintenance, monthly feature improvements, and on-call emergency response.' },
    ],
    features: [
      'Proactive Google Play & Apple target SDK upgrades',
      'Automated 24/7 uptime and health check monitoring',
      'Daily off-site database backups & disaster recovery plans',
      'Priority SLA response times for critical production bugs',
      'Monthly engineering hours for small feature updates',
      'Dedicated engineering pod at a fraction of in-house hiring cost',
    ],
    cross_link: {
      text: 'Have an AI-built app that needs an initial stabilization audit first?',
      title: 'Vibe-Coded App Audit & Production Fixing',
      to: '/services/vibe-coded-app-audit-and-fixing',
    },
    faqs: [
      {
        question: 'Can you maintain an app that another agency or freelancer built?',
        answer: 'Yes! We start with a quick technical onboarding audit to document your codebase, identify existing technical debt, and stabilize the system before regular maintenance begins.',
      },
      {
        question: 'What if I only need a few hours of updates and monitoring per month?',
        answer: 'Our Essential Care Plan is designed specifically for predictable, low-cost maintenance covering uptime checks, automated backups, and critical security patches.',
      },
      {
        question: 'How fast do you respond to urgent production downtime?',
        answer: 'For critical outages, our team operates under rapid SLA timelines to diagnose and restore service, backed by automated server alerts.',
      },
    ],
    order: 5,
    is_active: true,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // EXISTING CORE SERVICE: BUSINESS AUTOMATION & AI INTEGRATION
  // ══════════════════════════════════════════════════════════════════════════
  {
    slug: 'business-automation',
    title: 'Enterprise AI Automation & Multi-Agent Workflows',
    tagline: 'Multiply revenue. Eliminate repetitive manual work across sectors.',
    icon: 'automation',
    category: 'B2B Enterprise',
    description:
      'We architect autonomous AI agents, enterprise LLM pipelines (OpenAI, Claude, Gemini), and custom business process automations (BPA) for FinTech, Healthcare, E-Commerce, Real Estate, and Manufacturing. Eliminate manual data entry, automate CRM lead routing, and run 24/7 autonomous operations.',
    problem_statement:
      'Businesses lose thousands of work-hours and revenue each month due to fragmented manual data entry, slow lead qualification, and unintegrated SaaS tools.',
    technical_solution:
      'OpenMNC architects custom autonomous AI multi-agent workflows, LLM pipelines, and event-driven automation directly into client CRMs and databases.',
    expected_outcome:
      '90% reduction in manual labor, 3x faster response times, and 24/7 autonomous operations without costly SaaS subscriptions.',
    features: [
      'Custom AI workflow & multi-agent system integration',
      'FinTech, HealthTech & E-Commerce process automation',
      'Enterprise LLM & RAG vector search pipelines',
      'WhatsApp & CRM autonomous lead qualification bots',
      'Zero-downtime reliability & revenue multiplication SLA',
      'Worldwide & domestic delivery with dedicated engineering',
    ],
    faqs: [
      {
        question: 'Can AI really automate my specific industry workflows?',
        answer: 'Yes, we build custom LLM wrappers, autonomous agent workflows, and webhook pipelines tailored to your proprietary data and tools.',
      },
      {
        question: 'How does OpenMNC protect client data privacy?',
        answer: 'We deploy dedicated on-premise or private-cloud inference pipelines with zero public training exposure and enterprise encryption.',
      },
    ],
    order: 6,
    is_active: true,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // EXISTING CORE SERVICE: IN-HOUSE PRODUCTS
  // ══════════════════════════════════════════════════════════════════════════
  {
    slug: 'inhouse-products',
    title: 'In-House Products & Games',
    tagline: 'Products we build, publish, and stand behind.',
    icon: 'apps',
    category: 'B2B Enterprise',
    description:
      'OpenMNC develops and publishes proprietary custom software, mobile apps, and games on Google Play and Apple App Store. Flagship titles include Kibo VPN (privacy-first tool), Calorie AI (smart nutrition assistant), and CardSnap (digital networking).',
    problem_statement:
      'Users and businesses demand privacy-first tools and smart AI utilities without invasive trackers or exorbitant recurring prices.',
    technical_solution:
      'OpenMNC builds and publishes proprietary mobile utilities with edge-processed data and zero data-mining.',
    expected_outcome:
      'Over 50,000+ app downloads and production-hardened software IP.',
    features: [
      'Google Play & App Store published',
      'Kibo VPN — Privacy & security utility',
      'Calorie AI — Smart health tracker',
      'CardSnap — Intelligent business card tool',
      'Custom mobile games development',
      'Proprietary software innovation',
    ],
    faqs: [
      {
        question: 'Can OpenMNC develop white-label versions of in-house products?',
        answer: 'Yes, we license and customize our proprietary engines (VPN, AI vision, OCR) for enterprise white-label deployment.',
      },
    ],
    order: 7,
    is_active: true,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // EXISTING CORE SERVICE: SOCIAL MEDIA MANAGEMENT
  // ══════════════════════════════════════════════════════════════════════════
  {
    slug: 'social-media-management',
    title: 'Social Media Management & Organic Growth',
    tagline: 'Grow organically without heavy ad spend.',
    icon: 'social-media',
    category: 'B2B Enterprise',
    description:
      'High-ROI organic growth for local shops, bakeries, real estate, factories, and solopreneurs across Instagram, Facebook, and YouTube. We research your niche, algorithm-match keywords and hashtags, write viral scripts using our Hook → Engagement → Relativity → Reveal structure, and edit your raw video into polished content.',
    problem_statement:
      'Local businesses burn capital on expensive pay-per-click ads with zero long-term organic retention or audience trust.',
    technical_solution:
      'Algorithmic keyword optimization, high-retention video scripting (Hook → Engage → Reveal), and professional editing.',
    expected_outcome:
      'Up to 10x organic reach and authentic audience trust at a fraction of paid advertisement spend.',
    features: [
      'Instagram, Facebook & YouTube management',
      'Viral scripting (Hook → Engage → Reveal)',
      'Professional video editing & captions',
      'Relatable hashtag & keyword strategy',
      'Algorithm optimization for organic reach',
      'Fraction of ad spend with maximum trust',
    ],
    faqs: [
      {
        question: 'How soon do we see organic reach results?',
        answer: 'Clients typically experience noticeable engagement upticks within 3 to 4 weeks as the platform algorithm indexes relatable video hooks.',
      },
    ],
    order: 8,
    is_active: true,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // EXISTING CORE SERVICE: STUDENT GUIDANCE
  // ══════════════════════════════════════════════════════════════════════════
  {
    slug: 'student-guidance',
    title: 'Student Guidance & College Admission Subsidies',
    tagline: '100% free career guidance. Direct ₹3,000–₹10,000 college fee discounts.',
    icon: 'student-guidance',
    category: 'B2C Academy',
    description:
      'We guide 12th-pass students in selecting the best accredited colleges and career streams based on genuine aptitude — 100% free of charge. Eligible students enrolling in our partner colleges receive an exclusive ₹3,000 to ₹10,000 institutional partnership subsidy directly discounted from college fees, with zero agent commission or hidden charges.',
    problem_statement:
      '12th-pass students and parents are misled by commission brokers into overpriced courses with low placement outcomes.',
    technical_solution:
      '100% free aptitude profiling, university accreditation audits, and industrial partnership fee scholarships.',
    expected_outcome:
      'Direct ₹3,000 to ₹10,000 college admission fee subsidy paid directly by OpenMNC as an industrial partner, with zero student fees.',
    features: [
      '100% free career counseling for 12th Science, Commerce & Arts',
      '₹3,000–₹10,000 direct partner college admission subsidy',
      'B.Tech (CSE, AI/ML, Robotics), BCA, BBA & Diploma roadmaps',
      'Aptitude-to-career alignment with top accredited universities',
      'Direct industrial internship pathway into OpenMNC tech projects',
      'Zero student charges, zero broker fees, complete transparency',
    ],
    faqs: [
      {
        question: 'Why is student career guidance 100% free?',
        answer: 'OpenMNC is an authorized industrial technology partner for accredited institutions. We bridge industry needs with student talent with zero broker fees.',
      },
      {
        question: 'How much subsidy or fee discount do students receive?',
        answer: 'Eligible students receive ₹3,000 to ₹10,000 directly discounted from college admission fees as an industrial subsidy.',
      },
    ],
    order: 9,
    is_active: true,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // EXISTING CORE SERVICE: INDUSTRIAL TRAINING
  // ══════════════════════════════════════════════════════════════════════════
  {
    slug: 'industrial-training',
    title: 'Advanced Industrial Training',
    tagline: 'Real projects. High-end tech. 3 months.',
    icon: 'training',
    category: 'B2C Academy',
    description:
      'A comprehensive 3-month hands-on industrial training program tackling high-end tech: Robotics, Drones, and AI Smart Home assistants in IoT, plus modern Web and App Development. Affordable pricing at ₹3,000–₹7,000, with college partner subsidies directly offsettable or refundable.',
    problem_statement:
      'Engineering students graduate with only textbook knowledge and zero experience building production IoT hardware or AI cloud systems.',
    technical_solution:
      '3-month hands-on industrial sprints building live Robotics, Drones, IoT embedded firmware, and modern full-stack web applications.',
    expected_outcome:
      'Production-ready GitHub project portfolio, verifiable industrial training certificate, and priority hiring at OpenMNC.',
    features: [
      'Advanced IoT (Robotics, Drones, AI Smart Home)',
      'Modern Web & Application Development',
      '3-month real production project delivery',
      'Coding, hardware & logistics in one frame',
      '₹3,000–₹7,000 affordable pricing structure',
      'Partner subsidy offset / cashback option',
    ],
    faqs: [
      {
        question: 'Do you handle both hardware and software for IoT?',
        answer: 'Yes, we cover full-stack embedded engineering: ESP32/STM32 microcontrollers, sensor protocols, firmware, and cloud IoT dashboards.',
      },
      {
        question: 'Can the training fees be offset?',
        answer: 'Yes, our partner college subsidy allows eligible students to offset or claim refunds of ₹3,000 to ₹7,000 directly.',
      },
    ],
    order: 10,
    is_active: true,
  },
]

export default function Services({ initialSlug }) {
  const params = useParams()
  const rawSlug = initialSlug || params.slug
  const resolvedSlug = rawSlug ? (SLUG_ALIASES[rawSlug.toLowerCase()] || rawSlug.toLowerCase()) : null

  const [services, setServices] = useState(STATIC_SERVICES)
  const [activeFaq, setActiveFaq] = useState(null)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)

  // Fetch CMS updates from backend if available, merging seamlessly
  useEffect(() => {
    servicesApi.getAll().then((res) => {
      if (Array.isArray(res.data) && res.data.length > 0) {
        // Merge fetched dynamic items with our rich static pillars
        const activeRemote = res.data.filter((s) => s.is_active !== false)
        const combined = [...STATIC_SERVICES]
        activeRemote.forEach((rem) => {
          const idx = combined.findIndex((c) => c.slug === rem.slug)
          if (idx !== -1) {
            combined[idx] = { ...combined[idx], ...rem }
          } else {
            combined.push(rem)
          }
        })
        setServices(combined)
      }
    }).catch(() => {})
  }, [])

  // Auto-scroll to selected service slug if present in URL
  useEffect(() => {
    if (resolvedSlug) {
      const timer = setTimeout(() => {
        const el = document.getElementById(resolvedSlug)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [resolvedSlug, services])

  const currentService = resolvedSlug ? services.find((s) => s.slug === resolvedSlug) : null

  // ═══════════════════════════════════════════════════════════════════════════
  // DYNAMIC SEO METADATA
  // ═══════════════════════════════════════════════════════════════════════════
  let seoTitle = 'Services & Solutions Hub | OpenMNC'
  let seoDesc = 'Explore OpenMNC engineering solutions: Vibe-coded app audit & fixing, App Store/Play Store publishing, app transfer, custom development, and AMC support.'
  let seoKeywords = 'vibe coded app audit, publish app on play store, fix app store rejection, app transfer service, custom software development india, app maintenance amc'
  let seoCanonical = '/services'

  if (currentService) {
    seoTitle = currentService.meta_title || `${currentService.title} | OpenMNC`
    seoDesc = currentService.meta_description || currentService.description?.slice(0, 160) || ''
    seoCanonical = `/services/${currentService.slug}`
    seoKeywords = `${currentService.title}, OpenMNC, ${currentService.slug}, app engineering, software solutions`
  }

  const dynamicSchemas = []
  if (currentService) {
    dynamicSchemas.push(aeoTechArticleSchema(currentService))
    dynamicSchemas.push(serviceSchema(currentService))
    if (currentService.faqs?.length > 0) {
      dynamicSchemas.push(dynamicFaqSchema(currentService.faqs))
    }
  } else {
    dynamicSchemas.push(b2bFaqSchema)
    dynamicSchemas.push(studentGuidanceFaqSchema)
  }

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDesc}
        canonical={seoCanonical}
        keywords={seoKeywords}
        schema={dynamicSchemas}
      />

      {/* ══════ HERO SECTION ══════ */}
      <section
        className="relative pt-28 sm:pt-34 pb-16 sm:pb-20 px-4 bg-navy-950 overflow-hidden"
        aria-label="Services hero"
      >
        <div className="absolute inset-0 aspect-[16/9] sm:aspect-auto overflow-hidden pointer-events-none">
          <ThreeBackground section="hero" className="opacity-35" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {currentService?.pillar && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-neon/10 border border-cyan-neon/30 text-cyan-neon text-xs font-semibold tracking-wider uppercase mb-4 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-neon animate-pulse" />
              <span>{currentService.pillar}: {currentService.category}</span>
            </div>
          )}

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-6 tracking-tight leading-tight">
            {currentService?.h1_heading ? (
              currentService.h1_heading
            ) : currentService ? (
              currentService.title
            ) : (
              <>
                Engineered Solutions for <span className="gradient-text">Founders &amp; Enterprises</span>
              </>
            )}
          </h1>

          <p className="text-white/90 text-sm sm:text-lg max-w-3xl mx-auto leading-relaxed mb-6">
            {currentService?.tagline || seoDesc}
          </p>

          {/* Breadcrumb if on specific pillar */}
          {currentService && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-400">
              <Link to="/services" className="hover:text-cyan-neon underline">All Services Hub</Link>
              <span>/</span>
              <span className="text-cyan-neon font-medium">{currentService.title}</span>
            </div>
          )}

          {/* Quick Pillar Filter Buttons on Hub Page */}
          {!currentService && (
            <div className="mt-8 flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
              {STATIC_SERVICES.slice(0, 5).map((p) => (
                <Link
                  key={p.slug}
                  to={`/services/${p.slug}`}
                  className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-neon/40 text-xs text-gray-300 hover:text-white transition-all"
                >
                  {p.pillar}: {p.title.split('&')[0]}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════ MAIN SERVICES CONTENT ══════ */}
      <main className="bg-navy-950 section-padding pt-10">
        <div className="container-max">
          <div className="space-y-20 sm:space-y-28">
            {services.map((service, i) => {
              const icon = getServiceIcon(service.icon, service.slug)
              const isEven = i % 2 === 0
              return (
                <article
                  key={service.slug}
                  id={service.slug}
                  className="scroll-mt-24 p-6 sm:p-10 rounded-3xl bg-white/2 border border-white/5 hover:border-cyan-neon/20 transition-all duration-300"
                  aria-label={service.title}
                >
                  <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start ${isEven ? '' : 'lg:grid-flow-col-dense'}`}>
                    
                    {/* Left Details (7 cols) */}
                    <div className={`lg:col-span-7 ${isEven ? '' : 'lg:col-start-6'}`}>
                      <ScrollReveal direction={isEven ? 'left' : 'right'}>
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-3xl" aria-hidden="true">{icon}</span>
                            {service.pillar && (
                              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-neon/15 text-cyan-neon border border-cyan-neon/30">
                                {service.pillar}
                              </span>
                            )}
                            {service.category && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10">
                                {service.category}
                              </span>
                            )}
                          </div>

                          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
                            {service.title}
                          </h2>
                          {service.tagline && (
                            <p className="text-cyan-neon text-xs sm:text-sm font-semibold italic mb-4">
                              {service.tagline}
                            </p>
                          )}
                          <div className="w-12 h-1 bg-cyan-neon rounded-full mb-6" aria-hidden="true" />

                          <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
                            {service.description}
                          </p>

                          {/* Supported Tools Badges (if any) */}
                          {service.supported_tools && (
                            <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                              <span className="text-[11px] uppercase tracking-wider font-bold text-gray-400 block mb-2">
                                Supported Stacks &amp; AI Tools:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {service.supported_tools.map((tool) => (
                                  <span key={tool} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-cyan-neon/10 text-cyan-neon border border-cyan-neon/20">
                                    {tool}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Problem Cards 4-Grid (The Problem founders face) */}
                          {service.problems_grid && service.problems_grid.length > 0 && (
                            <div className="mb-8">
                              <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-3">
                                Real Challenges We Solve:
                              </h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {service.problems_grid.map((prob, pi) => (
                                  <div key={pi} className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/20">
                                    <h4 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
                                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
                                        <span>{prob.title}</span>
                                    </h4>
                                    <p className="text-[11px] text-gray-300 leading-relaxed">
                                      {prob.desc}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* In-Depth Deliverables */}
                          {service.deliverables && service.deliverables.length > 0 && (
                            <div className="mb-8">
                              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-neon mb-3">
                                What Is Included in This Deliverable:
                              </h3>
                              <div className="space-y-2.5">
                                {service.deliverables.map((deliv, di) => (
                                  <div key={di} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                                    <span className="text-cyan-neon font-bold text-xs mt-0.5">✓</span>
                                    <div>
                                      <strong className="text-xs text-white block">{deliv.title}</strong>
                                      <span className="text-[11px] text-gray-300">{deliv.desc}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 4-Step Process Timeline */}
                          {service.process_steps && service.process_steps.length > 0 && (
                            <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10">
                              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-glow mb-4">
                                Our Step-by-Step Process:
                              </h3>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                                {service.process_steps.map((st) => (
                                  <div key={st.step} className="p-2.5 rounded-xl bg-navy-950/60 border border-white/5">
                                    <span className="text-xs font-bold text-amber-glow block mb-1">
                                      {st.step}
                                    </span>
                                    <strong className="text-[11px] text-white block mb-1 leading-tight">
                                      {st.title}
                                    </strong>
                                    <p className="text-[10px] text-gray-400 leading-tight">
                                      {st.desc}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Cross-Link naturally to complementary services */}
                          {service.cross_link && (
                            <div className="mb-6 p-3.5 rounded-xl bg-cyan-neon/5 border border-cyan-neon/20 flex items-center justify-between gap-3">
                              <span className="text-xs text-gray-300">
                                <Lightbulb className="w-4 h-4 text-cyan-neon shrink-0 inline-block mr-1.5" aria-hidden="true" />{service.cross_link.text}
                              </span>
                              <Link
                                to={service.cross_link.to}
                                className="text-xs font-bold text-cyan-neon hover:underline whitespace-nowrap"
                              >
                                {service.cross_link.title} →
                              </Link>
                            </div>
                          )}

                          {/* Service FAQs */}
                          {service.faqs && service.faqs.length > 0 && (
                            <div className="mt-6 pt-4 border-t border-white/10">
                              <span className="text-xs font-bold uppercase tracking-wider text-cyan-neon block mb-3">
                                Frequently Asked Questions:
                              </span>
                              <div className="space-y-2">
                                {service.faqs.map((faq, fIdx) => {
                                  const faqId = `${service.slug}-faq-${fIdx}`
                                  const isOpen = activeFaq === faqId
                                  return (
                                    <div
                                      key={fIdx}
                                      className="rounded-xl bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden"
                                    >
                                      <button
                                        type="button"
                                        onClick={() => setActiveFaq(isOpen ? null : faqId)}
                                        className="w-full text-left px-3.5 py-2.5 flex items-center justify-between text-xs sm:text-sm font-semibold text-white/90 hover:text-cyan-neon"
                                      >
                                        <span>Q: {faq.question}</span>
                                        <span className="text-cyan-neon text-xs">{isOpen ? '−' : '+'}</span>
                                      </button>
                                      {isOpen && (
                                        <div className="px-3.5 pb-3 text-xs sm:text-sm text-gray-300 border-t border-white/5 pt-2 leading-relaxed">
                                          {faq.answer}
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </ScrollReveal>
                    </div>

                    {/* Right Action / Contact Card (5 cols) */}
                    <div className={`lg:col-span-5 ${isEven ? '' : 'lg:col-start-1 lg:row-start-1'} sticky top-24`}>
                      <ScrollReveal direction={isEven ? 'right' : 'left'} delay={0.1}>
                        <div className="glass-card p-6 sm:p-8 relative overflow-hidden group hover:border-cyan-neon/40 transition-all duration-300">
                          <div className="text-5xl mb-4 text-center" aria-hidden="true">{icon}</div>
                          
                          <h3 className="font-display text-center text-lg sm:text-xl font-bold text-white mb-1 group-hover:text-cyan-neon transition-colors">
                            {service.title}
                          </h3>
                          <p className="text-center text-gray-400 text-xs mb-6">
                            Fixed scope milestone or dedicated senior engineers
                          </p>

                          <div className="space-y-3 pt-4 border-t border-white/10">
                            <Link
                              to={`/contact?intent=b2b&service=${service.slug}`}
                              className="w-full block py-3 rounded-xl bg-cyan-neon text-navy-950 font-bold text-xs sm:text-sm text-center shadow-cyan-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                              Request Project Proposal →
                            </Link>

                            <a
                              href={whatsappUrl(
                                '918509684056',
                                `Hi Amit! I want to consult regarding ${service.title} (${service.slug}).`
                              )}
                              className="w-full block py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/90 text-xs font-semibold text-center transition-all"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <MessageSquare className="w-4 h-4 text-emerald-400 inline-block mr-1.5" aria-hidden="true" />Instant WhatsApp Consultation
                            </a>

                            <div className="pt-3 text-[11px] text-gray-400 space-y-1.5 border-t border-white/5">
                              <p className="flex items-center gap-1.5">
                                <span className="text-cyan-neon">✓</span> 100% IP &amp; Code Ownership Stays With You
                              </p>
                              <p className="flex items-center gap-1.5">
                                <span className="text-cyan-neon">✓</span> Strict Mutual NDA Before Code Sharing
                              </p>
                              <p className="flex items-center gap-1.5">
                                <span className="text-cyan-neon">✓</span> Direct Senior Engineering Communication
                              </p>
                            </div>
                          </div>
                        </div>
                      </ScrollReveal>
                    </div>

                  </div>
                </article>
              )
            })}
          </div>

          {/* ══════ BANK-STYLE CLEAR REDIRECT TO CAREER GUIDANCE ══════ */}
          <section className="mt-20 p-8 rounded-3xl bg-amber-glow/10 border border-amber-glow/20 relative overflow-hidden" aria-label="Career Portal Banner">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold text-amber-glow uppercase tracking-wider block mb-1">
                  <GraduationCap className="w-4 h-4 text-amber-glow inline-block mr-1.5" aria-hidden="true" />Looking for Higher Education &amp; Student Mentorship?
                </span>
                <h3 className="font-display text-2xl font-bold text-white mb-2">
                  Visit the OpenMNC 100% Free Career Guidance Portal
                </h3>
                <p className="text-gray-300 text-sm max-w-xl">
                  A separate wing dedicated to 12th-pass students. Claim ₹3,000–₹10,000 partner college fee subsidies and 3-month advanced industrial IoT/AI training.
                </p>
              </div>
              <Link
                to="/career-guidance"
                className="px-6 py-3.5 rounded-xl bg-amber-glow text-navy-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-glow/90 shadow-amber-glow transition-all whitespace-nowrap"
              >
                Go to Career Guidance Portal →
              </Link>
            </div>
          </section>

          {/* ══════ GOOGLE BUSINESS PROFILE RATING BANNER ══════ */}
          <section className="mt-16 text-center glass-card p-8 border border-white/10">
            <div className="max-w-xl mx-auto">
              <span className="text-amber-400 text-xl block mb-2">★★★★★</span>
              <h3 className="font-display text-xl font-bold text-white mb-2">
                Have We Built or Audited Your Software?
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm mb-4">
                Your feedback helps other founders find reliable engineering partners. Leave a verified review on our Google Business Profile.
              </p>
              <button
                type="button"
                onClick={() => setReviewModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold transition-all"
              >
                <span>⭐</span> Rate OPEN MNC on Google
              </button>
            </div>
          </section>
        </div>
      </main>

      <GoogleReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
      />
    </>
  )
}
