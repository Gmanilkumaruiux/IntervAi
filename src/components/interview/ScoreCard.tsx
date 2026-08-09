import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Trophy, Award } from 'lucide-react';
import { clsx } from 'clsx';

export interface ScoreCardProps {
  score: number; // 0 - 100
  title?: string;
  subtitle?: string;
  hiringRecommendation?: 'Strong Hire' | 'Hire' | 'Weak Hire' | 'No Hire';
  className?: string;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  score,
  title = 'Overall Evaluation Score',
  subtitle = 'Based on technical accuracy, code quality & problem solving',
  hiringRecommendation = 'Strong Hire',
  className,
}) => {
  const getBadgeStyle = (rec: string) => {
    switch (rec) {
      case 'Strong Hire':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm';
      case 'Hire':
        return 'bg-[#FFEDD5] text-[#EA580C] border-[#FDBA74] shadow-sm';
      case 'Weak Hire':
        return 'bg-amber-100 text-amber-800 border-amber-300 shadow-sm';
      default:
        return 'bg-rose-100 text-rose-800 border-rose-300 shadow-sm';
    }
  };

  return (
    <Card variant="glowing" className={clsx('relative overflow-hidden bg-white border-[#FDBA74]', className)}>
      {/* Ambient background accent glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFEDD5] rounded-full blur-3xl pointer-events-none" />

      <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-6">
          {/* Radial score gauge */}
          <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#E2E8F0]"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#F97316] transition-all duration-1000 ease-out"
                strokeDasharray={`${score}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-[#0F172A] tracking-tight">{score}</span>
              <span className="text-[10px] uppercase font-bold text-[#64748B]">/ 100</span>
            </div>
          </div>

          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-[#EA580C] flex items-center gap-1.5 mb-1 font-mono">
              <Trophy className="w-3.5 h-3.5" /> {title}
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-[#0F172A] tracking-tight">
              {score >= 85 ? 'Exceptional Performance' : score >= 75 ? 'Strong Technical Competency' : 'Needs Practice'}
            </h2>
            <p className="text-xs text-[#64748B] mt-1 max-w-md">{subtitle}</p>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-auto border-t md:border-t-0 md:border-l border-[#E2E8F0] pt-4 md:pt-0 md:pl-8">
          <span className="text-xs text-[#64748B] font-semibold">Hiring Recommendation</span>
          <div className={clsx('px-4 py-2 rounded-xl border text-sm font-bold tracking-wide flex items-center gap-2', getBadgeStyle(hiringRecommendation))}>
            <Award className="w-4 h-4" />
            {hiringRecommendation}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
