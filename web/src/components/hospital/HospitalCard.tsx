'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, MapPin, Globe, AlertTriangle, Star } from 'lucide-react';
import type { Hospital } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { cn, formatDistance, getPriceRangeLabel } from '@/lib/utils';
import { useHospitalStore } from '@/store/hospitalStore';
import { motion } from 'framer-motion';

interface HospitalCardProps {
  hospital: Hospital;
  className?: string;
}

export function HospitalCard({ hospital, className }: HospitalCardProps) {
  const { favorites, toggleFavorite } = useHospitalStore();
  const isFavorite = favorites.some((f) => f.hospitalId === hospital.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/hospitals/${hospital.id}`}>
        <div
          className={cn(
            'group bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300',
            className
          )}
        >
          {/* Image */}
          <div className="relative h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
            {hospital.coverImage || hospital.images?.[0] ? (
              <img
                src={hospital.coverImage || hospital.images[0]}
                alt={hospital.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                <HospitalIcon className="h-12 w-12" />
              </div>
            )}

            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(hospital.id);
              }}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-sm hover:scale-110 transition-transform"
            >
              <Heart
                className={cn(
                  'h-4 w-4',
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                )}
              />
            </button>

            {/* Emergency Badge */}
            {hospital.isEmergencyCapable && (
              <div className="absolute top-3 left-3">
                <Badge variant="danger" size="sm">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  24/7 Emergency
                </Badge>
              </div>
            )}

            {/* Price Range */}
            {hospital.isEmergencyCapable && (
              <div className="absolute bottom-3 left-3">
                <span className="px-2 py-1 rounded-md bg-red-500/90 text-xs font-semibold text-white">
                  24/7 Emergency
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {hospital.name}
              </h3>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {hospital.rating?.toFixed(1) || 'N/A'}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({hospital.reviewCount || 0})
                </span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-3">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="line-clamp-1">
                {hospital.city}, {hospital.country}
              </span>
              {hospital.distance !== undefined && (
                <span className="ml-auto text-xs font-medium text-primary-600 dark:text-primary-400 flex-shrink-0">
                  {formatDistance(hospital.distance)}
                </span>
              )}
            </div>

            {/* Languages */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {hospital.languages?.slice(0, 3).map((lang) => (
                <Badge key={lang} variant="info" size="sm">
                  {lang}
                </Badge>
              ))}
              {hospital.languages?.length > 3 && (
                <Badge variant="default" size="sm">
                  +{hospital.languages.length - 3}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function HospitalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1" />
      <path d="M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" />
    </svg>
  );
}
