// src/lib/auth-utils.ts
import { getServerSession } from 'next-auth/next'
import { config as authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  try {
    return await fn()
  } catch (error: any) {
    if (retries > 0 && (
      error?.message?.includes('connection closed') ||
      error?.message?.includes('Connection terminated')
    )) {
      await new Promise(resolve => setTimeout(resolve, 100))
      return withRetry(fn, retries - 1)
    }
    throw error
  }
}

export async function requireAuth() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect('/api/auth/signin')
  }

  // Since we've checked email exists above, TypeScript knows it's not null here
  const email = session.user.email
  
  // Check terms acceptance with retry
  const user = await withRetry(() => 
    prisma.user.findUnique({
      where: { email },
      select: { terms_accepted_at: true, id: true }
    })
  )

  if (!user?.terms_accepted_at) {
    redirect('/auth/terms')
  }

  return {
    ...session,
    user: {
      ...session.user,
      id: user.id
    }
  }
}
