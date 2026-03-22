'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import type { Hospital, HospitalFilters, PaginatedResponse } from '@/types';
import { useHospitalStore } from '@/store/hospitalStore';

export function useHospitals(initialFilters?: Partial<HospitalFilters>) {
  const {
    hospitals,
    setHospitals,
    filters,
    setFilters,
    isLoading,
    setLoading,
    setPagination,
    totalPages,
    currentPage,
    totalCount,
  } = useHospitalStore();
  const [error, setError] = useState<string | null>(null);

  const fetchHospitals = useCallback(async (currentFilters?: HospitalFilters) => {
    setLoading(true);
    setError(null);
    try {
      const params = currentFilters || filters;
      const { data } = await api.get<PaginatedResponse<Hospital>>('/hospitals', { params });
      let allHospitals = data.data || [];

      // If coordinates are available, also fetch from the nearby endpoint for real-time OSM results
      const lat = params.lat || (params as any).latitude;
      const lng = params.lng || (params as any).longitude;
      if (lat && lng) {
        try {
          const { data: nearbyData } = await api.get('/hospitals/nearby', {
            params: { lat, lng, radius: 15000, limit: 30 },
          });
          const osmResults: Hospital[] = (nearbyData.data || [])
            .filter((h: any) => h.source === 'osm')
            .map((h: any) => ({
              id: h.id,
              name: h.name,
              slug: h.id,
              address: h.address || '',
              city: h.city || '',
              country: h.country || '',
              latitude: h.latitude,
              longitude: h.longitude,
              phone: h.phone,
              website: h.website,
              isVerified: false,
              isEmergencyCapable: h.isEmergencyCapable || false,
              availabilityStatus: 'OPEN' as const,
              rating: 0,
              reviewCount: 0,
              images: [],
              languages: [],
              specialties: [],
              createdAt: '',
              updatedAt: '',
              distance: h.distance,
            }));

          // Deduplicate: skip OSM results that are within ~200m of a registered hospital
          const deduped: Hospital[] = [];
          for (const osm of osmResults) {
            const isDuplicate = allHospitals.some((reg) => {
              if (!reg.latitude || !reg.longitude || !osm.latitude || !osm.longitude) return false;
              const distMeters = Math.sqrt(
                Math.pow(reg.latitude - osm.latitude, 2) +
                Math.pow(reg.longitude - osm.longitude, 2)
              ) * 111000;
              return distMeters < 200;
            });
            if (!isDuplicate) {
              deduped.push(osm);
            }
          }

          // Merge: registered hospitals first, then OSM-discovered ones
          allHospitals = [...allHospitals, ...deduped];

          // Re-sort by distance if available
          allHospitals.sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
        } catch {
          // OSM fetch failed, just use registered hospitals
        }
      }

      setHospitals(allHospitals);
      setPagination(
        data.pagination?.page ?? 1,
        data.pagination?.totalPages ?? 1,
        data.pagination?.total ?? allHospitals.length
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch hospitals';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [filters, setHospitals, setLoading, setPagination]);

  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, []);

  useEffect(() => {
    fetchHospitals();
  }, [filters]);

  const updateFilters = (newFilters: Partial<HospitalFilters>) => {
    setFilters(newFilters);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setFilters({ page: currentPage + 1 });
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setFilters({ page: currentPage - 1 });
    }
  };

  const goToPage = (page: number) => {
    setFilters({ page });
  };

  return {
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
    refetch: fetchHospitals,
  };
}
