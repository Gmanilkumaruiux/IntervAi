import React from 'react';
import { clsx } from 'clsx';

export interface ProgressProps {
  value: number; // 0 - 100
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  height?: string;
  showValue?: boolean;
  color?: 'accent' | 'emerald' | 'amber' | 'indigo' | 'primary';
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  height,
  showValue = false,
  color = 'accent',
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colors = {
    accent: 'bg-[#F97316]',
    primary: 'bg-[#334155]',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    indigo: 'bg-indigo-500',
  };

  return (
    <div className={clsx('w-full', className)}>
      <div className={clsx('w-full bg-[#E2E8F0] rounded-full overflow-hidden', height || heights[size])}>
        <div
          className={clsx('h-full transition-all duration-500 ease-out rounded-full', colors[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <div className="flex justify-end mt-1">
          <span className="text-xs font-mono font-semibold text-[#64748B]">{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  );
};
