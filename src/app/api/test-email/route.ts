import { NextResponse } from 'next/server';
import { config as authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { sendExpirationNotification } from '@/lib/email';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    await sendExpirationNotification(
      session.user.email,
      'Test Document',
      7,
      'PASSPORT'
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    );
  }
}
