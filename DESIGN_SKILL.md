# DESIGN_SKILL.md — OpenMNC LLP Master Design System

> **AI AGENT INSTRUCTION**: Read this ENTIRE file before writing any UI code for this project. Every design decision — colors, typography, spacing, motion, icons, SEO — is pre-decided here. Do not use defaults. Do not guess. Follow exactly.

---

## 0. Anti-AI-Slop Mandate (READ FIRST)

This site must feel human-engineered. These are hard bans:

| ❌ Banned | ✅ Required Instead |
|-----------|-------------------|
| `font-sans` / `Inter` / `-apple-system` as headings | `font-display` = **Plus Jakarta Sans** |
| Uniform `rounded-xl` on all cards | Vary radius per context (see Section 3C) |
| Lorem ipsum / placeholder copy | Real copy from the brief — always |
| AI-generated icon SVG blobs | Lucide React `strokeWidth={1.5}` or Phosphor Duotone |
| Pure `#000000` page background | `#0B0F19` dark navy or `#FFFFFF` white |
| Centered hero text as default | Asymmetric 60/40 grid — text left, visual right |
| Equal section padding everywhere | Vary rhythm: tight → airy → tight → airy |
| Identical 3-col feature grid | Staggered / asymmetric layouts (see Section 3C) |
| Fake testimonials / fake photos | Zero fake social proof — only real or omit |
| Body text below 15px on mobile | 15px minimum for all readable body copy |
| Opacity-only glass on pure black | Solid dark surface `#141821` with selective opacity |

---

## 1. Color System

### 1A. CSS Custom Properties (define in `src/index.css :root`)

```css
:root {
  /* ===== BACKGROUND LAYERS ===== */
  --bg-canvas:          #FFFFFF;        /* Primary white canvas */
  --bg-subtle:          #F8FAFC;        /* Soft off-white for alternate sections */
  --bg-dark-band:       #0B0F19;        /* Deep navy accent (NOT pure black) */
  --bg-dark-surface:    #141821;        /* Cards inside dark bands */
  --bg-dark-elevated:   #1E2534;        /* Elevated cards / modals inside dark bands */

  /* ===== TEXT ===== */
  --text-primary:       #0F172A;        /* Slate 900 — headings on light bg */
  --text-secondary:     #475569;        /* Slate 600 — subheadings on light bg */
  --text-muted:         #94A3B8;        /* Slate 400 — captions on light bg */
  --text-on-dark:       #F1F5F9;        /* Slate 100 — body on dark bands */
  --text-on-dark-muted: #64748B;        /* Slate 500 — captions on dark bands */

  /* ===== BRAND ACCENT ===== */
  --brand-primary:      #2563EB;        /* Blue 600 — primary CTA, links */
  --brand-hover:        #1D4ED8;        /* Blue 700 — hover */
  --brand-accent:       #0EA5E9;        /* Sky 500 — secondary/badges */
  --brand-amber:        #F59E0B;        /* Amber 500 — career/student silo */
  --brand-emerald:      #10B981;        /* Emerald 500 — social media silo */

  /* ===== STATUS ===== */
  --status-success:     #059669;
  --status-error:       #DC2626;
  --status-warning:     #D97706;

  /* ===== BORDER ===== */
  --border-hairline:    #E2E8F0;        /* Slate 200 — card borders on light */
  --border-focus:       #2563EB;        /* Focus ring */
  --border-dark:        rgba(255,255,255,0.10); /* Borders on dark bands */

  /* ===== SHADOWS ===== */
  --shadow-card:        0 1px 3px rgba(15,23,42,0.08), 0 4px 16px rgba(15,23,42,0.06);
  --shadow-card-hover:  0 4px 20px rgba(37,99,235,0.12), 0 1px 4px rgba(15,23,42,0.12);
  --shadow-cta:         0 4px 20px rgba(37,99,235,0.35);
}
```

### 1B. Tailwind Quick Reference

| Token | Tailwind Class | Hex / Value |
|-------|---------------|-------------|
| White canvas | `bg-white` | #FFFFFF |
| Subtle section | `bg-slate-50` | #F8FAFC |
| Dark band | `bg-[#0B0F19]` | #0B0F19 |
| Dark surface card | `bg-[#141821]` | #141821 |
| Primary heading | `text-slate-900` | #0F172A |
| Body text | `text-slate-600` | #475569 |
| Caption / muted | `text-slate-400` | #94A3B8 |
| Brand blue | `text-blue-600` | #2563EB |
| Career amber | `text-amber-500` | #F59E0B |
| Social emerald | `text-emerald-500` | #10B981 |
| Light border | `border-slate-200` | #E2E8F0 |

### 1C. Page Section Rhythm (Alternate Dark / Light — Never Two Same Consecutive)

```
Homepage Layout (top → bottom):
  1. Navbar              → transparent top / white+blur scrolled
  2. Hero                → WHITE canvas (asymmetric grid, ambient gradient)
  3. Trust / Stats Strip → slate-50 (logos, stat counters)
  4. 5-Pillar Router     → WHITE (cards with left border accent)
  5. 3-Silo Verticals    → DARK BAND (#0B0F19)
  6. How It Works Flow   → WHITE (SVG animated process)
  7. Proof / Numbers     → slate-50
  8. Blog Preview        → WHITE
  9. Final CTA           → DARK BAND (brand gradient edge)
 10. Footer              → #0B0F19
```

> [!IMPORTANT]
> Never place two dark sections or two white sections back-to-back. The rhythm is the design.

---

## 2. Typography

### 2A. Font Stack (Load via Google Fonts in `index.html`)

```html
<!-- Replace existing fonts link with this single combined link -->
<link
  href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500;600&display=swap"
  rel="stylesheet"
/>
```

| Role | Font | Tailwind Class | Use Case |
|------|------|----------------|----------|
| Display / Headings | **Plus Jakarta Sans** | `font-display` | H1, H2, H3, hero text, card titles, nav logo |
| Body / UI copy | **DM Sans** | `font-body` | Paragraphs, descriptions, labels, buttons, inputs |
| Code / Mono labels | **JetBrains Mono** | `font-mono` | Code blocks, tech badges, pricing numbers, stat counters |

**`tailwind.config.js` fontFamily block:**
```js
fontFamily: {
  display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
  body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
  sans:    ['"DM Sans"', 'system-ui', 'sans-serif'],  // override Tailwind default
  mono:    ['"JetBrains Mono"', 'monospace'],
  grotesk: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
},
```

### 2B. Type Scale — Responsive

| Element | Mobile | Tablet `md:` | Desktop `lg:` | Weight | Letter-spacing |
|---------|--------|-------------|--------------|--------|---------------|
| **H1 Hero** | `text-4xl` / 36px | `text-5xl` / 48px | `text-6xl` / 60px | 800 | `-0.03em` |
| **H1 Page** | `text-3xl` / 30px | `text-4xl` / 40px | `text-5xl` / 48px | 700 | `-0.025em` |
| **H2 Section** | `text-2xl` / 24px | `text-3xl` / 32px | `text-4xl` / 40px | 700 | `-0.02em` |
| **H3 Card** | `text-lg` / 18px | `text-xl` / 20px | `text-[22px]` / 22px | 600 | `-0.01em` |
| **Body Large** | `text-[17px]` | `text-lg` / 18px | `text-lg` | 400 | `0` |
| **Body Normal** | `text-[15px]` | `text-base` / 16px | `text-base` | 400 | `0` |
| **Caption** | `text-[12px]` | `text-[13px]` | `text-[13px]` | 500 | `+0.04em` |
| **Micro / Tag** | `text-[10px]` | `text-[11px]` | `text-[11px]` | 600 | `+0.06em` uppercase |

**Tailwind copy-paste cheat-sheet:**
```
H1 Hero:   text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight leading-tight
H1 Page:   text-3xl md:text-4xl lg:text-5xl font-bold font-display tracking-tight leading-tight
H2:        text-2xl md:text-3xl lg:text-4xl font-bold font-display tracking-tight
H3:        text-lg md:text-xl font-semibold font-display tracking-tight
Body-lg:   text-[17px] md:text-lg font-body leading-relaxed
Body:      text-[15px] md:text-base font-body leading-relaxed
Caption:   text-[12px] md:text-[13px] font-body font-medium tracking-wide
Micro:     text-[10px] md:text-[11px] font-body font-semibold tracking-widest uppercase
```

### 2C. Typography Rules

- **Line height**: H1/H2 → `leading-tight` (1.1–1.2). Body → `leading-relaxed` (1.6–1.7).
- **Max line length**: Body text `max-w-2xl` (~65ch). Hero sub `max-w-xl`.
- **Gradient text** (max 1× per page): `bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent`
- **JetBrains Mono** for all numeric stats, prices, percentages — `tabular-nums`
- **Never** justify body text — left-align always (except centred hero fallback on mobile)

---

## 3. Spacing & Layout Grid

### 3A. 8px Base Grid

All spacing is a multiple of 8px. Use these Tailwind values: `2 (8px)`, `3 (12px)`, `4 (16px)`, `6 (24px)`, `8 (32px)`, `10 (40px)`, `12 (48px)`, `16 (64px)`, `20 (80px)`, `24 (96px)`.

Never use `px-5` or `py-7` or other non-multiple values on structural elements.

### 3B. Container & Page Padding

```
Max content width: max-w-7xl mx-auto (1280px)
Page padding:      px-4 sm:px-6 lg:px-8  ← use exactly this, always
Section padding:   py-14 md:py-20 lg:py-24
```

### 3C. Layout Patterns

**Hero (asymmetric 60/40 — standard for all service pages):**
```jsx
<div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
  <div className="lg:col-span-3">  {/* Text: H1 + subheadline + CTAs */}  </div>
  <div className="lg:col-span-2">  {/* Visual: SVG / 3D / graphic */}   </div>
</div>
```

**Feature Cards — break the AI 3-col look:**
```jsx
// Staggered: 1 large + 2 small
<div className="grid md:grid-cols-3 gap-6">
  <div className="md:col-span-2 p-8 rounded-3xl ...">  {/* Large anchor card */}  </div>
  <div className="p-6 rounded-2xl ...">                 {/* Small card */}          </div>
  <div className="p-6 rounded-2xl ...">                 {/* Small card */}          </div>
  <div className="md:col-span-1 p-6 rounded-2xl ...">  {/* Another small */}       </div>
</div>
```

**Card Border Radius Variance (break the uniform AI look):**
| Context | Radius |
|---------|--------|
| Hero section card | `rounded-3xl` |
| Standard feature card | `rounded-2xl` |
| Stat chip / badge | `rounded-full` |
| Input fields | `rounded-xl` |
| Primary buttons | `rounded-full` |
| Secondary buttons | `rounded-xl` |
| Testimonial quote | `rounded-[28px]` |
| Data table container | `rounded-2xl` |
| Table rows | `rounded-none` |
| Icon container | `rounded-2xl` |
| Nav pills | `rounded-full` |

---

## 4. Component Library

### 4A. Buttons

**Primary CTA — Blue (most important action on page):**
```jsx
<button className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-body font-semibold text-sm md:text-base transition-all duration-200 shadow-[0_4px_20px_rgba(37,99,235,0.35)] hover:shadow-[0_6px_28px_rgba(37,99,235,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none">
  Book a Call
  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
</button>
```

**Secondary CTA — Outline:**
```jsx
<button className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-300 hover:border-blue-600 text-slate-700 hover:text-blue-600 font-body font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 bg-white">
  See Case Study
  <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
</button>
```

**Ghost — On dark bands:**
```jsx
<button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/16 border border-white/15 hover:border-white/30 text-white font-body font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 backdrop-blur-sm">
  Learn More
</button>
```

**Career/Student CTA — Amber:**
```jsx
<button className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-body font-semibold text-sm transition-all duration-200 shadow-[0_4px_20px_rgba(245,158,11,0.35)]">
  Claim Free Guidance
</button>
```

**Social Media CTA — Emerald:**
```jsx
<button className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-body font-semibold text-sm transition-all duration-200">
  Explore Social Growth
</button>
```

### 4B. Cards

**On light background (standard):**
```jsx
<div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200 shadow-[0_1px_3px_rgba(15,23,42,0.08),0_4px_16px_rgba(15,23,42,0.06)] hover:shadow-[0_4px_20px_rgba(37,99,235,0.1)] hover:-translate-y-1 transition-all duration-300">
  {/* content */}
</div>
```

**On dark band:**
```jsx
<div className="p-6 md:p-8 rounded-2xl bg-[#141821] border border-white/8 hover:border-white/16 hover:-translate-y-1 transition-all duration-300">
  {/* content */}
</div>
```

**Accent left-border card (feature list):**
```jsx
<div className="p-5 md:p-6 rounded-xl bg-white border border-slate-200 border-l-4 border-l-blue-600 shadow-sm hover:shadow-md transition-shadow">
  {/* content */}
</div>
```

### 4C. Form Inputs (Light Theme — Use in Contact/Enquiry)

```jsx
// Text / Email / Tel input
<input className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm font-body focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all" />

// Select dropdown
<select className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-body focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 appearance-none cursor-pointer">

// Textarea
<textarea className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm font-body focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 resize-none transition-all" rows={4} />

// Label
<label className="block text-sm font-medium font-body text-slate-700 mb-1.5">
  Label <span className="text-red-500">*</span>
</label>
```

**Radio Chip (single-select visual pills):**
```jsx
{options.map(opt => (
  <label key={opt.value} className="cursor-pointer">
    <input type="radio" {...register(fieldName)} value={opt.value} className="sr-only" />
    <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-body font-medium border transition-all cursor-pointer
      ${watchedValue === opt.value
        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'}`}>
      {opt.label}
    </span>
  </label>
))}
```

**Checkbox Chip (multi-select):**
```jsx
{options.map(opt => (
  <label key={opt.value} className="cursor-pointer">
    <input type="checkbox" value={opt.value} onChange={...} className="sr-only" />
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-medium border transition-all cursor-pointer
      ${selectedValues.includes(opt.value)
        ? 'bg-blue-600 text-white border-blue-600'
        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}>
      {selectedValues.includes(opt.value) && <Check className="w-3 h-3" />}
      {opt.label}
    </span>
  </label>
))}
```

### 4D. Badges / Tags

```jsx
// Category eyebrow label (above H2)
<span className="text-[11px] font-semibold uppercase tracking-widest text-blue-600 font-body">
  B2B Software & Apps
</span>

// Status badge
<span className="text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-body">
  Live
</span>

// Pill on dark
<span className="text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-white/10 text-blue-300 border border-blue-400/30">
  30% Savings
</span>
```

---

## 5. Icon Rules

### 5A. Allowed Libraries (in priority order)

1. **Lucide React** — Default choice. ALWAYS set `strokeWidth={1.5}` (not the default 2).
2. **Phosphor Icons** (`@phosphor-icons/react`) — Duotone style for decorative hero accents.
3. **Custom Unicode Emoji** — For human warmth markers (✅ ⚡ 🎯 🏆).

> [!CAUTION]
> Never use AI-generated SVG icon blobs inline. Never use Heroicons, Bootstrap Icons, or FontAwesome. Never use `strokeWidth={2}` (the AI default).

### 5B. Icon Sizing Table

| Context | Size | Class |
|---------|------|-------|
| Navbar item | 18px | `w-[18px] h-[18px]` |
| Button icon | 16px | `w-4 h-4` |
| Form label | 16px | `w-4 h-4` |
| Feature card | 24px | `w-6 h-6` |
| Hero accent | 32px | `w-8 h-8` |
| Section divider accent | 20px | `w-5 h-5` |

### 5C. Icon Containers (never naked icons — always wrap)

```jsx
// Light bg container
<div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
  <Zap className="w-6 h-6 text-blue-600" strokeWidth={1.5} />
</div>

// Dark bg container
<div className="w-12 h-12 rounded-2xl bg-white/8 border border-white/12 flex items-center justify-center shrink-0">
  <Zap className="w-6 h-6 text-blue-400" strokeWidth={1.5} />
</div>

// Colored accent container (per-silo)
<div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
  <TrendingUp className="w-6 h-6 text-emerald-600" strokeWidth={1.5} />
</div>
```

---

## 6. Motion & Animation

### 6A. Core Principles

1. **Purpose-first**: Every animation must do one of: guide attention, explain a concept, or confirm an action. No idle decoration.
2. **Transform only**: Animate `opacity`, `transform` (translate/scale/rotate) only. Never animate `height`, `width`, `padding`, `margin` — they cause layout thrash.
3. **Reduced motion**: Wrap non-essential animations with `useReducedMotion()` from Framer Motion.

### 6B. Standard Easing Curves

```js
// Smooth Apple-style entrance
export const EASE_OUT   = [0.22, 1, 0.36, 1]

// Snappy micro-interaction (button, toggle)
export const EASE_SNAP  = { type: 'spring', stiffness: 400, damping: 30 }

// Gentle page transition
export const EASE_PAGE  = { duration: 0.4, ease: [0.22, 1, 0.36, 1] }

// Stagger children (use in parent variants)
export const STAGGER    = { staggerChildren: 0.08, delayChildren: 0.1 }
```

### 6C. Scroll-Reveal Pattern (Use on every section — not just hero)

```jsx
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
```

### 6D. SVG Process Flow Animation (Customer Journey Diagrams)

```jsx
// Animated connecting line between process steps
// Triggered when section scrolls into view
<motion.line
  x1="50" y1="80" x2="50" y2="200"
  stroke="#2563EB"
  strokeWidth="2"
  strokeDasharray="1"
  initial={{ pathLength: 0, opacity: 0 }}
  animate={inView ? { pathLength: 1, opacity: 1 } : {}}
  transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.4 }}
/>

// Step circle pop-in
<motion.circle
  cx="50" cy="80" r="20"
  fill="#2563EB"
  initial={{ scale: 0, opacity: 0 }}
  animate={inView ? { scale: 1, opacity: 1 } : {}}
  transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.2 }}
/>
```

> [!TIP]
> Use SVG flow diagrams (not screenshots or images) for the "How It Works" section. They load instantly, are indexable as text in `<title>` / `<desc>` SVG tags, and animate perfectly.

### 6E. Number Counter (Stats Section)

```jsx
import { animate } from 'framer-motion'
import { useEffect, useRef } from 'react'

function CountUp({ to, duration = 1.5, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration,
      ease: 'easeOut',
      onUpdate(v) { if (ref.current) ref.current.textContent = Math.round(v) + suffix }
    })
    return controls.stop
  }, [inView, to, duration, suffix])
  return <span ref={ref} className="font-mono tabular-nums">0{suffix}</span>
}
```

### 6F. Card Hover Microinteractions

```jsx
// Standard card lift
<motion.div
  whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(37,99,235,0.15)' }}
  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
>

// Icon rotate on card hover (use parent variants)
const cardVariants = {
  rest:  { y: 0 },
  hover: { y: -4 },
}
const iconVariants = {
  rest:  { rotate: 0, scale: 1 },
  hover: { rotate: 10, scale: 1.1 },
}
// <motion.div variants={cardVariants} whileHover="hover">
//   <motion.div variants={iconVariants}>icon</motion.div>
// </motion.div>
```

---

## 7. SEO / AEO / GEO Blueprint

### 7A. Hub-and-Spoke Architecture (iLovePDF Strategy)

Every search query a potential customer types must map to a dedicated, fully detailed page:

```
/solutions/custom-web-app-development  [HUB]
  ├── /solutions/cloud-kitchen-ordering-website
  ├── /solutions/d2c-brand-mobile-app
  ├── /solutions/pharmacy-ecommerce-website
  └── /solutions/clinic-appointment-booking-system

/services/social-media-management  [HUB]
  ├── /services/instagram-reels-for-restaurants
  ├── /services/local-business-social-media-management
  └── /services/reels-video-editing-service-kolkata

/career-guidance  [HUB]
  ├── /career-guidance/btech-vs-bca-after-12th
  ├── /career-guidance/college-admission-fee-subsidy-west-bengal
  └── /career-guidance/best-engineering-colleges-kolkata-2026
```

### 7B. H1 Writing Rules

- **ONE H1 per page** — no exceptions.
- **Match real user search intent** — the exact phrase or close variation users type.
- **Include location or industry** when relevant to the audience.

| ✅ Strong H1s | ❌ Weak H1s |
|-------------|------------|
| "Stop Paying 30% Commission to Swiggy & Zomato" | "Innovative Technology Solutions" |
| "Get Your App Approved on the App Store — Even After Rejection" | "Welcome to OpenMNC" |
| "100% Free Career Guidance for 12th Pass Students in West Bengal" | "Your Trusted Software Partner" |
| "Reduce Zomato Commission: Custom Ordering Website for Cloud Kitchens" | "Services We Offer" |

### 7C. FAQPage JSON-LD (Add to EVERY service page)

```jsx
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does a custom ordering website cost for a cloud kitchen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A complete custom direct ordering website with payment gateway, WhatsApp notifications, and customer analytics costs between ₹75,000 and ₹2,50,000 depending on features. This pays for itself within 1–2 months from commission savings alone on ₹2L+ monthly GMV.'
      }
    },
    // Add 5–9 more Q&As per service page
  ]
}
```

**FAQ answer quality rules:**
- Length: 50–200 words per answer (AI search engines pull these verbatim)
- Include a specific number, process step, or comparison
- Answer the exact question asked — no vague corporate language

### 7D. Meta Tag Template

```jsx
<SEO
  title="[Service] for [Industry/City] | OpenMNC LLP"
  description="[Problem statement in 10 words]. [Our solution]. [Proof: number/result]. [CTA with location]. OpenMNC LLP, Kolkata."
  canonical="/exact-url-path"
  keywords="[primary keyword], [secondary keyword], [location keyword], OpenMNC"
  schema={faqSchema}
/>
// Meta description target: 148–158 characters exactly
```

### 7E. AEO Quality Checklist (before every deploy)

- [ ] Every page has exactly 1 `<h1>` matching primary search intent
- [ ] Every service page has FAQPage JSON-LD (6–10 Q&As)
- [ ] Every FAQ answer is 50–200 words
- [ ] Homepage has LocalBusiness + FAQPage + WebSite JSON-LD
- [ ] Blog posts have Article JSON-LD
- [ ] All `<img>` tags have descriptive `alt` text (not "image.jpg")
- [ ] `<meta name="description">` is 148–158 chars
- [ ] Every page has canonical tag
- [ ] `sitemap.xml` updated with any new URLs

---

## 8. Contact / Enquiry Form — Dynamic Service-Aware Fields

The enquiry form MUST show contextually relevant fields per service. This is the mapping:

### 8A. Service → Dynamic Fields

**`custom-software-and-scalable-app-development` or `inhouse-products`:**
```
App Type:        [Web App] [Mobile App] [Both]  — radio chips
Industry:        Cloud Kitchen | D2C Brand | Pharma | Real Estate | Retail | Healthcare | Education | Other  — select
Budget:          ₹25k–₹75k | ₹75k–₹2.5L | ₹2.5L–₹10L | ₹10L+  — select
Timeline:        < 2 weeks | 1–2 Months | 3–6 Months | Exploratory  — select
Existing App?:   [No, Greenfield] [Yes, Needs Redesign]  — radio chips
NDA:             checkbox (default ON)
```

**`social-media-management`:**
```
Platforms:       Instagram | Facebook | YouTube | LinkedIn  — checkbox chips (multi-select)
Business Type:   Restaurant/Cafe | Bakery | Real Estate | D2C Brand | Fitness | Retail | Other  — select
Monthly Budget:  ₹8k–₹15k | ₹15k–₹30k | ₹30k–₹60k | ₹60k+  — select
Current Followers: 0–1k | 1k–10k | 10k–50k | 50k+  — select
Footage?:        [Yes, we shoot] [No, need production]  — radio chips
Goal:            Footfall | Online Orders | Brand Awareness | Lead Gen  — select
```

**`vibe-coded-app-audit-and-fixing`:**
```
AI Tool:         Cursor | Lovable | Bolt.new | Replit | v0.dev | Other  — radio chips
Hosting:         Vercel | Railway | Supabase | Firebase | AWS/GCP | Other  — select
Problem:         Broken Auth | Exposed Keys | Crashes/Slow | Payment Issues | App Store Rejected  — checkbox chips
GitHub Access?:  [Yes] [No, will arrange]  — radio chips
```

**`app-store-play-store-publishing-and-approval`:**
```
Platform:        [iOS App Store] [Google Play Store] [Both]  — radio chips
App Status:      Ready to submit | Previously rejected | Build in progress  — select
Developer Account: Yes mine | Yes client's | Need help  — select
Rejection Reason (show if status=rejected): textarea
```

**`app-transfer-and-database-migration`:**
```
Source Platform:    free text input
Destination:        free text input
Database Size:      < 1GB | 1–10GB | 10–100GB | 100GB+  — select
Active Users:       < 1k | 1k–10k | 10k–100k | 100k+  — select
Deadline:           ASAP (legal) | Planned 1–3 months | Exploratory  — select
```

**`business-automation`:**
```
Industry:        E-commerce | Real Estate | Healthcare | Finance | HR | Manufacturing | Other  — select
Process to Automate: textarea
Current Tools:   Sheets/Excel | CRM | WhatsApp | Email | Custom Software  — checkbox chips
Team Size:       [Solo] [2–10] [11–50] [50+]  — radio chips
```

**All other B2B services:** Show generic budget + timeline + NDA checkbox only.

**Student tab additions:**
```
Stream:          [Science (PCM)] [Science (PCB)] [Commerce] [Arts]  — radio chips
Interested Field: Computer Science/IT | Electronics/Robotics | AI & Data Science | Mechanical | Business/MBA | Need Guidance  — select
Fee Budget/yr:   Under ₹60k | ₹60k–₹1.5L | ₹1.5L–₹3L | Above ₹3L  — select
State/City:      free text input
Subsidy:         Apply for ₹3k–₹10k subsidy  — checkbox (default ON)
Training:        Interested in Industrial Training  — checkbox (default ON)
```

---

## 9. Blog CMS — Block Schema

### 9A. Backend Model (`backend/models/blog.py`)

```python
from typing import Optional, List, Literal
from pydantic import BaseModel
from datetime import datetime

class ContentBlock(BaseModel):
    type: Literal[
        'paragraph', 'heading', 'subheading', 'code', 'image',
        'callout', 'comparison_table', 'numbered_list', 'bullet_list',
        'quote', 'faq_pair', 'cta_banner', 'divider'
    ]
    content:   Optional[str] = None   # Text content / markdown
    language:  Optional[str] = None   # 'python' | 'jsx' | 'bash' (for code blocks)
    level:     Optional[int] = None   # 2, 3, 4 (for heading blocks)
    url:       Optional[str] = None   # Cloudinary URL (for image blocks)
    alt:       Optional[str] = None   # Image alt text
    caption:   Optional[str] = None   # Image/callout caption
    variant:   Optional[str] = None   # callout: 'info'|'warning'|'tip'|'caution'
    rows:      Optional[List[dict]] = None    # comparison_table rows
    headers:   Optional[List[str]] = None    # comparison_table column headers
    question:  Optional[str] = None   # faq_pair question
    answer:    Optional[str] = None   # faq_pair answer
    cta_text:  Optional[str] = None   # cta_banner button text
    cta_url:   Optional[str] = None   # cta_banner URL
    items:     Optional[List[str]] = None    # bullet_list / numbered_list items

class BlogPost(BaseModel):
    title:                  str
    slug:                   str         # URL slug — unique
    summary:                str         # 1–2 sentence meta description (148–158 chars)
    quick_answer_aeo:       str         # Direct 1-para answer for AI search engines
    thumbnail:              Optional[str] = None    # Cloudinary URL
    author:                 str
    category:               str
    tags:                   List[str]
    reading_time_minutes:   int         # Auto-calculate: words / 200
    blocks:                 List[ContentBlock]
    faq_schema:             Optional[List[dict]] = None   # FAQPage JSON-LD mainEntity
    published:              bool = False
    published_at:           Optional[datetime] = None
    created_at:             datetime
    updated_at:             datetime
```

### 9B. Frontend Blog Article Renderer

```jsx
// Render each block type
function BlockRenderer({ block }) {
  switch (block.type) {
    case 'paragraph':   return <p className="text-[15px] md:text-base font-body text-slate-700 leading-relaxed mb-4">{block.content}</p>
    case 'heading':     return <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900 mt-10 mb-4">{block.content}</h2>
    case 'subheading':  return <h3 className="text-xl font-semibold font-display text-slate-900 mt-8 mb-3">{block.content}</h3>
    case 'code':        return <pre className="rounded-xl bg-slate-900 text-slate-100 p-4 mb-6 overflow-x-auto font-mono text-sm"><code>{block.content}</code></pre>
    case 'image':       return <figure className="mb-6"><img src={block.url} alt={block.alt} className="w-full rounded-2xl" />{block.caption && <figcaption className="text-center text-xs text-slate-500 mt-2">{block.caption}</figcaption>}</figure>
    case 'callout':     return <CalloutBlock block={block} />
    case 'cta_banner':  return <CTABanner block={block} />
    // ... etc
  }
}
```

---

## 10. Job / Internship Posting Schema

### 10A. Backend Model (`backend/models/career.py`)

```python
from typing import Optional, List, Literal
from pydantic import BaseModel
from datetime import datetime

class JobPost(BaseModel):
    title:               str
    slug:                str
    department:          str              # Engineering | Marketing | Design | Operations
    engagement_type:     Literal['full_time', 'part_time', 'internship', 'contract', 'freelance']
    work_mode:           Literal['remote', 'hybrid', 'on_site']
    location:            Optional[str]   # City if on-site/hybrid
    compensation_type:   Literal['paid', 'unpaid', 'stipend', 'equity']
    compensation_details: Optional[str]  # e.g. "₹5,000–₹15,000/month stipend"
    unpaid_benefits:     Optional[List[str]]  # ['LOR', 'Certificate', 'Live Project', 'PPO']
    clauses_and_terms:   Optional[List[str]]  # ['6-month commitment', '3-month probation']
    description:         str
    responsibilities:    List[str]
    requirements:        List[str]
    nice_to_have:        Optional[List[str]]
    application_deadline: Optional[datetime]
    is_active:           bool = True
    created_at:          datetime
    updated_at:          Optional[datetime]
```

### 10B. Compensation Badge UI Rules

```jsx
// Paid / Stipend  → green badge
<span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200">
  Paid — ₹5k–₹15k/mo
</span>

// Unpaid (with benefits)  → blue/slate badge
<span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-200">
  Unpaid + LOR + Certificate
</span>
```

### 10C. JobPosting JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": "Full-Stack Developer Intern",
  "datePosted": "2026-11-22",
  "validThrough": "2027-01-15",
  "employmentType": "INTERN",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "OpenMNC LLP",
    "sameAs": "https://openmnc.com",
    "logo": "https://openmnc.com/logo.png"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kolkata",
      "addressRegion": "West Bengal",
      "addressCountry": "IN"
    }
  },
  "jobLocationType": "TELECOMMUTE",
  "baseSalary": {
    "@type": "MonetaryAmount",
    "currency": "INR",
    "value": {
      "@type": "QuantitativeValue",
      "minValue": 5000,
      "maxValue": 15000,
      "unitText": "MONTH"
    }
  }
}
```

---

## 11. Navbar Design Rules

### 11A. Desktop Navbar States

| State | Background | Border | Shadow |
|-------|-----------|--------|--------|
| At top (light page) | `bg-white/80 backdrop-blur-xl` | `border-b border-slate-200/60` | none |
| Scrolled (light page) | `bg-white/92 backdrop-blur-xl` | `border-b border-slate-200` | `shadow-sm` |
| At top (dark page) | `bg-transparent` | `border-b border-white/5` | none |
| Scrolled (dark page) | `bg-[#0B0F19]/90 backdrop-blur-xl` | `border-b border-white/10` | subtle |

**Nav link styles (on light navbar):**
```
Default:   text-slate-600 hover:text-slate-900 font-body text-[14px]
Active:    text-slate-900 bg-slate-100 rounded-full px-3 py-1
CTA:       bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 py-2 text-[14px] font-semibold
```

### 11B. Dropdown Panel

```jsx
// Desktop dropdown — always z-[200] to prevent bleed-through
<div className="absolute top-full left-0 pt-2 z-[200] pointer-events-auto">
  <div className="w-[440px] p-4 rounded-2xl bg-white border border-slate-200 shadow-[0_8px_30px_rgba(15,23,42,0.12),0_1px_4px_rgba(15,23,42,0.08)]">
    {/* content */}
  </div>
</div>
```

**Hover bridge** (8px transparent buffer between trigger and panel):
```jsx
// The pt-2 on the absolute wrapper creates the hover bridge
// Also add onMouseEnter/Leave to both the trigger li AND the panel div
```

### 11C. Mobile Drawer

- Full-height (`calc(100vh - 64px)`), `bg-[#0B0F19]` background
- Section accordions (Solutions, Career) with height animation
- Min touch target: `min-h-[44px]` for all tappable rows
- Bottom: full-width blue CTA button

---

## 12. Pre-Deployment Quality Gate

Before any `git push`, verify:

### ✅ Build
- [ ] `npm --prefix frontend run build` → 0 errors, 0 warnings
- [ ] No TypeScript/JSX parse errors in browser console

### ✅ Design
- [ ] No heading using `font-sans` — must be `font-display`
- [ ] All `<img>` have `alt` text
- [ ] All icon-only buttons have `aria-label`
- [ ] Mobile 375px: no horizontal overflow, no text below 15px, all touch targets ≥ 44px
- [ ] Color contrast: WCAG AA (body text on colored backgrounds)
- [ ] No two consecutive sections with same background (light/dark alternation)

### ✅ Performance
- [ ] All images use `optimizeCloudinaryUrl()` from `utils/helpers.js`
- [ ] All API calls use `api/client.js` with the cache layer
- [ ] No `useEffect` without dependency array on data-fetching calls
- [ ] No `console.log` in production code

### ✅ SEO
- [ ] Unique `<title>` and `<meta description>` on every page
- [ ] FAQPage JSON-LD on every service page (6–10 Q&As)
- [ ] H1 matches primary search intent
- [ ] Canonical tag present
- [ ] `sitemap.xml` updated with any new page URLs

### ✅ Forms
- [ ] All required fields validated with error messages
- [ ] Submit button disabled during `submitting` state
- [ ] Success state clearly displayed
- [ ] Error state explains what to do next (WhatsApp fallback link)

---

*Last updated: 2026-11-22. Owner: OpenMNC Engineering Team.*
*Do NOT modify this file without explicit approval from the project lead.*
*This file is loaded by all AI agents working on this codebase as a mandatory pre-task read.*
