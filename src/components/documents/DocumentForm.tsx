// src/components/documents/DocumentForm.tsx
'use client';

import { useState } from 'react';
import { DocumentType } from '@prisma/client';
import { Input } from '../ui/input'; // Assuming you have an input component
import { Button } from '../ui/Button'; // Correct path and case

interface DocumentFormProps {
  initialData?: {
    id?: string;
    title?: string | null;
    type?: DocumentType;
    number?: string | null;
    issueDate?: Date | null;
    expiryDate?: Date | null;
    issuingCountry?: string | null;
    tags?: string[];
    fileName?: string | null;
    fileUrl?: string | null;
  };
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

interface FormData {
  title: string;
  type: DocumentType;
  number: string;
  issueDate: string;
  expiryDate: string;
  issuingCountry: string;
  tags: string;
}

export default function DocumentForm({ initialData, onSubmit, onCancel }: DocumentFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: initialData?.title || '',
    type: initialData?.type || DocumentType.OTHER,
    number: initialData?.number || '',
    issueDate: initialData?.issueDate ? new Date(initialData.issueDate).toISOString().split('T')[0] : '',
    expiryDate: initialData?.expiryDate ? new Date(initialData.expiryDate).toISOString().split('T')[0] : '',
    issuingCountry: initialData?.issuingCountry || '',
    tags: initialData?.tags?.join(', ') || '',
  });

  const documentTypes = Object.values(DocumentType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()), // Convert tags to array
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-text">
          Document Type *
        </label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as DocumentType })}
          className="mt-1 block w-full rounded-md border-border bg-secondary text-text shadow-sm focus:border-primary focus:ring-primary"
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
        <label className="block text-sm font-medium text-text">
          Title *
        </label>
        <Input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text">
          Issue Date
        </label>
        <Input
          type="date"
          value={formData.issueDate}
          onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
          className="mt-1"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-text">
          Expiry Date *
        </label>
        <Input
          type="date"
          value={formData.expiryDate}
          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
          className="mt-1"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text">
          Document Number
        </label>
        <Input
          type="text"
          value={formData.number}
          onChange={(e) => setFormData({ ...formData, number: e.target.value })}
          className="mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text">
          Issuing Country
        </label>
        <Input
          type="text"
          value={formData.issuingCountry}
          onChange={(e) => setFormData({ ...formData, issuingCountry: e.target.value })}
          className="mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text">
          Tags (comma-separated)
        </label>
        <Input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className="mt-1"
        />
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            variant="secondary"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
        >
          Save
        </Button>
      </div>
    </form>
  );
}
