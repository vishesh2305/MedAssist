'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { PricingTable } from '@/components/hospital/PricingTable';
import { Skeleton } from '@/components/ui/Skeleton';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Plus, DollarSign } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface PricingItem {
  id: string;
  serviceName: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  currency: string;
  description?: string;
}

const pricingSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  serviceName: z.string().min(1, 'Service name is required'),
  minPrice: z.coerce.number().min(0, 'Minimum price required'),
  maxPrice: z.coerce.number().min(0, 'Maximum price required'),
  description: z.string().optional(),
});

type PricingFormData = z.infer<typeof pricingSchema>;

export default function DashboardPricingPage() {
  const [pricing, setPricing] = useState<PricingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PricingFormData>({
    resolver: zodResolver(pricingSchema),
  });

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const { data } = await api.get('/hospital/pricing');
        setPricing(data.pricing || data.data || []);
      } catch {
        setPricing([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPricing();
  }, []);

  const onSubmit = async (data: PricingFormData) => {
    setIsSubmitting(true);
    try {
      await api.post('/hospital/pricing', {
        category: data.category,
        serviceName: data.serviceName,
        minPrice: data.minPrice,
        maxPrice: data.maxPrice,
        currency: 'USD',
        description: data.description,
      });
      toast.success('Pricing item added');
      setShowModal(false);
      reset();
      // Refresh
      const { data: refreshed } = await api.get('/hospital/pricing');
      setPricing(refreshed.pricing || refreshed.data || []);
    } catch {
      toast.error('Failed to add pricing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Pricing</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Set transparent pricing for your services</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => setShowModal(true)}>
          Add Price
        </Button>
      </div>

      {isLoading ? (
        <Skeleton variant="rectangular" className="h-64" />
      ) : (
        <Card>
          <CardContent>
            <PricingTable pricing={pricing} />
          </CardContent>
        </Card>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Pricing Item" size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <Input label="Category" placeholder="e.g., Consultations, Surgery, Lab Tests" error={errors.category?.message} {...register('category')} />
          <Input label="Service Name" placeholder="e.g., General Consultation" error={errors.serviceName?.message} {...register('serviceName')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Min Price (USD)" type="number" placeholder="50" error={errors.minPrice?.message} {...register('minPrice')} />
            <Input label="Max Price (USD)" type="number" placeholder="150" error={errors.maxPrice?.message} {...register('maxPrice')} />
          </div>
          <Input label="Description (optional)" placeholder="Brief description of the service" {...register('description')} />
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setShowModal(false)} fullWidth>Cancel</Button>
            <Button type="submit" fullWidth isLoading={isSubmitting}>Add Item</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
