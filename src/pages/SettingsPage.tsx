import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Settings, Volume2, ShieldCheck, Users, Save, Check } from 'lucide-react';
import { RecruiterPersona } from '../types/interview';

export const SettingsPage: React.FC = () => {
  const [speechRate, setSpeechRate] = useState(1.0);
  const [autoVoice, setAutoVoice] = useState(true);
  const [proctoringEnabled, setProctoringEnabled] = useState(true);
  const [defaultPersona, setDefaultPersona] = useState<RecruiterPersona>('Senior AI Engineer');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12 select-none"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#F97316]" /> Platform Settings & Preferences
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Manage your AI interview execution defaults, Web Speech settings, and Proctoring rules.
          </p>
        </div>

        <Button
          onClick={handleSave}
          variant="glow"
          size="sm"
          leftIcon={savedSuccess ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
        >
          {savedSuccess ? 'Settings Saved!' : 'Save Preferences'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Voice & Speech Synthesis */}
        <Card variant="glass" className="bg-white border-[#E2E8F0]">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2 text-[#0F172A]">
              <Volume2 className="w-4.5 h-4.5 text-[#F97316]" /> Web Speech (TTS / STT) Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#0F172A] block">Auto-read AI Questions</span>
                <span className="text-[11px] text-[#64748B]">Automatically read AI questions aloud using Text-to-Speech</span>
              </div>
              <button
                type="button"
                onClick={() => setAutoVoice(!autoVoice)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  autoVoice ? 'bg-[#F97316] text-white' : 'bg-[#E2E8F0] text-[#64748B]'
                }`}
              >
                {autoVoice ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <div className="flex justify-between font-semibold text-[#0F172A]">
                <span>Default Speech Speaking Rate:</span>
                <span className="font-mono text-[#F97316]">{speechRate}x</span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.5"
                step="0.25"
                value={speechRate}
                onChange={(e) => setSpeechRate(Number(e.target.value))}
                className="w-full accent-[#F97316]"
              />
              <div className="flex justify-between text-[10px] text-[#64748B] font-mono">
                <span>0.75x (Slower)</span>
                <span>1.0x (Normal)</span>
                <span>1.25x (Faster)</span>
                <span>1.5x (Speed)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Proctoring & Integrity Engine */}
        <Card variant="glass" className="bg-white border-[#E2E8F0]">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2 text-[#0F172A]">
              <ShieldCheck className="w-4.5 h-4.5 text-[#F97316]" /> Interview Proctoring Engine
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#0F172A] block">Enable Session Integrity Monitoring</span>
                <span className="text-[11px] text-[#64748B]">Log tab switches, focus loss, paste actions, and inactivity</span>
              </div>
              <button
                type="button"
                onClick={() => setProctoringEnabled(!proctoringEnabled)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  proctoringEnabled ? 'bg-emerald-600 text-white' : 'bg-[#E2E8F0] text-[#64748B]'
                }`}
              >
                {proctoringEnabled ? 'ACTIVE' : 'OFF'}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
              <span className="font-bold text-[#0F172A] block">Non-Blocking Alerts</span>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                When active, candidates will receive live non-blocking toast notifications during tab switches or focus loss without halting the interview session.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Default Recruiter Persona */}
        <Card variant="glass" className="bg-white border-[#E2E8F0] lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2 text-[#0F172A]">
              <Users className="w-4.5 h-4.5 text-[#F97316]" /> Default AI Recruiter Persona
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(['Senior AI Engineer', 'FAANG Interviewer', 'Startup Engineer', 'Principal Engineer', 'HR + Technical Panel'] as RecruiterPersona[]).map(persona => (
                <div
                  key={persona}
                  onClick={() => setDefaultPersona(persona)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    defaultPersona === persona
                      ? 'bg-[#FFEDD5] border-[#FDBA74] text-[#0F172A] font-bold'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#334155] hover:bg-white'
                  }`}
                >
                  <span>{persona}</span>
                  {defaultPersona === persona && <Badge variant="accent" size="sm">Selected</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};
