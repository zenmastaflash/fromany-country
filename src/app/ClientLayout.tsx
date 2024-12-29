'use client';

import Header from "@/components/Header";
import { SessionProvider } from "next-auth/react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
  <div className="min-h-screen bg-gradient-to-br from-background via-secondary/50 to-accent/50">
    <Header />
    <main>
      {children}
    </main>
  </div>
</SessionProvider>
    </SessionProvider>
  );
}
