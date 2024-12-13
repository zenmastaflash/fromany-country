import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    // Get documents expiring in the next 30 days
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const documents = await prisma.document.findMany({
      where: {
        userId: session.user.id,
        expiryDate: {
          lte: thirtyDaysFromNow,
          gte: new Date(),
        },
      },
      orderBy: {
        expiryDate: 'asc',
      },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching expiring documents:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}