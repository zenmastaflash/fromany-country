// src/components/documents/DocumentUploadFlow.tsx
'use client';

import { useState } from 'react';
import DocumentUpload from './DocumentUpload';
import DocumentForm from './DocumentForm';
import { Button } from '../ui/Button';

type UploadStep = 'upload' | 'details';

interface DocumentUploadFlowProps {
  onUploadSuccess: () => void;
}

export default function DocumentUploadFlow({ onUploadSuccess }: DocumentUploadFlowProps) {
  const [currentStep, setCurrentStep] = useState<UploadStep>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = async (file: File) => {
    console.log('File selected:', file.name);
    setSelectedFile(file);
    setCurrentStep('details');
  };

  const handleFormSubmit = async (data: any) => {
    if (!selectedFile) {
      console.error('No file selected');
      return;
    }

    try {
      // First upload the file
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      // Make sure dates are properly formatted
      const metadataToSend = {
        ...data,
        issueDate: data.issueDate || null,
        expiryDate: data.expiryDate || null,
        type: data.type || 'OTHER',
        tags: Array.isArray(data.tags) ? data.tags : []
      };
      
      formData.append('metadata', JSON.stringify(metadataToSend));

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload document');
      }

      const result = await response.json();
      console.log('Document uploaded with metadata:', result);
      
      setCurrentStep('upload');
      setSelectedFile(null);
      onUploadSuccess();
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };

  const handleCancel = () => {
    setCurrentStep('upload');
    setSelectedFile(null);
  };

  return (
    <div className="space-y-6">
      {currentStep === 'upload' && (
        <DocumentUpload onFileSelect={handleFileSelect} />
      )}
      {currentStep === 'details' && selectedFile && (
        <DocumentForm
          initialData={{ fileName: selectedFile.name }}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
