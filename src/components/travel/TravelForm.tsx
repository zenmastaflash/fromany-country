// src/components/travel/TravelForm.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/Card';

interface TravelFormData {
  country: string;
  city: string;
  startDate: string;
  endDate?: string;
  purpose: string;
  visaType?: string;
  notes?: string;
}

export default function TravelForm({
  preselectedDates,
  onSuccess,
  onCancel
}: {
  preselectedDates?: { start: Date; end?: Date };
  onSuccess?: () => void;
  onCancel?: () => void;
}) {
  const [formData, setFormData] = useState<TravelFormData>({
    country: '',
    city: '',
    startDate: preselectedDates?.start.toISOString().split('T')[0] || '',
    endDate: preselectedDates?.end?.toISOString().split('T')[0],
    purpose: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/travel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add travel');
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error adding travel:', error);
    }
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                type="date"
                id="endDate"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <select
              id="purpose"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              required
              className="w-full rounded-md border-border bg-text text-background px-3 py-2 
                         placeholder-secondary focus:outline-none focus:ring-2 
                         focus:ring-primary focus:border-primary disabled:opacity-50"
            >
              <option value="">Select purpose</option>
              <option value="tourism">Tourism</option>
              <option value="business">Business</option>
              <option value="remote_work">Remote Work</option>
              <option value="relocation">Relocation</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            {onCancel && (
              <Button variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit">Add Travel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
