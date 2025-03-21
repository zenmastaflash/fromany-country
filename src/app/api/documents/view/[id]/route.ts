import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prisma } from '@/lib/prisma';
import { authConfig } from '@/lib/auth';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

  try {
    // Check if user has access to this document
    const document = await prisma.document.findUnique({
      where: { 
        id: params.id,
        OR: [
          { userId: session.user.id },
          { sharedWith: { has: session.user.email } }
        ]
      }
    });

    if (!document) {
      return new NextResponse('Document not found', { status: 404 });
    }

    if (!document.fileUrl) {
      return new NextResponse('Document file not found', { status: 404 });
    }

    // Extract the key from the full URL
    const urlParts = document.fileUrl.split('.amazonaws.com/');
    if (urlParts.length !== 2) {
      return new NextResponse('Invalid file URL', { status: 400 });
    }
    const key = urlParts[1];

    // Generate presigned URL
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      ResponseContentDisposition: `inline; filename="${document.fileName}"`,
      ResponseContentType: document.fileName?.toLowerCase().endsWith('.pdf') 
        ? 'application/pdf' 
        : 'image/jpeg',
    });
    
    const url = await getSignedUrl(s3, command, { 
      expiresIn: 3600 
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error generating document URL:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
