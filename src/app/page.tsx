'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const handleSignIn = () => {
    router.push('/api/auth/signin')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">fromany.country</h1>
      <button
        onClick={handleSignIn}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Sign In with Google
      </button>
    </main>
  )
}