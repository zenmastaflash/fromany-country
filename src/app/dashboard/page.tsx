import { requireAuth } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { getCurrentLocation } from '@/lib/travel-utils';
import { calculateTaxResidenceRiskFromTravels } from '@/lib/tax-utils';
import { generateComplianceAlerts } from '@/lib/dashboard-utils';
import TaxLiabilityCard from '@/components/dashboard/TaxLiabilityCard';
import CriticalDatesCard from '@/components/dashboard/CriticalDatesCard';
import ComplianceAlertsCard from '@/components/dashboard/ComplianceAlertsCard';
import { Travel, Document, ResidencyStatus } from '@prisma/client';
import type { TaxRisk } from '@/lib/tax-utils';

export default async function DashboardPage() {
  const session = await requireAuth();

  // Fetch travel data
  const travels = await prisma.travel.findMany({
    where: { user_id: session.user.id },
    orderBy: { entry_date: 'desc' }
  });

  // TODO: Fetch document data for critical dates
  const documents = await prisma.document.findMany({
    where: { userId: session.user.id }
  });

  // Use our utils to get dashboard data
  let currentLocation = getCurrentLocation(travels);
  let taxRisks: TaxRisk[] = await calculateTaxResidenceRiskFromTravels(travels, documents, session.user.id);
  let complianceAlerts = await generateComplianceAlerts(travels, documents, session.user.id);

  // Format data for components
  const formattedLocation = currentLocation ? {
    country: currentLocation.country,
    entryDate: currentLocation.entry_date.toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  } : null;

  const countryStatuses = taxRisks.map(risk => ({
    country: risk.country,
    daysPresent: risk.days,
    threshold: 183,
    lastEntry: travels.find(t => t.country === risk.country)?.entry_date.toISOString() || '',
    residencyStatus: risk.status,
    documentBased: risk.documentBased
  }));

  // Generate critical dates from travel and documents
  const criticalDates = [
    // Document expiry dates
    ...documents
      .filter(doc => doc.expiryDate)
      .map(doc => ({
        type: doc.type.toLowerCase() as 'visa' | 'document',
        title: `${doc.title || 'Document'} Expiration`,
        date: doc.expiryDate!.toISOString(),
        description: doc.title || 'Document expiring',
        urgency: getUrgencyFromDate(doc.expiryDate!)
      })),
    // Add tax filing deadlines if needed
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-text">Dashboard</h1>
          <p className="text-link mt-2">Welcome back, {session.user?.name}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaxLiabilityCard 
          currentLocation={formattedLocation || { 
            country: 'Not Set',
            entryDate: new Date().toISOString(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          }}
          countryStatuses={countryStatuses}
        />
        <CriticalDatesCard dates={criticalDates} />
        <div className="lg:col-span-2">
          <ComplianceAlertsCard alerts={complianceAlerts} />
        </div>
      </div>
    </main>
  );
}

// Helper function for document urgency
function getUrgencyFromDate(date: Date): 'high' | 'medium' | 'low' {
  const daysUntil = Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  if (daysUntil <= 30) return 'high';
  if (daysUntil <= 90) return 'medium';
  return 'low';
}
