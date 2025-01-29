// src/components/travel/TravelForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/Card';
import { Travel, Prisma } from '@prisma/client';

type TravelFormData = Omit<Prisma.TravelUncheckedCreateInput, 'id' | 'created_at' | 'updated_at' | 'user_id'> & {
  entry_date: string;  // String for form input
  exit_date?: string | null;  // String for form input
};

interface Props {
  preselectedDates?: { start: Date; end?: Date };
  onSuccess?: () => void;
  onCancel?: () => void;
  editTravel?: Travel | null;
}

export default function TravelForm({
  preselectedDates,
  onSuccess,
  onCancel,
  editTravel
}: Props) {
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [formData, setFormData] = useState<TravelFormData>({
    country: '',
    city: '',
    entry_date: preselectedDates?.start.toISOString().split('T')[0] || '',
    exit_date: preselectedDates?.end?.toISOString().split('T')[0] || null,
    purpose: '',
    visa_type: null,
    notes: null,
    status: null
  });

  useEffect(() => {
    fetch('/api/countries')
      .then(res => res.json())
      .then(data => setCountries(data.countries))
      .catch(err => console.error('Error fetching countries:', err));
  }, []);

  useEffect(() => {
    if (formData.country) {
      fetch(`/api/cities?country=${encodeURIComponent(formData.country)}`)
        .then(res => res.json())
        .then(data => setCities(data.cities))
        .catch(err => console.error('Error fetching cities:', err));
    } else {
      setCities([]);
    }
  }, [formData.country]);

  useEffect(() => {
    if (editTravel) {
      setFormData({
        country: editTravel.country,
        city: editTravel.city || '',
        entry_date: new Date(editTravel.entry_date).toISOString().split('T')[0],
        exit_date: editTravel.exit_date ? new Date(editTravel.exit_date).toISOString().split('T')[0] : undefined,
        purpose: editTravel.purpose,
        visa_type: editTravel.visa_type,
        notes: editTravel.notes || '',
        status: editTravel.status
      });
    }
  }, [editTravel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const dataForApi = {
        ...formData,
        entry_date: new Date(formData.entry_date),
        exit_date: formData.exit_date ? new Date(formData.exit_date) : null
      };

      const url = editTravel 
        ? `/api/travel/${editTravel.id}` 
        : '/api/travel';
      
      const method = editTravel ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataForApi),
      });

      if (!response.ok) {
        throw new Error('Failed to save travel');
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error saving travel:', error);
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
              list="countries"
              required
            />
            <datalist id="countries">
              {countries.map(country => (
                <option key={country} value={country} />
              ))}
            </datalist>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              list="cities"
            />
            <datalist id="cities">
              {cities.map(city => (
                <option key={city} value={city} />
              ))}
            </datalist>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entry_date">Entry Date</Label>
              <Input
                type="date"
                id="entry_date"
                value={formData.entry_date}
                onChange={(e) => setFormData({ ...formData, entry_date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exit_date">Exit Date</Label>
              <Input
                type="date"
                id="exit_date"
                value={formData.exit_date}
                onChange={(e) => setFormData({ ...formData, exit_date: e.target.value })}
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
              <option value="home_base">Home Base</option>
              <option value="tourism">Tourism</option>
              <option value="business">Business</option>
              <option value="remote_work">Remote Work</option>
              <option value="relocation">Relocation</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full rounded-md border-border bg-text text-background px-3 py-2"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            {onCancel && (
              <Button variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit">{editTravel ? 'Save Changes' : 'Add Travel'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
