'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Phone, Mail, Globe, Clock, MapPin } from 'lucide-react';

const settingsSchema = z.object({
  name: z.string().min(2, 'Hospital name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  phone: z.string().min(10, 'Valid phone number required'),
  email: z.string().email('Valid email required'),
  website: z.string().url().optional().or(z.literal('')),
  address: z.string().min(1, 'Street address required'),
  city: z.string().min(1, 'City required'),
  country: z.string().min(1, 'Country required'),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function DashboardSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  });

  const onSubmit = async (data: SettingsFormData) => {
    setIsLoading(true);
    try {
      await api.put('/hospital/profile', {
        name: data.name,
        description: data.description,
        phone: data.phone,
        email: data.email,
        website: data.website,
        address: data.address,
        city: data.city,
        country: data.country,
      });
      toast.success('Hospital profile updated');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hospital Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Update your hospital profile information</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Basic Information
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Hospital Name" error={errors.name?.message} {...register('name')} />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea
                {...register('description')}
                rows={4}
                placeholder="Describe your hospital, services, and what makes you unique..."
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
              />
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contact Information
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Phone Number" type="tel" error={errors.phone?.message} {...register('phone')} />
            <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
            <Input label="Website (optional)" type="url" placeholder="https://..." error={errors.website?.message} {...register('website')} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Street Address" error={errors.address?.message} {...register('address')} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="City" error={errors.city?.message} {...register('city')} />
              <Input label="Country" error={errors.country?.message} {...register('country')} />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" isLoading={isLoading}>
          Save Changes
        </Button>
      </form>
    </div>
  );
}
