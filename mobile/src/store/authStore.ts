import { create } from 'zustand';
import api from '../lib/api';
import { setTokens, clearTokens, getAccessToken } from '../lib/auth';
import { User, LoginCredentials, SignupData, AuthTokens } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  initialize: () => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithPhone: (phone: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  verifyOTP: (email: string, code: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  initialize: async () => {
    try {
      const token = await getAccessToken();
      if (token) {
        const response = await api.get('/auth/me');
        set({
          user: response.data.data,
          isAuthenticated: true,
          isInitialized: true,
        });
      } else {
        set({ isInitialized: true });
      }
    } catch {
      await clearTokens();
      set({ isInitialized: true, isAuthenticated: false, user: null });
    }
  },

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<{ data: { user: User; tokens: AuthTokens } }>(
        '/auth/login',
        credentials
      );
      const { user, tokens } = response.data.data;
      await setTokens(tokens);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  loginWithPhone: async (phone: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/auth/phone-login', { phone });
      set({ isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send verification code.';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  signup: async (data: SignupData) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/auth/register', data);
      set({ isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  verifyOTP: async (email: string, code: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post<{ data: { user: User; tokens: AuthTokens } }>(
        '/auth/verify-otp',
        { email, code }
      );
      const { user, tokens } = response.data.data;
      await setTokens(tokens);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Invalid verification code.';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  forgotPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/auth/forgot-password', { email });
      set({ isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send reset email.';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  resetPassword: async (email: string, code: string, newPassword: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/auth/reset-password', { email, code, newPassword });
      set({ isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to reset password.';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Continue logout even on API failure
    }
    await clearTokens();
    set({ user: null, isAuthenticated: false, error: null });
  },

  updateProfile: async (data: Partial<User>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch<{ data: User }>('/auth/profile', data);
      set({ user: response.data.data, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update profile.';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  refreshUser: async () => {
    try {
      const response = await api.get<{ data: User }>('/auth/me');
      set({ user: response.data.data });
    } catch {
      // Silently fail
    }
  },

  clearError: () => set({ error: null }),
}));
