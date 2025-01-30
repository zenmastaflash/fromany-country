// src/app/auth/signup/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function SignUp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [loading, setLoading] = useState(false);
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
        router.push('/auth/terms');
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
            <div>
              <label>Display Name</label>
              <Input
                required
                value={formData.displayName}
                onChange={(e) => setFormData({...formData, displayName: e.target.value})}
              />
            </div>

            <div>
              <label>Country of Origin</label>
              <Input
                required
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Continue'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
