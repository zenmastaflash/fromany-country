'use client';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold text-indigo-600 mb-4">fromany.country</h1>
      <p className="text-xl text-gray-600 mb-8">Live Anywhere. Belong Everywhere</p>
      <a
        href="/api/auth/signin"
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
      >
        Sign In
      </a>
    </main>
  );
}
