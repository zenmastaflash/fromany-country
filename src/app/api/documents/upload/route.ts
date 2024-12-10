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
    const category = formData.get('category') as string;

    if (!file || !category) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to S3
    const key = `documents/${session.user.id}/${Date.now()}-${file.name}`;
    console.log('Uploading to:', key); // Debug log

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
        type: category,
        fileName: file.name,
        fileUrl,
        number: 'TBD',
        issueDate: new Date(),
        expiryDate: new Date(),
        issuingCountry: 'TBD',
      },
    });

    return NextResponse.json({ success: true, document });
  } catch (error) {
    console.error('Upload error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}