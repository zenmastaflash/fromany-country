// src/app/api/dashboard/route.ts
import { authConfig } from '@/lib/auth';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getCurrentLocation } from '@/lib/travel-utils';
import { calculateTaxResidenceRiskFromTravels } from '@/lib/tax-utils';
import { generateComplianceAlerts } from '@/lib/dashboard-utils';
import { withRetry } from '@/lib/auth-utils';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const dateRange = searchParams.get('dateRange') || 'current_year';

  const session = await getServerSession(authConfig);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Calculate date range
    const now = new Date();
    let startDate;
    let endDate = now;

    switch (dateRange) {
      case 'last_year':
        startDate = new Date(now.getFullYear() - 1, 0, 1);
        endDate = new Date(now.getFullYear() - 1, 11, 31);
        break;
      case 'current_year':
      default:
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    // Fetch all data in a single transaction with retry
    const [travels, documents, taxStatuses, countryRules] = await withRetry(() => 
      prisma.$transaction([
        // Get user's travel records within date range
        prisma.travel.findMany({
          where: { 
            user_id: session.user.id,
            entry_date: {
              gte: startDate,
              lte: endDate
            }
          },
          orderBy: { entry_date: 'desc' }
        }),
        // Get user's documents
        prisma.document.findMany({
          where: { userId: session.user.id }
        }),
        // Get user's tax statuses
        prisma.user_tax_status.findMany({
          where: { 
            user_id: session.user.id,
            tax_year: startDate.getFullYear()
          },
          select: {
            country_code: true,
            required_presence: true,
            residency_status: true
          }
        }),
        // Get all country rules
        prisma.country_tax_rules.findMany({
          select: {
            country_code: true,
            residency_threshold: true
          }
        })
      ])
    );

    // Convert tax statuses array to object for easier lookup
    const taxStatusesByCountry = taxStatuses.reduce((acc, status) => ({
      ...acc,
      [status.country_code]: status
    }), {});

    // Process the data
    const currentLocation = getCurrentLocation(travels);
    const taxRisks = calculateTaxResidenceRiskFromTravels(
      travels, 
      documents, 
      countryRules,
      taxStatusesByCountry
    );
    const complianceAlerts = generateComplianceAlerts(
      travels, 
      documents, 
      countryRules,
      taxStatusesByCountry
    );

    // Get date 6 months from now
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

    // Format critical dates - filter to next 6 months and sort by date
    const criticalDates = documents
      .filter(doc => doc.expiryDate && 
        doc.expiryDate > new Date() && 
        doc.expiryDate <= sixMonthsFromNow
      )
      .map(doc => ({
        type: doc.type.toLowerCase(),
        title: `${doc.title || 'Document'} Expiration`,
        date: doc.expiryDate && doc.expiryDate.toISOString(),
        description: doc.title || 'Document expiring',
        urgency: doc.expiryDate && getUrgencyFromDate(doc.expiryDate)
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return NextResponse.json({
      currentLocation: currentLocation ? {
        country: currentLocation.country,
        entryDate: currentLocation.entry_date.toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      } : null,
      countryStatuses: taxRisks.map(risk => ({
        country: risk.country,
        daysPresent: risk.days,
        threshold: countryRules.find(r => r.country_code === risk.country)?.residency_threshold ?? 183,
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

function getUrgencyFromDate(date) {
  const daysUntil = Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  if (daysUntil <= 30) return 'high';
  if (daysUntil <= 90) return 'medium';
  if (daysUntil < 183) return 'low';
  return 'low';
}
