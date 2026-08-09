import React from 'react';
import { clsx } from 'clsx';
import { Bot, User } from 'lucide-react';

export interface AvatarProps {
  src?: string;
  name?: string;
  isAi?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'busy' | 'offline';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = 'Candidate',
  isAi = false,
  size = 'md',
  status,
  className
}) => {
  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  };

  const getInitials = (n: string) => {
    const parts = n.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return n.slice(0, 2).toUpperCase();
  };

  return (
    <div className="relative inline-block flex-shrink-0">
      {isAi ? (
        <div className={clsx('rounded-xl bg-gradient-to-tr from-[#F97316] to-[#334155] p-0.5 shadow-md shadow-[#F97316]/20', sizes[size], className)}>
          <div className="w-full h-full rounded-[10px] bg-[#1E293B] flex items-center justify-center text-[#F97316]">
            <Bot className={size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-7 h-7' : size === 'xl' ? 'w-10 h-10' : 'w-5 h-5'} />
          </div>
        </div>
      ) : src ? (
        <img
          src={src}
          alt={name}
          className={clsx('rounded-xl object-cover border border-[#E2E8F0] shadow-sm', sizes[size], className)}
        />
      ) : (
        <div className={clsx('rounded-xl bg-[#F1F5F9] border border-[#CBD5E1] flex items-center justify-center text-[#334155] font-bold shadow-sm', sizes[size], className)}>
          {name ? getInitials(name) : <User className="w-5 h-5" />}
        </div>
      )}

      {status && (
        <span
          className={clsx(
            'absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-white',
            status === 'online' ? 'bg-emerald-500 w-3 h-3' : status === 'busy' ? 'bg-amber-500 w-3 h-3' : 'bg-slate-400 w-3 h-3'
          )}
        />
      )}
    </div>
  );
};
