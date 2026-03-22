'use client';

import React, { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { HospitalFilters as Filters } from '@/types';
import { cn } from '@/lib/utils';

interface HospitalFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
  onReset: () => void;
  className?: string;
}

const specialties = [
  { value: '', label: 'All Specialties' },
  { value: 'general', label: 'General Medicine' },
  { value: 'cardiology', label: 'Cardiology' },
  { value: 'orthopedics', label: 'Orthopedics' },
  { value: 'dermatology', label: 'Dermatology' },
  { value: 'pediatrics', label: 'Pediatrics' },
  { value: 'dentistry', label: 'Dentistry' },
  { value: 'ophthalmology', label: 'Ophthalmology' },
  { value: 'neurology', label: 'Neurology' },
  { value: 'oncology', label: 'Oncology' },
];

const languages = [
  'English', 'Spanish', 'French', 'German', 'Arabic', 'Hindi', 'Mandarin', 'Japanese', 'Portuguese', 'Russian',
];

const sortOptions = [
  { value: 'distance', label: 'Nearest First' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price', label: 'Lowest Price' },
  { value: 'name', label: 'Name A-Z' },
];

export function HospitalFiltersComponent({ filters, onFilterChange, onReset, className }: HospitalFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    specialty: true,
    languages: true,
    price: true,
    rating: true,
    distance: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const activeFilterCount = [
    filters.specialty,
    filters.language,
    filters.minRating,
    filters.emergencyOnly,
  ].filter(Boolean).length;

  const toggleLanguage = (lang: string) => {
    onFilterChange({ language: filters.language === lang ? undefined : lang });
  };

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700', className)}>
      {/* Mobile Toggle */}
      <button
        className="w-full flex items-center justify-between p-4 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="info" size="sm">{activeFilterCount}</Badge>
          )}
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      <div className={cn('lg:block', isOpen ? 'block' : 'hidden')}>
        <div className="p-4 space-y-5">
          {/* Sort */}
          <div>
            <Select
              label="Sort By"
              options={sortOptions}
              value={filters.sortBy || 'distance'}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as Filters['sortBy'] })}
            />
          </div>

          {/* Specialty */}
          <div>
            <button
              onClick={() => toggleSection('specialty')}
              className="flex items-center justify-between w-full text-sm font-medium text-gray-900 dark:text-white mb-2"
            >
              Specialty
              {expandedSections.specialty ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {expandedSections.specialty && (
              <Select
                options={specialties}
                value={filters.specialty || ''}
                onChange={(e) => onFilterChange({ specialty: e.target.value })}
              />
            )}
          </div>

          {/* Languages */}
          <div>
            <button
              onClick={() => toggleSection('languages')}
              className="flex items-center justify-between w-full text-sm font-medium text-gray-900 dark:text-white mb-2"
            >
              Languages
              {expandedSections.languages ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {expandedSections.languages && (
              <div className="flex flex-wrap gap-1.5">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => toggleLanguage(lang)}
                    className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
                      filters.language === lang
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                    )}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div>
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full text-sm font-medium text-gray-900 dark:text-white mb-2"
            >
              Price Range
              {expandedSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {expandedSections.price && (
              <div className="flex gap-2">
                {['budget', 'moderate', 'premium'].map((range) => (
                  <button
                    key={range}
                    onClick={() => onFilterChange({ city: (filters as any).priceRange === range ? undefined : range } as any)}
                    className={cn(
                      'flex-1 py-2 rounded-lg text-xs font-medium transition-colors text-center',
                      (filters as any).priceRange === range
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400'
                    )}
                  >
                    {range === 'budget' ? '$' : range === 'moderate' ? '$$' : '$$$'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Minimum Rating */}
          <div>
            <button
              onClick={() => toggleSection('rating')}
              className="flex items-center justify-between w-full text-sm font-medium text-gray-900 dark:text-white mb-2"
            >
              Minimum Rating
              {expandedSections.rating ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {expandedSections.rating && (
              <div className="flex gap-1.5">
                {[0, 3, 3.5, 4, 4.5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => onFilterChange({ minRating: rating })}
                    className={cn(
                      'flex-1 py-2 rounded-lg text-xs font-medium transition-colors text-center',
                      filters.minRating === rating
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400'
                    )}
                  >
                    {rating === 0 ? 'All' : `${rating}+`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Distance Range */}
          <div>
            <button
              onClick={() => toggleSection('distance')}
              className="flex items-center justify-between w-full text-sm font-medium text-gray-900 dark:text-white mb-2"
            >
              Max Distance
              {expandedSections.distance ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {expandedSections.distance && (
              <div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={filters.maxDistance || 50}
                  onChange={(e) => onFilterChange({ maxDistance: parseInt(e.target.value) })}
                  className="w-full accent-primary-600"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>1 km</span>
                  <span className="font-medium">{filters.maxDistance || 50} km</span>
                  <span>100 km</span>
                </div>
              </div>
            )}
          </div>

          {/* Emergency Only Toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.emergencyOnly || false}
              onChange={(e) => onFilterChange({ emergencyOnly: e.target.checked })}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Emergency services only</span>
          </label>

          {/* Reset */}
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" fullWidth onClick={onReset} icon={<X className="h-3 w-3" />}>
              Clear all filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
