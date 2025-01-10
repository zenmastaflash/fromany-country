import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

// Inter configuration with proper weight ranges
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  // Adding common weights
  weight: ['400', '500', '600', '700'],
})

// Updated Recoleta configuration
export const recoleta = localFont({
  src: [{
    path: '../../public/fonts/Recoleta Regular.otf',
    weight: '400',
    style: 'normal'
  }],
  variable: '--font-recoleta',
  display: 'swap',
})
