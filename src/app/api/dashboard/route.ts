// src/app/api/dashboard/route.ts
import { ResidencyStatus } from '@prisma/client';
import type { TaxRisk } from '@/lib/tax-utils';
import { authConfig } from '@/lib/auth';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getCurrentLocation } from '@/lib/travel-utils';
import { calculateTaxResidenceRiskFromTravels } from '@/lib/tax-utils';
import { generateComplianceAlerts } from '@/lib/dashboard-utils';
import { withRetry } from '@/lib/auth-utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
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
        endDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
        break;
      case 'rolling_year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
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
            OR: [
              // Entries within the date range
              {
                entry_date: {
                  gte: startDate,
                  lte: endDate
                }
              },
              // Entries that started before but extend into the range
              {
                entry_date: {
                  lt: startDate
                },
                exit_date: {
                  gte: startDate
                }
              }
            ]
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
            tax_year: dateRange === 'last_year' ? startDate.getFullYear() : now.getFullYear()
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
      taxStatusesByCountry,
      startDate,
      endDate
    );
    const complianceAlerts = generateComplianceAlerts(
      travels, 
      documents, 
      countryRules,
      taxRisks
    );

    // Get date 6 months from now
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

    // Format critical dates - filter to next 6 months and sort by date
    const criticalDates = documents
      .filter(doc => {
        if (!doc.expiryDate) return false;
        const now = new Date();
        return doc.expiryDate > now && doc.expiryDate <= sixMonthsFromNow;
      })
      .map(doc => ({
        type: doc.type.toLowerCase(),
        title: `${doc.title || 'Document'} Expiration`,
        date: doc.expiryDate!.toISOString(), // Non-null assertion is safe here due to filter
        description: doc.title || 'Document expiring',
        urgency: getUrgencyFromDate(doc.expiryDate!) // Non-null assertion is safe here due to filter
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const getTimeMessage = (risk: TaxRisk & { threshold: number }) => {
      if (!risk.documentBased) {
        return `${Math.max(0, risk.threshold - risk.days)} days until tax residency`;
      }

      if (risk.status === 'PERMANENT_RESIDENT' || risk.status === 'TEMPORARY_RESIDENT') {
        if (risk.days >= risk.threshold) {
          return `Minimum residency requirement met (${risk.threshold} days)`;
        }
        return `${Math.max(0, risk.threshold - risk.days)} days needed to maintain residency`;
      }

      return `${Math.max(0, risk.threshold - risk.days)} days until limit`;
    };

    const getThresholdColor = (risk: TaxRisk & { threshold: number }) => {
      const percentage = (risk.days / risk.threshold) * 100;
      const isRequirementMet = risk.days >= risk.threshold;
      
      // For residency permits and working visas
      if (risk.status === 'PERMANENT_RESIDENT' || risk.status === 'TEMPORARY_RESIDENT') {
        return isRequirementMet ? "bg-blue-500" : "bg-red-500";
      }
      
      // For other cases (tax residency warning)
      if (percentage >= 100) return "bg-red-500";  // Over limit
      if (percentage < 60) return "bg-green-500";  // Safe
      if (percentage < 80) return "bg-yellow-500";  // Getting close
      return "bg-red-500";  // Very close
    };

    return NextResponse.json({
      currentLocation: currentLocation ? {
        country: currentLocation.country,
        entryDate: currentLocation.entry_date.toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      } : null,
      countryStatuses: taxRisks.map(risk => {
        const threshold = countryRules.find(r => r.country_code === risk.country)?.residency_threshold ?? 183;
        const progressValue = risk.status === 'PERMANENT_RESIDENT' || risk.status === 'TEMPORARY_RESIDENT'
          ? Math.min((risk.days / threshold) * 100, 100)  // Cap at 100% for residency
          : (risk.days / threshold) * 100;  // Allow over 100% for tax residency warning

        return {
          country: risk.country,
          daysPresent: risk.days,
          threshold,
          lastEntry: travels.find(t => t.country === risk.country)?.entry_date.toISOString() || '',
          residencyStatus: risk.status,
          documentBased: risk.documentBased,
          timeMessage: getTimeMessage({ ...risk, threshold }),
          thresholdColor: getThresholdColor({ ...risk, threshold }),
          progressValue
        };
      }),
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
  if (daysUntil < 183) return 'low';
  return 'low';
}
