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
  // Use current date as default end date to prevent counting future days
  const currentDate = new Date();
  
  // Special case: If it's a full year calculation (e.g., for "last year")
  const isFullYear = startDate && endDate && 
    startDate.getMonth() === 0 && startDate.getDate() === 1 && 
    endDate.getMonth() === 11 && endDate.getDate() === 31 &&
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getFullYear() < new Date().getFullYear();
  
  if (isFullYear) {
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
  
  // For other cases, use the original calculation with Math.ceil
  return stays.reduce((total, stay) => {
    if (stay.country !== country) return total;
    
    let start = new Date(stay.startDate);
    // Only use stay.endDate if it exists AND is before current date, otherwise use current date
    let end = stay.endDate && stay.endDate < currentDate ? new Date(stay.endDate) : new Date();
    
    // Adjust dates to fit within range if provided
    if (startDate && start < startDate) start = new Date(startDate);
    if (endDate && end > endDate) end = new Date(endDate);
    
    // Additional check to not exceed current date
    if (end > currentDate) end = currentDate;
    
    if (start > end) return total;
    
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    return total + days;
  }, 0);
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
  
  // Create a map of countries to total days
  const countryToDaysMap = new Map<string, number>();
  
  // Process each country's stays separately
  const uniqueCountries = [...new Set(stays.map(stay => stay.country))];
  
  uniqueCountries.forEach(country => {
    const countryStays = stays.filter(stay => stay.country === country);
    
    // Special case for "last year"
    const isFullLastYear = startDate && endDate && 
      startDate.getMonth() === 0 && startDate.getDate() === 1 && 
      endDate.getMonth() === 11 && endDate.getDate() === 31 &&
      startDate.getFullYear() === endDate.getFullYear() &&
      startDate.getFullYear() < new Date().getFullYear();
    
    if (isFullLastYear) {
      // Check if this country has complete coverage for the year
      const hasFullYearCoverage = countryStays.some(stay => 
        stay.startDate <= startDate && (!stay.endDate || stay.endDate >= endDate)
      );
      
      if (hasFullYearCoverage) {
        const year = startDate.getFullYear();
        countryToDaysMap.set(country, year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0) ? 366 : 365);
        return; // Skip regular calculation for this country
      }
    }
    
    // For regular calculation, use a more precise day counting approach
    const currentDate = new Date();
    let totalDays = 0;
    
    // Sort stays by start date
    const sortedStays = [...countryStays].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    
    // Track days we've already counted to avoid double counting
    const countedDays = new Set<string>();
    
    sortedStays.forEach(stay => {
      let start = new Date(stay.startDate);
      let end = stay.endDate && stay.endDate < currentDate ? new Date(stay.endDate) : new Date();
      
      // Adjust dates to fit within range if provided
      if (startDate && start < startDate) start = new Date(startDate);
      if (endDate && end > endDate) end = new Date(endDate);
      
      // Additional check to not exceed current date
      if (end > currentDate) end = currentDate;
      
      if (start > end) return;
      
      // Count each day once
      let current = new Date(start);
      while (current <= end) {
        const dateKey = current.toISOString().split('T')[0]; // YYYY-MM-DD format
        if (!countedDays.has(dateKey)) {
          countedDays.add(dateKey);
          totalDays++;
        }
        
        // Move to next day
        current.setDate(current.getDate() + 1);
      }
    });
    
    countryToDaysMap.set(country, totalDays);
  });
  
  // Now build the TaxRisk array using our accurate day counts
  return uniqueCountries.map(country => {
    const days = countryToDaysMap.get(country) || 0;
    
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
