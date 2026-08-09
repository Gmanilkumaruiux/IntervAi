import React from 'react';
import { SpeechSettings, VoiceGender, VoiceAccent } from '../../types/interview';
import { speechService } from '../../services/speechService';
import { Volume2, VolumeX, RotateCcw, User, Globe } from 'lucide-react';
import { clsx } from 'clsx';

export interface SpeechControlBarProps {
  currentText: string;
  settings: SpeechSettings;
  onUpdateSettings: (newSettings: SpeechSettings) => void;
}

export const SpeechControlBar: React.FC<SpeechControlBarProps> = ({
  currentText,
  settings,
  onUpdateSettings,
}) => {
  const handleReplay = () => {
    speechService.replayQuestion(currentText, settings);
  };

  const toggleMute = () => {
    const nextMuted = !settings.isMuted;
    const updated = { ...settings, isMuted: nextMuted };
    onUpdateSettings(updated);
    if (nextMuted) {
      speechService.stopSpeaking();
    } else {
      speechService.speakQuestion(currentText, updated);
    }
  };

  const handleGenderChange = (gender: VoiceGender) => {
    const updated = { ...settings, gender };
    onUpdateSettings(updated);
    speechService.speakQuestion(currentText, updated);
  };

  const handleAccentChange = (accent: VoiceAccent) => {
    const updated = { ...settings, accent };
    onUpdateSettings(updated);
    speechService.speakQuestion(currentText, updated);
  };

  const handleRateChange = (rate: number) => {
    const updated = { ...settings, rate };
    onUpdateSettings(updated);
    speechService.speakQuestion(currentText, updated);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 rounded-xl text-xs font-mono select-none">
      {/* Left: Replay & Mute Controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleReplay}
          className="px-3 py-1.5 rounded-lg bg-[#334155] hover:bg-[#1E293B] text-white font-bold transition-all flex items-center gap-1.5 shadow-xs"
          title="Replay active question aloud"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Replay Question</span>
        </button>

        <button
          type="button"
          onClick={toggleMute}
          className={clsx(
            'p-1.5 rounded-lg border transition-all flex items-center gap-1 font-semibold',
            settings.isMuted
              ? 'bg-rose-50 border-rose-200 text-rose-700'
              : 'bg-white border-[#E2E8F0] text-[#334155] hover:bg-[#F1F5F9]'
          )}
          title={settings.isMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
        >
          {settings.isMuted ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4 text-[#F97316]" />}
          <span className="hidden sm:inline">{settings.isMuted ? 'Muted' : 'Voice On'}</span>
        </button>
      </div>

      {/* Right: Voice Profile Controls (Gender, Accent, Speed) */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Gender Toggle */}
        <div className="flex items-center bg-white border border-[#E2E8F0] rounded-lg p-0.5">
          {(['Female', 'Male'] as VoiceGender[]).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => handleGenderChange(g)}
              className={clsx(
                'px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors flex items-center gap-1',
                settings.gender === g
                  ? 'bg-[#F97316] text-white'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              )}
            >
              <User className="w-3 h-3" /> {g}
            </button>
          ))}
        </div>

        {/* Accent Selector */}
        <div className="flex items-center gap-1 bg-white border border-[#E2E8F0] rounded-lg px-2 py-0.5">
          <Globe className="w-3 h-3 text-[#F97316]" />
          <select
            value={settings.accent}
            onChange={(e) => handleAccentChange(e.target.value as VoiceAccent)}
            className="bg-transparent text-[11px] font-bold text-[#0F172A] focus:outline-none cursor-pointer"
          >
            <option value="US">US Accent</option>
            <option value="UK">UK Accent</option>
            <option value="Indian">Indian Accent</option>
          </select>
        </div>

        {/* Speed Pills */}
        <div className="flex items-center bg-white border border-[#E2E8F0] rounded-lg p-0.5">
          {[0.75, 1.0, 1.25, 1.5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleRateChange(r)}
              className={clsx(
                'px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-colors',
                settings.rate === r
                  ? 'bg-[#334155] text-white'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              )}
            >
              {r}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
