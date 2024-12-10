import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    const number = formData.get('number') as string;
    const issueDate = formData.get('issueDate') as string;
    const expiryDate = formData.get('expiryDate') as string;
    const issuingCountry = formData.get('issuingCountry') as string;
    const tagsString = formData.get('tags') as string;
    const tags = JSON.parse(tagsString || '[]');

    if (!file || !type || !number || !issueDate || !expiryDate || !issuingCountry) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to S3
    const key = `documents/${session.user.id}/${Date.now()}-${file.name}`;
    console.log('Uploading to:', key);

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;

    // Create document record
    const document = await prisma.document.create({
      data: {
        userId: session.user.id,
        type: type as any, // Cast to DocumentType enum
        number,
        issueDate: new Date(issueDate),
        expiryDate: new Date(expiryDate),
        issuingCountry,
        fileName: file.name,
        fileUrl,
        tags,
        status: 'active',
        version: 1,
        sharedWith: [],
        metadata: {
          uploadedAt: new Date().toISOString(),
          originalFileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        },
      },
    });

    return NextResponse.json({ success: true, document });
  } catch (error) {
    console.error('Upload error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}