import React from 'react';
import { Card } from '@/components/ui/Card';

const BackgroundTest: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold text-text">Background Animation Tests</h2>
      
      <Card className="relative overflow-hidden h-[80vh] bg-transparent">
        {/* Ripple circles */}
        <div className="absolute w-full h-full">
          {/* Largest to smallest, secondary -> primary -> accent */}
          <div className="circle circle-5 bg-secondary/90" />
          <div className="circle circle-4 bg-secondary/80" />
          <div className="circle circle-3 bg-primary/70" />
          <div className="circle circle-2 bg-primary/60" />
          <div className="circle circle-1 bg-accent" /> {/* Accent at full opacity */}
        </div>
        
        <div className="relative z-10 p-6">
          <h3 className="text-lg font-semibold text-text">Ripple Effect</h3>
          <p className="text-link mt-2">Expanding circles with color transition</p>
        </div>

        <style jsx>{`
          .circle {
            position: absolute;
            border-radius: 50%;
            animation: ripple 15s infinite;
          }

          .circle-1 {
            width: 100vw;
            height: 100vw;
            right: -20vw;
            bottom: -20vw;
            animation-delay: 0s;
          }

          .circle-2 {
            width: 120vw;
            height: 120vw;
            right: -25vw;
            bottom: -25vw;
            animation-delay: 0.3s;
          }

          .circle-3 {
            width: 140vw;
            height: 140vw;
            right: -30vw;
            bottom: -30vw;
            animation-delay: 0.6s;
          }

          .circle-4 {
            width: 160vw;
            height: 160vw;
            right: -35vw;
            bottom: -35vw;
            animation-delay: 0.9s;
          }

          .circle-5 {
            width: 180vw;
            height: 180vw;
            right: -40vw;
            bottom: -40vw;
            animation-delay: 1.2s;
          }

          @keyframes ripple {
            0% {
              transform: scale(0.8);
            }
            
            50% {
              transform: scale(1.3);
            }
            
            100% {
              transform: scale(0.8);
            }
          }
        `}</style>
      </Card>
    </div>
  );
};

export default BackgroundTest;
