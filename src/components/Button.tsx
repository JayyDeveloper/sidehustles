import React from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const variants = {
  primary:
    'bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white border-transparent shadow-glow hover:shadow-glow-lg',
  secondary:
    'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300/50 dark:bg-white/5 dark:hover:bg-white/10 dark:text-gray-300 dark:border-white/10 backdrop-blur-xl',
  ghost:
    'bg-transparent hover:bg-gray-100 text-gray-700 border-transparent dark:hover:bg-white/5 dark:text-gray-300',
  danger:
    'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-transparent shadow-lg shadow-red-500/20',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium',
        'border transition-all duration-300 transform',
        'focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2',
        'focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'active:scale-95',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
