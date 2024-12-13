'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

type Document = {
  id: string;
  fileName: string;
  type: string;
  expiryDate: string;
  status: string;
};

export default function ExpirationDashboard() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/documents/expiring');
        if (!response.ok) {
          throw new Error('Failed to fetch expiring documents');
        }
        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        console.error('Error fetching expiring documents:', error);
        setError('Failed to load expiring documents');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const getExpirationStatus = (expiryDate: string) => {
    const days = Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'expired';
    if (days <= 30) return 'expiring-soon';
    return 'valid';
  };

  const getStatusDetails = (expiryDate: string) => {
    const days = Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return { text: 'Expired', class: 'bg-red-100 text-red-800' };
    if (days <= 30) return { text: `Expires in ${days} days`, class: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Valid', class: 'bg-green-100 text-green-800' };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-8">
        {error}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No documents are expiring soon.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc) => {
        const status = getStatusDetails(doc.expiryDate);
        return (
          <Card key={doc.id}>
            <CardHeader>
              <CardTitle className="text-lg">{doc.fileName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  Type: {doc.type.replace('_', ' ')}
                </p>
                <p className="text-sm text-gray-500">
                  Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                </p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.class}`}
                >
                  {status.text}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}