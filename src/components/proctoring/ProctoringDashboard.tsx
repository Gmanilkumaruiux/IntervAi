import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { IntegrityScoreGauge } from './IntegrityScoreGauge';
import { LiveIntegrityFeed } from './LiveIntegrityFeed';
import { IntegrityReportSummary } from '../../types/integrity';
import {
  ShieldCheck,
  Maximize2,
  Copy,
  Clock,
  WifiOff,
  Eye,
  FileCheck,
  Zap
} from 'lucide-react';

export interface ProctoringDashboardProps {
  summary: IntegrityReportSummary;
  className?: string;
}

export const ProctoringDashboard: React.FC<ProctoringDashboardProps> = ({
  summary,
  className
}) => {
  const { metrics, logs, score, riskLevel, criticalEventsCount, warningEventsCount, summaryText } = summary;

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Integrity Score Gauge */}
      <IntegrityScoreGauge
        score={score}
        riskLevel={riskLevel}
        criticalEventsCount={criticalEventsCount}
        warningEventsCount={warningEventsCount}
      />

      {/* Metrics Grid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Tab Switches */}
        <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-semibold mb-1">
            <Eye className="w-3.5 h-3.5 text-[#F97316]" /> Tab Switches
          </div>
          <span className="text-xl font-bold font-mono text-[#0F172A]">{metrics.tabSwitchCount}</span>
        </div>

        {/* Focus Losses */}
        <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-600" /> Focus Loss
          </div>
          <span className="text-xl font-bold font-mono text-[#0F172A]">{metrics.focusLossCount}</span>
        </div>

        {/* Fullscreen Exits */}
        <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-semibold mb-1">
            <Maximize2 className="w-3.5 h-3.5 text-amber-600" /> Fullscreen Exit
          </div>
          <span className="text-xl font-bold font-mono text-[#0F172A]">{metrics.fullscreenExitCount}</span>
        </div>

        {/* Pastes Detected */}
        <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-semibold mb-1">
            <Copy className="w-3.5 h-3.5 text-indigo-600" /> Text Pastes
          </div>
          <span className="text-xl font-bold font-mono text-[#0F172A]">{metrics.pasteCount}</span>
        </div>

        {/* Inactivity Events */}
        <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-semibold mb-1">
            <Clock className="w-3.5 h-3.5 text-purple-600" /> Inactivity
          </div>
          <span className="text-xl font-bold font-mono text-[#0F172A]">{metrics.inactivityCount}</span>
        </div>

        {/* Network Disconnects */}
        <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-semibold mb-1">
            <WifiOff className="w-3.5 h-3.5 text-cyan-600" /> Network Disconnects
          </div>
          <span className="text-xl font-bold font-mono text-[#0F172A]">{metrics.networkInterruptionCount}</span>
        </div>
      </div>

      {/* Recruiter Proctoring Summary & Event Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recruiter Summary Card */}
        <Card variant="glass" className="bg-white border-[#E2E8F0]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#0F172A]">
              <FileCheck className="w-4 h-4 text-[#F97316]" /> Recruiter Proctoring Verdict
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <p className="text-[#334155] leading-relaxed bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
              {summaryText}
            </p>

            <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
              <div className="flex justify-between text-xs">
                <span className="text-[#64748B]">Questions Completed:</span>
                <span className="font-bold text-[#0F172A] font-mono">{metrics.questionsCompleted}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#64748B]">Words Typed / Spoken:</span>
                <span className="font-bold text-[#0F172A] font-mono">{metrics.totalWordsTyped} / {metrics.totalWordsSpoken}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#64748B]">Voice vs Text Ratio:</span>
                <span className="font-bold text-[#EA580C] font-mono">{metrics.voiceAnswersCount} Voice / {metrics.textAnswersCount} Text</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Timeline Feed */}
        <Card variant="glass" className="lg:col-span-2 bg-white border-[#E2E8F0]">
          <CardContent className="p-5">
            <LiveIntegrityFeed logs={logs} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
