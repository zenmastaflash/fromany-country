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

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const response = await fetch(`/api/documents/view/${documentId}`);
        if (!response.ok) {
          throw new Error('Failed to load document');
        }
        const data = await response.json();
        setUrl(data.url);
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
      <Card className="w-full max-w-4xl h-[90vh] flex flex-col bg-background">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{title || 'Document Viewer'}</CardTitle>
          <Button variant="ghost" onClick={onClose} size="icon">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden relative">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-destructive">{error}</p>
            </div>
          ) : url ? (
            <iframe 
              src={url}
              className="w-full h-full border-0"
              title={title || 'Document'}
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
