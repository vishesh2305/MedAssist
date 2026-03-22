'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Map, Grid3X3, ChevronLeft, ChevronRight, MapPin, Locate } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { PageContainer } from '@/components/layout/PageContainer';
import { SearchBar } from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { HospitalCard } from '@/components/hospital/HospitalCard';
import { HospitalFiltersComponent } from '@/components/hospital/HospitalFilters';
import { HospitalMap } from '@/components/hospital/HospitalMap';
import { useHospitals } from '@/hooks/useHospitals';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useHospitalStore } from '@/store/hospitalStore';
import { Building2 as HospitalIcon } from 'lucide-react';

function HospitalsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const geo = useGeolocation();
  const { resetFilters } = useHospitalStore();
  const [geoApplied, setGeoApplied] = useState(false);

  const {
    hospitals,
    isLoading,
    error,
    filters,
    updateFilters,
    totalPages,
    currentPage,
    totalCount,
    nextPage,
    prevPage,
    goToPage,
  } = useHospitals({
    search: initialSearch,
  });

  // When geolocation arrives, update filters with coordinates to fetch nearby hospitals
  useEffect(() => {
    if (geo.latitude && geo.longitude && !geoApplied) {
      setGeoApplied(true);
      updateFilters({
        lat: geo.latitude,
        lng: geo.longitude,
        sortBy: 'distance',
      });
    }
  }, [geo.latitude, geo.longitude, geoApplied]);

  const handleUseMyLocation = () => {
    if (geo.latitude && geo.longitude) {
      updateFilters({
        lat: geo.latitude,
        lng: geo.longitude,
        sortBy: 'distance',
      });
    }
  };

  return (
    <div className="min-h-screen bg-surface-light dark:bg-gray-900">
      <Header />

      <PageContainer>
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Find Hospitals</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isLoading
                  ? 'Searching...'
                  : totalCount > 0
                  ? `${totalCount} hospitals found${geo.latitude ? ' near you' : ''}`
                  : 'Search for hospitals near you'}
              </p>
            </div>
            {geo.latitude && geo.longitude && (
              <button
                onClick={handleUseMyLocation}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 rounded-lg transition-colors"
              >
                <Locate className="h-3.5 w-3.5" />
                Near me
              </button>
            )}
          </div>
          {geo.isLoading && (
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <MapPin className="h-3 w-3 animate-pulse" /> Getting your location...
            </p>
          )}
        </div>

        <div className="flex gap-3 mb-6">
          <SearchBar
            value={filters.search}
            onSearch={(value) => updateFilters({ search: value })}
            placeholder="Search hospitals, specialties, cities..."
            className="flex-1"
            size="lg"
          />
          <div className="flex bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 transition-colors ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid3X3 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-3 transition-colors ${viewMode === 'map' ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Map className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="hidden lg:block w-64 flex-shrink-0">
            <HospitalFiltersComponent
              filters={filters}
              onFilterChange={updateFilters}
              onReset={resetFilters}
              className="sticky top-24"
            />
          </div>

          <div className="flex-1 min-w-0">
            {viewMode === 'map' ? (
              <HospitalMap
                hospitals={hospitals}
                center={geo.latitude && geo.longitude ? [geo.latitude, geo.longitude] : undefined}
                zoom={geo.latitude ? 13 : 3}
                className="h-[600px]"
                userLocation={geo.latitude && geo.longitude ? [geo.latitude, geo.longitude] : undefined}
              />
            ) : (
              <>
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} variant="card" />
                    ))}
                  </div>
                ) : error ? (
                  <EmptyState
                    icon={<HospitalIcon className="h-12 w-12" />}
                    title="Something went wrong"
                    description={error}
                    actionLabel="Try Again"
                    onAction={() => updateFilters({})}
                  />
                ) : hospitals.length === 0 ? (
                  <EmptyState
                    icon={<HospitalIcon className="h-12 w-12" />}
                    title="No hospitals found"
                    description="Try adjusting your search or filters to find more results."
                    actionLabel="Clear Filters"
                    onAction={resetFilters}
                  />
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {hospitals.map((hospital) => (
                        <HospitalCard key={hospital.id} hospital={hospital} />
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-8">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={prevPage}
                          disabled={currentPage <= 1}
                          icon={<ChevronLeft className="h-4 w-4" />}
                        >
                          Previous
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            const page = i + 1;
                            return (
                              <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                                  page === currentPage
                                    ? 'bg-primary-600 text-white'
                                    : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                                }`}
                              >
                                {page}
                              </button>
                            );
                          })}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={nextPage}
                          disabled={currentPage >= totalPages}
                          icon={<ChevronRight className="h-4 w-4" />}
                          iconPosition="right"
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </PageContainer>

      <Footer />
      <MobileNav />
    </div>
  );
}

export default function HospitalsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-gray-400">Loading...</div></div>}>
      <HospitalsContent />
    </Suspense>
  );
}
