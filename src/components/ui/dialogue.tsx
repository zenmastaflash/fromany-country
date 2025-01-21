// src/components/ui/dialog.tsx
"use client"

import * as React from "react"

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center p-4">
      <div className="bg-secondary-dark border border-border rounded-lg shadow-lg w-full max-w-lg text-text">
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="p-6">
      {children}
    </div>
  );
};

const DialogHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mb-4">
      {children}
    </div>
  );
};

const DialogTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <h2 className="text-2xl font-recoleta text-text">
      {children}
    </h2>
  );
};

const DialogDescription = ({ children }: { children: React.ReactNode }) => {
  return (
    <p className="text-link mt-2">
      {children}
    </p>
  );
};

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
};
