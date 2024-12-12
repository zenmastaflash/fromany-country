import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.error('Authentication error: No user ID in session', { session });
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const documents = await prisma.document.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error in documents route:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error', details: error?.message }), 
      { status: 500 }
    );
  }
}