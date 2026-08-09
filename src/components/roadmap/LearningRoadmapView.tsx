import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LearningRoadmap, SkillToImprove, StudyPlanItem } from '../../types/roadmap';
import { roadmapGeneratorService } from '../../services/roadmapGeneratorService';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  Sparkles,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Youtube,
  FileText,
  GraduationCap,
  ExternalLink,
  Target,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  TrendingUp,
  Flame
} from 'lucide-react';

export interface LearningRoadmapViewProps {
  roadmap: LearningRoadmap;
  onRoadmapUpdate?: (updated: LearningRoadmap) => void;
}

export const LearningRoadmapView: React.FC<LearningRoadmapViewProps> = ({
  roadmap: initialRoadmap,
  onRoadmapUpdate
}) => {
  const [roadmap, setRoadmap] = useState<LearningRoadmap>(initialRoadmap);
  const [activeTab, setActiveTab] = useState<'study-plan' | 'skills' | 'resources'>('study-plan');

  const handleToggleTask = (taskId: string) => {
    const updatedPlan = roadmap.studyPlan.map(item =>
      item.id === taskId ? { ...item, isCompleted: !item.isCompleted } : item
    );

    const totalItems = updatedPlan.length + roadmap.skillsToImprove.length;
    const completedItems = updatedPlan.filter(i => i.isCompleted).length + roadmap.skillsToImprove.filter(s => s.isCompleted).length;
    const progressPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    const updatedRoadmap: LearningRoadmap = {
      ...roadmap,
      studyPlan: updatedPlan,
      overallProgressPercentage: progressPct
    };

    setRoadmap(updatedRoadmap);
    roadmapGeneratorService.saveRoadmapProgress(updatedRoadmap);
    if (onRoadmapUpdate) onRoadmapUpdate(updatedRoadmap);
  };

  const handleToggleSkill = (skillId: string) => {
    const updatedSkills = roadmap.skillsToImprove.map(skill =>
      skill.id === skillId ? { ...skill, isCompleted: !skill.isCompleted } : skill
    );

    const totalItems = roadmap.studyPlan.length + updatedSkills.length;
    const completedItems = roadmap.studyPlan.filter(i => i.isCompleted).length + updatedSkills.filter(s => s.isCompleted).length;
    const progressPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    const updatedRoadmap: LearningRoadmap = {
      ...roadmap,
      skillsToImprove: updatedSkills,
      overallProgressPercentage: progressPct
    };

    setRoadmap(updatedRoadmap);
    roadmapGeneratorService.saveRoadmapProgress(updatedRoadmap);
    if (onRoadmapUpdate) onRoadmapUpdate(updatedRoadmap);
  };

  return (
    <Card variant="glowing" className="bg-white border-[#FDBA74] shadow-md p-6 space-y-6 select-none">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFEDD5] border border-[#FDBA74] text-[#EA580C] text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#F97316]" /> AI-Synthesized Learning Roadmap
          </div>
          <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2">
            <Target className="w-5 h-5 text-[#F97316]" /> Personalized Mastery Roadmap • {roadmap.interviewTopic}
          </h2>
          <p className="text-xs text-[#64748B]">
            Generated from your recent interview evaluation performance, missing concepts, and AI feedback.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono">
            <span className="text-[#64748B] block text-[10px]">Est. Completion</span>
            <span className="font-bold text-[#0F172A] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-600" /> {roadmap.estimatedCompletionTime}
            </span>
          </div>

          <div className="px-4 py-2 rounded-xl bg-[#FFEDD5] border border-[#FDBA74] text-xs font-mono min-w-[150px]">
            <div className="flex justify-between font-bold text-[#EA580C] mb-1">
              <span>Progress</span>
              <span>{roadmap.overallProgressPercentage}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white border border-[#FDBA74] overflow-hidden">
              <div
                className="h-full bg-[#F97316] transition-all duration-500"
                style={{ width: `${roadmap.overallProgressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#E2E8F0] pb-2 font-mono text-xs">
        <button
          onClick={() => setActiveTab('study-plan')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
            activeTab === 'study-plan' ? 'bg-[#334155] text-white shadow-xs' : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-[#F97316]" /> Daily Study Plan ({roadmap.studyPlan.length} Steps)
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
            activeTab === 'skills' ? 'bg-[#334155] text-white shadow-xs' : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-amber-500" /> Priority Skills to Improve ({roadmap.skillsToImprove.length})
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
            activeTab === 'resources' ? 'bg-[#334155] text-white shadow-xs' : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-600" /> Curated Learning Resources
        </button>
      </div>

      {/* TAB 1: Daily/Weekly Study Plan Timeline */}
      {activeTab === 'study-plan' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#F97316]" /> Step-by-Step Study Timeline
            </h3>
            <span className="text-xs text-[#64748B] font-mono">Check off completed study tasks</span>
          </div>

          <div className="space-y-3">
            {roadmap.studyPlan.map((step) => (
              <div
                key={step.id}
                className={`p-4 rounded-2xl border transition-all ${
                  step.isCompleted
                    ? 'bg-emerald-50/60 border-emerald-200'
                    : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#334155] text-white text-[11px] font-bold font-mono">
                      {step.dayOrWeekLabel}
                    </span>
                    <h4 className="text-xs font-bold text-[#0F172A]">{step.focusArea}</h4>
                  </div>

                  <button
                    onClick={() => handleToggleTask(step.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 transition-colors ${
                      step.isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:text-[#0F172A]'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {step.isCompleted ? 'Completed' : 'Mark Done'}
                  </button>
                </div>

                <ul className="space-y-1.5 pt-1 pl-1">
                  {step.tasks.map((task, idx) => (
                    <li key={idx} className="text-xs text-[#334155] flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] mt-1.5 flex-shrink-0" />
                      <span className={step.isCompleted ? 'line-through text-[#64748B]' : ''}>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Priority Skills to Improve */}
      {activeTab === 'skills' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#F97316]" /> Target Technical Growth Areas
            </h3>
            <span className="text-xs text-[#64748B]">Sorted by Priority Assessment Impact</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roadmap.skillsToImprove.map((skill) => (
              <div
                key={skill.id}
                className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        skill.priority === 'High' ? 'amber' : skill.priority === 'Medium' ? 'indigo' : 'emerald'
                      }
                      size="sm"
                    >
                      {skill.priority} Priority
                    </Badge>

                    <button
                      onClick={() => handleToggleSkill(skill.id)}
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        skill.isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-white text-[#64748B] border border-[#E2E8F0]'
                      }`}
                    >
                      {skill.isCompleted ? '✓ Mastered' : 'Mark Mastered'}
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-[#0F172A]">{skill.skillName}</h4>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">{skill.reasonText}</p>

                  {/* Practice Questions */}
                  <div className="pt-2 border-t border-[#E2E8F0] space-y-1.5">
                    <span className="text-[11px] font-bold text-[#EA580C] block flex items-center gap-1 font-mono">
                      <HelpCircle className="w-3.5 h-3.5" /> Recommended Practice:
                    </span>
                    {skill.practiceQuestions.map((pq, idx) => (
                      <p key={idx} className="text-[11px] text-[#334155] bg-white p-2 rounded-lg border border-[#E2E8F0]">
                        "{pq}"
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Curated Learning Resources */}
      {activeTab === 'resources' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" /> Recommended Study Resources
            </h3>
            <span className="text-xs text-[#64748B]">YouTube, Official Documentation, & Specialized Courses</span>
          </div>

          <div className="space-y-3">
            {roadmap.skillsToImprove.flatMap(s => s.resources).map((res) => (
              <div
                key={res.id}
                className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#F97316] transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white border border-[#E2E8F0]">
                    {res.type === 'YouTube' && <Youtube className="w-4 h-4 text-rose-600" />}
                    {res.type === 'Documentation' && <FileText className="w-4 h-4 text-[#F97316]" />}
                    {res.type === 'Course' && <GraduationCap className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F172A] group-hover:text-[#EA580C] transition-colors">
                      {res.title}
                    </h4>
                    <span className="text-[11px] text-[#64748B] font-mono">
                      Type: {res.type} • Est. Time: {res.estimatedMinutes} mins
                    </span>
                  </div>
                </div>

                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#E2E8F0] text-xs font-bold text-[#334155] hover:text-[#EA580C] hover:border-[#FDBA74] transition-all flex items-center gap-1.5 font-mono"
                >
                  Open Resource <ExternalLink className="w-3.5 h-3.5 text-[#F97316]" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
