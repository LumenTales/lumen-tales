/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#7BA9FF',
          DEFAULT: '#4C87E6',
          dark: '#2A3B8F',
        },
        secondary: {
          light: '#E0E5FF',
          DEFAULT: '#5F9AE6',
          dark: '#2C75D8',
        },
        accent: {
          DEFAULT: '#FFD700',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-merriweather)', 'serif'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 3s infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: 0.7 },
          '50%': { opacity: 0.9 },
        },
      },
    },
  },
  plugins: [],
} 