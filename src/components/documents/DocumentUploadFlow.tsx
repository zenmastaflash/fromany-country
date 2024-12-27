```typescript
// src/components/documents/DocumentUploadFlow.tsx
'use client';

import { useState } from 'react';
import DocumentUpload from './DocumentUpload';
import DocumentForm from './DocumentForm';
import { DocumentType } from '@prisma/client';

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
  const [uploadedFile, setUploadedFile] = useState
