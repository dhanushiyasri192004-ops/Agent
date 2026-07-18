/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forge: {
          dark: '#0a1628',      // Dark navy sidebar/background
          darker: '#060e1a',    // Ultra-dark background
          card: '#0f2440',      // Sidebar active hover / dark card
          gold: '#d9a32c',      // Accent color gold/yellow
          goldHover: '#c18f23', // Gold hover shade
          accent: '#1e3c72',    // Vibrant gradient blue
          grayText: '#94a3b8',  // Cool gray text
          lightBg: '#f8fafc',   // Soft background for light areas
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
