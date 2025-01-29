import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authConfig } from '@/lib/auth';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '@/lib/s3';
import type { Prisma } from '@prisma/client';

// Use Prisma's update type
type UserUpdateInput = Omit<Prisma.UserUpdateInput, 'accounts' | 'sessions' | 'documents'>;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authConfig);

  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        displayName: true,
        bio: true,
        location: true,
        visibility: true,
        socialLinks: true,
        image: true,
        notificationPreferences: true,
        primaryCurrency: true,
        taxResidency: true,
        emergencyContact: true,
        preferredLanguage: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // If there's an image stored, get a presigned URL
    if (user.image) {
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: user.image
      });
      
      try {
        const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        user.image = presignedUrl;
      } catch (error) {
        console.error('Error generating presigned URL:', error);
        user.image = null; // Reset image if we can't generate URL
      }
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authConfig);

  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Users can only update their own profile
  if (session.user.id !== params.id) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    const body: UserUpdateInput = await request.json();

    // Update the user profile with all fields
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authConfig);

  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if (session.user.id !== params.id) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    // Delete related records first
    await prisma.$transaction([
      // Delete documents
      prisma.document.deleteMany({
        where: { userId: params.id },
      }),
      
      // Delete sessions
      prisma.session.deleteMany({
        where: { userId: params.id },
      }),
      
      // Delete accounts
      prisma.account.deleteMany({
        where: { userId: params.id },
      }),

      // Finally delete user
      prisma.user.delete({
        where: { id: params.id },
      }),
    ]);

    return NextResponse.json({ signOut: true });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
  }
}
