export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { prisma } from '@/lib/prisma';
import { authConfig } from '@/lib/auth';
import { Prisma, DocumentType } from '@prisma/client';

type DocumentMetadata = {
  title?: string;
  type?: DocumentType;
  issueDate?: string | null;
  expiryDate?: string | null;
  number?: string | null;
  issuingCountry?: string | null;
  tags?: string[];
};

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? ''
  }
});

export async function POST(request: Request) {
  const session = await getServerSession(authConfig);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Please sign in to upload documents' },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const metadataStr = formData.get('metadata') as string | null;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    let metadata: DocumentMetadata = {};
    if (metadataStr) {
      try {
        const parsed = JSON.parse(metadataStr);
        metadata = {
          title: parsed.title,
          type: parsed.type as DocumentType,
          issueDate: parsed.issueDate,
          expiryDate: parsed.expiryDate,
          number: parsed.number,
          issuingCountry: parsed.issuingCountry,
          tags: Array.isArray(parsed.tags) ? parsed.tags : []
        };
      } catch (e) {
        console.error('Error parsing metadata:', e);
      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const key = `documents/${session.user.id}/${Date.now()}-${file.name}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type
      })
    );

    // Create document record with metadata
    const document = await prisma.document.create({
      data: {
        userId: session.user.id,
        fileName: file.name,
        fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        title: metadata.title || file.name,
        type: metadata.type || DocumentType.OTHER,
        status: 'active',
        issueDate: metadata.issueDate ? new Date(metadata.issueDate) : null,
        expiryDate: metadata.expiryDate ? new Date(metadata.expiryDate) : null,
        number: metadata.number || null,
        issuingCountry: metadata.issuingCountry || null,
        metadata: metadata as Prisma.JsonObject,
        tags: metadata.tags || [],
        sharedWith: [],
        version: 1
      }
    });

    return NextResponse.json({ success: true, key, document });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Error uploading file', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
