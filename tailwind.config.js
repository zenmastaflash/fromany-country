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
        'fac': {
          'background': '#003135',
          'dark': '#024950',
          'accent': '#964734',
          'primary': '#0FA4AF',
          'light': '#AFDDE5',
          'text': '#F0F0F0',
        }
      },
    },
  },
  plugins: [],
}
