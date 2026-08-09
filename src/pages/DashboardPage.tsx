import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { interviewService } from '../services/interviewService';
import { InterviewReport } from '../types/report';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import {
  Sparkles,
  PlayCircle,
  TrendingUp,
  Award,
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart2,
  FileText,
  Sliders,
  Target,
  CheckCircle2
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reports, setReports] = useState<InterviewReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const data = await interviewService.getReportsList();
        setReports(data);
      } catch (err) {
        console.error('Failed to load reports', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  const totalInterviews = reports.length;
  const avgScore = totalInterviews > 0
    ? Math.round(reports.reduce((acc, r) => acc + r.overallScore, 0) / totalInterviews)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-16 select-none"
    >
      {/* Top Welcome Banner Card */}
      <Card variant="glass" className="bg-gradient-to-r from-[#334155] to-[#1E293B] text-white p-6 sm:p-8 rounded-2xl shadow-lg border-0 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-mono border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-[#F97316]" /> AI Assessment Workspace
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Candidate'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Conduct technical practice interviews powered by RAG documents, speech dictation, adaptive difficulty AI recruiter personas, and personalized learning roadmaps.
            </p>
          </div>

          <Button
            onClick={() => navigate('/interview/setup')}
            variant="accent"
            size="lg"
            leftIcon={<PlayCircle className="w-5 h-5 fill-current" />}
            className="px-6 py-3 text-sm font-bold shadow-lg"
          >
            Start New AI Assessment
          </Button>
        </div>
      </Card>

      {/* Analytics Summary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="glass" className="bg-white border-[#E2E8F0] p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider font-mono">Assessments Completed</span>
            <div className="w-8 h-8 rounded-lg bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center">
              <FileText className="w-4 h-4 text-[#F97316]" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0F172A] font-mono">{totalInterviews}</span>
            <span className="text-xs text-[#64748B]">sessions</span>
          </div>
        </Card>

        <Card variant="glass" className="bg-white border-[#E2E8F0] p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider font-mono">Average Evaluation Score</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#0F172A] font-mono">{avgScore > 0 ? `${avgScore}/100` : '--'}</span>
            <span className="text-xs text-[#64748B]">overall</span>
          </div>
        </Card>

        <Card variant="glass" className="bg-white border-[#E2E8F0] p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider font-mono">Strongest Skill Domain</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm font-extrabold text-[#0F172A] block truncate">
              {totalInterviews > 0 ? reports[0].topic : 'Not Evaluated'}
            </span>
          </div>
        </Card>

        <Card variant="glass" className="bg-white border-[#E2E8F0] p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider font-mono">Proctoring Status</span>
            <div className="w-8 h-8 rounded-lg bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-[#F97316]" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 inline-block font-mono">
              Active Engine
            </span>
          </div>
        </Card>
      </div>

      {/* NEW: Active Personalized Learning Roadmaps Card Section */}
      {totalInterviews > 0 && (
        <Card variant="glowing" className="bg-white border-[#FDBA74] p-6 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[#F97316]" />
              <h2 className="text-base font-bold text-[#0F172A]">Personalized Study & Mastery Roadmaps</h2>
            </div>
            <Badge variant="accent" size="sm">Auto-Generated Roadmaps</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.filter(r => r.learningRoadmap).slice(0, 2).map((r) => {
              const rdm = r.learningRoadmap!;
              return (
                <div
                  key={rdm.id}
                  onClick={() => navigate(`/report/${r.id}`)}
                  className="p-4 rounded-xl bg-[#FFF7ED] border border-[#FDBA74] hover:border-[#F97316] transition-all cursor-pointer space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-[#0F172A] group-hover:text-[#EA580C] transition-colors">
                        {rdm.interviewTopic} Roadmap
                      </h3>
                      <span className="text-[10px] text-[#64748B] font-mono">Est: {rdm.estimatedCompletionTime}</span>
                    </div>

                    <Badge variant="emerald" size="sm" className="font-mono font-bold">
                      {rdm.overallProgressPercentage}% Complete
                    </Badge>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-white border border-[#FDBA74] overflow-hidden">
                    <div
                      className="h-full bg-[#F97316] transition-all duration-300"
                      style={{ width: `${rdm.overallProgressPercentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 text-[#EA580C] font-semibold">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" /> {rdm.skillsToImprove.length} Priority Skills Identified
                    </span>
                    <span className="flex items-center gap-1 group-hover:underline">
                      View Roadmap <ArrowRight className="w-3.5 h-3.5 text-[#F97316]" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Main Section: Recent Assessment History OR Clean Empty State */}
      <Card variant="glass" className="bg-white border-[#E2E8F0] p-6 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">Recent Technical Assessments</h2>
            <p className="text-xs text-[#64748B]">View past AI evaluations, scores, and recruiter verdicts</p>
          </div>

          {totalInterviews > 0 && (
            <Button onClick={() => navigate('/reports')} variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Reports
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <LoadingSkeleton variant="rectangle" className="h-16" />
            <LoadingSkeleton variant="rectangle" className="h-16" />
          </div>
        ) : totalInterviews === 0 ? (
          /* Clean Production Empty State */
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#94A3B8] flex items-center justify-center mx-auto shadow-xs">
              <FileText className="w-8 h-8 text-[#64748B]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#0F172A]">No Interview Reports Recorded Yet</h3>
              <p className="text-xs text-[#64748B] max-w-md mx-auto">
                Complete your first technical practice session to generate personalized performance analytics, personalized learning roadmaps, and PDF assessment reports.
              </p>
            </div>
            <Button
              onClick={() => navigate('/interview/setup')}
              variant="glow"
              size="md"
              leftIcon={<Sliders className="w-4 h-4" />}
              className="mt-2"
            >
              Configure First AI Assessment
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.slice(0, 3).map((report) => (
              <div
                key={report.id}
                onClick={() => navigate(`/report/${report.id}`)}
                className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#F97316] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] text-[#F97316] flex items-center justify-center font-bold text-sm shadow-xs font-mono">
                    {report.overallScore}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F172A] group-hover:text-[#EA580C] transition-colors flex items-center gap-2">
                      {report.topic} <Badge variant="accent" size="sm">{report.difficulty}</Badge>
                    </h4>
                    <p className="text-[11px] text-[#64748B] font-mono flex items-center gap-2 mt-0.5">
                      <span>Persona: {report.persona}</span>
                      <span>• {report.date}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={report.hiringRecommendation === 'Strong Hire' ? 'emerald' : 'indigo'} size="sm">
                    {report.hiringRecommendation}
                  </Badge>
                  <ArrowRight className="w-4 h-4 text-[#64748B] group-hover:text-[#F97316] transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
};
