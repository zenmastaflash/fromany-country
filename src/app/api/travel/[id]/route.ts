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
    
    // If both dates are being updated, validate them
    if (data.entry_date && data.exit_date) {
      const entryDate = new Date(data.entry_date as string);
      const exitDate = new Date(data.exit_date as string);
      
      // Check if dates are the same or if exit is before entry
      if (exitDate <= entryDate) {
        return NextResponse.json(
          { error: "Exit date must be after entry date" },
          { status: 400 }
        );
      }
    }
    
    // If only entry date is updated, check against existing exit date
    if (data.entry_date && !data.exit_date) {
      const existingTravel = await prisma.travel.findUnique({
        where: { id: params.id }
      });
      
      if (existingTravel?.exit_date) {
        const newEntryDate = new Date(data.entry_date as string);
        const existingExitDate = new Date(existingTravel.exit_date);
        
        if (existingExitDate <= newEntryDate) {
          return NextResponse.json(
            { error: "Entry date cannot be after or equal to existing exit date" },
            { status: 400 }
          );
        }
      }
    }
    
    // Similar check for exit date update
    if (!data.entry_date && data.exit_date) {
      const existingTravel = await prisma.travel.findUnique({
        where: { id: params.id }
      });
      
      if (existingTravel) {
        const existingEntryDate = new Date(existingTravel.entry_date);
        const newExitDate = data.exit_date ? new Date(data.exit_date as string) : null;
        
        if (newExitDate && newExitDate <= existingEntryDate) {
          return NextResponse.json(
            { error: "Exit date must be after entry date" },
            { status: 400 }
          );
        }
      }
    }
    
    if (data.country) updateData.country = data.country as string;
    if (data.city) updateData.city = data.city as string;
    if (data.purpose) updateData.purpose = data.purpose as string;
    if (data.visa_type !== undefined) updateData.visa_type = data.visa_type as string | null;
    if (data.notes !== undefined) updateData.notes = data.notes as string | null;
    
    try {
      const travel = await prisma.travel.update({
        where: { 
          id: params.id,
          user_id: session.user.id  // Ensure user owns this record
        },
        data: updateData
      });
      
      return NextResponse.json(travel);
    } catch (prismaError: any) {
      console.error('Prisma error:', prismaError);
      
      // Check for constraint violation
      if (prismaError.message?.includes('valid_dates')) {
        return NextResponse.json(
          { error: "Exit date must be after entry date" },
          { status: 400 }
        );
      }
      
      throw prismaError;
    }
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
