import React from 'react';
import { Bot } from 'lucide-react';
import { motion } from 'framer-motion';

export const TypingIndicator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className="flex items-start gap-3 my-3 max-w-2xl"
    >
      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#F97316] to-[#334155] p-0.5 shadow-md flex-shrink-0">
        <div className="w-full h-full rounded-[10px] bg-[#1E293B] flex items-center justify-center text-[#F97316]">
          <Bot className="w-4 h-4" />
        </div>
      </div>
      
      <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-3 border border-[#E2E8F0] shadow-sm">
        <span className="text-xs text-[#EA580C] font-semibold tracking-wide">IntervAI is evaluating response</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#F97316] animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-[#FDBA74] animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </motion.div>
  );
};
