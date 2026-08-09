import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Progress } from '../ui/Progress';
import { Badge } from '../ui/Badge';
import { Target, CheckCircle2, Clock, ListOrdered } from 'lucide-react';

export interface ProgressCardProps {
  currentQuestion: number;
  totalQuestions: number;
  topic: string;
  durationSeconds: number;
  currentScore?: number;
  topicsCovered?: string[];
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  currentQuestion,
  totalQuestions,
  topic,
  durationSeconds,
  currentScore = 85,
  topicsCovered = [],
}) => {
  const percentage = Math.round((currentQuestion / totalQuestions) * 100);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Card variant="glass" className="w-full border-[#E2E8F0] shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#0F172A]">
            <Target className="w-4 h-4 text-[#F97316]" /> Interview Progress
          </CardTitle>
          <Badge variant="accent" size="sm">
            Live Session
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
            <span className="text-[#64748B] flex items-center gap-1">
              <ListOrdered className="w-3.5 h-3.5 text-[#F97316]" /> Question Counter
            </span>
            <span className="text-[#0F172A] font-bold">{currentQuestion} / {totalQuestions}</span>
          </div>
          <Progress value={percentage} color="accent" height="md" />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-[11px] text-[#64748B] block mb-0.5 font-medium">Elapsed Time</span>
            <span className="text-sm font-bold text-[#0F172A] flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-[#F97316]" /> {formatTime(durationSeconds)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-[11px] text-[#64748B] block mb-0.5 font-medium">Est. Live Score</span>
            <span className="text-sm font-bold text-emerald-700 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {currentScore}%
            </span>
          </div>
        </div>

        {topicsCovered.length > 0 && (
          <div className="pt-2 border-t border-[#E2E8F0]">
            <span className="text-xs font-semibold text-[#334155] block mb-2">Topics Evaluated</span>
            <div className="flex flex-wrap gap-1.5">
              {topicsCovered.map((t, idx) => (
                <Badge key={idx} variant="indigo" size="sm">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
