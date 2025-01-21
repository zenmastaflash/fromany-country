'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

function TermsContent() {
  const [isAccepting, setIsAccepting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const acceptTerms = async () => {
    setIsAccepting(true);
    try {
      const response = await fetch('/api/auth/accept-terms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        console.error('Failed to accept terms');
      }
    } catch (error) {
      console.error('Error accepting terms:', error);
    }
    setIsAccepting(false);
  };

  return (
    <Card className="max-w-2xl w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Terms of Service</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="prose prose-sm max-w-none">
          <h2 className="text-xl font-semibold">Welcome to fromany.country</h2>
          
          <p>By using this service, you agree to:</p>
          
          <ul className="list-disc pl-5 space-y-2">
            <li>Provide accurate information about your travel and documents</li>
            <li>Use this service in compliance with all applicable laws and regulations</li>
            <li>Understand that tax information provided is for guidance only and should be verified with a professional</li>
            <li>Take responsibility for your own travel and visa compliance</li>
            <li>Not share your account access with others</li>
          </ul>

          <p className="mt-4 text-sm text-gray-600">
            This service is intended to help digital nomads and global citizens manage their travel and stay compliant with various regulations. However, you should always verify critical information with relevant authorities or professional advisors.
          </p>
        </div>

        <Button 
          onClick={acceptTerms} 
          className="w-full"
          disabled={isAccepting}
        >
          {isAccepting ? 'Accepting...' : 'I Accept'}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Terms() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <TermsContent />
      </Suspense>
    </main>
  );
}
