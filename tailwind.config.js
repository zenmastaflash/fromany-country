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
        salisbury: ['var(--font-salisbury)'],
        inter: ['var(--font-inter)'],
      },
      colors: {
        // Your existing color configuration
        background: '#2E2E2E',
        text: '#F0F0F0',
        primary: {
          DEFAULT: '#0FA4AF',
          hover: '#AFDDE5',
        },
        secondary: {
          DEFAULT: '#024950',
          dark: '#003135',
        },
        accent: {
          DEFAULT: '#964734',
        },
        link: {
          DEFAULT: '#AFDDE5',
          hover: '#0FA4AF',
        },
        border: '#024950',
      },
    },
  },
  plugins: [],
}
