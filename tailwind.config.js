/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0a0e1a',
          900: '#0d1226',
          800: '#111827',
        },
        cyan: {
          neon: '#00f5ff',
        },
        amber: {
          glow: '#ff9500',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Orbitron', 'Space Grotesk', 'sans-serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #0a0e1a 0%, #0d1226 50%, #000000 100%)',
      },
      boxShadow: {
        'cyan-glow': '0 0 20px rgba(0, 245, 255, 0.3), 0 0 40px rgba(0, 245, 255, 0.1)',
        'cyan-glow-sm': '0 0 10px rgba(0, 245, 255, 0.2)',
        'amber-glow': '0 0 20px rgba(255, 149, 0, 0.3), 0 0 40px rgba(255, 149, 0, 0.1)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glowPulse: {
          '0%': { boxShadow: '0 0 10px rgba(0, 245, 255, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(0, 245, 255, 0.5)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
