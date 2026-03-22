'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Rating } from '@/components/ui/Rating';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Review } from '@/types';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await api.get('/admin/reviews', { params: { status: 'pending' } });
        setReviews(data.data || data.reviews || []);
      } catch {
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleAction = async (id: string, approved: boolean) => {
    try {
      await api.patch(`/admin/reviews/${id}`, { isApproved: approved });
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success(approved ? 'Review approved' : 'Review rejected');
    } catch {
      toast.error('Action failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Review Moderation</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Approve or reject pending reviews</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" className="h-32" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <Card>
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            No pending reviews to moderate.
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const userName = review.user
              ? `${review.user.firstName || ''} ${review.user.lastName || ''}`.trim() || 'Anonymous'
              : 'Anonymous';
            const userAvatar = review.user?.avatarUrl;

            return (
              <Card key={review.id}>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <Avatar
                        src={userAvatar}
                        name={userName}
                        size="md"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900 dark:text-white text-sm">
                            {userName}
                          </span>
                          <Badge variant="warning" size="sm">Pending</Badge>
                        </div>
                        <Rating value={review.rating} size="sm" className="mb-2" />
                        <h4 className="font-medium text-sm text-gray-900 dark:text-white">{review.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{review.content}</p>
                        <p className="text-xs text-gray-400 mt-2">{formatDate(review.createdAt, 'long')}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<CheckCircle className="h-4 w-4 text-green-500" />}
                        onClick={() => handleAction(review.id, true)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<XCircle className="h-4 w-4 text-red-500" />}
                        onClick={() => handleAction(review.id, false)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
