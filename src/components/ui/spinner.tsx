'use client';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-32 w-32 border-t-2 border-b-2'
};

export function Spinner({ size = 'md' }: SpinnerProps) {
  return (
    <div 
      className={`animate-spin rounded-full border-emerald-500 ${sizeClasses[size]}`}
      aria-label="Loading"
    />
  );
} 