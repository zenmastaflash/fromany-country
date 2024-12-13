import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION || '',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function POST(req: Request) {
  try {
    console.log('Upload API: Starting request');
    const session = await getServerSession(authOptions);
    
    console.log('Upload API: Session:', JSON.stringify({
      userId: session?.user?.id,
      email: session?.user?.email
    }));

    if (!session?.user?.id) {
      console.error('Upload API: No user ID in session');
      return NextResponse.json(
        { error: 'Unauthorized', details: 'No valid session found' },
        { status: 401 }
      );
    }

    // Verify AWS configuration
    if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_BUCKET_NAME) {
      console.error('Upload API: Missing AWS configuration');
      return NextResponse.json(
        { error: 'Server configuration error', details: 'AWS configuration missing' },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('Upload API: No file provided');
      return NextResponse.json(
        { error: 'Bad Request', details: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('Upload API: File details:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Generate a unique filename
    const uniqueFilename = `${Date.now()}-${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to S3
    console.log('Upload API: Uploading to S3...');
    await s3.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: uniqueFilename,
      Body: buffer,
      ContentType: file.type,
    }));

    console.log('Upload API: File uploaded to S3');

    // Create document record
    console.log('Upload API: Creating database record');
    const document = await prisma.document.create({
      data: {
        userId: session.user.id,
        fileName: file.name,
        fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFilename}`,
        type: 'OTHER',
        number: '',
        issueDate: new Date(),
        expiryDate: new Date(),
        issuingCountry: '',
        status: 'active',
      },
    });

    console.log('Upload API: Document created:', document.id);
    return NextResponse.json(document);
  } catch (error) {
    console.error('Upload API Error:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}