'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import DocumentUpload from '@/components/documents/DocumentUpload';
import ExpirationDashboard from '@/components/documents/ExpirationDashboard';

interface Document {
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
}

function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
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

    fetchDocuments();
  }, []);

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

  return (
    <div>
      <div className="mb-4 flex gap-4">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      {isLoading ? (
        <p>Loading documents...</p>
      ) : filteredDocuments.length === 0 ? (
        <p>No documents found.</p>
      ) : (
        <div className="space-y-4">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">
                    <a 
                      href={doc.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {doc.fileName}
                    </a>
                  </h3>
                  <p className="text-sm text-gray-500">
                    Type: {doc.type.replace('_', ' ')}
                  </p>
                  <p className="text-sm text-gray-500">
                    Document Number: {doc.number}
                  </p>
                  <p className="text-sm text-gray-500">
                    Issued: {new Date(doc.issueDate).toLocaleDateString()}
                    {' | '}
                    Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Country: {doc.issuingCountry}
                  </p>
                  {doc.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {doc.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
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
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
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

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<'library' | 'expiring'>('library');
  
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Documents</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'library'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Library
          </button>
          <button
            onClick={() => setActiveTab('expiring')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'expiring'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Expiring
          </button>
        </div>
      </div>

      {activeTab === 'library' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Upload Document</CardTitle>
              </CardHeader>
              <CardContent>
                <DocumentUpload onSuccess={() => {}} />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Document Library</CardTitle>
              </CardHeader>
              <CardContent>
                <DocumentList />
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <ExpirationDashboard />
      )}
    </main>
  );
}