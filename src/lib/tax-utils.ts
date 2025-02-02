import { Travel, Document } from '@prisma/client';
import { prisma } from '@/lib/prisma';

type ResidencyStatus = 'PERMANENT_RESIDENT' | 'TEMPORARY_RESIDENT' | 'NON_RESIDENT' | 'TAX_RESIDENT' | 'DIGITAL_NOMAD';

interface CountryStay {
  startDate: Date;
  endDate?: Date;
  country: string;
}

interface TaxRisk {
  country: string;
  days: number;
  risk: 'low' | 'medium' | 'high';
  status: ResidencyStatus | null;
  documentBased: boolean;
  validDocuments: Document[];
}

function travelToCountryStay(travel: Travel): CountryStay {
  return {
    startDate: new Date(travel.entry_date),
    endDate: travel.exit_date ? new Date(travel.exit_date) : undefined,
    country: travel.country
  };
}

export function calculateDaysInCountry(stays: CountryStay[], country: string): number {
  return stays.reduce((total, stay) => {
    if (stay.country !== country) return total;
    
    const start = new Date(stay.startDate);
    const end = stay.endDate ? new Date(stay.endDate) : new Date();
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    return total + days;
  }, 0);
}

export async function calculateTaxResidenceRisk(stays: CountryStay[]): Promise<TaxRisk[]> {
  const countryDays = new Map<string, number>();
  
  stays.forEach(stay => {
    const days = calculateDaysInCountry([stay], stay.country);
    countryDays.set(stay.country, (countryDays.get(stay.country) || 0) + days);
  });

  // Process all countries in parallel
  const results = await Promise.all(
    Array.from(countryDays.entries()).map(async ([country, days]) => {
      const threshold = await getCountryTaxThreshold(country);
      const risk = days > threshold ? 'high' as const : days > (threshold * 0.5) ? 'medium' as const : 'low' as const;
      
      return {
        country,
        days,
        risk,
        status: null,
        documentBased: false,
        validDocuments: []
      };
    })
  );

  return results;
}

export async function calculateTaxResidenceRiskFromTravels(travels: Travel[]) {
  const stays = travels.map(travelToCountryStay);
  return await calculateTaxResidenceRisk(stays);
}

export function calculateTaxYear(date: Date = new Date()): {
  start: Date;
  end: Date;
  daysElapsed: number;
  daysRemaining: number;
} {
  const year = date.getFullYear();
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  const daysElapsed = Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.floor((end.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    start,
    end,
    daysElapsed,
    daysRemaining
  };
}

export async function getCountryTaxThreshold(countryCode: string): Promise<number> {
  try {
    const rules = await prisma.countryTaxRules.findUnique({
      where: { country_code: countryCode }
    });
    return rules?.residency_threshold ?? 183; // fallback to 183 if no specific rule
  } catch (error) {
    console.error(`Error fetching tax rules for ${countryCode}:`, error);
    return 183; // fallback in case of error
  }
}
