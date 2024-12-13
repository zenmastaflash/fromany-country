import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import Header from '@/components/navigation/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'fromany.country',
  description: 'Document management for digital nomads',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}