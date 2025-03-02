'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import TaxLiabilityCard from '@/components/dashboard/TaxLiabilityCard';
import CriticalDatesCard from '@/components/dashboard/CriticalDatesCard';
import ComplianceAlertsCard from '@/components/dashboard/ComplianceAlertsCard';
import TermsDrawer from '@/components/TermsDrawer';
import TaxAdvisorCard from '@/components/dashboard/TaxAdvisorCard';

// Move the component that uses useSearchParams into a separate component
function DashboardContent() {
  const searchParams = useSearchParams();
  const showTerms = searchParams.get('showTerms') === 'true';
  
  // Pass the value to parent component
  useEffect(() => {
    if (showTerms) {
      window.sessionStorage.setItem('showTerms', 'true');
    }
  }, [showTerms]);
  
  return null;
}

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('current_year');
  
  // Terms drawer state using sessionStorage instead
  const [termsOpen, setTermsOpen] = useState(false);
  const [isAcceptingTerms, setIsAcceptingTerms] = useState(false);

  useEffect(() => {
    // Check sessionStorage for terms flag
    const showTerms = window.sessionStorage.getItem('showTerms') === 'true';
    if (showTerms) {
      setTermsOpen(true);
      window.sessionStorage.removeItem('showTerms');
    }
  }, []);

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
  
  const handleAcceptTerms = async () => {
    setIsAcceptingTerms(true);
    
    try {
      const response = await fetch('/api/auth/accept-terms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setTermsOpen(false);
        // Clear session first then refresh to get fresh session with updated terms
        await fetch('/api/auth/session', { method: 'DELETE' });
        window.location.href = '/dashboard';
      } else {
        throw new Error('Failed to accept terms');
      }
    } catch (error) {
      console.error('Terms acceptance error:', error);
    }
    setIsAcceptingTerms(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  return (
    <>
      {/* Suspense boundary for useSearchParams */}
      <Suspense fallback={null}>
        <DashboardContent />
      </Suspense>
      
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
          <TaxAdvisorCard />
          <CriticalDatesCard dates={data.criticalDates} />
          <ComplianceAlertsCard alerts={data.complianceAlerts} />
        </div>
      </main>
      
      <TermsDrawer 
        isOpen={termsOpen}
        onClose={() => setTermsOpen(false)}
        onAccept={handleAcceptTerms}
        isAccepting={isAcceptingTerms}
      />
    </>
  );
}
