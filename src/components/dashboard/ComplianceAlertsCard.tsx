import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';

interface ComplianceAlert {
  type: 'tax' | 'visa' | 'entry' | 'exit';
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

  // Process residency statuses and requirements
  Object.entries(taxStatusesByCountry).forEach(([country, status]) => {
    const countryRule = countryRules.find(r => r.country_code === country);
    if (countryRule?.residency_threshold) {
      const residencyDoc = documents.find(doc => 
        doc.type === DocumentType.RESIDENCY_PERMIT &&
        doc.issuingCountry === country &&
        doc.status === 'active'
      );

      if (residencyDoc) {
        // For residents, show achievement or remaining days needed
        if (status.required_presence >= countryRule.residency_threshold) {
          alerts.push({
            type: 'tax',
            title: 'Residency Achievement',
            description: `You have met the ${countryRule.residency_threshold} day requirement for ${country} with ${status.required_presence} days present`,
            severity: 'low'
          });
        } else {
          const daysNeeded = countryRule.residency_threshold - status.required_presence;
          alerts.push({
            type: 'tax',
            title: `Residency Days Needed - ${country}`,
            description: `${daysNeeded} more days needed to maintain residency status`,
            severity: daysNeeded <= 30 ? 'high' : 'medium',
            actionRequired: 'Plan travel to meet residency requirements'
          });
        }
      } else {
        // For non-residents, warn about approaching tax residency
        if (status.required_presence >= countryRule.residency_threshold - 30) {
          alerts.push({
            type: 'tax',
            title: 'Tax Residency Risk',
            description: `Approaching tax residency threshold in ${country} (${status.required_presence}/${countryRule.residency_threshold} days)`,
            severity: 'high',
            actionRequired: 'Review tax implications of continued stay'
          });
        }
      }
    }
  });

  // Check current travels for visa/stay duration
  travels.forEach(travel => {
    if (!travel.exit_date || travel.exit_date > now) {
      const visaDoc = documents.find(doc => 
        (doc.type === DocumentType.VISA || doc.type === DocumentType.TOURIST_VISA) &&
        doc.issuingCountry === travel.country &&
        doc.status === 'active'
      );

      const entryDate = new Date(travel.entry_date);
      const daysInCountry = Math.ceil((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));

      if (!visaDoc && daysInCountry >= 60) {
        alerts.push({
          type: 'visa',
          title: `Stay Duration Alert - ${travel.country}`,
          description: `You've been in ${travel.country} for ${daysInCountry} days. Most countries limit visa-free stays to 90 days.`,
          severity: daysInCountry >= 80 ? 'high' : 'medium',
          actionRequired: 'Apply for visa or plan departure'
        });
      }
    }
  });

  return alerts;
}

export default function ComplianceAlertsCard({ alerts }: { alerts: ComplianceAlert[] }) {
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-50 text-red-800';
      case 'medium': return 'border-yellow-500 bg-yellow-50 text-yellow-800';
      default: return 'border-blue-500 bg-blue-50 text-blue-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Compliance Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <Alert key={index} className={`border-l-4 ${getSeverityStyles(alert.severity)}`}>
              <AlertTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                {alert.title}
              </AlertTitle>
              <AlertDescription className="mt-2">
                <p>{alert.description}</p>
                {alert.actionRequired && (
                  <p className="mt-2 font-medium">
                    Required Action: {alert.actionRequired}
                  </p>
                )}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
