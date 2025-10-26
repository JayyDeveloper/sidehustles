import React from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export function Card({ children, hover = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border backdrop-blur-3xl shadow-glass relative overflow-hidden',
        'border-gray-200/50 bg-gradient-to-br from-white/95 via-white/80 to-white/90',
        'dark:border-white/10 dark:from-white/[0.08] dark:via-white/[0.05] dark:to-white/[0.03]',
        'shadow-inner-glow',
        hover && 'hover:shadow-glass-lg transition-all duration-300 cursor-pointer',
        hover && 'hover:from-white dark:hover:from-white/[0.12] hover:scale-[1.01]',
        className
      )}
      {...props}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-500/[0.02] to-transparent pointer-events-none"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function CardHeader({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 border-b border-gray-200/50 dark:border-white/10', className)} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 border-t border-gray-200/50 dark:border-white/10', className)} {...props}>
      {children}
    </div>
  );
}
