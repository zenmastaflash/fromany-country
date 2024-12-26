import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  let session;
  try {
    session = await auth();
    console.log('Session attempt:', { hasSession: !!session });

    if (!session?.user?.id) {
      console.log('No valid session found');
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized', details: 'Please sign in again' }),
        { status: 401 }
      );
    }

    console.log('Session found for user:', session.user.id);
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
    console.error('Error in documents route:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      session: session ? { id: session.user?.id, email: session.user?.email } : null
    });

    return new NextResponse(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500 }
    );
  }
}
