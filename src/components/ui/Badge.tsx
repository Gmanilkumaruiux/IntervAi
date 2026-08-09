import React from 'react';
import { clsx } from 'clsx';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'slate' | 'emerald' | 'rose' | 'amber' | 'indigo' | 'outline';
  size?: 'sm' | 'md';
  onClick?: () => void;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className,
}) => {
  const baseStyles = 'inline-flex items-center font-mono font-bold uppercase tracking-wider rounded-md border select-none';

  const variants = {
    primary: 'bg-[#F1F5F9] text-[#334155] border-[#CBD5E1]',
    accent: 'bg-[#FFEDD5] text-[#EA580C] border-[#FDBA74]',
    slate: 'bg-[#F1F5F9] text-[#334155] border-[#CBD5E1]',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    outline: 'bg-white text-[#334155] border-[#CBD5E1]',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      onClick={onClick}
      className={clsx(baseStyles, variants[variant], sizes[size], onClick && 'cursor-pointer hover:opacity-90', className)}
    >
      {children}
    </span>
  );
};
