'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              fromany.country
            </Link>
          </div>
          <div className="ml-10 space-x-4">
            {session ? (
              <>
                <Link href="/dashboard" className="text-gray-500 hover:text-gray-900">
                  Dashboard
                </Link>
                <Link href="/travel" className="text-gray-500 hover:text-gray-900">
                  Travel
                </Link>
                <button
                  onClick={() => signOut()}
                  className="inline-block rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white hover:bg-opacity-75"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="inline-block rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white hover:bg-opacity-75"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}