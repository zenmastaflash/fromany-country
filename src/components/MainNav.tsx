import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export function MainNav() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const navItems = [
    {
      name: 'Home',
      href: '/',
      protected: false
    },
    {
      name: 'Dashboard',
      href: '/dashboard',
      protected: true
    },
    {
      name: 'Documents',
      href: '/documents',
      protected: true
    },
    {
      name: 'Travel',
      href: '/travel',
      protected: true
    },
    {
      name: 'Resources',
      href: '/resources',
      protected: false
    }
  ]

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4 lg:space-x-6">
          {navItems.map((item) => 
            (!item.protected || session) ? (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href
                    ? 'text-black dark:text-white'
                    : 'text-muted-foreground'
                }`}
              >
                {item.name}
              </Link>
            ) : null
          )}
        </div>
        <div className="ml-auto flex items-center space-x-4">
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
            <Button asChild variant="outline">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}