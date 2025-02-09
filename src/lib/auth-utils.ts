// src/lib/auth-utils.ts
import { getServerSession } from 'next-auth/next'
import { config as authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function requireAuth() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect('/api/auth/signin')
  }

  // Check terms acceptance
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { terms_accepted_at: true, id: true }
  })

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
