import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#EE2B34', // Rojo VibeMarket
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#8B5CF6', // Violeta Vibe
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#FACC15', // Amarillo Ofertas
          gold: '#FFD700',    // Oro Perfil
        },
        background: {
          light: '#F8F6F6',   // Fondo Claro
          dark: '#181111',    // Fondo Oscuro Principal
          'dark-warm': '#221011',
          'dark-cool': '#191022',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#221011',
        },
        text: {
          main: '#181111',
        }
      },
    },
  },
  plugins: [],
};
export default config;