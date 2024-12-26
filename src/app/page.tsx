'use client';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-fac-background">
      <h1 className="text-4xl font-bold text-fac-text mb-4">fromany.country</h1>
      <p className="text-xl text-fac-light mb-8">Live Anywhere. Belong Everywhere.</p>
      <a
        href="/api/auth/signin"
        className="px-4 py-2 bg-fac-primary text-fac-text rounded-md hover:bg-fac-accent transition-colors"
      >
        Sign In
      </a>
    </main>
  );
}
