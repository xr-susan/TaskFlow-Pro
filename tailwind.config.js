/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#ffffff',
          secondary: '#f8f9fb',
          tertiary: '#f1f3f7',
        },
        accent: {
          DEFAULT: '#635bff',
          hover: '#524ce0',
          muted: 'rgba(99, 91, 255, 0.08)',
        },
        success: { DEFAULT: '#1a9e6e', muted: '#e8f7f0' },
        warning: { DEFAULT: '#d98c00', muted: '#fef7e8' },
        danger:  { DEFAULT: '#d92d20', muted: '#fde8e8' },
        neutral: {
          50:  '#f8f9fb',
          100: '#f1f3f7',
          200: '#e2e5ed',
          300: '#c9cdd8',
          400: '#9ca2b1',
          500: '#6e7585',
          600: '#4e5562',
          700: '#3b4050',
          800: '#272b36',
          900: '#171a21',
        },
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.08)',
        'elevated': '0 8px 24px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.06)',
        'modal': '0 16px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}
