/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#EE2B34', // Rojo VibeMarket
          foreground: '#FFFFFF',
          50: '#FEE5E7',
          100: '#FCCCD0',
          200: '#FA99A0',
          300: '#F76671',
          400: '#F53341',
          500: '#EE2B34',
          600: '#D11E26',
          700: '#9F171D',
          800: '#6D0F14',
          900: '#3B080A',
        },
        secondary: {
          DEFAULT: '#8B5CF6', // Violeta Vibe
          foreground: '#FFFFFF',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        accent: {
          DEFAULT: '#FACC15', // Amarillo Ofertas
          gold: '#FFD700',
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#FACC15',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        background: {
          light: '#F8F6F6',
          dark: '#181111',
          'dark-warm': '#221011',
          'dark-cool': '#191022',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#221011',
        },
        text: {
          main: '#181111',
          light: '#6B7280',
          dark: '#F8F6F6',
        },
      },
      fontFamily: {
        // Fuentes distintivas y profesionales
        display: ['DM Sans', 'system-ui', 'sans-serif'], // Para títulos y headings
        body: ['IBM Plex Sans', 'system-ui', 'sans-serif'], // Para texto del cuerpo
        mono: ['JetBrains Mono', 'monospace'], // Para código y precios
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      boxShadow: {
        'vibe': '0 4px 14px 0 rgba(238, 43, 52, 0.15)',
        'vibe-lg': '0 10px 40px 0 rgba(238, 43, 52, 0.2)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 20px 0 rgba(0, 0, 0, 0.1), 0 4px 6px 0 rgba(0, 0, 0, 0.05)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-primary': 'radial-gradient(at 40% 20%, rgba(238, 43, 52, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(139, 92, 246, 0.15) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(250, 204, 21, 0.15) 0px, transparent 50%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}