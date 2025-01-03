'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface ShareModalProps {
  documentId: string;
  onClose: () => void;
  onShare: (email: string) => Promise<void>;
  currentShares: string[];
}

export default function ShareModal({ documentId, onClose, onShare, currentShares }: ShareModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await onShare(email);
      setEmail('');
    } catch (err) {
      setError('Failed to share document');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="bg-secondary w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-text">Share Document</CardTitle>
          <Button variant="ghost" onClick={onClose} className="p-2">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleShare} className="space-y-4">
            <div>
              <label className="text-sm text-text">Share with email:</label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="flex-1 rounded-md border-border bg-text text-background"
                />
                <Button type="submit" disabled={isLoading}>
                  Share
                </Button>
              </div>
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            {currentShares.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-text mb-2">Shared with:</h4>
                <div className="space-y-2">
                  {currentShares.map((email) => (
                    <div key={email} className="flex items-center justify-between bg-background p-2 rounded">
                      <span className="text-text">{email}</span>
                      <Button
                        variant="ghost"
                        onClick={() => onShare(email)}
                        className="text-red-500 hover:text-red-600"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
