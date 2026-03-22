'use client';

import React from 'react';
import type { Hospital } from '@/types';
import { HospitalCard } from '@/components/hospital/HospitalCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Heart } from 'lucide-react';

interface FavoritesListProps {
  hospitals: Hospital[];
  className?: string;
}

export function FavoritesList({ hospitals, className }: FavoritesListProps) {
  if (hospitals.length === 0) {
    return (
      <EmptyState
        icon={<Heart className="h-12 w-12" />}
        title="No favorites yet"
        description="Save hospitals you like by tapping the heart icon on any hospital card."
      />
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className || ''}`}>
      {hospitals.map((hospital) => (
        <HospitalCard key={hospital.id} hospital={hospital} />
      ))}
    </div>
  );
}
