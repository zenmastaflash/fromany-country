import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Documents API: Starting request');
    const session = await getServerSession(authOptions);
    
    console.log('Documents API: Session:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      email: session?.user?.email
    });

    if (!session?.user?.id) {
      console.error('Documents API: No user ID in session');
      return NextResponse.json(
        { error: 'Unauthorized', details: 'No valid session found' },
        { status: 401 }
      );
    }

    // Test database connection
    await prisma.$connect();
    console.log('Documents API: Database connected');

    // Log the query we're about to make
    console.log('Documents API: Querying documents for user:', session.user.id);

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

    // If it's a Prisma error, log additional details
    if (error instanceof Error && error.constructor.name === 'PrismaClientKnownRequestError') {
      console.error('Prisma Error Details:', error);
    }

    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.constructor.name : 'Unknown'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}