export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { prisma } from '@/lib/prisma'; // Use existing Prisma instance

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? ''
  }
});

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session?.user?.id) { // Check for user ID specifically
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return new NextResponse('No file provided', { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const key = `documents/${session.user.id}/${Date.now()}-${file.name}`; // Organized folder structure

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type
      })
    );

    // Create document record with defaults
    const document = await prisma.document.create({
      data: {
        userId: session.user.id,
        fileName: file.name,
        fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        title: file.name,
        type: 'OTHER',
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        status: 'active'
      }
    });

    return NextResponse.json({ success: true, key, document });
  } catch (error) {
    console.error('Upload error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error uploading file' }), 
      { status: 500 }
    );
  }
}
