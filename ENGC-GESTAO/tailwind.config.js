/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
            DEFAULT: '#0ea5e9',
            foreground: '#ffffff'
        },
        secondary: '#64748b',
        background: '#f8fafc',
      }
    },
  },
  plugins: [],
}
