'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import usePathname
import { Button } from '@/components/ui/Button'; // Use Button component if available

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname(); // Get current path

  if (status === 'loading') {
    return (
      <header className="bg-white shadow-sm">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">fromany.country</Link>
            </div>
            <div className="ml-10 space-x-4"><p>Loading...</p></div>
          </div>
        </nav>
      </header>
    );
  }

  const navLinks = [
    { href: "/", label: "Home", protected: false },
    { href: "/dashboard", label: "Dashboard", protected: true },
    { href: "/travel", label: "Travel", protected: true },
    { href: "/documents", label: "Documents", protected: true },
    { href: "/resources", label: "Resources", protected: false }
  ];

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">fromany.country</Link>
          </div>
          <div className="ml-10 space-x-4">
            {navLinks.map(link => (
              (!link.protected || session) && (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-gray-500 hover:text-gray-900 ${
                    pathname === link.href ? 'text-black' : ''
                  }`}
                >
                  {link.label}
                </Link>
              )
            ))}
            {session ? (
              <>
                <span className="text-sm text-muted-foreground">
                  {session.user?.email}
                </span>
                <Button
                  variant="outline"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => signIn('google')}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
