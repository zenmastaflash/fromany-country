import React from 'react';
import { Card } from '@/components/ui/Card';

const BackgroundTest: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold text-text">Background Animation Tests</h2>
      
      <Card className="relative overflow-hidden h-[80vh] bg-transparent">
        {/* Ripple circles */}
        <div className="absolute w-full h-full">
          {/* Largest to smallest, from secondary to accent */}
          <div className="circle xxxlarge shade1 bg-secondary" />
          <div className="circle xxlarge shade2 bg-secondary" />
          <div className="circle xlarge shade3 bg-primary" />
          <div className="circle large shade4 bg-primary" />
          <div className="circle medium shade5 bg-accent" />
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

          .medium {
            width: 1200px;
            height: 1200px;
            right: -300px;
            bottom: -300px;
            animation-delay: 0s;
          }

          .large {
            width: 1600px;
            height: 1600px;
            right: -400px;
            bottom: -400px;
            animation-delay: 0.3s;
          }

          .xlarge {
            width: 2000px;
            height: 2000px;
            right: -500px;
            bottom: -500px;
            animation-delay: 0.6s;
          }

          .xxlarge {
            width: 2400px;
            height: 2400px;
            right: -600px;
            bottom: -600px;
            animation-delay: 0.9s;
          }

          .xxxlarge {
            width: 2800px;
            height: 2800px;
            right: -700px;
            bottom: -700px;
            animation-delay: 1.2s;
          }

          .shade1 { opacity: 0.9; }
          .shade2 { opacity: 0.8; }
          .shade3 { opacity: 0.7; }
          .shade4 { opacity: 0.6; }
          .shade5 { opacity: 0.5; }

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
