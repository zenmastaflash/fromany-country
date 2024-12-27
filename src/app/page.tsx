'use client';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
      <h1 className="text-4xl font-bold text-text mb-4">fromany.country</h1>
      <p className="text-xl text-link mb-8">Live Anywhere. Belong Everywhere.</p>
      <a
        href="/api/auth/signin"
        className="btn-primary"
      >
        Sign In
      </a>
    </main>
  );
}
