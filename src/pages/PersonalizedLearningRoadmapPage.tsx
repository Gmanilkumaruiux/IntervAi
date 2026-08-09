import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { interviewService } from '../services/interviewService';
import { InterviewReport } from '../types/report';
import { LearningRoadmapView } from '../components/roadmap/LearningRoadmapView';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import {
  Target,
  Sliders,
  Sparkles,
  BookOpen,
  ArrowRight,
  ChevronDown,
  Calendar,
  FileText
} from 'lucide-react';

export const PersonalizedLearningRoadmapPage: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<InterviewReport[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const data = await interviewService.getReportsList();
        setReports(data);
        if (data.length > 0) {
          setSelectedReportId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch reports for roadmap page:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  const activeReport = reports.find(r => r.id === selectedReportId) || reports[0];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="rectangle" className="h-20" />
        <LoadingSkeleton variant="card" className="h-[500px]" />
      </div>
    );
  }

  // Clean Production Empty State if no interviews completed
  if (reports.length === 0 || !activeReport || !activeReport.learningRoadmap) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 pb-16 select-none"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2">
              <Target className="w-6 h-6 text-[#F97316]" /> Personalized Learning Roadmap
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              AI-generated study plans, priority technical topics, practice questions, and curated resources.
            </p>
          </div>
        </div>

        <Card variant="glass" className="bg-white border-[#E2E8F0] p-12 text-center rounded-2xl shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FFEDD5] border border-[#FDBA74] text-[#EA580C] flex items-center justify-center mx-auto shadow-xs">
            <Target className="w-8 h-8 text-[#F97316]" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-[#0F172A]">No Learning Roadmap Available Yet</h2>
            <p className="text-xs text-[#64748B] max-w-md mx-auto leading-relaxed">
              Complete your first AI technical assessment to unlock your dynamic learning roadmap, priority growth areas, step-by-step 7-day study plan, and curated tutorial resources.
            </p>
          </div>

          <Button
            onClick={() => navigate('/interview/setup')}
            variant="glow"
            size="md"
            leftIcon={<Sliders className="w-4 h-4" />}
            className="mt-2"
          >
            Start First AI Assessment
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-16 select-none"
    >
      {/* Top Header Bar with Session Selector Dropdown */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-[#FFEDD5] text-[#EA580C] font-mono text-[10px] font-bold uppercase tracking-wider">
              Skill Acceleration
            </span>
            <span className="text-xs text-[#64748B]">• Dynamic Post-Assessment Roadmap</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2">
            <Target className="w-6 h-6 text-[#F97316]" /> Personalized Learning Roadmap
          </h1>
        </div>

        {/* Dropdown Selector if Candidate has Multiple Reports */}
        {reports.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#64748B] font-mono">Select Assessment:</span>
            <div className="relative">
              <select
                value={selectedReportId}
                onChange={(e) => setSelectedReportId(e.target.value)}
                className="bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#F97316] pr-8 appearance-none cursor-pointer shadow-xs font-mono"
              >
                {reports.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.topic} ({r.date} • {r.overallScore}/100)
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#64748B] absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {/* Main Roadmap Interactive Component */}
      <LearningRoadmapView
        roadmap={activeReport.learningRoadmap}
        onRoadmapUpdate={(updated) => {
          activeReport.learningRoadmap = updated;
        }}
      />
    </motion.div>
  );
};
