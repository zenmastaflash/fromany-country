'use client';
import { useState, useEffect } from 'react';

type Document = {
  id: string;
  fileName: string;
  type: string;
  fileUrl: string;
  number: string;
  issueDate: string;
  expiryDate: string;
  issuingCountry: string;
  status: string;
  tags: string[];
  createdAt: string;
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
      setDocuments(data);
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
      ? doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.issuingCountry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
    return matchesType && matchesSearch;
  });

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
          className="flex-1 rounded-md border-border bg-secondary-dark text-text shadow-sm focus:border-primary focus:ring-primary placeholder-link"
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
                      href={doc.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="link"
                    >
                      {doc.fileName}
                    </a>
                  </h3>
                  <p className="text-sm text-link">
                    Type: {doc.type.replace('_', ' ')}
                  </p>
                  <p className="text-sm text-link">
                    Document Number: {doc.number}
                  </p>
                  <p className="text-sm text-link">
                    Issued: {new Date(doc.issueDate).toLocaleDateString()}
                    {' | '}
                    Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-link">
                    Country: {doc.issuingCountry}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
