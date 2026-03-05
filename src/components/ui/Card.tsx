import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: 'primary' | 'secondary' | 'warm';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glowColor = 'primary', children, ...props }, ref) => {
    const glows = {
      primary: 'border-primary/30 shadow-[0_0_30px_-10px_rgba(199,125,255,0.15)]',
      secondary: 'border-secondary/30 shadow-[0_0_30px_-10px_rgba(0,245,255,0.15)]',
      warm: 'border-warm/30 shadow-[0_0_30px_-10px_rgba(255,107,157,0.15)]',
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'relative overflow-hidden rounded-2xl border bg-surface/50 backdrop-blur-xl p-6',
          glows[glowColor],
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Card.displayName = 'Card';
