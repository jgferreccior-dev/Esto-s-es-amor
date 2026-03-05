import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const progress = Math.min(100, (current / total) * 100);

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex justify-between text-xs font-mono text-text-muted mb-2">
        <span>PREGUNTA {current}</span>
        <span>{total} TOTAL</span>
      </div>
      <div className="h-2 bg-surface rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-secondary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};
