import { Travel } from '@prisma/client';

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

export function calculateTaxResidenceRisk(stays: CountryStay[]): {
  country: string;
  days: number;
  risk: 'low' | 'medium' | 'high';
}[] {
  const countryDays = new Map<string, number>();
  
  stays.forEach(stay => {
    const days = calculateDaysInCountry([stay], stay.country);
    countryDays.set(stay.country, (countryDays.get(stay.country) || 0) + days);
  });
  
  return Array.from(countryDays.entries()).map(([country, days]) => ({
    country,
    days,
    risk: days > 180 ? 'high' : days > 90 ? 'medium' : 'low'
  }));
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
