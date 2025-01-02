'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import DocumentUploadFlow from '@/components/documents/DocumentUploadFlow'; // Use the new component
import DocumentList from '@/components/documents/DocumentList';

function DocumentsContent() {
  const searchParams = useSearchParams();
  const [refreshKey, setRefreshKey] = useState(0);
  
  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Documents</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Upload Document</CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentUploadFlow onUploadSuccess={handleUploadSuccess} /> {/* Pass the success handler */}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Document Library</CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentList refreshKey={refreshKey} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default function DocumentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DocumentsContent />
    </Suspense>
  );
}
