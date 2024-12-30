'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const words = ['work', 'live', 'thrive'];
  const [currentWord, setCurrentWord] = useState(0);

  useEffect(() => {
    // Run for all words including the last one
    if (currentWord <= words.length - 1) {
      const timeout = setTimeout(() => {
        setCurrentWord(currentWord + 1);  // This will make it go one step beyond the last word
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [currentWord, words.length]);

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
            <div className="animation-space">
              {/* Always render a hidden placeholder */}
              <span className="opacity-0 invisible h-0">thrive</span>
              {/* Render the animated word if needed */}
              {words.map((word, index) => (
                index === currentWord && currentWord < words.length && (
                  <span 
                    key={word} 
                    className="animated-word text-4xl md:text-6xl font-bold absolute"
                    style={{ color: '#964734' }}
                  >
                    {word}
                  </span>
                )
              ))}
            </div>
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
