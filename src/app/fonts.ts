import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

export const salisbury = localFont({
  src: '../../public/fonts/SalisburyBold.ttf',
  variable: '--font-salisbury',
  display: 'swap',
})

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})
