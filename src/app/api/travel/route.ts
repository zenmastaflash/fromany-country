// src/app/api/travel/route.ts
import { authConfig } from '@/lib/auth';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';

type TravelCreateInput = Omit<Prisma.TravelCreateInput, 'user'>;

export async function POST(request: Request) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json() as TravelCreateInput;
    const travel = await prisma.travel.create({
      data: {
        user_id: session.user.id,
        ...data
      },
    });

    return NextResponse.json(travel);
  } catch (error) {
    console.error('Error creating travel:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const travels = await prisma.travel.findMany({
      where: { user_id: session.user.id },
      orderBy: { entry_date: 'desc' },
    });

    return NextResponse.json(travels);
  } catch (error) {
    console.error('Error fetching travel:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
