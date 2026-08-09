import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Send, Mic, MicOff, Code } from 'lucide-react';
import { proctoringService } from '../../services/proctoringService';
import { clsx } from 'clsx';

export interface InputBoxProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  disabled?: boolean;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
}

export const InputBox: React.FC<InputBoxProps> = ({
  onSendMessage,
  isLoading = false,
  placeholder = 'Type your technical answer here... (Shift+Enter for new line)',
  disabled = false,
  inputRef,
}) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const internalTextareaRef = useRef<HTMLTextAreaElement>(null);
  const activeRef = inputRef || internalTextareaRef;

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.style.height = 'auto';
      activeRef.current.style.height = `${Math.min(activeRef.current.scrollHeight, 180)}px`;
    }
  }, [text]);

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText && pastedText.length > 5) {
      proctoringService.logPasteEvent(pastedText.length);
    }
  };

  const handleSend = () => {
    if (!text.trim() || isLoading || disabled) return;
    onSendMessage(text.trim());
    setText('');
    if (activeRef.current) {
      activeRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleMic = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      if (isListening) {
        setIsListening(false);
      } else {
        setIsListening(true);
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
      }
    } else {
      alert('Speech recognition is not supported in this browser environment.');
    }
  };

  const insertCodeTemplate = () => {
    const template = '\n```typescript\n// Your solution code here\nfunction solution() {\n  return true;\n}\n```\n';
    setText((prev) => prev + template);
  };

  return (
    <div className="w-full bg-white border border-[#E2E8F0] rounded-2xl p-3 shadow-md focus-within:border-[#F97316] transition-all sticky bottom-0 z-20">
      <div className="relative">
        <textarea
          ref={activeRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          rows={2}
          className="w-full bg-transparent text-[#0F172A] placeholder-[#94A3B8] text-sm focus:outline-none resize-none pr-12 min-h-[50px] max-h-[180px] font-sans leading-relaxed"
        />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0] mt-1">
        <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
          <button
            type="button"
            onClick={toggleMic}
            className={clsx(
              'p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-medium',
              isListening
                ? 'bg-rose-50 text-rose-600 border-rose-300 animate-pulse'
                : 'bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] border-[#CBD5E1]'
            )}
            title="Speech-to-text voice dictation"
          >
            {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isListening ? 'Listening...' : 'Voice Input'}</span>
          </button>

          <button
            type="button"
            onClick={insertCodeTemplate}
            className="p-2 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] border border-[#CBD5E1] transition-all flex items-center gap-1.5 text-xs font-medium"
            title="Insert code block snippet"
          >
            <Code className="w-3.5 h-3.5 text-[#F97316]" />
            <span className="hidden sm:inline">Add Code</span>
          </button>

          <span className="text-[11px] text-[#94A3B8] ml-2 hidden md:inline">
            {text.length} chars
          </span>
        </div>

        <Button
          onClick={handleSend}
          disabled={!text.trim() || isLoading || disabled}
          isLoading={isLoading}
          variant="glow"
          size="sm"
          rightIcon={<Send className="w-3.5 h-3.5" />}
        >
          Send Answer
        </Button>
      </div>
    </div>
  );
};
