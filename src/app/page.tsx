'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const words = ['work', 'live', 'thrive'];
  const [currentWord, setCurrentWord] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (currentWord <= words.length - 1) {
      const timeout = setTimeout(() => {
        setCurrentWord(currentWord + 1);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [currentWord, words.length]);

  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-8">
      <div className="relative z-10 max-w-4xl w-full text-center space-y-8">
        <div className="relative flex flex-col items-center justify-center">
          {/* Fixed height container for animations */}
          <div className="h-[72px] md:h-[96px] flex items-center justify-center mb-2">
            {words.map((word, index) => (
              index === currentWord && currentWord < words.length && (
                <span 
                  key={word} 
                  className="animated-word text-4xl md:text-6xl font-bold"
                  style={{ color: '#964734' }}
                >
                  {word}
                </span>
              )
            ))}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-text">
            from any country
          </h1>
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
