// src/components/documents/DocumentUpload.tsx
'use client';

import { useState, useRef } from 'react';

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

type DocumentUploadProps = {
  onSuccess?: () => void;
  onFileSelect?: (file: File) => void;  // New prop for multi-step
};

type ValidationError = {
  type?: string;
  size?: string;
};

export default function DocumentUpload({ onSuccess, onFileSelect }: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<ValidationError | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): ValidationError | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return { type: 'File type not supported. Please upload a PDF or image file.' };
    }
    if (file.size > MAX_FILE_SIZE) {
      return { size: 'File is too large. Maximum size is 10MB.' };
    }
    return null;
  };

  const handleFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    
    if (onFileSelect) {
      // If we're doing multi-step, just pass the file up
      onFileSelect(file);
      return;
    }

    // Otherwise proceed with direct upload (existing functionality)
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData, // Do not set Content-Type manually
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload document');
      }

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      onSuccess?.();
    } catch (error) {
      setError({ type: error instanceof Error ? error.message : 'Failed to upload document' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        className={`flex items-center justify-center w-full ${
          dragActive ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-gray-50'
        } border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 transition-colors`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <label className="flex flex-col items-center justify-center w-full h-32 cursor-pointer">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className={`w-8 h-8 mb-4 ${dragActive ? 'text-indigo-600' : 'text-gray-500'}`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PDF, PNG, JPG or JPEG (max. 10MB)</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.png,.jpg,.jpeg"
            disabled={isUploading}
          />
        </label>
      </div>

      {isUploading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {error && (
        <div className="text-red-600 text-sm">
          {error.type || error.size}
        </div>
      )}
    </div>
  );
}
