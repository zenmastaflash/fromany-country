// src/app/travel/page.tsx
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import TravelCalendar from '@/components/travel/TravelCalendar';
import TravelForm from '@/components/travel/TravelForm';

export default async function TravelPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/api/auth/signin');
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Travel Timeline</h1>
        <Button>Add Travel</Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <TravelCalendar />

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
    </main>
  );
}
