// src/components/documents/DocumentUploadFlow.tsx
'use client';

import { useState } from 'react';
import DocumentUpload from './DocumentUpload';
import DocumentForm from './DocumentForm';
import { DocumentType } from '@prisma/client';
import { Button } from '../ui/Button';

type UploadStep = 'upload' | 'details' | 'preview';

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
    console.log('Form data submitted:', data);
    try {
      // Send form data to the existing upload endpoint
      const response = await fetch('/api/documents/upload', {
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
      setCurrentStep('preview');
      onUploadSuccess();
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
      {currentStep === 'preview' && uploadedFile && (
        <div>
          <h2 className="text-lg font-medium text-text">Preview Document</h2>
          <p>File Name: {uploadedFile.document.fileName}</p>
          <a href={uploadedFile.document.fileUrl} target="_blank" rel="noopener noreferrer" className="text-link hover:text-link-hover">
            View Document
          </a>
          <Button onClick={handleCancel} variant="secondary">Edit</Button>
          <Button onClick={() => console.log('Confirmed')} variant="primary">Confirm</Button>
        </div>
      )}
    </div>
  );
}
