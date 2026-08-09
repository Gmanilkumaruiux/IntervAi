import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { speechService } from '../../services/speechService';
import { Mic, MicOff, Check, RotateCcw, X, Edit3, Volume2, MessageSquare, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export interface VoiceTranscriptionPreviewProps {
  onConfirmText: (text: string) => void;
  onCancel: () => void;
  autoStart?: boolean;
}

export const VoiceTranscriptionPreview: React.FC<VoiceTranscriptionPreviewProps> = ({
  onConfirmText,
  onCancel,
  autoStart = true
}) => {
  const [isRecording, setIsRecording] = useState(autoStart);
  const [isMuted, setIsMuted] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (autoStart) {
      startDictation();
    }
    return () => {
      speechService.stopListening();
    };
  }, []);

  const startDictation = () => {
    setIsRecording(true);
    setIsMuted(false);
    setErrorMsg(null);

    speechService.startListening(
      (text: string) => {
        setTranscription((prev) => (prev ? `${prev} ${text}` : text));
      },
      (err: any) => {
        const errorText = typeof err === 'string' ? err : 'Speech recognition unavailable or permission denied.';
        setErrorMsg(errorText);
        setIsRecording(false);
      }
    );
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    speechService.stopListening();
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      startDictation();
    } else {
      setIsMuted(true);
      setIsRecording(false);
      speechService.stopListening();
    }
  };

  const handleReRecord = () => {
    setTranscription('');
    startDictation();
  };

  const handleConfirm = () => {
    speechService.stopListening();
    if (transcription.trim()) {
      onConfirmText(transcription.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-2xl bg-[#FFF7ED] border border-[#FDBA74] shadow-md space-y-3 select-none"
    >
      <div className="flex items-center justify-between border-b border-[#FDBA74] pb-2">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${isRecording && !isMuted ? 'bg-rose-500 text-white animate-pulse' : 'bg-[#F97316] text-white'}`}>
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </div>
          <div>
            <span className="text-xs font-bold text-[#0F172A] block">
              {isRecording ? 'Hands-Free Voice STT Active' : isMuted ? 'Microphone Muted' : 'Transcription Complete'}
            </span>
            <span className="text-[10px] text-[#EA580C] font-mono font-semibold">
              {isRecording ? 'Speak your technical answer aloud...' : 'Review or edit spoken transcript before sending'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="text-xs text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 font-mono bg-white px-2.5 py-1 rounded-lg border border-[#E2E8F0]"
            title="Switch to Text Input"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#F97316]" /> Switch to Text
          </button>

          <button onClick={onCancel} className="text-[#64748B] hover:text-[#0F172A] p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Transcription Preview / Edit Input */}
      {isEditing ? (
        <textarea
          value={transcription}
          onChange={(e) => setTranscription(e.target.value)}
          rows={3}
          className="w-full bg-white border border-[#FDBA74] rounded-xl p-3 text-xs text-[#0F172A] focus:outline-none font-sans"
        />
      ) : (
        <div className="p-3 bg-white rounded-xl border border-[#FDBA74] min-h-[65px] max-h-[140px] overflow-y-auto text-xs text-[#0F172A] leading-relaxed font-sans relative">
          {transcription ? (
            transcription
          ) : (
            <span className="text-[#94A3B8] italic flex items-center gap-2">
              {isRecording ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  Listening to candidate voice input...
                </>
              ) : (
                'No speech transcription recorded yet.'
              )}
            </span>
          )}
        </div>
      )}

      {/* Error / Fallback Notification */}
      {errorMsg && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-between font-mono">
          <span className="flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" /> {errorMsg}
          </span>
          <button onClick={onCancel} className="underline text-rose-800">
            Use Text Input
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleToggleMute}
            variant={isMuted ? 'destructive' : 'outline'}
            size="sm"
            leftIcon={isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-[#F97316]" />}
          >
            {isMuted ? 'Unmute Mic' : 'Mute Mic'}
          </Button>

          {isRecording ? (
            <Button onClick={handleStopRecording} variant="secondary" size="sm">
              Pause Recording
            </Button>
          ) : (
            <Button onClick={handleReRecord} variant="outline" size="sm" leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              Retry Dictation
            </Button>
          )}

          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant="ghost"
            size="sm"
            leftIcon={<Edit3 className="w-3.5 h-3.5" />}
          >
            {isEditing ? 'View Preview' : 'Edit Text'}
          </Button>
        </div>

        <Button
          onClick={handleConfirm}
          disabled={!transcription.trim()}
          variant="glow"
          size="sm"
          rightIcon={<Check className="w-4 h-4" />}
        >
          Confirm & Send Answer
        </Button>
      </div>
    </motion.div>
  );
};
