// src/components/travel/CountryAutocomplete.tsx
'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface CountryAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
}

export function CountryAutocomplete({ value, onChange }: CountryAutocompleteProps) {
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/countries')
      .then(res => res.json())
      .then(data => setCountries(data.countries))
      .catch(error => console.error('Error fetching countries:', error));
  }, []);

  return (
    <Input
      list="countries"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-secondary-dark text-text"
      placeholder="Select country..."
    >
      <datalist id="countries">
        {countries.map((country) => (
          <option key={country} value={country} />
        ))}
      </datalist>
    </Input>
  );
}
