// src/app/api/travel/[id]/route.ts
import { authConfig } from '@/lib/auth';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';

interface TravelUpdateData extends Partial<Omit<Prisma.TravelUncheckedUpdateInput, 'id' | 'user_id'>> {}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json() as TravelUpdateData;
    
    // Create an update object with proper typing
    const updateData: Prisma.TravelUpdateInput = {};
    
    // Handle individual fields with proper typing
    if (data.entry_date) {
      updateData.entry_date = new Date(data.entry_date as string);
    }
    
    if (data.exit_date !== undefined) {
      updateData.exit_date = data.exit_date ? new Date(data.exit_date as string) : null;
    }
    
    if (data.country) updateData.country = data.country as string;
    if (data.city) updateData.city = data.city as string;
    if (data.purpose) updateData.purpose = data.purpose as string;
    if (data.visa_type !== undefined) updateData.visa_type = data.visa_type as string | null;
    if (data.notes !== undefined) updateData.notes = data.notes as string | null;
    
    const travel = await prisma.travel.update({
      where: { 
        id: params.id,
        user_id: session.user.id  // Ensure user owns this record
      },
      data: updateData
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
