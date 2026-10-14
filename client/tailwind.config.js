/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // SmartHire Exact Primary Blue Palette
        blue: {
          100: '#E6F7FF',
          200: '#D6F1FF',
          300: '#B0E1FF',
          400: '#75BEFF',
          500: '#2E90FA',
          600: '#0E61BA',
          700: '#003E81',
          800: '#002854',
        },
        // SmartHire Neutral Palette
        surface: {
          bg: '#F5F9FD',
          card: '#FFFFFF',
        },
        content: {
          primary: '#17324D',
          secondary: '#64748B',
        },
        brandBorder: {
          DEFAULT: '#DCE7F2',
          light: '#E6F0F8',
          dark: '#B0CDE5',
        },
        // Restrained status colors
        status: {
          success: '#10B981',
          'success-bg': '#ECFDF5',
          'success-border': '#A7F3D0',
          warning: '#F59E0B',
          'warning-bg': '#FFFBEB',
          'warning-border': '#FDE68A',
          error: '#EF4444',
          'error-bg': '#FEF2F2',
          'error-border': '#FECACA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 40, 84, 0.05), 0 1px 2px 0 rgba(0, 40, 84, 0.03)',
        card: '0 4px 6px -1px rgba(0, 40, 84, 0.05), 0 2px 4px -1px rgba(0, 40, 84, 0.03)',
        hover: '0 10px 15px -3px rgba(0, 40, 84, 0.08), 0 4px 6px -2px rgba(0, 40, 84, 0.04)',
      },
    },
  },
  plugins: [],
}
