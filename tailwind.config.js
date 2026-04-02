/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#EFF4F9',
          100: '#D6E4F0',
          200: '#ADC9E3',
          300: '#7EA8D1',
          400: '#5288BB',
          500: '#3368A4',
          600: '#265186',
          700: '#1C3E6E',
          800: '#122A4E',
          900: '#0A1A32',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
