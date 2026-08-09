import { Difficulty, InterviewMode, RecruiterPersona, SourceDocument } from './interview';
import { IntegrityReportSummary } from './integrity';
import { LearningRoadmap } from './roadmap';

export interface TopicScore {
  topic: string;
  score: number; // 0 - 100
  fullMark: number;
}

export interface QuestionBreakdown {
  questionNumber: number;
  question: string;
  candidateAnswer: string;
  score: number;
  aiFeedback: string;
  sampleOptimalAnswer: string;
  topic: string;
  difficultyLevel: Difficulty;
  ragCitation?: string;
}

export interface InterviewReport {
  id: string;
  interviewId: string;
  candidateName: string;
  candidateEmail: string;
  date: string;
  durationMinutes: number;
  topic: string;
  difficulty: Difficulty;
  initialDifficulty: Difficulty;
  mode: InterviewMode;
  persona: RecruiterPersona;
  personaVerdict: string; // Recruiter persona summary opinion
  overallScore: number; // 0 - 100
  hiringRecommendation: 'Strong Hire' | 'Hire' | 'Weak Hire' | 'No Hire';
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  topicScores: TopicScore[];
  categoryBreakdown: {
    category: string;
    score: number;
  }[];
  difficultyTimeline: { questionNumber: number; difficulty: Difficulty; score: number }[];
  sourceDocuments?: SourceDocument[];
  integritySummary?: IntegrityReportSummary;
  questions: QuestionBreakdown[];
  learningRoadmap?: LearningRoadmap;
}
