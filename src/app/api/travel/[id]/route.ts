// src/app/api/travel/[id]/route.ts
import { authConfig } from '@/lib/auth';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const travel = await prisma.travel.update({
      where: { 
        id: params.id,
        user_id: session.user.id  // Ensure user owns this record
      },
      data: {
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
    console.error('Error updating travel:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.travel.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
