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
  // Base colors
  background: '#2E2E2E',
  text: '#fcfbdc',
  
  // Semantic colors
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
    hover: '#fcfbdc',    
  },
  border: '#024950',
},
    },
  },
  plugins: [],
}
