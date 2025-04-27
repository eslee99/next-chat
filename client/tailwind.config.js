/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      'dark-primary': '#131a1c',
      'dark-secondary': '#1b2224',
      red: '#e74c4c',
      green: '#6bb05d',
      blue: '#0183ff',
      grey: '#dddfe2',
      white: '#fff',
      'zinc-100': '#f4f4f5',
      'zinc-200': '#e4e4e7',
      'slate-secondary': '#64748b',
    },
    extend: {
      backgroundImage: {
        'linear-to-t': 'linear-gradient(to top, #38bdf8, #6366f1)', // Sky to Indigo
      },
    },
  },
  plugins: [],
}

