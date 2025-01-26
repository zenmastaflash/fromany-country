'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import TravelCalendar from '@/components/travel/TravelCalendar';
import TravelForm from '@/components/travel/TravelForm';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface Travel {
  id: string;
  country: string;
  city?: string;
  entry_date: string;
  exit_date?: string;
  purpose: string;
  visa_type?: string;
  status?: string;
  notes?: string;
}

export default function TravelPage() {
  const [showForm, setShowForm] = useState(false);
  const [travels, setTravels] = useState<Travel[]>([]);
  const [selectedDates, setSelectedDates] = useState<{ start: Date; end?: Date } | undefined>();
  const [selectedTravel, setSelectedTravel] = useState<Travel | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [calendarKey, setCalendarKey] = useState(0);

  useEffect(() => {
    fetchTravels();
  }, [showEventModal, showForm]); // Re-fetch after modal/form closes

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
        setCalendarKey(prev => prev + 1);
        fetchTravels();
      }
    } catch (error) {
      console.error('Error deleting travel:', error);
    }
  };

  const handleEventEdit = (travel: Travel) => {
    setSelectedTravel(travel);
    setShowEventModal(true);
  };

  const getCurrentLocation = () => {
    const now = new Date();
    return travels.find(t => 
      new Date(t.entry_date) <= now && 
      (!t.exit_date || new Date(t.exit_date) >= now)
    );
  };

  const currentLocation = getCurrentLocation();

  const exportCSV = () => {
    const csvData = travels.map(t => ({
      country: t.country,
      city: t.city,
      entry_date: t.entry_date,
      exit_date: t.exit_date || '',
      purpose: t.purpose,
      notes: t.notes || ''
    }));
    const csvString = Papa.unparse(csvData);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'travel_data.csv';
    link.click();
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(travels);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Travel Data");
    XLSX.writeFile(wb, "travel_data.xlsx");
  };

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
        
        {showEventModal && selectedTravel && (
          <Card>
            <CardHeader>
              <CardTitle>Travel Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-lg">{selectedTravel.city}, {selectedTravel.country}</p>
                <p className="text-sm text-link">
                  {new Date(selectedTravel.entry_date).toLocaleDateString()}
                  {selectedTravel.exit_date && ` - ${new Date(selectedTravel.exit_date).toLocaleDateString()}`}
                </p>
                <p className="text-sm italic capitalize">{selectedTravel.purpose.replace('_', ' ')}</p>
                {selectedTravel.notes && (
                  <p className="text-sm">{selectedTravel.notes}</p>
                )}
                <div className="flex justify-end space-x-2 mt-4">
                  <Button 
                    variant="secondary" 
                    onClick={() => {
                      setSelectedDates({
                        start: new Date(selectedTravel.entry_date),
                        end: selectedTravel.exit_date ? new Date(selectedTravel.exit_date) : undefined
                      });
                      setShowForm(true);
                      setShowEventModal(false);
                    }}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={() => {
                      handleDelete(selectedTravel.id);
                      setShowEventModal(false);
                    }}
                  >
                    Delete
                  </Button>
                  <Button onClick={() => setShowEventModal(false)}>Close</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <TravelCalendar 
          key={calendarKey}
          onEdit={handleEventEdit} 
        />

        <Card>
          <CardHeader>
            <CardTitle>Current Location</CardTitle>
          </CardHeader>
          <CardContent>
            {currentLocation ? (
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-lg">{currentLocation.city}, {currentLocation.country}</p>
                  <p className="text-sm text-link">Since: {new Date(currentLocation.entry_date).toLocaleDateString()}</p>
                  {currentLocation.exit_date && (
                    <p className="text-sm text-link">Until: {new Date(currentLocation.exit_date).toLocaleDateString()}</p>
                  )}
                  <p className="text-sm italic capitalize">{currentLocation.purpose.replace('_', ' ')}</p>
                  {currentLocation.notes && (
                    <p className="text-sm mt-2">{currentLocation.notes}</p>
                  )}
                </div>
                <div className="space-x-2">
                  <Button 
                    variant="secondary" 
                    onClick={() => handleEventEdit(currentLocation)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={() => handleDelete(currentLocation.id)}
                  >
                    Delete
                  </Button>
                </div>
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
                      {travel.notes && (
                        <p className="text-sm mt-1">{travel.notes}</p>
                      )}
                    </div>
                    <div className="space-x-2">
                      <Button 
                        variant="secondary"
                        onClick={() => handleEventEdit(travel)}
                        className="text-sm"
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="secondary" 
                        onClick={() => handleDelete(travel.id)}
                        className="text-sm"
                      >
                        Delete
                      </Button>
                    </div>
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
