// src/app/api/dashboard/route.ts
import { authConfig } from '@/lib/auth';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getCurrentLocation } from '@/lib/travel-utils';
import { calculateTaxResidenceRiskFromTravels } from '@/lib/tax-utils';
import { generateComplianceAlerts } from '@/lib/dashboard-utils';

export async function GET() {
  const session = await getServerSession(authConfig);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch all data in a single transaction
    const [travels, documents] = await prisma.$transaction([
      prisma.travel.findMany({
        where: { user_id: session.user.id },
        orderBy: { entry_date: 'desc' }
      }),
      prisma.document.findMany({
        where: { userId: session.user.id }
      })
    ]);

    // Process the data
    const currentLocation = getCurrentLocation(travels);
    const taxRisks = await calculateTaxResidenceRiskFromTravels(travels, documents, session.user.id);
    const complianceAlerts = await generateComplianceAlerts(travels, documents, session.user.id);

    // Format critical dates
    const criticalDates = documents
      .filter(doc => doc.expiryDate)
      .map(doc => ({
        type: doc.type.toLowerCase(),
        title: `${doc.title || 'Document'} Expiration`,
        date: doc.expiryDate!.toISOString(),
        description: doc.title || 'Document expiring',
        urgency: getUrgencyFromDate(doc.expiryDate!)
      }));

    return NextResponse.json({
      currentLocation: currentLocation ? {
        country: currentLocation.country,
        entryDate: currentLocation.entry_date.toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      } : null,
      countryStatuses: taxRisks.map(risk => ({
        country: risk.country,
        daysPresent: risk.days,
        threshold: 183,
        lastEntry: travels.find(t => t.country === risk.country)?.entry_date.toISOString() || '',
        residencyStatus: risk.status,
        documentBased: risk.documentBased
      })),
      criticalDates,
      complianceAlerts
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

function getUrgencyFromDate(date: Date): 'high' | 'medium' | 'low' {
  const daysUntil = Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  if (daysUntil <= 30) return 'high';
  if (daysUntil <= 90) return 'medium';
  return 'low';
}
