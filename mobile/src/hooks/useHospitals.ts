import { useEffect, useCallback } from 'react';
import { useHospitalStore } from '../store/hospitalStore';
import { HospitalFilters } from '../types';

export function useHospitals() {
  const {
    hospitals,
    nearbyHospitals,
    favorites,
    recentlyViewed,
    selectedHospital,
    filters,
    isLoading,
    isRefreshing,
    isLoadingMore,
    error,
    hasMore,
    fetchHospitals,
    fetchNearbyHospitals,
    fetchHospitalDetail,
    fetchFavorites,
    toggleFavorite,
    setFilters,
    clearFilters,
    submitReview,
    clearError,
  } = useHospitalStore();

  const refresh = useCallback(() => {
    fetchHospitals(true);
  }, [fetchHospitals]);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchHospitals(false);
    }
  }, [fetchHospitals, isLoadingMore, hasMore]);

  const updateFilters = useCallback(
    (newFilters: Partial<HospitalFilters>) => {
      setFilters(newFilters);
    },
    [setFilters]
  );

  return {
    hospitals,
    nearbyHospitals,
    favorites,
    recentlyViewed,
    selectedHospital,
    filters,
    isLoading,
    isRefreshing,
    isLoadingMore,
    error,
    hasMore,
    refresh,
    loadMore,
    fetchNearbyHospitals,
    fetchHospitalDetail,
    fetchFavorites,
    toggleFavorite,
    updateFilters,
    clearFilters,
    submitReview,
    clearError,
  };
}
