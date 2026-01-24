/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#f7f7f8',
          100: '#eeeef1',
          200: '#d9d9e0',
          300: '#b8b9c4',
          400: '#9192a3',
          500: '#737488',
          600: '#5d5e70',
          700: '#4c4d5c',
          800: '#41424e',
          900: '#393a43',
          950: '#1a1a24',
        },
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        background: {
          primary: '#0a0a0f',
          secondary: '#121218',
          tertiary: '#1a1a24',
        },
        score: {
          excellent: '#22c55e',
          good: '#84cc16',
          fair: '#eab308',
          poor: '#f97316',
          critical: '#ef4444',
        },
      },
      backdropBlur: {
        glass: '16px',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        glow: '0 0 20px rgba(59, 130, 246, 0.3)',
      },
      borderRadius: {
        card: '16px',
      },
    },
  },
  plugins: [],
};
