import { Travel, Document, DocumentType, ResidencyStatus } from '@prisma/client';

interface CountryStay {
  startDate: Date;
  endDate?: Date;
  country: string;
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

interface ResidencyAssessment {
  country: string;
  days: number;
  risk: 'low' | 'medium' | 'high';
  status: ResidencyStatus | null;
  documentBased: boolean;
  validDocuments: Document[];
}

export async function calculateResidencyStatus(
  stays: CountryStay[],
  documents: Document[],
  country: string
): Promise<ResidencyAssessment> {
  const days = calculateDaysInCountry(stays, country);
  
  // Filter valid documents for this country
  const validDocuments = documents.filter(doc => 
    doc.issuingCountry === country && 
    new Date(doc.expiryDate!) > new Date() &&
    [DocumentType.RESIDENCY_PERMIT, DocumentType.VISA, DocumentType.TOURIST_VISA].includes(doc.type)
  );

  // Check for residency permit
  const residencyPermit = validDocuments.find(
    doc => doc.type === DocumentType.RESIDENCY_PERMIT
  );

  // Check for long-term visa
  const longTermVisa = validDocuments.find(
    doc => doc.type === DocumentType.VISA
  );

  // Check for tourist visa
  const touristVisa = validDocuments.find(
    doc => doc.type === DocumentType.TOURIST_VISA
  );

  // Determine status based on documents first
  if (residencyPermit) {
    return {
      country,
      days,
      risk: 'low', // Residence permit holders have clear status
      status: ResidencyStatus.PERMANENT_RESIDENT,
      documentBased: true,
      validDocuments: [residencyPermit]
    };
  }

  if (longTermVisa) {
    return {
      country,
      days,
      risk: 'low',
      status: ResidencyStatus.TEMPORARY_RESIDENT,
      documentBased: true,
      validDocuments: [longTermVisa]
    };
  }

  if (touristVisa) {
    const risk = days > (touristVisa.metadata?.maxStay || 90) ? 'high' : 'low';
    return {
      country,
      days,
      risk,
      status: ResidencyStatus.NON_RESIDENT,
      documentBased: true,
      validDocuments: [touristVisa]
    };
  }

  // If no valid documents, fall back to day counting
  return {
    country,
    days,
    risk: days > 180 ? 'high' : days > 90 ? 'medium' : 'low',
    status: days > 180 ? ResidencyStatus.TAX_RESIDENT : ResidencyStatus.NON_RESIDENT,
    documentBased: false,
    validDocuments: []
  };
}

export function calculateTaxResidenceRiskFromTravels(travels: Travel[]) {
  const stays = travels.map(travelToCountryStay);
  return calculateTaxResidenceRisk(stays);
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

export function getCountryTaxThreshold(countryCode: string): number {
  // This could be expanded with a proper lookup table or API
  return 183;  // Default 183 days for most countries
}
