'use client';

import Header from "@/components/Header";
import { SessionProvider } from "next-auth/react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-secondary relative overflow-hidden">
        {/* Base radial gradient background */}
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--accent-color)_0%,_var(--primary-color)_45%,_var(--secondary-color)_100%)]"
          style={{
            '--accent-color': '#964734',
            '--primary-color': '#0FA4AF',
            '--secondary-color': '#024950'
          } as React.CSSProperties}
        />

        {/* Ripple animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="circle circle-7 bg-secondary" />
          <div className="circle circle-6 bg-secondary/90" />
          <div className="circle circle-5 bg-primary/90" />
          <div className="circle circle-4 bg-primary" />
          <div className="circle circle-3 bg-primary/90" />
          <div className="circle circle-2 bg-accent/90" />
          <div className="circle circle-1 bg-accent" />
        </div>

        {/* Content container with higher z-index */}
        <div className="relative z-10 min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
        </div>

        <style jsx>{`
          .circle {
            position: absolute;
            border-radius: 50%;
            width: 100vw;
            height: 100vw;
            right: -50vw;
            bottom: -50vw;
            transform-origin: center center;
            opacity: 0;
          }

          .circle-1 { animation: ripple1 8s cubic-bezier(0.4, 0.0, 0.2, 1) forwards; }
          .circle-2 { animation: ripple2 8.4s cubic-bezier(0.4, 0.0, 0.2, 1) forwards; }
          .circle-3 { animation: ripple3 8.8s cubic-bezier(0.4, 0.0, 0.2, 1) forwards; }
          .circle-4 { animation: ripple4 9.2s cubic-bezier(0.4, 0.0, 0.2, 1) forwards; }
          .circle-5 { animation: ripple5 9.6s cubic-bezier(0.4, 0.0, 0.2, 1) forwards; }
          .circle-6 { animation: ripple6 10s cubic-bezier(0.4, 0.0, 0.2, 1) forwards; }
          .circle-7 { animation: ripple7 10.4s cubic-bezier(0.4, 0.0, 0.2, 1) forwards; }

          @keyframes ripple1 {
            0% { transform: scale(0); opacity: 1; }
            75% { transform: scale(1.3); opacity: 0.7; }
            100% { transform: scale(1.4); opacity: 0; }
          }

          @keyframes ripple2 {
            0% { transform: scale(0); opacity: 1; }
            75% { transform: scale(1.5); opacity: 0.7; }
            100% { transform: scale(1.6); opacity: 0; }
          }

          @keyframes ripple3 {
            0% { transform: scale(0); opacity: 1; }
            75% { transform: scale(1.7); opacity: 0.7; }
            100% { transform: scale(1.8); opacity: 0; }
          }

          @keyframes ripple4 {
            0% { transform: scale(0); opacity: 1; }
            75% { transform: scale(1.9); opacity: 0.7; }
            100% { transform: scale(2.0); opacity: 0; }
          }

          @keyframes ripple5 {
            0% { transform: scale(0); opacity: 1; }
            75% { transform: scale(2.1); opacity: 0.7; }
            100% { transform: scale(2.2); opacity: 0; }
          }

          @keyframes ripple6 {
            0% { transform: scale(0); opacity: 1; }
            75% { transform: scale(2.3); opacity: 0.7; }
            100% { transform: scale(2.4); opacity: 0; }
          }

          @keyframes ripple7 {
            0% { transform: scale(0); opacity: 1; }
            75% { transform: scale(2.5); opacity: 0.7; }
            100% { transform: scale(2.6); opacity: 0; }
          }
        `}</style>
      </div>
    </SessionProvider>
  );
}
