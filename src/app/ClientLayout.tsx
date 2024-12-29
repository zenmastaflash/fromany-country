'use client';

import Header from "@/components/Header";
import { SessionProvider } from "next-auth/react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Header />
<main className="min-h-screen bg-gradient-to-b from-background via-secondary/30 to-secondary/50">
  <div className="container mx-auto p-4">
    {children}
  </div>
</main>
    </SessionProvider>
  );
}
