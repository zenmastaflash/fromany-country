// src/app/api/documents/update/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth';

export async function POST(request: Request) {
  const session = await getServerSession(authConfig);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Please sign in to update documents' },
      { status: 401 }
    );
  }

  try {
    const data = await request.json();
    console.log('Update request data:', data); // Log incoming data

    // Check if the document exists
    const existingDocument = await prisma.document.findUnique({
      where: { id: data.id },
    });

    if (!existingDocument) {
      console.error('Document not found:', data.id);
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    const document = await prisma.document.update({
      where: { id: data.id },
      data: {
        title: data.title,
        type: data.type,
        issueDate: data.issueDate ? new Date(data.issueDate) : null,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        number: data.number,
        issuingCountry: data.issuingCountry,
        tags: data.tags || [],
      },
    });

    console.log('Document updated:', document); // Log updated document
    return NextResponse.json({ success: true, document });
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
