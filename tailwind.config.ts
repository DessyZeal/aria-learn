import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          DEFAULT: '#1a7a4a',
          light:   '#25a864',
          pale:    '#e6f7ee',
          dark:    '#0f1f17',
        },
        gold: {
          DEFAULT: '#f0a500',
          pale:    '#fff8e8',
          dark:    '#b07800',
        },
        muted:  '#5a7a66',
        body:   '#f4fbf7',
        text:   '#1a2e22',
        purple: '#6c4fc7',
        blue:   '#2176c7',
        danger: '#e84040',
        border: '#d4ece0',
      },
      fontFamily: {
        baloo:  ['var(--font-baloo)',  'cursive'],
        nunito: ['var(--font-nunito)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
