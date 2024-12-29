// src/app/api/documents/create/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const document = await prisma.document.create({
      data: {
        userId: data.userId,
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
