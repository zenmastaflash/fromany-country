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
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);

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
      setDocuments(data.map((doc: any) => ({
        ...doc,
        issueDate: doc.issueDate ? new Date(doc.issueDate) : null,
        expiryDate: doc.expiryDate ? new Date(doc.expiryDate) : null,
      })));
    } catch (error) {
      console.error('Error fetching documents:', error);
      setError(error instanceof Error ? error.message : 'Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [refreshKey]);

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

  const handleEdit = (document: Document) => {
    setEditingDocument(document);
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
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update document');
      }

      const updatedDocument = await response.json();
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === updatedDocument.id ? updatedDocument : doc))
      );
      setEditingDocument(null);
    } catch (error) {
      console.error('Error updating document:', error);
    }
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
      ) : filteredDocuments.length === 0 ? (
        <p className="text-link text-center py-8">No documents found.</p>
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
                      {doc.fileName || 'Untitled Document'}
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
                    doc.status === 'active'
                      ? 'bg-primary text-text'
                      : 'bg-accent text-text'
                  }`}
                >
                  {doc.status}
                </span>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button onClick={() => handleEdit(doc)} variant="secondary">Edit</Button>
                <Button onClick={() => handleDelete(doc.id)} variant="accent">Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingDocument && (
        <DocumentForm
          initialData={editingDocument}
          onSubmit={handleFormSubmit}
          onCancel={() => setEditingDocument(null)}
        />
      )}
    </div>
  );
}
