/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Base colors
        background: '#2E2E2E',
        text: '#F0F0F0',
        
        // Semantic colors
        primary: {
          DEFAULT: '#0FA4AF',  // Primary buttons
          hover: '#AFDDE5',    // Hover state
        },
        secondary: {
          DEFAULT: '#024950',  // Secondary buttons
          dark: '#003135',     // Header/Footer & background accents
        },
        accent: {
          DEFAULT: '#964734',  // Notifications & highlights
        },
        link: {
          DEFAULT: '#AFDDE5',  // Links and icons
          hover: '#0FA4AF',    // Link hover state
        },
        border: '#024950',     // Borders and dividers
      },
    },
  },
  plugins: [],
}
