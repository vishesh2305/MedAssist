'use client';

import React from 'react';
import type { Review } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Rating } from '@/components/ui/Rating';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { CheckCircle, MessageSquare } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
  className?: string;
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  const userName = review.user
    ? `${review.user.firstName || ''} ${review.user.lastName || ''}`.trim() || 'Anonymous'
    : 'Anonymous';
  const userAvatar = review.user?.avatarUrl;

  return (
    <div className={`py-4 ${className || ''}`}>
      <div className="flex items-start gap-3">
        <Avatar
          src={userAvatar}
          name={userName}
          size="md"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm text-gray-900 dark:text-white">
              {userName}
            </span>
            {review.isVerified && (
              <Badge variant="success" size="sm">
                <CheckCircle className="h-3 w-3 mr-0.5" />
                Verified Visit
              </Badge>
            )}
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {formatDate(review.createdAt, 'relative')}
            </span>
          </div>

          <Rating value={review.rating} size="sm" className="mt-1" />

          {review.title && (
            <h4 className="font-medium text-sm text-gray-900 dark:text-white mt-2">
              {review.title}
            </h4>
          )}

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
            {review.content}
          </p>

          {/* Hospital Response */}
          {(review as any).response && (
            <div className="mt-3 ml-4 pl-4 border-l-2 border-primary-200 dark:border-primary-800">
              <div className="flex items-center gap-1.5 mb-1">
                <MessageSquare className="h-3 w-3 text-primary-600 dark:text-primary-400" />
                <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                  Hospital Response
                </span>
                <span className="text-xs text-gray-400">
                  {formatDate((review as any).response.respondedAt, 'relative')}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {(review as any).response.content}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
