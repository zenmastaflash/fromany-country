'use client';

import Header from "@/components/Header";
import { SessionProvider } from "next-auth/react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Header />
      <main className="container mx-auto p-4">
        {children}
      </main>
    </SessionProvider>
  );
}
