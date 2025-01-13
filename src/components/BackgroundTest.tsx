import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';

const BackgroundTest = () => {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold text-text">Background Animation Tests</h2>
      
      {/* Test 1: Basic Animation */}
      <Card className="relative overflow-hidden h-96">
        <div className="absolute inset-0">
          {/* Cloud 1 - Secondary Color */}
          <div className="absolute w-64 h-32 bg-secondary/70 rounded-full blur-xl animate-float-slow" 
               style={{
                 left: '10%',
                 top: '20%',
                 animation: 'float 20s ease-in-out infinite'
               }}
          />
          
          {/* Cloud 2 - Primary Color */}
          <div className="absolute w-64 h-32 bg-primary/40 rounded-full blur-xl animate-float-slower"
               style={{
                 left: '40%',
                 top: '40%',
                 animation: 'float 25s ease-in-out infinite 2s'
               }}
          />
          
          {/* Cloud 3 - Accent Color */}
          <div className="absolute w-64 h-32 bg-accent/60 rounded-full blur-xl animate-float-slowest"
               style={{
                 left: '60%',
                 top: '60%',
                 animation: 'float 30s ease-in-out infinite 4s'
               }}
          />
        </div>
        
        <div className="relative z-10 p-6">
          <h3 className="text-lg font-semibold text-text">Basic Cloud Animation</h3>
          <p className="text-link mt-2">Floating clouds with your color scheme</p>
        </div>
      </Card>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(30px, -30px) scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default BackgroundTest;
