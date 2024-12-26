// src/components/documents/DocumentForm.tsx
'use client';

import { useState } from 'react';
import { DocumentType } from '@prisma/client';

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
  tags: string[];
}

export default function DocumentForm({ initialData, onSubmit, onCancel }: DocumentFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: initialData?.title || '',
    type: initialData?.type || DocumentType.OTHER,
    number: initialData?.number || '',
    issueDate: initialData?.issueDate ? new Date(initialData.issueDate).toISOString().split('T')[0] : '',
    expiryDate: initialData?.expiryDate ? new Date(initialData.expiryDate).toISOString().split('T')[0] : '',
    issuingCountry: initialData?.issuingCountry || '',
    tags: initialData?.tags || [],
  });

  const documentTypes = Object.values(DocumentType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Document Type *
        </label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as DocumentType })}
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
        <label className="block text-sm font-medium text-gray-700">
          Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Expiry Date *
        </label>
        <input
          type="date"
          value={formData.expiryDate}
          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Issue Date
        </label>
        <input
          type="date"
          value={formData.issueDate}
          onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Document Number
        </label>
        <input
          type="text"
          value={formData.number}
          onChange={(e) => setFormData({ ...formData, number: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Issuing Country
        </label>
        <input
          type="text"
          value={formData.issuingCountry}
          onChange={(e) => setFormData({ ...formData, issuingCountry: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Save
        </button>
      </div>
    </form>
  );
}
