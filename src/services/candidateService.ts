import { CandidateProfile } from '../types/candidate';

class CandidateService {
  private candidate: CandidateProfile = {
    id: 'cand-001',
    name: 'Alex Mercer',
    email: 'alex.mercer@dev.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    targetRole: 'Senior AI Engineer',
    totalInterviews: 0,
    avgScore: 0,
    completedDays: 14,
    totalDays: 30,
    skippedDays: 2,
    streakDays: 5,
    strongestTopic: 'Agentic AI',
    weakestTopic: 'MCP Protocols',
    skills: [
      { id: 's1', name: 'Prompt Engineering', category: 'Core AI', score: 85, level: 'Advanced', iconName: 'Terminal', description: 'System prompts & zero-shot reasoning', completedQuestions: 12 },
      { id: 's2', name: 'RAG & Vector DB', category: 'Architecture', score: 75, level: 'Intermediate', iconName: 'Database', description: 'Dense embeddings & HNSW indexing', completedQuestions: 10 },
      { id: 's3', name: 'Agentic AI & ReAct', category: 'Core AI', score: 90, level: 'Advanced', iconName: 'Cpu', description: 'Autonomous tools & ReAct loops', completedQuestions: 15 },
      { id: 's4', name: 'MCP Protocols', category: 'Protocols', score: 70, level: 'Intermediate', iconName: 'Layers', description: 'Model Context Protocol tool schemas', completedQuestions: 8 },
      { id: 's5', name: 'HTML & Frontend', category: 'Architecture', score: 95, level: 'Expert', iconName: 'Layout', description: 'DOM Tree parsing & semantic accessibility', completedQuestions: 20 },
      { id: 's6', name: 'LLM Deployment', category: 'Ops', score: 68, level: 'Intermediate', iconName: 'Server', description: 'vLLM, TRT-LLM & latency optimization', completedQuestions: 7 }
    ]
  };

  async getProfile(): Promise<CandidateProfile> {
    return this.candidate;
  }

  async getCandidateProfile(): Promise<CandidateProfile> {
    return this.candidate;
  }

  async updateProfile(updates: Partial<CandidateProfile>): Promise<CandidateProfile> {
    this.candidate = { ...this.candidate, ...updates };
    return this.candidate;
  }
}

export const candidateService = new CandidateService();
