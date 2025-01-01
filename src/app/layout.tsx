import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout"; // Import the client component

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: "200"
});

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
      <body className={montserrat.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
