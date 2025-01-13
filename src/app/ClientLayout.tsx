'use client';

import Header from "@/components/Header";
import { SessionProvider } from "next-auth/react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
<div className="min-h-screen bg-gradient-to-br from-secondary/70 via-primary/40 to-accent/60">
  <Header />
        <main>
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}
