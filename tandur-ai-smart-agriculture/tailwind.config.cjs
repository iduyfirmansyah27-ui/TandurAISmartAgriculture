/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
      },
    },
  },
  plugins: [],
};
