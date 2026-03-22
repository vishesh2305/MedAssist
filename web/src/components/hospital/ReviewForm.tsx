'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Rating } from '@/components/ui/Rating';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const reviewSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  content: z.string().min(10, 'Review must be at least 10 characters').max(1000),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  hospitalId: string;
  onSubmitted?: () => void;
}

export function ReviewForm({ hospitalId, onSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
  });

  const onSubmit = async (data: ReviewFormData) => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post(`/hospitals/${hospitalId}/reviews`, {
        ...data,
        rating,
      });
      toast.success('Review submitted successfully! It will appear after approval.');
      reset();
      setRating(0);
      onSubmitted?.();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Your Rating
        </label>
        <Rating value={rating} interactive onChange={setRating} size="lg" />
      </div>

      <Input
        label="Review Title"
        placeholder="Summarize your experience"
        error={errors.title?.message}
        {...register('title')}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Your Review
        </label>
        <textarea
          {...register('content')}
          rows={4}
          placeholder="Share details about your experience at this hospital..."
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500 transition-colors duration-200"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
        )}
      </div>

      <Button type="submit" isLoading={isSubmitting}>
        Submit Review
      </Button>
    </form>
  );
}
