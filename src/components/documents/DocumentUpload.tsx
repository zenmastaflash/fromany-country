'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface DocumentUploadProps {
  category: 'travel' | 'tax';
}

export default function DocumentUpload({ category }: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files?.length) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', files[0]);
      formData.append('category', category);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      // Reset form
      setFiles(null);
      const form = e.target as HTMLFormElement;
      form.reset();
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <input
          type="file"
          onChange={(e) => setFiles(e.target.files)}
          className="w-full"
          accept=".pdf,.jpg,.jpeg,.png"
          disabled={isUploading}
        />
      </div>
      <Button type="submit" disabled={!files?.length || isUploading}>
        {isUploading ? 'Uploading...' : 'Upload'}
      </Button>
    </form>
  );
}