'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface ExpiringDocument {
  id: string;
  fileName: string;
  type: string;
  expiryDate: string;
  expiryStatus: 'expired' | 'critical' | 'warning' | 'notice' | 'good';
  daysUntilExpiry: number;
}

interface ExpirationSummary {
  expired: number;
  critical: number;
  warning: number;
  notice: number;
}

export default function ExpirationDashboard() {
  const [documents, setDocuments] = useState<ExpiringDocument[]>([]);
  const [summary, setSummary] = useState<ExpirationSummary>({
    expired: 0,
    critical: 0,
    warning: 0,
    notice: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExpiringDocuments = async () => {
      try {
        const response = await fetch('/api/documents/expiring');
        const data = await response.json();
        setDocuments(data.documents);
        setSummary(data.summary);
      } catch (error) {
        console.error('Error fetching expiring documents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpiringDocuments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'expired': return 'bg-red-100 text-red-800';
      case 'critical': return 'bg-orange-100 text-orange-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'notice': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-red-600">{summary.expired}</div>
            <div className="text-sm text-gray-600">Expired Documents</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-orange-600">{summary.critical}</div>
            <div className="text-sm text-gray-600">Expiring Soon (&lt;30 days)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-600">{summary.warning}</div>
            <div className="text-sm text-gray-600">Expiring (&lt;90 days)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-600">{summary.notice}</div>
            <div className="text-sm text-gray-600">Expiring (&lt;180 days)</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expiring Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading expiring documents...</p>
          ) : documents.length === 0 ? (
            <p>No documents expiring soon.</p>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <h3 className="font-medium">{doc.fileName}</h3>
                    <p className="text-sm text-gray-500">
                      {doc.type} | Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.expiryStatus)}`}>
                    {doc.daysUntilExpiry < 0 
                      ? 'Expired'
                      : `${doc.daysUntilExpiry} days left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}