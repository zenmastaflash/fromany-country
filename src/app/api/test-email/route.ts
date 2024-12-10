import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendExpirationNotification } from '@/lib/email';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    await sendExpirationNotification(
      session.user.email,
      'Test Document',
      30,
      'PASSPORT'
    );

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${session.user.email}`
    });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}