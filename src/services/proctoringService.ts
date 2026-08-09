import {
  IntegrityEventType,
  IntegrityLogEntry,
  IntegrityMetrics,
  IntegrityReportSummary,
  IntegritySeverity
} from '../types/integrity';
import { integrityScoreCalculator } from './integrityScoreCalculator';

class ProctoringService {
  private logs: IntegrityLogEntry[] = [];
  private metrics: IntegrityMetrics = {
    durationSeconds: 0,
    timePerQuestionSeconds: {},
    avgResponseTimeSeconds: 0,
    questionsCompleted: 0,
    questionsSkipped: 0,
    voiceAnswersCount: 0,
    textAnswersCount: 0,
    tabSwitchCount: 0,
    focusLossCount: 0,
    fullscreenExitCount: 0,
    pasteCount: 0,
    inactivityCount: 0,
    networkInterruptionCount: 0,
    totalWordsTyped: 0,
    totalWordsSpoken: 0
  };

  private listenersAttached = false;
  private idleTimer: any = null;
  private lastTabSwitchTimestamps: number[] = [];
  private broadcastChannel: BroadcastChannel | null = null;
  private eventCallback: ((log: IntegrityLogEntry, summary: IntegrityReportSummary) => void) | null = null;
  private sessionActive = false;

  public startMonitoring(
    interviewId: string,
    onEvent?: (log: IntegrityLogEntry, summary: IntegrityReportSummary) => void
  ) {
    this.logs = [];
    this.lastTabSwitchTimestamps = [];
    this.eventCallback = onEvent || null;
    this.sessionActive = true;

    this.logEvent('interview_started', 'info', 'Proctored Session Started', `Integrity monitoring initialized for session ${interviewId}`);

    if (typeof window === 'undefined') return;

    if (!this.listenersAttached) {
      this.attachListeners();
      this.listenersAttached = true;
    }

    this.initSessionLock(interviewId);
    this.resetIdleTimer();
  }

  public stopMonitoring() {
    this.sessionActive = false;
    this.logEvent('interview_completed', 'info', 'Interview Session Completed', 'Proctoring monitoring concluded.');

    if (this.idleTimer) clearTimeout(this.idleTimer);
    if (this.broadcastChannel) this.broadcastChannel.close();
  }

  public logEvent(
    eventType: IntegrityEventType,
    severity: IntegritySeverity,
    title: string,
    description: string
  ) {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const newLog: IntegrityLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: now.toISOString(),
      formattedTime,
      eventType,
      severity,
      title,
      description
    };

    this.logs.push(newLog);

    // Update metric counters
    if (eventType === 'tab_switch') this.metrics.tabSwitchCount++;
    if (eventType === 'window_blur') this.metrics.focusLossCount++;
    if (eventType === 'fullscreen_exited') this.metrics.fullscreenExitCount++;
    if (eventType === 'paste_detected') this.metrics.pasteCount++;
    if (eventType === 'long_inactivity') this.metrics.inactivityCount++;
    if (eventType === 'network_disconnected') this.metrics.networkInterruptionCount++;

    const summary = this.getSummary();
    if (this.eventCallback) {
      this.eventCallback(newLog, summary);
    }
  }

  public logPasteEvent(pastedLength: number) {
    this.logEvent(
      'paste_detected',
      'warning',
      'Paste Event Detected',
      `Candidate pasted ${pastedLength} characters directly into answer input.`
    );
  }

  public logQuestionAnswered(wordsCount: number, isVoice: boolean = false) {
    this.metrics.questionsCompleted++;
    if (isVoice) {
      this.metrics.voiceAnswersCount++;
      this.metrics.totalWordsSpoken += wordsCount;
    } else {
      this.metrics.textAnswersCount++;
      this.metrics.totalWordsTyped += wordsCount;
    }
  }

  public getSummary(): IntegrityReportSummary {
    return integrityScoreCalculator.calculateIntegritySummary(this.logs, this.metrics);
  }

  public getLogs(): IntegrityLogEntry[] {
    return this.logs;
  }

  public getMetrics(): IntegrityMetrics {
    return this.metrics;
  }

  // --- Internal Browser Event Listeners ---

  private attachListeners() {
    // 1. Browser Tab Switch & Minimize Detection
    document.addEventListener('visibilitychange', () => {
      if (!this.sessionActive) return;
      if (document.hidden) {
        const now = Date.now();
        this.lastTabSwitchTimestamps.push(now);

        // Filter timestamps within last 10 seconds
        this.lastTabSwitchTimestamps = this.lastTabSwitchTimestamps.filter(t => now - t < 10000);

        this.logEvent(
          'tab_switch',
          'critical',
          'Tab Switch / Browser Minimize',
          'Candidate navigated away from the interview tab or minimized the browser.'
        );

        // Detect multiple rapid tab changes (3 or more within 10 seconds)
        if (this.lastTabSwitchTimestamps.length >= 3) {
          this.logEvent(
            'tab_switch',
            'critical',
            'Multiple Rapid Tab Changes',
            `High frequency tab switching detected (${this.lastTabSwitchTimestamps.length} tab changes in under 10 seconds).`
          );
        }
      }
    });

    // 2. Window Blur & Focus Detection
    window.addEventListener('blur', () => {
      if (!this.sessionActive) return;
      this.logEvent(
        'window_blur',
        'critical',
        'Window Lost Focus',
        'Interview window lost application focus.'
      );
    });

    window.addEventListener('focus', () => {
      if (!this.sessionActive) return;
      this.logEvent(
        'window_focus',
        'info',
        'Window Focus Restored',
        'Candidate restored application window focus.'
      );
    });

    // 3. Fullscreen Exit Detection
    document.addEventListener('fullscreenchange', () => {
      if (!this.sessionActive) return;
      if (!document.fullscreenElement) {
        this.logEvent(
          'fullscreen_exited',
          'critical',
          'Fullscreen Mode Exited',
          'Candidate exited proctored fullscreen layout.'
        );
      }
    });

    // 4. Document-Wide Paste Detection
    document.addEventListener('paste', (e: ClipboardEvent) => {
      if (!this.sessionActive) return;
      const pastedData = e.clipboardData?.getData('text') || '';
      this.logEvent(
        'paste_detected',
        'warning',
        'Copy / Paste Violation',
        `Pasted text content detected (${pastedData.length} chars). External text insertion recorded.`
      );
    });

    // 5. Network Disruption Detection
    window.addEventListener('offline', () => {
      if (!this.sessionActive) return;
      this.logEvent(
        'network_disconnected',
        'warning',
        'Network Connection Interrupted',
        'Internet connection lost during proctored session.'
      );
    });

    window.addEventListener('online', () => {
      if (!this.sessionActive) return;
      this.logEvent(
        'network_reconnected',
        'info',
        'Network Connection Restored',
        'Internet connectivity re-established.'
      );
    });

    // 6. User Interaction for Long Inactivity Monitoring
    const resetTimer = () => {
      if (this.sessionActive) this.resetIdleTimer();
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('touchstart', resetTimer);
  }

  private resetIdleTimer() {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    // 60-second inactivity timeout
    this.idleTimer = setTimeout(() => {
      if (this.sessionActive) {
        this.logEvent(
          'long_inactivity',
          'warning',
          'Long Inactivity Detected',
          'No mouse or keyboard input detected for 60 seconds.'
        );
      }
    }, 60000);
  }

  private initSessionLock(interviewId: string) {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.broadcastChannel = new BroadcastChannel('intervai_proctoring_session_lock');
        this.broadcastChannel.postMessage({ type: 'NEW_SESSION_STARTED', interviewId });

        this.broadcastChannel.onmessage = (event) => {
          if (event.data && event.data.interviewId === interviewId) {
            this.logEvent(
              'multiple_sessions_detected',
              'critical',
              'Multiple Sessions Detected',
              'Candidate opened multiple simultaneous interview windows.'
            );
          }
        };
      } catch { /* ignore */ }
    }
  }
}

export const proctoringService = new ProctoringService();
