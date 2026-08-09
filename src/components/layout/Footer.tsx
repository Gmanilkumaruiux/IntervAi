import React from 'react';
import { Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#E2E8F0] mt-auto py-6 px-4 lg:px-8 text-xs text-[#64748B] select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#FFEDD5] border border-[#FDBA74] flex items-center justify-center text-[#F97316]">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-[#0F172A]">
              Interv<span className="text-[#F97316]">AI</span>
            </span>
          </div>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span>© 2026 IntervAI. All Rights Reserved. (v1.0)</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          <a
            href="#privacy"
            onClick={(e) => { e.preventDefault(); alert('IntervAI Privacy Policy: Candidate data is encrypted and used solely for interview evaluation purposes.'); }}
            className="hover:text-[#F97316] transition-colors"
          >
            Privacy Policy
          </a>
          <span>•</span>
          <a
            href="#terms"
            onClick={(e) => { e.preventDefault(); alert('IntervAI Terms & Conditions: Platform designed for automated AI candidate assessment and skill practice.'); }}
            className="hover:text-[#F97316] transition-colors"
          >
            Terms & Conditions
          </a>
          <span>•</span>
          <a
            href="#support"
            onClick={(e) => { e.preventDefault(); alert('Contact Support: Email support@intervai.dev for help.'); }}
            className="hover:text-[#F97316] transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </footer>
  );
};
