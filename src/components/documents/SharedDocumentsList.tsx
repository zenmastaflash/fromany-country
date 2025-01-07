'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { DocumentType } from '@prisma/client';

type SharedDocument = {
  id: string;
  fileName: string | null;
  type: DocumentType;
  fileUrl: string | null;
  number: string | null;
  issueDate: Date | null;
  expiryDate: Date | null;
  issuingCountry: string | null;
  status: string;
  tags: string[];
  createdAt: Date;
  title: string | null;
  user: {
    name: string | null;
    email: string;
  };
};

type SharedDocumentListProps = {
  refreshKey?: number;
};

export default function SharedDocumentList({ refreshKey = 0 }: SharedDocumentListProps) {
  const [documents, setDocuments] = useState<SharedDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/documents/shared');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch shared documents');
      }
      const data = await response.json();
      setDocuments(data.map((doc: any) => ({
        ...doc,
        issueDate: doc.issueDate ? new Date(doc.issueDate) : null,
        expiryDate: doc.expiryDate ? new Date(doc.expiryDate) : null,
      })));
    } catch (error) {
      console.error('Error fetching shared documents:', error);
      setError(error instanceof Error ? error.message : 'Failed to load shared documents');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [refreshKey]);

  const filteredDocuments = documents.filter(doc => {
    return searchTerm
      ? (doc.fileName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.issuingCountry || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
  });

  if (error) {
    return (
      <div className="alert">
        <p>Error: {error}</p>
        <Button onClick={fetchDocuments} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search shared documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border-border bg-text text-background shadow-sm focus:border-primary focus:ring-primary placeholder-secondary"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <p className="text-link text-center py-8">No shared documents found.</p>
      ) : (
        <div className="space-y-4">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="card hover:bg-secondary">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">
                    <a 
                      href={doc.fileUrl || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="link"
                    >
                      {doc.title || 'Untitled Document'}
                    </a>
                  </h3>
                  <p className="text-sm text-link">
                    Shared by: {doc.user.name || doc.user.email}
                  </p>
                  <p className="text-sm text-link">
                    Type: {doc.type.replace('_', ' ')}
                  </p>
                  <p className="text-sm text-link">
                    Document Number: {doc.number || 'N/A'}
                  </p>
                  <p className="text-sm text-link">
                    Issued: {doc.issueDate ? new Date(doc.issueDate).toLocaleDateString() : 'N/A'}
                    {' | '}
                    Expires: {doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString() : 'N/A'}
                  </p>
                  <p className="text-sm text-link">
                    Country: {doc.issuingCountry || 'N/A'}
                  </p>
                  {doc.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {doc.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-link"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
