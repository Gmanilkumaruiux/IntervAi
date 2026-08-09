import React from 'react';
import { clsx } from 'clsx';

export interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'circle' | 'rectangle';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className,
  variant = 'rectangle',
  count = 1,
}) => {
  const base = 'animate-pulse bg-[#E2E8F0] rounded-xl';

  const variants = {
    text: 'h-4 w-3/4 rounded-md',
    card: 'h-36 w-full rounded-2xl border border-[#CBD5E1]',
    circle: 'w-12 h-12 rounded-full',
    rectangle: 'h-20 w-full rounded-xl',
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={clsx(base, variants[variant], className)} />
      ))}
    </>
  );
};
