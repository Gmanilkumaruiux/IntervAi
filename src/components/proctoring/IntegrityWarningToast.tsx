import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, AlertTriangle, X } from 'lucide-react';
import { IntegrityLogEntry } from '../../types/integrity';

export interface IntegrityWarningToastProps {
  log: IntegrityLogEntry | null;
  onDismiss: () => void;
}

export const IntegrityWarningToast: React.FC<IntegrityWarningToastProps> = ({
  log,
  onDismiss,
}) => {
  if (!log || log.severity === 'info') return null;

  const isCritical = log.severity === 'critical';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className={`fixed top-20 right-6 z-50 p-4 rounded-xl border shadow-xl flex items-start gap-3 max-w-md ${
          isCritical
            ? 'bg-rose-50 border-rose-300 text-rose-950'
            : 'bg-amber-50 border-amber-300 text-amber-950'
        }`}
      >
        <div className="p-1 rounded-lg bg-white shadow-xs flex-shrink-0">
          {isCritical ? (
            <ShieldAlert className="w-5 h-5 text-rose-600" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          )}
        </div>

        <div className="flex-1 pr-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wide">
              {isCritical ? 'Proctoring Warning Event' : 'Notice Event Logged'}
            </h4>
            <span className="text-[10px] font-mono text-slate-500">{log.formattedTime}</span>
          </div>
          <p className="text-xs font-bold mt-0.5">{log.title}</p>
          <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed">{log.description}</p>
        </div>

        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-md"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
