'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import type { Hospital } from '@/types';
import { useHospitalStore } from '@/store/hospitalStore';

export function useHospital(id: string) {
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addRecentlyViewed, hospitals } = useHospitalStore();

  useEffect(() => {
    if (!id) return;

    // For OSM hospitals, use cached data from the store (already fetched in list view)
    if (id.startsWith('osm-')) {
      const cached = hospitals.find((h) => h.id === id);
      if (cached) {
        setHospital(cached);
        setIsLoading(false);
        return;
      }
      // If not cached, try fetching from API (may fail for OSM IDs)
    }

    const fetchHospital = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data: response } = await api.get(`/hospitals/${id}`);
        const hospitalData = response.data || response;
        setHospital(hospitalData);
        if (!id.startsWith('osm-')) {
          addRecentlyViewed(hospitalData);
        }
      } catch (err: any) {
        const message = err?.response?.data?.message || err?.message || 'Failed to fetch hospital details';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHospital();
  }, [id]);

  return { hospital, isLoading, error };
}
