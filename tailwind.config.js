/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1.5rem",
      },
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc5fb',
          400: '#36a9f7',
          500: '#0d8de3',
          600: '#0070cc',
          700: '#0059a6',
          800: '#064b88',
          900: '#0a3f71',
          950: '#072a4e',
        },
        secondary: {
          50: '#f2f7fd',
          100: '#e5eefa',
          200: '#c5ddf5',
          300: '#92c1ec',
          400: '#5aa0df',
          500: '#3682d1',
          600: '#2668c0',
          700: '#2053a0',
          800: '#1f4684',
          900: '#1e3c6d',
          950: '#152649',
        },
        accent: {
          50: '#fff8ed',
          100: '#ffefd4',
          200: '#ffdba8',
          300: '#ffc070',
          400: '#ff9a36',
          500: '#ff7d0e',
          600: '#f05d04',
          700: '#c74206',
          800: '#9e330e',
          900: '#802c0f',
          950: '#451304',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 15px rgba(102, 153, 255, 0.5)',
      },
      animation: {
        blob: 'blob 7s infinite',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
      },
    },
  },
  plugins: [],
}; 