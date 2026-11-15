# OpenMNC Public Website & 3D Experience (`openmnc-frontend`)

The official high-performance public website, 3D interactive experience, candidate careers portal, and programmatic SEO blog for **OpenMNC LLP**.

---

## 🚀 Tech Stack

- **Framework:** React 18 + Vite (SPA / SSG Ready)
- **Styling:** Tailwind CSS (Dark Futuristic Aesthetic: Deep Navy, Electric Cyan, Neon Amber)
- **3D Graphics & Visuals:** Three.js + React Three Fiber (`@react-three/fiber`) + React Three Drei (`@react-three/drei`)
- **Animations:** Framer Motion (3D Tilt Cards, Scroll Reveals)
- **Form Handling:** React Hook Form
- **API Client:** Axios
- **SEO & AI Bot Visibility:** Dynamic JSON-LD structured data (Article, JobPosting, Organization, Sitelinks) + `robots.txt` + `sitemap.xml`
- **Hosting:** Vercel

---

## 📁 Repository Structure

```
frontend/
├── public/             # Static assets, sitemap.xml, robots.txt, icons
├── src/
│   ├── api/            # API connectors for public endpoints
│   │   ├── client.js   # Central Axios client
│   │   ├── blogs.js    # Public blog readers
│   │   ├── careers.js  # Job listings & resume link submission
│   │   └── services.js # Dynamic service catalog reader
│   ├── components/     # UI design system & 3D components
│   │   ├── Navbar.jsx          # Futuristic glassmorphic navigation
│   │   ├── Footer.jsx          # Comprehensive footer & legal links
│   │   ├── ThreeBackground.jsx # Real-time Three.js interactive 3D particle canvas
│   │   ├── GlowButton.jsx      # Cyberpunk neon CTA button
│   │   ├── ScrollReveal.jsx    # Framer Motion intersection observer
│   │   ├── SectionHeader.jsx   # Consistent typography headers
│   │   ├── ServiceCard.jsx     # 3D interactive service showcase card
│   │   └── StatCounter.jsx     # Dynamic animated KPI counter
│   ├── pages/          # Public marketing & application pages
│   │   ├── Home.jsx               # Hero, 6 core verticals, 3D interactive, testimonials
│   │   ├── About.jsx              # Company story, leadership, values, metrics
│   │   ├── Services.jsx           # Deep dive into all 6 business verticals
│   │   ├── Careers.jsx            # Job openings + Zero-storage Google Drive resume form
│   │   ├── ApplicationTracker.jsx # Candidate real-time application tracker
│   │   ├── Blog.jsx               # AI-optimized programmatic blog index
│   │   ├── BlogPost.jsx           # Article view with JSON-LD schema injection
│   │   └── Contact.jsx            # Multi-channel inquiry form with AI source attribution
│   ├── utils/          # Schema generators (jsonld.js) & formatters (helpers.js)
│   ├── App.jsx         # Public routing
│   ├── index.css       # Tailwind base, neon glow animations, fonts
│   └── main.jsx        # Application bootstrap
├── package.json
├── vite.config.js
├── tailwind.config.js
├── vercel.json
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file for local development:

| Variable Name | Required | Description |
|---|---|---|
| `VITE_API_URL` | **Yes (in production)** | Base URL of the backend API (e.g. `https://openmnc-backend.onrender.com/api`). In local development, leave empty to use Vite's internal proxy. |

---

## 🛠️ Local Development & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```
Generates production-ready, minified bundles into the `dist/` directory.

---

## 🧪 Testing & Verification

1. Verify build compiles with zero errors:
   ```bash
   npm run build
   ```
2. Verify all 8 public pages load and render correctly.
3. Test the contact form and careers application flow against the backend API.

---

## 🚢 Deployment (Vercel)

1. Connect this repository (`openmnc-frontend`) to **Vercel**.
2. Framework Preset: **Vite**.
3. Environment Variables:
   - Add `VITE_API_URL` = `https://openmnc-backend.onrender.com/api`
4. Root Directory: `./`
5. Click **Deploy**.
