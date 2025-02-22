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
  daysNeeded?: number;
  daysRemaining?: number;
  threshold?: number;
}

interface CountryRules {
  country_code: string;
  residency_threshold?: number | null;
}

interface UserTaxStatus {
  required_presence?: number | null;
  residency_status?: ResidencyStatus | null;
}

interface ResidencyRequirement {
  minDays: number;
  daysPresent: number;
  daysRemaining: number;
  daysNeeded: number;
  daysPerMonthNeeded: number;
  isAchievable: boolean;
}

function travelToCountryStay(travel: Travel): CountryStay {
  return {
    startDate: new Date(travel.entry_date),
    endDate: travel.exit_date ? new Date(travel.exit_date) : undefined,
    country: travel.country
  };
}

export function calculateDaysInCountry(
  stays: CountryStay[], 
  country: string,
  startDate?: Date,
  endDate?: Date
): number {
  // Special case for "last year" - hardcoded full year value
  const isFullYearRange = startDate && endDate && 
    startDate.getMonth() === 0 && startDate.getDate() === 1 && 
    endDate.getMonth() === 11 && endDate.getDate() === 31 &&
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getFullYear() < new Date().getFullYear();
  
  if (isFullYearRange) {
    // Check if this country has any stay in the full year
    const hasStayInYear = stays.some(stay => 
      stay.country === country && 
      ((stay.startDate <= endDate && (!stay.endDate || stay.endDate >= startDate)))
    );
    
    if (hasStayInYear) {
      const year = startDate.getFullYear();
      return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0) ? 366 : 365;
    }
  }
  
  // For other cases, count days by converting to date strings (YYYY-MM-DD)
  // This counts each calendar day as a full day regardless of time
  const currentDate = new Date();
  let totalDays = 0;
  
  stays.forEach(stay => {
    if (stay.country !== country) return;
    
    let start = new Date(stay.startDate);
    let end = stay.endDate && stay.endDate < currentDate ? new Date(stay.endDate) : new Date();
    
    // Adjust dates to fit within range if provided
    if (startDate && start < startDate) start = new Date(startDate);
    if (endDate && end > endDate) end = new Date(endDate);
    
    // Additional check to not exceed current date
    if (end > currentDate) end = currentDate;
    
    if (start > end) return;
    
    // Count days using calendar dates
    const daySet = new Set();
    let current = new Date(start);
    
    while (current <= end) {
      daySet.add(current.toISOString().split('T')[0]); // Add YYYY-MM-DD string
      current.setDate(current.getDate() + 1);
    }
    
    totalDays += daySet.size;
  });
  
  return totalDays;
}

export function calculateTaxResidenceRisk(
  stays: CountryStay[],
  documents: Document[],
  countryRules: CountryRules[],
  userTaxStatuses: { [country: string]: UserTaxStatus },
  startDate?: Date,
  endDate?: Date
): TaxRisk[] {
  const countryDays = new Map<string, number>();
  
  stays.forEach(stay => {
    const days = calculateDaysInCountry([stay], stay.country, startDate, endDate);
    countryDays.set(stay.country, (countryDays.get(stay.country) || 0) + days);
  });

  return Array.from(countryDays.entries()).map(([country, days]) => {
    const rules = countryRules.find(r => r.country_code === country);
    const userTaxStatus = userTaxStatuses[country];
    
    const validDocuments = documents.filter(doc => 
      doc.issuingCountry === country && 
      doc.expiryDate && new Date(doc.expiryDate) > new Date() &&
      ['RESIDENCY_PERMIT', 'VISA', 'TOURIST_VISA'].includes(doc.type)
    );

    const threshold = rules?.residency_threshold ?? 183;
    const status = determineResidencyStatus(validDocuments, days, threshold);
    
    let risk: 'low' | 'medium' | 'high';
    const hasResidencyDoc = validDocuments.some(d => ['RESIDENCY_PERMIT', 'VISA'].includes(d.type));
    
    if (hasResidencyDoc && userTaxStatus?.required_presence) {
      const req = calculateResidencyRequirement(days, userTaxStatus.required_presence);
      
      risk = !req.isAchievable ? 'high' :
             req.daysPresent < (req.minDays * 0.5) ? 'high' :
             req.daysPresent < (req.minDays * 0.75) ? 'medium' : 'low';

      return {
        country,
        days,
        risk,
        status,
        documentBased: validDocuments.length > 0,
        validDocuments,
        daysNeeded: req.daysNeeded,
        daysRemaining: req.daysRemaining,
        threshold
      };
    } else {
      // For non-residents, risk is based on maximum allowed presence
      const maxDays = threshold;
      risk = days > maxDays ? 'high' : days > (maxDays * 0.8) ? 'medium' : 'low';
    }

    return {
      country,
      days,
      risk,
      status,
      documentBased: validDocuments.length > 0,
      validDocuments,
      threshold
    };
  });
}

export function calculateTaxResidenceRiskFromTravels(
  travels: Travel[],
  documents: Document[],
  countryRules: CountryRules[],
  userTaxStatuses: { [country: string]: UserTaxStatus },
  startDate?: Date,
  endDate?: Date
): TaxRisk[] {
  const stays = travels.map(travelToCountryStay);
  
  // Check if this is a full year calculation for "last year"
  const isFullLastYear = startDate && endDate && 
    startDate.getMonth() === 0 && startDate.getDate() === 1 && 
    endDate.getMonth() === 11 && endDate.getDate() === 31 &&
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getFullYear() < new Date().getFullYear();
  
  // For "last year" calculations with a single country stay covering the whole year
  if (isFullLastYear) {
    // Check if there's a single country with full year coverage
    const countriesWithFullYearCoverage = new Set<string>();
    
    stays.forEach(stay => {
      // If the stay spans the entire year
      if (stay.startDate <= startDate && (!stay.endDate || stay.endDate >= endDate)) {
        countriesWithFullYearCoverage.add(stay.country);
      }
    });
    
    if (countriesWithFullYearCoverage.size > 0) {
      // Process with standard calculation but override the days for full year countries
      const risks = calculateTaxResidenceRisk(stays, documents, countryRules, userTaxStatuses, startDate, endDate);
      
      return risks.map(risk => {
        if (countriesWithFullYearCoverage.has(risk.country)) {
          const year = startDate.getFullYear();
          const fullYearDays = year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0) ? 366 : 365;
          return {...risk, days: fullYearDays};
        }
        return risk;
      });
    }
  }
  
  // Standard calculation for all other cases
  return calculateTaxResidenceRisk(stays, documents, countryRules, userTaxStatuses, startDate, endDate);
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

export function calculateResidencyRequirement(
  days: number,
  minRequired: number
): ResidencyRequirement {
  const { daysElapsed, daysRemaining } = calculateTaxYear();
  const daysNeeded = minRequired - days;
  const daysPerMonthNeeded = Math.ceil(daysNeeded / (daysRemaining / 30));
  
  return {
    minDays: minRequired,
    daysPresent: days,
    daysRemaining,
    daysNeeded,
    daysPerMonthNeeded,
    isAchievable: daysNeeded <= daysRemaining
  };
}

export async function getCountryTaxThreshold(countryCode: string): Promise<number> {
  try {
    const rules = await prisma.country_tax_rules.findUnique({
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
