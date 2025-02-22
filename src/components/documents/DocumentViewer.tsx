'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';

interface DocumentViewerProps {
  documentId: string;
  title: string | null;
  onClose: () => void;
}

export default function DocumentViewer({ documentId, title, onClose }: DocumentViewerProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPdf, setIsPdf] = useState(false);

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const response = await fetch(`/api/documents/view/${documentId}`);
        if (!response.ok) {
          // If it's a 404, we'll just show a message that this is a document without a file
          if (response.status === 404) {
            setError('This document has no file attachment');
            return;
          }
          throw new Error('Failed to load document');
        }
        const data = await response.json();
        setUrl(data.url);
        
        // Check if it's a PDF or an image
        setIsPdf(data.url.toLowerCase().includes('.pdf'));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error loading document');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUrl();
  }, [documentId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl h-[90vh] flex flex-col bg-secondary">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-text">{title || 'Document Viewer'}</CardTitle>
          <Button variant="ghost" onClick={onClose} className="p-2">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto relative bg-background">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-link">
              <p>{error}</p>
            </div>
          ) : url ? (
            isPdf ? (
              <iframe 
                src={url}
                className="w-full h-full border-0"
                title={title || 'Document'}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <img 
                  src={url} 
                  alt={title || 'Document'} 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
