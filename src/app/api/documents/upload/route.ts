import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? ''
  }
});

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session) {
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

    const key = `${session.user?.email}/${Date.now()}-${file.name}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type
      })
    );

    return NextResponse.json({ success: true, key });
  } catch (error) {
    console.error('Upload error:', error);
    return new NextResponse('Error uploading file', { status: 500 });
  }
}