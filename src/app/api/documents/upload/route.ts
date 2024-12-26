export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { prisma, Prisma } from '@/lib/prisma';
import { authConfig } from '@/lib/auth';

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
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
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

    // Create document record with defaults and nullable fields
    const document = await prisma.document.create({
      data: {
        userId: session.user.id,
        fileName: file.name,
        fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        title: file.name,
        type: 'OTHER',
        status: 'active',
        issueDate: null,        // Set nullable fields to null
        expiryDate: null,       // Set nullable fields to null
        number: null,           // Set nullable fields to null
        issuingCountry: null,   // Set nullable fields to null
        metadata: Prisma.JsonNull,  // Changed this line - proper way to set JSON to null
        tags: [],              // Empty array for tags
        sharedWith: [],        // Empty array for sharedWith
        version: 1             // Default version
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
