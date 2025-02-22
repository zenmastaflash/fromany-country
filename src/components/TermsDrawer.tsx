// src/components/TermsDrawer.tsx
"use client"

import { Button } from '@/components/ui/Button';
import { X, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import TermsContent from './TermsContent';

interface TermsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  isAccepting?: boolean;
}

export default function TermsDrawer({ isOpen, onClose, onAccept, isAccepting = false }: TermsDrawerProps) {
  if (!isOpen) return null;

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const drawerClasses = isMobile
    ? "fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300"
    : "fixed inset-y-0 right-0 z-50 animate-in slide-in-from-right duration-300";

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 animate-in fade-in" onClick={onClose} />
      
      <div className={`${drawerClasses} bg-background max-h-[90vh] md:max-h-screen md:w-[500px] flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Terms of Service</h2>
          <div className="flex items-center gap-2">
            <Link href="/terms" target="_blank" className="flex items-center text-sm hover:underline">
              <ExternalLink className="h-4 w-4 mr-1" />
              <span>Open in new tab</span>
            </Link>
            <button onClick={onClose} className="rounded-full p-1.5 hover:bg-secondary-dark transition-colors">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1">
          <TermsContent />
        </div>
        
        <div className="p-4 border-t flex justify-end">
          <Button onClick={onAccept} disabled={isAccepting}>
            {isAccepting ? 'Accepting Terms...' : 'Accept Terms of Service'}
          </Button>
        </div>
      </div>
    </>
  );
}
