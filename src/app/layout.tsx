import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { recoleta, inter } from './fonts';

export const metadata: Metadata = {
  title: "from any country",
  description: "Live Anywhere, Belong Everywhere",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${recoleta.variable} font-inter`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
