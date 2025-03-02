// src/app/api/tax-advisor/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';
import { analyzeTaxSituation } from '@/services/ai/taxAdvisor';
import { TaxRule, UserData } from '@/services/ai/taxAdvisor';

export const runtime = 'nodejs';  // Or 'edge' depending on your deployment
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
    
    // Get current year for filtering
    const currentYear = new Date().getFullYear();
    
    // Get user's travel data from database
    const travelData = await prisma.travel.findMany({
      where: {
        user_id: userId,
        OR: [
          { 
            entry_date: {
              gte: new Date(`${currentYear - 1}-01-01`),
            } 
          },
          { 
            exit_date: null 
          }
        ]
      },
      orderBy: {
        entry_date: 'asc',
      },
    });
    
    // Format travel data for analysis.
    const formattedTravelData = travelData.map(entry => ({
      country: entry.country,
      entry_date: entry.entry_date.toISOString(),
      exit_date: entry.exit_date ? entry.exit_date.toISOString() : null,
      city: entry.city ?? undefined,
      purpose: entry.purpose ?? undefined,
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
    
    // Analyze tax situation
    const analysisResults = await analyzeTaxSituation(userData, formattedTaxRules);
    
    return NextResponse.json(analysisResults);
  } catch (error) {
    console.error('Error in tax-advisor API:', error);
    return NextResponse.json(
      { error: 'Failed to process tax analysis' },
      { status: 500 }
    );
  }
}
