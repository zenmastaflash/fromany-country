import { Travel, Document, ResidencyStatus } from '@prisma/client';

export interface ComplianceAlert {
  type: 'tax' | 'visa' | 'entry' | 'exit' | 'document';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  actionRequired?: string;
}

export function generateComplianceAlerts(
  travels: any[],
  documents: any[],
  countryRules: any[],
  taxStatusesByCountry: any
) {
  const alerts = [];
  const now = new Date();

  // 1. Tax Residency Risk Alerts
  Object.entries(taxStatusesByCountry).forEach(([country, status]) => {
    const countryRule = countryRules.find(r => r.country_code === country);
    if (countryRule && status.required_presence > 0) {
      const remainingDays = countryRule.residency_threshold - status.required_presence;
      if (remainingDays <= 30) {
        alerts.push({
          type: 'tax',
          title: 'Tax Residency Risk',
          description: `Approaching tax residency threshold in ${country}`,
          severity: 'high',
          actionRequired: 'Review tax implications and consider travel plans'
        });
      }
    }
  });

  // 2. Visa/Stay Duration Alerts
  travels.forEach(travel => {
    // Check for stays exceeding 90 days without visa
    if (!travel.visa_expiry) {
      const entryDate = new Date(travel.entry_date);
      const daysInCountry = Math.ceil((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysInCountry >= 60) { // Alert at 60 days to give 30 days warning
        alerts.push({
          type: 'visa',
          title: 'Visa-Free Stay Limit Approaching',
          description: `You've been in ${travel.country} for ${daysInCountry} days. Most countries limit visa-free stays to 90 days.`,
          severity: daysInCountry >= 80 ? 'high' : 'medium',
          actionRequired: 'Apply for visa or plan departure'
        });
      }
    }
  });

  // 3. Missing Document Alerts
  const requiredDocTypes = ['passport'];  // Base requirement
  requiredDocTypes.forEach(type => {
    const hasValidDoc = documents.some(doc => 
      doc.type === type && 
      (!doc.expiryDate || 
       (doc.expiryDate > now && 
        // Most countries require passport validity of at least 6 months
        Math.ceil((doc.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) > 180))
    );
    if (!hasValidDoc) {
      alerts.push({
        type: 'document',
        title: 'Missing or Expiring Required Document',
        description: `No valid ${type.replace('_', ' ')} with at least 6 months validity found`,
        severity: 'high',
        actionRequired: 'Upload or renew document'
      });
    }
  });

  return alerts;
}
