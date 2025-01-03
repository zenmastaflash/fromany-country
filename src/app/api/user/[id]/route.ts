import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authConfig } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authConfig);

  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Users can only access their own profile
  if (session.user.id !== params.id) {
    return new NextResponse('Forbidden', { status: 403 });
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
        notificationPreferences: true,
        primaryCurrency: true,
        taxResidency: true,
        emergencyContact: true,
        preferredLanguage: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
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
    const body = await request.json();
    console.log('Update request body:', body); // Debug log

    // Update the user profile with all fields
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        displayName: body.displayName,
        bio: body.bio,
        location: body.location,
        visibility: body.visibility,
        socialLinks: body.socialLinks,
        notificationPreferences: body.notificationPreferences,
        primaryCurrency: body.primaryCurrency,
        taxResidency: body.taxResidency,
        emergencyContact: body.emergencyContact,
        preferredLanguage: body.preferredLanguage,
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
