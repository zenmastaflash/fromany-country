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

    // Get file buffer and metadata
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileType = file.type;
    const fileExt = fileType.split('/')[1];
    
    // Create unique filename
    const key = `avatars/${session.user.id}/${Date.now()}.${fileExt}`;

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: fileType,
    });

    await s3.send(command);

    // Generate the URL
    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        image: imageUrl,
        updatedAt: new Date()
      },
      select: { image: true }
    });

    return NextResponse.json({ 
      imageUrl: updatedUser.image,
      success: true 
    });

  } catch (error) {
    console.error('Error uploading avatar:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to upload image',
        success: false
      }), 
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
