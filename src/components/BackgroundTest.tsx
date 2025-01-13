import React from 'react';
import { Card } from '@/components/ui/Card';

const BackgroundTest: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold text-text">Background Animation Tests</h2>
      
      <Card className="relative overflow-hidden h-[80vh] bg-transparent">
        {/* Ripple circles */}
        <div className="absolute w-full h-full">
          {/* Extra large circles */}
          <div className="circle xxxlarge shade1 bg-accent/20" />
          <div className="circle xxlarge shade2 bg-accent/30" />
          <div className="circle xlarge shade3 bg-secondary/40" />
          <div className="circle large shade4 bg-secondary/50" />
          <div className="circle medium shade5 bg-secondary/60" />
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
            width: 600px;
            height: 600px;
            right: -200px;
            bottom: -200px;
            animation-delay: 0s;
          }

          .large {
            width: 800px;
            height: 800px;
            right: -300px;
            bottom: -300px;
            animation-delay: 0.3s;
          }

          .xlarge {
            width: 1000px;
            height: 1000px;
            right: -400px;
            bottom: -400px;
            animation-delay: 0.6s;
          }

          .xxlarge {
            width: 1200px;
            height: 1200px;
            right: -500px;
            bottom: -500px;
            animation-delay: 0.9s;
          }

          .xxxlarge {
            width: 1400px;
            height: 1400px;
            right: -600px;
            bottom: -600px;
            animation-delay: 1.2s;
          }

          .shade1 { opacity: 0.1; }
          .shade2 { opacity: 0.2; }
          .shade3 { opacity: 0.3; }
          .shade4 { opacity: 0.4; }
          .shade5 { opacity: 0.5; }

          @keyframes ripple {
            0% {
              transform: scale(0.8);
            }
            
            50% {
              transform: scale(1.2);
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
