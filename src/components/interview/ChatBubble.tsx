import React from 'react';
import { motion } from 'framer-motion';
import { ChatMessage } from '../../types/interview';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Sparkles, Bot, User, Code, FileText } from 'lucide-react';
import { clsx } from 'clsx';

export interface ChatBubbleProps {
  message: ChatMessage;
  candidateName?: string;
  isLatest?: boolean;
  messageRef?: React.Ref<HTMLDivElement>;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  candidateName = 'Alex Mercer',
  isLatest = false,
  messageRef,
}) => {
  const isAi = message.sender === 'ai';

  return (
    <motion.div
      ref={messageRef}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        'w-full flex gap-2 sm:gap-3.5 my-3',
        isAi ? 'justify-start' : 'justify-end'
      )}
    >
      {/* AI Avatar */}
      {isAi && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#334155] text-white flex items-center justify-center font-bold shadow-md shadow-[#334155]/20 border border-[#475569]">
            <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-[#F97316]" />
          </div>
        </div>
      )}

      {/* Bubble Content Container */}
      <div
        className={clsx(
          'flex flex-col max-w-[94%] sm:max-w-[85%] lg:max-w-[80%]',
          isAi ? 'items-start' : 'items-end'
        )}
      >
        {/* Header Metadata */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1 px-1 text-[11px] sm:text-xs">
          <span className="font-bold text-[#0F172A]">
            {isAi ? 'IntervAI Senior Engineer' : candidateName}
          </span>
          <span className="text-[10px] text-[#64748B] font-mono">{message.timestamp}</span>

          {message.difficultyLevel && (
            <Badge variant="accent" size="sm">
              {message.difficultyLevel}
            </Badge>
          )}

          {message.ragCitation && (
            <Badge variant="indigo" size="sm" className="flex items-center gap-1">
              <FileText className="w-3 h-3 text-[#F97316]" /> RAG: {message.ragCitation}
            </Badge>
          )}
        </div>

        {/* Bubble Box */}
        <div
          className={clsx(
            'p-3.5 sm:p-5 rounded-2xl shadow-sm text-xs sm:text-sm font-sans leading-relaxed transition-all w-full',
            isAi
              ? 'bg-white border border-[#E2E8F0] text-[#0F172A] min-h-[180px] sm:min-h-[260px] h-auto overflow-visible'
              : 'bg-[#334155] text-white rounded-br-none border border-[#1E293B]'
          )}
        >
          {/* Main Message Text */}
          <div className="space-y-3 whitespace-pre-wrap font-sans break-words">
            {message.text}
          </div>

          {/* Embedded Code Snippet */}
          {message.codeSnippet && (
            <div className="mt-4 pt-3 border-t border-[#E2E8F0] space-y-1.5 max-w-full overflow-hidden">
              <div className="flex items-center justify-between text-xs text-[#64748B] font-mono">
                <span className="flex items-center gap-1.5 font-bold text-[#0F172A]">
                  <Code className="w-3.5 h-3.5 text-[#F97316]" /> Technical Code Context:
                </span>
                <span className="text-[10px]">TypeScript / Node.js</span>
              </div>
              <pre className="p-3 sm:p-3.5 rounded-xl bg-[#1E293B] text-[#F8FAFC] border border-[#334155] font-mono text-xs overflow-x-auto leading-relaxed max-w-full">
                <code>{message.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* AI Evaluation Feedback (if Candidate response) */}
          {message.evaluation && (
            <div className="mt-3 pt-3 border-t border-[#E2E8F0] space-y-2 text-xs">
              <div className="flex items-center justify-between font-mono">
                <span className="font-bold text-[#EA580C] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#F97316]" /> AI Score: {message.evaluation.score}/100
                </span>
              </div>
              <p className="text-[#334155] bg-[#FFEDD5]/50 p-2.5 rounded-xl border border-[#FDBA74] text-xs leading-relaxed">
                {message.evaluation.feedback}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Candidate Avatar */}
      {!isAi && (
        <div className="flex-shrink-0 mt-1">
          <Avatar name={candidateName} size="md" status="online" />
        </div>
      )}
    </motion.div>
  );
};
