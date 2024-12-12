import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Documents API: Starting request');
    const session = await getServerSession(authOptions);
    console.log('Documents API: Session:', JSON.stringify(session, null, 2));

    if (!session?.user?.id) {
      console.error('Documents API: Authentication error - No user ID in session');
      return new NextResponse(
        JSON.stringify({
          error: 'Unauthorized',
          details: 'No valid session found'
        }),
        { status: 401 }
      );
    }

    console.log('Documents API: Fetching documents for user:', session.user.id);
    const documents = await prisma.document.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    console.log('Documents API: Found documents:', documents.length);

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Documents API Error:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
      error
    });

    return new NextResponse(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        name: error?.name
      }),
      { status: 500 }
    );
  }
}