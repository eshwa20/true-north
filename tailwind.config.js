// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Alora brand colors
        plum: '#23151B',
        rose: '#7C3B65',
        'rose-light': '#9b5a84',
        blush: '#D5B2CD',
        cream: '#e6d6e2',
        'pink-white': '#f5f2f4',
        deep: '#3A1C31',
        'card-dark': '#2A1823',
        muted: '#bfa5b7',
        'text-soft': '#8a6f7f',
        
        // Additional shades for gradients
        'rose-dark': '#5a2a4a',
        'plum-light': '#3a2530',
      },
    },
  },
  plugins: [],
}