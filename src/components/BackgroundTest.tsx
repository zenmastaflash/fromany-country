import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface CloudShapeProps {
  className?: string;
  style?: React.CSSProperties;
  color: string;
}

const CloudShape: React.FC<CloudShapeProps> = ({ className, style, color }) => (
  <div className={`absolute ${className}`} style={style}>
    {/* Main cloud body */}
    <div className={`absolute rounded-full ${color} w-32 h-32`} />
    <div className={`absolute rounded-full ${color} w-24 h-24`} style={{ left: '50%', top: '-25%' }} />
    <div className={`absolute rounded-full ${color} w-20 h-20`} style={{ left: '75%', top: '0%' }} />
    <div className={`absolute rounded-full ${color} w-28 h-28`} style={{ left: '25%', top: '10%' }} />
  </div>
);

const BackgroundTest: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold text-text">Background Animation Tests</h2>
      
      {/* Test 1: Basic Animation */}
      <Card className="relative overflow-hidden h-96 bg-transparent">
        <div className="absolute inset-0">
          {/* Cloud 1 - Secondary Color */}
          <CloudShape 
            color="bg-secondary/70"
            className="animate-float-slow"
            style={{
              left: '10%',
              top: '20%',
              transform: 'scale(1.2)',
              animationDelay: '0s'
            }}
          />
          
          {/* Cloud 2 - Primary Color */}
          <CloudShape 
            color="bg-primary/40"
            className="animate-float-slower"
            style={{
              left: '40%',
              top: '40%',
              transform: 'scale(0.8) rotate(45deg)',
              animationDelay: '2s'
            }}
          />
          
          {/* Cloud 3 - Accent Color */}
          <CloudShape 
            color="bg-accent/60"
            className="animate-float-slowest"
            style={{
              left: '60%',
              top: '10%',
              transform: 'scale(1.4) rotate(-15deg)',
              animationDelay: '4s'
            }}
          />
        </div>
        
        <div className="relative z-10 p-6">
          <h3 className="text-lg font-semibold text-text">Cloud-like Shapes Animation</h3>
          <p className="text-link mt-2">More natural cloud shapes with your color scheme</p>
        </div>
      </Card>
    </div>
  );
};

export default BackgroundTest;
