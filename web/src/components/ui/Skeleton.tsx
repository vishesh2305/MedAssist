'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'avatar' | 'list' | 'rectangular';
}

function SkeletonBase({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 dark:bg-gray-700 rounded',
        className
      )}
    />
  );
}

export function Skeleton({ className, variant = 'text' }: SkeletonProps) {
  switch (variant) {
    case 'avatar':
      return <SkeletonBase className={cn('h-10 w-10 rounded-full', className)} />;

    case 'card':
      return (
        <div className={cn('rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden', className)}>
          <SkeletonBase className="h-48 w-full rounded-none" />
          <div className="p-4 space-y-3">
            <SkeletonBase className="h-5 w-3/4" />
            <SkeletonBase className="h-4 w-1/2" />
            <div className="flex gap-2">
              <SkeletonBase className="h-6 w-16 rounded-full" />
              <SkeletonBase className="h-6 w-16 rounded-full" />
            </div>
            <SkeletonBase className="h-4 w-full" />
          </div>
        </div>
      );

    case 'list':
      return (
        <div className={cn('space-y-3', className)}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <SkeletonBase className="h-10 w-10 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <SkeletonBase className="h-4 w-3/4" />
                <SkeletonBase className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      );

    case 'rectangular':
      return <SkeletonBase className={cn('h-32 w-full rounded-lg', className)} />;

    default:
      return <SkeletonBase className={cn('h-4 w-full', className)} />;
  }
}
