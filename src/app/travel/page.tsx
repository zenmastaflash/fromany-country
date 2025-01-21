// src/app/travel/page.tsx
'use client';

import { useState } from 'react';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import TravelCalendar from '@/components/travel/TravelCalendar';
import TravelForm from '@/components/travel/TravelForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default async function TravelPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{
    start: Date;
    end?: Date;
  } | null>(null);
  
  const session = await getServerSession();

  if (!session) {
    redirect('/api/auth/signin');
  }

  const openFormWithDates = (start: Date, end?: Date) => {
    setSelectedDates({ start, end });
    setIsFormOpen(true);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Travel Timeline</h1>
        <Button onClick={() => setIsFormOpen(true)}>Add Travel</Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <TravelCalendar onDateSelect={openFormWithDates} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Location</CardTitle>
            </CardHeader>
            <CardContent>
              <p>No current location set</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Travel Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p>No travel history available</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Travel</DialogTitle>
            <DialogDescription>
              Enter your travel details below
            </DialogDescription>
          </DialogHeader>
          <TravelForm 
            preselectedDates={selectedDates || undefined}
            onSuccess={() => setIsFormOpen(false)}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </main>
  );
}
