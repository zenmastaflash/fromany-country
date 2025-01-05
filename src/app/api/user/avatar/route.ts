import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { prisma } from '@/lib/prisma';
import { authConfig } from '@/lib/auth';

// Initialize S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) return new NextResponse('No file provided', { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `avatars/${session.user.id}/${Date.now()}-${file.name}`;

    await s3.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }));

    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: imageUrl },
      select: { image: true }
    });

    return NextResponse.json({ imageUrl: updatedUser.image });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
