import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

export const recoleta = localFont({
  src: '../../public/fonts/recoleta-regulardemo.otf',
  variable: '--font-recoleta',
  display: 'swap',
  declarations: [
    {
      prop: 'font-family',
      value: 'Recoleta DEMO'
    }
  ]
})

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})
