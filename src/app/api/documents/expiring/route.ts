import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// Function to calculate warning level based on days until expiry
function getExpiryStatus(expiryDate: Date) {
  const today = new Date();
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry <= 0) return 'expired';
  if (daysUntilExpiry <= 30) return 'critical';
  if (daysUntilExpiry <= 90) return 'warning';
  if (daysUntilExpiry <= 180) return 'notice';
  return 'good';
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

    const documents = await prisma.document.findMany({
      where: {
        userId: session.user.id,
        expiryDate: {
          lte: sixMonthsFromNow,
        },
        status: 'active',
      },
      orderBy: {
        expiryDate: 'asc',
      },
    });

    const documentsByExpiryStatus = documents.map(doc => ({
      ...doc,
      expiryStatus: getExpiryStatus(doc.expiryDate),
      daysUntilExpiry: Math.ceil(
        (new Date(doc.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      ),
    }));

    return NextResponse.json({
      documents: documentsByExpiryStatus,
      summary: {
        expired: documentsByExpiryStatus.filter(doc => doc.expiryStatus === 'expired').length,
        critical: documentsByExpiryStatus.filter(doc => doc.expiryStatus === 'critical').length,
        warning: documentsByExpiryStatus.filter(doc => doc.expiryStatus === 'warning').length,
        notice: documentsByExpiryStatus.filter(doc => doc.expiryStatus === 'notice').length,
      },
    });
  } catch (error) {
    console.error('Error fetching expiring documents:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}