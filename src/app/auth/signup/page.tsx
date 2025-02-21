// src/app/auth/signup/page.tsx
'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import TermsDrawer from '@/components/TermsDrawer';

function SignUpForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isAcceptingTerms, setIsAcceptingTerms] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    country: '' // This will be mapped to taxResidency in the API
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
        // Show terms drawer instead of redirecting
        setShowTerms(true);
      } else {
        throw new Error('Failed to complete signup');
      }
    } catch (error) {
      console.error('Signup error:', error);
    }
    setLoading(false);
  };
  
  const handleAcceptTerms = async () => {
    setIsAcceptingTerms(true);
    
    try {
      const response = await fetch('/api/auth/accept-terms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        throw new Error('Failed to accept terms');
      }
    } catch (error) {
      console.error('Terms acceptance error:', error);
    }
    setIsAcceptingTerms(false);
  };

  return (
    <>
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
            
            <div className="text-sm text-gray-500">
              By continuing, you agree to our <button 
                type="button" 
                className="text-primary underline hover:text-primary/80"
                onClick={() => setShowTerms(true)}
              >
                Terms of Service
              </button>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Saving...' : 'Continue'}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <TermsDrawer 
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={handleAcceptTerms}
        isAccepting={isAcceptingTerms}
      />
    </>
  );
}

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
        </Card>
      }>
        <SignUpForm />
      </Suspense>
    </main>
  );
}
