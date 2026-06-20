/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'bg-page': '#07080f',
        'bg-device': '#0e1018',
        'bg-tile': '#12141f',
        border: '#1c1f2e',
        'text-primary': '#e8eaf2',
        'text-muted': '#4a5280',
        accent: '#3b6fd4',
        'score-green': '#22c55e',
        'score-amber': '#f59e0b',
        'score-red': '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
