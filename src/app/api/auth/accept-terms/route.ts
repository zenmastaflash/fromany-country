// src/app/api/auth/accept-terms/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth';

export async function POST() {
  const session = await getServerSession(authConfig);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: { 
        terms_accepted_at: new Date(),
        terms_version: 1 // Current version
      }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error accepting terms:', error);
    return NextResponse.json({ error: 'Failed to accept terms' }, { status: 500 });
  }
}
