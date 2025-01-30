// src/app/api/auth/complete-signup/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authConfig } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.email) {
      return new NextResponse(null, { status: 401 });
    }

    const { displayName, country } = await req.json();

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: { 
        displayName,
        country,
        updated_at: new Date()
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Complete signup error:', error);
    return new NextResponse(null, { status: 500 });
  }
}
