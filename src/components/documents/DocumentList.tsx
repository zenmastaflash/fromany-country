'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import DocumentForm from './DocumentForm';
import { DocumentType } from '@prisma/client'; // Import DocumentType

type Document = {
  id: string;
  fileName: string | null;
  type: DocumentType; // Use DocumentType enum
  fileUrl: string | null;
  number: string | null;
  issueDate: Date | null; // Use Date type
  expiryDate: Date | null; // Use Date type
  issuingCountry: string | null;
  status: string;
  tags: string[];
  createdAt: Date;
  title: string | null;
};

type DocumentListProps = {
  refreshKey?: number;
};

export default function DocumentList({ refreshKey = 0 }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/documents');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch documents');
      }
      const data = await response.json();
      setDocuments(data.map((doc: any) => {
        const issueDate = doc.issueDate ? new Date(doc.issueDate) : null;
        const expiryDate = doc.expiryDate ? new Date(doc.expiryDate) : null;
        
        // Validate that dates are valid before using them
        return {
          ...doc,
          issueDate: issueDate instanceof Date && !isNaN(issueDate.getTime()) ? issueDate : null,
          expiryDate: expiryDate instanceof Date && !isNaN(expiryDate.getTime()) ? expiryDate : null,
        };
      }));
    } catch (error) {
      console.error('Error fetching documents:', error);
      setError(error instanceof Error ? error.message : 'Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [refreshKey]); // Re-fetch when refreshKey changes

  const filteredDocuments = documents.filter(doc => {
    const matchesType = selectedType ? doc.type === selectedType : true;
    const matchesSearch = searchTerm
      ? (doc.fileName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.issuingCountry || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
    return matchesType && matchesSearch;
  });

  const sortedAndFilteredDocuments = filteredDocuments
    .sort((a, b) => {
      // Documents without expiry dates go to the end
      if (!a.expiryDate && !b.expiryDate) return 0;
      if (!a.expiryDate) return 1;
      if (!b.expiryDate) return -1;
      return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
    });

  const handleEdit = (documentId: string) => {
    setEditingDocumentId(documentId);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch('/api/documents/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/documents/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          id: editingDocumentId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update document');
      }

      const result = await response.json();
      // Update the documents state with the returned document
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === editingDocumentId ? result.document : doc))
      );
      setEditingDocumentId(null);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  const calculateStatus = (expiryDate: Date | null): string => {
    if (!expiryDate) return 'Unknown';
    const today = new Date();
    const timeDiff = expiryDate.getTime() - today.getTime();
    const daysUntilExpiry = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return 'Expired';
    if (daysUntilExpiry <= 30) return 'Expiring Soon';
    return 'Active';
  };

  const documentTypes = [
    'PASSPORT',
    'VISA',
    'TAX_RETURN',
    'DRIVERS_LICENSE',
    'RESIDENCY_PERMIT',
    'BANK_STATEMENT',
    'INSURANCE',
    'OTHER'
  ];

  if (error) {
    return (
      <div className="alert">
        <p>Error: {error}</p>
        <button 
          onClick={fetchDocuments}
          className="btn-primary mt-2"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex gap-4">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="rounded-md border-border bg-secondary text-text shadow-sm focus:border-primary focus:ring-primary"
        >
          <option value="">All Types</option>
          {documentTypes.map(type => (
            <option key={type} value={type}>
              {type.replace('_', ' ')}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 rounded-md border-border bg-text text-background shadow-sm focus:border-primary focus:ring-primary placeholder-secondary"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : sortedAndFilteredDocuments.length === 0 ? (
        <p className="text-link text-center py-8">No documents found.</p>
      ) : (
        <div className="space-y-4">
          {sortedAndFilteredDocuments.map((doc) => (
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
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded ${
                    calculateStatus(doc.expiryDate) === 'Active'
                      ? 'bg-primary text-text'
                      : calculateStatus(doc.expiryDate) === 'Expiring Soon'
                      ? 'bg-yellow-500 text-text'
                      : 'bg-red-500 text-text'
                  }`}
                >
                  {calculateStatus(doc.expiryDate)}
                </span>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button onClick={() => handleEdit(doc.id)} variant="secondary">Edit</Button>
                <Button onClick={() => handleDelete(doc.id)} variant="accent">Delete</Button>
              </div>
              {editingDocumentId === doc.id && (
                <DocumentForm
                  initialData={doc}
                  onSubmit={handleFormSubmit}
                  onCancel={() => setEditingDocumentId(null)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
