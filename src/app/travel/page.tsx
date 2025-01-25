'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import TravelCalendar from '@/components/travel/TravelCalendar';
import TravelForm from '@/components/travel/TravelForm';

interface Travel {
  id: string;
  country: string;
  city?: string;
  entry_date: string;
  exit_date?: string;
  purpose: string;
  visa_type?: string;
  status?: string;
}

export default function TravelPage() {
  const [showForm, setShowForm] = useState(false);
  const [travels, setTravels] = useState<Travel[]>([]);
  const [selectedDates, setSelectedDates] = useState<{ start: Date; end?: Date } | undefined>();

  useEffect(() => {
    fetchTravels();
  }, []);

  const fetchTravels = async () => {
    try {
      const response = await fetch('/api/travel');
      if (response.ok) {
        const data = await response.json();
        setTravels(data);
      }
    } catch (error) {
      console.error('Error fetching travels:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this travel entry?')) return;
    
    try {
      const response = await fetch(`/api/travel/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchTravels();
      }
    } catch (error) {
      console.error('Error deleting travel:', error);
    }
  };

  const getCurrentLocation = () => {
    const now = new Date();
    return travels.find(t => 
      new Date(t.entry_date) <= now && 
      (!t.exit_date || new Date(t.exit_date) >= now)
    );
  };

  const currentLocation = getCurrentLocation();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Travel Timeline</h1>
        <Button onClick={() => {
          setSelectedDates(undefined);
          setShowForm(true);
        }}>Add Travel</Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add Travel</CardTitle>
            </CardHeader>
            <CardContent>
              <TravelForm 
                preselectedDates={selectedDates}
                onSuccess={() => {
                  setShowForm(false);
                  setSelectedDates(undefined);
                  fetchTravels();
                }} 
                onCancel={() => {
                  setShowForm(false);
                  setSelectedDates(undefined);
                }} 
              />
            </CardContent>
          </Card>
        )}
        
        <TravelCalendar onDelete={handleDelete} />

        <Card>
          <CardHeader>
            <CardTitle>Current Location</CardTitle>
          </CardHeader>
          <CardContent>
            {currentLocation ? (
              <div className="space-y-1">
                <p className="text-lg">{currentLocation.city}, {currentLocation.country}</p>
                <p className="text-sm text-link">Since: {new Date(currentLocation.entry_date).toLocaleDateString()}</p>
                {currentLocation.exit_date && (
                  <p className="text-sm text-link">Until: {new Date(currentLocation.exit_date).toLocaleDateString()}</p>
                )}
                <p className="text-sm italic capitalize">{currentLocation.purpose.replace('_', ' ')}</p>
              </div>
            ) : (
              <p>No current location set</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Travel Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {travels.length > 0 ? (
                travels.map(travel => (
                  <div key={travel.id} className="flex justify-between items-start border-b border-border pb-2">
                    <div>
                      <p className="text-lg">{travel.city}, {travel.country}</p>
                      <p className="text-sm text-link">
                        {new Date(travel.entry_date).toLocaleDateString()}
                        {travel.exit_date && ` - ${new Date(travel.exit_date).toLocaleDateString()}`}
                      </p>
                      <p className="text-xs italic capitalize">{travel.purpose.replace('_', ' ')}</p>
                    </div>
                    <Button 
                      variant="secondary" 
                      onClick={() => handleDelete(travel.id)}
                      className="text-sm"
                    >
                      Delete
                    </Button>
                  </div>
                ))
              ) : (
                <p>No travel history available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
