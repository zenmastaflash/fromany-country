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

    // Validate the body data
    const { displayName, bio, location, visibility, socialLinks } = body;
    if (visibility && !['public', 'private'].includes(visibility)) {
      return new NextResponse('Invalid visibility value', { status: 400 });
    }

    // Update the user profile
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        displayName,
        bio,
        location,
        visibility,
        socialLinks,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
