import { Travel, Document } from '@prisma/client';
import { calculateTaxResidenceRiskFromTravels } from './tax-utils';
import { getCurrentLocation, getUpcomingDepartures } from './travel-utils';

interface CountryRules {
  country_code: string;
  residency_threshold?: number | null;
}

interface UserTaxStatus {
  required_presence?: number | null;
  residency_status?: ResidencyStatus | null;
}

export interface ComplianceAlert {
  type: 'tax' | 'visa' | 'entry' | 'exit';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  actionRequired?: string;
}

export function generateComplianceAlerts(
  travels: Travel[], 
  documents: Document[],
  countryRules: CountryRules[],
  userTaxStatuses: { [country: string]: UserTaxStatus }
): ComplianceAlert[] {
  const alerts: ComplianceAlert[] = [];
  
  // Tax residency alerts
  const taxRisks = calculateTaxResidenceRiskFromTravels(
    travels, 
    documents,
    countryRules,
    userTaxStatuses
  );

  taxRisks.forEach(risk => {
    if (risk.risk !== 'low') {
      alerts.push({
        type: 'tax',
        title: `Tax Residency Risk in ${risk.country}`,
        description: `You have spent ${risk.days} days in ${risk.country} this year`,
        severity: risk.risk,
        actionRequired: risk.risk === 'high' 
          ? 'Consider immediate departure to avoid tax residency' 
          : 'Monitor your stay duration carefully'
      });
    }
  });

  // Visa/Stay expiration alerts
  const upcomingDepartures = getUpcomingDepartures(travels);
  upcomingDepartures.forEach(travel => {
    if (travel.exit_date) {
      const daysUntil = Math.ceil(
        (new Date(travel.exit_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      
      alerts.push({
        type: 'visa',
        title: `Departure Required from ${travel.country}`,
        description: `Your permitted stay ends in ${daysUntil} days`,
        severity: daysUntil <= 7 ? 'high' : daysUntil <= 14 ? 'medium' : 'low',
        actionRequired: `Plan departure by ${new Date(travel.exit_date).toLocaleDateString()}`
      });
    }
  });

  return alerts.sort((a, b) => 
    ['high', 'medium', 'low'].indexOf(a.severity) - 
    ['high', 'medium', 'low'].indexOf(b.severity)
  );
}
