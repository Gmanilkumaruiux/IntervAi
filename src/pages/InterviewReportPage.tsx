import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ScoreCard } from '../components/interview/ScoreCard';
import { ProctoringDashboard } from '../components/proctoring/ProctoringDashboard';
import { PrintablePDFReport } from '../components/report/PrintablePDFReport';
import { LearningRoadmapView } from '../components/roadmap/LearningRoadmapView';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { interviewService } from '../services/interviewService';
import { pdfExportService } from '../services/pdfExportService';
import { InterviewReport } from '../types/report';
import {
  Download,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Award,
  BarChart2,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Sparkles,
  FileCheck,
  Users,
  ShieldCheck,
  FileText,
  Target
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export const InterviewReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<InterviewReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(1);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    interviewService.getReport(id)
      .then(setReport)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleDownloadPDF = () => {
    if (!report) return;
    setIsDownloading(true);
    pdfExportService.exportToPDF(report);
    setTimeout(() => setIsDownloading(false), 800);
  };

  if (isLoading || !report) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="rectangle" className="h-40" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LoadingSkeleton variant="card" className="h-64" />
          <LoadingSkeleton variant="card" className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Dedicated Printable PDF Document */}
      <PrintablePDFReport report={report} />

      {/* Screen Interactive View */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 pb-16 print:hidden select-none"
      >
        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button
            onClick={() => navigate('/reports')}
            variant="outline"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Reports
          </Button>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate('/interview/setup')}
              variant="secondary"
              size="sm"
            >
              Retake Session
            </Button>
            <Button
              onClick={handleDownloadPDF}
              isLoading={isDownloading}
              variant="glow"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
            >
              Download PDF Report
            </Button>
          </div>
        </div>

        {/* Hero Score Card */}
        <ScoreCard
          score={report.overallScore}
          title={`Enterprise Evaluation Report • ${report.topic}`}
          subtitle={`Evaluated by ${report.persona || 'Senior AI Engineer'} on ${report.date} (${report.durationMinutes} mins)`}
          hiringRecommendation={report.hiringRecommendation}
        />

        {/* Interview Integrity & Proctoring Section */}
        {report.integritySummary && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#F97316]" /> Interview Integrity & Proctoring Analysis
              </h2>
              <Badge variant={report.integritySummary.riskLevel === 'Low' ? 'emerald' : 'amber'} size="md">
                Integrity Status: {report.integritySummary.riskLevel} Risk
              </Badge>
            </div>

            <ProctoringDashboard summary={report.integritySummary} />
          </div>
        )}

        {/* Recruiter Persona Verdict & RAG Citations Card */}
        <Card variant="glowing" className="bg-white border-[#FDBA74]">
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#F97316]" />
                <h3 className="text-base font-bold text-[#0F172A]">AI Recruiter Persona Assessment Verdict</h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="accent" size="md">Interviewer: {report.persona}</Badge>
                <Badge variant="indigo" size="md">Initial: {report.initialDifficulty} → Final: {report.difficulty}</Badge>
              </div>
            </div>

            <p className="text-xs text-[#334155] leading-relaxed font-sans">
              <span className="font-bold text-[#0F172A]">Recruiter Summary Opinion: </span>
              {report.personaVerdict}
            </p>

            {/* RAG Source Citation Badge */}
            {report.sourceDocuments && report.sourceDocuments.length > 0 && (
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-[#0F172A] font-bold">
                  <FileText className="w-4 h-4 text-[#F97316]" /> Primary RAG Source Citation:
                </span>
                <span className="font-mono text-[#EA580C] font-semibold">{report.sourceDocuments[0].name} ({report.sourceDocuments[0].chunksCount} vector chunks indexed)</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Personalized Learning Roadmap Module */}
        {report.learningRoadmap && (
          <div className="space-y-4">
            <LearningRoadmapView
              roadmap={report.learningRoadmap}
              onRoadmapUpdate={(updated) => setReport({ ...report, learningRoadmap: updated })}
            />
          </div>
        )}

        {/* Competency Category Performance Bar Chart */}
        <Card variant="glass" className="border-[#E2E8F0] bg-white w-full">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2 text-[#0F172A]">
              <BarChart2 className="w-4 h-4 text-[#F97316]" /> Technical Competency Category Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={report.categoryBreakdown} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="category" stroke="#334155" tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }} />
                <YAxis domain={[0, 100]} stroke="#334155" tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '0.75rem', color: '#0F172A', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="score" fill="#334155" radius={[8, 8, 0, 0]} barSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Strengths, Weaknesses & Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Strengths */}
          <Card variant="glass" className="border-[#E2E8F0] bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-emerald-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Candidate Strengths
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {report.strengths.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[#334155]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <p className="leading-relaxed">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Weaknesses */}
          <Card variant="glass" className="border-[#E2E8F0] bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-amber-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Focus / Growth Areas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {report.weaknesses.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[#334155]">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                  <p className="leading-relaxed">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card variant="glass" className="border-[#E2E8F0] bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-[#EA580C] flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[#F97316]" /> Next Action Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {report.recommendations.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[#334155]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] mt-1.5 flex-shrink-0" />
                  <p className="leading-relaxed">{item}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Question-by-Question Accordion Breakdown */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[#F97316]" /> Detailed Q&A Response Analysis
          </h2>

          <div className="space-y-3">
            {report.questions.map((q) => {
              const isExpanded = expandedQuestion === q.questionNumber;

              return (
                <Card key={q.questionNumber} variant="solid" className="border-[#E2E8F0] bg-white overflow-hidden">
                  <div
                    onClick={() => setExpandedQuestion(isExpanded ? null : q.questionNumber)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#F8FAFC] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-[#FFEDD5] border border-[#FDBA74] text-[#EA580C] font-bold text-xs flex items-center justify-center font-mono">
                        Q{q.questionNumber}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-[#0F172A] line-clamp-1">{q.question}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-[#64748B] font-mono">{q.topic}</span>
                          {q.difficultyLevel && (
                            <Badge variant="accent" size="sm">{q.difficultyLevel}</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant={q.score >= 85 ? 'emerald' : 'amber'} size="sm">
                        {q.score} / 100
                      </Badge>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-[#64748B]" /> : <ChevronDown className="w-4 h-4 text-[#64748B]" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-4 pt-0 border-t border-[#E2E8F0] space-y-4 bg-[#F8FAFC]">
                      <div className="pt-3">
                        <span className="text-xs font-semibold text-[#64748B] block mb-1">Candidate Answer:</span>
                        <p className="text-xs text-[#0F172A] bg-white p-3 rounded-xl border border-[#E2E8F0] leading-relaxed">
                          {q.candidateAnswer}
                        </p>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-[#EA580C] block mb-1 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> AI Evaluator Feedback ({report.persona}):
                        </span>
                        <p className="text-xs text-[#7C2D12] bg-[#FFF7ED] p-3 rounded-xl border border-[#FDBA74] leading-relaxed">
                          {q.aiFeedback}
                        </p>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-emerald-700 block mb-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Sample Benchmark Answer:
                        </span>
                        <p className="text-xs text-emerald-950 bg-emerald-50 p-3 rounded-xl border border-emerald-200 leading-relaxed font-mono">
                          {q.sampleOptimalAnswer}
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </motion.div>
    </>
  );
};
