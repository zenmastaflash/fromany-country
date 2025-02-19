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
    const travel = await prisma.travel.create({
      data: {
        user_id: session.user.id,
        ...data
      },
    });

    return NextResponse.json(travel);
  } catch (error) {
    console.error('Error in POST /api/travel:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
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
