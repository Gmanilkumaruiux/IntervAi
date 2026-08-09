import React from 'react';
import { IntegrityLogEntry } from '../../types/integrity';
import { Badge } from '../ui/Badge';
import { ShieldAlert, AlertTriangle, Info, Clock, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';

export interface LiveIntegrityFeedProps {
  logs: IntegrityLogEntry[];
  maxItems?: number;
  className?: string;
}

export const LiveIntegrityFeed: React.FC<LiveIntegrityFeedProps> = ({
  logs,
  maxItems,
  className
}) => {
  const displayLogs = maxItems ? logs.slice(-maxItems) : logs;

  const getLogIcon = (severity: string) => {
    if (severity === 'critical') return <ShieldAlert className="w-4 h-4 text-rose-600" />;
    if (severity === 'warning') return <AlertTriangle className="w-4 h-4 text-amber-600" />;
    return <Info className="w-4 h-4 text-indigo-600" />;
  };

  const getLogStyle = (severity: string) => {
    if (severity === 'critical') return 'bg-rose-50 border-rose-200 text-rose-950';
    if (severity === 'warning') return 'bg-amber-50 border-amber-200 text-amber-950';
    return 'bg-slate-50 border-slate-200 text-slate-900';
  };

  return (
    <div className={clsx('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5 font-mono">
          <Clock className="w-3.5 h-3.5 text-[#F97316]" /> Real-Time Event Timeline
        </h4>
        <span className="text-[11px] font-mono text-[#64748B]">{logs.length} Total Events Logged</span>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {displayLogs.length > 0 ? (
          displayLogs.slice().reverse().map((log) => (
            <div
              key={log.id}
              className={clsx('p-3 rounded-xl border flex items-start gap-3 transition-colors', getLogStyle(log.severity))}
            >
              <div className="p-1.5 rounded-lg bg-white border border-[#E2E8F0] shadow-xs flex-shrink-0">
                {getLogIcon(log.severity)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold truncate">{log.title}</span>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-[#64748B]">{log.formattedTime}</span>
                    <Badge variant={log.severity === 'critical' ? 'rose' : log.severity === 'warning' ? 'amber' : 'indigo'} size="sm">
                      {log.severity}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{log.description}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center border border-dashed border-[#CBD5E1] rounded-xl text-xs text-[#64748B]">
            No proctoring events recorded yet.
          </div>
        )}
      </div>
    </div>
  );
};
