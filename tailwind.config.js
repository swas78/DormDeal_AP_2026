/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f7f6fb',
          100: '#efedf7',
          200: '#ded9f0',
          300: '#c3bae5',
          400: '#a393d6',
          500: '#826bc4',
          600: '#6a4eb2',
          700: '#583f98',
          800: '#49357d',
          900: '#3e2e68',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
