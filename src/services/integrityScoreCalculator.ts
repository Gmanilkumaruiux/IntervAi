import { IntegrityLogEntry, IntegrityMetrics, IntegrityReportSummary, RiskLevel } from '../types/integrity';

export const integrityScoreCalculator = {
  calculateIntegritySummary(
    logs: IntegrityLogEntry[],
    metrics: IntegrityMetrics
  ): IntegrityReportSummary {
    let score = 100;
    let criticalCount = 0;
    let warningCount = 0;

    logs.forEach(log => {
      if (log.severity === 'critical') {
        criticalCount++;
        score -= 15;
      } else if (log.severity === 'warning') {
        warningCount++;
        score -= 5;
      }
    });

    const finalScore = Math.max(0, Math.min(100, score));

    let riskLevel: RiskLevel = 'Low';
    if (finalScore < 65) {
      riskLevel = 'High';
    } else if (finalScore < 85) {
      riskLevel = 'Medium';
    }

    let summaryText = 'Normal candidate behavior recorded during the interview session with zero critical anomalies.';

    if (riskLevel === 'High') {
      summaryText = `HIGH INTEGRITY RISK: Candidate logged ${criticalCount} critical events (such as tab switching or window focus loss) and ${warningCount} warnings. Recommended manual review of event timeline.`;
    } else if (riskLevel === 'Medium') {
      summaryText = `MODERATE INTEGRITY RISK: Minor focus shifts (${metrics.tabSwitchCount} tab switches, ${metrics.pasteCount} paste events) logged during the session. Candidate completed all responses.`;
    }

    return {
      score: finalScore,
      riskLevel,
      criticalEventsCount: criticalCount,
      warningEventsCount: warningCount,
      metrics,
      logs,
      summaryText
    };
  }
};
