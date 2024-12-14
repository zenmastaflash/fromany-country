import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">fromany.country</h1>
      <Button asChild>
        <Link href="/api/auth/signin">Sign In</Link>
      </Button>
    </main>
  )
}