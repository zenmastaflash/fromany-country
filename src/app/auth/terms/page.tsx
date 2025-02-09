'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

function TermsContent() {
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const acceptTerms = async () => {
    setIsAccepting(true);
    setError(null);
    
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
        const data = await response.json();
        setError(data.error || 'Failed to accept terms');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
    setIsAccepting(false);
  };

  return (
    <Card className="max-w-2xl w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Accept Terms of Service</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="prose prose-sm max-w-none">
          <h2 className="text-xl font-semibold">Welcome to fromany.country</h2>
          
          <p>Please read these terms carefully. By accepting, you will create an account with fromany.country and agree to our terms of service:</p>
          
          <ul className="list-disc pl-5 space-y-2">
            <li>fromany.country is a tool designed to help you manage your global mobility. While we strive for accuracy, we cannot guarantee the completeness or accuracy of any information provided.</li>
            <li>The tax calculations and residency assessments provided are for informational purposes only. You should consult with qualified professionals for advice specific to your situation.</li>
            <li>You are responsible for maintaining the confidentiality of your account and all activities that occur under it.</li>
            <li>We store and process your data as outlined in our Privacy Policy to provide and improve our services.</li>
            <li>We may update these terms as our services evolve. Continued use of the service after changes constitutes acceptance of the updated terms.</li>
          </ul>

          <p className="mt-4 text-sm text-gray-600">
            By clicking "Create Account & Accept", you acknowledge that you have read and understood these terms, agree to create an account with fromany.country, and agree to be bound by these terms. If you do not agree to these terms, you should not create an account or use this service.
          </p>
        </div>

        {error && (
          <div className="text-red-600 text-sm p-2 rounded bg-red-50">
            {error}
          </div>
        )}

        <Button 
          onClick={acceptTerms} 
          className="w-full"
          disabled={isAccepting}
        >
          {isAccepting ? 'Accepting Terms...' : 'Accept Terms'}
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
