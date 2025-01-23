// src/app/api/travel/route.ts
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { config } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(config);
    console.log('Session:', session); // Debug log
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const data = await request.json();
    
    const travel = await prisma.travel.create({
      data: {
        user_id: user.id,
        ...data,
        entry_date: new Date(data.entry_date),
        exit_date: data.exit_date ? new Date(data.exit_date) : null,
        status: 'active'
      },
    });

    return NextResponse.json(travel);
  } catch (error) {
    console.error('Error creating travel:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const travels = await prisma.travel.findMany({
      where: { user_id: session.user.id },
      orderBy: { entry_date: 'desc' },
    });

    return NextResponse.json(travels);
  } catch (error) {
    console.error('Error fetching travel:', error);
    return NextResponse.json({ error: 'Failed to fetch travel entries' }, { status: 500 });
  }
}
