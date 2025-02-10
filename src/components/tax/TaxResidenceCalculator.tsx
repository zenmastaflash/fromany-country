'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { calculateTaxResidenceRisk } from '@/lib/tax-utils';

interface Travel {
  country: string;
  startDate: string;
  endDate?: string;
}

export default function TaxResidenceCalculator() {
  const { data: session } = useSession();
  const [travels, setTravels] = useState<Travel[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [residenceRisks, setResidenceRisks] = useState<Awaited<ReturnType<typeof calculateTaxResidenceRisk>>>([]);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchData = async () => {
      try {
        // Fetch all required data in parallel
        const [travelResponse, docResponse, rulesResponse, taxStatusResponse] = await Promise.all([
          fetch('/api/travel'),
          fetch('/api/documents'),
          fetch('/api/country-rules'),  // Would need to create this endpoint
          fetch('/api/tax-status')      // Would need to create this endpoint
        ]);

        if (!travelResponse.ok) throw new Error('Failed to fetch travels');
        if (!docResponse.ok) throw new Error('Failed to fetch documents');
        if (!rulesResponse.ok) throw new Error('Failed to fetch country rules');
        if (!taxStatusResponse.ok) throw new Error('Failed to fetch tax status');

        const [travelData, docData, rulesData, taxStatusData] = await Promise.all([
          travelResponse.json(),
          docResponse.json(),
          rulesResponse.json(),
          taxStatusResponse.json()
        ]);

        const risks = await calculateTaxResidenceRisk(
          travelData.map((t: Travel) => ({
            ...t,
            startDate: new Date(t.startDate),
            endDate: t.endDate ? new Date(t.endDate) : undefined
          })),
          docData,
          rulesData,
          taxStatusData
        );
        setResidenceRisks(risks);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [session]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Residence Risk Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {residenceRisks.map(({ country, days, risk }) => (
            <div key={country} className="flex items-center justify-between p-2 border rounded">
              <div>
                <p className="font-medium">{country}</p>
                <p className="text-sm text-gray-500">{days} days</p>
              </div>
              <div className={`px-2 py-1 rounded text-sm ${
                risk === 'high' ? 'bg-red-100 text-red-800' :
                risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {risk.charAt(0).toUpperCase() + risk.slice(1)} Risk
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
