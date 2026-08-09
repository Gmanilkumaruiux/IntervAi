import { InterviewReport } from '../types/report';
import { LearningRoadmap, SkillToImprove, StudyPlanItem, PriorityLevel, LearningResource } from '../types/roadmap';

const ROADMAPS_STORAGE_KEY = 'intervai_roadmaps_progress';

class RoadmapGeneratorService {
  /**
   * Generates a Personalized Learning Roadmap from an Interview Report
   */
  public generateRoadmapForReport(report: InterviewReport): LearningRoadmap {
    const topic = report.topic;
    const lowScoreQuestions = report.questions.filter(q => q.score < 85);
    const weaknesses = report.weaknesses.length > 0
      ? report.weaknesses
      : ['Optimize system latency & concurrency', 'Deepen error boundary edge case handling'];

    // Build Priority Skills
    const skillsToImprove: SkillToImprove[] = [];

    // 1. High Priority Skill from lowest scoring question or primary weakness
    const primaryWeakness = weaknesses[0] || `Core Architecture in ${topic}`;
    const primaryQuestion = lowScoreQuestions[0];
    skillsToImprove.push({
      id: `skill-1-${report.id}`,
      skillName: primaryWeakness,
      priority: 'High',
      reasonText: primaryQuestion
        ? `Scored ${primaryQuestion.score}/100 on Q${primaryQuestion.questionNumber}: "${primaryQuestion.question.slice(0, 60)}..."`
        : `Identified by ${report.persona} as primary technical growth area.`,
      recommendedTopics: [
        `${topic} Production Architecture`,
        `Error Recovery & Fallbacks`,
        `Latency SLA Benchmarking`
      ],
      practiceQuestions: [
        `How do you handle zero-downtime failover for ${primaryWeakness}?`,
        `What key metrics do you monitor when debugging latency spikes in ${topic}?`
      ],
      resources: this.getCuratedResources(topic, primaryWeakness, 'High'),
      isCompleted: false
    });

    // 2. Medium Priority Skill
    const secondaryWeakness = weaknesses[1] || `${topic} Advanced Implementation`;
    const secondaryQuestion = lowScoreQuestions[1] || report.questions[0];
    skillsToImprove.push({
      id: `skill-2-${report.id}`,
      skillName: secondaryWeakness,
      priority: 'Medium',
      reasonText: secondaryQuestion
        ? `Evaluated at ${secondaryQuestion.score}/100 on ${topic} core mechanics.`
        : `Recommended to strengthen production depth.`,
      recommendedTopics: [
        `Design Patterns in ${topic}`,
        `Schema & Contract Validation`,
        `Concurrency & State Management`
      ],
      practiceQuestions: [
        `How do you structure unit test suites for ${secondaryWeakness}?`,
        `Explain how state persistence works under high concurrent request volumes.`
      ],
      resources: this.getCuratedResources(topic, secondaryWeakness, 'Medium'),
      isCompleted: false
    });

    // 3. Low Priority Skill (Advanced Mastery)
    const tertiaryWeakness = `Advanced ${topic} Telemetry & Edge Cases`;
    skillsToImprove.push({
      id: `skill-3-${report.id}`,
      skillName: tertiaryWeakness,
      priority: 'Low',
      reasonText: `Targeted to push overall score from ${report.overallScore}/100 to 95+ Expert level.`,
      recommendedTopics: [
        `OpenTelemetry & Distributed Tracing`,
        `Load Testing & Stress Benchmarking`,
        `Security & Access Control`
      ],
      practiceQuestions: [
        `How do you integrate OpenTelemetry tracing in ${topic} microservices?`,
        `What security vulnerabilities should be guarded against in production ${topic}?`
      ],
      resources: this.getCuratedResources(topic, tertiaryWeakness, 'Low'),
      isCompleted: false
    });

    // Build 7-Day Study Plan
    const studyPlan: StudyPlanItem[] = [
      {
        id: `plan-1-${report.id}`,
        dayOrWeekLabel: 'Day 1 - Day 2',
        focusArea: `Core Concepts & Theoretical Deep Dive`,
        tasks: [
          `Review official documentation for ${topic} architecture`,
          `Watch tutorial: "Mastering ${primaryWeakness}"`,
          `Answer practice question: "How do you handle failover in ${primaryWeakness}?"`
        ],
        isCompleted: false
      },
      {
        id: `plan-2-${report.id}`,
        dayOrWeekLabel: 'Day 3 - Day 4',
        focusArea: `Hands-on Implementation & Refactoring`,
        tasks: [
          `Build a working code snippet implementing ${secondaryWeakness}`,
          `Add Pydantic/Zod schema validation and error fallback handling`,
          `Run local unit tests to verify zero edge-case crashes`
        ],
        isCompleted: false
      },
      {
        id: `plan-3-${report.id}`,
        dayOrWeekLabel: 'Day 5 - Day 6',
        focusArea: `System Design & Performance SLA Optimization`,
        tasks: [
          `Implement telemetry logging and latency benchmarks for ${topic}`,
          `Review ${tertiaryWeakness} documentation and OpenTelemetry guides`,
          `Complete mock system design scenario for high-traffic workloads`
        ],
        isCompleted: false
      },
      {
        id: `plan-4-${report.id}`,
        dayOrWeekLabel: 'Day 7',
        focusArea: `Final Retest & AI Assessment Verification`,
        tasks: [
          `Retake IntervAI Assessment on ${topic} at Advanced Level`,
          `Compare score improvement against baseline report score (${report.overallScore}/100)`
        ],
        isCompleted: false
      }
    ];

    const roadmap: LearningRoadmap = {
      id: `rdm-${report.id}`,
      reportId: report.id,
      interviewTopic: topic,
      generatedAt: new Date().toISOString().split('T')[0],
      estimatedCompletionTime: '7 Days (approx 1.5 hrs/day)',
      overallProgressPercentage: 0,
      skillsToImprove,
      studyPlan
    };

    // Load any saved progress from storage if exists
    return this.restoreRoadmapProgress(roadmap);
  }

  /**
   * Curates resource links based on topic and skill domain
   */
  private getCuratedResources(topic: string, skillName: string, priority: PriorityLevel): LearningResource[] {
    const encodedTopic = encodeURIComponent(`${topic} ${skillName} tutorial`);
    const encodedDocs = encodeURIComponent(`${topic} official documentation`);

    return [
      {
        id: `res-yt-${Math.random()}`,
        title: `YouTube: Mastering ${topic} - ${skillName}`,
        type: 'YouTube',
        url: `https://www.youtube.com/results?search_query=${encodedTopic}`,
        estimatedMinutes: 35
      },
      {
        id: `res-doc-${Math.random()}`,
        title: `Official Docs: ${topic} Core Architectural Specifications`,
        type: 'Documentation',
        url: `https://www.google.com/search?q=${encodedDocs}`,
        estimatedMinutes: 20
      },
      {
        id: `res-crs-${Math.random()}`,
        title: `DeepLearning.AI / Coursera: Advanced ${topic} Engineering`,
        type: 'Course',
        url: `https://www.deeplearning.ai/courses/`,
        estimatedMinutes: 90
      }
    ];
  }

  /**
   * Restores stored task completion checkmarks from localStorage
   */
  public restoreRoadmapProgress(roadmap: LearningRoadmap): LearningRoadmap {
    if (typeof window === 'undefined') return roadmap;
    try {
      const raw = localStorage.getItem(`${ROADMAPS_STORAGE_KEY}_${roadmap.id}`);
      if (raw) {
        const storedProgress: { completedTaskIds: string[]; completedSkillIds: string[] } = JSON.parse(raw);

        const updatedStudyPlan = roadmap.studyPlan.map(item => ({
          ...item,
          isCompleted: storedProgress.completedTaskIds?.includes(item.id) ?? false
        }));

        const updatedSkills = roadmap.skillsToImprove.map(skill => ({
          ...skill,
          isCompleted: storedProgress.completedSkillIds?.includes(skill.id) ?? false
        }));

        const totalItems = updatedStudyPlan.length + updatedSkills.length;
        const completedItems = updatedStudyPlan.filter(i => i.isCompleted).length + updatedSkills.filter(s => s.isCompleted).length;
        const progressPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

        return {
          ...roadmap,
          studyPlan: updatedStudyPlan,
          skillsToImprove: updatedSkills,
          overallProgressPercentage: progressPct
        };
      }
    } catch (err) {
      console.error('Failed to restore roadmap progress:', err);
    }
    return roadmap;
  }

  /**
   * Save task completion toggle state to localStorage
   */
  public saveRoadmapProgress(roadmap: LearningRoadmap): void {
    if (typeof window === 'undefined') return;
    try {
      const completedTaskIds = roadmap.studyPlan.filter(i => i.isCompleted).map(i => i.id);
      const completedSkillIds = roadmap.skillsToImprove.filter(s => s.isCompleted).map(s => s.id);

      localStorage.setItem(`${ROADMAPS_STORAGE_KEY}_${roadmap.id}`, JSON.stringify({
        completedTaskIds,
        completedSkillIds
      }));
    } catch (err) {
      console.error('Failed to save roadmap progress:', err);
    }
  }
}

export const roadmapGeneratorService = new RoadmapGeneratorService();
