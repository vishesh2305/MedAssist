'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');

  useEffect(() => {
    if (token) {
      api.post('/auth/verify-email', { token })
        .then(() => setStatus('success'))
        .catch(() => setStatus('error'));
    }
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-gray-900 px-4">
        <div className="text-center max-w-sm">
          <div className="h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check your email</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            We have sent a verification link to your email address. Please click the link to activate your account.
          </p>
          <Link href="/login">
            <Button variant="outline">Go to Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-gray-900 px-4">
      <div className="text-center max-w-sm">
        {status === 'pending' && (
          <>
            <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Mail className="h-8 w-8 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Verifying your email...</h1>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Email verified!</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Your account is now active. You can sign in.</p>
            <Link href="/login"><Button>Sign In</Button></Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verification failed</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">The link may have expired or is invalid.</p>
            <Link href="/login"><Button variant="outline">Go to Sign In</Button></Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-gray-400">Loading...</div></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
