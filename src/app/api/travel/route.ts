// src/app/api/travel/route.ts
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    const travel = await prisma.travel.create({
      data: {
        user_id: session.user.id,
        country: data.country,
        city: data.city,
        entry_date: new Date(data.startDate),
        exit_date: data.endDate ? new Date(data.endDate) : null,
        purpose: data.purpose,
        visa_type: data.visaType,
        notes: data.notes,
        status: 'active'
      },
    });

    return NextResponse.json(travel);
  } catch (error) {
    console.error('Error creating travel:', error);
    return NextResponse.json({ error: 'Failed to create travel entry' }, { status: 500 });
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
