import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import DocumentUpload from '@/components/documents/DocumentUpload';

export default async function DocumentsPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/api/auth/signin');
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Documents</h1>
        <Button>Upload Document</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Travel Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <DocumentUpload category="travel" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tax Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <DocumentUpload category="tax" />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}