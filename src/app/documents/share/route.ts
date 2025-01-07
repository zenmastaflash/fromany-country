import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authConfig } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized', details: 'Please sign in again' }),
        { status: 401 }
      );
    }

    const sharedDocuments = await prisma.document.findMany({
      where: {
        sharedWith: {
          has: session.user.email
        }
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return NextResponse.json(sharedDocuments);
  } catch (error) {
    console.error('Error in shared documents route:', {
      error: error instanceof Error ? error.message : 'Unknown error'
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
