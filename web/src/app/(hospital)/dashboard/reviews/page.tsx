'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ReviewCard } from '@/components/hospital/ReviewCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Review } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Star, MessageSquare } from 'lucide-react';

export default function DashboardReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await api.get('/hospital/reviews');
        setReviews(data.reviews || data.data || []);
      } catch {
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleRespond = async (reviewId: string) => {
    if (!responseText.trim()) return;
    try {
      await api.post(`/hospital/reviews/${reviewId}/respond`, { content: responseText });
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? { ...r, response: { content: responseText, respondedAt: new Date().toISOString() } }
            : r
        )
      );
      setRespondingTo(null);
      setResponseText('');
      toast.success('Response posted');
    } catch {
      toast.error('Failed to post response');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Patient Reviews</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">View and respond to patient feedback</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" className="h-32" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={<Star className="h-12 w-12" />}
              title="No reviews yet"
              description="Patient reviews will appear here once patients share their experience at your hospital."
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent>
                <ReviewCard review={review} />

                {!(review as any).response && (
                  <div className="mt-4 ml-13 pl-4 border-l-2 border-gray-200 dark:border-gray-600">
                    {respondingTo === review.id ? (
                      <div className="space-y-3">
                        <textarea
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          placeholder="Write your response to this review..."
                          rows={3}
                          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleRespond(review.id)}>
                            Post Response
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setRespondingTo(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<MessageSquare className="h-3 w-3" />}
                        onClick={() => setRespondingTo(review.id)}
                      >
                        Respond to this review
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
