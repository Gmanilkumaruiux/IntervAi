import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { interviewService } from '../services/interviewService';
import { pdfExportService } from '../services/pdfExportService';
import { InterviewReport } from '../types/report';
import { PrintablePDFReport } from '../components/report/PrintablePDFReport';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import {
  FileText,
  Download,
  Calendar,
  Clock,
  User,
  Award,
  ChevronRight,
  TrendingUp,
  Search,
  Sliders,
  ShieldCheck,
  Printer
} from 'lucide-react';

export const PreviousReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<InterviewReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [reportToPrint, setReportToPrint] = useState<InterviewReport | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const data = await interviewService.getReportsList();
        setReports(data);
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleDownloadPDF = async (report: InterviewReport, e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloadingId(report.id);
    setReportToPrint(report);

    try {
      setTimeout(() => {
        pdfExportService.exportToPDF(report);
        setDownloadingId(null);
      }, 300);
    } catch (err) {
      console.error('PDF export failed:', err);
      setDownloadingId(null);
    }
  };

  const filteredReports = reports.filter(
    (r) =>
      r.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.persona.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-16 select-none"
    >
      {/* Off-screen Printable PDF Component Container */}
      {reportToPrint && (
        <div style={{ display: 'none' }}>
          <PrintablePDFReport report={reportToPrint} />
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-[#FFEDD5] text-[#EA580C] font-mono text-[10px] font-bold uppercase tracking-wider">
              Assessment Archives
            </span>
            <span className="text-xs text-[#64748B]">• Official Interview Reports & Evaluation Transcripts</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#F97316]" /> Technical Assessment Reports
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate('/interview/setup')}
            variant="glow"
            size="sm"
            leftIcon={<Sliders className="w-4 h-4" />}
          >
            Start New Assessment
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div className="relative flex items-center w-full sm:w-80">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by topic, candidate name, persona..."
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-9 pr-3 py-2 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#F97316] font-sans"
          />
        </div>

        <div className="text-xs text-[#64748B] font-mono">
          Showing <span className="font-bold text-[#0F172A]">{filteredReports.length}</span> reports
        </div>
      </div>

      {/* Reports Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LoadingSkeleton variant="card" className="h-48" />
          <LoadingSkeleton variant="card" className="h-48" />
          <LoadingSkeleton variant="card" className="h-48" />
          <LoadingSkeleton variant="card" className="h-48" />
        </div>
      ) : filteredReports.length === 0 ? (
        <Card variant="glass" className="bg-white border-[#E2E8F0] p-12 text-center space-y-4">
          <FileText className="w-12 h-12 text-[#94A3B8] mx-auto" />
          <h3 className="text-lg font-bold text-[#0F172A]">No Interview Reports Found</h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
            No completed assessments match your search. Start a new AI interview to generate your first report.
          </p>
          <Button onClick={() => navigate('/interview/setup')} variant="primary" size="sm">
            Launch Setup
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReports.map((report) => (
            <Card
              key={report.id}
              variant="glass"
              className="bg-white border-[#E2E8F0] p-5 space-y-4 hover:border-[#F97316] transition-all cursor-pointer group shadow-xs hover:shadow-md"
              onClick={() => navigate(`/report/${report.id}`)}
            >
              {/* Card Header: Topic & Score Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-extrabold text-[#0F172A] group-hover:text-[#EA580C] transition-colors">
                      {report.topic}
                    </h3>
                    <Badge variant="accent" size="sm">
                      {report.difficulty}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#64748B] flex items-center gap-1.5 font-mono">
                    <User className="w-3.5 h-3.5 text-[#334155]" /> {report.candidateName} • {report.persona}
                  </p>
                </div>

                {/* Score Pill */}
                <div className="text-right flex-shrink-0">
                  <div className="text-xl font-extrabold text-[#0F172A] font-mono tracking-tight">
                    {report.overallScore}<span className="text-xs text-[#64748B]">/100</span>
                  </div>
                  <Badge
                    variant={report.hiringRecommendation === 'Strong Hire' ? 'emerald' : report.hiringRecommendation === 'Hire' ? 'indigo' : 'rose'}
                    size="sm"
                  >
                    {report.hiringRecommendation}
                  </Badge>
                </div>
              </div>

              {/* Persona Verdict Snippet */}
              <p className="text-xs text-[#334155] bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] line-clamp-2 leading-relaxed italic">
                "{report.personaVerdict}"
              </p>

              {/* Card Footer Actions: Date, Duration, and Download PDF Button */}
              <div className="pt-3 border-t border-[#E2E8F0] flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-3 sm:gap-4 text-[#64748B]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {report.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {report.durationMinutes} mins
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* One-Click Instant PDF Download Button */}
                  <Button
                    onClick={(e) => handleDownloadPDF(report, e)}
                    isLoading={downloadingId === report.id}
                    variant="outline"
                    size="sm"
                    leftIcon={<Download className="w-3.5 h-3.5 text-[#F97316]" />}
                    className="text-xs"
                  >
                    Download PDF
                  </Button>

                  <Button
                    onClick={() => navigate(`/report/${report.id}`)}
                    variant="ghost"
                    size="sm"
                    rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                  >
                    View Report
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
};
