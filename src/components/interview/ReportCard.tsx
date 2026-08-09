import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { InterviewReport } from '../../types/report';
import { Calendar, Clock, Award, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface ReportCardProps {
  report: InterviewReport;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  const navigate = useNavigate();

  const getScoreVariant = (score: number) => {
    if (score >= 85) return 'emerald';
    if (score >= 75) return 'accent';
    if (score >= 60) return 'amber';
    return 'rose';
  };

  return (
    <Card variant="interactive" className="group border-[#E2E8F0] hover:border-[#F97316]/50">
      <CardContent className="p-5 flex flex-col justify-between h-full bg-white rounded-2xl">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <Badge variant={getScoreVariant(report.overallScore)} size="md">
              Score: {report.overallScore}/100
            </Badge>
            <span className="text-[11px] text-[#64748B] flex items-center gap-1 font-mono">
              <Calendar className="w-3 h-3 text-[#94A3B8]" /> {report.date}
            </span>
          </div>

          <h3 className="text-base font-bold text-[#0F172A] group-hover:text-[#EA580C] transition-colors line-clamp-1">
            {report.topic}
          </h3>

          <div className="flex items-center gap-2 mt-2 text-xs text-[#64748B]">
            <Badge variant="indigo" size="sm">{report.difficulty}</Badge>
            <Badge variant="indigo" size="sm">{report.mode}</Badge>
            <span className="flex items-center gap-1 text-[11px] text-[#64748B] ml-auto font-mono">
              <Clock className="w-3 h-3 text-[#94A3B8]" /> {report.durationMinutes}m
            </span>
          </div>

          {report.strengths.length > 0 && (
            <p className="text-xs text-[#334155] mt-3 line-clamp-2 leading-relaxed">
              <span className="text-emerald-700 font-semibold">Highlight: </span>
              {report.strengths[0]}
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-[#E2E8F0] mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#334155]">
            <Award className="w-3.5 h-3.5 text-[#F97316]" />
            <span className="font-semibold text-[#0F172A]">{report.hiringRecommendation}</span>
          </div>

          <Button
            onClick={() => navigate(`/report/${report.id}`)}
            variant="ghost"
            size="sm"
            rightIcon={<ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />}
          >
            View Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
