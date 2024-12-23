import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { Document } from '@prisma/client';

type ResponseData = {
  documents?: Document[];
  error?: string;
}

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json<ResponseData>(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const documents = await prisma.document.findMany({
      where: {
        userId: Number(session.user.id),
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

    return NextResponse.json<ResponseData>({ documents });
  } catch (error) {
    console.error('Error fetching expiring documents:', error);
    return NextResponse.json<ResponseData>({ error: 'Internal server error' }, { status: 500 });
  }
}