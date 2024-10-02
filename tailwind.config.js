/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        '90': '22.5rem', // 90
        '100': '25rem',  // 100
        '160': '40rem',  // 160, por exemplo
      },
      colors: {
        primaryGreen: '#72cb26', // Define a cor verde primário
      },
    },
  },
  plugins: [],
}