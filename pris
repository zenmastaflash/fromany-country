import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authConfig);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const documents = await prisma.document.findMany({
      where: {
        userId: session.user.id,  // No need for parseInt now
        expiryDate: {
          lte: thirtyDaysFromNow,
          gte: new Date(),
        },
      },
      select: {
        id: true,
        title: true,
        expiryDate: true,
      },
      orderBy: {
        expiryDate: 'asc',
      },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching expiring documents:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}