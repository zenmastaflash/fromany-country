// src/app/terms/page.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import TermsContent from '@/components/TermsContent';

export default function TermsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <TermsContent />
        </CardContent>
      </Card>
    </main>
  );
}
