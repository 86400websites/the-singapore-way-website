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
          red: '#C8102E',
          black: '#111111',
          white: '#FFFFFF',
          gray: '#F5F5F5',
          darkgray: '#333333',
          midgray: '#666666',
          lightgray: '#E5E5E5',
        }
      },
      fontFamily: {
        sans: ['Libre Baskerville', 'Georgia', 'Times New Roman', 'serif'],
        serif: ['Libre Baskerville', 'Georgia', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
}
