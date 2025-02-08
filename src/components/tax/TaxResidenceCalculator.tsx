'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { calculateTaxResidenceRisk } from '@/lib/tax-utils';

interface Travel {
  country: string;
  startDate: string;
  endDate?: string;
}

export default function TaxResidenceCalculator() {
  const [travels, setTravels] = useState<Travel[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [residenceRisks, setResidenceRisks] = useState<Awaited<ReturnType<typeof calculateTaxResidenceRisk>>>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch travels
        const travelResponse = await fetch('/api/travel');
        if (!travelResponse.ok) throw new Error('Failed to fetch travels');
        const travelData = await travelResponse.json();
        setTravels(travelData);

        // Fetch documents
        const docResponse = await fetch('/api/documents');
        if (!docResponse.ok) throw new Error('Failed to fetch documents');
        const docData = await docResponse.json();
        setDocuments(docData);

        // Calculate tax residence risks
        const risks = await calculateTaxResidenceRisk(
          travelData.map((t: Travel) => ({
            ...t,
            startDate: new Date(t.startDate),
            endDate: t.endDate ? new Date(t.endDate) : undefined
          })),
          docData,
          session.user.id
        );
        setResidenceRisks(risks);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
