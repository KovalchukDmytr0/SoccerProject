'use client';

import { ReactNode } from 'react';

interface AlertProps {
  children: ReactNode;
  variant?: 'default' | 'destructive';
  className?: string;
}

const variantClasses = {
  default: 'bg-slate-800 text-white',
  destructive: 'bg-red-500/10 text-red-500'
};

export function Alert({ 
  children, 
  variant = 'default',
  className = ''
}: AlertProps) {
  return (
    <div 
      role="alert"
      className={`rounded-lg p-4 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </div>
  );
} 