import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prisma } from '@/lib/prisma';
import { authConfig } from '@/lib/auth';
import { s3Client } from '@/lib/s3';

async function getPresignedUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key
  });
  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

export async function POST(request: Request) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) return new NextResponse('No file provided', { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `avatars/${session.user.id}/${Date.now()}-${file.name}`;

    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }));

    // Store only the key in the database, not the full URL
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        image: key  // Store only the key
      }
    });

    // Generate a presigned URL for immediate use
    const presignedUrl = await getPresignedUrl(key);
    
    return NextResponse.json({ imageUrl: presignedUrl });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Add GET endpoint for refreshing URLs
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true }
    });

    if (!user?.image) {
      return NextResponse.json({ imageUrl: null });
    }

    const presignedUrl = await getPresignedUrl(user.image);
    return NextResponse.json({ 
      imageUrl: presignedUrl,
      storedUrl: user.image
    });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
