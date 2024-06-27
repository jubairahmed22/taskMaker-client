/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      backgroundColor: {
        'white-99': 'F8F5F1',
        'hex-99': '#53624e',
        'hex-142': '#e0e1df'
      },
      colors: {
        'custom-dark': '#1a1b1a',
      },
      fontFamily: {
        marcellus: ['Marcellus', 'serif'],
        jost: ['Jost', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
