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
  let session;
  try {
    session = await getServerSession(authOptions);
    console.log('Upload session:', {
      exists: !!session,
      user: session?.user ? {
        id: session.user.id,
        email: session.user.email
      } : null
    });

    if (!session?.user?.id) {
      console.error('No user ID in session');
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized', details: 'Please sign in again' }),
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('No file provided');
      return new NextResponse(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400 }
      );
    }

    // Create user-specific folder path
    const userFolder = `users/${session.user.id}`;
    const uniqueFilename = `${userFolder}/${Date.now()}-${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to S3 in user's folder
    console.log('Uploading to S3:', {
      bucket: process.env.AWS_BUCKET_NAME,
      key: uniqueFilename,
      type: file.type
    });

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

    console.log('Document created:', document.id);
    return NextResponse.json(document);
  } catch (error) {
    console.error('Error in upload route:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      session: session ? { id: session.user?.id, email: session.user?.email } : null
    });

    return new NextResponse(
      JSON.stringify({ 
        error: 'Upload failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500 }
    );
  }
}