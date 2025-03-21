'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const words = ['work', 'live', 'thrive'];
  const [currentWord, setCurrentWord] = useState(0);
  const [showSlogan, setShowSlogan] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  useEffect(() => {
    if (currentWord <= words.length - 1) {
      const timeout = setTimeout(() => {
        setCurrentWord(currentWord + 1);
      }, 2000);
      return () => clearTimeout(timeout);
    } else {
      // Show slogan after the last word disappears
      const sloganTimeout = setTimeout(() => {
        setShowSlogan(true);
      }, 500); // Delay before showing slogan
      return () => clearTimeout(sloganTimeout);
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
          <div className="h-[72px] md:h-[96px] flex items-center justify-center mb-0">
            {words.map((word, index) => (
              index === currentWord && currentWord < words.length && (
                <span 
                  key={word} 
                  className="animated-word text-4xl md:text-6xl font-bold font-recoleta"
                  style={{ color: '#fcfbdc' }}
                >
                  {word}
                </span>
              )
            ))}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-text font-recoleta">
            from any country
          </h1>
        </div>
        <p className={`text-xl md:text-2xl text-link mb-8 font-inter transition-opacity duration-1000 ${showSlogan ? 'opacity-100' : 'opacity-0'}`}>
          Live Anywhere. Belong Everywhere.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 bg-secondary rounded-lg">
            <h2 className="text-xl font-bold text-primary mb-2 font-recoleta">Document Management</h2>
            <p className="text-link font-inter">Securely store and manage your important documents in one place.</p>
          </div>
          <div className="p-6 bg-secondary rounded-lg">
            <h2 className="text-xl font-bold text-primary mb-2 font-recoleta">Travel Planning</h2>
            <p className="text-link font-inter">Track your travels and stay compliant with visa requirements.</p>
          </div>
          <div className="p-6 bg-secondary rounded-lg">
            <h2 className="text-xl font-bold text-primary mb-2 font-recoleta">Resource Center</h2>
            <p className="text-link font-inter">Access guides and tools for successful global living.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
