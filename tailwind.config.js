/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7fa',
          100: '#ebeef3',
          500: '#2C3E50',
          600: '#243442',
          700: '#1a252f',
          800: '#15202b',
          900: '#0f1419'
        },
        secondary: {
          50: '#f0f8ff',
          100: '#e0f1fe',
          500: '#3498DB',
          600: '#2980b9',
          700: '#1f69a0',
          800: '#1a5490',
          900: '#164478'
        },
        accent: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#E74C3C',
          600: '#dc3545',
          700: '#c82333',
          800: '#a71e2a',
          900: '#8b1a1a'
        },
        surface: {
          50: '#fafbfc',
          100: '#f5f6f7',
          200: '#ECF0F1',
          300: '#d5d9db',
          400: '#95a5a6',
          500: '#7f8c8d',
          600: '#6c7b7d',
          700: '#5a6769',
          800: '#485254',
          900: '#34393b'
        }
      },
      fontFamily: {
        'display': ['Poppins', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      boxShadow: {
        'document': '0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 8px rgba(0, 0, 0, 0.06)',
        'toolbar': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'card': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'float': '0 8px 25px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scale-in': 'scaleIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}