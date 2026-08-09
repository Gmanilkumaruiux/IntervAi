import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';
import { RiskLevel } from '../../types/integrity';
import { clsx } from 'clsx';

export interface IntegrityScoreGaugeProps {
  score: number; // 0 - 100
  riskLevel: RiskLevel;
  criticalEventsCount: number;
  warningEventsCount: number;
  className?: string;
}

export const IntegrityScoreGauge: React.FC<IntegrityScoreGaugeProps> = ({
  score,
  riskLevel,
  criticalEventsCount,
  warningEventsCount,
  className
}) => {
  const getBadgeVariant = (risk: RiskLevel) => {
    if (risk === 'Low') return 'emerald';
    if (risk === 'Medium') return 'amber';
    return 'rose';
  };

  return (
    <Card variant="glass" className={clsx('bg-white border-[#E2E8F0] shadow-sm', className)}>
      <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Gauge Ring */}
          <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#E2E8F0]"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={clsx(
                  'transition-all duration-1000 ease-out',
                  score >= 85 ? 'text-emerald-500' : score >= 65 ? 'text-amber-500' : 'text-rose-500'
                )}
                strokeDasharray={`${score}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xl font-black text-[#0F172A]">{score}</span>
              <span className="text-[9px] font-bold text-[#64748B] uppercase font-mono">/ 100</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-bold tracking-wider text-[#64748B] flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F97316]" /> Interview Integrity Score
              </span>
              <Badge variant={getBadgeVariant(riskLevel)} size="sm">
                {riskLevel} Risk
              </Badge>
            </div>
            <h3 className="text-base font-extrabold text-[#0F172A]">
              {score >= 85 ? 'High Credibility Session' : score >= 65 ? 'Minor Anomalies Flagged' : 'High Integrity Risk Flagged'}
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Automated browser event monitoring log analysis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-[#E2E8F0] pt-3 sm:pt-0 sm:pl-6 text-xs font-mono">
          <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-center">
            <span className="text-base font-bold block">{criticalEventsCount}</span>
            <span className="text-[10px] uppercase font-semibold">Critical</span>
          </div>

          <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-center">
            <span className="text-base font-bold block">{warningEventsCount}</span>
            <span className="text-[10px] uppercase font-semibold">Warnings</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
