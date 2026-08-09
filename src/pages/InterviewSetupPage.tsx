import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { PersonaSelector } from '../components/interview/PersonaSelector';
import { DocumentUploadTab } from '../components/interview/DocumentUploadTab';
import { interviewService } from '../services/interviewService';
import { Difficulty, InterviewMode, RecruiterPersona, SourceDocument, SpeechSettings, VoiceGender, VoiceAccent, InterviewSession } from '../types/interview';
import {
  Sparkles,
  Sliders,
  FileText,
  Users,
  Volume2,
  TrendingUp,
  Plus,
  PlayCircle,
  BookOpen,
  Check,
  AlertTriangle,
  Radio,
  ArrowRight,
  Mic
} from 'lucide-react';

export const InterviewSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeSession, setActiveSession] = useState<InterviewSession | null>(null);

  // Active setup tab
  const [activeTab, setActiveTab] = useState<'topics' | 'rag' | 'persona' | 'options'>('topics');

  // Candidate Details
  const [candidateName, setCandidateName] = useState('Alex Mercer');
  const [targetRole, setTargetRole] = useState('Senior AI Engineer');

  // Selected Topic
  const [selectedTopic, setSelectedTopic] = useState('Agentic AI');
  const [customTopicInput, setCustomTopicInput] = useState('');
  const [customTopics, setCustomTopics] = useState<string[]>([]);

  // Difficulty & Mode
  const [difficulty, setDifficulty] = useState<Difficulty>('Intermediate');
  const [mode, setMode] = useState<InterviewMode>('Technical');

  // Persona
  const [persona, setPersona] = useState<RecruiterPersona>('Senior AI Engineer');

  // RAG Documents
  const [sourceDocuments, setSourceDocuments] = useState<SourceDocument[]>([]);

  // Voice Speech Settings
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

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const session = interviewService.getActiveSession();
    if (session && session.status === 'in_progress') {
      setActiveSession(session);
    }
  }, []);

  const builtInTopics = [
    'Agentic AI',
    'RAG & Vector DB',
    'MCP & AI Infrastructure',
    'HTML & Frontend',
    'Python & GenAI Backend',
    'System Design & Microservices'
  ];

  const handleAddCustomTopic = () => {
    if (customTopicInput.trim() && !customTopics.includes(customTopicInput.trim())) {
      const newTopic = customTopicInput.trim();
      setCustomTopics([...customTopics, newTopic]);
      setSelectedTopic(newTopic);
      setCustomTopicInput('');
    }
  };

  const handleStartInterview = async () => {
    if (activeSession) {
      navigate('/interview');
      return;
    }

    setIsLoading(true);
    try {
      const session = await interviewService.startInterview({
        candidateName,
        targetRole,
        topic: selectedTopic,
        customTopics,
        difficulty,
        mode,
        persona,
        totalQuestions: 5,
        sourceDocuments,
        speechSettings,
        enableProctoring: true
      });

      navigate(`/interview/${session.id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to start interview session.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-16 select-none"
    >
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-[#FFEDD5] text-[#EA580C] font-mono text-[10px] font-bold uppercase tracking-wider">
              Setup Workspace
            </span>
            <span className="text-xs text-[#64748B]">• Dynamic RAG & AI Agent Room</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2">
            <Sliders className="w-6 h-6 text-[#F97316]" /> Configure Interview Environment
          </h1>
        </div>

        {activeSession ? (
          <Button
            onClick={() => navigate('/interview')}
            variant="accent"
            size="md"
            leftIcon={<Radio className="w-4 h-4 text-white animate-pulse" />}
          >
            Resume Ongoing Interview ({activeSession.topic})
          </Button>
        ) : (
          <Button
            onClick={handleStartInterview}
            isLoading={isLoading}
            variant="glow"
            size="md"
            leftIcon={<PlayCircle className="w-4 h-4 fill-current" />}
          >
            Launch Live AI Interview
          </Button>
        )}
      </div>

      {/* Warning Card if Ongoing Interview Exists */}
      {activeSession && (
        <Card variant="glowing" className="bg-[#FFF7ED] border-[#FDBA74] p-5 rounded-2xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">Ongoing Interview In Progress</h3>
                <p className="text-xs text-[#EA580C] font-medium">
                  You already have an ongoing interview on <span className="font-bold">{activeSession.topic}</span> (Question {activeSession.currentQuestionIndex}/{activeSession.totalQuestions}). Please complete it before starting a new one.
                </p>
              </div>
            </div>

            <Button
              onClick={() => navigate('/interview')}
              variant="accent"
              size="sm"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Resume Interview
            </Button>
          </div>
        </Card>
      )}

      {/* Setup Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#E2E8F0] pb-2 font-mono text-xs">
        <button
          onClick={() => setActiveTab('topics')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
            activeTab === 'topics' ? 'bg-[#334155] text-white shadow-xs' : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:text-[#0F172A]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> 1. Topics & Domains
        </button>

        <button
          onClick={() => setActiveTab('rag')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
            activeTab === 'rag' ? 'bg-[#334155] text-white shadow-xs' : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:text-[#0F172A]'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-[#F97316]" /> 2. RAG Documents ({sourceDocuments.length})
        </button>

        <button
          onClick={() => setActiveTab('persona')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
            activeTab === 'persona' ? 'bg-[#334155] text-white shadow-xs' : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:text-[#0F172A]'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-amber-500" /> 3. Recruiter Persona
        </button>

        <button
          onClick={() => setActiveTab('options')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
            activeTab === 'options' ? 'bg-[#334155] text-white shadow-xs' : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:text-[#0F172A]'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> 4. Voice Profile & Scaling
        </button>
      </div>

      {/* TAB 1: Topics & Custom Domains */}
      {activeTab === 'topics' && (
        <div className="space-y-6">
          <Card variant="glass" className="bg-white border-[#E2E8F0]">
            <CardHeader>
              <CardTitle className="text-base font-bold text-[#0F172A]">Select Primary Technical Topic</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {builtInTopics.map((topic) => (
                  <div
                    key={topic}
                    onClick={() => !activeSession && setSelectedTopic(topic)}
                    className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                      selectedTopic === topic
                        ? 'bg-[#FFEDD5] border-[#FDBA74] text-[#EA580C] font-bold shadow-sm'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#334155] hover:bg-white'
                    } ${activeSession ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span className="text-xs font-semibold">{topic}</span>
                    {selectedTopic === topic && <Check className="w-4 h-4 text-[#F97316]" />}
                  </div>
                ))}
              </div>

              {/* Unlimited Custom Topic Input */}
              <div className="pt-4 border-t border-[#E2E8F0]">
                <label className="text-xs font-bold text-[#0F172A] block mb-1">Add Unlimited Custom Technical Topic:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customTopicInput}
                    disabled={!!activeSession}
                    onChange={(e) => setCustomTopicInput(e.target.value)}
                    placeholder="e.g. PyTorch, GraphQL, FastAPI, LangGraph..."
                    className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#F97316] disabled:opacity-50"
                  />
                  <Button onClick={handleAddCustomTopic} disabled={!!activeSession} variant="secondary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                    Add Topic
                  </Button>
                </div>

                {customTopics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {customTopics.map(ct => (
                      <Badge
                        key={ct}
                        variant={selectedTopic === ct ? 'accent' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => !activeSession && setSelectedTopic(ct)}
                      >
                        {ct}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: RAG Documents Upload */}
      {activeTab === 'rag' && (
        <DocumentUploadTab
          documents={sourceDocuments}
          onDocumentsChange={setSourceDocuments}
        />
      )}

      {/* TAB 3: AI Recruiter Persona */}
      {activeTab === 'persona' && (
        <PersonaSelector
          selectedPersona={persona}
          onSelectPersona={setPersona}
        />
      )}

      {/* TAB 4: Voice Profile & Progressive Scaling */}
      {activeTab === 'options' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Difficulty Level & Interview Mode */}
          <Card variant="glass" className="bg-white border-[#E2E8F0]">
            <CardHeader>
              <CardTitle className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#F97316]" /> Initial Difficulty & Interview Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="font-bold text-[#0F172A] block">Initial Difficulty Level:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Basic', 'Intermediate', 'Advanced', 'Expert'] as Difficulty[]).map((d) => (
                    <button
                      key={d}
                      type="button"
                      disabled={!!activeSession}
                      onClick={() => setDifficulty(d)}
                      className={`p-2.5 rounded-xl border font-bold font-mono transition-all ${
                        difficulty === d ? 'bg-[#334155] text-white border-[#334155]' : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'
                      } ${activeSession ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                <label className="font-bold text-[#0F172A] block">Interview Execution Mode:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['Technical', 'Voice-Only', 'Mixed', 'Scenario-Based', 'Project-Based'] as InterviewMode[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      disabled={!!activeSession}
                      onClick={() => setMode(m)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                        mode === m ? 'bg-[#FFEDD5] border-[#FDBA74] text-[#EA580C] font-bold shadow-xs' : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'
                      } ${activeSession ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      {m === 'Voice-Only' && <Mic className="w-3.5 h-3.5 text-[#F97316] animate-pulse" />}
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voice Profile Configuration */}
          <Card variant="glass" className="bg-white border-[#E2E8F0]">
            <CardHeader>
              <CardTitle className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-600" /> AI Voice Profile & Speech Rate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="font-bold text-[#0F172A] block">AI Voice Gender:</label>
                <div className="grid grid-cols-2 gap-2 font-mono font-bold">
                  {(['Female', 'Male'] as VoiceGender[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setSpeechSettings({ ...speechSettings, gender: g })}
                      className={`p-2.5 rounded-xl border transition-all ${
                        speechSettings.gender === g ? 'bg-[#F97316] text-white border-[#F97316]' : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'
                      }`}
                    >
                      {g} Voice
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                <label className="font-bold text-[#0F172A] block">Regional English Accent:</label>
                <div className="grid grid-cols-3 gap-2 font-mono text-xs font-bold">
                  {(['US', 'UK', 'Indian'] as VoiceAccent[]).map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setSpeechSettings({ ...speechSettings, accent: a })}
                      className={`p-2 rounded-xl border transition-all ${
                        speechSettings.accent === a ? 'bg-[#334155] text-white border-[#334155]' : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'
                      }`}
                    >
                      {a} Accent
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[#E2E8F0]">
                <div className="flex justify-between font-semibold text-[#0F172A]">
                  <span>Speaking Rate:</span>
                  <span className="font-mono text-[#F97316]">{speechSettings.rate}x Speed</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.5"
                  step="0.25"
                  value={speechSettings.rate}
                  onChange={(e) => setSpeechSettings({ ...speechSettings, rate: Number(e.target.value) })}
                  className="w-full accent-[#F97316]"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </motion.div>
  );
};
