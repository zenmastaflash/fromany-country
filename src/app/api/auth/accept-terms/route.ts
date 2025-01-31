// src/app/api/auth/accept-terms/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { terms_accepted_at: true }
    });

    return NextResponse.json({
      terms_accepted: !!user?.terms_accepted_at
    });
  } catch (error) {
    console.error('Error checking terms status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { 
        email: session.user.email
      },
      data: {
        terms_accepted_at: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error accepting terms:', error);
    return NextResponse.json(
      { error: 'Failed to accept terms' },
      { status: 500 }
    );
  }
}
