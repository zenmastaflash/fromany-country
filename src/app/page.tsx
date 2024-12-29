'use client';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-background via-secondary/50 to-secondary">
      <div className="max-w-4xl w-full text-center space-y-8">
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
