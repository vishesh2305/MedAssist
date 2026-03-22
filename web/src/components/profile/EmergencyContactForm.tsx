'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const schema = z.object({
  emergencyContactName: z.string().min(2, 'Name is required'),
  emergencyContactPhone: z.string().min(10, 'Valid phone number is required'),
});

type FormData = z.infer<typeof schema>;

interface EmergencyContactFormProps {
  contactName?: string;
  contactPhone?: string;
}

export function EmergencyContactForm({ contactName, contactPhone }: EmergencyContactFormProps) {
  const { updateProfile } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      emergencyContactName: contactName || '',
      emergencyContactPhone: contactPhone || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await updateProfile(data as any);
      toast.success('Emergency contact updated');
    } catch {
      toast.error('Failed to update emergency contact');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Contact Name"
        placeholder="Jane Doe"
        error={errors.emergencyContactName?.message}
        {...register('emergencyContactName')}
      />

      <Input
        label="Phone Number"
        type="tel"
        placeholder="+1 234 567 8900"
        error={errors.emergencyContactPhone?.message}
        {...register('emergencyContactPhone')}
      />

      <Button type="submit" isLoading={isLoading}>
        Save Emergency Contact
      </Button>
    </form>
  );
}
