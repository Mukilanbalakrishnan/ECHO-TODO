import React from 'react';
import { cn } from '../../utils/cn';
import type { Priority, Status } from '../../types';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Priority | Status | 'default';
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          {
            'bg-slate-100 text-slate-800': variant === 'default',
            'bg-blue-100 text-blue-800': variant === 'Low',
            'bg-yellow-100 text-yellow-800': variant === 'Medium',
            'bg-orange-100 text-orange-800': variant === 'High',
            'bg-red-100 text-red-800': variant === 'Urgent',
            'bg-slate-200 text-slate-700': variant === 'Pending',
            'bg-indigo-100 text-indigo-800': variant === 'In Progress',
            'bg-emerald-100 text-emerald-800': variant === 'Completed',
          },
          className
        )}
        {...props}
      >
        {children || variant}
      </div>
    );
  }
);
Badge.displayName = 'Badge';
