import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Documents API: Starting request');
    const session = await getServerSession(authOptions);
    console.log('Documents API: Session:', JSON.stringify({ 
      userId: session?.user?.id,
      email: session?.user?.email 
    }));

    if (!session?.user?.id) {
      console.error('Documents API: No user ID in session');
      return NextResponse.json(
        { error: 'Unauthorized', details: 'No valid session found' },
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

    console.log(`Documents API: Found ${documents.length} documents`);
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Documents API Error:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}