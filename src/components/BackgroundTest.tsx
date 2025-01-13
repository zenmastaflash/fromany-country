import React from 'react';
import { Card } from '@/components/ui/Card';

const BackgroundTest: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold text-text">Background Animation Tests</h2>
      
      <Card className="relative overflow-hidden h-[80vh] bg-secondary">
        {/* Ripple circles */}
        <div className="absolute w-full h-full">
          {/* Largest to smallest: secondary -> primary -> accent */}
          <div className="circle circle-7 bg-secondary" />
          <div className="circle circle-6 bg-secondary/90" />
          <div className="circle circle-5 bg-primary/90" />
          <div className="circle circle-4 bg-primary" />
          <div className="circle circle-3 bg-primary/90" />
          <div className="circle circle-2 bg-accent/90" />
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
            transform-origin: center center;
          }

          .circle-1 {
            width: 100vw;
            height: 100vw;
            right: -50vw;  /* Center at corner */
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
      </Card>
    </div>
  );
};

export default BackgroundTest;
