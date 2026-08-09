import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { X, Settings, Volume2, ShieldCheck, Palette, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [speechRate, setSpeechRate] = useState(1.0);
  const [autoVoice, setAutoVoice] = useState(true);
  const [proctoringEnabled, setProctoringEnabled] = useState(true);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        >
          <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#FFEDD5] text-[#EA580C]">
                <Settings className="w-5 h-5 text-[#F97316]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Platform Settings</h3>
                <p className="text-xs text-[#64748B]">Configure interview preferences & default behavior</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 text-xs">
            {/* Voice & Speech Preferences */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Volume2 className="w-4 h-4 text-[#F97316]" /> Voice & Speech Synthesis
              </h4>
              <div className="space-y-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#334155]">Auto-read AI Questions (TTS)</span>
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

                <div className="space-y-1">
                  <div className="flex justify-between font-semibold text-[#334155]">
                    <span>Default Speech Rate:</span>
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
                </div>
              </div>
            </div>

            {/* Proctoring Settings */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <ShieldCheck className="w-4 h-4 text-[#F97316]" /> Proctoring & Integrity Engine
              </h4>
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#0F172A] block">Enable Interview Integrity Monitoring</span>
                  <span className="text-[11px] text-[#64748B]">Tracks tab switches, window blur, paste events & inactivity</span>
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
            </div>

            {/* Theme Reference */}
            <div className="space-y-2">
              <h4 className="font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Palette className="w-4 h-4 text-[#F97316]" /> System Theme Palette
              </h4>
              <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
                <Badge variant="indigo" size="sm">Primary: #334155</Badge>
                <Badge variant="slate" size="sm">Secondary: #1E293B</Badge>
                <Badge variant="accent" size="sm">Accent: #F97316</Badge>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end">
            <Button onClick={onClose} variant="glow" size="sm">
              Save Preferences
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
