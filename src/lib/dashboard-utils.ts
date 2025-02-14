import { Travel, Document, ResidencyStatus, DocumentType } from '@prisma/client';

interface TaxStatus {
  required_presence: number;
  residency_status?: ResidencyStatus;
  country_code: string;
  document_id?: string;
}

interface CountryRule {
  country_code: string;
  residency_threshold: number | null;
  tax_year_start?: string;
  day_counting_method?: string;
}

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
  countryRules: CountryRule[],
  taxStatusesByCountry: Record<string, TaxStatus>
): ComplianceAlert[] {
  const alerts: ComplianceAlert[] = [];
  const now = new Date();

  // Process current travels
  travels.forEach(travel => {
    if (!travel.exit_date || travel.exit_date > now) {
      // Check if there's a valid visa document for this stay
      const visaDoc = documents.find(doc => 
        (doc.type === DocumentType.VISA || doc.type === DocumentType.TOURIST_VISA) &&
        doc.issuingCountry === travel.country &&
        doc.status === 'active' &&
        (!doc.expiryDate || doc.expiryDate > now)
      );

      const entryDate = new Date(travel.entry_date);
      const daysInCountry = Math.ceil((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));

      // Alert if no visa and approaching 90 days
      if (!visaDoc && daysInCountry >= 60) {
        alerts.push({
          type: 'visa',
          title: 'Visa-Free Stay Limit Approaching',
          description: `You've been in ${travel.country} for ${daysInCountry} days. Most countries limit visa-free stays to 90 days.`,
          severity: daysInCountry >= 80 ? 'high' : 'medium',
          actionRequired: 'Apply for visa or plan departure'
        });
      }

      // Check residency status if one exists
      const taxStatus = taxStatusesByCountry[travel.country];
      if (taxStatus) {
        const countryRule = countryRules.find(r => r.country_code === travel.country);
        if (countryRule?.residency_threshold) {
          const daysRemaining = countryRule.residency_threshold - taxStatus.required_presence;
          if (daysRemaining <= 30) {
            alerts.push({
              type: 'tax',
              title: 'Tax Residency Risk',
              description: `${daysRemaining} days until potential tax residency in ${travel.country}`,
              severity: daysRemaining <= 15 ? 'high' : 'medium',
              actionRequired: 'Review tax implications or plan travel'
            });
          }
        }
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
