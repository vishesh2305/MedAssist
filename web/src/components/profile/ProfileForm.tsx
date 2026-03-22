'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { User } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  nationality: z.string().optional(),
  medicalNotes: z.string().max(500).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { updateProfile } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      nationality: user.nationality || '',
      medicalNotes: user.medicalNotes || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      await updateProfile(data as Partial<User>);
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="First Name"
        error={errors.firstName?.message}
        {...register('firstName')}
      />

      <Input
        label="Last Name"
        error={errors.lastName?.message}
        {...register('lastName')}
      />

      <Select
        label="Nationality"
        options={[
          { value: '', label: 'Select nationality' },
          { value: 'US', label: 'United States' },
          { value: 'GB', label: 'United Kingdom' },
          { value: 'CA', label: 'Canada' },
          { value: 'IN', label: 'India' },
          { value: 'AU', label: 'Australia' },
          { value: 'OTHER', label: 'Other' },
        ]}
        {...register('nationality')}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Medical Notes
        </label>
        <textarea
          {...register('medicalNotes')}
          rows={4}
          placeholder="Any allergies, chronic conditions, or important medical information..."
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
        />
        {errors.medicalNotes && (
          <p className="mt-1 text-sm text-red-500">{errors.medicalNotes.message}</p>
        )}
      </div>

      <Button type="submit" isLoading={isLoading}>
        Save Changes
      </Button>
    </form>
  );
}
