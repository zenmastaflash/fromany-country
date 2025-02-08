import { Travel, Document, ResidencyStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';

interface CountryStay {
  startDate: Date;
  endDate?: Date;
  country: string;
}

export interface TaxRisk {
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

export async function calculateTaxResidenceRisk(
  stays: CountryStay[],
  documents: Document[],
  userId: string
): Promise<TaxRisk[]> {
  const countryDays = new Map<string, number>();
  
  stays.forEach(stay => {
    const days = calculateDaysInCountry([stay], stay.country);
    countryDays.set(stay.country, (countryDays.get(stay.country) || 0) + days);
  });

  const results = await Promise.all(
    Array.from(countryDays.entries()).map(async ([country, days]) => {
      let userTaxStatus = null;
      try {
        userTaxStatus = await prisma.user_tax_status.findFirst({
          where: {
            user_id: userId,
            country_code: country,
            tax_year: new Date().getFullYear()
          }
        });
      } catch (error) {
        console.error('Error fetching tax status:', error);
      }

      const rules = await prisma.country_tax_rules.findUnique({
        where: { country_code: country }
      });
      
      const validDocuments = documents.filter(doc => 
        doc.issuingCountry === country && 
        doc.expiryDate && new Date(doc.expiryDate) > new Date() &&
        ['RESIDENCY_PERMIT', 'VISA', 'TOURIST_VISA'].includes(doc.type)
      );

      const status = determineResidencyStatus(validDocuments, days, rules?.residency_threshold ?? 183);
      
      let risk: 'low' | 'medium' | 'high';
      const hasResidencyDoc = validDocuments.some(d => ['RESIDENCY_PERMIT', 'VISA'].includes(d.type));
      
      if (hasResidencyDoc && userTaxStatus?.required_presence) {
        // For residency holders, risk is based on minimum required presence
        const minDays = userTaxStatus.required_presence;
        risk = days < minDays ? 'high' : days < (minDays * 1.1) ? 'medium' : 'low';
      } else {
        // For non-residents, risk is based on maximum allowed presence
        const maxDays = rules?.residency_threshold ?? 183;
        risk = days > maxDays ? 'high' : days > (maxDays * 0.8) ? 'medium' : 'low';
      }

      return {
        country,
        days,
        risk,
        status,
        documentBased: validDocuments.length > 0,
        validDocuments
      };
    })
  );

  return results;
}

export async function calculateTaxResidenceRiskFromTravels(
  travels: Travel[],
  documents: Document[],
  userId: string
): Promise<TaxRisk[]> {
  const stays = travels.map(travelToCountryStay);
  return await calculateTaxResidenceRisk(stays, documents, userId);
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

function determineResidencyStatus(
  documents: Document[],
  days: number,
  threshold: number
): ResidencyStatus | null {
  const residencyPermit = documents.find(d => d.type === 'RESIDENCY_PERMIT');
  const visa = documents.find(d => d.type === 'VISA');
  const touristVisa = documents.find(d => d.type === 'TOURIST_VISA');

  if (residencyPermit) return 'PERMANENT_RESIDENT';
  if (visa) return 'TEMPORARY_RESIDENT';
  if (days > threshold) return 'TAX_RESIDENT';
  if (touristVisa) return 'NON_RESIDENT';
  return null;
}
