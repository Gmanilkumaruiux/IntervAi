import React from 'react';
import { clsx } from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid' | 'interactive' | 'glowing';
}

export const Card: React.FC<CardProps> = ({
  className,
  variant = 'glass',
  children,
  ...props
}) => {
  const variantStyles = {
    glass: 'bg-white border border-[#E2E8F0] rounded-2xl shadow-sm hover:shadow-md transition-shadow',
    solid: 'bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-sm',
    interactive: 'glass-panel-interactive rounded-2xl shadow-sm cursor-pointer',
    glowing: 'bg-white border border-[#F97316]/30 shadow-[0_0_25px_rgba(249,115,22,0.12)] rounded-2xl',
  };

  return (
    <div className={clsx(variantStyles[variant], className)} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={clsx('p-6 pb-3 border-b border-[#E2E8F0]', className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, children, ...props }) => (
  <h3 className={clsx('text-lg font-semibold tracking-tight text-[#0F172A]', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, children, ...props }) => (
  <p className={clsx('text-xs text-[#64748B] mt-1', className)} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={clsx('p-6', className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={clsx('p-6 pt-3 border-t border-[#E2E8F0] flex items-center justify-between', className)} {...props}>
    {children}
  </div>
);
