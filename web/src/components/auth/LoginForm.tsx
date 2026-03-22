'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const phoneSchema = z.object({
  phone: z.string().min(10, 'Please enter a valid phone number'),
});

type EmailFormData = z.infer<typeof emailSchema>;
type PhoneFormData = z.infer<typeof phoneSchema>;

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [isLoading, setIsLoading] = useState(false);

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
  });

  const onEmailSubmit = async (data: EmailFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      router.push('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const onPhoneSubmit = async (data: PhoneFormData) => {
    setIsLoading(true);
    try {
      // Send OTP request
      const api = (await import('@/lib/api')).default;
      await api.post('/auth/login-phone', { phone: data.phone });
      toast.success('OTP sent to your phone');
      router.push(`/verify-otp?phone=${encodeURIComponent(data.phone)}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="text-center mb-8">
        <div className="h-12 w-12 rounded-xl bg-primary-600 flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-lg">M+</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Sign in to access your medical assistance account
        </p>
      </div>

      {/* Toggle Method */}
      <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-6">
        <button
          onClick={() => setLoginMethod('email')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${
            loginMethod === 'email'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <Mail className="h-4 w-4" />
          Email
        </button>
        <button
          onClick={() => setLoginMethod('phone')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${
            loginMethod === 'phone'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <Phone className="h-4 w-4" />
          Phone
        </button>
      </div>

      {loginMethod === 'email' ? (
        <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            icon={<Mail className="h-4 w-4" />}
            error={emailForm.formState.errors.email?.message}
            {...emailForm.register('email')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            icon={<Lock className="h-4 w-4" />}
            error={emailForm.formState.errors.password?.message}
            {...emailForm.register('password')}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" fullWidth isLoading={isLoading} size="lg">
            Sign In
          </Button>
        </form>
      ) : (
        <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+1 234 567 8900"
            icon={<Phone className="h-4 w-4" />}
            error={phoneForm.formState.errors.phone?.message}
            {...phoneForm.register('phone')}
          />

          <Button type="submit" fullWidth isLoading={isLoading} size="lg">
            Send OTP
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Do not have an account?{' '}
        <Link
          href="/signup"
          className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
