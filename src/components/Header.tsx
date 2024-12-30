'use client';
import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home", protected: false },
    { href: "/dashboard", label: "Dashboard", protected: true },
    { href: "/travel", label: "Travel", protected: true },
    { href: "/documents", label: "Documents", protected: true },
    { href: "/resources", label: "Resources", protected: false }
  ];

  if (status === 'loading') {
    return (
      <header className="bg-secondary shadow-sm">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-text">
                from any country
              </Link>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  const filteredLinks = navLinks.filter(link => 
    !link.protected || session
  );

  return (
    <header className="bg-secondary shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-text">
              from any country
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {filteredLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-link hover:text-text ${
                  pathname === link.href ? 'text-text' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
            {session ? (
              <Button
                variant="primary"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Sign Out
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => signIn('google')}
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-text hover:text-link"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {filteredLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2 text-link hover:text-text ${
                  pathname === link.href ? 'text-text' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {session ? (
              <Button
                variant="primary"
                onClick={() => {
                  setIsMenuOpen(false);
                  signOut({ callbackUrl: '/' });
                }}
                className="w-full mt-4"
              >
                Sign Out
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => {
                  setIsMenuOpen(false);
                  signIn('google');
                }}
                className="w-full mt-4"
              >
                Sign In
              </Button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
