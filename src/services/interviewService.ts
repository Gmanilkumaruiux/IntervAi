import {
  InterviewSession,
  InterviewSetupPayload,
  SendMessagePayload,
  SendMessageResponse,
  ChatMessage
} from '../types/interview';
import { InterviewReport } from '../types/report';
import { aiGeneratorEngine } from './aiGeneratorEngine';
import { roadmapGeneratorService } from './roadmapGeneratorService';
import { MOCK_REPORTS } from './mockData';

const ACTIVE_SESSION_STORAGE_KEY = 'intervai_active_interview_session';
const REPORTS_ARCHIVE_STORAGE_KEY = 'intervai_reports_archive';

class InterviewService {
  private activeSession: InterviewSession | null = null;
  private reportsArchive: InterviewReport[] = [];

  constructor() {
    this.restoreSessionFromStorage();
    this.loadReportsArchiveFromStorage();
  }

  private loadReportsArchiveFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(REPORTS_ARCHIVE_STORAGE_KEY);
      if (raw) {
        this.reportsArchive = JSON.parse(raw);
      }
    } catch (err) {
      console.error('Failed to load reports archive from storage:', err);
    }
  }

  private saveReportsArchiveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(REPORTS_ARCHIVE_STORAGE_KEY, JSON.stringify(this.reportsArchive));
    } catch (err) {
      console.error('Failed to save reports archive to storage:', err);
    }
  }

  /**
   * Restores active interview session from localStorage on initialization
   */
  private restoreSessionFromStorage(): InterviewSession | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);
      if (raw) {
        const parsed: InterviewSession = JSON.parse(raw);
        if (parsed && parsed.status === 'in_progress') {
          this.activeSession = parsed;
          return parsed;
        }
      }
    } catch (err) {
      console.error('Failed to restore active interview session from storage:', err);
    }
    return null;
  }

  /**
   * Persists active session to localStorage
   */
  public saveSessionToStorage(session?: InterviewSession): void {
    const sessionToSave = session || this.activeSession;
    if (!sessionToSave || typeof window === 'undefined') return;

    try {
      localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, JSON.stringify(sessionToSave));
    } catch (err) {
      console.error('Failed to save active session to localStorage:', err);
    }
  }

  /**
   * Clears active session from storage
   */
  public clearActiveSession(): void {
    this.activeSession = null;
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
      } catch (err) {
        console.error('Failed to clear active session storage:', err);
      }
    }
  }

  async startInterview(payload: InterviewSetupPayload): Promise<InterviewSession> {
    // Check if an existing in_progress session is already active
    const restored = this.restoreSessionFromStorage();
    if (restored && restored.status === 'in_progress' && restored.topic === payload.topic) {
      return restored;
    }

    const initialQuestion = aiGeneratorEngine.generateInitialQuestion(
      payload.topic,
      payload.difficulty,
      payload.mode,
      payload.persona,
      payload.sourceDocuments,
      payload.targetRole,
      payload.candidateName
    );

    const session: InterviewSession = {
      id: `int-${Date.now()}`,
      candidateName: payload.candidateName || 'Alex Mercer',
      targetRole: payload.targetRole || 'Senior AI Engineer',
      topic: payload.topic,
      customTopics: payload.customTopics,
      difficulty: payload.difficulty,
      initialDifficulty: payload.difficulty,
      mode: payload.mode,
      persona: payload.persona,
      totalQuestions: payload.totalQuestions || 5,
      currentQuestionIndex: 1,
      startedAt: new Date().toISOString(),
      status: 'in_progress',
      messages: [initialQuestion],
      currentScore: 85,
      topicsCovered: [payload.topic],
      coveredConcepts: [],
      missingConcepts: [],
      durationSeconds: 0,
      sourceDocuments: payload.sourceDocuments,
      speechSettings: payload.speechSettings || {
        enabled: true,
        voiceURI: '',
        gender: 'Female',
        accent: 'US',
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        isMuted: false
      },
      difficultyHistory: [
        { questionNumber: 1, difficulty: payload.difficulty, score: 85 }
      ],
      enableProctoring: payload.enableProctoring ?? true
    };

    this.activeSession = session;
    this.saveSessionToStorage(session);
    return session;
  }

  async sendMessage(payload: SendMessagePayload): Promise<SendMessageResponse> {
    if (!this.activeSession || this.activeSession.id !== payload.interviewId) {
      const restored = this.restoreSessionFromStorage();
      if (!restored) {
        throw new Error('Interview session not found or expired.');
      }
    }

    const session = this.activeSession!;

    // Add candidate message to session transcript
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'candidate',
      text: payload.message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    session.messages.push(userMsg);

    // Evaluate answer and generate next question dynamically
    const result = aiGeneratorEngine.evaluateAndGenerateNextQuestion(session, payload.message);

    // Attach evaluation to user message
    userMsg.evaluation = {
      score: result.score,
      feedback: result.feedback,
      followupSuggestion: result.followupSuggestion,
      coveredConcepts: result.coveredConcepts,
      missingConcepts: result.missingConcepts
    };

    // Update cumulative score & concepts covered in session
    session.currentScore = Math.round((session.currentScore + result.score) / 2);
    if (result.coveredConcepts.length > 0) {
      session.coveredConcepts = Array.from(new Set([...(session.coveredConcepts || []), ...result.coveredConcepts]));
    }
    if (result.missingConcepts.length > 0) {
      session.missingConcepts = Array.from(new Set([...(session.missingConcepts || []), ...result.missingConcepts]));
    }

    if (result.difficultyShifted && result.newDifficulty) {
      session.difficulty = result.newDifficulty;
    }

    let isComplete = false;

    if (result.nextQuestion) {
      session.currentQuestionIndex += 1;
      session.messages.push(result.nextQuestion);
      session.difficultyHistory.push({
        questionNumber: session.currentQuestionIndex,
        difficulty: session.difficulty,
        score: result.score
      });
    } else {
      session.status = 'completed';
      isComplete = true;
    }

    // Auto-Save session to storage after sending message
    this.saveSessionToStorage(session);

    return {
      evaluation: {
        score: result.score,
        feedback: result.feedback,
        followupSuggestion: result.followupSuggestion,
        coveredConcepts: result.coveredConcepts,
        missingConcepts: result.missingConcepts
      },
      nextQuestion: result.nextQuestion,
      isComplete,
      session,
      difficultyShifted: result.difficultyShifted,
      newDifficulty: result.newDifficulty
    };
  }

  getActiveSession(): InterviewSession | null {
    if (!this.activeSession) {
      this.restoreSessionFromStorage();
    }
    return this.activeSession;
  }

  /**
   * Complete & End Interview Session: generates final assessment report and stores it in archive
   */
  async endInterview(interviewId?: string): Promise<InterviewReport> {
    const session = this.activeSession || this.restoreSessionFromStorage();
    if (!session) {
      throw new Error('No active interview session found to complete.');
    }

    session.status = 'completed';
    const report = this.buildReportFromSession(session);

    // Save to memory and storage archives
    this.reportsArchive.unshift(report);
    this.saveReportsArchiveToStorage();

    // Clear active session
    this.clearActiveSession();

    return report;
  }

  async getReportsList(): Promise<InterviewReport[]> {
    this.loadReportsArchiveFromStorage();
    const reports = this.reportsArchive.length > 0 ? this.reportsArchive : MOCK_REPORTS;

    // Ensure all reports have generated roadmaps
    return reports.map(r => {
      if (!r.learningRoadmap) {
        r.learningRoadmap = roadmapGeneratorService.generateRoadmapForReport(r);
      } else {
        r.learningRoadmap = roadmapGeneratorService.restoreRoadmapProgress(r.learningRoadmap);
      }
      return r;
    });
  }

  async getReport(id?: string): Promise<InterviewReport> {
    this.loadReportsArchiveFromStorage();

    let targetReport: InterviewReport | undefined = undefined;

    if (id) {
      targetReport = this.reportsArchive.find(r => r.id === id || r.interviewId === id);
    }

    if (!targetReport && this.activeSession && (this.activeSession.id === id || !id)) {
      targetReport = this.buildReportFromSession(this.activeSession);
    }

    if (!targetReport) {
      targetReport = MOCK_REPORTS.find(r => r.id === id || r.interviewId === id);
    }

    if (!targetReport && this.reportsArchive.length > 0) {
      targetReport = this.reportsArchive[0];
    }

    if (!targetReport) {
      targetReport = this.buildReportFromSession({
        id: id || `int-${Date.now()}`,
        candidateName: 'Alex Mercer',
        targetRole: 'Senior AI Engineer',
        topic: 'Agentic AI',
        difficulty: 'Intermediate',
        initialDifficulty: 'Intermediate',
        mode: 'Technical',
        persona: 'Senior AI Engineer',
        totalQuestions: 5,
        currentQuestionIndex: 5,
        startedAt: new Date().toISOString(),
        status: 'completed',
        messages: [],
        currentScore: 88,
        topicsCovered: ['Agentic AI'],
        durationSeconds: 300,
        speechSettings: { enabled: true, voiceURI: '', gender: 'Female', accent: 'US', rate: 1, pitch: 1, volume: 1, isMuted: false },
        difficultyHistory: []
      });
    }

    // Attach or restore learning roadmap
    if (!targetReport.learningRoadmap) {
      targetReport.learningRoadmap = roadmapGeneratorService.generateRoadmapForReport(targetReport);
    } else {
      targetReport.learningRoadmap = roadmapGeneratorService.restoreRoadmapProgress(targetReport.learningRoadmap);
    }

    return targetReport;
  }

  private buildReportFromSession(session: InterviewSession): InterviewReport {
    const questions = session.messages
      .filter(m => m.sender === 'ai')
      .map((m, idx) => {
        const candidateMsg = session.messages[session.messages.indexOf(m) + 1];
        return {
          questionNumber: idx + 1,
          question: m.text,
          candidateAnswer: candidateMsg?.text || 'No response recorded',
          score: candidateMsg?.evaluation?.score || 85,
          aiFeedback: candidateMsg?.evaluation?.feedback || `Demonstrated understanding of ${session.topic}.`,
          sampleOptimalAnswer: `Optimal Senior ${session.topic} Answer addressing architecture, scale, and missing concepts (${(session.missingConcepts || []).join(', ') || 'N/A'}).`,
          topic: session.topic,
          difficultyLevel: m.difficultyLevel || session.difficulty
        };
      });

    const report: InterviewReport = {
      id: `rep-${session.id}`,
      interviewId: session.id,
      candidateName: session.candidateName,
      candidateEmail: 'alex.mercer@dev.io',
      date: new Date().toISOString().split('T')[0],
      durationMinutes: Math.max(1, Math.round(session.durationSeconds / 60)),
      topic: session.topic,
      difficulty: session.difficulty,
      initialDifficulty: session.initialDifficulty,
      mode: session.mode,
      persona: session.persona,
      personaVerdict: `Demonstrated technical depth in ${session.topic}. Covered concepts: ${(session.coveredConcepts || []).join(', ') || 'Core fundamentals'}. Recommended for Senior Engineer roles.`,
      overallScore: session.currentScore,
      hiringRecommendation: session.currentScore >= 88 ? 'Strong Hire' : session.currentScore >= 75 ? 'Hire' : 'Weak Hire',
      strengths: [
        `Clear articulation of ${session.topic} architecture mechanics.`,
        `Demonstrated good reasoning under ${session.persona} evaluation standards.`
      ],
      weaknesses: session.missingConcepts && session.missingConcepts.length > 0
        ? session.missingConcepts.map(c => `Could deepen technical explanation regarding ${c}.`)
        : ['Practice fine-tuning latency SLAs under distributed loads.'],
      recommendations: [
        `Review production trade-offs in ${session.topic}.`,
        'Practice system design edge-case handling.'
      ],
      topicScores: [
        { topic: session.topic, score: session.currentScore, fullMark: 100 }
      ],
      categoryBreakdown: [
        { category: 'Technical Accuracy', score: session.currentScore },
        { category: 'Concept Coverage', score: Math.min(95, session.currentScore + 2) },
        { category: 'Problem Solving', score: Math.max(70, session.currentScore - 2) },
        { category: 'Communication', score: 88 }
      ],
      difficultyTimeline: session.difficultyHistory,
      sourceDocuments: session.sourceDocuments,
      integritySummary: session.integritySummary,
      questions: questions.length > 0 ? questions : []
    };

    // Attach generated Learning Roadmap
    report.learningRoadmap = roadmapGeneratorService.generateRoadmapForReport(report);

    return report;
  }
}

export const interviewService = new InterviewService();
