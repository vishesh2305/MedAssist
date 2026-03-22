'use client';

import React from 'react';
import type { EmergencyLog } from '@/types';
import { cn, formatDate } from '@/lib/utils';
import { CheckCircle, Clock, AlertTriangle, Loader2, XCircle } from 'lucide-react';

interface EmergencyStatusProps {
  emergency: EmergencyLog;
  className?: string;
}

const statusSteps = [
  { key: 'TRIGGERED', label: 'Emergency Triggered', icon: AlertTriangle },
  { key: 'RESPONDED', label: 'Help Responded', icon: Clock },
  { key: 'IN_PROGRESS', label: 'In Progress', icon: Loader2 },
  { key: 'RESOLVED', label: 'Resolved', icon: CheckCircle },
];

const statusOrder = ['TRIGGERED', 'RESPONDED', 'IN_PROGRESS', 'RESOLVED'];

export function EmergencyStatus({ emergency, className }: EmergencyStatusProps) {
  const currentIndex = statusOrder.indexOf(emergency.status);
  const isCancelled = emergency.status === 'CANCELLED';

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6', className)}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Emergency Status</h3>
        <span className={cn(
          'text-xs font-medium px-2.5 py-1 rounded-full',
          isCancelled
            ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            : emergency.status === 'RESOLVED'
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        )}>
          {isCancelled ? 'Cancelled' : (emergency.status || '').replace('_', ' ')}
        </span>
      </div>

      {isCancelled ? (
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <XCircle className="h-5 w-5" />
          <span className="text-sm">This emergency was cancelled.</span>
        </div>
      ) : (
        <div className="relative">
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const StepIcon = step.icon;

            return (
              <div key={step.key} className="flex items-start gap-4 relative">
                {/* Line */}
                {index < statusSteps.length - 1 && (
                  <div
                    className={cn(
                      'absolute left-4 top-8 w-0.5 h-8',
                      isCompleted ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                    )}
                  />
                )}

                {/* Icon */}
                <div
                  className={cn(
                    'h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 z-10',
                    isCompleted
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                  )}
                >
                  <StepIcon className={cn('h-4 w-4', isCurrent && step.key !== 'RESOLVED' && 'animate-pulse')} />
                </div>

                {/* Content */}
                <div className="pb-8 flex-1">
                  <p className={cn(
                    'text-sm font-medium',
                    isCompleted
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-400 dark:text-gray-500'
                  )}>
                    {step.label}
                  </p>
                  {isCompleted && step.key === 'TRIGGERED' && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {formatDate(emergency.createdAt, 'long')}
                    </p>
                  )}
                  {isCompleted && step.key === 'RESPONDED' && (emergency as any).respondedAt && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {formatDate((emergency as any).respondedAt, 'long')}
                    </p>
                  )}
                  {isCompleted && step.key === 'RESOLVED' && emergency.resolvedAt && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {formatDate(emergency.resolvedAt, 'long')}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
