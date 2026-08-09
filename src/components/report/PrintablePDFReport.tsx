import React from 'react';
import { InterviewReport } from '../../types/report';
import { Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, Award, FileText, Users, Calendar, Clock, BarChart2 } from 'lucide-react';

export interface PrintablePDFReportProps {
  report: InterviewReport;
}

export const PrintablePDFReport: React.FC<PrintablePDFReportProps> = ({ report }) => {
  return (
    <div className="hidden print:block p-8 bg-white text-[#0F172A] font-sans space-y-8 max-w-4xl mx-auto">

      {/* Official Header */}
      <div className="flex items-center justify-between border-b-2 border-[#0F172A] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F97316] text-white flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#0F172A]">
              Interv<span className="text-[#F97316]">AI</span>
            </h1>
            <span className="text-xs uppercase font-mono tracking-widest text-[#64748B] font-bold">
              Official Candidate Assessment Report
            </span>
          </div>
        </div>

        <div className="text-right text-xs font-mono">
          <span className="font-bold text-[#0F172A] block">Report Ref: {report.id}</span>
          <span className="text-[#64748B]">Issued: {report.date}</span>
        </div>
      </div>

      {/* Candidate Profile Summary Box */}
      <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs">
        <div>
          <span className="text-[#64748B] font-semibold block">Candidate Name:</span>
          <span className="font-bold text-sm text-[#0F172A]">{report.candidateName}</span>
          <span className="text-[#64748B] block mt-1">Email: {report.candidateEmail}</span>
        </div>
        <div>
          <span className="text-[#64748B] font-semibold block">Target Role:</span>
          <span className="font-bold text-sm text-[#0F172A]">{report.topic}</span>
          <span className="text-[#64748B] block mt-1">Interviewer Persona: {report.persona}</span>
        </div>
        <div>
          <span className="text-[#64748B] font-semibold block">Assessment Mode:</span>
          <span className="font-bold text-[#0F172A]">{report.mode} Mode ({report.difficulty} Level)</span>
        </div>
        <div>
          <span className="text-[#64748B] font-semibold block">Session Duration:</span>
          <span className="font-bold text-[#0F172A]">{report.durationMinutes} Minutes</span>
        </div>
      </div>

      {/* Executive Overall Score & Hiring Verdict */}
      <div className="p-6 rounded-xl border-2 border-[#F97316] bg-[#FFF7ED] flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold text-[#EA580C] uppercase tracking-wider">Executive Verdict</span>
          <h2 className="text-2xl font-extrabold text-[#0F172A]">
            Hiring Recommendation: <span className="text-[#EA580C]">{report.hiringRecommendation}</span>
          </h2>
          <p className="text-xs text-[#334155] max-w-lg leading-relaxed pt-1">
            {report.personaVerdict}
          </p>
        </div>

        <div className="text-center p-4 bg-white rounded-xl border border-[#FDBA74] shadow-sm min-w-[120px]">
          <span className="text-3xl font-black text-[#0F172A] block">{report.overallScore}</span>
          <span className="text-[10px] font-bold uppercase text-[#64748B] font-mono">Overall Score / 100</span>
        </div>
      </div>

      {/* Multi-Dimensional Competency Breakdown */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider font-mono border-b border-[#E2E8F0] pb-1">
          Competency Performance Breakdown
        </h3>
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          {report.categoryBreakdown.map(c => (
            <div key={c.category} className="p-3 rounded-lg border border-[#E2E8F0] bg-white flex justify-between">
              <span className="text-[#64748B]">{c.category}:</span>
              <span className="font-bold text-[#0F172A]">{c.score} / 100</span>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Focus Areas */}
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 space-y-2">
          <h4 className="font-bold text-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Primary Strengths
          </h4>
          <ul className="space-y-1 text-emerald-950 list-disc pl-4 leading-relaxed">
            {report.strengths.map((s, idx) => <li key={idx}>{s}</li>)}
          </ul>
        </div>

        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 space-y-2">
          <h4 className="font-bold text-amber-800 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" /> Focus / Growth Areas
          </h4>
          <ul className="space-y-1 text-amber-950 list-disc pl-4 leading-relaxed">
            {report.weaknesses.map((w, idx) => <li key={idx}>{w}</li>)}
          </ul>
        </div>
      </div>

      {/* Proctoring & Integrity Summary */}
      {report.integritySummary && (
        <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2 text-xs">
          <div className="flex items-center justify-between font-mono font-bold">
            <span className="flex items-center gap-1.5 text-[#0F172A]">
              <ShieldCheck className="w-4 h-4 text-[#F97316]" /> Interview Proctoring Analysis
            </span>
            <span>Integrity Score: {report.integritySummary.score}/100 ({report.integritySummary.riskLevel} Risk)</span>
          </div>
          <p className="text-[#334155] leading-relaxed">{report.integritySummary.summaryText}</p>
        </div>
      )}

      {/* Complete Chronological Q&A Transcript */}
      <div className="space-y-4 pt-4 border-t-2 border-[#0F172A] page-break-before">
        <h3 className="text-base font-bold text-[#0F172A] tracking-tight">
          Complete Chronological Interview Transcript
        </h3>

        <div className="space-y-4 text-xs">
          {report.questions.map((q) => (
            <div key={q.questionNumber} className="p-4 rounded-xl border border-[#E2E8F0] bg-white space-y-3">
              <div className="flex justify-between items-start font-bold border-b border-[#E2E8F0] pb-2">
                <span className="text-[#EA580C]">Question {q.questionNumber}: {q.question}</span>
                <span className="font-mono bg-[#FFEDD5] text-[#EA580C] px-2 py-0.5 rounded text-[11px] font-bold">Score: {q.score}/100</span>
              </div>

              <div>
                <span className="font-semibold text-[#64748B] block mb-1">Candidate Answer:</span>
                <p className="bg-[#F8FAFC] p-2.5 rounded-lg border border-[#E2E8F0] text-[#0F172A] leading-relaxed font-sans">
                  {q.candidateAnswer}
                </p>
              </div>

              <div>
                <span className="font-semibold text-[#EA580C] block mb-1">AI Evaluator Feedback ({report.persona}):</span>
                <p className="bg-[#FFF7ED] p-2.5 rounded-lg border border-[#FDBA74] text-[#7C2D12] leading-relaxed">
                  {q.aiFeedback}
                </p>
              </div>

              <div>
                <span className="font-semibold text-emerald-700 block mb-1">Sample Optimal Answer:</span>
                <p className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 text-emerald-950 font-mono text-[11px] leading-relaxed">
                  {q.sampleOptimalAnswer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Running Footer */}
      <div className="pt-6 border-t border-[#E2E8F0] flex items-center justify-between text-[10px] font-mono text-[#64748B]">
        <span>© 2026 IntervAI. Confidential Candidate Assessment Report.</span>
        <span>Page 1 of 1</span>
      </div>

    </div>
  );
};
