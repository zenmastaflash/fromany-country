'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { 
      name: 'Documents',
      href: '/documents',
      children: [
        { name: 'Library', href: '/documents' },
        { name: 'Expiring', href: '/documents?tab=expiring' },
      ]
    },
    { name: 'Travel', href: '/travel' },
    { name: 'Tax', href: '/tax' },
    { name: 'Compliance', href: '/compliance' },
  ];

  return (
    <header className="bg-white shadow">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link 
              href="/" 
              className="flex items-center text-xl font-bold text-indigo-600"
            >
              fromany.country
            </Link>

            {session && (
              <div className="flex space-x-4">
                {navigation.map((item) => {
                  const isActive = 
                    pathname === item.href ||
                    (item.children?.some(child => {
                      if (child.href.includes('?')) {
                        const [basePath] = child.href.split('?');
                        return pathname === basePath;
                      }
                      return pathname === child.href;
                    }));

                  return (
                    <div key={item.name} className="relative group">
                      <Link
                        href={item.href}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${isActive
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {item.name}
                      </Link>
                      
                      {item.children && (
                        <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                          <div className="py-1" role="menu">
                            {item.children.map((child) => (
                              <Link
                                key={child.name}
                                href={child.href}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">{session.user?.email}</span>
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