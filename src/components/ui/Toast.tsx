import React, { useEffect } from 'react';
import { clsx } from 'clsx';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ToastProps {
  id: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  message?: string;
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  type = 'info',
  title,
  message,
  isOpen,
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-[#F97316] flex-shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-300 bg-emerald-50 text-emerald-950',
    error: 'border-rose-300 bg-rose-50 text-rose-950',
    info: 'border-[#FDBA74] bg-[#FFEDD5] text-[#7C2D12]',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className={clsx(
            'fixed bottom-6 right-6 z-50 p-4 rounded-xl border glass-panel shadow-2xl flex items-start gap-3 max-w-sm',
            borders[type]
          )}
        >
          {icons[type]}
          <div className="flex-1 pr-2">
            <h4 className="text-sm font-semibold">{title}</h4>
            {message && <p className="text-xs opacity-90 mt-0.5">{message}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 transition-colors p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
