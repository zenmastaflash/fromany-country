/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        recoleta: ['var(--font-recoleta)', 'Georgia', 'serif'],
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: '#2E2E2E',
        text: '#FFFDD0',  // Updated cream color
        primary: {
          DEFAULT: '#964734',  // Using accent color as primary
          hover: '#FFFDD0',    // Using cream color for hover
        },
        secondary: {
          DEFAULT: '#024950',
          dark: '#003135',
        },
        accent: {
          DEFAULT: '#0FA4AF',  // Former primary color now as accent
        },
        link: {
          DEFAULT: '#FFFDD0',  // Updated to cream color
          hover: '#964734',    // Using primary color for hover
        },
        border: '#024950',
      },
    },
  },
  plugins: [],
}
