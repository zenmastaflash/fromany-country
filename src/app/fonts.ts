import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

export const recoleta = localFont({
  src: [
    {
      path: '../../public/fonts/Recoleta Regular.otf',
      weight: '400',
      style: 'normal'
    }
  ],
  variable: '--font-recoleta',
  display: 'swap',
  preload: true,
  fallback: ['Georgia', 'serif']
})

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})
