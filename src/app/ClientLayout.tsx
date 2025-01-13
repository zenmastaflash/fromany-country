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
        <div className="absolute inset-0 overflow-hidden">
          <div className="circle circle-7 bg-secondary" />
          <div className="circle circle-6 bg-secondary/90" />
          <div className="circle circle-5 bg-primary/90" />
          <div className="circle circle-4 bg-primary" />
          <div className="circle circle-3 bg-primary/90" />
          <div className="circle circle-2 bg-accent/90" />
          <div className="circle circle-1 bg-accent" />
        </div>

        <Header />
        <main>
          {children}
        </main>

        <style jsx>{`
          .circle {
            position: absolute;
            border-radius: 50%;
            animation: ripple 15s infinite;
            transform-origin: center center;
            pointer-events: none;
          }

          .circle-1 {
            width: 100vw;
            height: 100vw;
            right: -50vw;
            bottom: -50vw;
            animation-delay: 0s;
          }

          .circle-2 {
            width: 120vw;
            height: 120vw;
            right: -60vw;
            bottom: -60vw;
            animation-delay: 0.2s;
          }

          .circle-3 {
            width: 140vw;
            height: 140vw;
            right: -70vw;
            bottom: -70vw;
            animation-delay: 0.4s;
          }

          .circle-4 {
            width: 160vw;
            height: 160vw;
            right: -80vw;
            bottom: -80vw;
            animation-delay: 0.6s;
          }

          .circle-5 {
            width: 180vw;
            height: 180vw;
            right: -90vw;
            bottom: -90vw;
            animation-delay: 0.8s;
          }

          .circle-6 {
            width: 200vw;
            height: 200vw;
            right: -100vw;
            bottom: -100vw;
            animation-delay: 1.0s;
          }

          .circle-7 {
            width: 220vw;
            height: 220vw;
            right: -110vw;
            bottom: -110vw;
            animation-delay: 1.2s;
          }

          @keyframes ripple {
            0% {
              transform: scale(0.8);
              opacity: 1;
            }
            
            50% {
              transform: scale(1.3);
              opacity: 0.5;
            }
            
            100% {
              transform: scale(0.8);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    </SessionProvider>
  );
}
