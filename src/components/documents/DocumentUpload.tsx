'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface DocumentUploadProps {
  onSuccess?: () => void;
}

const documentTypes = [
  'PASSPORT',
  'VISA',
  'TAX_RETURN',
  'DRIVERS_LICENSE',
  'RESIDENCY_PERMIT',
  'BANK_STATEMENT',
  'INSURANCE',
  'OTHER'
] as const;

export default function DocumentUpload({ onSuccess }: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [docType, setDocType] = useState<string>('OTHER');
  const [docNumber, setDocNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [issuingCountry, setIssuingCountry] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files?.length) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', files[0]);
      formData.append('type', docType);
      formData.append('number', docNumber);
      formData.append('issueDate', issueDate);
      formData.append('expiryDate', expiryDate);
      formData.append('issuingCountry', issuingCountry);
      formData.append('tags', JSON.stringify(tags));

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      // Reset form
      setFiles(null);
      setDocType('OTHER');
      setDocNumber('');
      setIssueDate('');
      setExpiryDate('');
      setIssuingCountry('');
      setTags([]);
      const form = e.target as HTMLFormElement;
      form.reset();
      
      onSuccess?.();
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Document Type</label>
        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        >
          {documentTypes.map((type) => (
            <option key={type} value={type}>
              {type.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Document Number</label>
        <input
          type="text"
          value={docNumber}
          onChange={(e) => setDocNumber(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Issue Date</label>
          <input
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Issuing Country</label>
        <input
          type="text"
          value={issuingCountry}
          onChange={(e) => setIssuingCountry(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tags</label>
        <div className="mt-1 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => setTags(tags.filter((_, i) => i !== index))}
                className="ml-1 inline-flex items-center p-0.5 rounded-full hover:bg-indigo-200"
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleTagAdd}
            placeholder="Add tags..."
            className="flex-1 min-w-[100px] rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <input
          type="file"
          onChange={(e) => setFiles(e.target.files)}
          className="w-full"
          accept=".pdf,.jpg,.jpeg,.png"
          disabled={isUploading}
          required
        />
      </div>

      <Button type="submit" disabled={!files?.length || isUploading}>
        {isUploading ? 'Uploading...' : 'Upload'}
      </Button>
    </form>
  );
}