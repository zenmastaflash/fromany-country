import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new NextResponse(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400 }
      );
    }

    // Generate a unique filename
    const uniqueFilename = `${Date.now()}-${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to S3
    await s3.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: uniqueFilename,
      Body: buffer,
      ContentType: file.type,
    }));

    // Create document record
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

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error uploading document:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to upload document' }),
      { status: 500 }
    );
  }
}