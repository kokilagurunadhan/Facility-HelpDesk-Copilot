/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // <--- CRITICAL: This tells Tailwind to style your StatCard, RequestTable, etc.
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
