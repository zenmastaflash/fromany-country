import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Documents API: Starting request');
    const session = await getServerSession(authOptions);
    
    // Log session info without sensitive data
    console.log('Documents API: Session info:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      hasId: !!session?.user?.id,
      email: session?.user?.email
    });

    if (!session?.user?.id) {
      console.error('Documents API: Authentication failed - no user ID');
      return NextResponse.json(
        { error: 'Unauthorized', details: 'No valid session found' },
        { status: 401 }
      );
    }

    // Verify database connection
    try {
      await prisma.$connect();
      console.log('Documents API: Database connected successfully');
    } catch (dbError) {
      console.error('Documents API: Database connection failed:', {
        error: dbError instanceof Error ? dbError.message : 'Unknown error',
        type: dbError instanceof Error ? dbError.constructor.name : 'Unknown'
      });
      throw dbError;
    }

    // Query documents
    try {
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
    } catch (queryError) {
      console.error('Documents API: Query failed:', {
        error: queryError instanceof Error ? queryError.message : 'Unknown error',
        type: queryError instanceof Error ? queryError.constructor.name : 'Unknown'
      });
      throw queryError;
    }
  } catch (error) {
    console.error('Documents API: Error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.constructor.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.constructor.name : 'Unknown'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect().catch(() => {
      console.log('Documents API: Failed to disconnect from database');
    });
  }
}