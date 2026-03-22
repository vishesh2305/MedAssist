import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import api from '@/lib/api';
import { setToken, setRefreshToken, clearAuth, getToken } from '@/lib/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithPhone: (phone: string) => Promise<{ verify: (otp: string) => Promise<void> }>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  fetchProfile: () => Promise<void>;
  setUser: (user: User) => void;
  initialize: () => Promise<void>;
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  nationality?: string;
  preferredLanguage?: string;
  travelStatus?: 'TOURIST' | 'LOCAL';
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isInitialized: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const { data: response } = await api.post('/auth/login', { email, password });
          const { user, tokens } = response.data;
          setToken(tokens.accessToken);
          setRefreshToken(tokens.refreshToken);
          set({ user, token: tokens.accessToken, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      loginWithPhone: async (phone: string) => {
        set({ isLoading: true });
        try {
          await api.post('/auth/login-phone', { phone });
          set({ isLoading: false });

          return {
            verify: async (otp: string) => {
              set({ isLoading: true });
              try {
                const { data: response } = await api.post('/auth/verify-otp', { phone, otp });
                const { user, tokens } = response.data;
                setToken(tokens.accessToken);
                setRefreshToken(tokens.refreshToken);
                set({ user, token: tokens.accessToken, isLoading: false });
              } catch (error) {
                set({ isLoading: false });
                throw error;
              }
            },
          };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      signup: async (signupData: SignupData) => {
        set({ isLoading: true });
        try {
          const { data: response } = await api.post('/auth/signup', signupData);
          const { user, tokens } = response.data;
          setToken(tokens.accessToken);
          setRefreshToken(tokens.refreshToken);
          set({ user, token: tokens.accessToken, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch {
          // Logout even if the API call fails
        } finally {
          clearAuth();
          set({ user: null, token: null });
        }
      },

      updateProfile: async (profileData: Partial<User>) => {
        set({ isLoading: true });
        try {
          const { data: response } = await api.put('/users/profile', profileData);
          set({ user: response.data, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      fetchProfile: async () => {
        try {
          const { data: response } = await api.get('/users/profile');
          set({ user: response.data });
        } catch {
          clearAuth();
          set({ user: null, token: null });
        }
      },

      setUser: (user: User) => set({ user }),

      initialize: async () => {
        const token = getToken();
        if (token) {
          try {
            const { data: response } = await api.get('/users/profile');
            set({ user: response.data, token, isInitialized: true });
          } catch {
            clearAuth();
            set({ user: null, token: null, isInitialized: true });
          }
        } else {
          set({ isInitialized: true });
        }
      },
    }),
    {
      name: 'medassist-auth',
      partialize: (state) => ({ token: state.token }),
    }
  )
);
