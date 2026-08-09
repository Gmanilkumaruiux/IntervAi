export type PriorityLevel = 'High' | 'Medium' | 'Low';
export type ResourceType = 'YouTube' | 'Documentation' | 'Course' | 'Article';

export interface LearningResource {
  id: string;
  title: string;
  type: ResourceType;
  url: string;
  estimatedMinutes: number;
}

export interface SkillToImprove {
  id: string;
  skillName: string;
  priority: PriorityLevel;
  reasonText: string;
  recommendedTopics: string[];
  practiceQuestions: string[];
  resources: LearningResource[];
  isCompleted: boolean;
}

export interface StudyPlanItem {
  id: string;
  dayOrWeekLabel: string; // e.g. "Day 1 - Day 2"
  focusArea: string;
  tasks: string[];
  isCompleted: boolean;
}

export interface LearningRoadmap {
  id: string;
  reportId: string;
  interviewTopic: string;
  generatedAt: string;
  estimatedCompletionTime: string; // e.g. "7 Days (approx 1.5 hrs/day)"
  overallProgressPercentage: number; // 0 - 100
  skillsToImprove: SkillToImprove[];
  studyPlan: StudyPlanItem[];
}
