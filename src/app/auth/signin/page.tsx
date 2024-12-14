'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

export default function SignIn() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/documents'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <button
        onClick={() => signIn('google', { callbackUrl })}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Sign In with Google
      </button>
    </div>
  )
}