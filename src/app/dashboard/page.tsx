import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/api/auth/signin');
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Travel Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Countries visited: <span className="font-semibold">0</span></p>
              <p>Current location: <span className="font-semibold">Not set</span></p>
              <p>Next destination: <span className="font-semibold">None planned</span></p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tax Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Tax residence: <span className="font-semibold">Not set</span></p>
              <p>Days in current country: <span className="font-semibold">0</span></p>
              <p>Tax year progress: <span className="font-semibold">0%</span></p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Passport expiry: <span className="font-semibold">Not set</span></p>
              <p>Active visas: <span className="font-semibold">0</span></p>
              <p>Pending applications: <span className="font-semibold">0</span></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}