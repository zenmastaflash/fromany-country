'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import DocumentUpload from '@/components/documents/DocumentUpload';

interface Document {
  id: string;
  fileName: string;
  type: string;
  fileUrl: string;
  createdAt: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const onUploadSuccess = () => {
    fetchDocuments(); // Refresh the list after upload
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Documents</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
          </CardHeader>
          <CardContent>
            <DocumentUpload category="travel" onSuccess={onUploadSuccess} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading documents...</p>
            ) : documents.length === 0 ? (
              <p>No documents uploaded yet.</p>
            ) : (
              <ul className="space-y-4">
                {documents.map((doc) => (
                  <li key={doc.id} className="border-b pb-2">
                    <a 
                      href={doc.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {doc.fileName}
                    </a>
                    <p className="text-sm text-gray-500">
                      Type: {doc.type}
                      <br />
                      Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}