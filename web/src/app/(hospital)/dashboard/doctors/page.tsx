'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { DoctorCard } from '@/components/hospital/DoctorCard';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Doctor } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, UserPlus } from 'lucide-react';

const doctorSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  specialty: z.string().min(1, 'Specialty is required'),
  experience: z.coerce.number().min(0, 'Experience must be positive'),
  consultationFee: z.coerce.number().min(0, 'Fee must be positive'),
  bio: z.string().optional(),
});

type DoctorFormData = z.infer<typeof doctorSchema>;

export default function DashboardDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<DoctorFormData>({
    resolver: zodResolver(doctorSchema),
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await api.get('/hospital/doctors');
        setDoctors(data.doctors || data.data || []);
      } catch {
        setDoctors([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const onSubmit = async (data: DoctorFormData) => {
    setIsSubmitting(true);
    try {
      const { data: result } = await api.post('/hospital/doctors', data);
      setDoctors((prev) => [...prev, result.doctor || result]);
      setShowModal(false);
      reset();
      toast.success('Doctor added successfully');
    } catch {
      toast.error('Failed to add doctor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Doctors</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Add and manage your medical staff</p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => setShowModal(true)}>
          Add Doctor
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" className="h-32" />
          ))}
        </div>
      ) : doctors.length === 0 ? (
        <Card>
          <div className="p-12 text-center">
            <UserPlus className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">No doctors added yet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Add your medical staff to help patients find the right specialist.</p>
            <Button onClick={() => setShowModal(true)}>Add Your First Doctor</Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Doctor" size="md">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <Input label="Full Name" placeholder="Dr. John Smith" error={errors.name?.message} {...register('name')} />
          <Select
            label="Specialty"
            options={[
              { value: '', label: 'Select specialty' },
              { value: 'General Medicine', label: 'General Medicine' },
              { value: 'Cardiology', label: 'Cardiology' },
              { value: 'Orthopedics', label: 'Orthopedics' },
              { value: 'Pediatrics', label: 'Pediatrics' },
              { value: 'Dentistry', label: 'Dentistry' },
              { value: 'Neurology', label: 'Neurology' },
              { value: 'Dermatology', label: 'Dermatology' },
            ]}
            error={errors.specialty?.message}
            {...register('specialty')}
          />
          <Input label="Years of Experience" type="number" error={errors.experience?.message} {...register('experience')} />
          <Input label="Consultation Fee (USD)" type="number" error={errors.consultationFee?.message} {...register('consultationFee')} />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio (optional)</label>
            <textarea {...register('bio')} rows={3} placeholder="Brief professional biography..."
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setShowModal(false)} fullWidth>Cancel</Button>
            <Button type="submit" fullWidth isLoading={isSubmitting}>Add Doctor</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
