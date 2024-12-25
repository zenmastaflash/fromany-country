import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { SessionProvider } from "next-auth/react"; // Import SessionProvider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "fromany.country",
  description: "Live Anywhere, Belong Everywhere",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider> {/* Wrap your app with SessionProvider */}
          <Header />
          <main className="container mx-auto p-4">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
