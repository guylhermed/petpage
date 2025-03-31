/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-main)'],
      },
      height: {
        90: '22.5rem',
        100: '25rem',
        160: '40rem',
      },
      colors: {
        primaryPurple: '#5c00c8',
        primaryPurple50: '#a664ff',
        primaryBlue: '#02b5aa',
        primaryGray: '#989898',
        backgroundColor: '#ececec',
      },
    },
  },
  plugins: [],
};
