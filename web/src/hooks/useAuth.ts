'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { isAuthenticated } from '@/lib/auth';

export function useAuth(requireAuth: boolean = false) {
  const router = useRouter();
  const { user, token, isLoading, login, logout, signup, updateProfile, fetchProfile, initialize, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  useEffect(() => {
    if (requireAuth && isInitialized && !token) {
      router.push('/login');
    }
  }, [requireAuth, isInitialized, token, router]);

  return {
    user,
    token,
    isLoading,
    isInitialized,
    isLoggedIn: !!token && isAuthenticated(),
    login,
    logout: () => {
      logout();
      router.push('/');
    },
    signup,
    updateProfile,
    fetchProfile,
  };
}
