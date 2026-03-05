import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-background hover:bg-primary/90 shadow-[0_0_15px_rgba(199,125,255,0.4)]',
      secondary: 'bg-secondary text-background hover:bg-secondary/90 shadow-[0_0_15px_rgba(0,245,255,0.4)]',
      outline: 'border border-primary/50 text-primary hover:bg-primary/10',
      ghost: 'text-text-muted hover:text-text-main hover:bg-white/5',
    };

    const sizes = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-11 px-6 text-base',
      lg: 'h-14 px-8 text-lg',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'relative inline-flex items-center justify-center rounded-xl font-display font-bold transition-colors disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          </div>
        )}
        <span className={cn(isLoading && 'invisible')}>{children}</span>
      </motion.button>
    );
  }
);
Button.displayName = 'Button';
