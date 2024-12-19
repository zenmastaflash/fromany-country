import './globals.css';
import { Providers } from '@/components/providers';

export const metadata = {
  title: 'fromany.country - Your Global Life, Simplified',
  description: 'Manage your digital nomad lifestyle with ease'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}