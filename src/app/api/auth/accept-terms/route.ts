// src/app/api/auth/accept-terms/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { 
        email 
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
