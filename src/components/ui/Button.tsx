import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'destructive' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-xl';

  const variants = {
    primary: 'bg-[#334155] text-white hover:bg-[#1E293B] active:bg-[#0F172A] focus:ring-[#334155] shadow-sm',
    secondary: 'bg-[#1E293B] text-white hover:bg-[#0F172A] focus:ring-[#1E293B] shadow-sm',
    accent: 'bg-[#F97316] text-white hover:bg-[#EA580C] focus:ring-[#F97316] shadow-sm',
    outline: 'border border-[#E2E8F0] bg-white text-[#334155] hover:bg-[#F1F5F9] hover:text-[#0F172A] focus:ring-[#F97316]',
    ghost: 'text-[#334155] hover:bg-[#F1F5F9] hover:text-[#0F172A] focus:ring-[#F97316]',
    destructive: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 shadow-sm',
    glow: 'bg-[#F97316] text-white hover:bg-[#EA580C] focus:ring-[#F97316] shadow-md shadow-[#F97316]/25 hover:shadow-lg hover:shadow-[#F97316]/35',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-xs sm:text-sm px-4 py-2 gap-2',
    lg: 'text-sm sm:text-base px-6 py-2.5 gap-2.5',
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
