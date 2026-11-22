/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          canvas: '#000000',
          matte: '#0a0a0c',
          surface: '#161618',
          elevated: '#1c1c1e',
          subtle: '#2c2c2e',
          blue: '#2997ff',
          'blue-deep': '#0071e3',
          gray: '#86868b',
          'light-gray': '#a1a1a6',
          hairline: 'rgba(255, 255, 255, 0.10)',
        },
        navy: {
          950: '#000000',
          900: '#0a0a0c',
          800: '#161618',
        },
        cyan: {
          neon: '#2997ff',
        },
        amber: {
          glow: '#ff9500',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        sans:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
        grotesk: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(180deg, #000000 0%, #0a0a0c 50%, #161618 100%)',
      },
      boxShadow: {
        'liquid-glass': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.28), 0 20px 50px -12px rgba(0, 0, 0, 0.65), 0 4px 16px -4px rgba(0, 0, 0, 0.4)',
        'liquid-glass-light': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.85), inset 0 -1px 0 0 rgba(0, 0, 0, 0.04), 0 12px 40px -10px rgba(0, 0, 0, 0.12)',
        'surface': '0 4px 20px rgba(0, 0, 0, 0.35)',
        'cyan-glow': '0 0 20px rgba(41, 151, 255, 0.25)',
        'cyan-glow-sm': '0 0 10px rgba(41, 151, 255, 0.15)',
        'amber-glow': '0 0 20px rgba(255, 149, 0, 0.25)',
      },
      transitionTimingFunction: {
        'apple-ease': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      animation: {
        'float': 'float 6s cubic-bezier(0.22, 1, 0.36, 1) infinite',
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
