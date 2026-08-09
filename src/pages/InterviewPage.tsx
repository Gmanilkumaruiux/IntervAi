import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { interviewService } from '../services/interviewService';
import { speechService } from '../services/speechService';
import { proctoringService } from '../services/proctoringService';
import { InterviewSession, ChatMessage, SpeechSettings, Difficulty } from '../types/interview';
import { IntegrityLogEntry, IntegrityReportSummary } from '../types/integrity';
import { ChatBubble } from '../components/interview/ChatBubble';
import { InputBox } from '../components/interview/InputBox';
import { TypingIndicator } from '../components/interview/TypingIndicator';
import { ProgressCard } from '../components/interview/ProgressCard';
import { SpeechControlBar } from '../components/interview/SpeechControlBar';
import { VoiceTranscriptionPreview } from '../components/interview/VoiceTranscriptionPreview';
import { IntegrityWarningToast } from '../components/proctoring/IntegrityWarningToast';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import {
  Clock,
  HelpCircle,
  Square,
  Sparkles,
  Maximize2,
  Minimize2,
  TrendingUp,
  FileText,
  Users,
  Mic,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export const InterviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<InterviewSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showEndConfirmationModal, setShowEndConfirmationModal] = useState(false);

  const [isEndingReport, setIsEndingReport] = useState(false);
  const [endErrorMsg, setEndErrorMsg] = useState<string | null>(null);

  // Proctoring States
  const [latestProctoringLog, setLatestProctoringLog] = useState<IntegrityLogEntry | null>(null);
  const [integritySummary, setIntegritySummary] = useState<IntegrityReportSummary | null>(null);
  const [difficultyShiftAlert, setDifficultyShiftAlert] = useState<{ shifted: boolean; level: Difficulty } | null>(null);

  const [speechSettings, setSpeechSettings] = useState<SpeechSettings>({
    enabled: true,
    voiceURI: '',
    gender: 'Female',
    accent: 'US',
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    isMuted: false
  });

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const latestQuestionRef = useRef<HTMLDivElement>(null);
  const answerInputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize session & proctoring monitor with Google-Docs-style restoration
  useEffect(() => {
    const loadSession = async () => {
      setIsLoading(true);
      try {
        const active = interviewService.getActiveSession();
        let loadedSession: InterviewSession;

        if (active && (active.id === id || !id)) {
          loadedSession = active;
        } else {
          loadedSession = await interviewService.startInterview({
            candidateName: 'Alex Mercer',
            targetRole: 'Senior AI Engineer',
            topic: 'Agentic AI',
            difficulty: 'Intermediate',
            mode: 'Technical',
            persona: 'Senior AI Engineer',
            totalQuestions: 5,
            enableProctoring: true,
            speechSettings
          });
        }

        setSession(loadedSession);
        setTimerSeconds(loadedSession.durationSeconds || 0);
        if (loadedSession.speechSettings) setSpeechSettings(loadedSession.speechSettings);

        // Auto-launch voice dictation if mode is Voice-Only
        if (loadedSession.mode === 'Voice-Only') {
          setShowVoiceRecorder(true);
        }

        // Start Proctoring Event Monitor
        proctoringService.startMonitoring(loadedSession.id, (log, summary) => {
          setLatestProctoringLog(log);
          setIntegritySummary(summary);
        });

      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();

    return () => {
      proctoringService.stopMonitoring();
    };
  }, [id]);

  // Read question aloud automatically when new AI message arrives if TTS enabled & Auto-Scroll/Auto-Focus
  useEffect(() => {
    if (!session || session.messages.length === 0) return;
    const lastMsg = session.messages[session.messages.length - 1];

    if (lastMsg.sender === 'ai') {
      if (speechSettings.enabled && !speechSettings.isMuted) {
        speechService.speakQuestion(lastMsg.text, speechSettings);
      }

      // Auto-start voice recorder if in Voice-Only Mode
      if (session.mode === 'Voice-Only') {
        setShowVoiceRecorder(true);
      }

      // Auto-scroll to new question start & auto-focus input box
      setTimeout(() => {
        latestQuestionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (session.mode !== 'Voice-Only') {
          answerInputRef.current?.focus();
        }
      }, 100);
    }
  }, [session?.messages.length, speechSettings]);

  // Live Timer & Auto-Save Sync Effect (Every 5 seconds & before unload)
  useEffect(() => {
    if (!session || session.status === 'completed') return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        const next = prev + 1;
        if (session) {
          session.durationSeconds = next;
          // Auto-save every 5 seconds
          if (next % 5 === 0) {
            interviewService.saveSessionToStorage(session);
          }
        }
        return next;
      });
    }, 1000);

    // Save session on beforeunload event
    const handleBeforeUnload = () => {
      if (session) {
        interviewService.saveSessionToStorage(session);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [session]);

  const handleSendMessage = async (text: string, isVoiceInput: boolean = false) => {
    if (!session || isSending) return;
    setIsSending(true);
    setShowVoiceRecorder(false);
    speechService.stopSpeaking();

    // Log answer completion metrics
    const wordsCount = text.trim().split(/\s+/).length;
    proctoringService.logQuestionAnswered(wordsCount, isVoiceInput);

    try {
      const response = await interviewService.sendMessage({
        interviewId: session.id,
        message: text,
        isVoiceInput: isVoiceInput || session.mode === 'Voice-Only'
      });

      // Update session state with proctoring logs
      const updatedSession = {
        ...response.session,
        integritySummary: proctoringService.getSummary()
      };
      setSession(updatedSession);

      if (response.difficultyShifted && response.newDifficulty) {
        setDifficultyShiftAlert({ shifted: true, level: response.newDifficulty });
        setTimeout(() => setDifficultyShiftAlert(null), 4000);
      }

      if (response.isComplete) {
        speechService.stopSpeaking();
        proctoringService.stopMonitoring();
        const report = await interviewService.endInterview(session.id);
        setTimeout(() => {
          navigate(`/report/${report.id}`);
        }, 1200);
      }
    } catch (err) {
      console.error('Error sending candidate message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleConfirmEndInterview = async () => {
    if (!session || isEndingReport) return;
    setIsEndingReport(true);
    setEndErrorMsg(null);

    try {
      speechService.stopSpeaking();
      proctoringService.stopMonitoring();

      // 1. End interview session & calculate report
      const report = await interviewService.endInterview(session.id);
      if (integritySummary) {
        report.integritySummary = integritySummary;
      }

      setShowEndConfirmationModal(false);
      setIsEndingReport(false);

      // 2. Navigate immediately to report view
      navigate(`/report/${report.id}`);
    } catch (err: any) {
      console.error('Failed to generate interview report:', err);
      setEndErrorMsg(err.message || 'Failed to complete interview and generate report. Please try again.');
      setIsEndingReport(false);
    }
  };

  if (isLoading || !session) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="rectangle" className="h-16" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <LoadingSkeleton variant="card" className="lg:col-span-3 h-[500px]" />
          <LoadingSkeleton variant="card" className="h-[500px]" />
        </div>
      </div>
    );
  }

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentAiMessage = session.messages.filter(m => m.sender === 'ai').slice(-1)[0];

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden space-y-3 p-1 relative select-none">
      {/* Live Proctoring Warning Toast Popup */}
      <IntegrityWarningToast
        log={latestProctoringLog}
        onDismiss={() => setLatestProctoringLog(null)}
      />

      {/* Confirmation Modal Dialog for End Interview */}
      <AnimatePresence>
        {showEndConfirmationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3 text-rose-600">
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A]">End Interview Session?</h3>
              </div>

              <p className="text-xs text-[#64748B] leading-relaxed">
                Are you sure you want to end your current live AI assessment? Ending the interview will evaluate all completed answers and generate your formal PDF report.
              </p>

              {endErrorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {endErrorMsg}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  onClick={() => setShowEndConfirmationModal(false)}
                  disabled={isEndingReport}
                  variant="outline"
                  size="sm"
                >
                  Cancel & Continue
                </Button>
                <Button
                  onClick={handleConfirmEndInterview}
                  isLoading={isEndingReport}
                  disabled={isEndingReport}
                  variant="destructive"
                  size="sm"
                >
                  Generate Report
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Top Header Bar */}
      <div className="bg-white px-4 py-2.5 rounded-xl flex flex-wrap items-center justify-between gap-3 border border-[#E2E8F0] shadow-xs flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-[#FFEDD5] border border-[#FDBA74] text-[#EA580C]">
            <Sparkles className="w-4 h-4 animate-pulse-glow text-[#F97316]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold text-[#0F172A] tracking-tight">{session.topic}</h2>

              <Badge variant="accent" size="sm" className="font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Level: {session.difficulty}
              </Badge>

              {session.mode === 'Voice-Only' && (
                <Badge variant="amber" size="sm" className="font-bold flex items-center gap-1">
                  <Mic className="w-3 h-3 text-[#F97316] animate-pulse" /> Voice-Only Mode
                </Badge>
              )}

              <Badge variant="emerald" size="sm" className="flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" /> Auto-Saved Session
              </Badge>
            </div>
            <p className="text-[11px] text-[#64748B] flex items-center gap-2 mt-0.5 font-mono">
              <span>Candidate: {session.candidateName}</span>
              {integritySummary && (
                <span className="text-[#EA580C] font-semibold">
                  • Integrity Score: {integritySummary.score}/100 ({integritySummary.riskLevel} Risk)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Counter & Timer Widgets */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-[#F97316]" />
            <span className="text-[#64748B]">Q:</span>
            <span className="text-[#0F172A] font-bold">{session.currentQuestionIndex} / {session.totalQuestions}</span>
          </div>

          <div className="px-3 py-1 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[#64748B]">Time:</span>
            <span className="text-emerald-700 font-bold">{formatTimer(timerSeconds)}</span>
          </div>

          <Button
            onClick={() => setShowEndConfirmationModal(true)}
            variant="destructive"
            size="sm"
            leftIcon={<Square className="w-3.5 h-3.5 fill-current" />}
          >
            End Interview
          </Button>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hidden lg:block"
            title="Toggle Right Panel"
          >
            {sidebarOpen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Dynamic Difficulty Shift Alert */}
      <AnimatePresence>
        {difficultyShiftAlert?.shifted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-2.5 bg-[#FFEDD5] border border-[#FDBA74] rounded-xl text-xs text-[#EA580C] font-bold flex items-center justify-between shadow-xs"
          >
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#F97316]" />
              Adaptive Difficulty Shift! AI Agent adjusted question difficulty to {difficultyShiftAlert.level} level based on your performance.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid: Chat Stream (75% Width) + Optional Right Sidebar */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Main Conversation Stream */}
        <div className="flex-1 flex flex-col bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs relative">

          {/* AI Question Speech Control Bar */}
          {currentAiMessage && (
            <div className="p-2 bg-white border-b border-[#E2E8F0] flex-shrink-0">
              <SpeechControlBar
                currentText={currentAiMessage.text}
                settings={speechSettings}
                onUpdateSettings={setSpeechSettings}
              />
            </div>
          )}

          {/* Chat Messages Feed with Min 260px Question Container */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {session.messages.map((msg, idx) => {
              const isLastAiMsg = msg.sender === 'ai' && idx === session.messages.length - 1;
              return (
                <ChatBubble
                  key={msg.id}
                  message={msg}
                  candidateName={session.candidateName}
                  isLatest={isLastAiMsg}
                  messageRef={isLastAiMsg ? latestQuestionRef : undefined}
                />
              );
            })}

            <AnimatePresence>
              {isSending && <TypingIndicator />}
            </AnimatePresence>

            <div ref={chatBottomRef} />
          </div>

          {/* Multiline Input & Voice Recording Preview Box (Sticky at Bottom) */}
          <div className="p-3 bg-white border-t border-[#E2E8F0] space-y-2 sticky bottom-0 z-20">
            {showVoiceRecorder ? (
              <VoiceTranscriptionPreview
                onConfirmText={(text) => handleSendMessage(text, true)}
                onCancel={() => setShowVoiceRecorder(false)}
                autoStart={true}
              />
            ) : (
              <div className="space-y-2">
                <InputBox
                  onSendMessage={(text) => handleSendMessage(text, false)}
                  isLoading={isSending}
                  disabled={session.status === 'completed'}
                  inputRef={answerInputRef}
                />

                <div className="flex items-center justify-between text-xs px-1 text-[#64748B]">
                  <button
                    type="button"
                    onClick={() => setShowVoiceRecorder(true)}
                    className="text-[#EA580C] hover:text-[#F97316] font-bold flex items-center gap-1.5 bg-[#FFEDD5] border border-[#FDBA74] px-3 py-1 rounded-lg transition-colors text-xs"
                  >
                    <Mic className="w-3.5 h-3.5 text-[#F97316] animate-pulse" /> Launch Voice Recording & Live Transcription Mode
                  </button>
                  <span className="font-mono text-[11px]">Shift + Enter for new line</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Optional Compact Right Sidebar */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-72 flex-shrink-0 hidden xl:flex flex-col space-y-4 overflow-y-auto"
          >
            {/* Live Proctoring Overview Box */}
            {integritySummary && (
              <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5 font-mono">
                    <ShieldCheck className="w-4 h-4 text-[#F97316]" /> Proctoring Status
                  </span>
                  <Badge variant={integritySummary.riskLevel === 'Low' ? 'emerald' : 'amber'} size="sm">
                    {integritySummary.riskLevel} Risk
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-mono">
                  <div className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="text-[10px] text-[#64748B] block">Integrity Score</span>
                    <span className="font-bold text-[#0F172A]">{integritySummary.score}/100</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="text-[10px] text-[#64748B] block">Tab Switches</span>
                    <span className="font-bold text-[#0F172A]">{integritySummary.metrics.tabSwitchCount}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Recruiter Persona Card */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#F97316]" /> AI Interviewer
                </span>
                <Badge variant="accent" size="sm">{session.persona}</Badge>
              </div>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                Evaluating according to {session.persona} standards & expectations.
              </p>
            </div>

            {/* Progress Card Component */}
            <ProgressCard
              currentQuestion={session.currentQuestionIndex}
              totalQuestions={session.totalQuestions}
              topic={session.topic}
              durationSeconds={timerSeconds}
              currentScore={session.currentScore}
              topicsCovered={session.topicsCovered}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};
