import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authConfig } from '@/lib/auth';

export const runtime = 'nodejs';

async function POST(request: Request) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

  try {
    const { documentId, email } = await request.json();

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      select: { userId: true, sharedWith: true }
    });

    if (!document) {
      return new NextResponse('Document not found', { status: 404 });
    }

    if (document.userId !== session.user.id) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const updatedDoc = await prisma.document.update({
      where: { id: documentId },
      data: {
        sharedWith: { push: email }
      }
    });

    return NextResponse.json(updatedDoc);
  } catch (error) {
    console.error('Error sharing document:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export { POST };
