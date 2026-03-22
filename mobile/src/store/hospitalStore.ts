import { create } from 'zustand';
import api from '../lib/api';
import { Hospital, HospitalFilters, Review } from '../types';

interface HospitalState {
  hospitals: Hospital[];
  nearbyHospitals: Hospital[];
  favorites: Hospital[];
  recentlyViewed: Hospital[];
  selectedHospital: Hospital | null;
  filters: HospitalFilters;
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;

  fetchHospitals: (reset?: boolean) => Promise<void>;
  fetchNearbyHospitals: (lat: number, lng: number) => Promise<void>;
  fetchHospitalDetail: (id: string) => Promise<void>;
  fetchFavorites: () => Promise<void>;
  toggleFavorite: (hospitalId: string) => Promise<void>;
  setFilters: (filters: Partial<HospitalFilters>) => void;
  clearFilters: () => void;
  addToRecentlyViewed: (hospital: Hospital) => void;
  submitReview: (hospitalId: string, review: { rating: number; title: string; content: string }) => Promise<void>;
  clearError: () => void;
}

export const useHospitalStore = create<HospitalState>((set, get) => ({
  hospitals: [],
  nearbyHospitals: [],
  favorites: [],
  recentlyViewed: [],
  selectedHospital: null,
  filters: {},
  isLoading: false,
  isRefreshing: false,
  isLoadingMore: false,
  error: null,
  page: 1,
  hasMore: true,

  fetchHospitals: async (reset = false) => {
    const { filters, page, hospitals } = get();
    const currentPage = reset ? 1 : page;

    set({
      isLoading: reset && hospitals.length === 0,
      isRefreshing: reset && hospitals.length > 0,
      isLoadingMore: !reset,
      error: null,
    });

    try {
      const params = {
        ...filters,
        page: currentPage,
        limit: 20,
      };

      const response = await api.get('/hospitals', { params });
      const { data, pagination } = response.data;

      set({
        hospitals: reset ? data : [...hospitals, ...data],
        page: currentPage + 1,
        hasMore: pagination ? currentPage < pagination.totalPages : false,
        isLoading: false,
        isRefreshing: false,
        isLoadingMore: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to load hospitals.',
        isLoading: false,
        isRefreshing: false,
        isLoadingMore: false,
      });
    }
  },

  fetchNearbyHospitals: async (lat: number, lng: number) => {
    try {
      const response = await api.get('/hospitals/nearby', {
        params: { latitude: lat, longitude: lng, limit: 10 },
      });
      set({ nearbyHospitals: response.data.data });
    } catch {
      // Silently fail for nearby
    }
  },

  fetchHospitalDetail: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/hospitals/${id}`);
      const hospital = response.data.data;
      set({ selectedHospital: hospital, isLoading: false });
      get().addToRecentlyViewed(hospital);
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to load hospital details.',
        isLoading: false,
      });
    }
  },

  fetchFavorites: async () => {
    try {
      const response = await api.get('/hospitals/favorites');
      set({ favorites: response.data.data });
    } catch {
      // Silently fail
    }
  },

  toggleFavorite: async (hospitalId: string) => {
    const { favorites, hospitals, nearbyHospitals, selectedHospital } = get();
    const isFavorite = favorites.some((h) => h.id === hospitalId);

    try {
      if (isFavorite) {
        await api.delete(`/hospitals/${hospitalId}/favorite`);
        set({
          favorites: favorites.filter((h) => h.id !== hospitalId),
        });
      } else {
        await api.post(`/hospitals/${hospitalId}/favorite`);
        const hospital =
          hospitals.find((h) => h.id === hospitalId) ||
          nearbyHospitals.find((h) => h.id === hospitalId);
        if (hospital) {
          set({ favorites: [...favorites, { ...hospital, isFavorite: true }] });
        }
      }

      set({
        hospitals: hospitals.map((h) =>
          h.id === hospitalId ? { ...h, isFavorite: !isFavorite } : h
        ),
        nearbyHospitals: nearbyHospitals.map((h) =>
          h.id === hospitalId ? { ...h, isFavorite: !isFavorite } : h
        ),
        selectedHospital:
          selectedHospital?.id === hospitalId
            ? { ...selectedHospital, isFavorite: !isFavorite }
            : selectedHospital,
      });
    } catch {
      // Revert on failure handled by UI
    }
  },

  setFilters: (newFilters: Partial<HospitalFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      page: 1,
      hasMore: true,
    }));
  },

  clearFilters: () => {
    set({ filters: {}, page: 1, hasMore: true });
  },

  addToRecentlyViewed: (hospital: Hospital) => {
    set((state) => {
      const filtered = state.recentlyViewed.filter((h) => h.id !== hospital.id);
      return { recentlyViewed: [hospital, ...filtered].slice(0, 10) };
    });
  },

  submitReview: async (hospitalId: string, review) => {
    try {
      const response = await api.post(`/hospitals/${hospitalId}/reviews`, review);
      const newReview: Review = response.data.data;
      set((state) => ({
        selectedHospital: state.selectedHospital
          ? {
              ...state.selectedHospital,
              reviews: [newReview, ...state.selectedHospital.reviews],
              reviewCount: state.selectedHospital.reviewCount + 1,
            }
          : null,
      }));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to submit review.');
    }
  },

  clearError: () => set({ error: null }),
}));
