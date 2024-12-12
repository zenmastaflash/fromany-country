'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex">
            <Link 
              href="/" 
              className="flex items-center text-xl font-bold text-indigo-600"
            >
              fromany.country
            </Link>
          </div>
          <div className="flex items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">{session.user?.email}</span>
                <button
                  onClick={() => signOut()}
                  className="text-sm bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="text-sm bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}