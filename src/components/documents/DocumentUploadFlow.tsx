// src/components/documents/DocumentUploadFlow.tsx
'use client';

import { useState } from 'react';
import DocumentUpload from './DocumentUpload';
import DocumentForm from './DocumentForm';
import { DocumentType } from '@prisma/client';
import { Button } from '../ui/Button';

type UploadStep = 'upload' | 'details';

interface UploadedFile {
  key: string;
  document: {
    id: string;
    fileName: string;
    fileUrl: string;
    // ... other document fields
  };
}

interface DocumentUploadFlowProps {
  onUploadSuccess: () => void;
}

export default function DocumentUploadFlow({ onUploadSuccess }: DocumentUploadFlowProps) {
  const [currentStep, setCurrentStep] = useState<UploadStep>('upload');
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

  const handleFileSelect = async (file: File) => {
    console.log('File selected:', file.name);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload document');
      }

      const result = await response.json();
      console.log('Document uploaded:', result);
      setUploadedFile({
        key: result.key,
        document: result.document,
      });
      setCurrentStep('details');
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/documents/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          fileName: uploadedFile?.document.fileName,
          fileUrl: uploadedFile?.document.fileUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create document');
      }

      const result = await response.json();
      console.log('Document created:', result);
      setUploadedFile(null);  // Reset uploaded file
      setCurrentStep('upload');  // Reset to upload step
      onUploadSuccess();  // This triggers the list refresh
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };

  const handleCancel = () => {
    setCurrentStep('upload');
    setUploadedFile(null);
  };

  return (
    <div className="space-y-6">
      {currentStep === 'upload' && (
        <DocumentUpload onFileSelect={handleFileSelect} />
      )}
      {currentStep === 'details' && uploadedFile && (
        <DocumentForm
          initialData={uploadedFile.document}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
