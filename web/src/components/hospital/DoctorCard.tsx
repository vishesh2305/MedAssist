'use client';

import React from 'react';
import type { Doctor } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { Stethoscope, Globe, DollarSign } from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
  className?: string;
}

export function DoctorCard({ doctor, className }: DoctorCardProps) {
  const availability = doctor.isAvailable
    ? { label: 'Available', variant: 'success' as const }
    : { label: 'Unavailable', variant: 'danger' as const };

  return (
    <Card className={className} hover>
      <CardContent className="flex items-start gap-4">
        <Avatar src={doctor.avatarUrl} name={doctor.name} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                Dr. {doctor.name}
              </h3>
              <div className="flex items-center gap-1 mt-0.5">
                <Stethoscope className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400">{doctor.specialty}</span>
              </div>
            </div>
            <Badge variant={availability.variant} size="sm">
              {availability.label}
            </Badge>
          </div>

          {doctor.qualifications && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {doctor.qualifications}
            </p>
          )}

          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Globe className="h-3 w-3" />
              {doctor.languages?.slice(0, 2).join(', ')}
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-300">
              <DollarSign className="h-3 w-3" />
              {doctor.consultationFee ? formatCurrency(doctor.consultationFee) : 'N/A'}
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {doctor.experience} yrs exp.
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
