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
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(30px, -30px) scale(1.1)' },
        },
      },
      animation: {
        'float-slow': 'float 20s ease-in-out infinite',
        'float-slower': 'float 25s ease-in-out infinite',
        'float-slowest': 'float 30s ease-in-out infinite',
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
