import { useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { LoginCredentials, SignupData } from '../types';

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    initialize,
    login,
    signup,
    verifyOTP,
    forgotPassword,
    logout,
    updateProfile,
    clearError,
  } = useAuthStore();

  const handleLogin = useCallback(
    async (credentials: LoginCredentials) => {
      await login(credentials);
    },
    [login]
  );

  const handleSignup = useCallback(
    async (data: SignupData) => {
      await signup(data);
    },
    [signup]
  );

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  return {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    initialize,
    login: handleLogin,
    signup: handleSignup,
    verifyOTP,
    forgotPassword,
    logout: handleLogout,
    updateProfile,
    clearError,
  };
}
