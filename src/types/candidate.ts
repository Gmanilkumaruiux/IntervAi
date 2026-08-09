export interface Skill {
  id: string;
  name: string;
  category: 'Core AI' | 'Architecture' | 'Ops' | 'Protocols';
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  score: number; // 0 - 100
  iconName: string;
  description: string;
  completedQuestions: number;
}

export interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  targetRole: string;
  totalInterviews: number;
  avgScore: number;
  completedDays: number;
  totalDays: number;
  skippedDays: number;
  streakDays: number;
  strongestTopic: string;
  weakestTopic: string;
  skills: Skill[];
}
