/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        brand: {
          50:'#eef6ff',100:'#daebff',200:'#b9d7ff',300:'#8fbaff',400:'#6297ff',
          500:'#3b82f6',600:'#336de0',700:'#2b59be',800:'#24499a',900:'#1e3a8a'
        }
      },
      borderRadius: { xl:'1rem', '2xl':'1.25rem' },
      boxShadow: { soft:'0 8px 24px rgba(0,0,0,.08)' }
    }
  },
  plugins: [],
}
