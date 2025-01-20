import { getServerSession } from 'next-auth/next';
import { config as authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import TaxLiabilityCard from '@/components/dashboard/TaxLiabilityCard';
import CriticalDatesCard from '@/components/dashboard/CriticalDatesCard';
import ComplianceAlertsCard from '@/components/dashboard/ComplianceAlertsCard';

// Temporary mock data - replace with actual data fetching
const mockData = {
  currentLocation: {
    country: 'Thailand',
    entryDate: '2024-01-01',
    timezone: 'Asia/Bangkok',
  },
  countryStatuses: [
    { country: 'Thailand', daysPresent: 45, threshold: 183, lastEntry: '2024-01-01' },
    { country: 'Malaysia', daysPresent: 120, threshold: 183, lastEntry: '2023-08-15' },
    { country: 'Singapore', daysPresent: 30, threshold: 90, lastEntry: '2023-11-01' },
  ],
  criticalDates: [
    {
      type: 'visa' as const,
      title: 'Thai Visa Expiration',
      date: '2024-03-01',
      description: 'Tourist visa expires',
      urgency: 'high' as const,
    },
    {
      type: 'tax' as const,
      title: 'US Tax Filing Deadline',
      date: '2024-04-15',
      description: 'Federal tax return due',
      urgency: 'medium' as const,
    },
    {
      type: 'document' as const,
      title: 'Passport Expiration',
      date: '2024-12-31',
      description: 'Renewal recommended 6 months before expiry',
      urgency: 'low' as const,
    },
  ],
  complianceAlerts: [
    {
      type: 'tax' as const,
      title: 'Approaching Tax Liability in Malaysia',
      description: 'You are nearing the 183-day threshold for tax residency',
      severity: 'high' as const,
      actionRequired: 'Plan departure before March 15, 2024 to avoid tax liability',
    },
    {
      type: 'visa' as const,
      title: 'Visa Extension Required',
      description: 'Current visa expires in 15 days',
      severity: 'medium' as const,
      actionRequired: 'Apply for visa extension or plan departure',
    },
  ],
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin');
  }

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
          currentLocation={mockData.currentLocation}
          countryStatuses={mockData.countryStatuses}
        />
        <CriticalDatesCard dates={mockData.criticalDates} />
        <div className="lg:col-span-2">
          <ComplianceAlertsCard alerts={mockData.complianceAlerts} />
        </div>
      </div>
    </main>
  );
}
