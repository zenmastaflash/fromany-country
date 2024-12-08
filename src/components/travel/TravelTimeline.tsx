'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface Travel {
  id: string;
  country: string;
  startDate: string;
  endDate?: string;
  purpose: string;
  visaType?: string;
  notes?: string;
}

export default function TravelTimeline() {
  const [travels, setTravels] = useState<Travel[]>([]);

  useEffect(() => {
    const fetchTravels = async () => {
      try {
        const response = await fetch('/api/travel');
        if (!response.ok) {
          throw new Error('Failed to fetch travels');
        }
        const data = await response.json();
        setTravels(data);
      } catch (error) {
        console.error('Error fetching travels:', error);
      }
    };

    fetchTravels();
  }, []);

  return (
    <div className="space-y-4">
      {travels.map((travel) => (
        <Card key={travel.id}>
          <CardHeader>
            <CardTitle>{travel.country}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Dates:</span>{' '}
                {new Date(travel.startDate).toLocaleDateString()}
                {travel.endDate
                  ? ` - ${new Date(travel.endDate).toLocaleDateString()}`
                  : ' (Ongoing)'}
              </p>
              <p>
                <span className="font-semibold">Purpose:</span> {travel.purpose}
              </p>
              {travel.visaType && (
                <p>
                  <span className="font-semibold">Visa Type:</span> {travel.visaType}
                </p>
              )}
              {travel.notes && (
                <p>
                  <span className="font-semibold">Notes:</span> {travel.notes}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}