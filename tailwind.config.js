/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Surface & Background Tokens — Warm White Creamy Theme
        canvas: "#FAF8F5",
        subtle: "#F5EFEB",
        surface: "#FFFFFF",
        "dark-band": "#EDE4D8",
        "dark-surface": "#FFFFFF",

        // Typography Tokens
        ink: {
          primary: "#1C1917",
          secondary: "#44403C",
          muted: "#78716C",
          "on-dark": "#1C1917",
          "on-dark-muted": "#57534E",
        },

        // Brand & Accent Tokens
        brand: {
          primary: "#2563EB",
          "primary-hover": "#1D4ED8",
          accent: "#D97706",
          "accent-bright": "#2563EB",
        },

        // Borders & Semantic Status
        hairline: "#E7DFD5",
        status: {
          success: "#059669",
        },

        // Backward-Compatibility Tokens (Warm Creamy Defaults — Zero Pitch Black)
        navy: {
          950: "#FAF8F5",
          900: "#F5EFEB",
          800: "#FFFFFF",
        },
        cyan: {
          neon: "#2563EB",
        },
        amber: {
          glow: "#D97706",
        },
        apple: {
          canvas: "#FAF8F5",
          matte: "#F5EFEB",
          surface: "#FFFFFF",
          elevated: "#FFFFFF",
          subtle: "#EDE4D8",
          blue: "#2563EB",
          "blue-deep": "#1D4ED8",
          gray: "#78716C",
          "light-gray": "#A8A29E",
          hairline: "#E7DFD5",
        },
      },

      fontFamily: {
        heading: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        display: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        body: ['"DM Sans"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
        grotesk: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },

      fontSize: {
        // Hero H1 Scale
        "h1-mobile": ["2rem", { lineHeight: "1.08", letterSpacing: "-0.03em", fontWeight: "800" }],
        "h1-tablet": ["2.75rem", { lineHeight: "1.08", letterSpacing: "-0.03em", fontWeight: "800" }],
        "h1-desktop": ["3.5rem", { lineHeight: "1.08", letterSpacing: "-0.03em", fontWeight: "800" }],

        // Section H2 Scale
        "h2-mobile": ["1.625rem", { lineHeight: "1.15", letterSpacing: "-0.025em", fontWeight: "700" }],
        "h2-tablet": ["2.125rem", { lineHeight: "1.15", letterSpacing: "-0.025em", fontWeight: "700" }],
        "h2-desktop": ["2.625rem", { lineHeight: "1.15", letterSpacing: "-0.025em", fontWeight: "700" }],

        // Sub-heading / Card H3 Scale
        "h3-mobile": ["1.25rem", { lineHeight: "1.25", letterSpacing: "-0.015em", fontWeight: "600" }],
        "h3-tablet": ["1.375rem", { lineHeight: "1.25", letterSpacing: "-0.015em", fontWeight: "600" }],
        "h3-desktop": ["1.5rem", { lineHeight: "1.25", letterSpacing: "-0.015em", fontWeight: "600" }],

        // Eyebrow / Kicker
        "eyebrow-mobile": ["0.6875rem", { lineHeight: "1.2", letterSpacing: "0.08em", fontWeight: "600" }],
        "eyebrow-desktop": ["0.75rem", { lineHeight: "1.2", letterSpacing: "0.08em", fontWeight: "600" }],

        // Lead & Body
        "lead-mobile": ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        "lead-tablet": ["1.125rem", { lineHeight: "1.6", fontWeight: "400" }],
        "lead-desktop": ["1.25rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body-mobile": ["0.9375rem", { lineHeight: "1.65", fontWeight: "400" }],
        "body-desktop": ["1rem", { lineHeight: "1.65", fontWeight: "400" }],

        // Small / Meta
        "meta-mobile": ["0.8125rem", { lineHeight: "1.5", fontWeight: "400" }],
        "meta-desktop": ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
      },

      borderRadius: {
        btn: "8px",
        card: "16px",
      },

      keyframes: {
        "mesh-drift": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "33%": { transform: "translate3d(2%, -2%, 0) scale(1.04)" },
          "66%": { transform: "translate3d(-2%, 2%, 0) scale(0.98)" },
        },
      },

      animation: {
        "mesh-drift": "mesh-drift 16s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
