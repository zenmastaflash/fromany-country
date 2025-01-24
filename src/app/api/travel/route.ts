// src/app/api/travel/route.ts
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const travel = await prisma.travel.create({
      data: {
        user_id: session.user.id,
        country: data.country,
        city: data.city,
        entry_date: new Date(data.entry_date),
        exit_date: data.exit_date ? new Date(data.exit_date) : null,
        purpose: data.purpose,
        visa_type: data.visa_type,
        notes: data.notes,
        status: 'active'
      },
    });

    return NextResponse.json(travel);
  } catch (error) {
    console.error('Error creating travel:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
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
