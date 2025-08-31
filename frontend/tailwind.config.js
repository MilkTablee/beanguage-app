/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6', // This is the blue-500 color
        'primary-dark': '#2563eb', // This is the blue-600 for hover
      },
    },
  },
  plugins: [],
}
