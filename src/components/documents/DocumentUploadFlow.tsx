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

export default function DocumentUploadFlow() {
  const [currentStep, setCurrentStep] = useState<UploadStep>('upload');
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

  const handleFileSelect = (file: File) => {
    console.log('File selected:', file.name); // Log file selection
    // Simulate file upload and set uploaded file state
    setUploadedFile({
      key: 'example-key',
      document: {
        id: 'example-id',
        fileName: file.name,
        fileUrl: 'https://example.com/file-url',
      },
    });
    setCurrentStep('details'); // Move to the details step
    console.log('Current step:', currentStep); // Log current step
  };

  const handleFormSubmit = (data: any) => {
    // Handle form submission and move to the next step
    console.log('Form data submitted:', data);
    setCurrentStep('preview');
  };

  const handleCancel = () => {
    // Handle cancel action
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