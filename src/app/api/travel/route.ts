// src/app/api/travel/route.ts
import { authConfig } from '@/lib/auth';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';

type TravelCreateInput = Omit<Prisma.TravelCreateInput, 'user'>;

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await request.json() as TravelCreateInput;
    
    // Validate dates
    const entryDate = new Date(data.entry_date);
    const exitDate = data.exit_date ? new Date(data.exit_date) : null;
    
    // Check if exit_date is before or same as entry_date
    if (exitDate && exitDate <= entryDate) {
      return NextResponse.json(
        { error: "Exit date must be after entry date" },
        { status: 400 }
      );
    }
    
    try {
      const travel = await prisma.travel.create({
        data: {
          user_id: session.user.id,
          ...data
        },
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
    console.error('Error in POST /api/travel:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const travels = await prisma.travel.findMany({
      where: { user_id: session.user.id },
      orderBy: { entry_date: 'desc' },
    });

    return NextResponse.json(travels);
  } catch (error) {
    console.error('Error in GET /api/travel:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '3600',
    },
  });
}
