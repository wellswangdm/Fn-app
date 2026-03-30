/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0f4ff',
          100: '#dde5ff',
          200: '#c3cfff',
          300: '#9baeff',
          400: '#7080ff',
          500: '#4a53fa',
          600: '#3432ef',
          700: '#2a26d4',
          800: '#2523ab',
          900: '#252488',
        },
      },
    },
  },
  plugins: [],
}
