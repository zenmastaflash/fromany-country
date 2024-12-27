import { getServerSession } from 'next-auth/next';
import { config as authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin');
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-text">Dashboard</h1>
          <p className="text-link mt-2">Welcome {session.user?.name}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Document Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-link mb-4">Manage your important documents and track expiration dates.</p>
            <Link href="/documents" className="text-primary hover:text-link">
              Manage Documents →
            </Link>
          </CardContent>
        </Card>

        {/* Travel Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Travel</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-link mb-4">Plan your travels and track visa requirements.</p>
            <Link href="/travel" className="text-primary hover:text-link">
              View Travel Plans →
            </Link>
          </CardContent>
        </Card>

        {/* Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-link mb-4">Access guides and tools</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
