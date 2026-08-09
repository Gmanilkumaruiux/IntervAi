export type IntegritySeverity = 'critical' | 'warning' | 'info';

export type IntegrityEventType =
  | 'interview_started'
  | 'interview_completed'
  | 'tab_switch'
  | 'window_blur'
  | 'window_focus'
  | 'fullscreen_exited'
  | 'fullscreen_entered'
  | 'browser_refresh_attempt'
  | 'multiple_sessions_detected'
  | 'mic_revoked'
  | 'camera_revoked'
  | 'paste_detected'
  | 'long_inactivity'
  | 'very_long_response'
  | 'multiple_answer_edits'
  | 'question_skipped'
  | 'network_disconnected'
  | 'network_reconnected';

export interface IntegrityLogEntry {
  id: string;
  timestamp: string; // ISO string
  formattedTime: string; // e.g., '10:05:31'
  eventType: IntegrityEventType;
  severity: IntegritySeverity;
  title: string;
  description: string;
}

export interface IntegrityMetrics {
  durationSeconds: number;
  timePerQuestionSeconds: Record<number, number>; // questionIndex -> seconds
  avgResponseTimeSeconds: number;
  questionsCompleted: number;
  questionsSkipped: number;
  voiceAnswersCount: number;
  textAnswersCount: number;
  tabSwitchCount: number;
  focusLossCount: number;
  fullscreenExitCount: number;
  pasteCount: number;
  inactivityCount: number;
  networkInterruptionCount: number;
  totalWordsTyped: number;
  totalWordsSpoken: number;
}

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface IntegrityReportSummary {
  score: number; // 0 - 100
  riskLevel: RiskLevel;
  criticalEventsCount: number;
  warningEventsCount: number;
  metrics: IntegrityMetrics;
  logs: IntegrityLogEntry[];
  summaryText: string;
}
