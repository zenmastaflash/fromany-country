'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const words = ['work', 'live', 'thrive'];
  const [currentWord, setCurrentWord] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-8">
      {/* Background Image */}
      <div 
        className="absolute top-0 left-0 w-full h-full z-0" 
        style={{ 
          backgroundImage: "url('/images/home-bg.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl w-full text-center space-y-8">
        <div className="relative flex justify-center">
          <div className="title-container">
            {words.map((word, index) => (
              index === currentWord && (
                <span 
                  key={word} 
                  className="animated-word text-4xl md:text-6xl font-bold"
                  style={{ 
                    color: 
                      index === 0 ? '#0FA4AF' :  // Primary color for "Work"
                      index === 1 ? '#AFDDE5' :  // Link color for "Live"
                      '#964734'                  // Accent color for "Thrive"
                  }}
                >
                  {word}
                </span>
              )
            ))}
            <h1 className="text-4xl md:text-6xl font-bold text-text">
              fromany.country
            </h1>
          </div>
        </div>
        <p className="text-xl md:text-2xl text-link mb-8">
          Live Anywhere. Belong Everywhere.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 bg-secondary rounded-lg">
            <h2 className="text-xl font-bold text-primary mb-2">Document Management</h2>
            <p className="text-link">Securely store and manage your important documents in one place.</p>
          </div>
          <div className="p-6 bg-secondary rounded-lg">
            <h2 className="text-xl font-bold text-primary mb-2">Travel Planning</h2>
            <p className="text-link">Track your travels and stay compliant with visa requirements.</p>
          </div>
          <div className="p-6 bg-secondary rounded-lg">
            <h2 className="text-xl font-bold text-primary mb-2">Resource Center</h2>
            <p className="text-link">Access guides and tools for successful global living.</p>
          </div>
        </div>
      </div>
    </main>
  );
}  
