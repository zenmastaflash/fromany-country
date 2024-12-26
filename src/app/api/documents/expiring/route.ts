export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DocumentType } from '@prisma/client';

interface ResponseData {
  documents?: Array<{
    id: string;
    title: string;
    status: string;
    type: DocumentType;
    number: string | null;
    metadata: any;
    version: number;
    userId: string;
    issueDate: Date | null;
    expiryDate: Date;
    issuingCountry: string | null;
    fileName: string | null;
    fileUrl: string | null;
    tags: string[];
    sharedWith: string[];
    createdAt: Date;
    updatedAt: Date;
  }>;
  error?: string;
}

export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      where: {
        status: 'active',
        expiryDate: {
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          gte: new Date() // Not expired yet
        }
      },
      select: {
        id: true,
        title: true,
        status: true,
        type: true,
        number: true,
        metadata: true,
        version: true,
        userId: true,
        issueDate: true,
        expiryDate: true,
        issuingCountry: true,
        fileName: true,
        fileUrl: true,
        tags: true,
        sharedWith: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json<ResponseData>({ documents });
  } catch (error) {
    console.error('Error fetching expiring documents:', error);
    return NextResponse.json<ResponseData>(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
