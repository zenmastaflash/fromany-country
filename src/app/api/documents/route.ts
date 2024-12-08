import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { documents: true },
  });

  return NextResponse.json(user?.documents || []);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const data = await request.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return new NextResponse('User not found', { status: 404 });
  }

  const document = await prisma.document.create({
    data: {
      ...data,
      userId: user.id,
    },
  });

  return NextResponse.json(document);
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new NextResponse('Document ID required', { status: 400 });
  }

  const document = await prisma.document.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!document || document.user.email !== session.user.email) {
    return new NextResponse('Document not found', { status: 404 });
  }

  await prisma.document.delete({
    where: { id },
  });

  return new NextResponse(null, { status: 204 });
}