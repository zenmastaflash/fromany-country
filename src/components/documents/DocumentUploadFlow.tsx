// src/components/documents/DocumentUploadFlow.tsx - updated
'use client';

import { useState } from 'react';
import DocumentUpload from './DocumentUpload';
import DocumentForm from './DocumentForm';
import { Button } from '../ui/Button';
import { DocumentType } from '@prisma/client';

type UploadStep = 'upload' | 'details';

interface DocumentUploadFlowProps {
  onUploadSuccess: () => void;
}

interface DocumentFormData {
  title: string;
  type: DocumentType;
  issueDate?: string | null;
  expiryDate?: string | null;
  number?: string | null;
  issuingCountry?: string | null;
  tags?: string[];
}

export default function DocumentUploadFlow({ onUploadSuccess }: DocumentUploadFlowProps) {
  const [currentStep, setCurrentStep] = useState<UploadStep>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = async (file: File, ocrData?: any) => {
    console.log('File selected:', file.name);
    setSelectedFile(file);
    
    if (ocrData) {
      console.log('OCR data extracted:', ocrData);
      setExtractedData(ocrData);
    }
    
    setCurrentStep('details');
  };

  // Format the extracted OCR data to match the form data structure
  const formatOcrDataForForm = () => {
    if (!extractedData) return {};
    
    const formattedData: any = {};
    
    // Try to generate a title from the document type if detected
    if (extractedData.documentType) {
      const docType = extractedData.documentType as string;
      formattedData.title = `My ${docType.replace('_', ' ').toLowerCase()}`;
      formattedData.type = docType as DocumentType;
    }
    
    // Add document number if found
    if (extractedData.documentNumber) {
      formattedData.number = extractedData.documentNumber;
    }
    
    // Add dates if found
    if (extractedData.dates) {
      if (extractedData.dates.issueDate) {
        // Try to parse and format the date for the form
        try {
          const parsedDate = new Date(extractedData.dates.issueDate);
          if (!isNaN(parsedDate.getTime())) {
            formattedData.issueDate = parsedDate.toISOString().split('T')[0];
          }
        } catch (e) {
          console.warn('Failed to parse issue date:', e);
        }
      }
      
      if (extractedData.dates.expiryDate) {
        try {
          const parsedDate = new Date(extractedData.dates.expiryDate);
          if (!isNaN(parsedDate.getTime())) {
            formattedData.expiryDate = parsedDate.toISOString().split('T')[0];
          }
        } catch (e) {
          console.warn('Failed to parse expiry date:', e);
        }
      }
    }
    
    // Add country if found
    if (extractedData.country) {
      formattedData.issuingCountry = extractedData.country;
    }
    
    return formattedData;
  };

  const handleFormSubmit = async (data: DocumentFormData) => {
    if (!selectedFile) {
      console.error('No file selected');
      return;
    }

    try {
      setIsProcessing(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      // Ensure all fields are properly typed and formatted
      const metadataToSend: DocumentFormData = {
        title: data.title,
        type: data.type || DocumentType.OTHER,
        issueDate: data.issueDate || null,
        expiryDate: data.expiryDate || null,
        number: data.number || null,
        issuingCountry: data.issuingCountry || null,
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
      setExtractedData(null);
      onUploadSuccess();
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setCurrentStep('upload');
    setSelectedFile(null);
    setExtractedData(null);
  };

  // Combine the initial data with OCR-extracted data
  const initialFormData = {
    fileName: selectedFile?.name,
    ...formatOcrDataForForm()
  };

  return (
    <div className="space-y-6">
      {currentStep === 'upload' && (
        <DocumentUpload onFileSelect={handleFileSelect} />
      )}
      {currentStep === 'details' && selectedFile && (
        <>
          {extractedData && (
            <div className="bg-primary bg-opacity-10 rounded-md p-3 mb-4">
              <p className="text-sm text-primary font-medium">
                <span className="inline-flex items-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  OCR Scan Complete
                </span>
                Some fields have been pre-filled based on document scanning. Please review and update as needed.
              </p>
            </div>
          )}
          <DocumentForm
            initialData={initialFormData}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
            isSubmitting={isProcessing}
          />
        </>
      )}
    </div>
  );
}
