import { Travel, Document, ResidencyStatus, DocumentType } from '@prisma/client';
import { TaxRisk } from './tax-utils';

export interface ComplianceAlert {
  type: 'tax' | 'visa' | 'entry' | 'exit' | 'document';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  actionRequired?: string;
}

export function generateComplianceAlerts(
  travels: Travel[],
  documents: Document[],
  countryRules: { country_code: string; residency_threshold: number | null }[],
  taxRisks: TaxRisk[]
): ComplianceAlert[] {
  const alerts: ComplianceAlert[] = [];
  const now = new Date();

  // Use taxRisks for residency alerts
  taxRisks.forEach(risk => {
    if (risk.documentBased && risk.days >= (risk.threshold ?? 183)) {
      alerts.push({
        type: 'tax',
        title: 'Residency Requirement Met',
        description: `You have met the minimum residency requirement for ${risk.country} (${risk.days} days)`,
        severity: 'low'
      });
    } else if (risk.daysNeeded && risk.daysNeeded <= 30) {
      alerts.push({
        type: 'tax',
        title: 'Tax Residency Risk',
        description: `${risk.daysNeeded} days until potential tax residency in ${risk.country}`,
        severity: risk.daysNeeded <= 15 ? 'high' : 'medium',
        actionRequired: 'Review tax implications or plan travel'
      });
    }
  });

  // Process current travels
  travels.forEach(travel => {
    if (!travel.exit_date || travel.exit_date > now) {
      // Check if there's a valid visa or residency permit document for this stay
      const validDoc = documents.find(doc => 
        (doc.type === DocumentType.VISA || 
         doc.type === DocumentType.TOURIST_VISA || 
         doc.type === DocumentType.RESIDENCY_PERMIT) &&
        doc.issuingCountry === travel.country &&
        doc.status === 'active' &&
        (!doc.expiryDate || doc.expiryDate > now)
      );

      const entryDate = new Date(travel.entry_date);
      const daysInCountry = Math.ceil((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));

      // Alert if no visa and approaching 90 days
      if (!validDoc && daysInCountry >= 60) {
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

  // Check passport validity
  const passport = documents.find(doc => 
    doc.type === DocumentType.PASSPORT && 
    doc.status === 'active'
  );

  if (!passport || !passport.expiryDate) {
    alerts.push({
      type: 'document',
      title: 'Missing Passport Information',
      description: 'No valid passport found in your documents',
      severity: 'high',
      actionRequired: 'Upload current passport details'
    });
  } else if (passport.expiryDate) {
    const monthsToExpiry = Math.ceil((passport.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30));
    if (monthsToExpiry <= 6) {
      alerts.push({
        type: 'document',
        title: 'Passport Expiring Soon',
        description: `Your passport expires in ${monthsToExpiry} months. Many countries require 6 months validity.`,
        severity: monthsToExpiry <= 3 ? 'high' : 'medium',
        actionRequired: 'Begin passport renewal process'
      });
    }
  }

  return alerts;
}
