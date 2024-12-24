import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  let session;
  try {
    const { searchParams } = new URL(request.url);
    const myParam = searchParams.get("myParam");

    session = await auth();
    console.log('Session data:', {
      exists: !!session,
      user: session?.user ? {
        id: session.user.id,
        email: session.user.email
      } : null
    });

    if (!session?.user?.id) {
      console.error('No user ID in session');
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized', details: 'Please sign in again' }),
        { status: 401 }
      );
    }

    const documents = await prisma.document.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`Found ${documents.length} documents for user ${session.user.id}`);
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
