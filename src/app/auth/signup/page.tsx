// src/app/auth/signup/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useTransition } from 'react';

export default function SignUp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    displayName: '',
    country: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/complete-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          ...formData
        })
      });

      if (response.ok) {
        startTransition(() => {
          router.push('/auth/terms');
        });
      } else {
        throw new Error('Failed to complete signup');
      }
    } catch (error) {
      console.error('Signup error:', error);
    }
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Display Name</label>
              <input
                type="text"
                required
                className="w-full rounded-md border border-gray-300 bg-background px-3 py-2"
                value={formData.displayName}
                onChange={(e) => setFormData({...formData, displayName: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Country of Origin</label>
              <input
                type="text"
                required
                className="w-full rounded-md border border-gray-300 bg-background px-3 py-2"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
              />
            </div>

            <Button type="submit" disabled={loading || isPending} className="w-full">
              {loading ? 'Saving...' : 'Continue'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
