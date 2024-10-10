/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/react-responsive-iframe-viewer/**/*.{js,ts,jsx,tsx,html}',
    '!**/node_modules/**',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
