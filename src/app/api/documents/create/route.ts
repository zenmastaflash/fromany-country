// src/app/api/documents/create/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await getServerSession(authConfig);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Please sign in to create documents' },
      { status: 401 }
    );
  }

  try {
    const data = await request.json();
    const document = await prisma.document.create({
      data: {
        userId: session.user.id,
        fileName: data.fileName,
        fileUrl: data.fileUrl,
        title: data.title,
        type: data.type,
        status: 'active',
        issueDate: data.issueDate ? new Date(data.issueDate) : null,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        number: data.number,
        issuingCountry: data.issuingCountry,
        metadata: data.metadata || {},
        tags: data.tags || [],
        sharedWith: data.sharedWith || [],
        version: 1,
      },
    });

    return NextResponse.json({ success: true, document });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
