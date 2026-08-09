import { IntegrityLogEntry, IntegrityMetrics, IntegrityReportSummary } from './integrity';

export type Difficulty = 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';
export type InterviewMode = 'Technical' | 'Mixed' | 'Scenario-Based' | 'Project-Based' | 'Voice-Only';

export type RecruiterPersona =
  | 'Startup Engineer'
  | 'FAANG Interviewer'
  | 'Senior AI Engineer'
  | 'Principal Engineer'
  | 'HR + Technical Panel';

export interface SourceDocument {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'txt' | 'md' | 'github_repo' | 'url';
  url?: string;
  extractedText: string;
  chunksCount: number;
  uploadedAt: string;
}

export type VoiceGender = 'Female' | 'Male';
export type VoiceAccent = 'US' | 'UK' | 'Indian';

export interface SpeechSettings {
  enabled: boolean;
  voiceURI: string;
  gender: VoiceGender;
  accent: VoiceAccent;
  rate: number; // 0.75, 1.0, 1.25, 1.5
  pitch: number;
  volume: number; // 0 - 1.0
  isMuted: boolean;
}

export interface InterviewSetupPayload {
  candidateName: string;
  candidateEmail?: string;
  targetRole: string;
  topic: string; // Built-in or custom topic
  customTopics?: string[]; // Array of custom topics
  difficulty: Difficulty;
  mode: InterviewMode;
  persona: RecruiterPersona;
  totalQuestions: number;
  sourceDocuments?: SourceDocument[];
  speechSettings?: SpeechSettings;
  enableProctoring?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'candidate';
  text: string;
  timestamp: string;
  codeSnippet?: string;
  topicTag?: string;
  audioUrl?: string; // For TTS audio
  difficultyLevel?: Difficulty;
  isScenario?: boolean;
  ragCitation?: string;
  evaluation?: {
    score: number; // 0 - 100
    feedback: string;
    keyStrengths?: string[];
    improvements?: string[];
    followupSuggestion?: string;
    coveredConcepts?: string[];
    missingConcepts?: string[];
  };
}

export interface InterviewSession {
  id: string;
  candidateName: string;
  targetRole: string;
  topic: string;
  customTopics?: string[];
  difficulty: Difficulty;
  initialDifficulty: Difficulty;
  mode: InterviewMode;
  persona: RecruiterPersona;
  totalQuestions: number;
  currentQuestionIndex: number;
  startedAt: string;
  status: 'in_progress' | 'completed';
  messages: ChatMessage[];
  currentScore: number;
  topicsCovered: string[];
  coveredConcepts?: string[];
  missingConcepts?: string[];
  durationSeconds: number;
  sourceDocuments?: SourceDocument[];
  speechSettings: SpeechSettings;
  difficultyHistory: { questionNumber: number; difficulty: Difficulty; score: number }[];
  enableProctoring?: boolean;
  integrityLogs?: IntegrityLogEntry[];
  integrityMetrics?: IntegrityMetrics;
  integritySummary?: IntegrityReportSummary;
}

export interface SendMessagePayload {
  interviewId: string;
  message: string;
  isVoiceInput?: boolean;
}

export interface SendMessageResponse {
  evaluation?: {
    score: number;
    feedback: string;
    followupSuggestion?: string;
    coveredConcepts?: string[];
    missingConcepts?: string[];
  };
  nextQuestion?: ChatMessage;
  isComplete: boolean;
  session: InterviewSession;
  difficultyShifted?: boolean;
  newDifficulty?: Difficulty;
}
