import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  User,
  Mail,
  Award,
  BookOpen,
  Calendar,
  Sparkles,
  TrendingUp,
  Sliders,
  CheckCircle2,
  Cpu,
  Flame,
  ShieldCheck
} from 'lucide-react';

export const CandidateProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const skillsList = [
    { name: 'Prompt Engineering', level: 'Advanced', progress: 85 },
    { name: 'RAG & Vector DB', level: 'Intermediate', progress: 75 },
    { name: 'Agentic AI & ReAct', level: 'Advanced', progress: 90 },
    { name: 'MCP Protocols', level: 'Intermediate', progress: 70 },
    { name: 'HTML & Frontend Architecture', level: 'Expert', progress: 95 },
    { name: 'LLM Deployment & Evaluation', level: 'Intermediate', progress: 68 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-16 select-none"
    >
      {/* Profile Banner */}
      <Card variant="glass" className="bg-white border-[#E2E8F0] p-6 sm:p-8 rounded-2xl shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar
              src={user?.avatar}
              name={user?.name || 'Alex Mercer'}
              size="lg"
              status="online"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">{user?.name || 'Candidate Profile'}</h1>
                <Badge variant="accent" size="sm">Active Registered Candidate</Badge>
              </div>
              <p className="text-xs text-[#64748B] flex items-center gap-2 font-mono">
                <Mail className="w-3.5 h-3.5 text-[#F97316]" /> {user?.email || 'candidate@dev.io'}
              </p>
              <span className="text-[10px] text-[#94A3B8] font-mono block">
                Account Created: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active Member'}
              </span>
            </div>
          </div>

          <Button
            onClick={() => navigate('/interview/setup')}
            variant="glow"
            size="md"
            leftIcon={<Sliders className="w-4 h-4" />}
          >
            Start Technical Assessment
          </Button>
        </div>
      </Card>

      {/* Curriculum Mastery Progress Card */}
      <Card variant="glass" className="bg-white border-[#E2E8F0] p-6 rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#F97316]" /> AI Interview Curriculum Readiness
          </h2>
          <span className="text-xs font-mono font-bold text-[#EA580C]">Curriculum Active</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="text-[#334155]">Overall Curriculum Mastery</span>
            <span className="text-[#F97316]">Ready for Live Technical Evaluation</span>
          </div>
          <div className="w-full h-3 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#F97316] to-[#EA580C] w-[80%] rounded-full" />
          </div>
        </div>
      </Card>

      {/* Technical Skill Cards Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#334155]" /> Evaluated Technical Competencies
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillsList.map((skill) => (
            <Card key={skill.name} variant="glass" className="bg-white border-[#E2E8F0] p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F172A]">{skill.name}</span>
                <Badge variant="accent" size="sm">{skill.level}</Badge>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-[#64748B]">
                  <span>Competency Target</span>
                  <span className="font-bold text-[#0F172A]">{skill.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                  <div className="h-full bg-[#334155] rounded-full" style={{ width: `${skill.progress}%` }} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
