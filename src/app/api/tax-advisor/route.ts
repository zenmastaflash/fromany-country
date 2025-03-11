// src/app/api/tax-advisor/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';
import { analyzeTaxSituation, TaxRule, UserData, DocumentEntry } from '@/services/ai/taxAdvisor';
import { calculateTaxResidenceRiskFromTravels, TaxRisk } from '@/lib/tax-utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;
export const maxDuration = 60;  // In seconds

export async function POST(req: NextRequest) {
  try {
    // Authenticate the request
    const token = await getToken({ req });
    if (!token?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = token.sub as string;
    
    // Extract dateRange from request body
    const body = await req.json();
    const { dateRange = 'current_year' } = body;
    
    // Calculate date range using the same logic as in dashboard API
    const now = new Date();
    let startDate;
    let endDate = now;
    let dateRangeDescription = 'Current Year';

    switch (dateRange) {
      case 'last_year':
        startDate = new Date(now.getFullYear() - 1, 0, 1);
        endDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
        dateRangeDescription = 'Last Calendar Year';
        break;
      case 'rolling_year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        dateRangeDescription = 'Past 365 Days';
        break;
      case 'current_year':
      default:
        startDate = new Date(now.getFullYear(), 0, 1);
        dateRangeDescription = 'Current Year';
        break;
    }
    
    // Get user's travel data from database with correct date range
    const travelData = await prisma.travel.findMany({
      where: {
        user_id: userId,
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
      orderBy: {
        entry_date: 'asc',
      },
    });
    
    // Format travel data for analysis
    const formattedTravelData = travelData.map(entry => ({
      country: entry.country,
      entry_date: entry.entry_date.toISOString(),
      exit_date: entry.exit_date ? entry.exit_date.toISOString() : null,
      city: entry.city ?? undefined,
      purpose: entry.purpose ?? undefined,
    }));

    // Get documents
    const documents = await prisma.document.findMany({
      where: {
        userId: userId,
        type: { in: ['PASSPORT', 'VISA', 'TOURIST_VISA', 'RESIDENCY_PERMIT'] },
        status: 'active',
      },
    });

    // Format document data
    const formattedDocuments = documents.map(doc => ({
      type: doc.type,
      status: doc.status,
      country: doc.issuingCountry || '',
      expiryDate: doc.expiryDate?.toISOString(),
      issuingCountry: doc.issuingCountry || '',
    }));
    
    // Get user profile for additional data like citizenship
    const userProfile = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        taxResidency: true,
      },
    });
    
    // Create user data object
    const userData: UserData = {
      userId,
      citizenship: userProfile?.taxResidency ?? undefined,
      travel_history: formattedTravelData,
      documents: formattedDocuments,
    };
    
    // Get tax rules from countries user has traveled to
    const countries = travelData.map(entry => entry.country);
    const taxRules = await prisma.country_tax_rules.findMany({
      where: {
        country_code: {
          in: countries,
        },
      },
    });
    
    // Format tax rules
    const formattedTaxRules: TaxRule[] = taxRules.map(rule => ({
      country_code: rule.country_code,
      name: rule.name,
      residency_threshold: rule.residency_threshold,
      special_rules: rule.special_rules,
      tax_year_start: rule.tax_year_start ?? undefined,
      tax_treaties: rule.tax_treaties ?? undefined,
    }));
    
    // Get user tax status data
    const userTaxStatuses = await prisma.user_tax_status.findMany({
      where: {
        user_id: userId,
        country_code: {
          in: countries,
        },
      },
    });
    
    // Format to object for easier lookup
    const userTaxStatusMap: { [country: string]: { required_presence?: number | null; residency_status?: string | null } } = {};
    userTaxStatuses.forEach(status => {
      userTaxStatusMap[status.country_code] = {
        required_presence: status.required_presence,
        residency_status: status.residency_status,
      };
    });
    
    // CALCULATE TAX RISKS USING TAX-UTILS FUNCTIONS
    const taxRisks: TaxRisk[] = calculateTaxResidenceRiskFromTravels(
      travelData,
      documents,
      taxRules,
      userTaxStatusMap,
      startDate,
      endDate
    );
    
    // Group documents by country for AI analysis
    const documentsByCountry: Record<string, DocumentEntry[]> = {};
    formattedDocuments.forEach(doc => {
      const country = doc.issuingCountry;
      if (!documentsByCountry[country]) {
        documentsByCountry[country] = [];
      }
      documentsByCountry[country].push(doc);
    });
    
    // Create the calculated data package
    const calculatedData = {
      taxRisks,
      documentsByCountry,
      dateRangeDescription
    };
    
    // Analyze tax situation using the pre-calculated data
    const analysisResults = await analyzeTaxSituation(userData, formattedTaxRules, calculatedData);
    
    return NextResponse.json(analysisResults);
  } catch (error) {
    console.error('Error in tax-advisor API:', error);
    return NextResponse.json(
      { error: 'Failed to process tax analysis' },
      { status: 500 }
    );
  }
}
