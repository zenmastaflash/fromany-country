'use client';

import { useEffect, useState } from 'react';
import TaxLiabilityCard from '@/components/dashboard/TaxLiabilityCard';
import CriticalDatesCard from '@/components/dashboard/CriticalDatesCard';
import ComplianceAlertsCard from '@/components/dashboard/ComplianceAlertsCard';

export const runtime = 'nodejs';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('current_year');

  useEffect(() => {
    fetchDashboardData(dateRange);
  }, [dateRange]);

  const fetchDashboardData = async (range: string) => {
    try {
      const response = await fetch(`/api/dashboard?dateRange=${range}`);
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-text">Dashboard</h1>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaxLiabilityCard 
          currentLocation={data.currentLocation || { 
            country: 'Not Set',
            entryDate: new Date().toISOString(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          }}
          countryStatuses={data.countryStatuses}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
        <CriticalDatesCard dates={data.criticalDates} />
        <div className="lg:col-span-2">
          <ComplianceAlertsCard alerts={data.complianceAlerts} />
        </div>
      </div>
    </main>
  );
}
