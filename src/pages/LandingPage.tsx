import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';
import {
  Sparkles,
  UserPlus,
  CheckCircle2,
  ShieldCheck,
  Volume2,
  FileText,
  Users,
  ChevronDown,
  ChevronUp,
  Cpu,
  ArrowRight,
  Target,
  BarChart2,
  Zap,
  Github,
  Bot
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSignUpClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const faqs = [
    {
      q: 'How does IntervAI generate unique interview questions?',
      a: 'IntervAI uses dynamic AI synthesis powered by Retrieval-Augmented Generation (RAG). It ingests your curriculum, custom technical topics, uploaded PDF/DOCX files, documentation URLs, and GitHub repos to create tailored technical questions for every session.'
    },
    {
      q: 'Is the AI Voice interview feature hands-free?',
      a: 'Yes! IntervAI reads every question using natural Text-to-Speech (TTS) with selectable speaking rates (0.75x–1.5x) and transcribes candidate speech in real time using Web Speech API (STT), allowing voice or text answers.'
    },
    {
      q: 'How does the Interview Proctoring & Integrity module work?',
      a: 'The non-blocking proctoring engine monitors browser visibility, tab switches, window blur, text paste actions, inactivity timers, and network disruptions to calculate an Integrity Score (0–100) and risk level.'
    },
    {
      q: 'Can recruiters export a formal PDF assessment report?',
      a: 'Absolutely. After completing an interview, candidates or hiring managers can export a multi-page executive assessment PDF report complete with candidate metadata, score radar charts, recruiter verdicts, and complete Q&A transcripts.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans select-none">
      {/* Sticky Landing Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}>
          <div className="w-8 h-8 rounded-xl bg-[#F97316] text-white flex items-center justify-center font-bold shadow-md shadow-[#F97316]/20">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <span className="text-xl font-black tracking-tight text-[#0F172A]">
            Interv<span className="text-[#F97316]">AI</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#334155]">
          <a href="#features" className="hover:text-[#F97316] transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-[#F97316] transition-colors">How It Works</a>
          <a href="#interview-types" className="hover:text-[#F97316] transition-colors">Interview Types</a>
          <a href="#faq" className="hover:text-[#F97316] transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Button onClick={() => navigate('/dashboard')} variant="glow" size="sm">
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button onClick={() => navigate('/login')} variant="ghost" size="sm">
                Log In
              </Button>
              <Button onClick={handleSignUpClick} variant="glow" size="sm" rightIcon={<UserPlus className="w-3.5 h-3.5" />}>
                Sign Up
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFEDD5] border border-[#FDBA74] text-[#EA580C] text-xs font-bold font-mono shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F97316]" /> Enterprise AI Technical Interviewer v2.4
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] tracking-tight max-w-4xl mx-auto leading-tight"
        >
          Master Technical Interviews with <span className="text-[#334155] underline decoration-[#F97316] decoration-4">Real-Time AI Agents</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto leading-relaxed"
        >
          Conduct realistic AI technical interviews powered by Web Voice TTS/STT, dynamic RAG question synthesis, adaptive difficulty scaling, browser proctoring integrity, and instant PDF assessment reports.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <Button
            onClick={handleSignUpClick}
            variant="glow"
            size="lg"
            rightIcon={<UserPlus className="w-4 h-4" />}
            className="px-8 py-3.5 text-sm font-bold"
          >
            Sign Up for Free Account
          </Button>

          <Button
            onClick={() => navigate('/login')}
            variant="primary"
            size="lg"
            className="px-8 py-3.5 text-sm font-bold"
          >
            Log In to Account
          </Button>
        </motion.div>

        {/* Feature Highlights Pills */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-[#64748B] font-medium">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#F97316]" /> No Hardcoded Questions</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#F97316]" /> Natural AI Voice Reading</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#F97316]" /> PDF Executive Assessment</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#F97316]" /> Proctoring Integrity Engine</span>
        </div>
      </section>

      {/* Core Features Grid Section */}
      <section id="features" className="py-16 px-4 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="accent" size="sm">Core Architecture</Badge>
          <h2 className="text-3xl font-bold text-[#0F172A]">Enterprise AI Technical Interview Features</h2>
          <p className="text-sm text-[#64748B] max-w-xl mx-auto">Built from the ground up to feel like a real senior engineer conducting technical assessments.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="glass" className="bg-white border-[#E2E8F0] p-6 space-y-4 hover:border-[#F97316] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#FFEDD5] border border-[#FDBA74] text-[#EA580C] flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">Dynamic RAG Question Engine</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Upload PDF, DOCX, Markdown files, or GitHub repository links to synthesize questions directly grounded in your real architecture and documentation.
            </p>
          </Card>

          <Card variant="glass" className="bg-white border-[#E2E8F0] p-6 space-y-4 hover:border-[#F97316] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] border border-[#CBD5E1] text-[#334155] flex items-center justify-center font-bold">
              <Volume2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">AI Voice & Speech Dictation</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Questions are read aloud with natural TTS voice synthesis. Candidates can speak their answers directly via Speech-to-Text transcription.
            </p>
          </Card>

          <Card variant="glass" className="bg-white border-[#E2E8F0] p-6 space-y-4 hover:border-[#F97316] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#FFEDD5] border border-[#FDBA74] text-[#EA580C] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">Proctoring & Integrity System</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Real-time monitoring of tab switches, focus loss, fullscreen exits, paste events, and idle timers calculating a live Integrity Score.
            </p>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 lg:px-8 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="primary" size="sm">Workflow</Badge>
            <h2 className="text-3xl font-bold text-[#0F172A]">How IntervAI Works</h2>
            <p className="text-sm text-[#64748B] max-w-xl mx-auto">From setup to executive evaluation report in 4 straightforward steps.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <span className="w-8 h-8 rounded-lg bg-[#334155] text-white font-bold flex items-center justify-center font-mono text-sm">1</span>
              <h4 className="font-bold text-[#0F172A] text-sm">Setup Interview</h4>
              <p className="text-[#64748B] leading-relaxed">Choose topic, difficulty level (Basic to Expert), recruiter persona, and upload RAG docs or GitHub repos.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <span className="w-8 h-8 rounded-lg bg-[#334155] text-white font-bold flex items-center justify-center font-mono text-sm">2</span>
              <h4 className="font-bold text-[#0F172A] text-sm">Voice & Text Room</h4>
              <p className="text-[#64748B] leading-relaxed">Hear AI questions read naturally, view code snippets, dictating speech answers or typing technical solutions.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <span className="w-8 h-8 rounded-lg bg-[#334155] text-white font-bold flex items-center justify-center font-mono text-sm">3</span>
              <h4 className="font-bold text-[#0F172A] text-sm">Adaptive AI Evaluation</h4>
              <p className="text-[#64748B] leading-relaxed">AI engine adjusts question difficulty dynamically based on performance score and logs proctoring integrity.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <span className="w-8 h-8 rounded-lg bg-[#334155] text-white font-bold flex items-center justify-center font-mono text-sm">4</span>
              <h4 className="font-bold text-[#0F172A] text-sm">Executive PDF Report</h4>
              <p className="text-[#64748B] leading-relaxed">Review overall score, radar skill charts, recruiter verdict, proctoring log timeline, and download printable PDF.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-16 px-4 lg:px-8 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="accent" size="sm">FAQ</Badge>
          <h2 className="text-2xl font-bold text-[#0F172A]">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-[#0F172A]"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[#F97316]" /> : <ChevronDown className="w-4 h-4 text-[#64748B]" />}
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 border-t border-[#E2E8F0] text-xs text-[#64748B] leading-relaxed bg-[#F8FAFC]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Call to Action Banner */}
      <section className="py-16 px-4 lg:px-8 bg-gradient-to-r from-[#334155] to-[#1E293B] text-white text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight">Ready to Ace Your Next AI Technical Assessment?</h2>
          <p className="text-sm opacity-90 max-w-xl mx-auto leading-relaxed">
            Practice with real senior engineer AI personas, dynamic RAG documentation questions, and download formal PDF reports.
          </p>
          <Button
            onClick={handleSignUpClick}
            variant="accent"
            size="lg"
            rightIcon={<UserPlus className="w-4 h-4" />}
            className="px-8 py-3.5 text-sm font-bold shadow-lg"
          >
            Create Your Account Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E2E8F0] py-6 px-4 lg:px-8 text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#F97316] text-white flex items-center justify-center font-bold">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-[#0F172A]">Interv<span className="text-[#F97316]">AI</span></span>
            <span>© 2026. All Rights Reserved. (v2.4)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
