import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendExpirationNotification } from '@/lib/email';

// Helper function to get notification thresholds
function shouldNotify(daysUntilExpiry: number): boolean {
  // Notify at: 180, 90, 60, 30, 14, 7, 3, 1 days before expiry
  const notificationDays = [180, 90, 60, 30, 14, 7, 3, 1];
  return notificationDays.includes(daysUntilExpiry);
}

export async function GET(request: Request) {
  // Verify cron secret to ensure this is a legitimate cron job
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const documents = await prisma.document.findMany({
      where: {
        status: 'active',
      },
      include: {
        user: true,
      },
    });

    const today = new Date();
    let notificationsSent = 0;

    for (const doc of documents) {
      // Skip if no expiry date
      if (!doc.expiryDate) continue;

      const expiryDate = new Date(doc.expiryDate);
      const daysUntilExpiry = Math.ceil(
        (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (shouldNotify(daysUntilExpiry) && doc.user.email) {
        await sendExpirationNotification(
          doc.user.email,
          doc.fileName || 'Untitled Document',
          daysUntilExpiry,
          doc.type
        );
        notificationsSent++;
      }
    }

    return NextResponse.json({
      success: true,
      notificationsSent,
    });
  } catch (error) {
    console.error('Error checking document expirations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
