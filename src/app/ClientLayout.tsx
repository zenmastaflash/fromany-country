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
            transform-origin: center center;
            pointer-events: none;
            opacity: 0;
            animation: appear 0.5s ease-out forwards;
          }

          .circle-1 {
            width: 100vw;
            height: 100vw;
            right: -50vw;
            bottom: -50vw;
            animation: ripple1 8s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
          }

          .circle-2 {
            width: 120vw;
            height: 120vw;
            right: -60vw;
            bottom: -60vw;
            animation: ripple2 8.4s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
          }

          .circle-3 {
            width: 140vw;
            height: 140vw;
            right: -70vw;
            bottom: -70vw;
            animation: ripple3 8.8s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
          }

          .circle-4 {
            width: 160vw;
            height: 160vw;
            right: -80vw;
            bottom: -80vw;
            animation: ripple4 9.2s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
          }

          .circle-5 {
            width: 180vw;
            height: 180vw;
            right: -90vw;
            bottom: -90vw;
            animation: ripple5 9.6s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
          }

          .circle-6 {
            width: 200vw;
            height: 200vw;
            right: -100vw;
            bottom: -100vw;
            animation: ripple6 10s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
          }

          .circle-7 {
            width: 220vw;
            height: 220vw;
            right: -110vw;
            bottom: -110vw;
            animation: ripple7 10.4s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
          }

          @keyframes appear {
            0% {
              opacity: 0;
              transform: scale(0.8);
            }
            100% {
              opacity: 1;
              transform: scale(0.8);
            }
          }

          @keyframes ripple1 {
            0% { transform: scale(0.8); opacity: 1; }
            75% { transform: scale(1.3); opacity: 0.7; }
            100% { transform: scale(1.5); opacity: 0; }
          }

          @keyframes ripple2 {
            0% { transform: scale(0.8); opacity: 1; }
            75% { transform: scale(1.32); opacity: 0.7; }
            100% { transform: scale(1.52); opacity: 0; }
          }

          @keyframes ripple3 {
            0% { transform: scale(0.8); opacity: 1; }
            75% { transform: scale(1.34); opacity: 0.7; }
            100% { transform: scale(1.54); opacity: 0; }
          }

          @keyframes ripple4 {
            0% { transform: scale(0.8); opacity: 1; }
            75% { transform: scale(1.36); opacity: 0.7; }
            100% { transform: scale(1.56); opacity: 0; }
          }

          @keyframes ripple5 {
            0% { transform: scale(0.8); opacity: 1; }
            75% { transform: scale(1.38); opacity: 0.7; }
            100% { transform: scale(1.58); opacity: 0; }
          }

          @keyframes ripple6 {
            0% { transform: scale(0.8); opacity: 1; }
            75% { transform: scale(1.4); opacity: 0.7; }
            100% { transform: scale(1.6); opacity: 0; }
          }

          @keyframes ripple7 {
            0% { transform: scale(0.8); opacity: 1; }
            75% { transform: scale(1.42); opacity: 0.7; }
            100% { transform: scale(1.62); opacity: 0; }
          }
        `}</style>
      </div>
    </SessionProvider>
  );
}
