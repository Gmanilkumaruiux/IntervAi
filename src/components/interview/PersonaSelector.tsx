import React from 'react';
import { RecruiterPersona } from '../../types/interview';
import { Rocket, ShieldCheck, Bot, Cpu, Users, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

export interface PersonaSelectorProps {
  selectedPersona: RecruiterPersona;
  onSelectPersona: (persona: RecruiterPersona) => void;
}

export const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  selectedPersona,
  onSelectPersona,
}) => {
  const personas: {
    id: RecruiterPersona;
    name: string;
    description: string;
    icon: React.ReactNode;
    badgeText: string;
  }[] = [
    {
      id: 'Startup Engineer',
      name: 'Startup Lead Engineer',
      description: 'Focuses on rapid prototyping, pragmatic implementation, product delivery, and real-world execution.',
      icon: <Rocket className="w-5 h-5 text-[#F97316]" />,
      badgeText: 'Pragmatic & Fast'
    },
    {
      id: 'FAANG Interviewer',
      name: 'FAANG Interviewer',
      description: 'Rigorous assessment of distributed scalability, algorithmic efficiency, edge cases, and strict trade-offs.',
      icon: <ShieldCheck className="w-5 h-5 text-indigo-600" />,
      badgeText: 'High Rigor & Scale'
    },
    {
      id: 'Senior AI Engineer',
      name: 'Senior AI Lead',
      description: 'Deep dive into RAG pipelines, agentic orchestration loops, vector database indexing, and LLM fine-tuning.',
      icon: <Bot className="w-5 h-5 text-emerald-600" />,
      badgeText: 'AI Architecture'
    },
    {
      id: 'Principal Engineer',
      name: 'Principal Architect',
      description: 'High-level system design, multi-region fault tolerance, zero-downtime migrations, and executive trade-offs.',
      icon: <Cpu className="w-5 h-5 text-purple-600" />,
      badgeText: 'Enterprise Systems'
    },
    {
      id: 'HR + Technical Panel',
      name: 'HR + Technical Panel',
      description: 'Balanced panel session assessing technical problem-solving clarity, teamwork, and communication.',
      icon: <Users className="w-5 h-5 text-cyan-600" />,
      badgeText: 'Holistic Evaluation'
    }
  ];

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold text-[#334155] block flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-[#F97316]" /> AI Recruiter Persona Mode
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {personas.map((p) => {
          const isSelected = selectedPersona === p.id;

          return (
            <div
              key={p.id}
              onClick={() => onSelectPersona(p.id)}
              className={clsx(
                'p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-2',
                isSelected
                  ? 'bg-[#FFEDD5] border-[#F97316] shadow-sm'
                  : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                    {p.icon}
                  </div>
                  <span className={clsx(
                    'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                    isSelected
                      ? 'bg-[#F97316] text-white border-[#EA580C]'
                      : 'bg-[#F1F5F9] text-[#334155] border-[#CBD5E1]'
                  )}>
                    {p.badgeText}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#0F172A]">{p.name}</h4>
                <p className="text-xs text-[#64748B] mt-1 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
