'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { OTPInput } from '@/components/auth/OTPInput';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { setToken, setRefreshToken } from '@/lib/auth';
import toast from 'react-hot-toast';

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '';
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async (otp: string) => {
    setIsLoading(true);
    try {
      const { data: response } = await api.post('/auth/verify-otp', { phone, otp });
      const { user, tokens } = response.data;
      setToken(tokens.accessToken);
      setRefreshToken(tokens.refreshToken);
      setUser(user);
      toast.success('Phone verified successfully!');
      router.push('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-gray-900 px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verify your phone</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Enter the 6-digit code sent to <span className="font-medium text-gray-900 dark:text-white">{phone}</span>
        </p>
        <OTPInput onComplete={handleComplete} disabled={isLoading} />
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-gray-400">Loading...</div></div>}>
      <VerifyOTPContent />
    </Suspense>
  );
}
