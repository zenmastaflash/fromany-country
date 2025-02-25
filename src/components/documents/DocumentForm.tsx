// src/components/documents/DocumentForm.tsx
'use client';

import { useState, useEffect } from 'react';
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
  isSubmitting?: boolean;
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

export default function DocumentForm({ initialData, onSubmit, onCancel, isSubmitting = false }: DocumentFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: initialData?.title || '',
    type: initialData?.type || DocumentType.OTHER,
    number: initialData?.number || '',
    issueDate: initialData?.issueDate ? new Date(initialData.issueDate).toISOString().split('T')[0] : '',
    expiryDate: initialData?.expiryDate ? new Date(initialData.expiryDate).toISOString().split('T')[0] : '',
    issuingCountry: initialData?.issuingCountry || '',
    tags: initialData?.tags?.join(', ') || '',
  });
  const [countries, setCountries] = useState<string[]>([]);

  const documentTypes = Object.values(DocumentType);
  const documentTypeDisplay = {
    [DocumentType.PASSPORT]: 'Passport',
    [DocumentType.VISA]: 'Long-term Visa',
    [DocumentType.TOURIST_VISA]: 'Tourist Visa',
    [DocumentType.TAX_RETURN]: 'Tax Return',
    [DocumentType.DRIVERS_LICENSE]: 'Driver\'s License',
    [DocumentType.RESIDENCY_PERMIT]: 'Residency Permit',
    [DocumentType.BANK_STATEMENT]: 'Bank Statement',
    [DocumentType.INSURANCE]: 'Insurance',
    [DocumentType.OTHER]: 'Other'
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('/api/countries');
        const data = await response.json();
        setCountries(data.countries);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    fetchCountries();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      type: DocumentType.OTHER,
      number: '',
      issueDate: '',
      expiryDate: '',
      issuingCountry: '',
      tags: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()), // Convert tags to array
    });
    resetForm(); // Reset form after successful submission
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
              {documentTypeDisplay[type]}
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
        <select
          value={formData.issuingCountry}
          onChange={(e) => setFormData({ ...formData, issuingCountry: e.target.value })}
          className="mt-1 block w-full rounded-md border-border bg-secondary text-text shadow-sm focus:border-primary focus:ring-primary"
        >
          <option value="">Select a country</option>
          {countries.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
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
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-text rounded-full"></span>
              Saving...
            </span>
          ) : 'Save'}
        </Button>
      </div>
    </form>
  );
}
