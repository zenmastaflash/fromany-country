'use client';

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-8">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: "url('/images/home-bg.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-secondary/80 to-secondary/90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl w-full text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold text-text mb-4">
          fromany.country
        </h1>
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
