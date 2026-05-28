/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          DEFAULT: '#1a7a4a',
          light: '#25a864',
          pale: '#e6f7ee',
        },
        gold: {
          DEFAULT: '#f0a500',
          pale: '#fff8e8',
          dark: '#b07800',
        },
        dark: '#0f1f17',
        muted: '#5a7a66',
      },
      fontFamily: {
        baloo: ['"Baloo 2"', 'cursive'],
        nunito: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
