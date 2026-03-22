import { create } from 'zustand';
import type { Hospital, HospitalFilters, Favorite, RecentlyViewed } from '@/types';
import api from '@/lib/api';

interface HospitalState {
  hospitals: Hospital[];
  searchResults: Hospital[];
  filters: HospitalFilters;
  favorites: Favorite[];
  recentlyViewed: RecentlyViewed[];
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
  totalCount: number;
  setHospitals: (hospitals: Hospital[]) => void;
  setSearchResults: (results: Hospital[]) => void;
  setFilters: (filters: Partial<HospitalFilters>) => void;
  resetFilters: () => void;
  fetchHospitals: (filters?: HospitalFilters) => Promise<void>;
  fetchFavorites: () => Promise<void>;
  toggleFavorite: (hospitalId: string) => Promise<void>;
  fetchRecentlyViewed: () => Promise<void>;
  addRecentlyViewed: (hospital: Hospital) => void;
  setLoading: (loading: boolean) => void;
  setPagination: (page: number, totalPages: number, total: number) => void;
}

const defaultFilters: HospitalFilters = {
  search: '',
  specialty: '',
  language: '',
  minRating: 0,
  emergencyOnly: false,
  maxDistance: 50,
  sortBy: 'distance',
  page: 1,
  limit: 12,
};

export const useHospitalStore = create<HospitalState>()((set, get) => ({
  hospitals: [],
  searchResults: [],
  filters: defaultFilters,
  favorites: [],
  recentlyViewed: [],
  isLoading: false,
  totalPages: 1,
  currentPage: 1,
  totalCount: 0,

  setHospitals: (hospitals) => set({ hospitals }),
  setSearchResults: (searchResults) => set({ searchResults }),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters, page: newFilters.page || 1 },
    })),

  resetFilters: () => set({ filters: defaultFilters }),

  fetchHospitals: async (filters?: HospitalFilters) => {
    set({ isLoading: true });
    try {
      const params = filters || get().filters;
      const queryParams: Record<string, string | number | boolean> = {};
      if (params.search) queryParams.search = params.search;
      if (params.specialty) queryParams.specialty = params.specialty;
      if (params.language) queryParams.language = params.language;
      if (params.minRating) queryParams.minRating = params.minRating;
      if (params.maxDistance) queryParams.maxDistance = params.maxDistance;
      if (params.emergencyOnly) queryParams.emergencyOnly = params.emergencyOnly;
      if (params.city) queryParams.city = params.city;
      if (params.sortBy) queryParams.sortBy = params.sortBy;
      if (params.page) queryParams.page = params.page;
      if (params.limit) queryParams.limit = params.limit;
      if (params.lat) queryParams.lat = params.lat;
      if (params.lng) queryParams.lng = params.lng;

      const { data: response } = await api.get('/hospitals', { params: queryParams });
      const hospitals = response.data;
      const pagination = response.pagination;

      set({
        hospitals,
        isLoading: false,
        currentPage: pagination?.page || 1,
        totalPages: pagination?.totalPages || 1,
        totalCount: pagination?.total || hospitals.length,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchFavorites: async () => {
    try {
      const { data: response } = await api.get('/users/favorites');
      set({ favorites: response.data });
    } catch (error) {
      throw error;
    }
  },

  toggleFavorite: async (hospitalId: string) => {
    const { favorites } = get();
    const isFavorited = favorites.some((f) => f.hospitalId === hospitalId);

    try {
      if (isFavorited) {
        await api.delete(`/users/favorites/${hospitalId}`);
        set({
          favorites: favorites.filter((f) => f.hospitalId !== hospitalId),
        });
      } else {
        const { data: response } = await api.post(`/users/favorites/${hospitalId}`);
        set({
          favorites: [...favorites, response.data],
        });
      }
    } catch (error) {
      throw error;
    }
  },

  fetchRecentlyViewed: async () => {
    try {
      const { data: response } = await api.get('/users/recently-viewed');
      set({ recentlyViewed: response.data });
    } catch (error) {
      throw error;
    }
  },

  addRecentlyViewed: (hospital) =>
    set((state) => {
      const filtered = state.recentlyViewed.filter((h) => h.hospitalId !== hospital.id);
      const newEntry: RecentlyViewed = {
        id: `temp-${hospital.id}`,
        userId: '',
        hospitalId: hospital.id,
        viewedAt: new Date().toISOString(),
        hospital,
      };
      return { recentlyViewed: [newEntry, ...filtered].slice(0, 10) };
    }),

  setLoading: (isLoading) => set({ isLoading }),
  setPagination: (currentPage, totalPages, totalCount) =>
    set({ currentPage, totalPages, totalCount }),
}));
